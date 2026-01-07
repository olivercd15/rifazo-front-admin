'use client';

import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { getActiveTicketsByRaffle } from '@/services/raffle.service';

type Ticket = {
    id: string;
    ticket_number: string;
    user_id: string;
    user_profiles: {
        full_name: string;
        email?: string;
    } | null;
};


type Props = {
    raffleId: string;
    visible: boolean;
    onConfirm: (ticketNumber: string) => void;
    onHide: () => void;
};

const AssignWinnerModal = ({ raffleId, visible, onConfirm, onHide }: Props) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible && raffleId) {
            loadTickets();
        }
    }, [visible, raffleId]);

    const loadTickets = async () => {
        try {
            setLoading(true);
            const result = await getActiveTicketsByRaffle(raffleId);
            setTickets(result);
        } catch (e) {
            console.error(e);
            alert('Error al cargar tickets');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            header="Seleccionar ticket ganador"
            visible={visible}
            modal
            style={{ width: '600px' }}
            onHide={onHide}
        >
            <DataTable
                value={tickets}
                loading={loading}
                selectionMode="single"
                selection={selectedTicket}
                onSelectionChange={(e) => setSelectedTicket(e.value as Ticket)}
                dataKey="id"
                paginator
                rows={5}
                responsiveLayout="scroll"
                emptyMessage="No hay tickets activos"
            >
                <Column selectionMode="single" style={{ width: '3rem' }} />
                <Column field="ticket_number" header="Ticket" sortable />
                <Column
                    header="Usuario"
                    body={(t: Ticket) =>
                        t.user_profiles?.full_name ?? '—'
                    }
                />
            </DataTable>

            <div className="flex justify-content-end gap-2 mt-3">
                <Button label="Cancelar" outlined onClick={onHide} />
                <Button
                    label="Asignar ganador"
                    icon="pi pi-star"
                    severity="warning"
                    disabled={!selectedTicket}
                    onClick={() => onConfirm(selectedTicket!.ticket_number)}
                />
            </div>
        </Dialog>
    );
};

export default AssignWinnerModal;
