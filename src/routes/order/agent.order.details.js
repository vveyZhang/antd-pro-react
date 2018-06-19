import React, { PureComponent } from 'react';
import OrderDetails from '../../components/order/order.details'
import { connect } from 'dva'
@connect(({ orderAgent, loading }) => {
    return ({
        order: orderAgent.orderDetails.orders[0],
        products: orderAgent.orderDetails.products,
        agents: orderAgent.orderDetails.agents,
        loading: loading.effects['orderAgent/queryDetails']
    })
})
export default class OrderAgentDetails extends PureComponent {
    componentWillMount() {
        const { match, dispatch } = this.props;
        const order_id = match.params.id;
        this.props.dispatch({
            type: 'orderAgent/queryDetails',
            params: {
                order_id: order_id
            }
        })
    }
    componentWillUnmount() {
        this.props.dispatch({
            type: 'orderAgent/saveData',
            params: {
                order_id: null
            }
        })
    }
    payment = (params) => {
        this.props.dispatch({
            type: 'orderAgent/payment',
            params
        })
    }
    mark = (params) => {
        this.props.dispatch({
            type: 'orderAgent/mark',
            params
        })
    }
    delivery = (params) => {
        this.props.dispatch({
            type: 'orderAgent/delivery',
            params
        })
    }
    cancel = (params) => {
        this.props.dispatch({
            type: 'orderAgent/cancel',
            params
        })
    }
    render() {
        const { order, products, agents, loading } = this.props;
        return (<div>
            {order ? <OrderDetails

                products={products}
                mark={this.mark}
                payment={this.payment}
                delivery={this.delivery}
                cancel={this.cancel}
                order={order}
                agents={agents}
                loading={loading}
                type='agent' /> : null}
        </div>)
    }
}