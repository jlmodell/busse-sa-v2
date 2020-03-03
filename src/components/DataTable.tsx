import * as React from 'react'
import DataTable from 'react-data-table-component';

interface Props {
    data?: any,
    title?: string
}

const DataTables: React.FC<Props> = ({data, title}) => {
    const columns = [
        // {
        //   name: 'Title',
        //   selector: 'title',
        //   sortable: true,
        // },
        // {
        //   name: 'Year',
        //   selector: 'year',
        //   sortable: true,
        //   right: true,
        // },
        {
            name: 'Customer',
            selector: '_id.customer',
            sortable: true
        },
        {
            name: 'ID',
            selector: '_id.cid',
            sortable: true
        },
        {
            name: 'Quantity (cs)',
            selector: 'quantity',
            sortable: true
        },
        {
            name: 'Sales',
            selector: 'sales',
            sortable: true
        },
        {
            name: 'Trade Discounts',
            selector: 'currentTradeDiscounts',
            sortable: true
        },
        {
            name: 'Mfg Rebates',
            selector: 'rebates',
            sortable: true
        },
        {
            name: 'Costs',
            selector: 'costs',
            sortable: true
        },
        {
            name: 'Gross Profit',
            selector: 'grossProfit',
            sortable: true
        },
        {
            name: 'GPM',
            selector: 'grossProfitMargin',
            sortable: true
        },
        {
            name: 'Avg $/Cs',
            selector: 'averagePricePerCase',
            sortable: true
        },
        {
            name: 'Avg $/Cs | T.D. & Reb',
            selector: 'averageSellPricePerCaseAfterDiscountsAndRebates',
            sortable: true
        }
      ];    
    
    return (
        <div>
            <DataTable 
                title={title}
                columns={columns}
                data={data}
                pagination={true}             
            />
        </div>
    )
}

export default DataTables