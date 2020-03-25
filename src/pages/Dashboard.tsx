import React, { useState } from 'react';
import { observer } from 'mobx-react';
// import { validItem } from '../utils/Utils'
// import DataTables from '../components/DataTable'
import DataTables from '../components/DataTableNonTS';
import DataCharts from '../components/DataChartNonTS';
import DataChartsPie from '../components/DataPieChartNonTS';

import Store from '../store/store';

interface Props {}

const Dashboard: React.FC<Props> = observer(() => {
	const [ dev ] = useState(true);
	const [ period, setPeriod ] = useState({
		period: 'currentPeriod'
	});

	return (
		<div className="flex flex-col">
			<div className="mt-20">
				{!Store.isLoaded && (
					<div className="px-10 my-10">
						<div className="bg-gray-300 py-5 rounded-md flex items-center justify-center border hover:border-gray-700">
							<p>
								Set an <span className="bg-teal-100 pt-1 pb-2 px-1 rounded-md">Item</span> &{' '}
								<span className="bg-teal-100 pt-1 pb-2 px-1 rounded-md">Ending Period</span> and click{' '}
								<span className="bg-teal-100 pt-1 pb-2 px-1 rounded-md">Refresh</span> to request data
								from the server.
							</p>
							{/* {
								<button
									onClick={async () => {
										const query = `
                                            query Item($item: String!) {
                                                item(iid: $item)
                                            }
                                        `;
										const variables = {
											item: Store.item
										};

										Store.gql_fetch(query, variables);
										//Store.gql_fetch_data();
										await Store.gql_fetch_bar_chart_data();
									}}
								>
									Console Log (Data)
								</button>
							} */}
						</div>
					</div>
				)}

				{Store.isLoaded && (
					<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-5 my-10 mx-10">
						<div className="bg-white p-2 rounded-md flex items-center justify-center h-20 border shadow-md hover:border-gray-700">
							{Store.avgQty.toFixed(0)}
						</div>
						<div className="bg-white p-2 rounded-md flex items-center justify-center h-20 border shadow-md hover:border-gray-700">
							{Store.avgSales.toLocaleString('en', {
								style: 'currency',
								currency: 'USD',
								minimumFractionDigits: 0,
								maximumFractionDigits: 0
							})}
						</div>
						<div className="bg-white p-2 rounded-md flex items-center justify-center h-20 border shadow-md hover:border-gray-700">
							{Store.avgCosts.toLocaleString('en', {
								style: 'currency',
								currency: 'USD',
								minimumFractionDigits: 0,
								maximumFractionDigits: 0
							})}
						</div>
						<div className="bg-white p-2 rounded-md flex items-center justify-center h-20 border shadow-md hover:border-gray-700">
							4
						</div>
						<div className="bg-white p-2 rounded-md flex items-center justify-center h-20 border shadow-md hover:border-gray-700">
							5
						</div>
						<div className="bg-white p-2 rounded-md flex items-center justify-center h-20 border shadow-md hover:border-gray-700">
							6
						</div>
					</div>
				)}

				{Store.isLoaded && (
					<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-5 my-10 mx-10">
						<div className="bg-white p-2 rounded-md flex items-center justify-center h-300 border shadow-md hover:border-gray-700">
							<DataCharts data={Store.barChartData} />
						</div>
						<div className="bg-white p-2 rounded-md flex items-center justify-center h-300 border shadow-md hover:border-gray-700">
							{period.period === 'currentPeriod' && <DataChartsPie data={Store.pieChartData[2]} />}
							{period.period === 'oneYearPriorPeriod' && <DataChartsPie data={Store.pieChartData[1]} />}
							{period.period === 'twoYearPriorPeriod' && <DataChartsPie data={Store.pieChartData[0]} />}
						</div>
					</div>
				)}

				{Store.isLoaded && (
					<div className="px-10 my-10">
						<div className="flex my-5 justify-center">
							<button
								className={
									period.period === 'currentPeriod' ? (
										'bg-gray-600 hover:bg-gray-600 border rounded-tl-lg rounded-bl-lg p-2 shadow-md my-2 px-5'
									) : (
										'bg-gray-100 hover:bg-gray-600 border rounded-tl-lg rounded-bl-lg p-2 shadow-md my-2 px-5'
									)
								}
								onClick={() => {
									setPeriod({ period: 'currentPeriod' });
								}}
							>
								{Store.endingPeriod}
							</button>
							<button
								className={
									period.period === 'oneYearPriorPeriod' ? (
										'bg-gray-600 hover:bg-gray-600 border p-2 shadow-md my-2 px-5'
									) : (
										'bg-gray-100 hover:bg-gray-600 border p-2 shadow-md my-2 px-5'
									)
								}
								onClick={() => {
									setPeriod({ period: 'oneYearPriorPeriod' });
								}}
							>
								{Store.oneYearPriorEndingPeriod}
							</button>
							<button
								className={
									period.period === 'twoYearPriorPeriod' ? (
										'bg-gray-600 hover:bg-gray-600 border rounded-tr-lg rounded-br-lg p-2 shadow-md my-2 px-5'
									) : (
										'bg-gray-100 hover:bg-gray-600 border rounded-tr-lg rounded-br-lg p-2 shadow-md my-2 px-5'
									)
								}
								onClick={() => {
									setPeriod({ period: 'twoYearPriorPeriod' });
								}}
							>
								{Store.twoYearPriorEndingPeriod}
							</button>
						</div>
						{period.period === 'currentPeriod' && (
							<div className="bg-white py-5 rounded-md flex items-center justify-center border shadow-md hover:border-gray-700">
								<DataTables
									title={`12 month Period Ending ${Store.endingPeriod}`}
									data={Store.dataTabledata[2]}
								/>
							</div>
						)}
						{period.period === 'oneYearPriorPeriod' && (
							<div className="bg-white py-5 rounded-md flex items-center justify-center border shadow-md hover:border-gray-700">
								<DataTables
									title={`12 month Period Ending ${Store.oneYearPriorEndingPeriod}`}
									data={Store.dataTabledata[1]}
								/>
							</div>
						)}
						{period.period === 'twoYearPriorPeriod' && (
							<div className="bg-white py-5 rounded-md flex items-center justify-center border shadow-md hover:border-gray-700">
								<DataTables
									title={`12 month Period Ending ${Store.twoYearPriorEndingPeriod}`}
									data={Store.dataTabledata[0]}
								/>
							</div>
						)}
					</div>
				)}

				{!dev && (
					<div className="px-10 my-10">
						<div className="bg-gray-300 py-5 rounded-md flex items-center justify-center border hover:border-gray-700 break-all" />
					</div>
				)}
			</div>
		</div>
	);
});

export default Dashboard;
