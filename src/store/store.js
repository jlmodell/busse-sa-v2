import { action, computed, observable } from "mobx";
import axios from "axios";
import Cookies from 'js-cookie'
import { GraphQLClient } from 'graphql-request'

import {sum_array} from '../utils/Utils'

// const client = new GraphQLClient(
//     "http://localhost:4000/graphql", {
//         credentials: "include"
//     }
// )

const client = new GraphQLClient(
    "http://104.200.28.226:4000/graphql", {
        credentials: "include"
    }
)


/* eslint-disable */

var Store = observable(
    {
        email: "",
        password: "",
        get token() {
            // const accessToken = Cookies.get("access-token")
            // const refreshToken = Cookies.get("refresh-token")
           
            // if (!accessToken && !refreshToken) {
            //     return false
            // }

            return true
        },
        tokenIsValid: false,
        async setToken() {
            let url = "http://104.200.28.226:8080";

            let data = {
                email: Store.email,
                password: Store.password
            };

            let config = {
                headers: {
                    "Content-Type": "application/json"
                }
            };

            try {
                let res = await axios.post(`${url}/login`, data, config);
                Store.token = res.data.token
                localStorage.setItem("token", res.data.token);                
            } catch(e) {
                console.log(e);
            }        
        },
        async unSetToken() {
            await localStorage.clear()
            Store.token = ""
            Store.tokenIsValid = true
        },        
        async setCookies(query, variables) {     
            const res = await client.request(query, variables)
            
            return res
        },
        async unSetCookies() {
            Cookies.remove("access-token")
            Cookies.remove("refresh-token")
            return true
        },
        checkValidToken(token, date) {
            let url = "http://104.200.28.226:8080";

            let config = {
                headers: {
                    "Authorization": token
                }            
            };
            
            axios.get(`${url}/sa?end=${date}&item=723`, config).then(res => {
                console.log(res.status)
                if (res.status === 200) {
                    Store.tokenIsValid = true;
                } else {
                    Store.unsetToken();
                }
            })
        },
        item: localStorage.getItem("item") || "",
        endingPeriod: localStorage.getItem("endingPeriod") || "2019-12-31",
        get oneYearPriorEndingPeriod() {
            let ep = new Date(Store.endingPeriod)
            return new Date(ep.getFullYear()-1, ep.getMonth(), ep.getDate()+1).toISOString().substring(0,10)
        },
        get twoYearPriorEndingPeriod() {
            let ep = new Date(Store.endingPeriod)
            return new Date(ep.getFullYear()-2, ep.getMonth(), ep.getDate()+1).toISOString().substring(0,10)
        },
        get twoYearPriorStartingPeriod() {
            let ep = new Date(Store.endingPeriod)
            return new Date(ep.getFullYear()-3, ep.getMonth(), ep.getDate()+1).toISOString().substring(0,10)
        },
        get zeroYear() {
            return `Ending Period: ${Store.endingPeriod}`
        },        
        get oneYear() {
            return `Ending Period: ${Store.oneYearPriorEndingPeriod}`
        },        
        get twoYear() {
            return `Ending Period: ${Store.twoYearPriorEndingPeriod}`
        },
        currentPeriod: [],
        oneYearPriorPeriod: [],
        twoYearPriorPeriod: [],
        avgQty: 0,
        avgSales: 0,
        avgCosts: 0,
        currPdPie: [],
        onePdPriorPie: [],
        twoPdPriorPie: [],
        barChartData: [],
        isLoaded: false,
        async gql_fetch(query, variables) {
            const res = await client.request(query, variables)
            console.log(res)
        },
        async gql_fetch_data() {
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
            `
            const variables = {
                start: Store.oneYearPriorEndingPeriod,
                end: Store.endingPeriod,
                item: Store.item
            }

            try {
                const res = await client.request(query, variables)
                console.log(res)
            } catch {}
            
        },
        fetchData() {
            Store.isLoaded = false;

            let url = "http://104.200.28.226:8080";
            
            let config = {
                headers: {
                    "Authorization": Store.token
                }            
            };

            let exportCustomers = [
                "8497",
            ]

            let comparisonPct = 0.018
            
            axios.get(`${url}/sa?end=${Store.endingPeriod}&item=${Store.item}`, config).then(res => {

                if (res.data.currentPeriod) {
                    res.data.currentPeriod.forEach((x)=>{
                        x.customer = x._id.customer;
                        x.cid = x._id.cid;         
                        delete x._id           
                        x.freight = x.quantity * 3;
                        x.commissions = x.sales * 0.02;
                        x.rebates = x.rebates * -1;
                        if (exportCustomers.includes(x.cid)) {
                            x.freight = 0
                            x.commissions = 0
                        }
                        x.grossProfit = x.sales - x.costs - x.rebates - x.currentTradeDiscounts - x.commissions - x.freight;
                        x.grossProfitMargin = x.grossProfit / x.sales * 100;
                        x.averagePricePerCase = x.sales / x.quantity;
                        x.averageSellPricePerCaseAfterDiscountsAndRebates = (x.sales - x.rebates - x.currentTradeDiscounts) / x.quantity;
                        x.difference = x.averagePricePerCase - x.averageSellPricePerCaseAfterDiscountsAndRebates;
                    })
                } else {
                    res.data.currentPeriod = []
                }
                
                if (res.data.oneYearPrior) {
                    res.data.oneYearPrior.forEach((x)=>{
                        x.customer = x._id.customer;
                        x.cid = x._id.cid;       
                        delete x._id             
                        x.freight = x.quantity * 3;
                        x.commissions = x.sales * 0.02;
                        x.rebates = x.rebates * -1;
                        if (exportCustomers.includes(x.cid)) {
                            x.freight = 0
                            x.commissions = 0
                        }
                        x.grossProfit = x.sales - x.costs - x.rebates - x.currentTradeDiscounts - x.commissions - x.freight;
                        x.grossProfitMargin = x.grossProfit / x.sales * 100;
                        x.averagePricePerCase = x.sales / x.quantity;
                        x.averageSellPricePerCaseAfterDiscountsAndRebates = (x.sales - x.rebates - x.currentTradeDiscounts) / x.quantity;
                        x.difference = x.averagePricePerCase - x.averageSellPricePerCaseAfterDiscountsAndRebates;               
                    })
                } else {
                    res.data.oneYearPrior = []
                }
                
                if (res.data.twoYearPrior) {
                    res.data.twoYearPrior.forEach((x)=>{
                        x.customer = x._id.customer;
                        x.cid = x._id.cid;                    
                        delete x._id
                        x.freight = x.quantity * 3;
                        x.commissions = x.sales * 0.02;
                        x.rebates = x.rebates * -1;
                        if (exportCustomers.includes(x.cid)) {
                            x.freight = 0
                            x.commissions = 0
                        }
                        x.grossProfit = x.sales - x.costs - x.rebates - x.currentTradeDiscounts - x.commissions - x.freight;
                        x.grossProfitMargin = x.grossProfit / x.sales * 100;
                        x.averagePricePerCase = x.sales / x.quantity;
                        x.averageSellPricePerCaseAfterDiscountsAndRebates = (x.sales - x.rebates - x.currentTradeDiscounts) / x.quantity;
                        x.difference = x.averagePricePerCase - x.averageSellPricePerCaseAfterDiscountsAndRebates;           
                    })
                } else {
                    res.data.twoYearPrior = []
                }
                
                
                Store.currentPeriod = res.data.currentPeriod;
                Store.oneYearPriorPeriod = res.data.oneYearPrior;           
                Store.twoYearPriorPeriod = res.data.twoYearPrior;
                
                return res.data
            }).then((r) => {
                let qty = []
                let sales = []
                let costs = []

                let barChartData = []
                // [ { period: 1, sales: #}]

                if (r.currentPeriod) {
                    let currPdPie = []
                    let totalSum = []
                    r.currentPeriod.forEach((x) => {
                        if (!currPdPie.includes(x.cid+" "+x.customer)) {
                            currPdPie.push({x: x.cid+" "+x.customer, y: x.quantity})
                        }
                        totalSum.push(x.quantity)
                    })                    

                    currPdPie.sort((a,b) => b.y - a.y)
                    
                    let currPdSum = sum_array(totalSum) * comparisonPct
                    let simplifiedPie = []
                    let temp = []
                    for(let i=0; i < currPdPie.length; i++){
                        if(currPdPie[i].y > currPdSum) {
                            simplifiedPie.push(currPdPie[i])
                        } else {
                            temp.push(currPdPie[i].y)
                        }                    
                    }
                    simplifiedPie.push({
                        x: `ALL OTHERS < ${(comparisonPct * 100).toFixed(1)}% SOLD`, y: sum_array(temp),
                    })                                        

                    let currYr = {
                        qty: [],
                        sales: [],
                        costs: [],
                        rebates: [],
                        discounts: []
                    }
                    r.currentPeriod.forEach(function(x) {                                    
                        qty.push(x.quantity)
                        sales.push(x.sales)
                        costs.push(x.costs)
                        currYr.qty.push(x.quantity)
                        currYr.sales.push(x.sales)
                        currYr.costs.push(x.costs)
                        currYr.rebates.push(x.rebates)
                        currYr.discounts.push(x.currentTradeDiscounts)
                    })

                    Store.currPdPie = simplifiedPie

                    barChartData.push({
                        period: 1, sales: sum_array(currYr.sales)
                    })
                }
                if (r.oneYearPrior) {
                    let onePdPriorPie = []
                    let totalSum = []
                    r.oneYearPrior.forEach((x) => {
                        if (!onePdPriorPie.includes(x.cid+" "+x.customer)) {
                            onePdPriorPie.push({x: x.cid+" "+x.customer, y: x.quantity})
                        }
                        totalSum.push(x.quantity)
                    })

                    onePdPriorPie.sort((a,b) => b.y - a.y)
                    
                    let currPdSum = sum_array(totalSum) * comparisonPct

                    let simplifiedPie = []
                    let temp = []
                    for(let i=0; i < onePdPriorPie.length; i++){
                        if(onePdPriorPie[i].y > currPdSum) {
                            simplifiedPie.push(onePdPriorPie[i])
                        } else {
                            temp.push(onePdPriorPie[i].y)
                        }                    
                    }
                    simplifiedPie.push({
                        x: `ALL OTHERS < ${(comparisonPct * 100).toFixed(1)}% SOLD`, y: sum_array(temp),
                    })                            

                    Store.onePdPriorPie = simplifiedPie

                    let oneYr = {
                        qty: [],
                        sales: [],
                        costs: [],
                        rebates: [],
                        discounts: []
                    }
                    r.oneYearPrior.forEach(function(x) {
                        qty.push(x.quantity)
                        sales.push(x.sales)
                        costs.push(x.costs)
                        oneYr.qty.push(x.quantity)
                        oneYr.sales.push(x.sales)
                        oneYr.costs.push(x.costs)
                        oneYr.rebates.push(x.rebates)
                        oneYr.discounts.push(x.currentTradeDiscounts)
                    })

                    barChartData.push({
                        period: 2, sales: sum_array(oneYr.sales)
                    })
                }
                if (r.twoYearPrior) {
                    let twoPdPriorPie = []
                    let totalSum = []
                    r.twoYearPrior.forEach((x) => {
                        if (!twoPdPriorPie.includes(x.cid+" "+x.customer)) {
                            twoPdPriorPie.push({x: x.cid+" "+x.customer, y: x.quantity})
                        }
                        totalSum.push(x.quantity)
                    })

                    twoPdPriorPie.sort((a,b) => b.y - a.y)
                    
                    let currPdSum = sum_array(totalSum) * comparisonPct
                    let simplifiedPie = []
                    let temp = []
                    for(let i=0; i < twoPdPriorPie.length; i++){
                        if(twoPdPriorPie[i].y > currPdSum) {
                            simplifiedPie.push(twoPdPriorPie[i])
                        } else {
                            temp.push(twoPdPriorPie[i].y)
                        }                    
                    }
                    simplifiedPie.push({
                        x: `ALL OTHERS < ${(comparisonPct * 100).toFixed(1)}% SOLD`, y: sum_array(temp),
                    })                 

                    Store.twoPdPriorPie = simplifiedPie

                    let twoYr = {
                        qty: [],
                        sales: [],
                        costs: [],
                        rebates: [],
                        discounts: []
                    }
                    r.twoYearPrior.forEach(function(x) {
                        qty.push(x.quantity)
                        sales.push(x.sales)
                        costs.push(x.costs)
                        twoYr.qty.push(x.quantity)
                        twoYr.sales.push(x.sales)
                        twoYr.costs.push(x.costs)
                        twoYr.rebates.push(x.rebates)
                        twoYr.discounts.push(x.currentTradeDiscounts)
                    })

                    barChartData.push({
                        period: 3, sales: sum_array(twoYr.sales)
                    })
                }

                let divisor = 0
                if (r.currentPeriod) {
                    divisor++
                }
                if (r.oneYearPrior) {
                    divisor++
                }
                if (r.twoYearPrior) {
                    divisor++
                }

                Store.avgQty = sum_array(qty) / divisor
                Store.avgSales = sum_array(sales) / divisor
                Store.avgCosts = sum_array(costs) / divisor

                Store.barChartData = barChartData

            }).then(() => {
                Store.isLoaded = true                
            }).catch(e=>console.log(e))
        },
    },
    {
        setToken: action,
        unSetToken: action,
        oneYearPriorEndingPeriod: computed,        
        twoYearPriorEndingPeriod: computed,    
        zeroYear: computed,    
        oneYear: computed, 
        twoYear: computed,        
        checkValidToken: action,
        fetchData: action,
    }
)

export default Store;