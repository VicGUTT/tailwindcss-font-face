import fs from 'fs';
import path from 'path';
// @ts-ignore
import cssMatcher from 'jest-matcher-css';
import { HandlerOptions } from '../src/interfaces';
import { handlerArgument } from '../src/types';
import generateCss from '../src/utils/generateCss';

const plugin = require('../src');

const toCss = async (fontFaces: handlerArgument, options: HandlerOptions = {}) => {
    return await generateCss(
        plugin(options),
        {
            // @ts-ignore
            theme: {
                // @ts-ignore
                fontFace: fontFaces,
            },
        },
        { base: true, components: false, utilities: false }
    );
};

expect.extend({
    toMatchCss: cssMatcher,
});

describe('index', () => {
    it('is a TailwindCSS plugin function', () => {
        expect(typeof plugin === 'function').toEqual(true);
        expect(typeof plugin().handler === 'function').toEqual(true);
    });

    test('testing a small sample', async () => {
        const actual = await toCss({
            fontFamily: 'Yolo',
            src: '/example.dev',
        });

        // @ts-ignore
        expect(actual).toMatchCss(`
            @font-face {
                font-family: 'Yolo';
                src: url('/example.dev')
            }
        `);
    });

    test('[FontFace[]]: it works', async () => {
        const actual = await toCss([
            {
                fontFamily: 'Yolo',
                src: '/yolo.dev',
            },
            {
                fontFamily: 'Hello',
                src: { url: '/hello/dev/font.woff', format: 'auto' },
            },
            {
                fontFamily: 'Hello',
                src: { url: '/hello/dev/font.woff', format: 'svg' },
            },
            {
                fontFamily: 'Example',
                src: [{ url: 'http://example.com' }, { url: 'https://example.dev/font.ttf' }],
            },
            {
                fontFamily: 'Yo',
                src: ['/yo.com', { url: '/yo.dev' }],
            },
            {
                fontFamily: 'Konnichi wa',
                fontWeight: [500, 'black'],
                src: [
                    { url: '/Konnichi-wa.ja/.woff', format: 'auto' },
                    { url: '/Konnichi-wa.ja/.woff2', format: 'auto' },
                    { url: '/Konnichi-wa.ja/.yolo', format: 'auto' },
                ],

                ascentOverride: 777,
                descentOverride: 'normal',
                fontDisplay: 'fallback',
                fontStretch: [50, 200],
                fontStyle: ['oblique', 90, 189],
                fontVariant: 'abc',
                lineGapOverride: 999,
                unicodeRange: ['U+0102-0103', 'U+0110-0111', 'U+0128-0129'],

                // @ts-ignore
                randomProperty: 'random-value',
            },
        ]);

        // @ts-ignore
        expect(actual).toMatchCss(`
            @font-face {
                font-family: 'Yolo';
                src: url('/yolo.dev')
            }

            @font-face {
                font-family: 'Hello';
                src: url('/hello/dev/font.woff') format('woff')
            }

            @font-face {
                font-family: 'Hello';
                src: url('/hello/dev/font.woff') format('svg')
            }

            @font-face {
                font-family: 'Example';
                src: url('http://example.com'), url('https://example.dev/font.ttf')
            }

            @font-face {
                font-family: 'Yo';
                src: url('/yo.com'), url('/yo.dev')
            }

            @font-face {
                font-family: 'Konnichi wa';
                font-weight: 500 900;
                src: url('/Konnichi-wa.ja/.woff') format('woff'),
                    url('/Konnichi-wa.ja/.woff2') format('woff2'),
                    url('/Konnichi-wa.ja/.yolo');
                ascent-override: 777%;
                descent-override: normal;
                font-display: fallback;
                font-stretch: 50% 200%;
                font-style: oblique 90deg 189deg;
                font-variant: abc;
                line-gap-override: 999%;
                unicode-range: U+0102-0103, U+0110-0111, U+0128-0129;
                random-property: random-value
            }
        `);
    });

    it('[Fontface Providers]: it works', async () => {
        const tempDir = path.resolve(`${__dirname}/../temp`);
        const fontDir = tempDir;

        let actual: string;

        const expected = `
            @font-face {
                font-family: 'Mulish';
                font-style: italic;
                font-weight: 200;
                font-display: swap;
                src: url('/the/fontDir/path/Mulish-italic-200-5aed4cae460934056bed781755d27e4f.woff2') format('woff2');
                unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB
            }

            @font-face {
                font-family: 'Mulish';
                font-style: italic;
                font-weight: 200;
                font-display: swap;
                src: url('/the/fontDir/path/Mulish-italic-200-d3fa5350110dae95e8b345cdd17fff47.woff2') format('woff2');
                unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF
            }

            @font-face {
                font-family: 'Mulish';
                font-style: italic;
                font-weight: 200;
                font-display: swap;
                src: url('/the/fontDir/path/Mulish-italic-200-4014fdc7f2803eafaf62a8a25b4cc6cf.woff2') format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD
            }

            @font-face {
                font-family: 'Mulish';
                font-style: normal;
                font-weight: 200;
                font-display: swap;
                src: url('/the/fontDir/path/Mulish-normal-200-a92506f0a66e014d41e9315248f2d01d.woff2') format('woff2');
                unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB
            }

            @font-face {
                font-family: 'Mulish';
                font-style: normal;
                font-weight: 200;
                font-display: swap;
                src: url('/the/fontDir/path/Mulish-normal-200-427e47bed0f7adca83c757ef78b2aee6.woff2') format('woff2');
                unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF
            }

            @font-face {
                font-family: 'Mulish';
                font-style: normal;
                font-weight: 200;
                font-display: swap;
                src: url('/the/fontDir/path/Mulish-normal-200-2f54b7d8c661b36118cab09855de2cdc.woff2') format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD
            }
        `;

        const clearDir = () => {
            if (fs.existsSync(fontDir)) {
                fs.rmSync(fontDir, { recursive: true, force: true });
            }
        };

        const makeAssertions = (filesShouldExist = true) => {
            // @ts-ignore
            expect(actual).toMatchCss(expected);

            const filePaths = [
                `${fontDir}/Mulish-italic-200-5aed4cae460934056bed781755d27e4f.woff2`,
                `${fontDir}/Mulish-italic-200-d3fa5350110dae95e8b345cdd17fff47.woff2`,
                `${fontDir}/Mulish-italic-200-4014fdc7f2803eafaf62a8a25b4cc6cf.woff2`,
                `${fontDir}/Mulish-normal-200-a92506f0a66e014d41e9315248f2d01d.woff2`,
                `${fontDir}/Mulish-normal-200-427e47bed0f7adca83c757ef78b2aee6.woff2`,
                `${fontDir}/Mulish-normal-200-2f54b7d8c661b36118cab09855de2cdc.woff2`,
            ];

            filePaths.forEach((filePath) => {
                expect(fs.existsSync(filePath)).toEqual(filesShouldExist);

                if (filesShouldExist) {
                    expect((fs.statSync(filePath).size / 1024) > 5).toEqual(true); // eslint-disable-line
                }
            });
        };

        // As "string"

        clearDir();

        actual = await toCss('https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200;1,200&display=swap', {
            fontDir: fontDir,
            fontPath: '/the/fontDir/path',
        });

        makeAssertions();

        // As "object"

        clearDir();

        actual = await toCss({
            url: 'https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200;1,200&display=swap',
            fontDir: fontDir,
            fontPath: '/the/fontDir/path',
        });

        makeAssertions();

        // As "string[]"

        clearDir();

        actual = await toCss(['https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200;1,200&display=swap'], {
            fontDir: fontDir,
            fontPath: '/the/fontDir/path',
        });

        makeAssertions();

        // As "object[]"

        clearDir();

        const fontFaceProvider = [
            {
                url: 'https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200;1,200&display=swap',
                fontDir: fontDir,
                fontPath: '/the/fontDir/path',
            },
        ];

        actual = await toCss(fontFaceProvider);

        makeAssertions();

        // Results are cached

        const savedPath = `${tempDir}/saved-content.json`;
        const savedContent = JSON.parse(fs.readFileSync(savedPath, 'utf8'));

        clearDir();

        fs.mkdirSync(tempDir, { recursive: true });
        fs.writeFileSync(savedPath, JSON.stringify(savedContent));

        actual = await toCss(fontFaceProvider);

        makeAssertions(false);

        // Setting a custom request "user-agent" header

        actual = await toCss({
            url: 'https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200;1,200&display=swap',
            fontDir: fontDir,
            fontPath: '/the/fontDir/path',
            request: {
                headers: {
                    'User-Agent': 'custom value',
                },
            },
        });

        // @ts-ignore
        expect(actual).toMatchCss(`
            @font-face {
                font-family: 'Mulish';
                font-style: italic;
                font-weight: 200;
                font-display: swap;
                src: url('/the/fontDir/path/Mulish-italic-200-b96bb1e6727bb1c10705054f2b14b625.ttf') format('truetype')
            }

            @font-face {
                font-family: 'Mulish';
                font-style: normal;
                font-weight: 200;
                font-display: swap;
                src: url('/the/fontDir/path/Mulish-normal-200-596e2e481d853a4d2eb7e6a767eddd5f.ttf') format('truetype')
            }
        `);

        const filePaths = [
            `${fontDir}/Mulish-italic-200-b96bb1e6727bb1c10705054f2b14b625.ttf`,
            `${fontDir}/Mulish-normal-200-596e2e481d853a4d2eb7e6a767eddd5f.ttf`,
        ];

        filePaths.forEach((filePath) => {
            expect(fs.existsSync(filePath)).toEqual(true);
            expect((fs.statSync(filePath).size / 1024) > 50).toEqual(true); // eslint-disable-line
        });
    });
});
