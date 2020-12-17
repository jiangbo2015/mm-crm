import { Alert, Checkbox } from 'antd';
import React, { Component } from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;

@connect(({ login, loading }) => ({
    userLogin: login,
    submitting: loading.effects['login/login'],
}))
class Login extends Component {
    loginForm = undefined;

    state = {
        type: 'account',
        autoLogin: true,
    };

    changeAutoLogin = e => {
        this.setState({
            autoLogin: e.target.checked,
        });
    };

    handleSubmit = (err, values) => {
        const { type } = this.state;

        if (!err) {
            const { dispatch } = this.props;
            dispatch({
                type: 'login/login',
                payload: values,
            });
        }
    };

    onTabChange = type => {
        this.setState({
            type,
        });
    };

    onGetCaptcha = () =>
        new Promise((resolve, reject) => {
            if (!this.loginForm) {
                return;
            }

            this.loginForm.validateFields(['mobile'], {}, async (err, values) => {
                if (err) {
                    reject(err);
                } else {
                    const { dispatch } = this.props;

                    try {
                        const success = await dispatch({
                            type: 'login/getCaptcha',
                            payload: values.mobile,
                        });
                        resolve(!!success);
                    } catch (error) {
                        reject(error);
                    }
                }
            });
        });

    renderMessage = content => (
        <Alert
            style={{
                marginBottom: 24,
            }}
            message={content}
            type="error"
            showIcon
        />
    );

    render() {
        const { userLogin, submitting } = this.props;
        const { status, type: loginType } = userLogin;
        const { type, autoLogin } = this.state;
        return (
            <div className={styles.main}>
                <LoginComponents
                    defaultActiveKey={type}
                    onTabChange={this.onTabChange}
                    onSubmit={this.handleSubmit}
                    onCreate={form => {
                        this.loginForm = form;
                    }}
                >
                    <Tab key="account" tab="账户密码登录">
                        {status === 'error' &&
                            loginType === 'account' &&
                            !submitting &&
                            this.renderMessage('账户或密码错误（admin/ant.design）')}
                        <UserName
                            name="account"
                            placeholder="账号"
                            rules={[
                                {
                                    // required: true,
                                    message: '请输入账号!',
                                },
                            ]}
                        />
                        <Password
                            name="password"
                            placeholder="密码"
                            rules={[
                                {
                                    // required: true,
                                    message: '请输入密码！',
                                },
                            ]}
                            onPressEnter={e => {
                                e.preventDefault();

                                if (this.loginForm) {
                                    this.loginForm.validateFields(this.handleSubmit);
                                }
                            }}
                        />
                    </Tab>

                    <Submit loading={submitting}>登录</Submit>
                </LoginComponents>
            </div>
        );
    }
}

export default Login;
