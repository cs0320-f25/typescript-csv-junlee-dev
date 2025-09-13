import * as fs from "fs";
import * as readline from "readline";
import { z } from "zod";

export class SchemaError extends Error {
  rowIndex: number;
  rawStr: string[];
  issue: z.ZodIssue[];

  constructor(rowIndex: number, rawStr: string[], issue: z.ZodIssue[]) {
    super(`Schema error at row ${rowIndex + 1}`);
    this.name = "SchemaError";
    this.rowIndex = rowIndex;
    this.rawStr = rawStr;
    this.issue = issue;
  }
}


/**
 * This is a JSDoc comment. Similar to JavaDoc, it documents a public-facing
 * function for others to use. Most modern editors will show the comment when 
 * mousing over this function name. Try it in run-parser.ts!
 * 
 * File I/O in TypeScript is "asynchronous", meaning that we can't just
 * read the file and return its contents. You'll learn more about this 
 * in class. For now, just leave the "async" and "await" where they are. 
 * You shouldn't need to alter them.
 * 
 * @param path The path to the file being loaded.
 * @returns a "promise" to produce a 2-d array of cell values
 */

export async function parseCSV<T>(path: string, schema?: z.ZodType<T>): Promise<T[] | string[][]> {
  // This initial block of code reads from a file in Node.js. The "rl"
  // value can be iterated over in a "for" loop. 
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // handle different line endings
  });
  
  let rowIndex = 0;

  // We add the "await" here because file I/O is asynchronous. 
  // We need to force TypeScript to _wait_ for a row before moving on. 
  // More on this in class soon!
  if (!schema) {
    const result: string[][] = [];
    for await (const line of rl) {
      result.push(line.split(",").map((v) => v.trim()));
    }
    return result;
  }

  const result: Array<T | { error: SchemaError }> = [];
  for await (const line of rl) {
    const values = line.split(",").map((v) => v.trim());
    const parsedValues = schema.safeParse(values);

    if (parsedValues.success) {
      result.push(parsedValues.data);
    } else {
      result.push({ error: new SchemaError(rowIndex, values, parsedValues.error.issues) });
    }
    rowIndex = rowIndex + 1;
  }

  return result as T[];
}