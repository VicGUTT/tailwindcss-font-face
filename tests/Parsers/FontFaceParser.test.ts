import { FontFace } from '../../src/interfaces';
import FontFaceParser from '../../src/Parsers/FontFaceParser';

const css = `
    body {
        font-size: 1rem;
        line-height: 1.5;
        color: #333,
    }

    @media (min-width: 777px) {
        body {
            font-size: 1.2rem;
            color: red,
        }
    }


    /* vietnamese */
    @font-face {
        font-family: 'Mulish';
        font-style: italic;
        font-weight: 200;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/mulish/v3/1Ptwg83HX_SGhgqk2hAjQlW_mEuZ0FsSqeOfFpQ6HTY.woff2) format('woff2');
        unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
    }

    /* latin-ext */
    @font-face {
        font-family: 'Mulish';
        font-style: normal;
        font-weight: 200;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/mulish/v3/1Ptyg83HX_SGhgqO0yLcmjzUAuWexRNR8amvG4w-.woff2) format('woff2');
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }

    /* First line is missing a comma */
    @font-face {
        font-family: 'Mulish';
        src: url('webfont.eot?#iefix') format('embedded-opentype') /* IE6-IE8 */
            url('webfont.woff2') format('woff2'), /* Super Modern Browsers */
            url('webfont.woff') format('woff'), /* Pretty Modern Browsers */
            url('webfont.ttf')  format('truetype'), /* Safari, Android, iOS */
            url('webfont.svg#svgFontName') format('svg'); /* Legacy iOS */
    }

    /* First & 3rd lines are missing commas */
    @font-face {
        font-family: 'Mulish';
        src: url('webfont.eot?#iefix') format('embedded-opentype') /* IE6-IE8 */
            url('webfont.woff2') format('woff2'), /* Super Modern Browsers */
            url('webfont.woff') format('woff') /* Pretty Modern Browsers */
            url('webfont.ttf')  format('truetype'), /* Safari, Android, iOS */
            url('webfont.svg#svgFontName') format('svg'); /* Legacy iOS */
    }

    /* No commas 😱 */
    @font-face {
        font-family: 'Mulish';
        src: url('webfont.eot?#iefix') format('embedded-opentype') /* IE6-IE8 */
            url('webfont.woff2') format('woff2') /* Super Modern Browsers */
            url('webfont.woff') format('woff') /* Pretty Modern Browsers */
            url('webfont.ttf')  format('truetype') /* Safari, Android, iOS */
            url('webfont.svg#svgFontName') format('svg'); /* Legacy iOS */
    }

    /* Using "local()" */
    @font-face {
        font-family: 'Mulish';
        src: local(font), url(path/to/font.svg),
            url(path/to/font.woff) format("woff"),
            url(path/to/font.otf) format("opentype")
    }
`;
const expected: FontFace[] = [
    {
        fontFamily: 'Mulish',
        fontStyle: 'italic',
        fontWeight: 200,
        fontDisplay: 'swap',
        src: [
            {
                url: 'https://fonts.gstatic.com/s/mulish/v3/1Ptwg83HX_SGhgqk2hAjQlW_mEuZ0FsSqeOfFpQ6HTY.woff2',
                format: 'woff2',
            },
        ],
        unicodeRange:
            'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB',
    },
    {
        fontFamily: 'Mulish',
        fontStyle: 'normal',
        fontWeight: 200,
        fontDisplay: 'swap',
        src: [
            {
                url: 'https://fonts.gstatic.com/s/mulish/v3/1Ptyg83HX_SGhgqO0yLcmjzUAuWexRNR8amvG4w-.woff2',
                format: 'woff2',
            },
        ],
        unicodeRange:
            'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
    },

    // First line is missing a comma
    {
        fontFamily: 'Mulish',
        src: [
            {
                url: 'webfont.woff2',
                format: 'woff2',
            },
            {
                url: 'webfont.woff',
                format: 'woff',
            },
            {
                url: 'webfont.ttf',
                format: 'truetype',
            },
            {
                url: 'webfont.svg#svgFontName',
                format: 'svg',
            },
        ],
    },

    // First & 3rd lines are missing a commas
    {
        fontFamily: 'Mulish',
        src: [
            {
                url: 'webfont.woff2',
                format: 'woff2',
            },
            {
                url: 'webfont.ttf',
                format: 'truetype',
            },
            {
                url: 'webfont.svg#svgFontName',
                format: 'svg',
            },
        ],
    },

    // No commas 😱
    {
        fontFamily: 'Mulish',
        src: [
            {
                url: 'webfont.svg#svgFontName',
                format: 'svg',
            },
        ],
    },

    // Using "local()"
    {
        fontFamily: 'Mulish',
        src: [
            {
                url: 'path/to/font.svg',
            },
            {
                url: 'path/to/font.woff',
                format: 'woff',
            },
            {
                url: 'path/to/font.otf',
                format: 'opentype',
            },
        ],
    },
];

describe('parsers:FontFaceParser', () => {
    it('works', () => {
        expect(FontFaceParser.parse(css)).toEqual(expected);
    });
});
