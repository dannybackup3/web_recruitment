/**
 * Configuration for data source mode
 * 'local' - uses mock data
 * 'api' - uses Cloudflare Worker API
 */

export type DataSourceMode = 'local' | 'api';

export const DEFAULT_MODE: DataSourceMode = 'local';

const MODE_STORAGE_KEY = 'job_data_source_mode';

export function getMode(): DataSourceMode {
  if (typeof window === 'undefined') {
    return DEFAULT_MODE;
  }
  
  const stored = localStorage.getItem(MODE_STORAGE_KEY) as DataSourceMode | null;
  return stored === 'api' ? 'api' : 'local';
}

export function setMode(mode: DataSourceMode): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.setItem(MODE_STORAGE_KEY, mode);
  window.dispatchEvent(new CustomEvent('dataSourceModeChange', { detail: mode }));
}
