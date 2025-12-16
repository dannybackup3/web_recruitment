import type { Job } from '@/lib/types';

export const jobTypes: string[] = ['焊工', '铆工', '建筑工'];
export const locations = ['北京', '上海', '广州', '深圳', '成都', '杭州', '重庆', '武汉', '雄安', '天津'];

export const mockJobs: Job[] = [
  {
    id: '1',
    title: '建筑结构工',
    company: '中国建筑第八工程局',
    location: '北京',
    salary: '300-450元/天',
    type: '建筑工',
    description: '负责大型商业综合体项目的主体结构施工，要求熟悉图纸，有高层建筑经验者优先。提供五险一金和住宿。',
    duration: '90天',
    workingPeriod: '7月-9月',
    contactPhone: '13812345678',
  },
  {
    id: '2',
    title: '高级电焊工（TIG/MIG）',
    company: '上海船舶制造厂',
    location: '上海',
    salary: '400-600元/天',
    type: '焊工',
    description: '需要持有6G焊工证，精通TIG和MIG焊接工艺，负责船舶关键部件的焊接。有压力容器焊接经验者优先。',
    duration: '长期',
    contactPhone: '13987654321',
  },
  {
    id: '3',
    title: '桥梁铆工',
    company: '中铁大桥局集团',
    location: '武汉',
    salary: '350-550元/天',
    type: '铆工',
    description: '参与长江大桥的钢结构铆接工作，要求熟练使用风动铆钉枪，能够高空作业，身体素质好。',
    duration: '180天',
    workingPeriod: '6月-11月',
    contactPhone: '13711223344',
  }
];
