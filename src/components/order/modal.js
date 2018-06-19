
import React, { Component } from 'react';

import { Modal, Select, message, Input } from 'antd';

const Option = Select.Option;

const confirm = Modal.confirm;

const { TextArea } = Input;

// 查看凭证

export class CheckVoucher extends Component {
    state = {
        visible: false,
        url: ''
    }
    open = (url) => {
        this.setState({
            visible: true,
            url: url
        })
    }
    close = () => {
        this.setState({
            visible: false,
            url: null,
        })
    }
    render() {
        const { visible, url } = this.state;
        return <Modal visible={visible} footer={null} onCancel={() => this.close()}>
            <img style={{ width: '100%' }} src={url} />
        </Modal>
    }

}


// 打款审核
export class Payment extends Component {
    handleChange(value) {
        this.setState({
            is_paid: value
        })
    }
    state = {
        visible: false,
        is_paid: 1
    }
    open = (order_id) => {
        this.setState({
            visible: true,
            order_id: order_id
        })
    }
    close = () => {
        this.setState({
            visible: false,
            order_id: null,
            is_paid: 1
        })
    }
    submit() {
        this.props.submit({
            order_id: this.state.order_id,
            is_paid: this.state.is_paid
        })
        this.close();
    }
    render() {
        return (<Modal
            wrapClassName="vertical-center-modal"
            title='打款审核'
            cancelText='关闭'
            okText='确认审核'
            style={{ width: '200px' }}
            visible={this.state.visible}
            onOk={() => this.submit()}
            onCancel={() => this.close()}
        >
            <Select value={this.state.is_paid} style={{ width: '80%', margin: '30px 10%' }} onChange={(e) => this.handleChange(e)}>
                <Option value={0} >支付失败</Option>
                <Option value={1}>支付成功</Option>
            </Select>
        </Modal>)
    }
}

// 卖家备注
export class UpdateMark extends Component {
    handleChange(value) {
        this.setState({
            mark: value
        })
    }
    state = {
        visible: false,
        mark: ''

    }
    open = (order_id, mark) => {
        this.setState({
            visible: true,
            order_id: order_id,
            mark:mark,
        })
    }
    close = () => {
        this.setState({
            visible: false,
            order_id: null,
            mark: ''
        })
    }
    submit() {
        if (!this.state.mark) {
            message.warning('备注不能为空');
            return;
        }
        this.close();
        this.props.submit({
            order_id: this.state.order_id,
            mark: this.state.mark
        })
    }
    render() {
        return (<Modal
            wrapClassName="vertical-center-modal"
            title='卖家备注'
            cancelText='关闭'
            okText='备注'
            style={{ width: '200px' }}
            visible={this.state.visible}
            onOk={() => this.submit()}
            onCancel={() => this.close()}
        >
            <TextArea placeholder="卖家备注信息" value={this.state.mark} autosize onChange={(e) => this.handleChange(e.target.value)} />
        </Modal>)
    }

}


// 标记发货
export class DeliveryMark extends Component {
    handleChangeExpress(value) {
        this.setState({
            express_id: value
        })
    }
    handleChangeDelivery(value) {
        this.setState({
            delivery: value
        })
    }
    state = {
        visible: false,
        delivery: '申通',
        express_id: ''

    }
    open = (order_id) => {
        this.setState({
            visible: true,
            order_id: order_id,
            delivery: '申通',
            express_id: ''
        })
    }
    close = () => {
        this.setState({
            visible: false,
            order_id: 'null'
        })
    }
    submit() {
        if (!this.state.delivery || !this.state.express_id) {
            message.warning('请完善发货信息');
            return;
        }

        this.close();
        this.props.submit({
            order_id: this.state.order_id,
            delivery: this.state.delivery,
            express_id: this.state.express_id
        })
    }
    render() {
        return (<Modal
            wrapClassName="vertical-center-modal"
            title='标记发货'
            cancelText='关闭'
            okText='确认标记'
            style={{ width: '200px' }}
            visible={this.state.visible}
            onOk={() => this.submit()}
            onCancel={() => this.close()}
        >
            <Input placeholder="快递单号" value={this.state.express_id} style={{ width: '80%', margin: '30px 10%' }} onChange={(e) => this.handleChangeExpress(e.target.value)} />
            <Select placeholder='选择快递' value={this.state.delivery} style={{ width: '80%', margin: '30px 10%' }} onChange={(e) => this.handleChangeDelivery(e)}>
                <Option value={"申通"}>申通</Option>
                <Option value={"顺丰"}>顺丰</Option>
                <Option value={"圆通"}>圆通</Option>
                <Option value={"韵达"}>韵达</Option>
                <Option value={"EMS"}>EMS</Option>
            </Select>
        </Modal>)
    }

}

// 取消订单
export function CancelOrder(order_id, confirmCancel) {
    confirm({
        title: '取消订单',
        content: '是否确认取消订单',
        okText: '确定',
        cancelText: '关闭',
        onOk() {
            confirmCancel({ order_id: order_id })
        }
    });
}