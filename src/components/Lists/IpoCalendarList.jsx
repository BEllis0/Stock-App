import React from 'react';
import { DataGrid } from '@material-ui/data-grid';

export default function IpoCalendarList(props) {

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'company', headerName: 'Company Name', width: 270 },
        { field: 'symbol', headerName: 'Symbol', width: 100 },
        { field: 'sharesTotal', headerName: 'Shares Offered', width: 130 },
        { field: 'sharesValue', headerName: 'Shares Value', width: 130 },
        { field: 'priceRange', headerName: 'Price Range', width: 130 },
        { field: 'exchange', headerName: 'Exchange', width: 170 },
        { field: 'status', headerName: 'Status', width: 130 },
    ];
    
    // data formatted on server side
    let rows = props.ipoCalendarData || [];

    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
            />
        </div>
    );
}