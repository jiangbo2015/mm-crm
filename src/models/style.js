import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import {
    getList,
    getSvgText,
    update as updateStyle,
    colorList,
    tagList,
    tagAdd,
    colorAdd,
    colorUpdate,
    add,
    detail,
    del,
    colorDel,
    updateArr,
} from '@/services/style';
import { getPageQuery } from '@/utils/utils';
import { notification } from 'antd';

const Model = {
    namespace: 'style',
    state: {
        list: [],
        colorList: [],
        tagList: [],
        colorListFlower: [],
        queryPlainColor: [], //模糊查询的素色列表
        queryFlowerColor: [], //模糊查询的花色列表
        imgUrl: '',
        svgUrl: '',
        shadowUrl: '',
        svgUrlBack: '',
        shadowUrlBack: '',
        styleEditData: {}, //编辑款式时的数据
        currentCategorys: [],
    },
    effects: {
        *get({ payload }, { call, put }) {
            const res = yield call(getList, payload);
            console.log(res);
            if (res.success && res.data) {
                yield put({
                    type: 'setStyleList',
                    payload: res.data,
                });
            }
        },
        *getSvgText({ payload }, { call, put }) {
            const res1 = yield call(getSvgText, payload.svgUrl);
            const res2 = yield call(getSvgText, payload.svgUrlBack);
            if (res1 && res2) {
                yield put({
                    type: 'setSvgText',
                    payload: {
                        svgText: res1,
                        svgBackText: res2,
                    },
                });
            }
        },
        *addStyle({ payload }, { call, put }) {
            const res = yield call(add, payload);
            console.log(res);
            if (res.success && res.data) {
                yield put({
                    type: 'get',
                });
            }
        },

        *getDetail({ payload }, { call, put }) {
            const res = yield call(detail, payload);
            console.log(res);
            if (res.success && res.data) {
                yield put({
                    type: 'setStyleEditData',
                    payload: res.data,
                });
            }
        },

        *getQueryColor({ payload }, { call, put }) {
            console.log('getQueryColor');
            const res = yield call(colorList, payload);
            if (res.success && res.data) {
                yield put({
                    type: 'setQueryList',
                    payload: {
                        type: payload.type,
                        data: res.data,
                    },
                });
            }
        },
        *addStyleTag({ payload }, { call, put, select }) {
            const res = yield call(tagAdd, payload);
            console.log(res);
            if (res.success && res.data) {
                notification.success({
                    message: '添加成功',
                });
                const tagList = yield select(state => state.style.tagList);
                console.log({ tagList });
                yield put({
                    type: 'setTagList',
                    payload: [...tagList, payload.name],
                });
            }
        },
        *getTagList({ payload }, { call, put }) {
            const res = yield call(tagList, payload);
            console.log(res);
            if (res.success && res.data) {
                yield put({
                    type: 'setTagList',
                    payload: res.data.map(d => d.name),
                });
            }
        },
        *getColorList({ payload }, { call, put }) {
            const res = yield call(colorList, payload);
            console.log(res);
            if (res.success && res.data) {
                yield put({
                    type: payload.type === 0 ? 'setColorList' : 'setFlowerList',
                    payload: res.data,
                });
            }
        },

        *delete({ payload }, { call, put }) {
            const res = yield call(del, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'get',
                });
            }
        },

        *addColor({ payload }, { call, put }) {
            const res = yield call(colorAdd, payload);
            console.log(res);
            if (res.success && res.data) {
                notification.success({
                    message: '添加成功',
                });
                yield put({
                    type: 'getColorList',
                    payload: {
                        page: 1,
                        limit: 10,
                        type: payload.type,
                    },
                });
            }
        },
        *deleteColor({ payload }, { call, put }) {
            const res = yield call(colorDel, payload);
            console.log(res);
            if (res.success && res.data) {
                notification.success({
                    message: '删除成功',
                });
                yield put({
                    type: 'getColorList',
                    payload: {
                        page: 1,
                        limit: 10,
                        type: payload.type,
                    },
                });
            }
        },
        *updateArr({ payload }, { call, put }) {
            console.log('update', payload);
            const res = yield call(updateArr, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'get',
                });
                console.log('get');
                notification.success({
                    message: '保存成功',
                });
            }
        },
        *update({ payload }, { put, call }) {
            console.log('update', payload);
            const res = yield call(updateStyle, payload);
            // console.log(res);
            if (res.success) {
                notification.success({
                    message: '修改成功',
                });
                yield put({
                    type: 'get',
                });
            }
        },
        *updateColor({ payload }, { put, call, select }) {
            console.log('update', payload);
            const res = yield call(colorUpdate, payload);
            console.log(res);
            if (res.success) {
                notification.success({
                    message: '修改成功',
                });
                if (!payload.type) {
                    let colorList = yield select(state => state.style.colorList);
                    let objIndex = colorList.docs.findIndex(x => x._id === payload._id);
                    if (objIndex >= 0) {
                        colorList.docs[objIndex] = {
                            ...colorList.docs[objIndex],
                            ...payload,
                        };
                        yield put({
                            type: 'getColorList',
                            payload: { ...colorList },
                        });
                    }
                } else {
                    let colorListFlower = yield select(state => state.style.colorListFlower);

                    let objIndex = colorListFlower.docs.findIndex(x => x._id === payload._id);
                    if (objIndex >= 0) {
                        colorListFlower.docs[objIndex] = {
                            ...colorListFlower.docs[objIndex],
                            ...payload,
                        };
                        yield put({
                            type: 'setFlowerList',
                            payload: { ...colorListFlower },
                        });
                    }
                }
                // yield put({
                //     type: 'getColorList',
                //     payload: {
                //         page: 1,
                //         limit: 10,
                //         type: payload.type ? payload.type : 0,
                //     },
                // });
            }
        },
    },
    reducers: {
        setStyleList(state, { payload }) {
            return {
                ...state,
                list: payload,
            };
        },
        setTagList(state, { payload }) {
            return {
                ...state,
                tagList: payload,
            };
        },
        setColorList(state, { payload }) {
            return {
                ...state,
                colorList: payload,
            };
        },
        setFlowerList(state, { payload }) {
            return {
                ...state,
                colorListFlower: payload,
            };
        },

        setCurrentCategorys(state, { payload }) {
            return {
                ...state,
                currentCategorys: payload,
            };
        },

        resetFields(state, { payload }) {
            return {
                ...state,
                queryPlainColor: [],
                queryFlowerColor: [],
                plainColors: [],
                flowerColors: [],
                imgUrl: '',
                svgUrl: '',
                shadowUrl: '',
                svgUrlBack: '',
                shadowUrlBack: '',
                styleEditData: {},
                currentCategorys: [],
            };
        },

        setQueryList(state, { payload }) {
            return {
                ...state,
                [payload.type === 0 ? 'queryPlainColor' : 'queryFlowerColor']: payload.data,
            };
        },
        setSvgText(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
        setStyleImgUrl(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
        setStyleEditData(state, { payload }) {
            return {
                ...state,
                styleImgUrl: payload.imgUrl,
                imgUrl: payload.imgUrl,
                svgUrl: payload.svgUrl,
                shadowUrl: payload.shadowUrl,
                svgUrlBack: payload.svgUrlBack,
                shadowUrlBack: payload.shadowUrlBack,
                // plainColors: payload.plainColors.map(x => {
                //     x._id = x.colorId;
                //     return x;
                // }),
                // flowerColors: payload.flowerColors.map(x => {
                //     x._id = x.colorId;
                //     return x;
                // }),
                styleEditData: payload,
            };
        },
        setSelectedColor(state, { payload: { type, data } }) {
            const KEY = {
                0: 'plainColors',
                1: 'flowerColors',
            };
            const datas = state[[KEY[type]]];
            let index = datas.findIndex(item => item._id === data._id);
            if (index > -1) {
                datas.splice(index, 1, data);
            } else {
                datas.push(data);
            }
            return {
                ...state,
                [KEY[type]]: [].concat(datas),
            };
        },
    },
};
export default Model;
