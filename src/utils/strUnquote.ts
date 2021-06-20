/**
 * Remove quotes around a string.
 */
export default function strUnquote(value: string): string {
    if (!value || !value.length) {
        return value;
    }

    return value.replace(/['"]+/g, '');
}
