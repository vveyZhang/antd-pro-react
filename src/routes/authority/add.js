import React, { Component } from 'react'

import { Card, Button, Table, Icon } from 'antd'

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import { connect } from 'dva'

import AuthorityForm from './form.js'

@connect()
export default class AuthorityAdd extends Component {
    add = (params) => {
        this.props.dispatch({ type: 'authority/addAuthority', params })
    }
    render() {
        return (
            <PageHeaderLayout>
                <Card title="添加账号" >
                    <AuthorityForm submit={this.add} />
                </Card>
            </PageHeaderLayout>
        )
    }

}