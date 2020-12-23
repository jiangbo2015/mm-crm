import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import lodash from 'lodash';
import { imgUrl } from '@/utils/apiconfig';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
    if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
        return true;
    }

    return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
    const { NODE_ENV } = process.env;

    if (NODE_ENV === 'development') {
        return true;
    }

    return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
    const authority = router.find(({ path }) => path && pathRegexp(path).exec(pathname));
    if (authority) return authority;
    return undefined;
};

export const getGoodsParams = params => {
    let goods = Object.keys(params).filter(x => x.indexOf('goods-') === 0);
    let goodsParams = [];
    let categoriesParams = [];
    goods.map(good => {
        let arr = good.split('-');
        console.log(good);
        console.log(params);
        if (arr.length >= 2 && params[good] && params[good].length > 0) {
            goodsParams.push(arr[1]);
            categoriesParams.push(...lodash.union(params[good]));
        }
    });
    return {
        goodsId: goodsParams,
        categoryId: lodash.union(categoriesParams),
    };
};

export const getGoodsParamsToValue = (goodsParams, categories, goodsList = []) => {
    let values = {};
    goodsParams.map(goodId => {
        let goodObject = goodsList.find(x => x._id === goodId);
        if (goodObject) {
            values[`goods-${goodId}`] = lodash.union(
                categories.filter(c => goodObject.category.findIndex(x => x._id === c) >= 0),
            );
        }
    });
    return values;
};

export const filterImageUrl = url => {
    if (!url) return null;
    let arrs = url.split('/');
    // 本地数据
    if (arrs.length >= 3) {
        if (url.indexOf('.svg') >= 0) {
            console.log('url', `/${url}`);
            return `/${url}`;
        } else {
            return `${imgUrl}mrmiss//${arrs[2]}`;
        }
    } else {
        // console.log(`${imgUrl}${url}`);
        return `${imgUrl}${url}`;
    }
};
