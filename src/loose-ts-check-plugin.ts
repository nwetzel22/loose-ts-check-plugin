import path from "path";
import ts, { Diagnostic, DiagnosticWithLocation } from "typescript/lib/tsserverlibrary";
import { FilePathMatcher } from "./file-path-matcher";
import { readJSONArray } from "./read-json-array";

class LooseTsCheckPlugin {
    private readonly logger: (message: string) => void;
    private readonly projectDirectoryPath: string;
    private readonly filePathMatcher: FilePathMatcher;
    private readonly ignoredErrorCodes: Set<string>;

    constructor(
        logger: (message: string) => void,
        projectDirectoryPath: string,
        pathToIgnoredFilesJsonFile: string,
        pathToIgnoredErrorCodesJsonFile: string,
    ) {
        this.logger = logger;
        this.projectDirectoryPath = projectDirectoryPath;

        const absolutePathToIgnoredFilesJsonFile = path.join(this.projectDirectoryPath, '/', pathToIgnoredFilesJsonFile);
        this.filePathMatcher = this.buildFilePathMatcher(absolutePathToIgnoredFilesJsonFile);

        const absolutePathToIgnoredErrorCodesJsonFile = path.join(this.projectDirectoryPath, '/', pathToIgnoredErrorCodesJsonFile);
        this.ignoredErrorCodes = this.buildIgnoredErrorSet(absolutePathToIgnoredErrorCodesJsonFile);
    }

    private buildFilePathMatcher(pathToIgnoredFilesJsonFile: string): FilePathMatcher {
        let looselyTypeCheckedFilePaths: string[] = [];
      try {
        looselyTypeCheckedFilePaths = readJSONArray(pathToIgnoredFilesJsonFile, false) as string[];
      } catch (ex) {
        const error = ex as Error;
        this.logger("Failed to parse file containing list of files to loosely check.");
        this.logger(error.message);
      }

      this.logger(`Loosely type checked file relative paths:`);
      for (let filePath of looselyTypeCheckedFilePaths) {
        this.logger(filePath);
      }

      return new FilePathMatcher(looselyTypeCheckedFilePaths, this.projectDirectoryPath);
    }

    private buildIgnoredErrorSet(pathToIgnoredFilesJsonFile: string): Set<string> {
        let ignoredErrorCodes: string[] = [];
      try {
        ignoredErrorCodes = readJSONArray(pathToIgnoredFilesJsonFile, false) as string[];
      } catch (ex) {
        const error = ex as Error;
        this.logger("Failed to parse file containing list of error codes to ignore.");
        this.logger(error.message);
      }
      
      this.logger(`Ignored errors:`);
      for (let errorCode of ignoredErrorCodes) {
        this.logger(errorCode);
      }

      return new Set<string>(ignoredErrorCodes);
    }

    public shouldDiagnosticBeReported(d: DiagnosticWithLocation | Diagnostic): boolean {     
        if (!d.file) {
          return true;
        }

        this.logger(`Loose check file: ${d.file.fileName}`);

        const errorCode = `TS${d.code}`;
        const errorCodeMatch = this.ignoredErrorCodes.has(errorCode);

        if (!errorCodeMatch) {
          return true;
        }

        const filePathMatch = this.filePathMatcher.hasMatch(d.file.fileName);

        if (!filePathMatch) {
          return true;
        }

        return false;
    };
}

export default LooseTsCheckPlugin;