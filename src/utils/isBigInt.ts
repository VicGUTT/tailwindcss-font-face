import getConstructor from './getConstructor';

export default function isBigInt(value: unknown): Boolean {
    return getConstructor(value) === BigInt;
}
