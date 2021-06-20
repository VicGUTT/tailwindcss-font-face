import FontsProviderException from './Exceptions/FontsProviderException';
import HandlerException from './Exceptions/HandlerException';
import GoogleFontsProvider from './FontFaceProviders/GoogleFontsProvider';
import DefaultProvider from './FontFaceProviders/DefaultProvider';
import { FontFace, FontFaceProvider, FontFaceSrc, HandlerOptions } from './interfaces';
import { fontFaceEntry, handlerArgument } from './types';
import determineFontFaceSrcFormat from './utils/determineFontFaceSrcFormat';
import translateFontFaceFontWeight from './utils/translateFontFaceFontWeight';

export default class Handler {
    private entries: fontFaceEntry[];
    private options?: HandlerOptions;

    constructor(entries: handlerArgument) {
        this.entries = JSON.parse(JSON.stringify(Array.isArray(entries) ? entries : [entries]));
    }

    static make(entries: handlerArgument): Handler {
        return new Handler(entries);
    }

    handle(options: HandlerOptions = {}): FontFace[] {
        this.options = options;

        const map = (entries: fontFaceEntry[]): FontFace[] => {
            return entries.flatMap((entry: fontFaceEntry) => {
                if (Array.isArray(entry)) {
                    return map(entry);
                }

                return this.handleFontFaceEntry(entry);
            });
        };

        return map(this.entries);
    }

    private handleFontFaceEntry(entry: fontFaceEntry): FontFace[] {
        if (typeof entry === 'string') {
            entry = { url: entry };
        }

        // eslint-disable-next-line
        if (typeof entry === 'object' && ('url' in entry)) {
            return this.handleFontFaceProvider(entry);
        }

        if (typeof entry === 'object' && entry.fontFamily && entry.src) {
            entry = this.handleFontFace(entry);
        } else {
            throw HandlerException.invalidFontFaceEntry(entry);
        }

        return [entry];
    }

    private handleFontFace(fontFace: FontFace): FontFace {
        if (this.options?.defaultFontFaceRules && typeof this.options.defaultFontFaceRules === 'object') {
            fontFace = {
                ...this.options.defaultFontFaceRules,
                ...fontFace,
            };
        }

        if (fontFace.fontWeight) {
            fontFace.fontWeight = translateFontFaceFontWeight(fontFace.fontWeight);
        }

        if (!Array.isArray(fontFace.src)) {
            fontFace.src = [fontFace.src];
        }

        fontFace.src = (fontFace.src as FontFaceSrc[]).map(
            (src: string | FontFaceSrc): FontFaceSrc => {
                if (typeof src === 'string') {
                    src = {
                        url: src,
                        format: 'auto',
                    };
                }

                if (typeof src === 'object' && src.format === 'auto') {
                    src = {
                        ...src,
                        format: determineFontFaceSrcFormat(src),
                    };
                }

                if (typeof src === 'object' && typeof src.format !== 'string') {
                    delete src.format;
                }

                return src;
            }
        );

        return fontFace;
    }

    private handleFontFaceProvider(fontFaceProvider: FontFaceProvider): FontFace[] {
        const providers = [GoogleFontsProvider, DefaultProvider];

        const provider = providers.find((provider) => provider.canHandle(fontFaceProvider));
        const fontFaces = provider?.handle(fontFaceProvider, this.options);

        if (!fontFaces || !Array.isArray(fontFaces)) {
            throw FontsProviderException.unsupportedProvider(fontFaceProvider.url);
        }

        if (!fontFaces.length) {
            throw FontsProviderException.unexpectedProviderResponse(fontFaceProvider.url);
        }

        return fontFaces.map(this.handleFontFace.bind(this));
    }
}
