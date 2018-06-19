import React, { Component } from 'react'

import { Card, Button, Table, Icon } from 'antd'

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import { connect } from 'dva'

import AuthorityForm from './form.js'

import NotFound from '../Exception/404';

@connect(({ authority }) => ({
    ...authority
}))
export default class AuthorityAdd extends Component {
    submit = (params) => {
        this.props.dispatch({ type: 'authority/editorAuthority', params })
    }
    render() {
        const { users, match } = this.props;
        const name = match.params.name;
        const access = users[name];

        if (access == undefined) return <NotFound />
        const user = { name, access };
        return (
            <PageHeaderLayout>
                <Card title="修改账号"  >
                
                    <AuthorityForm user={user} editor={true} submit={this.submit} />
                </Card>
            </PageHeaderLayout>
        )
    }

}