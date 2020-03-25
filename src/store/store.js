import { observable } from 'mobx';
// import axios from 'axios';
import Cookies from 'js-cookie';
import { GraphQLClient } from 'graphql-request';
import Progress from 'rsup-progress'

// const client = new GraphQLClient(
//     "http://localhost:4000/graphql", {
//         credentials: "include"
//     }
// )

const client = new GraphQLClient('http://104.200.28.226:4000/graphql', {
	credentials: 'include'
});

const progress = new Progress({
    height: 5,
    color: '#33eafd',
})

/* eslint-disable */

var Store = observable(
	{
		email: '',
		password: '',
		token: null,
		// const accessToken = Cookies.get("access-token")
		// const refreshToken = Cookies.get("refresh-token")

		// if (!accessToken && !refreshToken) {
		//     return false
		// }

		// return true;
		// },
		// tokenIsValid: false,
		// async setToken() {
		// 	let url = 'http://104.200.28.226:8080';

		// 	let data = {
		// 		email: Store.email,
		// 		password: Store.password
		// 	};

		// 	let config = {
		// 		headers: {
		// 			'Content-Type': 'application/json'
		// 		}
		// 	};

		// 	try {
		// 		let res = await axios.post(`${url}/login`, data, config);
		// 		Store.token = res.data.token;
		// 		localStorage.setItem('token', res.data.token);
		// 	} catch (e) {
		// 		console.log(e);
		// 	}
		// },
		// async unSetToken() {
		// 	await localStorage.clear();
		// 	Store.token = '';
		// 	Store.tokenIsValid = true;
		// },
		async setCookies(query, variables) {
			try {
				const res = await client.request(query, variables);
				res.login.authorized ? (Store.token = true) : (Store.token = null);
				return res;
			} catch (err) {
				Store.token = null;
				console.log(err.response.errors[0].message);
				return res;
			}
		},
		async unSetCookies() {
			Cookies.remove('access-token');
			Cookies.remove('refresh-token');
			return true;
		},
		// checkValidToken(token, date) {
		// 	let url = 'http://104.200.28.226:8080';

		// 	let config = {
		// 		headers: {
		// 			Authorization: token
		// 		}
		// 	};

		// 	axios.get(`${url}/sa?end=${date}&item=723`, config).then((res) => {
		// 		console.log(res.status);
		// 		if (res.status === 200) {
		// 			Store.tokenIsValid = true;
		// 		} else {
		// 			Store.unsetToken();
		// 		}
		// 	});
		// },
		minBar: false,
		setMinBar() {
			Store.minBar = !Store.minBar;
		},
		item: localStorage.getItem('item') || '',
		itemName: localStorage.getItem('item-name') || '',
		async gql_fetch_itemName() {
			const query = `
                query Item($item: String!) {
                    item(iid: $item)
                }
            `;
			const variables = {
				item: Store.item
			};

			try {
				const res = await client.request(query, variables);
				console.log(res.item);
				Store.itemName = res.item;
				localStorage.setItem('item-name', res.item);
			} catch (err) {
				// console.log(err);
				Store.itemName = '';
				localStorage.removeItem('item-name');
			}
		},
		endingPeriod: localStorage.getItem('endingPeriod') || '2019-12-31',
		get oneYearPriorEndingPeriod() {
			let ep = new Date(Store.endingPeriod);
			return new Date(ep.getFullYear() - 1, ep.getMonth(), ep.getDate() + 1).toISOString().substring(0, 10);
		},
		get twoYearPriorEndingPeriod() {
			let ep = new Date(Store.endingPeriod);
			return new Date(ep.getFullYear() - 2, ep.getMonth(), ep.getDate() + 1).toISOString().substring(0, 10);
		},
		get twoYearPriorStartingPeriod() {
			let ep = new Date(Store.endingPeriod);
			return new Date(ep.getFullYear() - 3, ep.getMonth(), ep.getDate() + 1).toISOString().substring(0, 10);
		},
		get zeroYear() {
			return `Ending Period: ${Store.endingPeriod}`;
		},
		get oneYear() {
			return `Ending Period: ${Store.oneYearPriorEndingPeriod}`;
		},
		get twoYear() {
			return `Ending Period: ${Store.twoYearPriorEndingPeriod}`;
		},
		// currentPeriod: [],
		// oneYearPriorPeriod: [],
		// twoYearPriorPeriod: [],
		avgQty: 0,
		avgSales: 0,
		avgCosts: 0,
		pieChartData: [],
		barChartData: [],
		dataTabledata: [],
		async gql_fetch_data() {
			Store.isLoaded = false;

			const query = `
                query Sales($start: String!, $end: String!, $item: String!, $freight: Float, $overhead: Float, $commissions: Float) {
                    sales(start:$start, end:$end, item:$item, freight:$freight, overhead:$overhead, commissions:$commissions) {
                        _id {
                            iid
                            item
                            cid
                            customer
                        }
                        quantity
                        sales
                        costs
                        rebates
                        tradefees
                        commissions
                        freight
                        overhead
                        grossProfit
                        grossProfitMargin
                    }
                }
            `;

			const variables = [
				{
					start: Store.twoYearPriorStartingPeriod,
					end: Store.twoYearPriorEndingPeriod,
					item: Store.item,
					period: 1
				},
				{
					start: Store.twoYearPriorEndingPeriod,
					end: Store.oneYearPriorEndingPeriod,
					item: Store.item,
					period: 2
				},
				{
					start: Store.oneYearPriorEndingPeriod,
					end: Store.endingPeriod,
					item: Store.item,
					period: 3
				}
			];

			const headerBoxesdata = [];
			const barChartdata = [];
			const pieChartdata = [];
			const dataTabledata = [];
			let exportCustomers = [ '8497' ];
			var periods = 0;

            progress.start()

			for (let x = 0; x < variables.length; x++) {
				try {
					const res = await client.request(query, variables[x]);

					// res.sales is the [master]

					// header boxes
					let headerBoxes = {};
					headerBoxes.sales = res.sales.reduce((acc, val) => {
						return acc + val.sales;
					}, 0);
					headerBoxes.quantity = res.sales.reduce((acc, val) => {
						return acc + val.quantity;
					}, 0);
					headerBoxes.costs = res.sales.reduce((acc, val) => {
						return (
							acc +
							(val.costs + val.rebates + val.tradefees + val.commissions + val.freight + val.overhead)
						);
					}, 0);
					// console.log(headerBoxes);
					headerBoxesdata.push(headerBoxes);

					// bar chart
					// period: #, sales: #
					let barChartTemp = {};
					barChartTemp.period = variables[x].period;
					barChartTemp.sales = headerBoxes.sales;
					// console.log(barChartTemp);
					barChartdata.push(barChartTemp);
					// console.log(barChartdata);

					// pie chart
					let comparisonPct = 0.018;
					let periodSum = headerBoxes.quantity;
					// console.log(periodSum);
					let pieChartTemp = [];
					res.sales.forEach((x) => {
						if (!pieChartTemp.includes(x._id.cid + ' ' + x._id.customer)) {
							pieChartTemp.push({ x: x._id.cid + ' ' + x._id.customer, y: x.quantity });
						}
					});
					pieChartTemp.sort((a, b) => b.y - a.y);
					// console.log(pieChartTemp.length);
					// console.log(pieChartTemp);
					let finalPieChartdata = [];
					let all_others = 0;
					for (let i = 0; i < pieChartTemp.length; i++) {
						if (pieChartTemp[i].y > periodSum * comparisonPct) {
							finalPieChartdata.push(pieChartTemp[i]);
							// console.log(pieChartTemp[i].y);
						} else {
							all_others = all_others + pieChartTemp[i].y;
						}
					}
					// console.log(finalPieChartdata);
					let pieObject = {};
					pieObject.x = `Others < ${(comparisonPct * 100).toFixed(1)}% Sold`;
					pieObject.y = all_others;
					if (all_others > 0) {
						finalPieChartdata.push(pieObject);
					} else if (finalPieChartdata.length === 0) {
						finalPieChartdata.push(pieObject);
					}
					pieChartdata.push(finalPieChartdata);
					// console.log(pieChartdata);

					// data chart
					// console.log(res.sales);
					const sales = res.sales;
					sales.forEach((x) => {
						x.customer = x._id.customer;
						x.cid = x._id.cid;
						delete x._id;
						if (exportCustomers.includes(x.cid)) {
							x.freight = 0;
							x.commissions = 0;
						}
						x.averagePricePerCase = x.sales / x.quantity;
						x.averageSellPricePerCaseAfterDiscountsAndRebates =
							(x.sales - x.rebates - x.tradefees) / x.quantity;
						x.difference = x.averagePricePerCase - x.averageSellPricePerCaseAfterDiscountsAndRebates;
					});
					dataTabledata.push(sales);
					// console.log(sales);

					// periods calculation
					periods = periods + 1;
					// console.log(periods);
				} catch (err) {
					let barChartTemp = {};
					barChartTemp.period = variables[x].period;
					barChartTemp.sales = 0;
					barChartdata.push(barChartTemp);
					dataTabledata.push([]);
					// console.log(err);
				}
			}

			Store.avgQty =
				headerBoxesdata.reduce((acc, val) => {
					return acc + val.quantity;
				}, 0) / periods;
			Store.avgSales =
				headerBoxesdata.reduce((acc, val) => {
					return acc + val.sales;
				}, 0) / periods;
			Store.avgCosts =
				headerBoxesdata.reduce((acc, val) => {
					return acc + val.costs;
				}, 0) / periods;
			Store.barChartData = barChartdata;
			Store.pieChartData = pieChartdata;
			Store.dataTabledata = dataTabledata;
			// console.log(Store.dataTabledata);

            Store.isLoaded = true;
            
            progress.end()
		},
		isLoaded: false,
		async gql_fetch(query, variables) {
			const res = await client.request(query, variables);
			console.log(res);
		},
		async _() {
			const query = `
                query Sales($start: String!, $end: String!, $item: String!, $freight: Float, $overhead: Float, $commissions: Float) {
                    sales(start:$start, end:$end, item:$item, freight:$freight, overhead:$overhead, commissions:$commissions) {
                        _id {
                            iid
                            item
                            cid
                            customer
                        }
                        quantity
                        sales
                        costs
                        rebates
                        tradefees
                        commissions
                        freight
                        overhead
                        grossProfit
                        grossProfitMargin
                    }
                }
            `;
			const variables = {
				start: Store.oneYearPriorEndingPeriod,
				end: Store.endingPeriod,
				item: Store.item
			};

			try {
				const res = await client.request(query, variables);
				console.log(res);
			} catch (err) {
				console.log(err);
			}
		}
		// fetchData() {
		// 	Store.isLoaded = false;

		// 	let url = 'http://104.200.28.226:8080';

		// 	let config = {
		// 		headers: {
		// 			Authorization: Store.token
		// 		}
		// 	};

		// 	let exportCustomers = [ '8497' ];

		// 	let comparisonPct = 0.018;

		// 	axios
		// 		.get(`${url}/sa?end=${Store.endingPeriod}&item=${Store.item}`, config)
		// 		.then((res) => {
		// 			if (res.data.currentPeriod) {
		// 				res.data.currentPeriod.forEach((x) => {
		// 					x.customer = x._id.customer;
		// 					x.cid = x._id.cid;
		// 					delete x._id;
		// 					x.freight = x.quantity * 3;
		// 					x.commissions = x.sales * 0.02;
		// 					x.rebates = x.rebates * -1;
		// 					if (exportCustomers.includes(x.cid)) {
		// 						x.freight = 0;
		// 						x.commissions = 0;
		// 					}
		// 					x.grossProfit =
		// 						x.sales - x.costs - x.rebates - x.currentTradeDiscounts - x.commissions - x.freight;
		// 					x.grossProfitMargin = x.grossProfit / x.sales * 100;
		// 					x.averagePricePerCase = x.sales / x.quantity;
		// 					x.averageSellPricePerCaseAfterDiscountsAndRebates =
		// 						(x.sales - x.rebates - x.currentTradeDiscounts) / x.quantity;
		// 					x.difference = x.averagePricePerCase - x.averageSellPricePerCaseAfterDiscountsAndRebates;
		// 				});
		// 			} else {
		// 				res.data.currentPeriod = [];
		// 			}

		// 			if (res.data.oneYearPrior) {
		// 				res.data.oneYearPrior.forEach((x) => {
		// 					x.customer = x._id.customer;
		// 					x.cid = x._id.cid;
		// 					delete x._id;
		// 					x.freight = x.quantity * 3;
		// 					x.commissions = x.sales * 0.02;
		// 					x.rebates = x.rebates * -1;
		// 					if (exportCustomers.includes(x.cid)) {
		// 						x.freight = 0;
		// 						x.commissions = 0;
		// 					}
		// 					x.grossProfit =
		// 						x.sales - x.costs - x.rebates - x.currentTradeDiscounts - x.commissions - x.freight;
		// 					x.grossProfitMargin = x.grossProfit / x.sales * 100;
		// 					x.averagePricePerCase = x.sales / x.quantity;
		// 					x.averageSellPricePerCaseAfterDiscountsAndRebates =
		// 						(x.sales - x.rebates - x.currentTradeDiscounts) / x.quantity;
		// 					x.difference = x.averagePricePerCase - x.averageSellPricePerCaseAfterDiscountsAndRebates;
		// 				});
		// 			} else {
		// 				res.data.oneYearPrior = [];
		// 			}

		// 			if (res.data.twoYearPrior) {
		// 				res.data.twoYearPrior.forEach((x) => {
		// 					x.customer = x._id.customer;
		// 					x.cid = x._id.cid;
		// 					delete x._id;
		// 					x.freight = x.quantity * 3;
		// 					x.commissions = x.sales * 0.02;
		// 					x.rebates = x.rebates * -1;
		// 					if (exportCustomers.includes(x.cid)) {
		// 						x.freight = 0;
		// 						x.commissions = 0;
		// 					}
		// 					x.grossProfit =
		// 						x.sales - x.costs - x.rebates - x.currentTradeDiscounts - x.commissions - x.freight;
		// 					x.grossProfitMargin = x.grossProfit / x.sales * 100;
		// 					x.averagePricePerCase = x.sales / x.quantity;
		// 					x.averageSellPricePerCaseAfterDiscountsAndRebates =
		// 						(x.sales - x.rebates - x.currentTradeDiscounts) / x.quantity;
		// 					x.difference = x.averagePricePerCase - x.averageSellPricePerCaseAfterDiscountsAndRebates;
		// 				});
		// 			} else {
		// 				res.data.twoYearPrior = [];
		// 			}

		// 			Store.currentPeriod = res.data.currentPeriod;
		// 			Store.oneYearPriorPeriod = res.data.oneYearPrior;
		// 			Store.twoYearPriorPeriod = res.data.twoYearPrior;

		// 			return res.data;
		// 		})
		// 		.then((r) => {
		// 			let qty = [];
		// 			let sales = [];
		// 			let costs = [];

		// 			let barChartData = [];
		// 			// [ { period: 1, sales: #}]

		// 			if (r.currentPeriod) {
		// 				let currPdPie = [];
		// 				let totalSum = [];
		// 				r.currentPeriod.forEach((x) => {
		// 					if (!currPdPie.includes(x.cid + ' ' + x.customer)) {
		// 						currPdPie.push({ x: x.cid + ' ' + x.customer, y: x.quantity });
		// 					}
		// 					totalSum.push(x.quantity);
		// 				});

		// 				currPdPie.sort((a, b) => b.y - a.y);

		// 				let currPdSum = sum_array(totalSum) * comparisonPct;
		// 				let simplifiedPie = [];
		// 				let temp = [];
		// 				for (let i = 0; i < currPdPie.length; i++) {
		// 					if (currPdPie[i].y > currPdSum) {
		// 						simplifiedPie.push(currPdPie[i]);
		// 					} else {
		// 						temp.push(currPdPie[i].y);
		// 					}
		// 				}
		// 				simplifiedPie.push({
		// 					x: `ALL OTHERS < ${(comparisonPct * 100).toFixed(1)}% SOLD`,
		// 					y: sum_array(temp)
		// 				});

		// 				let currYr = {
		// 					qty: [],
		// 					sales: [],
		// 					costs: [],
		// 					rebates: [],
		// 					discounts: []
		// 				};
		// 				r.currentPeriod.forEach(function(x) {
		// 					qty.push(x.quantity);
		// 					sales.push(x.sales);
		// 					costs.push(x.costs);
		// 					currYr.qty.push(x.quantity);
		// 					currYr.sales.push(x.sales);
		// 					currYr.costs.push(x.costs);
		// 					currYr.rebates.push(x.rebates);
		// 					currYr.discounts.push(x.currentTradeDiscounts);
		// 				});

		// 				Store.currPdPie = simplifiedPie;

		// 				barChartData.push({
		// 					period: 1,
		// 					sales: sum_array(currYr.sales)
		// 				});
		// 			}
		// 			if (r.oneYearPrior) {
		// 				let onePdPriorPie = [];
		// 				let totalSum = [];
		// 				r.oneYearPrior.forEach((x) => {
		// 					if (!onePdPriorPie.includes(x.cid + ' ' + x.customer)) {
		// 						onePdPriorPie.push({ x: x.cid + ' ' + x.customer, y: x.quantity });
		// 					}
		// 					totalSum.push(x.quantity);
		// 				});

		// 				onePdPriorPie.sort((a, b) => b.y - a.y);

		// 				let currPdSum = sum_array(totalSum) * comparisonPct;

		// 				let simplifiedPie = [];
		// 				let temp = [];
		// 				for (let i = 0; i < onePdPriorPie.length; i++) {
		// 					if (onePdPriorPie[i].y > currPdSum) {
		// 						simplifiedPie.push(onePdPriorPie[i]);
		// 					} else {
		// 						temp.push(onePdPriorPie[i].y);
		// 					}
		// 				}
		// 				simplifiedPie.push({
		// 					x: `ALL OTHERS < ${(comparisonPct * 100).toFixed(1)}% SOLD`,
		// 					y: sum_array(temp)
		// 				});

		// 				Store.onePdPriorPie = simplifiedPie;

		// 				let oneYr = {
		// 					qty: [],
		// 					sales: [],
		// 					costs: [],
		// 					rebates: [],
		// 					discounts: []
		// 				};
		// 				r.oneYearPrior.forEach(function(x) {
		// 					qty.push(x.quantity);
		// 					sales.push(x.sales);
		// 					costs.push(x.costs);
		// 					oneYr.qty.push(x.quantity);
		// 					oneYr.sales.push(x.sales);
		// 					oneYr.costs.push(x.costs);
		// 					oneYr.rebates.push(x.rebates);
		// 					oneYr.discounts.push(x.currentTradeDiscounts);
		// 				});

		// 				barChartData.push({
		// 					period: 2,
		// 					sales: sum_array(oneYr.sales)
		// 				});
		// 			}
		// 			if (r.twoYearPrior) {
		// 				let twoPdPriorPie = [];
		// 				let totalSum = [];
		// 				r.twoYearPrior.forEach((x) => {
		// 					if (!twoPdPriorPie.includes(x.cid + ' ' + x.customer)) {
		// 						twoPdPriorPie.push({ x: x.cid + ' ' + x.customer, y: x.quantity });
		// 					}
		// 					totalSum.push(x.quantity);
		// 				});

		// 				twoPdPriorPie.sort((a, b) => b.y - a.y);

		// 				let currPdSum = sum_array(totalSum) * comparisonPct;
		// 				let simplifiedPie = [];
		// 				let temp = [];
		// 				for (let i = 0; i < twoPdPriorPie.length; i++) {
		// 					if (twoPdPriorPie[i].y > currPdSum) {
		// 						simplifiedPie.push(twoPdPriorPie[i]);
		// 					} else {
		// 						temp.push(twoPdPriorPie[i].y);
		// 					}
		// 				}
		// 				simplifiedPie.push({
		// 					x: `ALL OTHERS < ${(comparisonPct * 100).toFixed(1)}% SOLD`,
		// 					y: sum_array(temp)
		// 				});

		// 				Store.twoPdPriorPie = simplifiedPie;

		// 				let twoYr = {
		// 					qty: [],
		// 					sales: [],
		// 					costs: [],
		// 					rebates: [],
		// 					discounts: []
		// 				};
		// 				r.twoYearPrior.forEach(function(x) {
		// 					qty.push(x.quantity);
		// 					sales.push(x.sales);
		// 					costs.push(x.costs);
		// 					twoYr.qty.push(x.quantity);
		// 					twoYr.sales.push(x.sales);
		// 					twoYr.costs.push(x.costs);
		// 					twoYr.rebates.push(x.rebates);
		// 					twoYr.discounts.push(x.currentTradeDiscounts);
		// 				});

		// 				barChartData.push({
		// 					period: 3,
		// 					sales: sum_array(twoYr.sales)
		// 				});
		// 			}

		// 			let divisor = 0;
		// 			if (r.currentPeriod) {
		// 				divisor++;
		// 			}
		// 			if (r.oneYearPrior) {
		// 				divisor++;
		// 			}
		// 			if (r.twoYearPrior) {
		// 				divisor++;
		// 			}

		// 			Store.avgQty = sum_array(qty) / divisor;
		// 			Store.avgSales = sum_array(sales) / divisor;
		// 			Store.avgCosts = sum_array(costs) / divisor;

		// 			Store.barChartData = barChartData;
		// 		})
		// 		.then(() => {
		// 			Store.isLoaded = true;
		// 		})
		// 		.catch((e) => console.log(e));
		// }
	},
	{
		// setToken: action,
		// unSetToken: action,
		// oneYearPriorEndingPeriod: computed,
		// twoYearPriorEndingPeriod: computed,
		// zeroYear: computed,
		// oneYear: computed,
		// twoYear: computed,
		// checkValidToken: action
		// fetchData: action
	}
);

export default Store;
