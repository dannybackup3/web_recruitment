'use server';

/**
 * @fileOverview Implements the automatic job matching flow for workers.
 *
 * - autoMatchJobs - A function that takes worker skills and experience and returns a list of matching job postings.
 * - AutoMatchJobsInput - The input type for the autoMatchJobs function.
 * - AutoMatchJobsOutput - The return type for the autoMatchJobs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoMatchJobsInputSchema = z.object({
  workerSkills: z.string().describe('The skills of the worker.'),
  workerExperience: z.string().describe('The experience of the worker.'),
  jobPostings: z.string().describe('A list of job postings.'),
});
export type AutoMatchJobsInput = z.infer<typeof AutoMatchJobsInputSchema>;

const AutoMatchJobsOutputSchema = z.object({
  matchedJobs: z.string().describe('A list of job postings that match the worker skills and experience.'),
});
export type AutoMatchJobsOutput = z.infer<typeof AutoMatchJobsOutputSchema>;

export async function autoMatchJobs(input: AutoMatchJobsInput): Promise<AutoMatchJobsOutput> {
  return autoMatchJobsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoMatchJobsPrompt',
  input: {schema: AutoMatchJobsInputSchema},
  output: {schema: AutoMatchJobsOutputSchema},
  prompt: `You are an expert in matching workers with job postings.

  Given the following worker skills:
  {{workerSkills}}

  And the following worker experience:
  {{workerExperience}}

  And the following job postings:
  {{jobPostings}}

  Return a list of job postings that match the worker skills and experience.
  `,
});

const autoMatchJobsFlow = ai.defineFlow(
  {
    name: 'autoMatchJobsFlow',
    inputSchema: AutoMatchJobsInputSchema,
    outputSchema: AutoMatchJobsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
