import { readFileSync } from 'fs';

export const readJSONArray = (
  path: string,
  ignoreMissingFile: boolean,
): any[] | Error => {
  let fileContent: string;

  try {
    fileContent = readFileSync(path, { encoding: 'utf-8' });
  } catch (error) {
    if (ignoreMissingFile) {
      return [];
    }

    throw new Error(`Cannot read file ${path}: ${(error as Error).message}`);
  }

  let parsedFile: unknown;
  try {
    parsedFile = JSON.parse(fileContent);
  } catch (error) {
    throw new Error(
      `Cannot parse JSON file ${path}: ${(error as Error).message}`,
    );
  }

  if (!Array.isArray(parsedFile)) {
    throw new Error(`File ${path} is not a valid array`);
  }

  return parsedFile;
};