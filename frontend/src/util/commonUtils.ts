/**
 * Returns the ordinal suffix of a given number.
 * @param num - The number to get the ordinal suffix for, supports string and number
 * @returns The number with its ordinal suffix. Or "-" when undefined.
 */
export function getNumberWithOrdinalSuffix(num: any): string {
    switch (typeof num) {
        case 'undefined':
            return '-';
        case 'number':
            break;
        case 'string':
            break;
        default:
            throw new Error(
                'Invalid arguments, supports only strings or numbers!'
            );
    }
    const value = (typeof num === 'number' ? num : Number.parseInt(num)) % 100;
    const suffixes = ['th', 'st', 'nd', 'rd'];
    return `${num}${suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]}`;
}
