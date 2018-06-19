
import React, { PureComponent } from 'react'

import { Card, list, Button, Tooltip, List, Icon, Modal } from 'antd'

import Ellipsis from '../../components/Ellipsis';

import styles from './index.less'

import { connect } from 'dva';

import { BannerModal } from './home.modal'

const confirm = Modal.confirm;

@connect(({ wxManage, loading, goods }) => ({
    banners: wxManage.banners,
    isShow: wxManage.bannerModalShow,
    goods: goods.product,
    loading: loading.effects['wxManage/queryBanner']
}))
export default class WXHomeBanner extends PureComponent {
    componentWillMount() {
        const { dispatch } = this.props;
        dispatch({ type: 'wxManage/queryBanner' })
        dispatch({ type: 'goods/query' })
    }
    hideModal = () => {
        this.showModal(false)
    }
    showModal = (show) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'wxManage/saveData', data: {
                bannerModalShow: show
            }
        })
    }
    state = {
        isCreate: true,
        item: {},
    }
    toCreate = () => {
        this.setState({
            item: {},
            isCreate: true,
        })
        this.showModal(true)
    }
    toEditor = (item) => {
        this.setState({
            item: item,
            isCreate: false,
        })
        this.showModal(true)
    }
    submit = (params) => {
        const { dispatch } = this.props;
        const { item, isCreate } = this.state;
        if (isCreate) return dispatch({ type: 'wxManage/createBanner', params: { ...params } })
        return dispatch({ type: 'wxManage/updateBanner', params: { ...params, id: item.id } })
    }
    delete = (id) => {
        const { dispatch } = this.props;
        confirm({
            title: '删除banner?',
            content: '确认删除该banner,删除后将不能恢复。',
            okText: '删除',
            okType: 'danger',
            cancelText: '关闭',
            onOk() {
                dispatch({
                    type: 'wxManage/deleteBanner', params: {
                        id: id
                    }
                })
            }
        });

    }
    render() {
        const { banners, loading, goods, isShow } = this.props;
        const { isCreate, item } = this.state;
        return (
            <div>
                <Button icon="plus" type="primary" onClick={() => this.toCreate()}>
                    新建
              </Button>
                {isShow ? <BannerModal hideModal={this.hideModal}
                    create={isCreate} goods={goods}
                    item={item}
                    isShow={isShow}
                    submit={this.submit}
                /> : null}

                <div style={{ marginBottom: '30px' }} ></div>
                <List
                    rowKey="id"
                    loading={loading}
                    grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
                    dataSource={banners}
                    renderItem={item => (
                        <List.Item>
                            <Card
                                className={styles.card}
                                hoverable
                                cover={<img alt={item.describe} src={item.image} />}
                                actions={[
                                    <a onClick={() => this.toEditor(item)} >编辑</a>,
                                    <a onClick={() => this.delete(item.id)}>删除</a>
                                ]}
                            >
                                <Card.Meta
                                    description={<div>
                                        <Ellipsis style={{ color: '#666' }} lines={2}>{item.describe}</Ellipsis>
                                        <p style={{ fontSize: '12px', color: "#000" }} >权重：{item.weight}</p>
                                    </div>}
                                />
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}
WXHomeBanner.defaultProps = {
    loading: true
}