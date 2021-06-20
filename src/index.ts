import fs from 'fs';
import path from 'path';
// @ts-ignore
import tailwindPlugin from 'tailwindcss/plugin';
import { FontFace, FontFaceSrc, HandlerOptions } from './interfaces';
import Handler from './Handler';
import hash from './utils/hash';

interface paramsObject {
    tempDir: string;
    filePath: string;
    key?: string;
}
interface savedContent {
    key: string | null;
    statements: { '@font-face': FontFace }[] | null;
}

module.exports = tailwindPlugin.withOptions(function(options: HandlerOptions = {}) {
    const tempDir = path.resolve(`${__dirname}/../temp`);
    const params: paramsObject = {
        tempDir,
        filePath: `${tempDir}/saved-content.json`,
    };

    if (!fs.existsSync(params.tempDir)) {
        fs.mkdirSync(params.tempDir, { recursive: true });
    }

    if (!fs.existsSync(params.filePath)) {
        saveContent(params, { key: null, statements: null });
    }

    return function({ addBase, theme }: { addBase: Function; theme: Function }) {
        const saved: savedContent = JSON.parse(fs.readFileSync(params.filePath, 'utf8'));
        const fontFace = theme('fontFace', {});

        params.key = hash({ options, fontFace });

        // eslint-disable-next-line
        if ((params.key === saved.key) && saved.statements) {
            addBase(saved.statements);

            return;
        }

        const statements = Handler.make(fontFace)
            .handle(options)
            .map(prepareFontFace)
            .map((fontFace) => ({ '@font-face': fontFace }));

        addBase(statements);

        saveContent(params, { key: params.key, statements });
    };
});

function prepareFontFace(fontFace: FontFace): FontFace {
    const prepared = Object.entries(fontFace).reduce(
        (acc, [key, value]) => {
            if (key === 'fontFamily') {
                acc[key] = `'${fontFace.fontFamily}'`;
            }

            if (key === 'src') {
                acc[key] = (fontFace.src as FontFaceSrc[])
                    .map((src) => {
                        return `url('${src.url}')` + (src.format ? ` format('${src.format}')` : '');
                    })
                    .join(', ');
            }

            if (['ascentOverride', 'descentOverride', 'lineGapOverride'].includes(key) && typeof value === 'number') {
                // @ts-ignore
                acc[key] = `${value}%`;
            }

            if (key === 'fontStretch' && typeof value === 'number') {
                // @ts-ignore
                acc[key] = `${value}%`;
            }

            if (key === 'fontStretch' && Array.isArray(value)) {
                // @ts-ignore
                acc[key] = value.map((val) => (typeof val === 'number' ? `${val}%` : val)).join(' ');
            }

            if (key === 'fontStyle' && Array.isArray(value)) {
                // @ts-ignore
                acc[key] = value.map((val) => (typeof val === 'number' ? `${val}deg` : val)).join(' ');
            }

            if (key === 'fontWeight' && Array.isArray(value)) {
                // @ts-ignore
                acc[key] = value.join(' ');
            }

            if (key === 'unicodeRange' && Array.isArray(value)) {
                acc[key] = value.join(', ');
            }

            return acc;
        },
        { ...fontFace }
    );

    // debug('prepared', {
    //     fontFace,
    //     prepared,
    // });

    return prepared;
}

function saveContent(params: paramsObject, content: savedContent): void {
    fs.writeFileSync(params.filePath, JSON.stringify(content, null, 4));
}

// function sleep(milliseconds: number): void {
//     const date = Date.now();
//     let currentDate = null;

//     do {
//         currentDate = Date.now();
//     } while (currentDate - date < milliseconds);
// }

// function debug(key: string, content: object): void {
//     if (process.env.NODE_ENV === 'production') {
//         return;
//     }

//     fs.writeFileSync(
//         path.resolve(`${__dirname}/../temp/${key}.json`),
//         JSON.stringify(content, null, 4)
//     );
// }
