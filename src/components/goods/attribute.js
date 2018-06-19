import { Form, Icon, Col, Row, Input, Select, InputNumber } from 'antd';
import { fieldLabels } from './fieldLabels';
import { validateNumber, validateMoeny } from '../../utils/validate.js';
const Option = Select.Option;
export const Attribute = (props) => {
    const { getFieldDecorator, name, category, product_id, describe, product_status, weight, show_price, price, base_sales, cloud_stock, warn_stock, is_show_stock, origin } = props;
    return (<Form layout="vertical" hideRequiredMark>
        <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.name}>
                    {getFieldDecorator('name', {
                        initialValue: name,
                        rules: [{ required: true, message: '商品名称不能为空' }],
                    })(
                        <Input placeholder="请输入商品名称" />
                        )}
                </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.category}>
                    {getFieldDecorator('category', {
                        initialValue: category.toString(),
                        rules: [{ required: true, message: '请选择商品类型' }],
                    })(
                        <Select placeholder="选择商品类型">
                            <Option value="1">加乐活</Option>
                        </Select>
                        )}
                </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.product_id}>
                    {getFieldDecorator('product_id', {
                        initialValue: product_id,
                        rules: [{ required: true, message: '商品序列号能为空' }],
                    })(
                        <Input placeholder="请输入商品序号" />
                        )}
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.describe}>
                    {getFieldDecorator('describe', {
                        initialValue: describe,
                        rules: [{ required: true, message: '商品描述不能为空' }],
                    })(
                        <Input placeholder="请输商品描述" />
                        )}
                </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.product_status}>
                    {getFieldDecorator('product_status', {
                        initialValue: product_status.toString(),
                        rules: [{ required: true, message: '请选择商品状态' }],
                    })(
                        <Select placeholder="选择商品类型">
                            <Option value="1">销售中</Option>
                            <Option value="2">下架</Option>
                        </Select>
                        )}
                </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.weight + "（单位：克）"}>
                    {getFieldDecorator('weight', {
                        initialValue: weight,
                        rules: [{
                            validator: validateNumber('重量')
                        }],
                    })(
                        <InputNumber placeholder="请输入商品重量"
                            min={0} 
                            precision={0}
                        />
                        )}
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.show_price + "（单位：元）"}>
                    {getFieldDecorator('show_price', {
                        initialValue: show_price / 100,
                        rules: [{
                            validator: validateNumber('市场价格')
                        }],
                    })(
                        <InputNumber placeholder="请输入市场价格" min={0} precision={2}
                        />
                        )}
                </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.price + "（单位：元）"}>
                    {getFieldDecorator('price', {
                        initialValue: price / 100,
                        rules: [{
                            validator: validateNumber('销售价格')
                        }],
                    })(
                        <InputNumber placeholder="请输入销售价格" min={0} precision={2}
                        />
                        )}
                </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.base_sales + "（单位：件）"}>
                    {getFieldDecorator('base_sales', {
                        initialValue: base_sales,
                        rules: [{
                            validator: validateNumber('虚拟销量')
                        }],
                    })(
                        <InputNumber placeholder="请输入虚拟销量" min={0} precision={0} />
                        )}
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.cloud_stock + "（单位：件）"}>
                    {getFieldDecorator('cloud_stock', {
                        initialValue: cloud_stock,
                        rules: [{
                            validator: validateNumber('库存')
                        }],
                    })(
                        <InputNumber placeholder="输入库存" min={0} precision={0} />
                        )}
                </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.warn_stock + "（单位：件）"}>
                    {getFieldDecorator('warn_stock', {
                        initialValue: warn_stock,
                        rules: [{
                            validator: validateNumber('预警库存')
                        }],
                    })(
                        <InputNumber placeholder="输入预警库存" min={0} precision={0} />
                        )}
                </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.is_show_stock}>
                    {getFieldDecorator('is_show_stock', {
                        initialValue: is_show_stock ? '1' : "0",
                        rules: [{ required: true, message: '请选择是否显示库存' }],
                    })(
                        <Select placeholder="请选择是否显示库存">
                            <Option value="0">否</Option>
                            <Option value="1">是</Option>
                        </Select>
                        )}
                </Form.Item>

            </Col>
        </Row>
        <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.origin}>
                    {getFieldDecorator('origin', {
                        initialValue: origin,
                        rules: [{ required: true, message: '商品产地不能为空' }],
                    })(
                        <Input placeholder="请输入商品产地" />
                        )}
                </Form.Item>
            </Col>
        </Row>
    </Form>)
}
