import { LogoutOutlined, SettingOutlined, UserOutlined, KeyOutlined, MailOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, Modal, Form, Input } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { injectIntl } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import ChangePasswordModal from './ChangePasswordModal'
import styles from './index.less';

class AvatarDropdown extends React.Component {
    state = {
        email: this.props.currentUser.email, // 初始化时直接使用 props 的值
        passwordModalOpen: false
    }

    componentDidUpdate(prevProps) {
        // 当 props.currentUser.email 发生变化时，更新 state.email
        if (prevProps.currentUser?.email !== this.props.currentUser?.email) {
            this.setState({
                email: this.props.currentUser.email
            });
        }
    }

    onMenuClick = event => {
        const { key } = event;
        const { dispatch } = this.props;
        if (key === 'logout') {
            

            if (dispatch) {
                dispatch({
                    type: 'login/logout',
                });
            }

            return;
        }

        if (key === 'email') {
            if (dispatch) {
                dispatch({
                    type: 'user/setEmailModalOpen',
                    payload: true
                });
            }
            return;
        }

        if (key === 'changePassword') {
            this.setState({
                passwordModalOpen: true
            })

            return;
        }
        // history.push(`/account/${key}`);
    };

    onCloseEmailModalOpen = () => {
        const { dispatch } = this.props;
        if (dispatch) {
            dispatch({
                type: 'user/setEmailModalOpen',
                payload: false
            });
        }
    }

    onCloseChangePasswordModalOpen = () => {
        const { dispatch } = this.props;
        if (dispatch) {
            dispatch({
                type: 'user/setChangePasswordModalOpen',
                payload: false
            });
        }
    }

    onUpdateEmail = () => {
        const { dispatch } = this.props;

        console.log("this.state.email", this.state.email)
        if (dispatch) {
            dispatch({
                type: 'user/updateEmail',
                payload: {
                    _id: this.props.currentUser?._id,
                    email: this.state.email
                }
            });
        }

        return;    
    }

    onChangePassword = () => {
        const { dispatch } = this.props;

        // console.log("this.state.email", this.state.email)
        if (dispatch) {
            dispatch({
                type: 'user/changePassword',
                payload: {
                    _id: this.props.currentUser?._id,
                    email: this.state.email
                }
            });
        }

        return;    
    }
    render() {
        const {
            emailModalOpen,
            currentUser = {
                avatar: '',
                name: '',
                email: ''
            },
            intl,
            isHideName
        } = this.props;
        const { passwordModalOpen } = this.state
        const menuHeaderDropdown = (
            <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
                {/* {menu && (
                    <Menu.Item key="center">
                        <UserOutlined />
                        个人中心
                    </Menu.Item>
                )}
                {menu && (
                    <Menu.Item key="settings">
                        <SettingOutlined />
                        个人设置
                    </Menu.Item>
                )}
                {menu && <Menu.Divider />} */}
                <Menu.Item key="email">
                    <MailOutlined />
                    {intl.formatMessage({id: "邮箱设置"})}
                </Menu.Item>
                <Menu.Item key="changePassword">
                    <KeyOutlined />
                    {intl.formatMessage({id: "修改密码"})}
                </Menu.Item>
                <Menu.Item key="logout">
                    <LogoutOutlined />
                    {intl.formatMessage({id: "退出登录"})}
                </Menu.Item>
            </Menu>
        );
        return currentUser && currentUser.name ? (
            <>
                        <HeaderDropdown overlay={menuHeaderDropdown}>
                <span className={`${styles.action} ${styles.account}`}>
                    <Avatar
                        size="small"
                        className={styles.avatar}
                        alt="avatar"
                    >
                        {currentUser.account.slice(0, 1).toUpperCase()}
                    </Avatar>
                    {!isHideName && <span className={styles.name}>{currentUser.name}</span>}
                    
                </span>
            </HeaderDropdown>
            {emailModalOpen && 
            <Modal open={true} 
                title={intl.formatMessage({id: "邮箱设置"})} 
                onCancel={this.onCloseEmailModalOpen}
                onOk={this.onUpdateEmail}
            >
                <Input 
                    value={this.state.email} 
                    onChange={(e) => {
                    this.setState({email: e.target.value})
                }}/>
            </Modal>}
            { passwordModalOpen && <ChangePasswordModal onCancel={() => this.setState({ passwordModalOpen: false })}/> }
            </>

        ) : (
            <Spin
                size="small"
                style={{
                    marginLeft: 8,
                    marginRight: 8,
                }}
            />
        );
    }
}

export default connect(({ user }) => ({
    currentUser: user.currentUser,
    emailModalOpen: user.emailModalOpen,
}))(injectIntl(AvatarDropdown));
