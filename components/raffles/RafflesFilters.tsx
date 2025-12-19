'use client';

import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

type Props = {
    status?: string;
    timeSlot?: string;
    title?: string;
    onChange: (f: { status?: string; timeSlot?: string; title?: string }) => void;
};

const statusOptions = [
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
];

const timeSlotsOptions = [
    { label: 'Morning', value: 'morning' },
    { label: 'Afternoon', value: 'afternoon' },
    { label: 'Evening', value: 'evening' }
];

const RaffleFilters = ({ status, timeSlot, title, onChange }: Props) => {
    return (
        <div className="card mb-3">
            <div className="grid">
                <div className="col-12 md:col-3">
                    <label className="block mb-2 font-medium">Estado</label>
                    <Dropdown value={status} options={statusOptions} showClear className="w-full" onChange={(e) => onChange({ status: e.value, timeSlot, title })} />
                </div>

                <div className="col-12 md:col-3">
                    <label className="block mb-2 font-medium">Horario</label>
                    <Dropdown value={timeSlot} options={timeSlotsOptions} showClear className="w-full" onChange={(e) => onChange({ status, timeSlot: e.value, title })} />
                </div>

                <div className="col-12 md:col-6">
                    <label className="block mb-2 font-medium">Buscar</label>
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-search" />
                        <InputText className="w-full" placeholder="Título de la rifa" value={title} onChange={(e) => onChange({ status, timeSlot, title: e.target.value })} />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RaffleFilters;
