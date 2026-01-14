'use client';

import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

type Props = {
    status?: string;
    userName?: string;
    userPhone?: string;
    onChange: (f: { status?: string; userName?: string; userPhone?: string }) => void;
};

const statusOptions = [
    { label: 'Entregados', value: 'delivered' },
    { label: 'Pendientes de pago', value: 'pending' },
    { label: 'Aprobados', value: 'completed' },
    { label: 'Rechazados', value: 'failed' }
];

const PaymentFilters = ({ status, userName, userPhone, onChange }: Props) => {
    return (
        <div className="card mb-3">
            <div className="grid align-items-center">
                {/* Estado */}
                <div className="col-12 md:col-3">
                    <label className="block mb-2 font-medium">Estado</label>
                    <Dropdown value={status} options={statusOptions} placeholder="Todos" showClear className="w-full" onChange={(e) => onChange({ status: e.value, userName, userPhone })} />
                </div>

                {/* Nombre */}
                <div className="col-12 md:col-5">
                    <label className="block mb-2 font-medium">Usuario</label>
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-user" />
                        <InputText value={userName} placeholder="Nombre del usuario" className="w-full" onChange={(e) => onChange({ status, userName: e.target.value, userPhone })} />
                    </span>
                </div>

                {/* Teléfono */}
                <div className="col-12 md:col-4">
                    <label className="block mb-2 font-medium">Celular</label>
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-phone" />
                        <InputText value={userPhone} placeholder="Ej: 70123456" className="w-full" onChange={(e) => onChange({ status, userName, userPhone: e.target.value })} />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PaymentFilters;
