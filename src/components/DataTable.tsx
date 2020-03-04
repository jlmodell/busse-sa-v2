import React, { useMemo } from 'react'
import DataTable from 'react-data-table-component';

interface Props {
    data?: any,
    title?: string
}

const DataTables: React.FC<Props> = ({data, title}) => {
    const actionsMemo = useMemo(() => <Export onExport={() => downloadCSV(data)} />, []);

    function convertArrayOfObjectsToCSV(array: []) {
        let result: string;
    
        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(data[0]);
    
        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;
    
        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
            if (ctr > 0) result += columnDelimiter;
    
            result += item[key];
            
            ctr++;
            });
            result += lineDelimiter;
        });
    
        return result;
    }
          
    function downloadCSV(array: []) {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(array);
        if (csv == null) return;
    
        const filename = 'export.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }
    
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    }          
      
    const Export = ({ onExport }: { onExport: any }) => (
        <button onClick={function(event: any) {
            onExport(event?.target.value)
        }}>Export</button>
    );

    const columns = [
        {
            name: 'Customer',
            selector: 'customer',
            sortable: true
        },
        {
            name: 'ID',
            selector: 'cid',
            sortable: true
        },
        {
            name: 'Quantity (cs)',
            selector: 'quantity',
            sortable: true,
            right: true,
        },
        {
            name: 'Sales',
            selector: 'sales',
            sortable: true,
            right: true,
        },
        {
            name: 'Trade Discounts',
            selector: 'currentTradeDiscounts',
            sortable: true,
            right: true,
        },
        {
            name: 'Mfg Rebates',
            selector: 'rebates',
            sortable: true,
            right: true,
        },
        {
            name: 'Costs',
            selector: 'costs',
            sortable: true,
            right: true,
        },
        {
            name: 'Gross Profit',
            selector: 'grossProfit',
            sortable: true,
            right: true,
        },
        {
            name: 'GPM',
            selector: 'grossProfitMargin',
            sortable: true,
            right: true,
        },
        {
            name: 'Avg $/Cs',
            selector: 'averagePricePerCase',
            sortable: true,
            right: true,
        },
        {
            name: 'Avg $/Cs | T.D. & Reb',
            selector: 'averageSellPricePerCaseAfterDiscountsAndRebates',
            sortable: true,
            right: true,
        }
      ];    
    
    return (
        <div>
            <DataTable 
                title={title}
                columns={columns}
                data={data}
                pagination={true}
                fixedHeader={true}
                actions={actionsMemo}    
            />
        </div>
    )
}

export default DataTables