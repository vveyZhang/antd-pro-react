import React, { PureComponent } from 'react';
import OrderDetails from '../../components/order/order.details'
import { connect } from 'dva'
@connect(({ orderWx, loading }) => {
    return ({
        order: orderWx.orderDetails.orders[0],
        products: orderWx.orderDetails.products,
        loading: loading.effects['orderWx/queryDetails']
    })
})
export default class OrderWxDetails extends PureComponent {
    componentWillMount() {
        const { match, dispatch } = this.props;
        const order_id = match.params.id;
        this.props.dispatch({
            type: 'orderWx/queryDetails',
            params: {
                order_id: order_id
            }
        })
    }
    componentWillUnmount() {
        this.props.dispatch({
            type: 'orderWx/saveData',
            params: {
                order_id: null
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
    render() {
        const { order, products, loading } = this.props;
        return (<div>
            {order ? <OrderDetails
                products={products}
                order={order} type='wx'
                mark={this.mark}
                delivery={this.delivery}
                loading={loading}
                cancel={this.cancel}
            /> : null}
        </div>)
    }
}