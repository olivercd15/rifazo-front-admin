'use client';

import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { useState } from 'react';

type Props = {
    raffleId: string;
    visible: boolean;
    onConfirm: (ticketNumber: number) => void;
    onHide: () => void;
};

const AssignWinnerModal = ({ raffleId, visible, onConfirm, onHide }: Props) => {
    const [ticketNumber, setTicketNumber] = useState<number | null>(null);

    return (
        <Dialog header="Asignar Ganador" visible={visible} modal onHide={onHide}>
            <div className="field">
                <label>Número de ticket ganador</label>
                <InputNumber className="w-full" value={ticketNumber} onValueChange={(e) => setTicketNumber(e.value ?? 0)} />
            </div>

            <div className="flex justify-content-end gap-2 mt-3">
                <Button label="Cancelar" outlined onClick={onHide} />
                <Button label="Asignar" severity="success" disabled={!ticketNumber} onClick={() => onConfirm(ticketNumber!)} />
            </div>
        </Dialog>
        
    );
};

export default AssignWinnerModal;
