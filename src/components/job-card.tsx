'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Job } from '@/services/types';
import { MapPin, JapaneseYen, CalendarDays, Clock, Phone, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type JobCardProps = {
  job: Job;
};

const WeChatIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      {...props}
    >
      <path
        d="M 25 4 C 12.866 4 4 12.435 4 24 C 4 29.89 6.381 35.131 10.125 39.01 L 8.303 45.697 L 15.42 43.729 C 18.248 45.087 21.503 45.834 25 45.834 C 37.134 45.834 46 37.399 46 25.834 C 46 14.269 37.134 5.834 25 5.834 C 24.045 5.834 23.099 5.885 22.164 5.986 C 22.956 5.253 23.948 4.793 25 4 Z M 19.99 15.834 C 20.545 15.834 21 16.289 21 16.834 C 21 17.379 20.545 17.834 19.99 17.834 C 19.435 17.834 18.98 17.379 18.98 16.834 C 18.98 16.289 19.435 15.834 19.99 15.834 Z M 29.99 15.834 C 30.545 15.834 31 16.289 31 16.834 C 31 17.379 30.545 17.834 29.99 17.834 C 29.435 17.834 28.98 17.379 28.98 16.834 C 28.98 16.289 29.435 15.834 29.99 15.834 Z M 25 7.834 C 35.504 7.834 44 15.88 44 25.834 C 44 35.788 35.504 43.834 25 43.834 C 21.758 43.834 18.72 43.08 16.148 41.748 L 15.42 41.531 L 10.303 42.984 L 11.889 37.662 L 11.666 36.91 C 8.646 33.911 7 29.621 7 25 C 7 13.965 15.059 4 25 4 C 30.137 4 34.693 5.922 38.07 8.988 C 34.257 7.032 29.813 5.834 25 5.834 C 14.496 5.834 6 13.88 6 23.834 C 6 24.969 6.131 26.074 6.377 27.143 C 6.338 26.699 6.313 26.26 6.313 25.834 C 6.313 15.344 14.731 7.834 25 7.834 Z"
        fill="currentColor"
      />
    </svg>
  );

export function JobCard({ job }: JobCardProps) {
  const { toast } = useToast();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (job.contactPhone) {
      navigator.clipboard.writeText(job.contactPhone);
      toast({
        title: '复制成功',
        description: '联系电话已复制到剪贴板。',
      });
    }
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-secondary">{job.title}</CardTitle>
          <Badge variant="secondary">{job.type}</Badge>
        </div>
        <CardDescription className="font-semibold pt-1">{job.company}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <JapaneseYen className="w-4 h-4 mr-2" />
          <span className="font-semibold text-primary">{job.salary}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
            <CalendarDays className="w-4 h-4 mr-2" />
            <span>用工天数: {job.duration}</span>
        </div>
        {job.workingPeriod && (
          <div className="flex items-center text-muted-foreground">
              <Clock className="w-4 h-4 mr-2" />
              <span>用工时段: {job.workingPeriod}</span>
          </div>
        )}

        {job.contactPhone && (
           <div 
             className="flex items-center text-muted-foreground cursor-pointer"
             onClick={handleCopy}
             title="点击复制电话/微信号"
           >
             <Phone className="w-4 h-4 mr-2" />
             <WeChatIcon className="w-4 h-4 mr-2 fill-current" />
             <span>{job.contactPhone}</span>
             <Copy className="w-3 h-3 ml-2 text-muted-foreground" />
           </div>
        )}
        
        <p className="text-sm text-muted-foreground pt-2 whitespace-pre-wrap">
          {job.description}
        </p>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  );
}
