import type { Job } from '@/lib/types';
import { mockJobs } from '@/lib/data';
import { getMode } from '@/lib/config';

function getAPIBaseURL(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || '';
  }

  const configuredURL = process.env.NEXT_PUBLIC_API_URL;
  if (configuredURL) {
    return configuredURL;
  }

  return '';
}

async function fetchFromAPI(endpoint: string): Promise<Job[]> {
  const baseURL = getAPIBaseURL();
  const url = baseURL ? `${baseURL}${endpoint}` : `/api${endpoint}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getJobs(): Promise<Job[]> {
  const mode = getMode();

  if (mode === 'api') {
    try {
      return await fetchFromAPI('/jobs');
    } catch (error) {
      console.error('Failed to fetch jobs from API, falling back to local data:', error);
      return mockJobs;
    }
  }

  return mockJobs;
}

export async function createJob(job: Omit<Job, 'id'>): Promise<Job> {
  const mode = getMode();

  if (mode === 'api') {
    try {
      const baseURL = getAPIBaseURL();
      const url = baseURL ? `${baseURL}/jobs` : '/api/jobs';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(job),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return {
        ...job,
        id: result.id,
      };
    } catch (error) {
      console.error('Failed to create job via API:', error);
      throw error;
    }
  }

  const id = Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  return {
    ...job,
    id,
  };
}
