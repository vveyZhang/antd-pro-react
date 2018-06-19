import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import { Card, List, Radio, Input, Popover, Avatar, Button, Modal } from 'antd'

import { connect } from 'dva'

import styles from './user.less'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;
const confirm = Modal.confirm;
const currentUser = [{
    avatar: "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
    name: "admin",
    notifyCount: 12,
    userid: "00000001",
    phone: '028-1212212'
}, {
    avatar: "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
    name: "admin",
    notifyCount: 12,
    userid: "00000001",
    phone: '028-1212212'
}]
@connect(({ user, loading }) => ({
    ...user,
    loading: loading.models.user
}))
export default class User extends PureComponent {
    componentWillMount() {
        const { params } = this.props;
        this.query(params)
    }
    query(params) {
        const { dispatch } = this.props;
        dispatch({ type: 'user/query', params })
    }
    changeStatus(status) {
        const { params } = this.props;
        const { limit } = params;
        const newParams = { page: 1, limit, status: status }
        this.query(newParams)
    }
    submitMark = (open_id, mark) => {

        const { dispatch } = this.props;
        dispatch({
            type: 'user/mark', params: {
                open_id: open_id,
                mark: mark
            }
        })
    }
    handleSign(open_id, IsReview) {
        const { dispatch } = this.props
        confirm({
            title: '提示',
            content: `${IsReview ? '取消' : "确认"}标记为员工`,
            okText: "确定",
            cancelText: "关闭",
            onOk() {
                dispatch({
                    type: 'user/review', params: { open_id: open_id }
                })
            },
        });
    }
    userContent(item) {
        return <div className={styles.userWarp} >
            <img src={item.UserInfo.avatarUrl} />
            <div className={styles.userContent} >
                <p>用户名：{item.UserInfo.nickName}</p>
                <p>手机号：{item.Phone.phoneNumber}</p>
                <p>备注名：{item.Mark}</p>
            </div>
        </div>
    }
    changePage(page) {
        const { params } = this.props;
        const { limit, status } = params;
        const newParams = { page, limit, status }
        this.query(newParams)
    }
    render() {
        const { params, count, members, loading } = this.props;
        const { page, limit } = params;
        const paginationProps = {
            showQuickJumper: true,
            pageSize: limit,
            current: page,
            total: count,
            onChange: (page) => this.changePage(page)
        };
        const extraContent = (
            <div className={styles.extraContent}>
                <RadioGroup value={this.props.params.status} onChange={(e) => this.changeStatus(e.target.value)} >
                    <RadioButton value="all">全部</RadioButton>
                    <RadioButton value="members">会员</RadioButton>
                    <RadioButton value="inside">员工</RadioButton>
                </RadioGroup>
                {/* <Search
                    className={styles.extraContentSearch}
                    placeholder="请输入姓名"
                    onSearch={() => ({})}
                /> */}
            </div>
        );
        return (<PageHeaderLayout>
            <div className={styles.standardList} >
                <Card
                    style={{ marginTop: 24 }}
                    className={styles.listCard}
                    bodyStyle={{ padding: '0 32px 40px 32px' }}
                    title={extraContent} >
                    <List
                        size="large"
                        rowKey="openid"
                        dataSource={members}
                        style={{ margin: '30px 0px' }}
                        bordered
                        loading={loading}
                        pagination={count > 0 ? paginationProps : false}
                        renderItem={(item, index) => {
                            return (
                                <List.Item
                                    actions={[
                                        <a onClick={() => this.handleSign(item.openid, item.IsReview)} >{item.IsReview ? '取消员工标记' : "标记为员工"}</a>,
                                        <MarkContent mark={item.Mark} submit={(mark) => { this.submitMark(item.openid, mark) }} />]}
                                >
                                    <List.Item.Meta
                                        avatar={<Popover content={this.userContent(item)} placement="rightTop" >
                                            <Avatar src={item.UserInfo.avatarUrl} shape="square" size="large" />
                                        </Popover>}
                                        title={<p >{item.UserInfo.nickName} {item.Mark ? `（${item.Mark}）` : ''}</p>}
                                        description={item.Phone.phoneNumber}
                                    />

                                </List.Item>
                            )
                        }}
                    />
                </Card>

            </div>

        </PageHeaderLayout>)
    }
}

class MarkContent extends PureComponent {
    state = {
        visible: false,
        value: ''
    }
    componentWillMount() {
        this.setState({ value: this.props.mark });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.mark != this.props.mark) this.setState({ value: nextProps.mark });
    }
    submit = () => {
        this.setState({
            visible: false,
        });
        const { value } = this.state;

        this.props.submit(value)
    }
    onChange = (value) => {
        this.setState({ value });
    }
    onVisibleChange = (visible) => {
        this.setState({ visible });
    }
    render() {
        const { visible, value } = this.state;
        const { mark } = this.props;
        const markContent = <div>
            <div className={styles.userMarkInput} ><Input onChange={e => this.onChange(e.target.value)} value={value} placeholder="用户备注" /></div>
            <div className={styles.userMarkButton} ><Button onClick={() => this.submit()} type='primary' >备注</Button></div>
        </div >
        return <Popover trigger="click" visible={visible} onVisibleChange={(visible) => this.onVisibleChange(visible)} placement='bottom' content={markContent}  >
            <a>{mark ? "修改备注名" : "添加备注名"}</a>
        </Popover>
    }
}