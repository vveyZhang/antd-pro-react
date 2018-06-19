import NotFound from '../Exception/404';
import { Route, Redirect, Switch } from 'dva/router';
import { getRoutes } from '../../utils/utils';
const OrderWx = (props) => {
    const { match, routerData } = props;
    return <Switch>
        {
            getRoutes(match.path, routerData).map(item => {
                return (
                    <Route
                        key={item.key}
                        path={item.path}
                        component={item.component}
                        exact={item.exact}
                    />
                )
            })
        }
        <Redirect exact from="/order/wx" to="/order/wx/list" />
        <Route render={NotFound} />
    </Switch>
}

export default OrderWx