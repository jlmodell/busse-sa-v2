import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react';
import { validItem } from '../utils/Utils';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';

import logo from '../assets/logo.png';
import Store from '../store/store';
import './leftpane.css'

interface Props extends RouteComponentProps<any> {}

const LeftPane: React.FC<Props> = observer(({ history }) => {
	const [ valid, setValid ] = useState(false);
	const itemRef = useRef(null);
	const endingPeriodRef = useRef(null);

	useEffect(() => {
		Store.token && (itemRef as any).current.focus();
	}, []);

	useEffect(
		() => {
			if (validItem(Store.item)) {
				setValid(true);
				Store.gql_fetch_itemName();
			} else {
				setValid(false);
				Store.gql_fetch_itemName();
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ Store.item ]
	);

	return (
		<div id="leftPane">
            <div
                onClick={() => {
                    Store.setMinBar();
                }}
                style={!Store.minBar ? { display: 'none' } : {}}
                className="bg-gray-300 m-5 border rounded-md shadow-lg opacity-10 logo-pulse"
            >			
                <img className="m-auto p-2 w-1/2 h-1/2" src={logo} alt="busse hospital disposables logo" />
            </div>

			<div style={Store.minBar ? { display: 'none' } : {}}>
				<ul className="bg-gray-600 flex flex-col justify-between h-screen w-full text-center">
					<li className="w-full p-5">
						<div
							onClick={() => {
								Store.setMinBar();
							}}
							className="bg-gray-300 px-5 py-5 border rounded-md shadow-lg opacity-10"
						>
							<img className="block" src={logo} alt="busse hospital disposables logo" />
						</div>
					</li>

					{Store.token && (
						<div className="flex flex-col">
							<label htmlFor="item" className="mx-2 font-bold">
								Item
							</label>
							<input
								type="text"
								ref={itemRef}
								name="item"
								className={
									valid ? (
										'bg-gray-100 pl-10 py-1 mt-2 border border-gray-700'
									) : (
										'bg-red-200 pl-10 py-1 mt-2 border border-red-700'
									)
								}
								value={Store.item}
								onChange={(e: { target: HTMLInputElement }) => {
									Store.item = e.target.value;
									localStorage.setItem('item', e.target.value);
								}}
							/>
							<div>{Store.itemName}</div>
							<label htmlFor="item" className="mx-2 font-bold mt-2">
								Ending Period
							</label>
							<input
								type="date"
								name="endingPeriod"
								ref={endingPeriodRef}
								className="bg-gray-100 text-center py-1 border mt-2 border-gray-700"
								value={Store.endingPeriod}
								onChange={(e: { target: HTMLInputElement }) => {
									Store.endingPeriod = e.target.value;
									localStorage.setItem('endingPeriod', e.target.value);
								}}
							/>
							<div className="w-full">
								<button
									disabled={valid ? false : true}
									className="bg-gray-300 block hover:bg-gray-600 py-5 mt-10 w-full"
									onClick={() => {
										Store.gql_fetch_data();
										Store.setMinBar();
									}}
								>
									Refresh
								</button>
							</div>
						</div>
					)}

					<div className="flex flex-col justify-between w-full">
						{Store.token && (
							<li className="w-full">
								<NavLink
									to="/sa"
									activeClassName="font-bold hover:bg-gray-600"
									className="bg-gray-300 py-5 block hover:bg-gray-500"
								>
									Sales Analysis
								</NavLink>
							</li>
						)}
						{!Store.token && (
							<li className="w-full">
								<NavLink
									activeClassName="font-bold hover:bg-gray-600"
									className="bg-gray-300 py-5 block hover:bg-gray-500"
									to="/"
								>
									Login
								</NavLink>
							</li>
						)}
						{Store.token && (
							<li className="w-full">
								<button
									className="bg-gray-300 block hover:bg-gray-600 py-5 w-full"
									onClick={async () => {
										const res = await Store.unSetCookies();
										if (res === true) {
											history.push('/');
										}
									}}
								>
									Logout
								</button>
							</li>
						)}
					</div>
					<div className="my-40" />
				</ul>
			</div>
		</div>
	);
});

export default withRouter(LeftPane);
