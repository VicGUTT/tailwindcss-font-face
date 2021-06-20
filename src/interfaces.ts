import { fiftyTo200, fontDisplay, fontStretchStringValue, fontStyle, fontWeight } from './types';

export interface FontFaceSrc {
    /**
     * Specifies an external reference consisting of a <url>(),
     * followed by an optional hint using the format() function to describe the
     * format of the font resource referenced by that URL.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src
     */
    url: string,

    /**
     * The format hint contains a comma-separated list of format strings that denote well-known font formats.
     * If a user agent doesn't support the specified formats, it skips downloading the font resource.
     * If no format hints are supplied, the font resource is always downloaded.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src
     * @see https://css-tricks.com/snippets/css/using-font-face/
     */
    format?: 'auto' | 'embedded-opentype' | 'woff2' | 'woff' | 'truetype' | 'opentype' | 'svg',

    // local?: string,
};

export interface FontFace {
    /**
     * Required.
     * Specifies a name that will be used as the font face value for font properties.
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-family
     */
    fontFamily: string,

    /**
     * Required.
     * Specifies the resource containing the font data.
     * This can be a URL to a remote font file location or the name of a font on the user's computer.
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src
     */
    src: string | FontFaceSrc | string[] | FontFaceSrc[] | (string | FontFaceSrc)[],

    /**
     * Defines the ascent metric for the font.
     * The ascent metric is the height above the baseline that CSS uses to lay out line boxes in an inline formatting context.
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/ascent-override
     */
    ascentOverride?: 'normal' | number,

    /**
     * Defines the descent metric for the font.
     * The descent metric is the height below the baseline that CSS uses to lay out line boxes in an inline formatting context.
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/descent-override
     */
    descentOverride?: 'normal' | number,

    /**
     * Determines how a font face is displayed based on whether and when it is downloaded and ready to use.
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
     */
    fontDisplay?: fontDisplay,

    /**
     * A font-stretch value. Accepts two values to specify a range that is supported by a font-face,
     * for example font-stretch: 50% 200%;
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-stretch
     */
    fontStretch?: fontStretchStringValue | fiftyTo200 | [fontStretchStringValue, fontStretchStringValue] | [fiftyTo200, fiftyTo200],

    /**
     * A font-style value. Accepts two values to specify a range that is supported by a font-face,
     * for example font-style: oblique 20deg 50deg;
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-style
     */
    fontStyle?: fontStyle,

    /**
     * A font-weight value. Accepts two values to specify a range that is supported by a font-face,
     * for example font-weight: 100 400;
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-weight
     */
    fontWeight?: fontWeight | [fontWeight, fontWeight],

    /**
     * A font-variant value.
     * This property is a shorthand for the following CSS properties:
     *    - font-variant-alternates
     *    - font-variant-caps
     *    - font-variant-east-asian
     *    - font-variant-ligatures
     *    - font-variant-numeric
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-variant
     */
    fontVariant?: string
    | 'normal'
    | 'none',

    /**
     * Defines the line gap metric for the font.
     * The line-gap metric is the font recommended line-gap or external leading.
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/line-gap-override
     */
    lineGapOverride?: 'normal' | number,

    /**
     * The range of Unicode code points to be used from the font.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range
     */
    unicodeRange?: string | string[],
};

export interface FontFaceProvider {
    /**
     * The external resource URL exposing the font-face rules.
     */
    url: string,

    /**
     * If provided, determines where the external fonts should be locally sored.
     */
    fontDir?: string,

    /**
     * If provided, determines the "url()" value of the fonts.
     */
    fontPath?: string,

    /**
     * If provided, determines the underlying "https://github.com/ForbesLindesay/sync-request" request options.
     */
    request?: {
        [key: string]: any,
        headers?: {
            [key: string]: any,
        }
    },
};

export interface FontFaceSrcMeta {
    url: FontFaceSrc['url'],
    fileName: string,
    // urlHash: string,
    // fileHash?: string,
    // extension: string | undefined,
    // format: FontFaceSrc['format'],
    // fontFamily: FontFace['fontFamily'],
    // fontWeight: FontFace['fontWeight'],
    // fontStyle: FontFace['fontStyle'],
};

export interface HandlerOptions {
    fontDir?: string,
    fontPath?: string,

    /**
     * Default font face property values
     */
    defaultFontFaceRules?: FontFace,
};
