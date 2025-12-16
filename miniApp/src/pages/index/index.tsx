'use client';

import { useState, useMemo, useEffect } from 'react';
import { View } from '@tarojs/components';
import { JobCard } from '@/components/job-card';
import type { Job } from '@/lib/types';
import { getJobs } from '@/lib/api';
import { JobSearchFilters } from '@/components/job-search-filters';
import { Skeleton } from '@/components/ui/skeleton';


function JobCardSkeleton() {
    return (
      <View className="p-4 border rounded-lg space-y-3">
        <View className="flex justify-between">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/6" />
        </View>
        <Skeleton className="h-4 w-1/2" />
        <View className="space-y-2 pt-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
        </View>
        <Skeleton className="h-10 w-full pt-2" />
      </View>
    );
  }

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    type: 'all',
    location: 'all',
  });

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (error) {
        console.error('Failed to load jobs:', error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();

    const handleModeChange = () => {
      loadJobs();
    };

    const handleJobPosted = () => {
      loadJobs();
    };

    window.addEventListener('dataSourceModeChange', handleModeChange);
    window.addEventListener('jobPosted', handleJobPosted);
    return () => {
      window.removeEventListener('dataSourceModeChange', handleModeChange);
      window.removeEventListener('jobPosted', handleJobPosted);
    };
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const keywordMatch =
        filters.keyword === '' ||
        job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.keyword.toLowerCase());

      const typeMatch = filters.type === 'all' || job.type === filters.type;
      const locationMatch = filters.location === 'all' || job.location === filters.location;

      return keywordMatch && typeMatch && locationMatch;
    });
  }, [jobs, filters]);

  return (
    <>
      <View className="container mx-auto rpx-4 py-8 md:rpx-6 md:py-12">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold font-headline text-secondary">寻找最适合您的工作</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            数千个蓝领职位等着您，马上开始搜索。
          </p>
        </header>

        <JobSearchFilters filters={filters} onFiltersChange={setFilters} />

        {isLoading ? (
          <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 animate-in fade-in-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </View>
        ) : filteredJobs.length > 0 ? (
          <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 animate-in fade-in-50">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </View>
        ) : (
          <View className="text-center mt-16 py-12 bg-card rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-muted-foreground">没有找到匹配的职位</h2>
              <p className="text-muted-foreground mt-2">请尝试调整您的搜索条件。</p>
          </View>
        )}
      </View>
    </>
  );
}
