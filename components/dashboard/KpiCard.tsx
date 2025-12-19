'use client';

import { Card } from 'primereact/card';

type Props = {
    title: string;
    value: number | string;
    icon: string;
    color?: string;
};

const KpiCard = ({ title, value, icon, color = 'var(--primary-color)' }: Props) => {
    return (
        <Card className="h-full">
            <div className="flex align-items-center justify-content-between">
                <div>
                    <span className="block text-500 mb-2">{title}</span>
                    <span className="text-900 text-3xl font-bold">{value}</span>
                </div>
                <i className={`pi ${icon}`} style={{ fontSize: '2.5rem', color }} />
            </div>
        </Card>
    );
};

export default KpiCard;
