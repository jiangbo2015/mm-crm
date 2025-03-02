import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { notification } from 'antd';
import { getRecordList } from '@/services/record';

const Model = {
    namespace: 'record',
    state: {
        visible: false,
        list: [],
    },
    effects: {
        *getList({ payload }, { call, put }) {
            yield put({
                type: 'toggleModal',
                payload: true,
            });
            const res = yield call(getRecordList, payload);
            if (res.success) {
                yield put({
                    type: 'setList',
                    payload: res.data,
                });
            }
        },
    },
    reducers: {
        setList(state, { payload }) {
            return {
                ...state,
                list: payload,
            };
        },
        toggleModal(state, { payload }) {
            return {
                ...state,
                visible: payload,
            };
        },
    },
};
export default Model;
