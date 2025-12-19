'use client';

import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';

type Props = {
    visible: boolean;
    numbers: number[];
    onHide: () => void;
};

const TicketNumbersModal = ({ visible, numbers, onHide }: Props) => {
    return (
        <Dialog header="Números de Tickets" visible={visible} style={{ width: '450px' }} modal onHide={onHide}>
            <div className="flex flex-wrap gap-2">
                {numbers.map((n) => (
                    <Tag key={n} value={String(n)} severity="info" />
                ))}
            </div>
        </Dialog>
    );
};

export default TicketNumbersModal;
