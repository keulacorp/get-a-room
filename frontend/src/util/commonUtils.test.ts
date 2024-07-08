import { getNumberWithOrdinalSuffix } from './commonUtils';

describe('getNumberWithOrdinalSuffix', () => {
    // test for "st"
    test('Should return "1st" when input is 1', () => {
        expect(getNumberWithOrdinalSuffix(1)).toEqual('1st');
    });
    test('Should return "21st" when input is 21', () => {
        expect(getNumberWithOrdinalSuffix(21)).toEqual('21st');
    });
    test('Should return "101st" when input is 101', () => {
        expect(getNumberWithOrdinalSuffix(101)).toEqual('101st');
    });
    test('Should return "121st" when input is 121', () => {
        expect(getNumberWithOrdinalSuffix(121)).toEqual('121st');
    });

    // test for "nd"
    test('Should return "2nd" when input is 2', () => {
        expect(getNumberWithOrdinalSuffix(2)).toEqual('2nd');
    });
    test('Should return "21nd" when input is 22', () => {
        expect(getNumberWithOrdinalSuffix(22)).toEqual('22nd');
    });
    test('Should return "102nd" when input is 102', () => {
        expect(getNumberWithOrdinalSuffix(102)).toEqual('102nd');
    });
    test('Should return "122nd" when input is 122', () => {
        expect(getNumberWithOrdinalSuffix(122)).toEqual('122nd');
    });

    // test for "rd"
    test('Should return "3rd" when input is 3', () => {
        expect(getNumberWithOrdinalSuffix(3)).toEqual('3rd');
    });
    test('Should return "23rd" when input is 23', () => {
        expect(getNumberWithOrdinalSuffix(23)).toEqual('23rd');
    });
    test('Should return "103rd" when input is 103', () => {
        expect(getNumberWithOrdinalSuffix(103)).toEqual('103rd');
    });
    test('Should return "123rd" when input is 123', () => {
        expect(getNumberWithOrdinalSuffix(123)).toEqual('123rd');
    });

    // test for "th"
    test('Should return "4th" when input is 4', () => {
        expect(getNumberWithOrdinalSuffix(4)).toEqual('4th');
    });
    test('Should return "24th" when input is 24', () => {
        expect(getNumberWithOrdinalSuffix(24)).toEqual('24th');
    });
    test('Should return "104th" when input is 104', () => {
        expect(getNumberWithOrdinalSuffix(104)).toEqual('104th');
    });
    test('Should return "124th" when input is 124', () => {
        expect(getNumberWithOrdinalSuffix(124)).toEqual('124th');
    });
    test('Should return "12th" when input is 12', () => {
        expect(getNumberWithOrdinalSuffix(12)).toEqual('12th');
    });
    test('Should return "112th" when input is 112', () => {
        expect(getNumberWithOrdinalSuffix(112)).toEqual('112th');
    });
});
