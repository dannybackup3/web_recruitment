'use client';

import { useState, useMemo } from 'react';
import type { Job } from '@/lib/types';
import { mockJobs } from '@/lib/data';
import { JobSearchFilters } from '@/components/job-search-filters';
import { JobCard } from '@/components/job-card';
import { ApplyDialog } from '@/components/apply-dialog';

export default function Home() {
  const [filters, setFilters] = useState({
    keyword: '',
    type: 'all',
    location: 'all',
  });
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
      const keywordMatch =
        filters.keyword === '' ||
        job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.keyword.toLowerCase());

      const typeMatch = filters.type === 'all' || job.type === filters.type;
      const locationMatch = filters.location === 'all' || job.location === filters.location;

      return keywordMatch && typeMatch && locationMatch;
    });
  }, [filters]);

  const handleApply = (job: Job) => {
    setSelectedJob(job);
  };

  const handleCloseDialog = () => {
    setSelectedJob(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-secondary">寻找最适合您的工作</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          数千个蓝领职位等着您，马上开始搜索。
        </p>
      </header>

      <JobSearchFilters filters={filters} onFiltersChange={setFilters} />

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 animate-in fade-in-50">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} onApply={() => handleApply(job)} />
          ))}
        </div>
      ) : (
        <div className="text-center mt-16 py-12 bg-card rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-muted-foreground">没有找到匹配的职位</h2>
            <p className="text-muted-foreground mt-2">请尝试调整您的搜索条件。</p>
        </div>
      )}

      {selectedJob && (
        <ApplyDialog
          job={selectedJob}
          isOpen={!!selectedJob}
          onOpenChange={isOpen => !isOpen && handleCloseDialog()}
        />
      )}
    </div>
  );
}
