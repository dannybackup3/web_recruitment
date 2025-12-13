'use server';

import { autoMatchJobs, type AutoMatchJobsInput, type AutoMatchJobsOutput } from '@/ai/flows/auto-match-jobs';

export async function findMatchingJobs(input: AutoMatchJobsInput): Promise<AutoMatchJobsOutput> {
  // In a real application, you might add authentication and validation here.
  console.log('Calling AI to match jobs with input:', input.workerSkills);
  const result = await autoMatchJobs(input);
  return result;
}
