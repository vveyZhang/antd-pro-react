import { Button, Row, Col, Dropdown, Menu, Icon, Divider } from 'antd';

import styles from './order.less';

import { filterTimeYMD, filterTimeHMS } from '../../utils/format'

import { filterOrderStatus, filterPayMode, filterOrderType, filterOrderWxStatus, getAgent } from './filter';
export const OrderItem = (props) => {
    const height = props.items.length * 120 + 'px';
    const { type, order_status, order_id, setting, agents, mark } = props;
    const handleSetting = (key) => {
        if (key == 'updateMarkSetting') {
            return setting[key](order_id, mark)
        }
        key == 'checkVoucherSetting' ? setting[key](props.voucher) : setting[key](order_id)
    }
    const menu = (
        <Menu onClick={({ key }) => handleSetting(key)} >
            <Menu.Item key="updateMarkSetting" >
                <a>卖家备注</a>
            </Menu.Item>
            {
                type != 'wx' && order_status == 2
                    ?
                    <Menu.Item key="paymentSetting" >
                        <a>打款审核</a>
                    </Menu.Item>
                    : null
            }
            {
                type != 'wx' && order_status > 3 && props.voucher && props.pay_mode == 1 ?
                    <Menu.Item key="checkVoucherSetting" >
                        <a>查看凭证</a>
                    </Menu.Item>
                    : null
            }
            {order_status > 2 && order_status < 5 ?
                <Menu.Item key="deliveryMarkSetting" >
                    <a>标记发货</a>
                </Menu.Item>
                : null}

            {
                order_status == 1 ? <Menu.Item key="cancelOrderSetting" >
                    <a>取消订单</a>
                </Menu.Item>
                    : null
            }
        </Menu>
    );

    return (
        <div className={styles.OrderItemC} key={props.id}>
            <Row className={styles.title}>
                <Col className={styles.infor} span={12}>订单号：{props.order_id}<span>{type == "wx" ? filterOrderWxStatus(props.order_status) : filterOrderStatus(props.order_status)}</span>{type == 'wx' ? null : filterOrderType(props.order_type)}</Col>
                {type == 'wx' ? null : <Col className={styles.role} span={12}>进货代理：{getAgent(agents, props.master_id)}</Col>}
            </Row>
            <Row className={styles.orderContent} justify="space-around" align="middle" type="flex" >
                <Col span={8} style={{ borderRight: '1px solid #dedede' }}>
                    {props.items.map((item, i) => {
                        let product = props.products.filter((productItem => item.ProductID == productItem.product_id))[0];
                        return <div key={item.ProductID} className={styles.infor}>
                            <img src={product.thumb_url} />
                            <div span={8} className={styles.name}>
                                <h1>{product.name}</h1>
                                <h2>{product.describe}</h2>
                                <p>{product.weight}克</p>
                            </div>
                            <div className={styles.other}>
                                <h1>￥ {item.Price / 100}</h1>
                                <p>{item.Count}个</p>
                            </div>
                        </div>
                    })}
                </Col>
                <Col span={3} style={{ height: height }} className={styles.row}>{filterTimeYMD(props.create_time)}<br />{filterTimeHMS(props.create_time)}</Col>
                <Col span={3} style={{ height: height }} className={styles.row}>
                    {type == 'wx' ? props.wx_address.UserName : props.address.name} <br />{type == 'wx' ? props.wx_address.TelNumber : props.address.phone}
                </Col>
                <Col span={4} style={{ height: height }} style={{ justifyContent: 'flex-start' }} className={styles.row}>
                    <div className={styles.buyMessage}><span>买家留言：</span>{props.note} <br /><span>卖家备注：</span>{props.mark}</div>
                </Col>
                <Col span={3} style={{ height: height }} className={styles.row}>
                    <div className={styles.OrderItemAmount}>
                        <p><b>总金额：</b><span>￥{props.amount / 100}</span></p>
                        <p><b>含运费：</b><span>￥{props.freight / 100}</span></p>
                        {type != "wx" ? <p><b>支付方式：</b><span>{filterPayMode(props.pay_mode)}</span></p> : null}
                        {type == "wx" ? <p><b>支付状态：</b><span>{props.trade_state == "SUCCESS" ? "已支付" : "未支付"}</span></p> : null}
                    </div>
                </Col>
                <Col span={3} style={{ height: height, borderRight: '0px solid #dedede' }} className={styles.row} >
                    <span>
                        <a onClick={() => setting.orderDetailsSetting(order_id)} >订单详情</a>
                        <Divider type="vertical" />
                        <Dropdown overlay={menu} >
                            <a>更多 <Icon type="down" /></a>
                        </Dropdown>
                    </span>
                </Col>
            </Row>
        </div>
    )
}