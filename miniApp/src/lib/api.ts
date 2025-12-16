import type { Job } from '@/lib/types';
import { mockJobs } from '@/lib/data';
import { getMode } from '@/lib/config';
import Taro from '@tarojs/taro';

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

  const response = await Taro.request({
    url,
    method: 'GET',
    header: {
      'Content-Type': 'application/json',
    },
  });
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`API Error: ${response.statusCode} ${response.errMsg}`);
  }
  return response.data;
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

      const response = await Taro.request({
        url,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
        },
        data: job,
      });
      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw new Error(`API Error: ${response.statusCode} ${response.errMsg}`);
      }
      const result = response.data;
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
