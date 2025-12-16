
import { useState, useMemo, useEffect } from 'react';
import { View, ScrollView, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { JobCard } from '@/components/job-card';
import type { Job } from '@/lib/types';
import { getJobs } from '@/lib/api';
import { JobSearchFilters } from '@/components/job-search-filters';
import { Header } from '@/components/header';
import { PostJobDialog } from '@/components/post-job-dialog';

import './index.scss';

function NoResults() {
  return (
    <View className='no-results'>
      <Text className='no-results__title'>没有找到匹配的职位</Text>
      <Text className='no-results__subtitle'>请尝试调整您的搜索条件。</Text>
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
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

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

  useEffect(() => {
    loadJobs();
    
    // Listen for events to refresh data
    const handleRefresh = () => loadJobs();
    Taro.eventCenter.on('jobPosted', handleRefresh);
    Taro.eventCenter.on('modeSwitched', handleRefresh);

    return () => {
      Taro.eventCenter.off('jobPosted', handleRefresh);
      Taro.eventCenter.off('modeSwitched', handleRefresh);
    };
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const keywordMatch =
        !filters.keyword ||
        job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.keyword.toLowerCase());

      const typeMatch = filters.type === 'all' || job.type === filters.type;
      const locationMatch = filters.location === 'all' || job.location === filters.location;

      return keywordMatch && typeMatch && locationMatch;
    });
  }, [jobs, filters]);

  const [headerHeight, setHeaderHeight] = useState(80);
   useEffect(() => {
    const query = Taro.createSelectorQuery();
    query.select('.header').boundingClientRect(rect => {
      if (rect) {
        setHeaderHeight(rect.height);
      }
    }).exec();
  }, []);

  return (
    <View className='index-page'>
      <Header onPostJobClick={() => setIsPostJobOpen(true)} />
      
      <ScrollView
        scrollY
        className='scroll-view'
        style={{ height: `calc(100vh - ${headerHeight}px)` }}
      >
        <View className='page-container'>
          <View className='page-header'>
            <Text className='page-header__title'>寻找最适合您的工作</Text>
            <Text className='page-header__subtitle'>数千个蓝领职位等着您，马上开始搜索。</Text>
          </View>

          <JobSearchFilters filters={filters} onFiltersChange={setFilters} />

          {isLoading ? (
            <View className='loading-container'>
              <ActivityIndicator mode='center' content='加载中...' size={48} />
            </View>
          ) : filteredJobs.length > 0 ? (
            <View className='job-list'>
              {filteredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </View>
          ) : (
            <NoResults />
          )}
        </View>
      </ScrollView>

      <PostJobDialog
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
      />
    </View>
  );
}
