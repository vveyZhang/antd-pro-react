import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import styles from './Register.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
    ok: <div className={styles.success}>强度：强</div>,
    pass: <div className={styles.warning}>强度：中</div>,
    poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
    ok: 'success',
    pass: 'normal',
    poor: 'exception',
};

@connect(({ loading }) => ({
    submitting: loading.effects['login/submit'],
}))
@Form.create()
export default class ChangePassword extends Component {
    state = {
        count: 0,
        confirmDirty: false,
        visible: false,
        help: '',
        prefix: '86',
    };
    handleChange = (evnet) => {
        event.preventDefault()
    }
    getPasswordStatus = () => {
        const { form } = this.props;
        const value = form.getFieldValue('new_password');
        if (value && value.length > 9) {
            return 'ok';
        }
        if (value && value.length > 5) {
            return 'pass';
        }
        return 'poor';
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'login/changePassword',
                    params: {
                        ...values
                    },
                });
            }
        });
    };

    handleConfirmBlur = (e) => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    checkConfirm = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('new_password')) {
            callback('两次输入的密码不匹配!');
        } else {
            callback();
        }
    };

    checkPassword = (rule, value, callback) => {
        var reg1 = new RegExp(/^[0-9A-Za-z]+$/);
        var reg2 = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
        if (!value) {
            this.setState({
                help: '请输入密码！',
                visible: !!value,
            });
            callback('error');
        } else {
            this.setState({
                help: '',
            });
            if (!this.state.visible) {
                this.setState({
                    visible: !!value,
                });
            }
            if (value.length < 8) {
                callback('error');
            }
            if (!reg1.test(value)) {
                this.setState({
                    help: '密码不能包含特殊字符',
                });
                callback('error');
            }
            if (!reg2.test(value)) {
                this.setState({
                    help: '密码必须包含字符和数字',
                });
                callback('error');
            }
            else {
                const { form } = this.props;
                if (value && this.state.confirmDirty) {
                    form.validateFields(['confirm'], { force: true });
                }
                callback();
            }
        }
    };

    renderPasswordProgress = () => {
        const { form } = this.props;
        const value = form.getFieldValue('new_password');
        const passwordStatus = this.getPasswordStatus();
        return value && value.length ? (
            <div className={styles[`progress-${passwordStatus}`]}>
                <Progress
                    status={passwordProgressMap[passwordStatus]}
                    className={styles.progress}
                    strokeWidth={6}
                    percent={value.length * 10 > 100 ? 100 : value.length * 10}
                    showInfo={false}
                />
            </div>
        ) : null;
    };

    render() {
        const { form, submitting } = this.props;
        const { getFieldDecorator } = form;
        const { count, prefix } = this.state;
        return (
            <div className={styles.main}>
                <h3>修改密码</h3>
                <Form onSubmit={this.handleSubmit} autoComplete="off"  >
                    <FormItem >
                        {getFieldDecorator('old_password', {
                            onChange: this.handleChange,
                            rules: [
                                {
                                    required: true,
                                    message: '旧密码不同为空！',
                                }
                            ],
                        })(<Input autoComplete="off" size="large" type="text"
                            onFocus={(e) => { e.target.type = 'password' }} placeholder="旧密码" />)}
                    </FormItem>
                    <FormItem help={this.state.help}>
                        <Popover
                            content={
                                <div style={{ padding: '4px 0' }}>
                                    {passwordStatusMap[this.getPasswordStatus()]}
                                    {this.renderPasswordProgress()}
                                    <div style={{ marginTop: 10 }}>
                                        请至少输入 8 个字符，密码中不能带有特殊字符，并且必须包含数字和密码，。
                  </div>
                                </div>
                            }
                            overlayStyle={{ width: 240 }}
                            placement="right"
                            visible={this.state.visible}
                        >
                            {getFieldDecorator('new_password', {
                                onChange: this.handleChange,
                                rules: [
                                    {
                                        validator: this.checkPassword,
                                    },
                                ],
                            })(
                                <Input
                                    size="large"
                                    type="text"
                                    onFocus={(e) => { e.target.type = 'password' }}
                                    placeholder="至少8位密码，"
                                    autoComplete="off"

                                />
                            )}
                        </Popover>
                    </FormItem>
                    <FormItem  >
                        {getFieldDecorator('confirm', {
                            onChange: this.handleChange,
                            rules: [
                                {
                                    required: true,
                                    message: '请确认密码！',
                                },
                                {
                                    validator: this.checkConfirm,
                                },
                            ],
                        })(<Input
                            size="large" type="text"
                            onFocus={(e) => { e.target.type = 'password' }}
                            autoComplete="off"
                            placeholder="确认密码" />)}
                    </FormItem>
                    <FormItem>
                        <Button
                            size="large"
                            loading={submitting}
                            className={styles.submit}
                            type="primary"
                            htmlType="submit"
                        >
                            确认修改
            </Button>
                        <Link className={styles.login} to="/">
                            返回首页
            </Link>
                    </FormItem>
                </Form>
            </div>
        );
    }
}
