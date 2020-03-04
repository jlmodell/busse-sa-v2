import React, { useMemo } from 'react'
import DataTable from 'react-data-table-component';

const DataTables= ({data, title}) => {   
    const convertArrayOfObjectsToCSV = (array) => {
        let result;
    
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
          
    const downloadCSV = (array) => {
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
      
    const Export = ({ onExport }) => (
        <button onClick={(event) => {
            onExport(event.target.value)
        }}>Export</button>
    );

    const actionsMemo = useMemo(() => <Export onExport={() => downloadCSV(data)} />, []);



    const columns = [
        {
            name: 'Customer',
            selector: '_id.customer',
            sortable: true,
            width: '300px',
        },
        {
            name: 'ID',
            selector: '_id.cid',
            sortable: true,
            width: '100px',
        },
        {
            name: 'Quantity (cs)',
            // selector: 'quantity',
            cell: row => <div>{row.quantity.toFixed(0)}</div>,
            sortable: true,
            right: true,
        },
        {
            name: 'Sales',
            // selector: 'sales',
            cell: row => <div>{row.sales.toLocaleString("en", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}</div>,
            sortable: true,
            right: true,
        },
        {
            name: 'Trade Discounts',
            // selector: 'currentTradeDiscounts',
            cell: row => <div>{row.currentTradeDiscounts.toLocaleString("en", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}</div>,
            sortable: true,
            right: true,
        },
        {
            name: 'Mfg Rebates',
            // selector: 'rebates',
            cell: row => <div>{row.rebates.toLocaleString("en", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}</div>,
            sortable: true,
            right: true,
        },
        {
            name: 'Freight',
            // selector: 'rebates',
            cell: row => <div>{row.freight.toLocaleString("en", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}</div>,
            sortable: true,
            right: true,
        },
        {
            name: 'Commissions',
            // selector: 'rebates',
            cell: row => <div>{row.commissions.toLocaleString("en", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}</div>,
            sortable: true,
            right: true,
        },
        {
            name: 'Costs',
            // selector: 'costs',
            cell: row => <div>{row.costs.toLocaleString("en", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}</div>,
            sortable: true,
            right: true,
        },
        {
            name: 'Gross Profit & Margin',
            // selector: 'grossProfit',
            width: '200px',
            cell: row => <div>{row.grossProfit.toLocaleString("en", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })} {row.grossProfitMargin.toFixed(1)}%</div>,
            sortable: true,
            right: true,
        },
        {
            name: 'Avg $/Cs',
            // selector: 'averagePricePerCase',
            cell: row => <div>{row.averagePricePerCase.toLocaleString("en", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}</div>,
            sortable: true,
            right: true,
        },
        {
            name: 'Avg $/Cs | T.D. & Reb',
            // selector: 'averageSellPricePerCaseAfterDiscountsAndRebates',
            sortable: true,
            width: '200px',
            cell: row => <div>{row.averageSellPricePerCaseAfterDiscountsAndRebates.toLocaleString("en", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })} (&#916; {row.difference.toLocaleString("en", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              })}</div>,
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
                // fixedHeader={true}
                actions={actionsMemo}    
            />
        </div>
    )
}

export default DataTables