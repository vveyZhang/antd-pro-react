import styles from './order.less'
import { Row, Col, Pagination, Icon, Card, Spin } from 'antd';
import { PureComponent } from 'react'
import { OrderItem } from './order.item'
import { CheckVoucher, Payment, UpdateMark, DeliveryMark, CancelOrder } from './modal'

export class OrderList extends PureComponent {
    onChange = (page) => {
        this.props.handlePage(page)
        document.body.scrollIntoView(true)
    }

    render() {
        const { type, order, loading, mark, cancel, delivery, orderDetails, payment, } = this.props;
        const { page, limit, orders, products, agents, count } = order;
        const checkVoucherSetting = (url) => {
            this.CheckVoucher.open(url)
        }
        const paymentSetting = (order_id) => {
            this.Payment.open(order_id)
        }
        const updateMarkSetting = (order_id, mark) => {
            this.UpdateMark.open(order_id, mark)
        }
        const deliveryMarkSetting = (order_id) => {
            this.DeliveryMark.open(order_id)
        }
        const orderDetailsSetting = (order_id) => {
            orderDetails(order_id)
        }
        const cancelOrderSetting = (order_id) => {
            CancelOrder(order_id, cancel)
        }
        const setting = {
            checkVoucherSetting,
            paymentSetting,
            updateMarkSetting,
            orderDetailsSetting,
            deliveryMarkSetting,
            cancelOrderSetting
        }
        return <div className={styles.standardList}>
            <CheckVoucher ref={(ref) => this.CheckVoucher = ref} />
            <Payment ref={(ref) => this.Payment = ref} submit={payment} />
            <UpdateMark ref={(ref) => this.UpdateMark = ref} submit={mark} />
            <DeliveryMark ref={(ref) => this.DeliveryMark = ref} submit={delivery} />
            <div className={styles.orderTile} >
                <Row>
                    <Col span={8}>商品 <span style={{ float: 'right', marginRight: 20 }}>单价/数量</span> </Col>
                    <Col span={3}>下单时间</Col>
                    <Col span={3}>收货人</Col>
                    <Col span={4}>留言</Col>
                    <Col span={3}>订单金额</Col>
                    <Col span={3}>操作</Col>
                </Row>
            </div>
            <div className={styles.orderListContaienr} >
                <Spin spinning={loading} delay={100} >
                    {
                        orders.map(item => <OrderItem setting={setting} products={products} agents={agents} type={type} {...item} key={item.order_id} />)
                    }
                </Spin>


            </div>
            <div className={styles.PageConainer} >
                {count > 0 ? <Pagination showQuickJumper pageSize={limit} current={page} total={count} onChange={page => this.onChange(page)} /> : null}
            </div>
        </div>
    }
}