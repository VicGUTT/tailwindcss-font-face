import { FontFace } from '../interfaces';

export default function translateFontFaceFontWeight(fontWeight: FontFace['fontWeight']): FontFace['fontWeight'] {
    const values = (Array.isArray(fontWeight) ? fontWeight : [fontWeight])
        .map(_translateFontFaceFontWeight)
        .filter((item) => !!item || item === 0);

    if (!values.length) {
        return undefined;
    }

    return values.length === 1 ? values[0] : (values as FontFace['fontWeight']);
}

function _translateFontFaceFontWeight(fontWeight: FontFace['fontWeight']): FontFace['fontWeight'] {
    switch (fontWeight) {
        case 'thin':
            return 100;
        case 'extralight':
            return 200;
        case 'light':
            return 300;
        case 'medium':
            return 500;
        case 'semibold':
            return 600;
        case 'extrabold':
            return 800;
        case 'black':
            return 900;
        default:
            return fontWeight;
    }
}
