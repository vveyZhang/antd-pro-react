
import React, { PureComponent } from 'react';

import { Card, List, Avatar, Modal, Button } from 'antd'

import { filterTimeYMD } from '../../utils/format'

import { connect } from 'dva';

import numeral from 'numeral';

import styles from './coupon.less'

import { AddCoupon, CouponRang, Discount } from './coupon.modal'

import { filterCouponTarget, filterCouponType, filterCouponStatus } from './filter'


const confirm = Modal.confirm;

@connect(({ coupon, loading, goods }) => ({
    ...coupon,
    goods: goods.product,
    loading: loading.models.coupon
}))
export default class Coupon extends PureComponent {

    componentWillMount() {
        this.props.dispatch({ type: 'coupon/query' });
        this.props.dispatch({ type: 'goods/query' })
    }
    handleButton(item) {
        const { dispatch } = this.props
        confirm({
            title: '提示',
            content: `是否${item.State == 'ON' ? '下架' : '发放'}${item.Type}`,
            okText: "确定",
            cancelText: "关闭",
            onOk() {
                dispatch({
                    type: 'coupon/update', params: {
                        coupon_index: item.ID,
                        state: item.State == 'ON' ? 'OFF' : 'ON'
                    }
                })
            },
        });
    }
    handleDelete(item) {
        const { dispatch } = this.props
        confirm({
            title: '警告',
            content: `是否删除该${item.Type}`,
            okText: "删除",
            cancelText: "关闭",
            onOk() {
                dispatch({
                    type: 'coupon/update', params: {
                        coupon_index: item.ID,
                        state: 'DEL'
                    }
                })
            },
        });
    }
    handleSubmit = (params) => {
        const { dispatch } = this.props
        dispatch({ type: 'coupon/create', params })
    }
    handleDiscount = (params) => {
        const { dispatch } = this.props
        dispatch({ type: 'coupon/updateDiscount', params })
    }
    handleRange = (params) => {
        const { dispatch } = this.props
        dispatch({ type: 'coupon/updateRangeCoupon', params })
    }
    render() {
        const { origins, loading, staffDiscount, goods } = this.props;
        const CardInfo = ({ value, min, status, target }) => (
            <div className={styles.cardInfo}>
                <div>
                    <p>优惠金额</p>
                    <p>￥{value}</p>
                </div>
                <div>
                    <p>使用条件</p>
                    <p>满￥{min}</p>
                </div >
                <div className={styles.status}>
                    <p  >使用范围</p>
                    <p>{filterCouponTarget(target)}</p>
                </div>
                <div className={styles.status}>
                    <p className={styles.status} >状态</p>
                    <p>{filterCouponStatus(status)}</p>
                </div>
            </div>
        );
        return (<div >
            <Button type="primary" onClick={() => this.coupon.open()}>添加批次</Button>
            {/* <Button style={{ marginLeft: '20px' }} type="primary" onClick={() => this.doscount.open(staffDiscount)}>设置员工折扣</Button> */}
            <Discount ref={ref => this.doscount = ref} submit={this.handleDiscount} goods={goods} />
            <AddCoupon ref={ref => this.coupon = ref} submit={this.handleSubmit} />
            <CouponRang ref={ref => this.couponRagne = ref} submit={this.handleRange} />
            <div className={styles.CardList} >
                <List
                    rowKey="ID"
                    loading={loading}
                    grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
                    dataSource={origins}
                    renderItem={item => (
                        <List.Item key={item.ID}   >
                            <Card
                                hoverable
                                bodyStyle={{ paddingBottom: 20 }}
                                actions={[<a onClick={() => this.couponRagne.open(item.ID, item.Target)} >修改</a>,
                                <a onClick={() => this.handleButton(item)} > {item.State == 'ON' ? '下架' : '发放'} </a>,
                                <a onClick={() => this.handleDelete(item)} > 删除 </a>
                                ]}
                            >
                                <Card.Meta
                                    avatar={<Avatar size="large" style={{ backgroundColor: '#87d068' }} > {filterCouponType(item.Type)}</Avatar>}
                                    title={<div className={styles.couponName} >

                                        <p>{item.Payload.coupon_name}</p>
                                    </div>}
                                    description={
                                        <p>
                                            有效时间：{filterTimeYMD(new Date(item.Payload.begin_time * 1000))}—{filterTimeYMD(new Date(item.Payload.end_time * 1000))}
                                        </p>
                                    }
                                />
                                <div className={styles.cardItemContent}>
                                    <CardInfo
                                        value={numeral(item.Payload.coupon_value / 100).format('0.00')}
                                        min={numeral(item.Payload.coupon_mininumn / 100).format('0.00')}
                                        status={item.State}
                                        target={item.Target}
                                    />
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>

        </div>)
    }
}