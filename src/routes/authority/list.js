import React, { PureComponent } from 'react'

import { Card, Button, Table, Icon } from 'antd'

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './index.less'

import { connect } from 'dva'

import AuthorityForm from './form.js'

import { routerRedux } from 'dva/router'

@connect(({ authority, loading }) => ({
    ...authority,
    loading: loading.effects['authority/query']
}))
export default class AuthorityList extends PureComponent {
    componentWillMount() {
        this.props.dispatch({ type: 'authority/query' })
    }
    columns = [{
        title: '用户名',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '财务',
        dataIndex: 'finance',
        key: 'finance',
        children: [{
            title: '微信账单',
            dataIndex: 'wx',
            key: 'wx',
            render: (text, item) => item.access.indexOf('微信账单') >= 0 ? <Icon type="check" style={{ color: "#21b020" }} /> : <Icon type="minus" style={{ color: '#888' }} />
        }]
    }, {
        title: '商品管理',
        dataIndex: 'goods',
        key: 'goods',
        render: (text, item) => item.access.indexOf('商品管理') >= 0 ? <Icon type="check" style={{ color: "#21b020" }} /> : <Icon type="minus" style={{ color: '#888' }} />
    }, {
        title: '订单',
        dataIndex: 'order',
        key: 'order',
        children: [{
            title: '微信订单',
            dataIndex: 'wxOrder',
            key: 'wxOrder',
            render: (text, item) => item.access.indexOf('微信订单') >= 0 ? <Icon type="check" style={{ color: "#21b020" }} /> : <Icon type="minus" style={{ color: '#888' }} />
        }]
    }, {
        title: '微信小程序',
        dataIndex: 'wxManage',
        key: 'wxManage',
        children: [{
            title: '首页管理',
            dataIndex: 'home',
            key: 'home',
            render: (text, item) => item.access.indexOf('首页管理') >= 0 ? <Icon type="check" style={{ color: "#21b020" }} /> : <Icon type="minus" style={{ color: '#888' }} />
        }, {
            title: '卡包管理',
            dataIndex: 'counpon',
            key: 'counpon',
            render: (text, item) => item.access.indexOf('卡包管理') >= 0 ? <Icon type="check" style={{ color: "#21b020" }} /> : <Icon type="minus" style={{ color: '#888' }} />
        }, {
            title: '用户管理',
            dataIndex: 'user',
            key: 'user',
            render: (text, item) => item.access.indexOf('用户管理') >= 0 ? <Icon type="check" style={{ color: "#21b020" }} /> : <Icon type="minus" style={{ color: '#888' }} />
        }]
    },
    {
        title: '操作',
        dataIndex: 'setting',
        key: 'setting',
        render: (text, item) => <a onClick={() => this.handleEditor(item.name)} >编辑</a>
    }
    ];
    handleEditor = (name) => {
        this.props.dispatch(routerRedux.push(`/authority/editor/${name}`))
    }
    render() {
        const { users, loading } = this.props;
        return (
            <PageHeaderLayout>
                <Card extra={<Button icon="user-add" type="primary" onClick={() => this.props.dispatch(routerRedux.push('/authority/add'))}  > 添加账号 </Button>} bordered={false} >
                    <div className={styles.authorityTable} >
                        <Table rowKey='name'
                            dataSource={filterData(users)}
                            columns={this.columns}
                            bordered loading={loading}
                            pagination={false}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        )
    }
}

export function filterData(users) {
    const data = []
    for (let key in users) {
        data.push({
            name: key,
            access: users[key]
        })
    }
    return data
}