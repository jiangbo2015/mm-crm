/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  DefaultFooter,
} from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef } from 'react';
import { Link, useIntl, connect, Dispatch, history, getLocale } from 'umi';
import { get, includes } from 'lodash';
import { GithubOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
// import { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
import logo from '../assets/logo.svg';
import logoMin from '../assets/logo_min.png';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);


const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null);
  });

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    collapsed,
    currentUser,
  } = props;

  const menuDataRef = useRef([]);
  const locale = getLocale()

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);


  /**
   * init variables
   */

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };
  // get children authority
  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );

  useEffect(() => {
    if(!localStorage.token) {
        history.push('/user/login')
        return;
    }

    if(location.pathname==='/' ) {
        history.push(get(menuDataRef.current, '0.children.0.path') || get(menuDataRef.current, '0.path'))
    }
  }, [location.pathname, authorized, currentUser])

  const { formatMessage } = useIntl();

  return (
    <ProLayout
        style={{ borderBottom: '10px solid #000', height: 'calc(100vh - 10px)'}}
      logo={collapsed ? <div style={{width: '10px', height: '60px'}}/> : logo}
      formatMessage={formatMessage}
      {...props}
      {...settings}
      disableMobile
      onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => {
        console.log(routers, 'routers')
        return [
            {
              path: '/',
              breadcrumbName: locale === 'zh-CN' ? '首页' : 'HOME',
            },
            ...routers,
          ]
      }}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={null}
      menuDataRender={menuDataRender}
      rightContentRender={() => <RightContent />}
      postMenuData={(menuData) => {
        menuDataRef.current = menuData || [];
        return menuData || [];
      }}
    >
      <Authorized authority={authorized && authorized.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings, user }) => ({
    currentUser: user.currentUser,
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
