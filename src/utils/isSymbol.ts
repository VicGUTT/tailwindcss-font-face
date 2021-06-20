import getConstructor from './getConstructor';

export default function isSymbol(value: unknown): Boolean {
    return getConstructor(value) === Symbol;
}
