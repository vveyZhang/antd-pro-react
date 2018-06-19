import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import React, { PureComponent } from 'react';

import { connect } from 'dva'

import { Table, Avatar, Menu, Divider, Dropdown, Icon } from 'antd'

import styles from './index.less'

import { filterTimeYMD } from '../../utils/format'

import { lohas } from '../../utils/utils'

import DeatilsModal from '../../components/agent/detailsModal'

const userInfo = (user) => {
    if (typeof user == 'string') user = lohas;
    return (<div className={styles.userContent}  >
        <Avatar size='large' src={user.avatar} />
        <div className={styles.userInfo} >
            {user.name}
            <br />
            {user.phone}
        </div>
    </div>)
}

@connect(({ agent, loading }) => ({
    ...agent,
    loading: loading.effects['agent/queryAgent']
}))
export default class AgentList extends PureComponent {
    componentWillMount() {
        const { dispatch, params } = this.props;
        const { page, limit, agent_status } = params;
        dispatch({
            type: 'agent/queryAgent', params: {
                page, limit, agent_status
            }
        })
    }
    handleTab(key) {
        const { dispatch, params } = this.props;
        const { page, limit } = params;
        dispatch({
            type: 'agent/queryAgent', params: {
                page, limit, agent_status: key
            }
        })
    }
    changePage(page) {
        document.body.scrollIntoView(true)
        const { dispatch, params } = this.props;
        const { limit, agent_status } = params;
        dispatch({
            type: 'agent/queryAgent', params: {
                page: page, limit, agent_status
            }
        })
    }
    columns = [
        {
            title: '代理商信息',
            dataIndex: 'name',
            render: (name, item) => userInfo(item)
        },
        {
            title: '代理等级',
            dataIndex: 'level',
            render: (level) => `代理等级：${level}`
        },
        ,
        {
            title: '邀请时间',
            dataIndex: 'invite_time',
            render: (invite_time) => filterTimeYMD(invite_time)
        },
        {
            title: '邀请人',
            dataIndex: 'inviter',
            render: (inviter) => userInfo(inviter)
        },
        {
            title: '操作',
            dataIndex: 'action',
            render: (text, item) => <span>
                <a onClick={() => setting.orderDetailsSetting(order_id)} >查看详情</a>
                <Divider type="vertical" />
                <Dropdown overlay={this.itemMenu} >
                    <a>更多 <Icon type="down" /></a>
                </Dropdown>
            </span>
        },
    ]
    itemMenu = (
        <Menu onClick={({ key }) => this.setting(key)} >
            <Menu.Item key='details' >
            </Menu.Item>
            <Menu.Item >
                <a key="voucher" >打款凭证</a>
            </Menu.Item>
            <Menu.Item key="agree" >
                <a >通过</a>
            </Menu.Item>
            <Menu.Item key="refuse" >
                <a >拒绝</a>
            </Menu.Item>
            <Menu.Item key="changemaster" >
                <a >变更代理</a>
            </Menu.Item>
            <Menu.Item key="close" >
                <a >关闭代理</a>
            </Menu.Item>
        </Menu >
    );
    render() {
        const { count, params, agents, loading, amount } = this.props;
        const { page, limit, agent_status } = params;
        const tabList = [{
            key: '0',
            tab: <p>全部 <span>{amount['0']}</span></p>,
        }, {
            key: '1',
            tab: <p>待审核 <span>{amount['1']}</span></p>,
        },
        {
            key: '2',
            tab: <p>准代理 <span>{amount['2']}</span></p>,
        },
        {
            key: '3',
            tab: <p>已代理 <span>{amount['3']}</span></p>,
        },
        {
            key: '4',
            tab: <p>已拒绝 <span>{amount['4']}</span></p>,
        },
        {
            key: '5',
            tab: <p>已关闭 <span>{amount['5']}</span></p>,
        }];
        const paginationProps = {
            showQuickJumper: true,
            pageSize: limit,
            current: page,
            total: count,
            onChange: (page) => this.changePage(page)
        };
        return (<PageHeaderLayout
            tabList={tabList}
            tabActiveKey={agent_status}
            onTabChange={(key) => this.handleTab(key)}
        >
            <DeatilsModal />
            <Table
                rowKey="id"
                className={styles.table}
                columns={this.columns}
                loading={loading}
                dataSource={agents}
                pagination={paginationProps}

            />
        </PageHeaderLayout>)
    }
}


