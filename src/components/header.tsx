'use client';

import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostJobDialog } from './post-job-dialog';
import { useState, useEffect } from 'react';
import { getMode, setMode } from '@/lib/config';
import type { DataSourceMode } from '@/lib/config';

export function Header() {
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [mode, setCurrentMode] = useState<DataSourceMode>('local');

  useEffect(() => {
    setCurrentMode(getMode());

    const handleModeChange = (event: Event) => {
      const customEvent = event as CustomEvent<DataSourceMode>;
      setCurrentMode(customEvent.detail);
    };

    window.addEventListener('dataSourceModeChange', handleModeChange);
    return () => {
      window.removeEventListener('dataSourceModeChange', handleModeChange);
    };
  }, []);

  const handleModeSwitch = () => {
    const newMode: DataSourceMode = mode === 'local' ? 'api' : 'local';
    setMode(newMode);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center mx-auto">
          <div className="flex items-center gap-2 mr-auto">
            <Building2 className="h-6 w-6 text-secondary" />
            <span className="text-xl font-bold font-headline text-secondary">蓝领快聘</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleModeSwitch}
              title={mode === 'local' ? '切换到 API 模式' : '切换到本地模式'}
            >
              {mode === 'local' ? '本地模式' : 'API 模式'}
            </Button>
            <Button onClick={() => setIsPostJobOpen(true)}>发布职位</Button>
          </div>
        </div>
      </header>
      <PostJobDialog isOpen={isPostJobOpen} onOpenChange={setIsPostJobOpen} />
    </>
  );
}
