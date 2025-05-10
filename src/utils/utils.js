import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import lodash from 'lodash';
import { imgUrl, svgUrl, preSvgUrl } from '@/utils/apiconfig';

import moment from 'moment'
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useIntl } from 'umi'

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
            return `${svgUrl}${url}`;
            // if (arrs[1] > '2025-04-11') {
            //     return `${svgUrl}${url}`;
            // }
            // return `${preSvgUrl}${url}`;
            // console.log('url', `${svgUrl}${url}`);
            
        } else {
            return `${imgUrl}mrmiss//${arrs[2]}`;
        }
    } else {
        // console.log(`${imgUrl}${url}`);
        return `${imgUrl}${url}`;
    }
};

export const uploadProps = {
    name: 'file',
    // listType: 'picture-card',
    showUploadList: false,
    action: `/api/common/uploadkit`,
};

export const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 下载文件并添加到 ZIP
 * @param {string} url - 文件的完整 URL
 * @param {string} filename - 文件名
 * @param {JSZip} zip - JSZip 实例
 */
async function addFileToZip(url, filename, zip) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const blob = await response.blob();
        zip.file(filename, blob);
        console.log(`Added to ZIP: ${filename}`);
    } catch (error) {
        console.error(`Error downloading ${url}:`, error);
    }
}

/**
 * 下载数组中的所有图片和视频，并打包成 ZIP
 * @param {Array} data - 包含资源的数组
 */
async function downloadResourcesAsZip(data, name) {
    const baseUrl = 'https://ik.imagekit.io/';
    const zip = new JSZip();
    const filenameMap = {}
    // 遍历数据，下载文件并添加到 ZIP
    for (const item of data) {
        // 下载 fileUrl
        if (item.fileUrl) {
            const fileUrl = `${baseUrl}${item.fileUrl}`;
            const filename = item.fileUrl.split('/').pop(); // 提取文件名
            await addFileToZip(fileUrl, filename, zip);
        }

        // 下载 finishedStyleColorsList 中的 imgUrlFront 和 imgUrlBack
        if (item.finishedStyleColorsList && Array.isArray(item.finishedStyleColorsList)) {
            for (const colorItem of item.finishedStyleColorsList) {
                if (colorItem.imgUrlFront) {
                    const imgUrlFront = `${baseUrl}${colorItem.imgUrlFront}`;
                    let filename = `${lodash.get(item, 'style.styleNo')}+${lodash.get(lodash.find(lodash.get(item, 'colorItem.colors'), o => !o), 'code', '')}_Front`;
                    if(filenameMap[filename]) {
                        filenameMap[filename] += 1;
                    } else {
                        filenameMap[filename] = 1
                    }
                    
                    
                    await addFileToZip(imgUrlFront, `${filename}_${filenameMap[filename]}.png`, zip);
                }
                if (colorItem.imgUrlBack) {
                    const imgUrlBack = `${baseUrl}${colorItem.imgUrlBack}`;
                    let filename = `${lodash.get(item, 'style.styleNo')}+${lodash.get(lodash.find(lodash.get(item, 'colorItem.colors'), o => !o), 'code', '')}_Back`;
                    if(filenameMap[filename]) {
                        filenameMap[filename] += 1;
                    } else {
                        filenameMap[filename] = 1
                    }
                    await addFileToZip(imgUrlBack, `${filename}_${filenameMap[filename]}.png`, zip);
                }
            }
        }
    }

    // 生成 ZIP 文件并触发下载
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${name ?? ''}${moment().format('YYYY-MM-DD hh:mm:ss')}-resources.zip`);
    console.log('ZIP file downloaded');
}

export { downloadResourcesAsZip }

export const intl = (id ) => useIntl().formatMessage({id, defaultMessage: id})
export const fullIntl = (data) => useIntl().formatMessage(data)
