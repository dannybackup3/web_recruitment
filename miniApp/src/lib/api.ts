import type { Job } from '@/lib/types';
import { mockJobs } from '@/lib/data';
import { getMode } from '@/lib/config';
import Taro from '@tarojs/taro';

function getAPIBaseURL(): string {
  // Use a publicly accessible development server or a configurable URL for production
  return 'https://recruitment.takeanything.store'; // Replace with your actual worker URL if deployed
}

async function fetchFromAPI(endpoint: string, options: Taro.request.Option = { method: 'GET' }): Promise<any> {
  const url = `${getAPIBaseURL()}${endpoint}`;

  try {
    const response = await Taro.request({
      ...options,
      url,
      header: {
        'Content-Type': 'application/json',
        ...(options.header || {}),
      },
    });

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return response.data;
    } else {
      throw new Error(`API Error: ${response.statusCode} ${response.errMsg}`);
    }
  } catch (error) {
    console.error(`Fetch from API failed: ${url}`, error);
    throw error;
  }
}

export async function getJobs(): Promise<Job[]> {
  const mode = getMode();

  if (mode === 'api') {
    try {
      return await fetchFromAPI('/jobs');
    } catch (error) {
      console.error('Failed to fetch jobs from API, falling back to local data:', error);
      Taro.showToast({ title: 'API请求失败，使用本地数据', icon: 'none' });
      return mockJobs;
    }
  }
  
  // Return a copy to prevent mutation
  return [...mockJobs];
}

export async function createJob(job: Omit<Job, 'id' | 'createdAt'>): Promise<Job> {
  const mode = getMode();

  if (mode === 'api') {
    try {
      const result = await fetchFromAPI('/jobs', {
        method: 'POST',
        data: job,
      });
      // The API should return the full job object or at least the new ID and createdAt.
      // 优先用API返回的createdAt，否则用本地时间
      return { ...job, id: result.id, createdAt: result.createdAt || Date.now() };
    } catch (error) {
      console.error('Failed to create job via API:', error);
      throw error; // Re-throw to be handled by the caller
    }
  }

  // Local mode: simulate creating a job
  console.log('Simulating job creation in local mode:', job);
  const newId = `mock_${Date.now()}`;
  const newJob = { ...job, id: newId, createdAt: Date.now() };
  mockJobs.unshift(newJob); // Add to the top of the list
  return newJob;
}
