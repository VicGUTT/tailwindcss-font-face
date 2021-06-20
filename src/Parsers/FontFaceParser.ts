import postcss, { AtRule, Declaration, Root } from 'postcss';
import { FontFace, FontFaceSrc } from '../interfaces';
import isNumeric from '../utils/isNumeric';
import strUcfirst from '../utils/strUcfirst';
import strUnquote from '../utils/strUnquote';

export default class FontFaceParser {
    private css: string;

    private constructor(css: string) {
        this.css = css; // no need to remove all spaces with "css.replace(/\s/g, '')"
    }

    static parse(css: string): FontFace[] {
        return new FontFaceParser(css).go();
    }

    private go(): FontFace[] {
        const root: Root = postcss.parse(this.css);

        const fontFaces = root.nodes
            .filter((node) => node.type === 'atrule' && node.name === 'font-face')
            /* eslint-disable */
            // @ts-ignore
            .map((node: AtRule): fontFaces => {
                return (
                    node.nodes
                        // @ts-ignore
                        .filter(_node => _node.type === 'decl')
                        // @ts-ignore
                        .reduce((acc, _node: Declaration) => {
                            const { property, value } = this.handleDeclaration(_node);

                            // @ts-ignore
                            acc[property] = value;

                            return acc;
                        }, {})
                );
            });

        return fontFaces;
    }

    private handleDeclaration(node: Declaration): { [key: string]: string | number | FontFaceSrc[] } {
        const property = this.normalizePropertyName(node.prop);
        // eslint-disable-next-line
        const value: string | number | FontFaceSrc[] = property !== 'src'
            ? this.normalizePropertyValue(node.value)
            : this.handleSrcValues(node.value);

        return {
            property,
            value,
        };
    }

    private normalizePropertyName(property: string): string {
        if (!property.includes('-')) {
            return property;
        }

        const parts = property.split('-');

        // eslint-disable-next-line
        return parts[0] + parts.slice(1).map(strUcfirst).join('');
    }

    private normalizePropertyValue(value: string): string | number {
        value = strUnquote(value);

        if (isNumeric(value)) {
            return +value;
        }

        return value;
    }

    private handleSrcValues(value: string): FontFaceSrc[] {
        return value
            .split(',')
            .map((part) => {
                const url = part.match(/url\(\S+\)/g)?.pop()?.match(/\(([^)]+)\)/)?.pop(); // eslint-disable-line
                const format = part.match(/format\(\S+\)/g)?.pop()?.match(/\(([^)]+)\)/)?.pop(); // eslint-disable-line

                if (!url) {
                    return null;
                }

                return {
                    url: strUnquote(url),
                    format: format ? strUnquote(format) : undefined,
                };
            })
            .filter(Boolean) as FontFaceSrc[];
    }
}
