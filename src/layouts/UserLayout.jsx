import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import { Link } from 'umi';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import SelectLang from '@/components/SelectLang';
import { filterImageUrl } from '@/utils/utils'
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

const UserLayout = props => {
    const {
        route = {
            routes: [],
        },
    } = props;
    const { routes = [] } = route;
    const {
        system,
        children,
        location = {
            pathname: '',
        },
        dispatch
    } = props;
    const { breadcrumb } = getMenuData(routes);
    const title = getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        ...props,
    });
      useEffect(() => {
        if (dispatch) {
          dispatch({
            type: 'system/get',
          });
        }
      }, []);
    console.log('filterImageUrl(system?.exhibition2)', filterImageUrl(system?.exhibition2))
    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={title} />
            </Helmet>

            <div className={styles.container} style={{backgroundImage: `url(${filterImageUrl(system?.exhibition2)})`}}>
                <div className={styles.header}>
                    <img alt="logo" className={styles.logo} src={logo} />
                    <SelectLang  className={styles.lang}/>
                </div>
                <div className={styles.content}>
                    <div className={styles.loginWrapper}>
                        <img src={filterImageUrl(system?.exhibition1)}/>
                        {children}
                    </div>
                    
                </div>
                <DefaultFooter copyright="2025 We-idesign 3.0.0" links={[]} />
            </div>
        </>
    );
};

export default connect(({ settings, system }) => ({ ...settings, system }))(UserLayout);
