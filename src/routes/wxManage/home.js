import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import { Route, Redirect, Switch, routerRedux } from 'dva/router';

import React, { PureComponent } from 'react';

import { connect } from 'dva'

import NotFound from '../Exception/404';

import { getRoutes } from '../../utils/utils';

const tabList = [
    {
        key: 'banner',
        tab: "banner",
    },
    {
        key: 'article',
        tab: "图文消息",
    },
    {
        key: 'video',
        tab: "视频",
    }
]
@connect()
export default class WxManage extends PureComponent {
    getCurrentStep() {
        const { location } = this.props;
        const { pathname } = location;
        const pathList = pathname.split('/');
        return pathList[pathList.length - 1]
    }
    handleTab(key) {
        this.props.dispatch(routerRedux.push(`/wxManage/home/${key}`))
    }
    render() {
        const { match, routerData } = this.props;
        return (<PageHeaderLayout
            tabList={tabList}
            tabActiveKey={this.getCurrentStep()}
            onTabChange={(key) => this.handleTab(key)}
        >
            <Switch>
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
                <Redirect exact from="/wxManage/home" to="/wxManage/home/banner" />
                <Route render={NotFound} />
            </Switch>

        </PageHeaderLayout>)
    }
}


