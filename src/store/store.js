import { action, computed, observable } from "mobx";
import axios from "axios";

/* eslint-disable */

var Store = observable(
    {
        email: "",
        password: "",
        token: localStorage.getItem("token") || "",
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
        endingPeriod: localStorage.getItem("endingPeriod") || "",        
        get oneYearPriorEndingPeriod() {
            let ep = new Date(Store.endingPeriod)
            return new Date(ep.getFullYear()-1, ep.getMonth(), ep.getDate()+1).toISOString().substring(0,10)
        },
        get twoYearPriorEndingPeriod() {
            let ep = new Date(Store.endingPeriod)
            return new Date(ep.getFullYear()-2, ep.getMonth(), ep.getDate()+1).toISOString().substring(0,10)
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
        isLoaded: false,
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

                if (r.currentPeriod) {
                    let currPdPie = []
                    r.currentPeriod.forEach((x) => {
                        if (!currPdPie.includes(x.cid+" "+x.customer)) {
                            currPdPie.push({x: x.cid+" "+x.customer, y: x.quantity})
                        }
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
                    Store.currPdPie = currPdPie

                }
                if (r.oneYearPrior) {
                    let onePdPriorPie = []
                    r.oneYearPrior.forEach((x) => {
                        if (!onePdPriorPie.includes(x.cid+" "+x.customer)) {
                            onePdPriorPie.push({x: x.cid+" "+x.customer, y: x.quantity})
                        }
                    })
                    Store.onePdPriorPie = onePdPriorPie

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
                }
                if (r.twoYearPrior) {
                    let twoPdPriorPie = []
                    r.twoYearPrior.forEach((x) => {
                        if (!twoPdPriorPie.includes(x.cid+" "+x.customer)) {
                            twoPdPriorPie.push({x: x.cid+" "+x.customer, y: x.quantity})
                        }
                    })
                    Store.twoPdPriorPie = twoPdPriorPie

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

function sum_array(array) {
    let total = 0
    for(let i=0; i < array.length; i++) {
        total += array[i]
    }
    return total
}

export default Store;