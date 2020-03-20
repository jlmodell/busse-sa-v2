import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

export function useGQLQuery(item, token, start, end) {
    const QUERY = gql`
    query {
            item(iid:"${item}")
            sales(
                token:"${token}",
                start:"${start}", 
                end:"${end}",
                item:"${item}"
            ) {
                _id {
                    cid,
                    customer
                    __typename
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
                    avgSalePrice
                    avgSalePriceAfterDiscounts 
                    __typename
            }
        }
    `;
    
    const { data } = useQuery(QUERY)

    return {
        data
    }

}