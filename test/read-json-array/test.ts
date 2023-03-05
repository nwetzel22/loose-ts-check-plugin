import path from "path";
import { readJSONArray } from "../../src/read-json-array";

describe('Testing read-json-array.ts.', () => {
    test('Testing file with single entry ["one"].', () => {
        const relativePathToTestFile = './json/one-entry.json';
        const absolutePathToTestFile = path.resolve(__dirname, relativePathToTestFile);
        let result = readJSONArray(absolutePathToTestFile, false);
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);
        expect(result).toContain("one");
    });

    test('Testing file with multiple entries ["one", "two"].', () => {
        const relativePathToTestFile = './json/two-entries.json';
        const absolutePathToTestFile = path.resolve(__dirname, relativePathToTestFile);
        let result = readJSONArray(absolutePathToTestFile, false);
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(2);
        expect(result).toContain("one");
        expect(result).toContain("two");
    });

    test('Testing file with no entries.', () => {
        const relativePathToTestFile = './json/empty.json';
        const absolutePathToTestFile = path.resolve(__dirname, relativePathToTestFile);
        let result = readJSONArray(absolutePathToTestFile, false);
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(0);
    });

    test('Testing missing file with ignore.', () => {
        const relativePathToTestFile = './json/not-found.json';
        const absolutePathToTestFile = path.resolve(__dirname, relativePathToTestFile);
        let result = readJSONArray(absolutePathToTestFile, true);
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(0);
    });

    test('Testing missing file without ignore.', () => {
        const relativePathToTestFile = './json/not-found.json';
        const absolutePathToTestFile = path.resolve(__dirname, relativePathToTestFile);
        expect(() => readJSONArray(absolutePathToTestFile, false)).toThrowError();
    });
});