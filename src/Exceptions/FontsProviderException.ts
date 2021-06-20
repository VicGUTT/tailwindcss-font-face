import { FontFaceProvider } from '../interfaces';
import TailwindcssFontFaceException from './TailwindcssFontFaceException';

export default class FontsProviderException extends TailwindcssFontFaceException {
    static undefinedFontDir(provider: FontFaceProvider): FontsProviderException {
        return FontsProviderException.thow(
            `No \`fontDir\` has been provided for the font at \`${provider.url}\`. This value is necessary to know where to store the font file.`
        );
    }

    static undefinedFontPath(provider: FontFaceProvider): FontsProviderException {
        return FontsProviderException.thow(
            `No \`fontPath\` has been provided for the font at \`${provider.url}\`. This value is necessary as it will be used to set the font's \`src\` url.`
        );
    }

    static unsupportedProvider(url: string): FontsProviderException {
        return FontsProviderException.thow(`No supported provider could be determined from the url \`${url}\`.`);
    }

    static unexpectedProviderResponse(url: string): FontsProviderException {
        return FontsProviderException.thow(
            `Unexpected response from the url \`${url}\`. Please ensure the response is valid CSS.`
        );
    }

    static failedRequest(url: string, error: Error): FontsProviderException {
        return FontsProviderException.thow(`Failed requesting the url \`${url}\`. Error: \`${error.message}\``);
    }
}
