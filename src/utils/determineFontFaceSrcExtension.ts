import { FontFaceSrc } from '../interfaces';

export default function determineFontFaceSrcExtension(src: FontFaceSrc): string | undefined {
    const format: FontFaceSrc['format'] = src.format;

    if (!format) {
        return undefined;
    }

    if (format === 'embedded-opentype') {
        return 'eot';
    }

    if (format === 'truetype') {
        return 'ttf';
    }

    if (format === 'opentype') {
        return 'otf';
    }

    if (['woff2', 'woff', 'svg'].includes(format)) {
        return format;
    }

    return undefined;
}
