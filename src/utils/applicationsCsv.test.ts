import { expect, test } from 'vitest';
import { applicationsToCsv } from './applicationsCsv';
import { testApplications } from '../tests/fixtures/applications';

test('returns only headers for an empty list', () => {
  const result = applicationsToCsv([]);

  expect(result).toBe(
    '"No.","Company","Position","Location","Work mode","Status","Applied date","Salary range","Source","Notes","Follow-up date"',
  );
});

test('quotes company names containing commas', () => {
  const application = {
    ...testApplications[0],
    company: 'Example, Inc.',
  };

  const result = applicationsToCsv([application]);
  const dataRow = result.split('\r\n')[1];

  expect(dataRow.startsWith('"1","Example, Inc.",')).toBe(true);
});

test('escapes double quotes inside company names', () => {
  const application = {
    ...testApplications[0],
    company: 'Example "Studio"',
  };

  const result = applicationsToCsv([application]);
  const dataRow = result.split('\r\n')[1];

  expect(dataRow.startsWith('"1","Example ""Studio""",')).toBe(true);
});

test('preserves line breaks inside quoted notes', () => {
  const application = {
    ...testApplications[0],
    notes: 'First interview completed.\nWaiting for feedback.',
  };

  const result = applicationsToCsv([application]);

  expect(result).toContain(
    ',"First interview completed.\nWaiting for feedback.",',
  );
});

test('exports missing optional fields as empty cells', () => {
  const application = {
    ...testApplications[0],
    salaryRange: undefined,
    source: undefined,
    notes: undefined,
    followUpAt: undefined,
  };

  const result = applicationsToCsv([application]);
  const dataRow = result.split('\r\n')[1];

  expect(dataRow.endsWith(',"","","",""')).toBe(true);
  expect(result).not.toContain('undefined');
});

test('prefixes formula-like company names with an apostrophe', () => {
  const application = {
    ...testApplications[0],
    company: '=1+1',
  };

  const result = applicationsToCsv([application]);
  const dataRow = result.split('\r\n')[1];

  expect(dataRow.startsWith(`"1","'=1+1",`)).toBe(true);
});
