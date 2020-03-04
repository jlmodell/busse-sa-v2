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
        chartData: [],
        currYrMaths: {},
        oneYrMaths: {},
        twoYrMaths: {},
        isLoaded: false,
        fetchData() {
            Store.isLoaded = false;

            let url = "http://104.200.28.226:8080";
            
            let config = {
                headers: {
                    "Authorization": Store.token
                }            
            };
            
            axios.get(`${url}/sa?end=${Store.endingPeriod}&item=${Store.item}`, config).then(res => {
                
                res.data.currentPeriod.forEach((x)=>{
                    x.customer = x._id.customer;
                    x.cid = x._id.cid;
                    x.freight = x.quantity * 3;
                    x.commissions = x.sales * 0.02;
                    x.rebates = x.rebates * -1;
                    x.grossProfit = x.sales - x.costs - x.rebates - x.currentTradeDiscounts - x.commissions - x.freight;
                    x.grossProfitMargin = x.grossProfit / x.sales * 100;
                    x.averagePricePerCase = x.sales / x.quantity;
                    x.averageSellPricePerCaseAfterDiscountsAndRebates = (x.sales - x.rebates - x.currentTradeDiscounts) / x.quantity;
                    x.difference = x.averagePricePerCase - x.averageSellPricePerCaseAfterDiscountsAndRebates;
                })
                res.data.oneYearPrior.forEach((x)=>{
                    x.customer = x._id.customer;
                    x.cid = x._id.cid;
                    x.freight = x.quantity * 3;
                    x.commissions = x.sales * 0.02;
                    x.rebates = x.rebates * -1;
                    x.grossProfit = x.sales - x.costs - x.rebates - x.currentTradeDiscounts - x.commissions - x.freight;
                    x.grossProfitMargin = x.grossProfit / x.sales * 100;
                    x.averagePricePerCase = x.sales / x.quantity;
                    x.averageSellPricePerCaseAfterDiscountsAndRebates = (x.sales - x.rebates - x.currentTradeDiscounts) / x.quantity;
                    x.difference = x.averagePricePerCase - x.averageSellPricePerCaseAfterDiscountsAndRebates;               
                })
                res.data.twoYearPrior.forEach((x)=>{
                    x.customer = x._id.customer;
                    x.cid = x._id.cid;
                    x.freight = x.quantity * 3;
                    x.commissions = x.sales * 0.02;
                    x.rebates = x.rebates * -1;
                    x.grossProfit = x.sales - x.costs - x.rebates - x.currentTradeDiscounts - x.commissions - x.freight;
                    x.grossProfitMargin = x.grossProfit / x.sales * 100;
                    x.averagePricePerCase = x.sales / x.quantity;
                    x.averageSellPricePerCaseAfterDiscountsAndRebates = (x.sales - x.rebates - x.currentTradeDiscounts) / x.quantity;
                    x.difference = x.averagePricePerCase - x.averageSellPricePerCaseAfterDiscountsAndRebates;           
                })
                
                Store.currentPeriod = res.data.currentPeriod;
                Store.oneYearPriorPeriod = res.data.oneYearPrior;           
                Store.twoYearPriorPeriod = res.data.twoYearPrior;
                
                return res.data
            }).then((r) => {
                let qty = []
                let sales = []
                let costs = []

                let currYr = {
                    qty: [],
                    sales: [],
                    costs: [],
                    rebates: [],
                    discounts: []
                }
                let oneYr = {
                    qty: [],
                    sales: [],
                    costs: [],
                    rebates: [],
                    discounts: []
                }
                let twoYr = {
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

                Store.avgQty = sum_array(qty) / 3
                Store.avgSales = sum_array(sales) / 3
                Store.avgCosts = sum_array(costs) / 3            

                // data = [# # #]
                // headers = ["Quantity", "Sales", "Costs"]

                let current = []

                current.push("Current")
                current.push(sum_array(currYr.qty))
                current.push(sum_array(currYr.sales))
                current.push(sum_array(currYr.costs))

                let oneYrPrior = []

                oneYrPrior.push("One Year Prior")
                oneYrPrior.push(sum_array(oneYr.qty))
                oneYrPrior.push(sum_array(oneYr.sales))
                oneYrPrior.push(sum_array(oneYr.costs))

                let twoYrPrior = []

                twoYrPrior.push("Two Years Prior")
                twoYrPrior.push(sum_array(twoYr.qty))
                twoYrPrior.push(sum_array(twoYr.sales))
                twoYrPrior.push(sum_array(twoYr.costs))

                let average = []

                average.push("Average")
                average.push(sum_array(qty) / 3)
                average.push(sum_array(sales) / 3)
                average.push(sum_array(costs) / 3)

                let temp = []

                temp.push(["Period", "Qty", "Sales", "Costs"])
                temp.push(twoYrPrior)
                temp.push(oneYrPrior)
                temp.push(current)

                Store.chartData = temp;

                let zero = {
                    sales: sum_array(currYr.sales),
                    tradeDiscounts: sum_array(currYr.discounts),
                    costs: sum_array(currYr.costs),
                    quantity: sum_array(currYr.qty),
                    rebates: sum_array(currYr.rebates),
                };

                let one = {
                    sales: sum_array(oneYr.sales),
                    tradeDiscounts: sum_array(oneYr.discounts),
                    costs: sum_array(oneYr.costs),
                    quantity: sum_array(oneYr.qty),
                    rebates: sum_array(oneYr.rebates),
                };

                let two = {
                    sales: sum_array(twoYr.sales),
                    tradeDiscounts: sum_array(twoYr.discounts),
                    costs: sum_array(twoYr.costs),
                    quantity: sum_array(twoYr.qty),
                    rebates: sum_array(twoYr.rebates),
                };

                Store.currYrMaths = zero;
                Store.oneYrMaths = one;
                Store.twoYrMaths = two;                
                
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
// decorate(Store, {
//     email: observable,
//     password: observable,
//     token: observable,
//     setToken: action,
//     unSetToken: action,
//     item: observable,
//     endingPeriod: observable,
//     oneYearPriorEndingPeriod: computed,        
//     twoYearPriorEndingPeriod: computed,    
//     zeroYear: computed,    
//     oneYear: computed, 
//     twoYear: computed,        
//     currentPeriod: observable,
//     oneYearPriorPeriod: observable,
//     twoYearPriorPeriod: observable,
//     avgQty: observable,
//     avgSales: observable,
//     avgCosts: observable,
//     chartData: observable,
//     currYrMaths: observable,
//     oneYrMaths: observable,
//     twoYrMaths: observable,
//     isLoaded: observable,
//     fetchData: action,
// })

function sum_array(array) {
    let total = 0
    for(let i=0; i < array.length; i++) {
        total += array[i]
    }
    return total
}

export default Store;