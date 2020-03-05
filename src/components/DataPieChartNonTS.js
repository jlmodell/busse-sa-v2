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
            colorScale={["cyan", "navy", "tomato", "orange", "gold"]}
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