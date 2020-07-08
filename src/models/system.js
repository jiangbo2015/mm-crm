import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import {
    querySystem,
    updateSystem,
    getHelpFiles,
    addHelpFile,
    deleteHelpfile,
} from '@/services/system';
import { getPageQuery } from '@/utils/utils';
import { notification } from 'antd';

const Model = {
    namespace: 'system',
    state: {
        email: '',
        helpFiles: [],
    },
    effects: {
        *get({ payload }, { call, put }) {
            const res = yield call(querySystem, payload);
            console.log(res);
            if (res.success && res.data) {
                yield put({
                    type: 'setInfo',
                    payload: res.data[0] ? res.data[0] : {},
                });
            }
        },
        *addHelpFile({ payload }, { put, call }) {
            const res = yield call(addHelpFile, payload);
            // console.log(res);
            if (res.success) {
                notification.success({
                    message: '添加成功',
                });
                yield put({
                    type: 'getHelpFiles',
                });
            }
        },
        *deleteHelpfile({ payload }, { put, call }) {
            const res = yield call(deleteHelpfile, payload);
            // console.log(res);
            if (res.success) {
                notification.success({
                    message: '删除成功',
                });
                yield put({
                    type: 'getHelpFiles',
                });
            }
        },
        *update({ payload }, { put, call }) {
            const res = yield call(updateSystem, payload);
            // console.log(res);
            if (res.success) {
                notification.success({
                    message: '修改成功',
                });
            }
        },
        *getHelpFiles({ payload }, { call, put }) {
            const res = yield call(getHelpFiles, payload);
            console.log({ res });
            if (res.success && res.data) {
                yield put({
                    type: 'setInfo',
                    payload: { helpFiles: res.data },
                });
            }
        },
    },
    reducers: {
        setInfo(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
export default Model;
