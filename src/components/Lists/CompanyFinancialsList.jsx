import React from 'react';
import { DataGrid } from '@material-ui/data-grid';

export default function CompanyFinancialsList(props) {

    let { companyFinancials } = props;

    const columns = [
        { field: 'id', headerName: 'Metric', width: 250 },
        // { field: 'metric', headerName: 'Metric', width: 250 },
        { field: 'value', headerName: 'Value', width: 400 }
      ];
      
    let rows = [];

    for (let [key, value] of Object.entries(companyFinancials.metric)) {
        rows.push({
            id: key,
            metric: key,
            value: value
        });
    }

    console.log('ROWS: ', rows)

    return (
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid 
            rows={rows}
            columns={columns}
            // pageSize={5}
            // checkboxSelection 
            />
        </div>
    );
}