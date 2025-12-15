'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { jobTypes, locations } from '@/data/mockJobs';

type JobSearchFiltersProps = {
  filters: {
    keyword: string;
    type: string;
    location: string;
  };
  onFiltersChange: (filters: JobSearchFiltersProps['filters']) => void;
};

export function JobSearchFilters({ filters, onFiltersChange }: JobSearchFiltersProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, keyword: e.target.value });
  };

  const handleTypeChange = (value: string) => {
    onFiltersChange({ ...filters, type: value });
  };

  const handleLocationChange = (value: string) => {
    onFiltersChange({ ...filters, location: value });
  };

  return (
    <div className="p-6 bg-card rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="搜索职位、公司..."
          value={filters.keyword}
          onChange={handleInputChange}
          className="md:col-span-1"
        />
        <Select value={filters.type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="所有工种" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有工种</SelectItem>
            {jobTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.location} onValueChange={handleLocationChange}>
          <SelectTrigger>
            <SelectValue placeholder="所有地区" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有地区</SelectItem>
            {locations.map(location => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
