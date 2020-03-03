import * as React from 'react';
import { Switch, Redirect, Route, RouteComponentProps, withRouter } from 'react-router-dom';
import Store from '../store/store'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard';
import { observer } from 'mobx-react'

interface IProps {        
    path: string,
    exact?: boolean
}

interface Props extends RouteComponentProps<any> {}
  
const PrivateRoute: React.FC<IProps> = ({ children, ...rest }) => {
    return (
        <Route
            {...rest}
            render={() =>
            Store.token ? (
                children
            ) : (
                <Redirect to="/" />
            )
            }
        />
    )
}


const Routes: React.FC<Props> = observer(() => {    

    return (
        <Switch>
            <Route exact path="/">
                <Login />
            </Route>
            <PrivateRoute exact path="/sa">
                <Dashboard />
            </PrivateRoute>
        </Switch>        
    )
})

export default withRouter(Routes)