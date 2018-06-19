import React, { PureComponent } from 'react';

import { connect } from 'dva';

import GoodsAttribute from '../../components/goods/index';

class GoodsAdd extends PureComponent {
    submit(params) {
        this.props.dispatch({
            type: 'goods/add',
            params: params
        })
    }
    render() {
        const { submitting } = this.props;
        return (
            <GoodsAttribute title="添加商品" buttonName="确认添加" submitting={submitting}  submit={(params) => this.submit(params)} />
        );
    }
}

export default connect(({ global, loading }) => ({
    collapsed: global.collapsed,
    submitting: loading.effects['goods/add'],
}))(GoodsAdd);
