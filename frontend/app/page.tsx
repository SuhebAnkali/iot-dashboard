'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? '/dashboard' : '/login');
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-base">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal-cyan border-t-transparent" />
    </div>
  );
}
