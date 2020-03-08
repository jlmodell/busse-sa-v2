import React from 'react'
import { observer } from 'mobx-react'
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import logo from '../assets/logo.png'
import Store from '../store/store'

interface Props extends RouteComponentProps<any> {}

const LeftPane: React.FC<Props> = observer(({history}) => {        
    return (
        <div className="">
            <ul className="bg-gray-600 flex flex-col justify-between h-screen w-full text-center">
                <li className="w-full p-5">
                    <div className="bg-gray-300 px-5 py-5 border border-black shadow-lg opacity-10">
                        {/* <span className="font-bold">Busse</span> <span className="font-light">Hospital Disposables</span> */}
                        <img className="block" src={logo} alt="busse hospital disposables logo" />
                    </div>
                </li>            
                <div className="flex flex-col justify-between w-full">
                    {Store.token && <li className="w-full">
                        <NavLink to="/sa" activeClassName="font-bold hover:bg-gray-600" className="bg-gray-500 py-5 block hover:bg-gray-500">Sales Analysis</NavLink>
                    </li>}
                    {!Store.token && <li className="w-full">
                        <NavLink activeClassName="font-bold hover:bg-gray-600" className="bg-gray-600 py-5 block hover:bg-gray-500" to="/">Login</NavLink>
                    </li>          }
                    {Store.token && <li className="w-full">
                        <button className="bg-gray-500 block hover:bg-gray-600 py-5 w-full" onClick={async () => {
                            await Store.unSetToken()
                            if (!Store.token) {
                                history.push("/")
                            }
                        }}>Logout</button>
                    </li>}
                </div>
                <div className="my-40" />
            </ul>
        </div>
    )
})

export default withRouter(LeftPane)
