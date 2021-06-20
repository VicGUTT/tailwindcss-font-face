import { FontFace, FontFaceProvider, HandlerOptions } from '../interfaces';
import AbstractFontsProvider from './AbstractFontsProvider';

export default class DefaultProvider extends AbstractFontsProvider {
    static canHandle(fontFaceProvider: FontFaceProvider): boolean {
        try {
            return !!new URL(fontFaceProvider.url);
        } catch (error) {
            return false;
        }
    }

    static handle(fontFaceProvider: FontFaceProvider, options: HandlerOptions = {}): FontFace[] {
        return new DefaultProvider(fontFaceProvider, options).go();
    }

    /**
     * Hack because TypeScript does not support "static abstract abc(...)";
     */

    protected canHandle(fontFaceProvider: FontFaceProvider): boolean {
        return DefaultProvider.canHandle(fontFaceProvider);
    }

    protected handle(fontFaceProvider: FontFaceProvider, options: HandlerOptions = {}): FontFace[] {
        return DefaultProvider.handle(fontFaceProvider, options);
    }
}
