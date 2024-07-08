/**
 * Returns the ordinal suffix of a given number.
 * @param num - The number to get the ordinal suffix for.
 * @returns The number with its ordinal suffix.
 */
export function getNumberWithOrdinalSuffix(num: number): string {
    const value = num % 100;
    const suffixes = ['th', 'st', 'nd', 'rd'];
    return `${num}${suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]}`;
}
