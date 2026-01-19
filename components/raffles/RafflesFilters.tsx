'use client';

import React from 'react';
import { InputText } from 'primereact/inputtext';

type Props = {
    title?: string;
    onChange: (f: { title?: string }) => void;
};

const RafflesFilters = ({ title, onChange }: Props) => {
    return (
        <div className="card mb-3">
            <div className="grid align-items-center">
                {/* Nombre de la rifa */}
                <div className="col-12 md:col-6">
                    <label className="block mb-2 font-medium">Nombre de la rifa</label>
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-ticket" />
                        <InputText
                            value={title}
                            placeholder="Buscar por nombre de rifa"
                            className="w-full"
                            onChange={(e) => onChange({ title: e.target.value })}
                        />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RafflesFilters;
