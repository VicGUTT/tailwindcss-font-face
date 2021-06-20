import fs from 'fs';
import request from 'sync-request';
import FontsProviderException from '../Exceptions/FontsProviderException';
import { FontFace, FontFaceProvider, FontFaceSrc, FontFaceSrcMeta, HandlerOptions } from '../interfaces';
import FontFaceParser from '../Parsers/FontFaceParser';
import makeFontFaceSrcFileName from '../utils/makeFontFaceSrcFileName';

export default abstract class AbstractFontsProvider {
    protected readonly fontFaceProvider: FontFaceProvider;
    protected readonly options: HandlerOptions;
    protected readonly fontDir: string;
    protected readonly fontPath: string;

    protected constructor(fontFaceProvider: FontFaceProvider, options: HandlerOptions = {}) {
        this.fontFaceProvider = fontFaceProvider;
        this.options = options;

        this.fontDir = this.fontFaceProvider.fontDir || this.options?.fontDir || '';
        this.fontPath = this.fontFaceProvider.fontPath || this.options?.fontPath || '';

        if (!this.fontDir.trim().length) {
            throw FontsProviderException.undefinedFontDir(this.fontFaceProvider);
        }

        if (!this.fontPath.trim().length) {
            throw FontsProviderException.undefinedFontPath(this.fontFaceProvider);
        }
    }

    protected abstract canHandle(fontFaceProvider: FontFaceProvider): boolean;

    protected abstract handle(fontFaceProvider: FontFaceProvider, options: HandlerOptions): FontFace[];

    protected go(): FontFace[] {
        const css = this.getCss();
        const fontFaces = this.parseCss(css);

        return fontFaces.map((fontFace) => this.handleFontFace(fontFace));
    }

    protected getCss(): string {
        return this.request(this.fontFaceProvider.url) as string;
    }

    protected parseCss(css: string): FontFace[] {
        return FontFaceParser.parse(css);
    }

    protected handleFontFace(fontFace: FontFace): FontFace {
        const sources = (fontFace.src as FontFaceSrc[]).map((src) => {
            const meta = this.saveFontFile(src, fontFace);

            return {
                ...src,
                url: `${this.fontPath}/${meta.fileName}`,
            };
        });

        return {
            ...fontFace,
            src: sources,
        };
    }

    protected saveFontFile(src: FontFaceSrc, fontFace: FontFace): FontFaceSrcMeta {
        const meta = this.getFontFaceSrcMeta(src, fontFace);

        this.fetchFontFile(meta);

        return meta;
    }

    protected getFontFaceSrcMeta(src: FontFaceSrc, fontFace: FontFace): FontFaceSrcMeta {
        let url = src.url;

        try {
            new URL(src.url);
        } catch (error) {
            // The url is probably relative to the origin.
            const origin = new URL(this.fontFaceProvider.url).origin;

            url = `${origin}//${url.replace(/^(\/)+/g, '')}`;
        }

        return {
            url,
            // format: src.format,
            fileName: makeFontFaceSrcFileName(src, fontFace),
            // urlHash: hash(src.url),
            // extension: determineFontFaceSrcExtension(src),
            // fontFamily: fontFace.fontFamily,
            // fontWeight: fontFace.fontWeight,
            // fontStyle: fontFace.fontStyle,
        };
    }

    protected fetchFontFile(meta: FontFaceSrcMeta) {
        const path = `${this.fontDir}/${meta.fileName}`;

        if (fs.existsSync(path)) {
            return;
        }

        if (!fs.existsSync(this.fontDir)) {
            fs.mkdirSync(this.fontDir, { recursive: true });
        }

        fs.writeFileSync(path, this.request(meta.url, false));
    }

    protected request(url: string, utf8Encoded: boolean = true): string | Buffer {
        try {
            return request('GET', url, this.requestOptions()).getBody((utf8Encoded ? 'utf8' : null) as string);
        } catch (error) {
            throw FontsProviderException.failedRequest(url, error);
        }
    }

    protected requestOptions() {
        return {
            maxRedirects: 5,
            timeout: 5000,
            retry: true,
            maxRetries: 3,
            retryDelay: 1,
            ...(this.fontFaceProvider.request || {}),
            headers: this.requestHeaders(),
        };
    }

    protected requestHeaders() {
        return {
            'user-agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
            ...(this.fontFaceProvider.request?.headers || {}),
        };
    }
}
