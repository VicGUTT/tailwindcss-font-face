/**
 * Make a string's first character uppercase.
 */
export default function strUcfirst(value: string): string {
    if (!value || !value.length) {
        return value;
    }

    return value.substring(0, 1).toUpperCase() + value.substring(value.length - (value.length - 1));
}
