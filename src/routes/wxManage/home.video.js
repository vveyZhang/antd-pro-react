
import React, { PureComponent } from 'react'

import { Card, list, Button, Tooltip, List, Icon, Modal } from 'antd'

import Ellipsis from '../../components/Ellipsis';

import styles from './index.less'

import { connect } from 'dva';

import { VideoModal } from './home.modal'

const confirm = Modal.confirm;

@connect(({ wxManage, loading, goods }) => ({
    videos: wxManage.videos,
    isShow: wxManage.videoModalShow,
    loading: loading.effects['wxManage/queryVideo'],
    uploading: loading.effects['wxManage/createVideo'],
}))
export default class WXHomeVideo extends PureComponent {
    componentWillMount() {
        const { dispatch } = this.props;
        dispatch({ type: 'wxManage/queryVideo' })
    }
    hideModal = () => {
        this.showModal(false)
    }
    showModal = (show) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'wxManage/saveData', data: {
                videoModalShow: show
            }
        })
    }
    toCreate = () => {
        this.showModal(true)
    }

    submit = (params) => {
        const { dispatch } = this.props;

        dispatch({ type: 'wxManage/createVideo', params })
    }
    toEditor = (item) => {
        const { dispatch } = this.props;
        confirm({
            title: '修改视频状态？',
            content: `是否确认${item.enabled ? "关闭" : "启用"}。`,
            okText: '确定',
            cancelText: '返回',
            onOk() {
                dispatch({
                    type: 'wxManage/updateVideo', params: {
                        id: item.id
                    }
                })
            }
        });
    }
    delete = (id) => {
        const { dispatch } = this.props;
        confirm({
            title: '删除视频？',
            content: '确认删除该视频,删除后将不能恢复。',
            okText: '删除',
            okType: 'danger',
            cancelText: '关闭',
            onOk() {
                dispatch({
                    type: 'wxManage/deleteVideo', params: {
                        id: id
                    }
                })
            }
        });

    }
    render() {
        const { videos, loading, isShow, uploading } = this.props;
        return (
            <div>
                <Button icon="plus" type="primary" onClick={() => this.toCreate()}>
                    上传视频
              </Button>
                {isShow ? <VideoModal hideModal={this.hideModal}
                    isShow={isShow}
                    uploading={uploading}
                    submit={this.submit}
                /> : null}

                <div style={{ marginBottom: '30px' }} ></div>
                <List
                    rowKey="id"
                    loading={loading}
                    grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
                    dataSource={videos}
                    renderItem={item => (
                        <List.Item>
                            <Card
                                className={styles.card}
                                hoverable
                                bodyStyle={{ padding: "10px 10px" }}
                                cover={<video width="378" preload='none' controls="controls" loop="loop" poster={item.poster} >
                                    <source src={item.url} type="video/mp4" />浏览器不支持 video标签 </video>}
                                actions={[
                                    <a onClick={() => this.toEditor(item)} >{item.enabled ? "关闭视频" : "启用该视频"}</a>,
                                    <a onClick={() => this.delete(item.id)}>删除</a>
                                ]}
                            >
                                <div className={styles.videoContent}>{item.describe}</div>
                                <p className={styles.videoInfo}>状态：{item.enabled ? "已启用" : "未启用"}</p>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}
WXHomeVideo.defaultProps = {
    loading: true
}