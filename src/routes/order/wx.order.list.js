import React, { PureComponent } from 'react';

import { connect } from 'dva';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import { routerRedux } from 'dva/router'

import { OrderList } from '../../components/order/order.list'

@connect(({ orderWx, loading }) => {
    return ({
        order: orderWx,
        loading: loading.effects['orderWx/query']
    })
})
export default class OrderWXList extends PureComponent {
    componentWillMount() {
        const { page, limit, order_status } = this.props.order;
        this.props.dispatch({
            type: 'orderWx/query',
            params: {
                page: 1,
                limit,
                order_status: '0'
            }
        })
        this.props.dispatch({ type: 'orderWx/queryAmount' });
    }
    handleTab(status) {
        const { limit } = this.props.order;
        this.props.dispatch({
            type: 'orderWx/query',
            params: {
                page: 1,
                limit,
                order_status: status
            }
        })

    }
    handlePage(page) {
        const { limit, order_status } = this.props.order;
        this.props.dispatch({
            type: 'orderWx/query',
            params: {
                page: page,
                limit,
                order_status
            }
        })
    }
    mark = (params) => {
        this.props.dispatch({
            type: 'orderWx/mark',
            params
        })
    }
    delivery = (params) => {
        this.props.dispatch({
            type: 'orderWx/delivery',
            params
        })
    }
    cancel = (params) => {
        this.props.dispatch({
            type: 'orderWx/cancel',
            params
        })
    }
    orderDetails = (order_id) => {
        this.props.dispatch(routerRedux.push(`/order/wx/details/${order_id}`))
    }

    render() {
        const { dispatch, order, loading } = this.props;
        const { amount, order_status, limit } = order;

        const tabList = [{
            key: '0',
            tab: <p>全部 <span>{amount['0']}</span></p>,
        }, {
            key: '1',
            tab: <p>待付款 <span>{amount['1']}</span></p>,
        }, {
            key: '3',
            tab: <p>待发货 <span>{amount['3']}</span></p>,
        }, {
            key: '5',
            tab: <p>待收货 <span>{amount['5']}</span></p>,
        }, {
            key: '6',
            tab: <p>已完成 <span>{amount['6']}</span></p>,
        }, {
            key: '7',
            tab: <p>已关闭 <span>{amount['7']}</span></p>,
        }];
        return (
            <PageHeaderLayout
                tabList={tabList}
                tabActiveKey={order_status}
                onTabChange={(status) => this.handleTab(status)}
            >
                <OrderList order={order}
                    loading={loading}
                    type='wx' handlePage={(page) => this.handlePage(page)}
                    mark={this.mark}
                    cancel={this.cancel}
                    delivery={this.delivery}
                    orderDetails={this.orderDetails}
                />
            </PageHeaderLayout>
        );
    }
}