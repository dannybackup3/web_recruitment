'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Job } from '@/lib/types';
import { Briefcase, MapPin, CircleDollarSign, CalendarDays, Clock, Phone, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type JobCardProps = {
  job: Job;
};

export function JobCard({ job }: JobCardProps) {
  const { toast } = useToast();

  const handleCopy = () => {
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
          <CircleDollarSign className="w-4 h-4 mr-2" />
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
        <p className="text-sm text-muted-foreground pt-2 line-clamp-2">
          {job.description}
        </p>

        {job.contactPhone && (
           <div 
             className="flex items-center justify-center text-center p-3 my-4 bg-accent rounded-md cursor-pointer hover:bg-secondary/10 transition-colors"
             onClick={handleCopy}
             title="点击复制电话号码"
           >
             <Phone className="w-5 h-5 mr-3 text-secondary" />
             <span className="font-bold text-lg text-secondary tracking-wider">{job.contactPhone}</span>
           </div>
        )}

      </CardContent>
      <CardFooter>
         <Button className="w-full" variant="outline">
            查看详情
          </Button>
      </CardFooter>
    </Card>
  );
}
