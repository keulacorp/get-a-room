/**
 * Returns the ordinal suffix of a given number.
 * @param num - The number to get the ordinal suffix for, supports string and number
 * @returns The number with its ordinal suffix.
 */
export function getNumberWithOrdinalSuffix(num: any): string {
    if (typeof num !== 'string' && typeof num !== 'number') {
        throw new Error('Invalid arguments, supports only strings or numbers!');
    }
    const value = (typeof num === 'number' ? num : Number.parseInt(num)) % 100;
    const suffixes = ['th', 'st', 'nd', 'rd'];
    return `${num}${suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]}`;
}
