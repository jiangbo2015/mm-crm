import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import { Link } from 'umi';
import React from 'react';
import { connect } from 'dva';
// import SelectLang from '@/components/SelectLang';
import logo from '../assets/logo.png';
import styles from './UserLayout.less';

const UserLayout = props => {
    const {
        route = {
            routes: [],
        },
    } = props;
    const { routes = [] } = route;
    const {
        children,
        location = {
            pathname: '',
        },
    } = props;
    const { breadcrumb } = getMenuData(routes);
    const title = getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        ...props,
    });
    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={title} />
            </Helmet>

            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.top}>
                        <div className={styles.header}>
                            <Link to="/">
                                <img alt="logo" className={styles.logo} src={logo} />
                                {/* <span className={styles.title}>MISS</span> */}
                            </Link>
                        </div>
                        <div className={styles.desc}>后台管理系统</div>
                    </div>
                    {children}
                </div>
                <DefaultFooter copyright="2021 MRMISS 1.0.2" links={[]} />
            </div>
        </>
    );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
