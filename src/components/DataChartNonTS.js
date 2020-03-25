import React, { useMemo } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';

const DataCharts = ({ data }) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const memoData = useMemo(() => data, []);

	return (
		<div
			style={{
				width: '500px',
				height: '350px'
			}}
		>
			<div className="text-center font-bold text-xl">Sales Per Period</div>
			<VictoryChart
				// domainPadding will add space to each side of VictoryBar to
				// prevent it from overlapping the axis
				domainPadding={40}
			>
				<VictoryAxis
					// tickValues specifies both the number of ticks and where
					// they are placed on the axis
					tickValues={[ 1, 2, 3 ]}
					tickFormat={[ '(2) Yr Prior', '(1) Yr Prior', 'Curr Pd' ]}
					// label="[ Periods ]"
					// style={{
					//   axisLabel: { padding: 30 }
					// }}
				/>
				<VictoryAxis
					dependentAxis
					// tickFormat specifies how ticks should be displayed
					tickFormat={(x) => `$${x / 1000}k`}
				/>
				<VictoryBar
					data={memoData}
					x="period"
					y="sales"
					style={{
						data: { fill: '#4a5568' }
					}}
					animate={{
						duration: 2000,
						onLoad: { duration: 1000 }
					}}
				/>
			</VictoryChart>
		</div>
	);
};

export default DataCharts;
