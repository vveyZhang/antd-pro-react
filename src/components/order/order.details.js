import React, { Component, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { Button, Icon, Row, Col, Steps, Card, Table, Spin } from 'antd';
import classNames from 'classnames';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../DescriptionList';
import styles from './order.details.less';
import { filterOrderType, filterOrderStatus, filterPayMode, filterOrderWxStatus, getAgent, agnetInfo } from './filter'
import { CheckVoucher, Payment, UpdateMark, DeliveryMark, CancelOrder } from './modal'
import { filterTime, filterTimeHMS, filterTimeYMD } from '../../utils/format';
const { Step } = Steps;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;
const getWindowWidth = () => (window.innerWidth || document.documentElement.clientWidth);


const descriptionDeatils = (time) => (
    <div>{filterTimeYMD(time)}<br />{filterTimeHMS(time)}</div>
);
const columns = [{
    title: '商品名称',
    dataIndex: 'name',
    key: 'name',
    width: '340px',
    render: (item, record) => (<div className={styles.goodslist}>
        <img src={record.thumb_url} /><div>
            <h1>{record.name}</h1>
            <h2>{record.describe}</h2>
            <p>重量：{record.weight}g</p>
        </div>
    </div>)
}, {
    title: '商品货号',
    dataIndex: 'product_id',
    key: 'product_id',
}, {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
},
{
    title: '数量',
    dataIndex: 'count',
    key: 'count',
},
{
    title: '小计',
    dataIndex: 'total',
    key: 'total',
}
];
function getData(products, items) {
    let goods = [], count = 0, total = 0;
    for (let i = 0; i < products.length; i++) {
        const product = products[i]
        for (let k = 0; k < items.length; k++) {
            if (product.product_id == items[k].ProductID) {
                count = items[k].Count;
                goods.push({
                    key: i,
                    thumb_url: product.thumb_url,
                    name: product.name,
                    describe: product.describe,
                    product_id: product.product_id,
                    weight: product.weight,
                    price: product.price / 100,
                    count: count,
                    total: product.price * count / 100
                })
                break;
            }
        }

    }
    return goods;

}
function getTotal(items) {
    let total = 0;
    for (let item of items) {
        total = item.Price
    }
    return total
}
export default class OrderDetails extends Component {
    state = {
        stepDirection: 'horizontal',
    }

    componentDidMount() {
        this.setStepDirection();
        window.addEventListener('resize', this.setStepDirection);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setStepDirection);
        this.setStepDirection.cancel();
    }

    onOperationTabChange = (key) => {
        this.setState({ operationkey: key });
    }
    @Bind()
    @Debounce(200)
    setStepDirection() {
        const { stepDirection } = this.state;
        const w = getWindowWidth();
        if (stepDirection !== 'vertical' && w <= 576) {
            this.setState({
                stepDirection: 'vertical',
            });
        } else if (stepDirection !== 'horizontal' && w > 576) {
            this.setState({
                stepDirection: 'horizontal',
            });
        }
    }


    render() {
        const { stepDirection } = this.state;
        const { order, type, products, agents, payment, mark, delivery, cancel, loading } = this.props;
        const order_status = order.order_status;
        const agent = type == 'agent' ? agents[0] : {}
        const paymentSetting = (order_id) => {
            this.Payment.open(order_id)
        }
        const updateMarkSetting = (order_id) => {
            this.UpdateMark.open(order_id, order.mark)
        }
        const deliveryMarkSetting = (order_id) => {
            this.DeliveryMark.open(order_id)
        }

        const cancelOrderSetting = (order_id) => {
            CancelOrder(order_id, cancel)
        }
        const checkVoucherSetting = (url) => {
            this.CheckVoucher.open(url)
        }
        const action = (
            <Fragment>
                <ButtonGroup>
                    <Button
                        onClick={() => updateMarkSetting(order.order_id, order.mark)} >卖家备注</Button>
                    {type != 'wx' && order_status == 2 ?
                        <Button
                            onClick={() => paymentSetting(order.order_id)}
                        >打款审核</Button>
                        :
                        null}
                    {type != 'wx' && order_status > 3 && order.voucher && order.pay_mode == 1 ?
                        <Button
                            onClick={() => checkVoucherSetting(order.voucher)}
                        >查看凭证</Button>
                        :
                        null
                    }
                    {
                        order_status > 2 && order_status < 5 ?
                            <Button
                                onClick={() => deliveryMarkSetting(order.order_id)}
                            >标记发货</Button>
                            : null
                    }
                    {order_status == 1 ? <Button
                        onClick={() => cancelOrderSetting(order.order_id, cancel)}
                    >取消订单</Button> : null}

                </ButtonGroup>
            </Fragment>
        );
        const description = type == 'agent' ? (
            <DescriptionList className={styles.headerList} size="small" col="2">
                <Description term="快递单号">{order.express_id}</Description>
                <Description term="快递方式">{order.delivery}</Description>
                <Description term="订单类型">{filterOrderType(order.order_type)}</Description>
                <Description term="付款方式">{filterPayMode(order.pay_mode)}</Description>
                <Description term="下单代理商">{agent.name}</Description>
                <Description term="收货人">
                    {order.address.name}
                </Description>
                <Description term="收货人电话">
                    {order.address.phone}
                </Description>
                <Description term="收货地址">
                    {(order.address.province + order.address.city + order.address.district + order.address.street)}
                </Description>
                <Description term="买家留言">{order.note}</Description>
                <Description term="卖家备注">{order.mark}</Description>
            </DescriptionList>
        ) : (
                <DescriptionList className={styles.headerList} size="small" col="2">
                    <Description term="快递单号">{order.express_id}</Description>
                    <Description term="快递方式">{order.delivery}</Description>
                    <Description term="收货人">
                        {order.wx_address.UserName}
                    </Description>
                    <Description term="收货人电话">
                        {order.wx_address.TelNumber}
                    </Description>
                    <Description term="收货地址">
                        {(order.wx_address.ProvinceName + order.wx_address.CityName + order.wx_address.CountyName + order.wx_address.DetailInfo)}
                    </Description>
                    <Description term="买家留言">{order.note}</Description>
                    <Description term="卖家备注">{order.mark}</Description>
                </DescriptionList>
            );

        const extra = (
            <Row>
                <Col xs={24} sm={12}>
                    <div className={styles.textSecondary}>订单状态</div>
                    <div className={styles.heading}>
                        {type == 'agent' ? filterOrderStatus(order.order_status) : filterOrderWxStatus(order.order_status)}
                    </div>
                </Col>
                <Col xs={24} sm={12}>
                    <div className={styles.textSecondary}>订单金额</div>
                    <div className={styles.heading}>¥ {order.amount / 100}<br />（含运费：{order.freight / 100 == 0 ? '0.00' : order.freight / 100}）</div>
                </Col>
            </Row>
        );
        return (
            <div style={{ position: 'relative' }} >
                <PageHeaderLayout
                    title={`单号：${order.order_id}`}
                    action={action}
                    content={description}
                    extraContent={extra}
                    logo={<div style={{ width: '5px', height: '10px' }} ></div>}
                >
                    <CheckVoucher ref={(ref) => this.CheckVoucher = ref} />
                    <Payment ref={(ref) => this.Payment = ref} submit={payment} />
                    <UpdateMark ref={(ref) => this.UpdateMark = ref} submit={mark} />
                    <DeliveryMark ref={(ref) => this.DeliveryMark = ref} submit={delivery} />

                    <Card title="订单进度"
                        style={{ marginBottom: 24 }}
                        bordered={false}
                        loading={loading}
                    >
                        <Steps direction={stepDirection}>
                            <Step title={'下单'}
                                status={"finish"}
                                description={descriptionDeatils(order.create_time)}
                            />
                            {
                                order.order_status != 7 ?
                                    <Step title={"付款"}
                                        status={order.order_status > 1 ? "finish" : "wait"}
                                        description={descriptionDeatils(order.payment_time)}
                                    /> : null
                            }

                            {order.order_status != 7 && type == 'agent' ? <Step title="审核"
                                status={order.order_status > 2 ? "finish" : "wait"}
                                description={descriptionDeatils(order.pay_confirm_time)}
                            /> : null}
                            {order.order_status != 7 ?
                                <Step title="发货"
                                    status={order.order_status > 3 ? "finish" : "wait"}
                                    description={descriptionDeatils(order.deliver_time)}
                                /> : null}
                            {order.order_status != 7 ?
                                <Step title="完成"
                                    status={order.order_status == 6 ? "finish" : "wait"}
                                    description={descriptionDeatils(order.confirm_time)}
                                /> : null}
                            {order.order_status == 7 ? <Step title="关闭" status='finish' /> : null}
                        </Steps>
                    </Card>
                    {
                        type == 'agent' ?
                            <Card
                                title="下单关系" style={{ marginBottom: 24 }}
                                bordered={false}
                                loading={loading}
                            >
                                <DescriptionList style={{ marginBottom: 24 }} title="购买方">
                                    <Description term="姓名">{agnetInfo(agent).name}</Description>
                                    <Description term="手机号">{agnetInfo(agent).phone}</Description>
                                    <Description term="代理等级">{agnetInfo(agent).level}</Description>
                                </DescriptionList>
                                <DescriptionList style={{ marginBottom: 24 }} title="出售方"  >
                                    <Description term="姓名">{agnetInfo(agent.master).name}</Description>
                                    <Description term="手机号">{agnetInfo(agent.master).phone}</Description>
                                    <Description term="代理等级">{agnetInfo(agent.master).level}</Description>
                                </DescriptionList>
                            </Card> :
                            null
                    }
                    <Card
                        bordered={false}
                        title='购买商品'
                        loading={loading}
                    >
                        <Table style={{ marginTop: '40px' }}
                            dataSource={getData(products, order.items)} loading={loading} columns={columns} pagination={false} />
                        <div className={styles.orderOther}>
                            商品合计：￥{getTotal(order.items) / 100} <span></span>     运费：￥ {order.freight / 100}       应付款({type != "wx" ? filterPayMode(order.is_paid)
                                :
                                order.trade_state == "SUCCESS" ? "已支付" : "未支付"
                            })：￥{order.amount / 100}
                        </div>
                    </Card>
                </PageHeaderLayout>
            </div>
        );
    }
}

