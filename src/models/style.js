import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import {
    getList,
    update as updateStyle,
    colorList,
    colorAdd,
    add,
    detail,
    del,
} from '@/services/style';
import { getPageQuery } from '@/utils/utils';
import { notification } from 'antd';

const Model = {
    namespace: 'style',
    state: {
        list: [],
        colorList: [],
        queryPlainColor: [], //模糊查询的素色列表
        queryFlowerColor: [], //模糊查询的花色列表
        plainColors: [], //该款式下已选择的素色
        flowerColors: [], //该款式下已选择的花色
        styleImgUrl: '',
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

        *getColorList({ payload }, { call, put }) {
            const res = yield call(colorList, payload);
            console.log(res);
            if (res.success && res.data) {
                yield put({
                    type: 'setColorList',
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
                yield put({
                    type: 'setSelectedColor',
                    payload: {
                        type: payload.type,
                        data: res.data,
                    },
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
    },
    reducers: {
        setStyleList(state, { payload }) {
            return {
                ...state,
                list: payload,
            };
        },
        setColorList(state, { payload }) {
            return {
                ...state,
                colorList: payload,
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
                styleImgUrl: '',
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
        setStyleImgUrl(state, { payload }) {
            return {
                ...state,
                styleImgUrl: payload,
            };
        },
        setStyleEditData(state, { payload }) {
            return {
                ...state,
                styleImgUrl: payload.imgUrl,
                plainColors: payload.plainColors.map(x => {
                    x._id = x.colorId;
                    return x;
                }),
                flowerColors: payload.flowerColors.map(x => {
                    x._id = x.colorId;
                    return x;
                }),
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
