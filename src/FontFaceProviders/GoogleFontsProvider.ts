import { FontFace, FontFaceProvider, HandlerOptions } from '../interfaces';
import AbstractFontsProvider from './AbstractFontsProvider';

export default class GoogleFontsProvider extends AbstractFontsProvider {
    static canHandle(fontFaceProvider: FontFaceProvider): boolean {
        return fontFaceProvider.url.includes('://fonts.googleapis.com');
    }

    static handle(fontFaceProvider: FontFaceProvider, options: HandlerOptions = {}): FontFace[] {
        return new GoogleFontsProvider(fontFaceProvider, options).go();
    }

    /**
     * Hack because TypeScript does not support "static abstract abc(...)";
     */

    protected canHandle(fontFaceProvider: FontFaceProvider): boolean {
        return GoogleFontsProvider.canHandle(fontFaceProvider);
    }

    protected handle(fontFaceProvider: FontFaceProvider, options: HandlerOptions = {}): FontFace[] {
        return GoogleFontsProvider.handle(fontFaceProvider, options);
    }
}
