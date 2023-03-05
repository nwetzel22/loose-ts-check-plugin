
import LooseTsCheckPlugin from "../../src/loose-ts-check-plugin";

describe('Testing loose-ts-checkin-plugin', () => {
    const looseTsCheckPlugin = new LooseTsCheckPlugin(
        () => {},
        __dirname,
        "./json/file-paths.json",
        "./json/error-codes.json"
    );

    test('Testing a diagnostic that should be ignored with regular file path.', () => {
        const diagnostic = {
            code: 1,
            file: {
                fileName: `${__dirname}/path/to/file.ts`
            } as any
        } as any;
        expect(looseTsCheckPlugin.shouldDiagnosticBeReported(diagnostic)).toEqual(false);
    });

    test('Testing a diagnostic that should be ignored with glob file path.', () => {
        const diagnostic = {
            code: 1,
            file: {
                fileName: `${__dirname}/glob-this/glob/glob-this.ts`
            } as any
        } as any;
        expect(looseTsCheckPlugin.shouldDiagnosticBeReported(diagnostic)).toEqual(false);
    });

    test('Testing a diagnostic that should not be ignored because error code does not match.', () => {
        const diagnostic = {
            code: 2,
            file: {
                fileName: `${__dirname}/path/to/file.ts`
            } as any
        } as any;
        expect(looseTsCheckPlugin.shouldDiagnosticBeReported(diagnostic)).toEqual(true);
    });

    test('Testing a diagnostic that should not be ignored because file path does not match.', () => {
        const diagnostic = {
            code: 1,
            file: {
                fileName: `${__dirname}/path/to/non/matching/file.ts`
            } as any
        } as any;
        expect(looseTsCheckPlugin.shouldDiagnosticBeReported(diagnostic)).toEqual(true);
    });
});