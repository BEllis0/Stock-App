import React from 'react';
import { DataGrid } from '@material-ui/data-grid';

export default function CompanyFinancialsList(props) {

    let { companyFinancials } = props;

    const columns = [
        { field: 'id', headerName: 'Metric', width: 300 },
        { field: 'value', headerName: 'Value', width: 150 }
      ];
      
    
    let rows = [];
    
    // push formatted data into rows
    for (let [key, value] of Object.entries(companyFinancials.metric)) {
        rows.push({
            id: key,
            value: value
        });
    }

    return (
        <div className="companyFinancialsList" style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
            />
        </div>
    );
}