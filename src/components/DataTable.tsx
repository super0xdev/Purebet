import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const columns: GridColDef[] = [
    { field: 'Event', headerName: 'Event', width: 300 },
    { field: 'Date', headerName: 'Event Date', width: 100 },
    { field: 'Bet', headerName: 'Bet', width: 200 },
    { field: 'Score', headerName: 'Score', width: 70 },
    { field: 'Placed', headerName: 'Placed at', width: 100 },
    { field: 'Stake', headerName: 'Stake', width: 130 },
    { field: 'Odds', headerName: 'Odds', width: 130 },
    { field: 'Result', headerName: 'Result', width: 130 },
    { field: 'Profit', headerName: 'Profit/Loss', width: 130 },
];

const DataTable = (props: any) => {
    const rows: any = []
    for (let i = 0; i < props.data.length; i++) {
        if (props.data[i].event == 'event') continue;
        const tmp = new Date(props.data[i].startDate * 1000)
        const tmp1 = new Date(props.data[i].placedAt * 1000)
        rows.push({
            id: i,
            Event: props.data[i].event,
            Date: tmp.getFullYear() + '-' + ("0" + (tmp.getMonth() + 1)).slice(-2) + '-' + ("0" + tmp.getDate()).slice(-2),
            Bet: props.data[i].bet,
            Score: props.data[i].score,
            Placed: tmp1.getFullYear() + '-' + ("0" + (tmp1.getMonth() + 1)).slice(-2) + '-' + ("0" + tmp1.getDate()).slice(-2),
            Stake: props.data[i].stake,
            Odds: props.data[i].odds,
            Result: props.data[i].result,
            Profit: props.data[i].profitloss,
        })
    }
    return (
        <div style={{ width: '100%', height: '530px' }}>
            <DataGrid
                sx={{
                    '& .MuiDataGrid-menuIconButton': {
                        color: "white",
                        fontWeight: 700,
                    },
                    '& .MuiDataGrid-sortIcon, & .MuiTablePagination-root, & .MuiTablePagination-input, & .MuiSvgIcon-root': {
                        color: 'white'
                    },
                }}
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                style={{ color: 'white' }}
                pageSizeOptions={[5, 10]}
            />

        </div>
    );
}

export default DataTable