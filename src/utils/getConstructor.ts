export default function getConstructor(value: any): any | null {
    // eslint-disable-next-line
    return ((value !== null) && (typeof value !== 'undefined')) ? value.constructor : null;
}
