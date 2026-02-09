// utils/excel.ts
export const exportTicketsToExcel = async (
    rows: any[],
    raffleTitle: string
) => {
    if (!rows?.length) {
        alert('No hay datos para exportar');
        return;
    }

    const XLSX = await import('xlsx');

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets');

    XLSX.writeFile(
        workbook,
        `tickets_${raffleTitle.replace(/\s+/g, '_')}.xlsx`
    );
};
