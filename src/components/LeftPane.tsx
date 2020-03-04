import React from 'react'
import { observer } from 'mobx-react'
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import Store from '../store/store'

interface Props extends RouteComponentProps<any> {}

const LeftPane: React.FC<Props> = observer(({history}) => {        
    return (
        <div>
            <ul className="bg-gray-600 flex flex-col justify-between h-screen p-10 text-center">
                <li>
                    <div className="bg-gray-700 text-white px-8 py-2 border rounded-md shadow-md">
                        <span className="font-bold">Busse</span> <span className="font-light">Hospital Disposables</span>
                    </div>
                </li>            
                <div className="flex flex-col justify-between">
                    {Store.token && <li><NavLink to="/sa" activeClassName="border border-black" className="bg-gray-500 rounded-md py-2 px-4 shadow-md w-11/12 my-5 hover:bg-gray-300">Sales Analysis</NavLink></li>}
                    {!Store.token && <li><NavLink className="bg-gray-500 rounded-md py-2 px-4 shadow-md w-11/12 my-5 hover:bg-gray-300" to="/" activeClassName="border border-black">Login</NavLink></li>          }
                    {Store.token && <li><button className="bg-gray-500 py-1 px-2 w-11/12 rounded-md shadow-md my-5 hover:bg-gray-300 border" onClick={async () => {
                        await Store.unSetToken()
                        if (!Store.token) {
                            history.push("/")
                        }
                    }}>Logout</button></li>}
                </div>
                <div className="my-40" />
            </ul>
        </div>
    )
})

export default withRouter(LeftPane)
