import { Alert, Modal } from 'antd';
import React, { Component } from 'react';
import { injectIntl } from 'umi';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import { ContactUs } from './components/ContactUs';
// import { intl } from '@/utils/utils'
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
        openContactUs: false,
    };

    changeAutoLogin = e => {
        this.setState({
            autoLogin: e.target.checked,
        });
    };

    handleOpenContactUs = (open) => {
        this.setState({
            openContactUs: open,
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
        const { userLogin, submitting, intl } = this.props;
        // const { status, type: loginType } = userLogin;
        const { type, openContactUs } = this.state;
        return (
            <div className={styles.main}>
                {openContactUs && <Modal 
                        onCancel={() => this.handleOpenContactUs(false)}
                        width={1000}
                        open={true}
                        footer={null}
                    >
                    <ContactUs callback={() => this.handleOpenContactUs(false)}/>
                </Modal>}
                <LoginComponents
                    defaultActiveKey={type}
                    onTabChange={this.onTabChange}
                    onSubmit={this.handleSubmit}
                    onCreate={form => {
                        this.loginForm = form;
                    }}
                >    
                        <h1 style={{marginBottom: 0}}>{intl.formatMessage({id: "登 陆"})}</h1>
                        <p style={{marginBottom: 30}}>{intl.formatMessage({id: "登陆以继续"})}</p>          
                        <UserName
                            name="account"
                            placeholder={intl.formatMessage({id: "账号"})}
                            rules={[
                                {
                                    // required: true,
                                    message: '请输入账号!',
                                },
                            ]}
                        />
                        <Password
                            name="password"
                            placeholder={intl.formatMessage({id: "密码"})}
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
                    <Submit loading={submitting}>{intl.formatMessage({id: "登 陆"})}</Submit>
                    <div style={{color: '#afadad', marginTop: '-16px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div>{intl.formatMessage({id: "或者"})}</div>
                        <div onClick={() => this.handleOpenContactUs(true)} style={{  cursor: 'pointer', textDecoration: 'underline'}}>{intl.formatMessage({id: "联系我们"})}</div>
                    </div>

                </LoginComponents>
            </div>
        );
    }
}

export default injectIntl(Login);
