import { FontFace, FontFaceSrc } from '../interfaces';
import determineFontFaceSrcExtension from './determineFontFaceSrcExtension';
import hash from './hash';
import strSanitize from './strSanitize';

export default function makeFontFaceSrcFileName(src: FontFaceSrc, fontFace: FontFace) {
    const concat = (...args: any) => args.map((arg: any) => ((arg ?? '') + '').trim()).join('-');

    const extension = determineFontFaceSrcExtension(src);
    const name = concat(fontFace.fontFamily, fontFace.fontStyle, fontFace.fontWeight, hash(src.url));

    return `${strSanitize(name)}${extension ? '.' : ''}${extension ?? ''}`;
}
