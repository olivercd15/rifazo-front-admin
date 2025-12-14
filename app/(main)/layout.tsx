'use client';

import React from 'react';
import Layout from '@/layout/layout';
import AuthGuard from '@/components/AuthGuard';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <Layout>{children}</Layout>
        </AuthGuard>
    );
}
