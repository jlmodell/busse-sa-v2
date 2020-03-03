import React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { observer } from 'mobx-react'
import Store from '../store/store';

interface Props extends RouteComponentProps{}

const Login: React.FC<Props> = observer(({ history }) => {        
    return (
        <div className="flex justify-center items-center m-48">
            <div className="w-full max-w-md bg-white" >
                <form className="bg-white shadow-md rounded px-8 py-8 pt-8">
                    <div className="px-4 pb-4">
                        <label htmlFor="email" className="text-sm block font-bold  pb-2">EMAIL ADDRESS</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={Store.email} 
                            onChange={(event: { target: HTMLInputElement; }) => Store.email = event.target.value}                            
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300" 
                            placeholder="[abc]@[busseinc.com]"
                        />
                    </div>
                    <div  className="px-4 pb-4">
                        <label htmlFor="password" className="text-sm block font-bold pb-2">PASSWORD</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={Store.password} 
                            onChange={(event: { target: HTMLInputElement; }) => Store.password = event.target.value}   
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300" 
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="flex justify-center">
                        <button 
                            className="bg-teal-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                            onClick={async () => {
                                await Store.setToken()
                                if (Store.token) {
                                    history.push("/sa")
                                }                            
                            }}
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
})

export default withRouter(Login);
