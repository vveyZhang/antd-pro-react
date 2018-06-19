
import React, { PureComponent } from 'react'

import { Card, list, Button, Tooltip, List, Icon, Modal } from 'antd'

import Ellipsis from '../../components/Ellipsis';

import styles from './index.less'

import { connect } from 'dva';

import { ArticleModal } from './home.modal'

const confirm = Modal.confirm;

@connect(({ wxManage, loading }) => ({
    alricles: wxManage.alricles,
    isShow: wxManage.alriclesModalShow,
    loading: loading.effects['wxManage/queryArticle'],
    refeshLoading: loading.effects['wxManage/articleRefresh']
}))
export default class WXHomeArticle extends PureComponent {
    componentWillMount() {
        const { dispatch } = this.props;
        dispatch({ type: 'wxManage/queryArticle' })
    }
    state = {
        articleItem: {
            Show: false,
            weight: 0
        }
    }
    editorArticle = (item) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'wxManage/saveData', data: {
                alriclesModalShow: true
            }
        })
        this.setState({
            articleItem: item
        })
    }
    hideModal = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'wxManage/saveData', data: {
                alriclesModalShow: false
            }
        })
        this.setState({
            articleItem: {
                Show: false,
                weight: 0
            }
        })
    }
    submit = (params) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'wxManage/articleUpdate', params
        })
    }
    refesh() {
        const { dispatch } = this.props;
        dispatch({
            type: 'wxManage/articleRefresh'
        })
    }
    render() {
        const { alricles, loading, isShow, refeshLoading } = this.props;
        const { articleItem } = this.state;
        return (
            <div>
                <Button loading={refeshLoading} type="primary" icon="arrow-down" onClick={() => this.refesh()}>拉取文章</Button>
                <ArticleModal isShow={isShow} item={articleItem} hideModal={this.hideModal} submit={this.submit} />
                <div style={{ marginBottom: '30px' }} ></div>
                <List
                    rowKey="id"
                    loading={loading}
                    grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
                    dataSource={alricles}
                    renderItem={item => (
                        <List.Item>
                            <Card
                                className={styles.card}
                                hoverable
                            >
                                <Card.Meta
                                    title={<a target="blank" href={item.Payload.content.news_item[0].url}>{item.Title}</a>}
                                    description={<Ellipsis style={{ height: '44px' }} lines={2}>{
                                        item.Payload.content.news_item[0].digest
                                    }</Ellipsis>}
                                />
                                <div className={styles.cardItemContent}>
                                    <span>权重：{item.Weight}</span>
                                    <p>是否在小程序显示：{item.Show ? "是" : "否"}</p>
                                    <div className={styles.actionList}    >
                                        <Tooltip onClick={() => this.editorArticle(item)} title="编辑" ><Icon type="edit" /></Tooltip>
                                    </div>
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}
WXHomeArticle.defaultProps = {
    loading: true
}