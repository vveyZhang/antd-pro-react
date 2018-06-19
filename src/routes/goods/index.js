
import NotFound from '../Exception/404';
import { Route, Redirect, Switch } from 'dva/router';
import { getRoutes } from '../../utils/utils';
import GoodsList from './list'
const Goods = (props) => {
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
        <Route exact component={GoodsList} />
        <Route render={NotFound} />
    </Switch>
}

export default Goods