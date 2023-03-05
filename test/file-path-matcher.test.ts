import { FilePathMatcher } from '../src/file-path-matcher';

describe('Testing file-path-matcher.ts.', () => {
    test('Testing matching of regular file paths.', () => {
        const regularPath = 'a/regular/path.ts';
        const filePathMatcher = new FilePathMatcher([regularPath]);
        expect(filePathMatcher.hasMatch(regularPath)).toEqual(true);
    });

    test('Testing non matching of regular file paths.', () => {
        const regularPathToStore = 'a/regular/path/to/store.ts';
        const regularPathToMatch = 'a/regular/path/to/match.ts';
        const filePathMatcher = new FilePathMatcher([regularPathToStore]);
        expect(filePathMatcher.hasMatch(regularPathToMatch)).toEqual(false);
    });

    test('Testing matching of pattern paths.', () => {
        const patternPath = '**/*.ts';
        const filePathToMatchPattern = 'a/pattern/matching/path.ts';
        const filePathMatcher = new FilePathMatcher([patternPath]);
        expect(filePathMatcher.hasMatch(filePathToMatchPattern)).toEqual(true);
    });

    test('Testing non matching of pattern paths.', () => {
        const patternPath = '**/*.ts';
        const filePathToMatchPattern = 'a/non/pattern/matching/path.js';
        const filePathMatcher = new FilePathMatcher([patternPath]);
        expect(filePathMatcher.hasMatch(filePathToMatchPattern)).toEqual(false);
    });
});