import { Card, list, Button, Tooltip, List, Icon, Modal, Form, Input, Select, InputNumber, Upload, message, AutoComplete } from 'antd'

import React, { Component } from 'react'

import styles from './index.less'

import { uploadBase } from '../../services/upload'

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg' || 'image/png';
    if (!isJPG) {
        message.error('仅支持 jpg和png格式图片 ');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
        message.error('上传图片大小不能超过1M');
    }
    return isJPG && isLt2M;
}
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
    },
};

const submitFormLayout = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
    },
};
const props = {
    name: 'file',
    action: '/upload',
    beforeUpload: beforeUpload,
    listType: "picture-card"
};
function beforeUploadVideo(file) {
    const isLt2M = file.size / 1024 / 1024 <= 25;
    if (!isLt2M) {
        message.error('上传图片大小不能超过25M');
    }
    return isLt2M;
}

const propsVideo = {
    name: 'file',
    action: '/upload-video',
    beforeUpload: beforeUploadVideo,
    listType: "picture-card"
}

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

@Form.create()
export class BannerModal extends Component {
    normFile = (e) => {
        this.setState({
            fileList: e.fileList
        })
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: []
    };
    componentWillMount() {
        if (this.props.item.image) {
            this.setState({
                fileList: [{
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: this.props.item.image,
                }]
            })
        } else {
            this.setState({
                fileList: []
            })
        }
    }
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    handleCancel = () => {
        this.setState({
            previewVisible: false,
        });

    }
    hideModal = () => {
        this.props.hideModal();
    }
    render() {
        const { goods, create, submit, isShow, item } = this.props;
        const { product_id, describe, weight } = item;
        const { previewVisible, previewImage, fileList } = this.state;
        const hideModal = this.hideModal;
        const { getFieldDecorator, getFieldValue, validateFieldsAndScroll } = this.props.form;
        const onSubmit = () => {
            validateFieldsAndScroll((error, values) => {
                if (!error) {
                    const params = { ...values, image: values.image[0].url || values.image[0].response.url }
                    submit(params)
                }
            })
        }
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        return (
            <Modal className={styles.modal} onCancel={hideModal} footer={false} visible={isShow} width="50%" title={create ? '添加banner' : "编辑banner"}  >
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img style={{ width: '100%' }} src={previewImage} />
                </Modal>
                <Form
                    hideRequiredMark
                    style={{ marginTop: 8 }}
                    onSubmit={onSubmit}
                >
                    <FormItem
                        {...formItemLayout}
                        label="banner图"
                    >
                        {getFieldDecorator('image', {
                            valuePropName: 'fileList',
                            initialValue: fileList,
                            getValueFromEvent: this.normFile,
                            rules: [{
                                required: true, message: '请选择banner图',
                            }],
                        })(
                            <Upload
                                {...props}

                                onPreview={(e) => this.handlePreview(e)}
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="banner描述"
                    >
                        {getFieldDecorator('describe', {
                            initialValue: describe,
                            rules: [{
                                required: true, message: '请输入banner描述',
                            }],
                        })(
                            <TextArea style={{ minHeight: 32 }} placeholder="描述......" rows={4} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={<span>权重 （选填）</span>}
                    >
                        {getFieldDecorator('weight', {
                            initialValue: weight
                        })(
                            <InputNumber placeholder="权重" min={0} max={100} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="对应产品"
                    >
                        {getFieldDecorator('product_id', {
                            initialValue: product_id,
                            rules: [{ required: true, message: '未选中对应产品' }],
                        })(
                            <Select
                                placeholder="请选择对应产品"
                                optionFilterProp="children"
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                                {goods.map((item, index) => <Option key={index} title={item.describe} value={item.product_id}>{item.name}</Option>)}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                        <Button type="primary" htmlType="submit" >{create ? '确认添加' : "确认修改"}</Button>
                        <Button onClick={() => hideModal()} style={{ marginLeft: 8 }}>关闭</Button>
                    </FormItem>
                </Form>
            </Modal>)
    }
}

@Form.create()
export class ArticleModal extends Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.item != this.props.item) {
            this.props.form.resetFields();
        }
    }
    render() {
        const { submit, isShow, item, hideModal } = this.props;
        const { ID, Show, Weight } = item;
        const { getFieldDecorator, getFieldValue, validateFieldsAndScroll } = this.props.form;
        const onSubmit = () => {
            validateFieldsAndScroll((error, values) => {
                if (!error) {
                    const params = { ...values, media_id: ID }
                    submit(params)
                }
            })
        }
        return (
            <Modal className={styles.modal} onCancel={hideModal} footer={false} visible={isShow} width="50%" title="编辑图文"  >
                <Form
                    hideRequiredMark
                    style={{ marginTop: 8 }}
                    onSubmit={onSubmit}
                >
                    <FormItem
                        {...formItemLayout}
                        label={<span>权重</span>}
                    >
                        {getFieldDecorator('weight', {
                            initialValue: Weight,
                            rules: [{ required: true, message: '权限不能为空' }]
                        })(
                            <InputNumber placeholder="权重" min={0} max={100} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="是否在小程序中显示"
                    >
                        {getFieldDecorator('show', {
                            initialValue: Show ? '1' : "0",
                            rules: [{ required: true, message: '请选择是否在小程序中显示' }],
                        })(
                            <Select placeholder="是否在小程序中显示" >
                                <Option value={'1'}>是</Option>
                                <Option value={'0'}>否</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                        <Button type="primary" htmlType="submit" >确认修改</Button>
                        <Button onClick={() => hideModal()} style={{ marginLeft: 8 }}>关闭</Button>
                    </FormItem>
                </Form>
            </Modal>)
    }
}
@Form.create()
export class VideoModal extends Component {
    state = {
        previewVisible: false,
        fileList: [],
        describe: '',
        loading: false,
        image: "",
        url: '',
        captureError: ''
    };
    handleCancel = () => {
        this.setState({
            previewVisible: false,
        });
    }
    hideModal = () => {
        this.props.hideModal();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isShow != this.props.isShow) {
            this.setState({
                previewVisible: false,
                fileList: [],
                url: '',
                describe: '',
                loading: false
            })
        }
    }

    normFile = (e) => {
        const file = e.file;
        if (e.event) {
            this.setState({
                loading: true,
            })
        } else {
            this.setState({
                loading: false,
            })
        }
        if (file.status == "done") {
            if (file.response && file.response.url) {
                this.setState({
                    fileList: [file],
                    url: file.response.url
                })
                this.setVideo(file.response.url)
            } else {
                this.setState({
                    fileList: []
                })
                message.error('上传失败')
            }

        }

        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    setVideo = (src) => {
        this.video = document.createElement('video');
        this.canvas = document.createElement("canvas");
        this.video.crossOrigin = 'Anonymous';
        this.video.src = src;
        this.video.preload = "auto";
        let width = 0, height = 0;
        this.video.addEventListener('loadedmetadata', () => {
            width = this.video.videoWidth;
            height = this.video.videoHeight;
            this.canvas.setAttribute('height', height)
            this.canvas.setAttribute('width', width);
            this.ctx = this.canvas.getContext('2d');
        })
        this.video.addEventListener('timeupdate', () => {
            this.ctx.drawImage(this.video, 0, 0, width, height);
            const dataUrl = this.canvas.toDataURL('image/jpeg');
            this.setState({
                image: dataUrl,
                captureError: ''
            })
        })
    }
    captureImage = () => {
        if (!this.video) return this.setState({
            captureError: '请先上传图片'
        })
        this.video.currentTime = this.refs.video.currentTime;

    };
    render() {
        const { submit, isShow, uploading } = this.props;
        const { previewVisible, fileList, describe, url, loading, image, captureError } = this.state;

        const hideModal = this.hideModal;
        const { getFieldDecorator, validateFieldsAndScroll } = this.props.form;
        const onSubmit = () => {
            validateFieldsAndScroll((error, values) => {
                if (!error) {
                    if (!this.state.image) this.setState({
                        captureError: '请截取视频封面'
                    })
                    const params = { ...values, url: values.url[0].response.url, poster: this.state.image }

                    submit(params)
                }
            })
        }
        const uploadButton = (
            <div>
                {loading ? <Icon type="loading" /> : <Icon type="plus" />}
                <div className="ant-upload-text">{loading ? "上传中" : "上传"}</div>
            </div>
        );
        return (
            <Modal className={styles.modal} onCancel={hideModal} footer={false} visible={isShow} width="50%" title="添加视频"  >
                <div id="test" ></div>
                <Form
                    hideRequiredMark
                    style={{ marginTop: 8 }}
                    onSubmit={onSubmit}
                >
                    <FormItem
                        {...formItemLayout}
                        label="视频"
                    >
                        {getFieldDecorator('url', {
                            valuePropName: 'fileList',
                            value: fileList,
                            getValueFromEvent: this.normFile,
                            rules: [{
                                required: true, message: '请上传视频',
                            }],
                        })(
                            <Upload
                                {...propsVideo}
                                showUploadList={false}
                            >
                                {url ? <video ref="video" preload="none" width="378" controls="controls" loop="loop" >
                                    <source src={url} type="video/mp4" />浏览器不支持 video标签
                    </video> : uploadButton}
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="设置视频封面"
                        validateStatus={captureError ? 'error' : ''}
                        help={captureError}
                        extra="播放视频，点击按钮设置封面"
                    >
                        <Button type="primary" onClick={() => this.captureImage()} > 截屏</Button>
                        <img src={image} alt="" width='378' />
                    </FormItem>


                    <FormItem
                        {...formItemLayout}
                        label="视频描述"
                    >
                        {getFieldDecorator('describe', {
                            value: describe,
                            onChange: (e) => this.setState({ describe: e.target.value }),
                            rules: [{
                                required: true, message: '视频描述不能为空',
                            }],
                        })(
                            <Input placeholder="描述" />
                        )}
                    </FormItem>
                    <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                        <Button type="primary" htmlType="submit" loading={uploading} > 确认添加</Button>
                        <Button onClick={() => hideModal()} style={{ marginLeft: 8 }}>关闭</Button>
                    </FormItem>
                </Form>
            </Modal>)
    }
}