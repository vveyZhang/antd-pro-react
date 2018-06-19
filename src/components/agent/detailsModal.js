import React, { PureComponent } from 'react'
import { Modal } from 'antd';
export default class DeatilsModal extends PureComponent {
    state = {
        isShow: true
    }
    handleCancel = () => {
        // this.setState({
        //     isShow: false
        // })
    }
    render() {
        const { isShow } = this.state;
        return (<Modal  width='80%'  visible={isShow} onCancel={this.handleCancel} footer={false} title="代理商详情" >
        
        </Modal>)
    }
}