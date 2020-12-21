import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import {
    getList as queryList,
    add as addChannel,
    update as udpateChannel,
    del as deleteChannel,
} from '@/services/capsule';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
    namespace: 'capsule',
    state: {
        list: [],
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
            const res = yield call(addChannel, payload);
            console.log(payload);
            if (res.success) {
                yield put({
                    type: 'getList',
                });
            }
        },

        *update({ payload }, { put, call }) {
            const res = yield call(udpateChannel, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'getList',
                });
            }
        },

        *delete({ payload }, { put, call }) {
            const res = yield call(deleteChannel, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'getList',
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
    },
};
export default Model;
