import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { List, Card, Row, Col, Radio, Input, Progress, Button, Icon, Dropdown, Menu, Avatar, Modal } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './list.less';

import { goodsStatus } from '../../utils/filterStatus'

import { filterTime } from '../../utils/format'

import { routerRedux } from 'dva/router'
import index from 'antd/lib/form';

const confirm = Modal.confirm;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ goods, loading }) => {
    return ({
        goods: goods,
        loading: loading.models.goods
    })
})
export default class GoodsList extends PureComponent {
    componentDidMount() {
        this.props.dispatch({
            type: 'goods/query'
        });
    }
    changePage(page) {
        this.props.dispatch({
            type: 'goods/changePage', page: page
        });
        document.body.scrollIntoView(true)
    }
    changeStatus(status) {
        this.props.dispatch({
            type: 'goods/changeStatus', status: status
        });
    }

    offConfirm(id) {
        confirm({
            title: '下架该商品',
            content: '确认下架该商品？',
            okText: '确认下架',
            cancelText: '关闭',
            onOk: () => {
                this.props.dispatch({
                    type: 'goods/delete', params: {
                        product_id: id
                    }
                });
            }
        });
    }
    topConfirm(id) {
        confirm({
            title: '提示',
            content: '确认移动该商品？',
            okText: '确认',
            cancelText: '关闭',
            onOk: () => {
                this.props.dispatch({
                    type: 'goods/top', params: {
                        product_id: id
                    }
                });
            }
        });
    }
    bottomConfirm(id) {
        confirm({
            title: "提示",
            content: '确认移动该商品？',
            okText: '确认',
            cancelText: '关闭',
            onOk: () => {
                this.props.dispatch({
                    type: 'goods/bottom', params: {
                        product_id: id
                    }
                });
            }
        });
    }
    toEditor = (id) => {

        this.props.dispatch(routerRedux.push(`/goods/editor/${id}`))
    }
    handleMenu = (key, id, index) => {
        switch (key) {
            case 'off':
                this.offConfirm(id)
                return;

            case 'bottom':
                this.bottomConfirm(id)
                return;
            case 'editor':
                this.toEditor(index)
                return;

        }
    }
    render() {
        const { count, product, loading, current, status, showProduct } = this.props.goods;
        const { dispatch } = this.props;
        const limit = 8;
        const Info = ({ title, value, bordered }) => (
            <div className={styles.headerInfo}>
                <span>{title}</span>
                <p>{value}</p>
                {bordered && <em />}
            </div>
        );
        const extraContent = (
            <div className={styles.extraContent}>
                <RadioGroup value={status} onChange={(e) => this.changeStatus(e.target.value)} >
                    <RadioButton value="0">全部</RadioButton>
                    <RadioButton value="1">销售中</RadioButton>
                    <RadioButton value="2">下架</RadioButton>
                </RadioGroup>
                <Search
                    className={styles.extraContentSearch}
                    placeholder="请输入"
                    onSearch={() => ({})}
                />
            </div>
        );
        const paginationProps = {
            showQuickJumper: true,
            pageSize: limit,
            current: current,
            total: count,
            onChange: (page) => this.changePage(page)
        };

        const ListContent = ({ create_time, sales, base_sales, show_price, price, product_status, cloud_stock, warn_stock }) => {
            return (
                <div className={styles.listContent}>
                    <div className={styles.listContentItem}>
                        <span>{goodsStatus(product_status)}</span>
                    </div>
                    <div className={styles.listContentItem}>
                        <p>市场价格：<span style={{ color: 'red' }} >{show_price / 100}</span></p>
                        <p>销售价格：<span style={{ color: 'red' }} >{price / 100}</span></p>
                    </div>
                    <div className={styles.listContentItem}>
                        <p>销量：<span style={{ color: 'red' }} >{sales}</span></p>
                        <p>虚拟销售：<span style={{ color: 'red' }} >{base_sales}</span></p>
                    </div>
                    <div className={styles.listContentItem}>
                        <p>库存：<span style={{ color: 'red' }} >{cloud_stock}</span></p>
                        <p>预警库存：<span style={{ color: 'red' }} >{warn_stock}</span></p>
                    </div>
                    <div className={styles.listContentItem}>
                        <span>创建时间</span>
                        <p>{filterTime(create_time)}</p>
                    </div>
                    {/* <div className={styles.listContentItem}>
                        <Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
                    </div> */}
                </div>
            )
        };

        const menu = (id, index, status) => (
            <Menu onClick={({ key }) => this.handleMenu(key, id, index)} >
                <Menu.Item key='editor' >
                    <a>编辑</a>
                </Menu.Item>
                {status == 1 ? <Menu.Item key='off' >
                    <a>下架</a>
                </Menu.Item> : null}

                <Menu.Item key="bottom" >
                    <a>下移</a>
                </Menu.Item>
            </Menu>
        );

        const MoreBtn = (props) => (
            <Dropdown overlay={menu(props.id, props.index, props.status)} >
                <a>
                    更多 <Icon type="down" />
                </a>
            </Dropdown>
        );

        const start = (current - 1) * limit;
        const end = (current) * limit;
        return (
            <PageHeaderLayout>
                <div className={styles.standardList}>
                    <Card
                        className={styles.listCard}
                        bordered={false}
                        style={{ marginTop: 24 }}
                        bodyStyle={{ padding: '0 32px 40px 32px' }}
                        extra={extraContent}
                        title={<Button icon="plus" type="primary" onClick={() => this.props.dispatch(routerRedux.push('/goods/add'))} icon="plus">
                            添加商品
                   </Button>}
                    >


                        <List
                            size="large"
                            rowKey="id"
                            loading={loading}
                            pagination={count > 0 ? paginationProps : false}
                            dataSource={showProduct.slice(start, end)}
                            renderItem={(item, index) => {
                                return (
                                    <List.Item
                                        actions={[<a onClick={() => this.topConfirm(item.product_id)} >上移</a>, <MoreBtn index={index} id={item.product_id} status={item.product_status} />]}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.thumb_url} shape="square" size="large" />}
                                            title={<p >{item.name}</p>}
                                            description={item.describe}
                                        />
                                        <ListContent {...item} />
                                    </List.Item>
                                )
                            }}
                        />
                    </Card>
                </div>
            </PageHeaderLayout>
        );
    }
}
