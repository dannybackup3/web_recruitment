import type { Job } from '../types';
import { isRemote, getApiBase } from './config';
import mockJobs from '../data/mockJobs.json';

/**
 * 发布岗位，自动区分本地/远程模式。
 */
export async function postJob(job: Omit<Job, 'id'>): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!isRemote()) {
    // 本地模式仅模拟成功
    return { success: true, id: (Math.random().toString(36).slice(2) + Date.now()) };
  } else {
    const base = getApiBase();
    const res = await fetch(`${base}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
    if (!res.ok) {
      return { success: false, error: `发布失败: ${res.status}` };
    }
    const data = await res.json();
    return { success: true, id: data.id };
  }
}

/**
 * 获取岗位列表，自动区分本地/远程模式。
 */
export async function listJobs(): Promise<Job[]> {
  if (!isRemote()) {
    return mockJobs;
  } else {
    const base = getApiBase();
    const res = await fetch(`${base}/jobs`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  }
}

/**
 * 根据ID获取岗位，自动区分本地/远程模式。
 */
export async function getJobById(id: string): Promise<Job | undefined> {
  if (!isRemote()) {
    return mockJobs.find(j => j.id === id);
  } else {
    const jobs = await listJobs();
    return jobs.find(j => j.id === id);
  }
}
