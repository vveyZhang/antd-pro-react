import React, { PureComponent } from 'react';

import { Modal, Select, Input, Button, message, InputNumber, Checkbox } from 'antd'
import { filterCouponTarget, couponTarget, filterCouponType, couponType } from './filter'
import DescriptionList from '../../components/DescriptionList';
const { Description } = DescriptionList;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const formatGoods = (goods) => {
    const data = [];
    for (let item of goods) {
        data.push({
            label: item.name,
            value: item.product_id
        })
    }
    return data
}
export class Discount extends PureComponent {
    static defaultProps = {
        goods: []
    }
    changeInput(value) {
        this.setState({
            discount: Math.ceil(parseFloat(value * 10).toFixed(0)),
        })
    }
    state = {
        visible: false,
        discount: 0,
        id: null,
        checkedList: [],
        indeterminate: true,
        checkAll: false

    }
    open = (staffDiscount) => {
        let discount = 100;
        const checkedList = [];
        for (let key in staffDiscount.items) {
            discount = staffDiscount.items[key];
            checkedList.push(key);
        }
        this.setState({
            visible: true,
            discount,
            checkedList
        })
    }
    close = () => {
        this.setState({
            visible: false,
        })
    }
    onChange = (checkedList) => {
        const { goods } = this.props;
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < goods.length),
            checkAll: checkedList.length === goods.length,
        });
    }
    onCheckAllChange = (e) => {
        const { goods } = this.props;
        const all = [];
        for (let item of goods) {
            all.push(item.product_id)
        }
        this.setState({
            checkedList: e.target.checked ? all : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    }
    submit() {
        const { checkedList, discount } = this.state;
        if (!discount) {
            message.warning('请输入折扣');
            return;
        }
        if (checkedList.length <= 0) {
            message.warning('请选择商品');
            return;
        }
        this.close();
        this.props.submit({
            discount: this.state.discount,
            product_ids: JSON.stringify(checkedList)
        })
    }
    render() {
        const { discount } = this.state;
        const { goods } = this.props
        return (<Modal
            wrapClassName="vertical-center-modal"
            title='员工折扣'
            cancelText='关闭'
            okText='确认'
            style={{ width: '200px' }}
            visible={this.state.visible}
            onOk={() => this.submit()}
            onCancel={() => this.close()}
            width={600}
        >
            <DescriptionList size="small" col="1">
                <Description term="内部员工享受">
                    <InputNumber placeholder="折扣价格"
                        min={0}
                        max={10}
                        precision={1}
                        value={Math.ceil(parseFloat(discount).toFixed(0)) / 10}
                        style={{ width: '120px', marginRight: '10px' }}
                        onChange={(value) => this.changeInput(value)}
                    />
                    <span>折</span>
                </Description>
                <Description term="选择折扣商品">
                    <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                    >全选</Checkbox>
                    <div style={{ marginBottom: '5px' }} />
                    <CheckboxGroup options={formatGoods(goods)} value={this.state.checkedList} onChange={this.onChange} />
                </Description>
            </DescriptionList>

        </Modal>)
    }

}
export class CouponRang extends PureComponent {

    changeSelect(value) {
        this.setState({
            target: value
        })
    }
    state = {
        visible: false,
        target: '',
        coupon_index: ''

    }
    open = (id, target) => {
        this.setState({
            visible: true,
            coupon_index: id,
            target: target,
        })
    }
    close = () => {
        this.setState({
            visible: false,
            coupon_index: '',
            target: ''
        })
    }
    submit() {
        this.close();
        this.props.submit({
            target: this.state.target,
            coupon_index: this.state.coupon_index
        })
    }
    render() {
        return (<Modal
            wrapClassName="vertical-center-modal"
            title='修改适用范围'
            cancelText='关闭'
            okText='确认'
            style={{ width: '200px' }}
            visible={this.state.visible}
            onOk={() => this.submit()}
            onCancel={() => this.close()}
        >
            <Select placeholder='选择批次' value={this.state.target} style={{ width: '80%', margin: '30px 10%' }} onChange={(e) => this.changeSelect(e)}>
                {couponTarget.map(item => <Option key={item} value={item}>{filterCouponTarget(item)}</Option>)}
            </Select>
        </Modal>)
    }

}

export class AddCoupon extends PureComponent {
    changeInput(value) {
        this.setState({
            coupon_index: value
        })
    }
    state = {
        visible: false,
        type: '',
        coupon_index: ''

    }
    changeSelect = (e) => {

        this.setState({
            type: e
        })

    }
    open = (order_id) => {
        this.setState({
            visible: true,
            type: '',
            coupon_index: ''
        })
    }
    close = () => {
        this.setState({
            visible: false,
        })
    }
    submit() {
        if (!this.state.type || !this.state.coupon_index) {
            message.warning('请完善信息');
            return;
        }

        this.close();
        this.props.submit({
            type: this.state.type,
            coupon_index: this.state.coupon_index
        })
    }
    render() {
        return (<Modal
            wrapClassName="vertical-center-modal"
            title='添加卡包'
            cancelText='关闭'
            okText='确认添加'
            style={{ width: '200px' }}
            visible={this.state.visible}
            onOk={() => this.submit()}
            onCancel={() => this.close()}
        >
            <Input placeholder="填写批次号" value={this.state.coupon_index} style={{ width: '80%', margin: '30px 10%' }} onChange={(e) => this.changeInput(e.target.value)} />
            <Select placeholder='选择批次' value={this.state.type} style={{ width: '80%', margin: '30px 10%' }} onChange={(e) => this.changeSelect(e)}>
                {couponType.map(item => <Option key={item} value={item}>{filterCouponType(item)}</Option>)}
            </Select>
        </Modal>)
    }

}