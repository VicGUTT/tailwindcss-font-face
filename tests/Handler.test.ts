import http from 'http';
import path from 'path';
import fs from 'fs';
import Handler from '../src/Handler';
import { FontFace, FontFaceSrc, HandlerOptions } from '../src/interfaces';
import { handlerArgument } from '../src/types';
import hash from '../src/utils/hash';

// const dd = (...args: any) => {
//     console.log(...args.map(JSON.stringify));

//     throw new Error('********************* Debuging......');
// };

const clone = <T>(item: T): T => {
    return JSON.parse(JSON.stringify(item));
};

const makeFontFaceTestObject = (fontFace: handlerArgument) => ({
    get fontFace(): handlerArgument {
        return fontFace;
    },
    get fontFaces(): handlerArgument {
        return [this.fontFace, this.fontFace] as handlerArgument;
    },
});

const getFixtureContent = (fileName: string) => {
    return fs.readFileSync(path.resolve(`${__dirname}/__Fixtures/${fileName}`), 'utf8');
};

// @ts-ignore
const makeServer = () => {
    const server = http.createServer((request, response) => {
        if (request.url === '/css') {
            response
                .writeHead(200, { 'Content-Type': 'text/css', 'access-control-allow-origin': '*' })
                .write(getFixtureContent(`provider-${hash('http://localhost:7777/css')}.css`));
        }

        if (request.url?.includes('/font')) {
            response
                .writeHead(200, { 'Content-Type': 'text/plain', 'access-control-allow-origin': '*' })
                .write(getFixtureContent('dummy-font-file.txt'));
        }

        response.end();
    });

    server.listen(7777);

    return () => server.close();
};

describe('Handler', () => {
    /* Handling "FontFace | FontFace[]"
    ------------------------------------------------*/

    test('[FontFace | FontFace[]]: src -> string', () => {
        const actual = makeFontFaceTestObject({
            fontFamily: 'Yolo',
            src: '/example.com',
        });

        const expected = makeFontFaceTestObject({
            fontFamily: 'Yolo',
            src: [{ url: '/example.com' }],
        });

        expect(Handler.make(actual.fontFace).handle()).toEqual([expected.fontFace]);
        expect(Handler.make(actual.fontFaces).handle()).toEqual(expected.fontFaces);
    });

    test('[FontFace | FontFace[]]: src -> string[]', () => {
        const actual = makeFontFaceTestObject({
            fontFamily: 'Yolo',
            src: ['/example.com', '/example.dev'],
        });

        const expected = makeFontFaceTestObject({
            fontFamily: 'Yolo',
            src: [{ url: '/example.com' }, { url: '/example.dev' }],
        });

        expect(Handler.make(actual.fontFace).handle()).toEqual([expected.fontFace]);
        expect(Handler.make(actual.fontFaces).handle()).toEqual(expected.fontFaces);
    });

    test('[FontFace | FontFace[]]: src -> [string, object]', () => {
        const actual = makeFontFaceTestObject({
            fontFamily: 'Yolo',
            src: ['/example.com', { url: '/example.dev' }],
        });

        const expected = makeFontFaceTestObject({
            fontFamily: 'Yolo',
            src: [{ url: '/example.com' }, { url: '/example.dev' }],
        });

        expect(Handler.make(actual.fontFace).handle()).toEqual([expected.fontFace]);
        expect(Handler.make(actual.fontFaces).handle()).toEqual(expected.fontFaces);
    });

    test('[FontFace | FontFace[]]: src -> object, format -> specified', () => {
        const actual = makeFontFaceTestObject({
            fontFamily: 'Yolo',
            src: { url: '/example.com/.svg', format: 'woff' },
        });

        const expected = makeFontFaceTestObject({
            fontFamily: 'Yolo',
            src: [{ url: '/example.com/.svg', format: 'woff' }],
        });

        expect(Handler.make(actual.fontFace).handle()).toEqual([expected.fontFace]);
        expect(Handler.make(actual.fontFaces).handle()).toEqual(expected.fontFaces);
    });

    test('[FontFace | FontFace[]]: src -> object, format -> auto, extension -> invalid', () => {
        const actual = makeFontFaceTestObject({
            fontFamily: 'Yolo',
            src: { url: '/example.com/.nope', format: 'auto' },
        });

        const expected = makeFontFaceTestObject({
            fontFamily: 'Yolo',
            src: [{ url: '/example.com/.nope' }],
        });

        expect(Handler.make(actual.fontFace).handle()).toEqual([expected.fontFace]);
        expect(Handler.make(actual.fontFaces).handle()).toEqual(expected.fontFaces);
    });

    test('[FontFace | FontFace[]]: src -> object, format -> specified, extension -> invalid', () => {
        const actual = makeFontFaceTestObject({
            fontFamily: 'Yolo',
            src: { url: '/example.com/.nope', format: 'svg' },
        });

        const expected = makeFontFaceTestObject({
            fontFamily: 'Yolo',
            src: [{ url: '/example.com/.nope', format: 'svg' }],
        });

        expect(Handler.make(actual.fontFace).handle()).toEqual([expected.fontFace]);
        expect(Handler.make(actual.fontFaces).handle()).toEqual(expected.fontFaces);
    });

    test('[FontFace | FontFace[]]: src -> object, format -> auto, extensions -> valid', () => {
        ['embedded-opentype', 'woff2', 'woff', 'truetype', 'svg'].forEach((format) => {
            const extension = format !== 'embedded-opentype' ? (format !== 'truetype' ? format : 'ttf') : 'eot#iefix';

            const actual = makeFontFaceTestObject({
                fontFamily: 'Yolo',
                src: { url: `/example.com/.${extension}`, format: 'auto' },
            });

            const expected = makeFontFaceTestObject({
                fontFamily: 'Yolo',
                src: [{ url: `/example.com/.${extension}`, format }] as FontFaceSrc[],
            });

            expect(Handler.make(actual.fontFace).handle()).toEqual([expected.fontFace]);
            expect(Handler.make(actual.fontFaces).handle()).toEqual(expected.fontFaces);
        });
    });

    test('[FontFace | FontFace[]]: testing the passed in options', () => {
        const actual = makeFontFaceTestObject({
            fontFamily: 'Yolo',
            src: { url: '/example.com/.nope', format: 'auto' },
        });

        // Also ensuring fontWeight's common weight names get's translated
        [{ fontDisplay: 'swap' }, { fontWeight: 'thin' }, { fontStyle: 'italic' }].forEach((values) => {
            const expected = makeFontFaceTestObject({
                fontFamily: 'Yolo',
                ...(('fontWeight' in values) ? { fontWeight: 100 } : values) as HandlerOptions, // eslint-disable-line
                src: [{ url: '/example.com/.nope' }],
            });

            const options = { defaultFontFaceRules: { ...values } } as HandlerOptions;

            expect(Handler.make(actual.fontFace).handle(options)).toEqual([expected.fontFace]);
            expect(Handler.make(actual.fontFaces).handle(options)).toEqual(expected.fontFaces);
        });
    });

    test('[FontFace | FontFace[]]: fontWeight -> array, + undefined/random values', () => {
        const actual = makeFontFaceTestObject({
            fontFamily: 'Yolo',
            fontWeight: ['extralight', 300],
            src: '/example.com/.nope',
            // @ts-ignore
            randomProperty: 'random-value',
        });

        const expected = makeFontFaceTestObject({
            fontFamily: 'Yolo',
            fontWeight: [200, 300],
            src: [{ url: '/example.com/.nope' }],
            // @ts-ignore
            randomProperty: 'random-value',
        });

        expect(Handler.make(actual.fontFace).handle()).toEqual([expected.fontFace]);
        expect(Handler.make(actual.fontFaces).handle()).toEqual(expected.fontFaces);
    });

    /* Handling "string | FontFaceProvider | string[] | [string, string, string] | FontFaceProvider[]"
    ------------------------------------------------*/

    const providerUrls = [
        'https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200;1,200&display=swap',
        // 'http://localhost:7777/css',
    ];

    const providerUrl = providerUrls[Math.floor(Math.random() * providerUrls.length)];
    const expected: FontFace[] = JSON.parse(getFixtureContent(`provider-${hash(providerUrl)}.json`));

    const options = {
        fontDir: path.resolve(`${__dirname}/../temp`),
        fontPath: '/some/defined/path/here',
    };

    if (providerUrl.includes('localhost')) {
        const closeServer = makeServer();

        afterAll(closeServer);
    }

    beforeEach(() => {
        if (fs.existsSync(options.fontDir)) {
            fs.rmSync(options.fontDir, { recursive: true, force: true });
        }
    });

    const assertFilesExists = (fontFaces: FontFace[], options: HandlerOptions) => {
        fontFaces.forEach((fontFace) => {
            (fontFace.src as FontFaceSrc[]).forEach((src) => {
                const filePath = src.url.replace(options.fontPath as string, options.fontDir as string);

                expect(fs.existsSync(filePath)).toEqual(true);
            });
        });
    };

    test('[Fontface Providers]: as "url"', () => {
        const actual = makeFontFaceTestObject(providerUrl);

        expect(Handler.make(actual.fontFace).handle(options)).toEqual(expected);
        expect(Handler.make(actual.fontFaces).handle(options)).toEqual([...expected, ...expected]);

        assertFilesExists(expected, options);
    });

    test('[Fontface Providers]: as "[url]"', () => {
        const actual = makeFontFaceTestObject([providerUrl]);

        expect(Handler.make(actual.fontFace).handle(options)).toEqual(expected);
        expect(Handler.make(actual.fontFaces).handle(options)).toEqual([...expected, ...expected]);

        assertFilesExists(expected, options);
    });

    test('[Fontface Providers]: as "[url, url]"', () => {
        const actual = makeFontFaceTestObject([providerUrl, providerUrl]);

        const _expected = [...expected, ...expected];

        expect(Handler.make(actual.fontFace).handle(options)).toEqual(_expected);
        expect(Handler.make(actual.fontFaces).handle(options)).toEqual([..._expected, ..._expected]);

        assertFilesExists(expected, options);
    });

    test('[Fontface Providers]: as "{url}"', () => {
        const actual = makeFontFaceTestObject({ url: providerUrl });

        expect(Handler.make(actual.fontFace).handle(options)).toEqual(expected);
        expect(Handler.make(actual.fontFaces).handle(options)).toEqual([...expected, ...expected]);

        assertFilesExists(expected, options);
    });

    test('[Fontface Providers]: as "{url, fontDir}"', () => {
        const fontDir = `${options.fontDir}/new`;
        const actual = makeFontFaceTestObject({ url: providerUrl, fontDir });

        expect(Handler.make(actual.fontFace).handle(options)).toEqual(expected);
        expect(Handler.make(actual.fontFaces).handle(options)).toEqual([...expected, ...expected]);

        assertFilesExists(expected, { ...options, fontDir });
    });

    test('[Fontface Providers]: as "{url, fontDir, fontPath}"', () => {
        const fontDir = `${options.fontDir}/new/new`;
        const fontPath = '/new/path';
        const actual = makeFontFaceTestObject({ url: providerUrl, fontDir, fontPath });

        const _expected = clone(expected).map((item) => {
            (item.src as FontFaceSrc[]).map((src) => {
                src.url = src.url.replace(options.fontPath, fontPath);

                return src;
            });

            return item;
        });

        expect(Handler.make(actual.fontFace).handle(options)).toEqual(_expected);
        expect(Handler.make(actual.fontFaces).handle(options)).toEqual([..._expected, ..._expected]);

        assertFilesExists(_expected, { fontDir, fontPath });
    });

    test('[Fontface Providers]: as "[{url}, {url}]"', () => {
        const actual = makeFontFaceTestObject([{ url: providerUrl }, { url: providerUrl }]);

        const _expected = [...expected, ...expected];

        expect(Handler.make(actual.fontFace).handle(options)).toEqual(_expected);
        expect(Handler.make(actual.fontFaces).handle(options)).toEqual([..._expected, ..._expected]);

        assertFilesExists(expected, options);
    });

    test('[Fontface Providers]: as "["url", {url}]"', () => {
        const actual = makeFontFaceTestObject([providerUrl, { url: providerUrl }]);

        const _expected = [...expected, ...expected];

        expect(Handler.make(actual.fontFace).handle(options)).toEqual(_expected);
        expect(Handler.make(actual.fontFaces).handle(options)).toEqual([..._expected, ..._expected]);

        assertFilesExists(expected, options);
    });
});
