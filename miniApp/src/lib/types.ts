export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  duration: string;
  workingPeriod?: string;
  createdAt: number; // 时间戳，职位发布时间
}
