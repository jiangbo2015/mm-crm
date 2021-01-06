import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import {
    getList as queryList,
    add,
    update,
    del,
    getCapsuleStyleList,
    updateCapsuleStyle,
    addCapsuleStyle,
    delCapsuleStyle,
} from '@/services/capsule';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
    namespace: 'capsule',
    state: {
        list: [],
        currentCapsule: {},
        currentCapsuleStyleList: [],
    },
    effects: {
        *getList({ payload }, { call, put }) {
            const res = yield call(queryList, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'setCapsuleList',
                    payload: res.data,
                });
            }
        },

        *add({ payload }, { put, call }) {
            const res = yield call(add, payload);
            console.log(payload);
            if (res.success) {
                yield put({
                    type: 'getList',
                });
            }
        },

        *update({ payload }, { put, call }) {
            const res = yield call(update, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'getList',
                });
            }
        },

        *delete({ payload }, { put, call }) {
            const res = yield call(del, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'getList',
                });
            }
        },
        *getCapsuleStyleList(_, { call, put, select }) {
            const currentCapsule = yield select(state => state.capsule.currentCapsule);
            const res = yield call(getCapsuleStyleList, { capsule: currentCapsule._id });
            // const res = yield call(getCapsuleStyleList);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'setCurrentCapsuleStyleList',
                    payload: res.data,
                });
            }
        },

        *addCapsuleStyle({ payload }, { put, call, select }) {
            const currentCapsule = yield select(state => state.capsule.currentCapsule);
            // const res = yield call(getCapsuleStyleList, { capsule: currentCapsule._id });
            const res = yield call(addCapsuleStyle, { capsule: currentCapsule._id, ...payload });
            console.log(payload);
            if (res.success) {
                yield put({
                    type: 'getCapsuleStyleList',
                });
            }
        },

        *updateCapsuleStyle({ payload }, { put, call }) {
            // const currentCapsule = yield select(state => state.capsule.currentCapsule);
            // const res = yield call(updateCapsuleStyle, { capsule: currentCapsule._id, ...payload });
            const res = yield call(updateCapsuleStyle, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'getCapsuleStyleList',
                });
            }
        },

        *deleteCapsuleStyle({ payload }, { put, call }) {
            const res = yield call(delCapsuleStyle, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'getCapsuleStyleList',
                });
            }
        },
    },
    reducers: {
        setCapsuleList(state, { payload }) {
            return {
                ...state,
                list: payload,
            };
        },
        setCurrentCapsule(state, { payload }) {
            return {
                ...state,
                currentCapsule: payload,
            };
        },
        setCurrentCapsuleStyleList(state, { payload }) {
            return {
                ...state,
                currentCapsuleStyleList: payload,
            };
        },
    },
};
export default Model;
