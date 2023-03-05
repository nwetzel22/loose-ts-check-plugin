import { Minimatch } from 'minimatch';
import path from 'path';

export class FilePathMatcher {
  private readonly regularFilePaths: Set<string> = new Set();
  private readonly patternMatchersMap: Map<
    string,
    (filePath: string) => boolean
  > = new Map();

  constructor(filePaths: string[], projectDirectoryRootPath: string = "") {
    for (const filePath of filePaths) {
      // NOTE: different handling of paths is an optimization.
      // Having regular full file paths in a set lets us
      // check if a path matches any path in the set using O(1)
      // instead of O(n).
      // We only need to go through the patterns using O(n).
      if (containsMagicCharacters(filePath)) {
        const m = new Minimatch(filePath);
        this.patternMatchersMap.set(filePath, m.match.bind(m));
      } else {
        let pathToAdd = filePath;
        if (projectDirectoryRootPath){
          // Deliberately not using "path.join" here because it changes
          // the path separator and causes file path matching to fail.
          pathToAdd = `${projectDirectoryRootPath}/${filePath}`;
        }
        this.regularFilePaths.add(pathToAdd);
      }
    }
  }

  public hasMatch(filePath: string) {
    const matchesRegularFilePath = this.regularFilePaths.has(filePath);
    if (matchesRegularFilePath) {
      return true;
    }

    // NOTE: we need to go through all the matches anyway to check
    // if they match some files. This is necessary so we do not assume
    // these wildcard matches are useless when they matched files that
    // are also matched by regular full paths to these files.

    for (const patternMatches of this.patternMatchersMap.values()) {
      if (patternMatches(filePath)) {
        return true;
      }
    }

    return false;
  }
}

function containsMagicCharacters(filePath: string): boolean {
  // NOTE: magic characters interpreted by minimatch
  // @see https://www.npmjs.com/package/minimatch
  return /[\{\}\?\*]/.test(filePath);
}