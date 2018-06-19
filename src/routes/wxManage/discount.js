import React, { Component } from 'react';
import { Table, Popover, InputNumber, Button } from 'antd';
import styles from './discount.less';
import { connect } from 'dva';

@connect(({ goods, coupon }) => (
    {
        goods: goods.product,
        items: coupon.staffDiscount.items
    }
))
export default class Discount extends Component {
    componentWillMount() {
        this.props.dispatch({ type: 'coupon/query' });
        this.props.dispatch({ type: 'goods/query' })
    }
    columns = [{
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        width: '60%',
        render: (item, record) => (<div className={styles.goodslist}>
            <img src={record.thumb_url} />{record.name}
        </div>)
    }, {
        title: '商品货号',
        dataIndex: 'product_id',
        key: 'product_id',
        width: '10%',
    }, {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        width: '10%',
        render: (text) => "￥" + text / 100
    },
    {
        title: '折扣',
        dataIndex: 'discount',
        key: 'discount',
        width: '10%',
        render: (text) => text / 10
    }, {
        title: '操作',
        dataIndex: 'setting',
        key: 'setting',
        width: '10%',
        render: (text, item) => <DiscountPopover submit={this.changeDiscount} discount={item.discount} id={item.product_id} />
    }
    ];
    changeDiscount = (params) => {
        const { dispatch } = this.props;
        const proArray = [];
        let discount = 0
        for (let key in params) {
            discount = params[key];
            proArray.push(key)
        }
        dispatch({
            type: 'coupon/updateDiscount', params: {
                discount,
                product_ids: JSON.stringify(proArray)
            }
        })
    }
    render() {
        const { goods, items } = this.props;
        return (
            <div className={styles.discountContainer} >
                <Table rowKey='product_id' columns={this.columns} dataSource={formatGoods(goods, items)} />
            </div>
        )
    }
}
function formatGoods(goods, items) {
    const data = [];
    for (let item of goods) {
        const product_id = item.product_id
        data.push({
            ...item,
            discount: items[product_id] ? items[product_id] : 0
        })
    }
    return data
}
class DiscountPopover extends Component {
    state = {
        visible: false,
        value: 100
    }
    submit = () => {
        this.setState({
            visible: false,
        });
        const { value } = this.state;

        this.props.submit({
            [this.props.id]: value
        })
    }
    onChange = (value) => {
        this.setState({ value: Math.ceil(parseFloat(value).toFixed(0)) * 10 });
    }
    onVisibleChange = (visible, value) => {
        this.setState({ visible, value });
    }
    render() {
        const { visible, value } = this.state;
        const itemContent = <div>
            <div  ><InputNumber placeholder="折扣价格"
                min={0}
                max={10}
                precision={1}
                value={Math.ceil(parseFloat(value).toFixed(0)) / 10}
                style={{ width: '120px', marginRight: '10px' }}
                onChange={(value) => this.onChange(value)}
            /> <span>折</span></div>
            <div className={styles.userMarkButton} ><Button onClick={() => this.submit()} type='primary' >确定</Button></div>
        </div >
        return <Popover trigger="click" visible={visible} onVisibleChange={(visible) => this.onVisibleChange(visible, this.props.discount)} placement='bottom' content={itemContent}  >
            <a>修改折扣</a>
        </Popover>
    }
}