/**
 * @vitest-environment happy-dom
 */

import { sortByFavoritedAndName } from './arrayUtils';
import { expect } from 'vitest';

const testArray = [
    { name: 'a', favorited: false },
    { name: 'b', favorited: true },
    { name: 'c', favorited: false }
];
describe('isNonEmptyArray', () => {
    test('Should return false for null', () => {
        expect(sortByFavoritedAndName(testArray)).toEqual([
            { name: 'b', favorited: true },
            { name: 'a', favorited: false },
            { name: 'c', favorited: false }
        ]);
    });
});
