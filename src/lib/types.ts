export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: '全职' | '兼职' | '合同工';
  description: string;
}
