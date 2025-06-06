import { Tooltip, Dropdown, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons'
import React from 'react';
import { connect } from 'dva';
import Avatar from './AvatarDropdown';
import NoticeIconView from './NoticeIconView';
import NoticeIcon from '../NoticeIcon';
// import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles from './index.less';

const GlobalHeaderRight = props => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      {/* <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue="umi ui"
        dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
        onSearch={value => {
          console.log('input', value);
        }}
        onPressEnter={value => {
          console.log('enter', value);
        }}
      />
      <Tooltip title="使用文档">
        <a
          target="_blank"
          href="https://pro.ant.design/docs/getting-started"
          rel="noopener noreferrer"
          className={styles.action}
        >
          <Icon type="question-circle-o" />
        </a>
      </Tooltip> */}
      <SelectLang className={styles.action} />
      {
        props.user?.id && <NoticeIconView/>
      }
      <Avatar />
      {/* <Dropdown overlay={<span>123</span>} trigger={['click']}>
        <a onClick={e => e.preventDefault()}>
            <Badge dot>
                <BellOutlined style={{fontSize: '20px'}} />
            </Badge>
        </a>
      </Dropdown> */}
      
    </div>
  );
};

export default connect(({ settings, user }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  user: user.currentUser
}))(GlobalHeaderRight);
