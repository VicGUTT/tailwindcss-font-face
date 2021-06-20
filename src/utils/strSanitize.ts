/**
 * "Sanitize" a string.
 * Only allow [a-zA-Z0-9] characters, plus "-" and "_".
 */
export default function strSanitize(value: string): string {
    // return value.replace(/[^a-zA-Z0-9\-_. ]+/g, '');
    return value.replace(/[^a-zA-Z0-9\-_]+/g, '');
}
