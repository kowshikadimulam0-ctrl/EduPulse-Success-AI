/**
 * Data provider for the Student Analytics Platform
 * Generates and caches the 1,500 deterministic synthetic student journeys.
 */

import { Student } from '@/lib/types';
import { generateStudentDataset } from '@/lib/generateData';

let cachedStudents: Student[] | null = null;

export function getStudents(): Student[] {
  if (cachedStudents) return cachedStudents;

  // Generate deterministically using Mulberry32 PRNG (seed: 202610)
  cachedStudents = generateStudentDataset(202610);
  return cachedStudents;
}

export function getStudentById(id: string): Student | undefined {
  const students = getStudents();
  return students.find((s) => s.id === id);
}
