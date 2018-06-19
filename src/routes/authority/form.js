import React, { PureComponent, Component } from 'react';
import { Form, Row, col, Col, Input, Icon, Button, message } from 'antd'
import styles from './index.less'
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 24,
            offset: 0,
        },
    },
};
const authorityData = [
    {
        name: '财务',
        details: '',
        children: [
            {
                name: '微信账单',
                details: '',
            }
        ]
    },
    {
        name: '订单',
        details: '',
        children: [
            {
                name: '微信订单',
                details: '',
            }
        ]
    },
    {
        name: '商品管理',
        details: ''
    },
    {
        name: '微信小程序',
        details: '',
        children: [
            {
                name: '首页管理',
                details: '',
            },
            {
                name: '卡包管理',
                details: ''
            },
            {
                name: '用户管理',
                details: ''
            }
        ]
    }
]
export default class AuthorityForm extends PureComponent {
    componentWillMount() {
        const { user } = this.props;
 
        this.setState({
            name: user.name
        })
    }
    state = {
        name: '',
        error: false
    }
    changeName = (value) => {
        this.setState({
            name: value,
            error: !value
        })
    }

    render() {
        const checked = [];
        const { user, editor } = this.props;
        const { access } = user;
        const handleSubmite = () => {
            let permits = []
            for (let item of checked) {
                const value = item ? item.getValue() : [];
                permits = [...permits, ...value]
            }
            const params = {
                name: this.state.name,
                permits: JSON.stringify(permits)
            }
            if (!params.name) {
                return this.setState({
                    error: true
                })
            }
            this.props.submit(params)
        }
        return (<div className={styles.formContainer} >
            <Row gutter={8} className={styles.authorityContainer} >
                <Col xs={24} sm={4}  >
                    <div className={styles.authorityLabel} >用户名：</div>
                </Col>
                <Col xs={24} sm={20}  >
                    <Input placeholder="设置账号" value={this.state.name} className={this.state.error ? styles.errorInput : ''} onChange={(e) => this.changeName(e.target.value)} />
                    {this.state.error ? <p className={styles.errorTips} >用户名不能为空</p> : null}
                </Col>
            </Row>
            <Row gutter={8} className={styles.authorityContainer} >
                <Col xs={24} sm={4}  >
                    <div className={styles.authorityLabel} >权限配置：</div>
                </Col>
                <Col xs={24} sm={20}  >
                    <div className={styles.authorityContent} >
                        <div className={styles.title} >
                            <div className={styles.lf}>权限</div><div className={styles.rt} >允许访问</div>
                        </div>
                        {
                            authorityData.map((item, index) => <ItemRow access={access} ref={ref => checked.push(ref)} key={index}{...item} />)
                        }

                    </div>
                </Col>
            </Row>
            <div style={{ textAlign: 'center' }}>
                <Button type="primary" onClick={() => handleSubmite()}  >{editor ? '确认修改' : '确认添加'}  </Button>
            </div>
        </div>)
    }
}
AuthorityForm.defaultProps = {
    user: {
        name: '',
        access: []
    },
    editor: false
}

class ItemRow extends Component {
    static defaultProps = {
        name: '',
        details: '',
        children: [],
        selected: [],
    }
    state = {
        name: '',
        details: '',
        children: [],
        selected: [],

    }
    componentWillMount() {
        const { access, children, name } = this.props;
        let selected = [];
        if (children && children.length > 0) {
            for (let item of children) {
                if (access.indexOf(item.name) >= 0) selected.push(item.name)
            }
        } else {
            if (access.indexOf(name) >= 0) selected.push(name)
        }
        this.setState({
            ...this.props,
            selected
        })
    }
    handleAll = () => {
        const { selected, name, children } = this.state;
        if (children.length > 0) {
            if (selected.length > 0) {
                this.setState({
                    selected: []
                })
            } else {
                this.setState({
                    selected: checkedAll(children)
                })
            }
        } else {
            if (selected.length > 0) {
                this.setState({
                    selected: []
                })
            } else {
                this.setState({
                    selected: [name]
                })
            }
        }
    }
    handleClick = (name) => {
        const { selected } = this.state;
        let dataArray = [];
        const index = selected.indexOf(name)
        if (index < 0) {
            selected.push(name);
            dataArray = selected;
        }
        else {
            dataArray = [...selected.splice(0, index), ...selected.splice(index + 1)]
        }
        this.setState({
            selected: [...dataArray]
        })
    }
    getValue = () => {
        const { selected, name, children } = this.state;
        if (selected.length > 0 && children.length > 0 && selected.indexOf(name) < 0) selected.push(name);
        return selected;
    }
    render() {
        const { name, details, children, checked, selected } = this.state;
        return (
            <div className={styles.itemRowContainer} >
                <div className={styles.itemRow} >
                    <div className={styles.content} >
                        <div className={styles.rowLabel}>{name}</div>
                        <div className={styles.rowChecked} onClick={() => this.handleAll()} >{selected.length > 0 ? <Icon type="check" style={{ color: "#21b020" }} /> : null}</div>
                    </div>
                    <div className={styles.details} >
                        {details}
                    </div>
                </div>
                <div className={styles.itemChildren} >
                    {
                        children.map((item, index) => <div key={item.name} className={styles.itemRow}  >
                            <div className={styles.content} >
                                <div className={styles.rowLabel}>{item.name}</div>
                                <div onClick={() => this.handleClick(item.name)} className={styles.rowChecked} >{selected.indexOf(item.name) >= 0 ? <Icon type="check" style={{ color: "#21b020" }} /> : null}</div>
                            </div>
                            <div className={styles.details} >{item.details}</div>
                        </div>)
                    }

                </div>
            </div>
        )
    }
}

function checkedAll(children) {
    const allArray = [];
    for (let item of children) {
        allArray.push(item.name)
    }
    return allArray
}