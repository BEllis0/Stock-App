import React from 'react';
import { DataGrid } from '@material-ui/data-grid';

export default function EarningsCalendarList(props) {

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'symbol', headerName: 'Symbol', width: 100 },
        { field: 'hour', headerName: 'Release Time', width: 100 },
        { field: 'quarter', headerName: 'Quarter', width: 130 },
        { field: 'year', headerName: 'Year', width: 100 },
        { field: 'revenueActual', headerName: 'Revenue Actual', width: 170 },
        { field: 'revenueEstimate', headerName: 'Revenue Estimate', width: 170 },
        { field: 'epsActual', headerName: 'EPS Actual', width: 130 },
        { field: 'epsEstimate', headerName: 'EPS Estimate', width: 130 },
    ];
    
    // data formatted on server side
    let rows = props.earningsCalendarData || [];

    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
            />
        </div>
    );
}