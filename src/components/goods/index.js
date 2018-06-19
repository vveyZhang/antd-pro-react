import React, { PureComponent } from 'react';
import { Card, Button, Icon, Popover, Form } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FooterToolbar from '../../components/FooterToolbar';
import styles from './index.less';
import { Attribute } from './attribute'
import { Pic } from './pic'
import { fieldLabels } from './fieldLabels'
class GoodsAttribute extends PureComponent {
    state = {
        width: '100%'
    };
    componentWillMount() {
        this.props.form.resetFields();
    }
    componentDidMount() {
        window.addEventListener('resize', this.resizeFooterToolbar);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeFooterToolbar);
    }
    resizeFooterToolbar = () => {
        const sider = document.querySelectorAll('.ant-layout-sider')[0];
        const width = `calc(100% - ${sider.style.width})`;
        if (this.state.width !== width) {
            this.setState({ width });
        }
    }
    render() {
        const { form, submitting, title, buttonName, goods, submit } = this.props;
        const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
        const validate = () => {
            validateFieldsAndScroll((error, values) => {
                if (!error) {
                    const imgsArray = []
                    const imgsFile = values.imgs.fileList ? values.imgs.fileList : values.imgs;
                    const detailFile = values.detail_img.fileList ? values.detail_img.fileList : values.detail_img;
                    for (let file of imgsFile) {
                        const url = file.response && file.response.url ? file.response.url : file.url
                        imgsArray.push(url)
                    }
                    const detailArray = []
                    for (let file of detailFile) {
                        const url = file.response && file.response.url ? file.response.url : file.url
                        detailArray.push(url)
                    }
                    const show_price = Math.ceil(parseFloat(values.show_price * 100).toFixed(2));
                    const price = Math.ceil(parseFloat(values.price * 100).toFixed(2))
                    const imgs = JSON.stringify(imgsArray)
                    const detail_img = JSON.stringify(detailArray);
                    const thumb_url = values.thumb_url.file ? values.thumb_url.file.response.url : values.thumb_url[0].url
                    const params = { ...values, show_price, price, imgs, detail_img, thumb_url }
                    
                    submit(params);
                }
            });
        };
        const errors = getFieldsError();
        const getErrorInfo = () => {
            const errorCount = Object.keys(errors).filter(key => errors[key]).length;
            if (!errors || errorCount === 0) {
                return null;
            }
            const scrollToField = (fieldKey) => {
                const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
                if (labelNode) {
                    labelNode.scrollIntoView(true);
                }
            };
            const errorList = Object.keys(errors).map((key) => {
                if (!errors[key]) {
                    return null;
                }
                return (
                    <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
                        <Icon type="cross-circle-o" className={styles.errorIcon} />
                        <div className={styles.errorMessage}>{errors[key][0]}</div>
                        <div className={styles.errorField}>{fieldLabels[key]}</div>
                    </li>
                );
            });
            return (
                <span className={styles.errorIcon}>
                    <Popover
                        title="商品信息错误"
                        content={errorList}
                        overlayClassName={styles.errorPopover}
                        trigger="hover"
                        getPopupContainer={trigger => trigger.parentNode}
                    >
                        <Icon type="exclamation-circle" />
                    </Popover>
                    {errorCount}
                </span>
            );
        };
        return (
            <PageHeaderLayout
                title={title}
                wrapperClassName={styles.advancedForm}
            >
                <Card title="商品属性" className={styles.card} bordered={false}>
                    <Attribute getFieldDecorator={getFieldDecorator} {...goods} />
                </Card>
                <Card title="商品图片" className={styles.card} bordered={false}>
                    <Pic getFieldDecorator={getFieldDecorator} {...goods} />
                </Card>
                <FooterToolbar style={{ width: this.state.width }}>
                    {getErrorInfo()}
                    <Button type="primary" onClick={validate} loading={submitting}
                    >
                        {buttonName}
                    </Button>
                </FooterToolbar>
            </PageHeaderLayout>
        );
    }
}

export default Form.create()(GoodsAttribute);

GoodsAttribute.defaultProps = {
    goods: {
        product_id: '',
        name: '',
        describe: '',
        weight: 0,
        show_price: 0,
        price: 0,
        cloud_stock: 0,
        warn_stock: 0,
        base_sales: 0,
        is_show_stock: '0',
        product_status: '1',
        current: 0,
        category: '1',
        thumb_url: '',
        imgs: [],
        detail_img: []
    }
}