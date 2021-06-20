import isBigInt from './isBigInt';
import isSymbol from './isSymbol';

export default function isNumeric(value: any): Boolean {
    return !isSymbol(value) && !isBigInt(value) && !isNaN(parseFloat(value)) && isFinite(value);
}
