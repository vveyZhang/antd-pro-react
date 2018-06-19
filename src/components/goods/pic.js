import React, { PureComponent } from 'react'
import { Form, Icon, Col, Row, Upload, Modal } from 'antd';
import { fieldLabels } from './fieldLabels';
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'
function filterImage(image) {
    if (!image || image.length <= 0) return []
    if (typeof image == "string") return [{
        uid: 1,
        name: 'xxx.png',
        status: 'done',
        url: image,
    }]
    const newImages = []
    for (let i = 0; i < image.length; i++) {
        newImages.push({
            uid: i,
            name: i + 'xxx.png',
            status: 'done',
            url: image[i],
        })
    }
    return newImages
}
function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg' || 'image/png';
    if (!isJPG) {
        message.error('仅支持 jpg和png格式图片 ');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片大小不能超过 1M');
    }
    return isJPG && isLt2M;
}
const uploadV = (name) => (rules, value, callback) => {
    if (value.fileList) {
        if (value.fileList.length <= 0) callback(`${name}不能为空`)
        for (let file of value.fileList) {
            if (file.response && !file.response.url) {
                const index = value.fileList.idnexOf(file)
                return callback(`${name}中第${index}上传失败！`)
            }
        }

    }
    callback()
}
export class Pic extends PureComponent {
    state = {
        thumb_url: {
            url: '',
            loading: false

        }, detail_img: {
            url: [],
            loading: false
        }
        , imgs: {
            url: [],
            loading: false
        },
        previewImage: '',
        previewVisible: false
    }
    componentWillMount() {
        const { thumb_url, detail_img, imgs } = this.props;
        this.setState({
            thumb_url: {
                url: thumb_url,
                loading: false

            }, detail_img: {
                url: detail_img,
                loading: false
            }
            , imgs: {
                url: imgs,
                loading: false
            },
            previewImage: '',
            previewVisible: false
        })
    }
    handlePreview(file) {
        this.setState({
            previewImage: file.url ? file.url : file.response.url,
            previewVisible: true
        })
    }
    handleCancel() {
        this.setState({
            previewVisible: false
        })
    }
    onChange(info, name) {
        const { picSuccess, picFail, picRemove } = this.props;
        if (info.file.status === 'uploading') {
            this.setState({
                ...this.state, [name]: {
                    ...this.state[name],
                    loading: true
                }
            });
        }
        if (info.file.status === 'done') {
            if (typeof this.state[name].url == 'string') {
                this.setState({
                    ...this.state, [name]: {
                        url: info.file.response.url,
                        loading: false
                    }
                });
            } else {
                const url = this.state[name].url;
                url.push(info.file.response.url)
                this.setState({
                    ...this.state, [name]: {
                        url: url,
                        loading: false
                    }
                });

            }
        }
        if (info.file.status === "removed") {
            if (typeof this.state[name].url == 'string') {
                this.setState({
                    ...this.state, [name]: {
                        url: '',
                        loading: false
                    }
                });
            } else {
                const newImgs = []
                for (let item of info.fileList) {
                    const url = item.url ? item.url : item.response.url
                    newImgs.push(url)
                }
                this.setState({
                    ...this.state, [name]: {
                        url: newImgs,
                        loading: false
                    }
                });
            }


        }

    }
    receiveHtml = (content) => {
        // if (content != this.content) {
        //     this.content = content;
        //     this.validate('content', content)
        //     this.setState({ responseList: [], isChange: true });
        // }
    }
    uploadFn = (param) => {
        console.log(param)
        const serverURL = 'http://debug.berkgen.com:8000/upload'
        const xhr = new XMLHttpRequest
        const fd = new FormData()
        const successFn = (response) => {
            // 假设服务端直接返回文件上传后的地址
            // 上传成功后调用param.success并传入上传后的文件地址
            const url = JSON.parse(xhr.response).url
            param.success({
                url: url
            })
        }
        const progressFn = (event) => {
            // 上传进度发生变化时调用param.progress
            param.progress(event.loaded / event.total * 100)
        }
        const errorFn = (response) => {
            // 上传发生错误时调用param.error
            param.error({
                msg: '上传失败'
            })
        }

        xhr.upload.addEventListener("progress", progressFn, false)
        xhr.addEventListener("load", successFn, false)
        xhr.addEventListener("error", errorFn, false)
        xhr.addEventListener("abort", errorFn, false)
        fd.append('file', param.file)
        xhr.open('POST', serverURL, true)
        xhr.send(fd)
    }
    render() {
        const { getFieldDecorator } = this.props;
        const { thumb_url, detail_img, imgs, previewVisible, previewImage } = this.state;
        const editorProps = {
            height: 700,
            contentFormat: 'html',
            initialContent: '',
            contentId: 1,
            onChange: this.receiveHtml,
            media: {
                allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
                image: true,
                video: true,
                audio: false,
                validateFn: null, // 指定本地校验函数，说明见下文
                uploadFn: this.uploadFn, // 指定上传函数，说明见下文
                removeConfirmFn: null,
                onRemove: null, // 指定媒体库文件被删除时的回调，参数为被删除的媒体文件列表(数组)
                onChange: null, // 指定媒体库文件列表发生变化时的回调，参数为媒体库文件列表(数组)
                onInsert: null, // 指定从媒体库插入文件到编辑器时的回调，参数为被插入的媒体文件列表(数组)
            }
        }
        return (<Form layout="vertical" hideRequiredMark>
            <Modal visible={previewVisible} footer={null} onCancel={() => this.handleCancel()}>
                <img style={{ width: '100%' }} src={previewImage} />
            </Modal>
            {/* <BraftEditor {...editorProps} /> */}
            <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                    <Form.Item className="upload-row" label={fieldLabels.thumb_url}>
                        {getFieldDecorator('thumb_url', {
                            initialValue: filterImage(thumb_url.url),
                            rules: [{ required: true, message: '主图不能空' }, {
                                validator: uploadV('商品主图')
                            }],
                        })(
                            <Upload
                                name="file"
                                listType="picture-card"
                                action="/upload"
                                beforeUpload={beforeUpload}
                                defaultFileList={filterImage(thumb_url.url)}
                                onChange={(info) => this.onChange(info, 'thumb_url')}
                                className='pic-main'
                                onPreview={(file) => this.handlePreview(file)}

                            >
                                {thumb_url.url || thumb_url.loading ? null : <div>
                                    <Icon type={thumb_url.loading ? 'loading' : 'plus'} />
                                    <div className="ant-upload-text">{thumb_url.loading ? "上传中" : '上传主图'}</div>
                                </div>}
                            </Upload>
                        )}
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                    <Form.Item className="upload-row" label={fieldLabels.imgs}>
                        {getFieldDecorator('imgs', {
                            initialValue: filterImage(imgs.url),
                            rules: [{ required: true, message: '商品图不能为空' }, {
                                validator: uploadV('商品图')
                            }],
                        })(
                            <Upload
                                name="file"
                                listType="picture-card"
                                action="/upload"
                                beforeUpload={beforeUpload}
                                defaultFileList={filterImage(imgs.url)}
                                onChange={(info) => this.onChange(info, 'imgs')}
                                onPreview={(file) => this.handlePreview(file)}
                            >
                                {imgs.url.length < 4 ? <div>
                                    <Icon type={imgs.loading ? 'loading' : 'plus'} />
                                    <div className="ant-upload-text">{imgs.loading ? "上传中" : '上传商品图'}</div>
                                </div> : null}
                            </Upload>
                        )}
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                    <Form.Item className="upload-row" label={fieldLabels.detail_img}>
                        {getFieldDecorator('detail_img', {
                            initialValue: filterImage(detail_img.url),
                            rules: [{ required: true, message: '商品详情图不能为空' }, {
                                validator: uploadV('商品详情图')
                            }],
                        })(
                            <Upload
                                name="file"
                                listType="picture-card"
                                action="/upload"
                                beforeUpload={beforeUpload}
                                defaultFileList={filterImage(detail_img.url)}
                                className='pic-main-details'
                                onPreview={(file) => this.handlePreview(file)}
                                onChange={(info) => this.onChange(info, 'detail_img')}
                            >
                                <div>
                                    <Icon type={detail_img.loading ? 'loading' : 'plus'} />
                                    <div className="ant-upload-text">{detail_img.loading ? "上传中" : '上传详情图'}</div>
                                </div>
                            </Upload>
                        )}
                    </Form.Item>
                </Col>
            </Row>
        </Form>)
    }
}