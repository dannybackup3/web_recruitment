import { View, Picker, Input, Button, Text, Textarea } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { createJob } from '@/lib/api';
import { jobTypes, locations } from '@/lib/data';
import type { Job } from '@/lib/types';
import { X } from 'lucide-react';
import './post-job-dialog.scss';

type PostJobDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FormData = Omit<Job, 'id'>;

export function PostJobDialog({ isOpen, onClose }: PostJobDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    company: '',
    location: '',
    type: '',
    salary: '',
    duration: '',
    description: '',
    workingPeriod: '',
    // ...existing code...
  });

  if (!isOpen) {
    return null;
  }

  const handleChange = (field: keyof FormData, value: any) => {
     setFormData(prev => ({ ...prev, [field]: value.detail ? value.detail.value : value }));
  };

  const handleLocationChange = e => {
    const index = e.detail.value;
    handleChange('location', locations[index]);
  };

  const handleTypeChange = e => {
    const index = e.detail.value;
    handleChange('type', jobTypes[index]);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      Taro.showToast({ title: '请填写职位名称', icon: 'none' });
      return false;
    }
    if (!formData.company.trim()) {
      Taro.showToast({ title: '请填写公司名称', icon: 'none' });
      return false;
    }
    if (!formData.location) {
      Taro.showToast({ title: '请选择工作地点', icon: 'none' });
      return false;
    }
    if (!formData.type) {
      Taro.showToast({ title: '请选择工作类型', icon: 'none' });
      return false;
    }
     if (!formData.salary) {
      Taro.showToast({ title: '请填写薪资范围', icon: 'none' });
      return false;
    }
     if (!formData.duration) {
      Taro.showToast({ title: '请填写用工天数', icon: 'none' });
      return false;
    }
    if (formData.description.length < 10) {
      Taro.showToast({ title: '职位描述至少10个字符', icon: 'none' });
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      Taro.showLoading({ title: '发布中...' });
      await createJob(formData);
      Taro.hideLoading();
      Taro.showToast({
        title: '发布成功',
        icon: 'success',
      });
      onClose();
      Taro.eventCenter.trigger('jobPosted');
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: '发布失败，请重试',
        icon: 'none',
      });
    }
  };

  const FormItem = ({ label, children }) => (
    <View className='form-item'>
        <Text className='form-item__label'>{label}</Text>
        <View className='form-item__control'>{children}</View>
    </View>
  )

  return (
    <View className='float-layout'>
      <View className='float-layout__overlay' onClick={onClose} />
      <View className='float-layout__container'>
        <View className='float-layout__header'>
            <Text className='float-layout__title'>发布新的用工需求</Text>
            <View onClick={onClose} className='float-layout__close'>
                <X size={20} color='#888' />
            </View>
        </View>
        <View className='form-content'>
            <FormItem label='职位名称'>
                <Input name='title' type='text' placeholder='例如：电焊工' value={formData.title} onInput={v => handleChange('title', v)} />
            </FormItem>
            <FormItem label='公司名称'>
                <Input name='company' type='text' placeholder='您的公司或团队名称' value={formData.company} onInput={v => handleChange('company', v)} />
            </FormItem>
            
            <Picker mode='selector' range={locations} onChange={handleLocationChange}>
              <FormItem label='工作地点'>
                <Text className={formData.location ? '' : 'placeholder'}>{formData.location || '请选择'}</Text>
              </FormItem>
            </Picker>
            
            <Picker mode='selector' range={jobTypes} onChange={handleTypeChange}>
              <FormItem label='工作类型'>
                <Text className={formData.type ? '' : 'placeholder'}>{formData.type || '请选择'}</Text>
              </FormItem>
            </Picker>

            <FormItem label='薪资范围'>
                <Input name='salary' type='text' placeholder='例如：300-500元/天' value={formData.salary} onInput={v => handleChange('salary', v)} />
            </FormItem>
            <FormItem label='用工天数'>
                <Input name='duration' type='text' placeholder='例如：90天 或 长期' value={formData.duration} onInput={v => handleChange('duration', v)} />
            </FormItem>
             <FormItem label='用工时段'>
                <Input name='workingPeriod' type='text' placeholder='(选填) 例如：8月-12月' value={formData.workingPeriod || ''} onInput={v => handleChange('workingPeriod', v)} />
            </FormItem>           
            <View className='form-item'>
                <Text className='form-item__label'>职位描述</Text>
                 <Textarea
                    className='form-item__textarea'
                    value={formData.description}
                    onInput={e => handleChange('description', e)}
                    maxlength={300}
                    placeholder='详细描述工作内容、要求等...'
                />
            </View>

            <View className='form-footer'>
                <Button className='primary-button' onClick={handleSubmit}>确认发布</Button>
            </View>
        </View>
      </View>
    </View>
  );
}
