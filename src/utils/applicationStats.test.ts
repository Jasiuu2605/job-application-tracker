import { expect, test } from 'vitest';
import { calculateApplicationStats } from './applicationStats';

import type { JobApplication } from '../types/application';

import { testApplications } from '../tests/fixtures/applications';

test('returns zero statistics for an empty list', () => {
  const result = calculateApplicationStats([]);

  expect(result).toEqual({
    total: 0,
    interviews: 0,
    rejected: 0,
    offers: 0,
  });
});

test('counts multiple interview applications', () => {
  const application: JobApplication = {
    id: 'test-1',
    company: 'Example Company',
    position: 'Frontend Developer',
    location: 'Warsaw',
    workMode: 'remote',
    status: 'interview',
    appliedAt: '2026-09-01',
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  };

  const secondApplication: JobApplication = {
    ...application,
    id: 'test-2',
  };

  const result = calculateApplicationStats([application, secondApplication]);

  expect(result).toEqual({
    total: 2,
    interviews: 2,
    rejected: 0,
    offers: 0,
  });
});

test('counts applications with different statuses', () => {
  const result = calculateApplicationStats(testApplications);

  expect(result).toEqual({
    total: 5,
    interviews: 1,
    rejected: 1,
    offers: 1,
  });
});
