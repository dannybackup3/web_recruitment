'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Job } from '@/lib/types';
import { findMatchingJobs } from '@/app/actions';
import { Loader2, Sparkles } from 'lucide-react';
import { mockJobs } from '@/lib/data';
import { Separator } from './ui/separator';

const formSchema = z.object({
  name: z.string().min(2, { message: '姓名至少需要2个字符' }),
  contact: z.string().min(5, { message: '请输入有效的联系方式' }),
  skills: z.string().min(2, { message: '请简述您的技能' }),
  experience: z.string().min(10, { message: '工作经验至少需要10个字符' }),
});

type ApplyDialogProps = {
  job: Job;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function ApplyDialog({ job, isOpen, onOpenChange }: ApplyDialogProps) {
  const { toast } = useToast();
  const [isAIPending, startAITransition] = useTransition();
  const [aiResults, setAiResults] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', contact: '', skills: '', experience: '' },
  });

  function onApplySubmit(values: z.infer<typeof formSchema>) {
    console.log('Application Submitted:', values);
    toast({
      title: '应聘成功!',
      description: `您已成功应聘 ${job.title} 职位。`,
    });
    form.reset();
    onOpenChange(false);
  }

  const handleFindMatches = (data: z.infer<typeof formSchema>) => {
    setAiResults(null);
    startAITransition(async () => {
      const allJobsString = mockJobs
        .map(j => `职位: ${j.title}, 公司: ${j.company}, 描述: ${j.description}, 地点: ${j.location}`)
        .join('\n---\n');
      
      try {
        const result = await findMatchingJobs({
          workerSkills: data.skills,
          workerExperience: data.experience,
          jobPostings: allJobsString,
        });
        setAiResults(result.matchedJobs);
      } catch (error) {
        console.error("AI Matching failed:", error);
        toast({
          variant: "destructive",
          title: "AI 匹配失败",
          description: "抱歉，AI智能匹配服务当前不可用，请稍后再试。",
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-secondary">应聘职位: {job.title}</DialogTitle>
          <DialogDescription>
            填写您的信息以完成应聘。您也可以使用AI来发现更多适合您的工作机会。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onApplySubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>您的姓名</FormLabel>
                    <FormControl><Input placeholder="张三" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>联系方式</FormLabel>
                    <FormControl><Input placeholder="电话或微信" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>我的技能</FormLabel>
                  <FormControl><Textarea placeholder="例如：电焊、开挖掘机、烹饪..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>工作经验</FormLabel>
                  <FormControl>
                    <Textarea placeholder="请详细描述您过去的工作经历和项目经验..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">确认应聘</Button>
            </div>
          </form>
        </Form>
        
        <Separator className="my-4" />

        <div className="space-y-4">
            <div className='text-center'>
                <h3 className="text-lg font-semibold text-secondary">AI 智能匹配</h3>
                <p className="text-sm text-muted-foreground">
                    让 AI 基于您的技能和经验，在所有职位中为您推荐最合适的选择。
                </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={form.handleSubmit(handleFindMatches)}
              disabled={isAIPending}
            >
              {isAIPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
              )}
              {isAIPending ? 'AI 正在为您分析...' : '开始智能匹配'}
            </Button>
          
            {aiResults && (
              <div className="mt-4 p-4 bg-accent rounded-lg border">
                <h4 className="font-bold mb-2">AI 推荐结果:</h4>
                <p className="text-sm whitespace-pre-wrap font-sans">{aiResults}</p>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
