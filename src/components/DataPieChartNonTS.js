import React, { useMemo, useState } from 'react'
import { VictoryPie, VictoryContainer } from 'victory';


const DataChartsPie = ({data}) => {
  const memoData = useMemo(() => data, [])

  return (
      <div
          style={{
              width: '400px',
              height: '400px',                
          }}
          className="flex justify-center"
      >        
        <VictoryPie
            colorScale={[              
              // '#e2e8f0',
              '#cbd5e0',
              '#a0aec0',
              '#718096',
              '#4a5568',
              '#2d3748',
            ]}
            // colorScale={["teal","tomato","coral","silver","cyan","brown","violet","gold","pink"]}
            data={memoData}
            containerComponent={<VictoryContainer responsive={false}/>}
            // labelRadius={({ innerRadius }) => innerRadius + 5 }
            // radius={({ datum }) => 50 + datum.y * 20}
            // innerRadius={50}
            labelPosition="centroid"
            width={1000}
            style={{ labels: { fill: "black", fontSize: 10, fontWeight: "light" } }}
        />
      </div>
  )
}

export default DataChartsPie