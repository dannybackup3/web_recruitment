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
import { Briefcase, MapPin, CircleDollarSign } from 'lucide-react';

type JobCardProps = {
  job: Job;
  onApply: (job: Job) => void;
};

export function JobCard({ job, onApply }: JobCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-secondary">{job.title}</CardTitle>
          <Badge variant="secondary">{job.type}</Badge>
        </div>
        <CardDescription className="font-semibold">{job.company}</CardDescription>
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
        <p className="text-sm text-muted-foreground pt-2 line-clamp-2">
          {job.description}
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onApply(job)}>
          立即应聘
        </Button>
      </CardFooter>
    </Card>
  );
}
