import React, { useRef, useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { validItem } from '../utils/Utils'
import DataTables from '../components/DataTable'
import Store from '../store/store'

interface Props {}

const Dashboard: React.FC<Props> = observer(() => {    
    const [dev] = useState(true)

    const [valid, setValid] = useState(false)
    const itemRef = useRef(null)
    const endingPeriodRef = useRef(null)

    const data = [{ id: 1, title: 'Conan the Barbarian', year: '1982' }]

    useEffect(() => {
        (itemRef as any).current.focus()
    }, [])

    useEffect(() => {
        if (validItem(Store.item)) {
            setValid(true)
        } else {
            setValid(false)
        }        
    }, [Store.item])

    return (
        <div className="flex flex-col">
            <div className="bg-gray-300 mx-10 p-2 border rounded-br-md rounded-bl-md flex items-center justify-center break-all hover:border-gray-700">                
                <label htmlFor="item" className="mx-2 font-bold">Item</label>
                <input                     
                    type="text"
                    ref={itemRef}                
                    name="item"
                    className={valid ? "bg-gray-100 pl-4 rounded-md py-1 border border-gray-700" : "bg-red-100 pl-4 rounded-md py-1 border border-red-700"} 
                    value={Store.item} 
                    onChange={(e: { target: HTMLInputElement; } ) => {
                        Store.item = e.target.value
                        localStorage.setItem("item", e.target.value)
                    }}
                />                
                <label htmlFor="item" className="mx-2 font-bold">Ending Period</label>
                <input                     
                    type="date"
                    name="endingPeriod"
                    ref={endingPeriodRef}
                    className="bg-gray-100 text-center rounded-md py-1 border border-gray-700" 
                    value={Store.endingPeriod} 
                    onChange={(e: { target: HTMLInputElement; } ) => {
                        Store.endingPeriod = e.target.value
                        localStorage.setItem("endingPeriod", e.target.value)
                    }}
                />
                <div className="px-10">
                    <button 
                        className="bg-gray-100 hover:bg-teal-400 border rounded-md p-2 shadow-md my-2 px-5"
                        onClick={() => {
                            Store.fetchData()
                        }}
                        >Refresh</button>
                </div>     
            </div>

            {!Store.isLoaded && <div className="px-10 my-10">
                <div className="bg-gray-300 py-5 rounded-md flex items-center justify-center border hover:border-gray-700">
                    <p>Set an <span className="bg-teal-100 pt-1 pb-2 px-1 rounded-md" onClick={() => {
                        (itemRef as any).current.focus()
                    }}>Item</span> & <span className="bg-teal-100 pt-1 pb-2 px-1 rounded-md" onClick={() => {
                        (endingPeriodRef as any).current.focus()
                    }}>Ending Period</span> and click <span className="bg-teal-100 pt-1 pb-2 px-1 rounded-md">Refresh</span> to request data from the server.</p>
                </div>
            </div>}

            {dev && <div className="px-10 my-10">
                <div className="bg-gray-300 py-5 rounded-md flex items-center justify-center border hover:border-gray-700 break-all">
                    
                </div>
            </div>}

            {Store.isLoaded && <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-5 my-5 mx-10">
                <div className="bg-gray-300 p-2 rounded-md flex items-center justify-center h-20 border hover:border-gray-700">1</div>
                <div className="bg-gray-300 p-2 rounded-md flex items-center justify-center h-20 border hover:border-gray-700">2</div>
                <div className="bg-gray-300 p-2 rounded-md flex items-center justify-center h-20 border hover:border-gray-700">3</div>
                <div className="bg-gray-300 p-2 rounded-md flex items-center justify-center h-20 border hover:border-gray-700">4</div>
                <div className="bg-gray-300 p-2 rounded-md flex items-center justify-center h-20 border hover:border-gray-700">5</div>
                <div className="bg-gray-300 p-2 rounded-md flex items-center justify-center h-20 border hover:border-gray-700">6</div>
            </div>}

            {Store.isLoaded && <div className="px-10 my-10">
                <div className="bg-gray-300 py-5 rounded-md flex items-center justify-center border hover:border-gray-700"><DataTables title={`Current Period -> ${Store.endingPeriod}`} data={Store.currentPeriod} /></div>
            </div>}
        </div>
    )
})

export default Dashboard
