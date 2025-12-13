'use client';

import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostJobDialog } from './post-job-dialog';
import { useState } from 'react';

export function Header() {
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center mx-auto">
          <div className="flex items-center gap-2 mr-auto">
            <Building2 className="h-6 w-6 text-secondary" />
            <span className="text-xl font-bold font-headline text-secondary">蓝领快聘</span>
          </div>
          <Button onClick={() => setIsPostJobOpen(true)}>发布职位</Button>
        </div>
      </header>
      <PostJobDialog isOpen={isPostJobOpen} onOpenChange={setIsPostJobOpen} />
    </>
  );
}
