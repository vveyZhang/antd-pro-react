import React, { PureComponent } from 'react';

import { connect } from 'dva';

import GoodsAttribute from '../../components/goods/index';
class GoodsEditor extends PureComponent {
    componentWillMount() {
        this.props.dispatch({
            type: 'goods/query'
        });
    }
    submit(params) {
        this.props.dispatch({
            type: 'goods/editor',
            params: params
        })
    }
    render() {
        const { match } = this.props;
        const index = parseInt(match.params.id);
        const { submitting, queryloading } = this.props;
        const { product } = this.props.goods;
        const goods = product[index];
        if (!goods) return <div></div>
        return (
            <GoodsAttribute title="修改商品" buttonName="确认修改" submitting={submitting} goods={goods} submit={(params) => this.submit(params)} />
        );
    }
}

export default connect(({ loading, routing, goods }) => ({
    routing,
    goods,
    submitting: loading.effects['goods/editor'],
    queryloading: loading.effects['goods/query']
}))(GoodsEditor);
