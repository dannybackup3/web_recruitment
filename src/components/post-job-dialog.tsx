'use client';

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
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { jobTypes, locations } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { createJob } from '@/lib/api';

const formSchema = z.object({
  title: z.string().min(2, { message: '职位名称至少需要2个字符' }),
  company: z.string().min(2, { message: '公司名称至少需要2个字符' }),
  location: z.string({ required_error: '请选择工作地点' }),
  type: z.string({ required_error: '请选择工作类型' }),
  salary: z.string().min(3, { message: '请填写薪资范围' }),
  duration: z.string().min(1, { message: '请填写用工天数' }),
  contactPhone: z.string().optional(),
  workingPeriod: z.string().optional(),
  description: z.string().min(10, { message: '职位描述至少需要10个字符' }),
});

type PostJobDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onJobPosted?: () => void;
};

export function PostJobDialog({ isOpen, onOpenChange, onJobPosted }: PostJobDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      company: '',
      salary: '',
      duration: '',
      workingPeriod: '',
      description: '',
      contactPhone: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createJob(values);
      toast({
        title: '发布成功',
        description: '您的职位信息已成功发布。',
      });
      form.reset();
      onOpenChange(false);
      onJobPosted?.();
      window.dispatchEvent(new Event('jobPosted'));
    } catch (error) {
      console.error('Failed to post job:', error);
      toast({
        title: '发布失败',
        description: '发布职位时出错，请稍后重试。',
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] flex flex-col max-h-[90svh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-secondary">发布新的用工需求</DialogTitle>
          <DialogDescription>填写职位信息，让合适的工人快速找到您。</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>职位名称</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：电焊工" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>公司名称</FormLabel>
                      <FormControl>
                        <Input placeholder="您的公司或团队名称" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>工作地点</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择工作地点" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map(loc => (
                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>工作类型</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择工作类型" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jobTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>薪资范围</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：300-500元/天" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>用工天数</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：90天 或 长期" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="workingPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>用工时段 (可选)</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：8月-12月" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>联系电话 (可选)</FormLabel>
                      <FormControl>
                        <Input placeholder="请填写电话或微信号" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>职位描述</FormLabel>
                    <FormControl>
                      <Textarea placeholder="详细描述工作内容、要求等..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button type="submit">确认发布</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
