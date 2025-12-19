'use client';

import React from 'react';
import { Dialog } from 'primereact/dialog';

type Props = {
    visible: boolean;
    url?: string;
    onHide: () => void;
};

const VoucherModal = ({ visible, url, onHide }: Props) => (
    <Dialog header="Comprobante" visible={visible} style={{ width: '600px' }} modal onHide={onHide}>
        {url ? <img src={url} alt="Voucher" style={{ width: '100%', borderRadius: 8 }} /> : <p>No hay comprobante</p>}
    </Dialog>
);

export default VoucherModal;
