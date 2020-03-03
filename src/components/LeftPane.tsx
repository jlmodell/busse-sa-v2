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
                    {Store.token && <li><NavLink to="/sa" activeClassName="text-teal-400" className="hover:bg-gray-300 border rounded-md p-2 shadow-md my-5">Sales Analysis</NavLink></li>}
                    {!Store.token && <li><NavLink className="hover:bg-gray-300 border rounded-md p-2 shadow-md my-5" to="/" activeClassName="text-teal-400">Login</NavLink></li>          }
                    {Store.token && <li><button className="hover:bg-gray-300 border rounded-md p-2 shadow-md my-5" onClick={async () => {
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
