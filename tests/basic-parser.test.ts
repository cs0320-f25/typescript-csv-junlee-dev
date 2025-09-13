import { parseCSV } from "../src/basic-parser";
import * as path from "path";
import { z } from "zod";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");
const EMPTY_CSV_PATH = path.join(__dirname, "../data/empty.csv");
const COMMAS_CSV_PATH = path.join(__dirname, "../data/comma_in_value.csv");
const DUPLICATES_CSV_PATH = path.join(__dirname, "../data/duplicates.csv");
const MANY_VALUES_CSV_PATH = path.join(__dirname, "../data/many_values.csv");
const MISSING_CSV_PATH = path.join(__dirname, "../data/missing_values.csv");
const NO_VALUE_CSV_PATH = path.join(__dirname, "../data/no_values.csv");
const LANGUAGE_CSV_PATH = path.join(__dirname, "../data/language_values.csv");

test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  
  expect(results).toHaveLength(5);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
  expect(results[3]).toEqual(["Charlie", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});

// testing empty csv file
test("parseCSV works on empty file", async () => {
  const results = await parseCSV(EMPTY_CSV_PATH)
  
  expect(results).toHaveLength(0);
});

// testing no value but label row
test("parseCSV works with no value and only label row", async () => {
  const results = await parseCSV(NO_VALUE_CSV_PATH)

  expect(results).toHaveLength(1);
  expect(results[0]).toEqual(["name", "age"]);
});

// testing commas in csv
test("parseCSV works with commas in values", async () => {
  const results = await parseCSV(COMMAS_CSV_PATH)

  expect(results).toHaveLength(3);
  expect(results[0]).toEqual(["name", "motto"]);
  expect(results[1]).toEqual(["Alice", "i love cs32"]);
  expect(results[2]).toEqual(["Bob", "i, love, cs32!"]);
});

// testing duplicate rows
test("parseCSV works with duplicate rows", async () => {
  const results = await parseCSV(DUPLICATES_CSV_PATH)

  expect(results).toHaveLength(5);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Alice", "23"]);
  expect(results[3]).toEqual(["Alice", "23"]);
  expect(results[4]).toEqual(["Nim", "22"]);
});

// testing many (10) rows
test("parseCSV works with many rows", async () => {
  const results = await parseCSV(MANY_VALUES_CSV_PATH)

  expect(results).toHaveLength(11);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "30"]);
  expect(results[3]).toEqual(["Charlie", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
  expect(results[5]).toEqual(["David", "50"]);
  expect(results[6]).toEqual(["Eve", "20"]);
  expect(results[7]).toEqual(["Frank", "20"]);
  expect(results[8]).toEqual(["Gabby", "29"]);
  expect(results[9]).toEqual(["Hank", "50"]);
  expect(results[10]).toEqual(["Ian", "21"]);
});

// testing missing some values
test("parseCSV works with missing values", async () => {
  const results = await parseCSV(MISSING_CSV_PATH)

  expect(results).toHaveLength(5);
  expect(results[0]).toEqual(["name", "age", "height"]);
  expect(results[1]).toEqual(["Alice", "23", "180"]);
  expect(results[2]).toEqual(["Bob", "", "150"]);
  expect(results[3]).toEqual(["Charlie", "25", "20"]);
  expect(results[4]).toEqual(["Nim", "22", ""]);
});

// testing a diff language
test("parseCSV works with diff language", async () => {
  const results = await parseCSV(LANGUAGE_CSV_PATH)

  expect(results).toHaveLength(11);
  expect(results[0]).toEqual(["이름", "나이"]);
  expect(results[1]).toEqual(["앨리스", "23"]);
  expect(results[2]).toEqual(["밥", "30"]);
  expect(results[3]).toEqual(["찰리", "25"]);
  expect(results[4]).toEqual(["님", "22"]);
  expect(results[5]).toEqual(["다비드", "50"]);
  expect(results[6]).toEqual(["이브", "20"]);
  expect(results[7]).toEqual(["프랭크", "20"]);
  expect(results[8]).toEqual(["가비", "29"]);
  expect(results[9]).toEqual(["행크", "50"]);
  expect(results[10]).toEqual(["이안", "21"]);
});

test("parseCSV works with zod schema", async () => {
  const schema = z.tuple([z.string(), z.coerce.number(), z.string()])
    .transform(t => ({ name: t[0], age: t[1], isStudent: t[2] }));

  const result = await parseCSV(
    path.join(__dirname, "../data/zod_test.csv"),
    schema
  );

  expect(result[0]).toEqual({ name: "Alice", age: 20, isStudent: "Yes" });
  expect(result[1]).toEqual({ name: "Bob", age: 30, isStudent: "No" });
});

test("parseCSV works with returning error for zod schema", async () => {
  const schema = z.tuple([z.string(), z.coerce.number(), z.string()])
    .transform(t => ({ name: t[0], age: t[1], isStudent: t[2] }));

  const result = await parseCSV(
    path.join(__dirname, "../data/zod_test_return_error.csv"),
    schema
  );

  expect(result[0]).toEqual({ name: "Alice", age: 20, isStudent: "Yes" });
  expect(result[1]).toHaveProperty("error");
});