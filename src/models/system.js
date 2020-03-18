import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { querySystem, updateSystem } from '@/services/system';
import { getPageQuery } from '@/utils/utils';
import { notification } from 'antd';

const Model = {
    namespace: 'system',
    state: {
        email: '',
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

        *update({ payload }, { put, call }) {
            const res = yield call(updateSystem, payload);
            // console.log(res);
            if (res.success) {
                notification.success({
                    message: '修改成功',
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
