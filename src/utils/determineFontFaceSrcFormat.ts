import { FontFaceSrc } from '../interfaces';

export default function determineFontFaceSrcFormat(src: FontFaceSrc): FontFaceSrc['format'] | undefined {
    let format: FontFaceSrc['format'] | undefined = undefined;
    let url: string | URL = src.url;

    if (!url.startsWith('https://') || !url.startsWith('http://')) {
        url = `https://${url.replace(/^(\/)+/g, '')}`;
    }

    url = new URL(url);

    const extension = url.pathname.split('.').pop() || '';
    const hash = url.hash;

    if (extension === 'eot' && hash === '#iefix') {
        format = 'embedded-opentype';
    }

    if (extension === 'ttf') {
        format = 'truetype';
    }

    if (extension === 'otf') {
        format = 'opentype';
    }

    if (['woff2', 'woff', 'svg'].includes(extension)) {
        format = extension as 'woff2' | 'woff' | 'svg';
    }

    return format;
}
