
import {
    getList as queryList,
} from '@/services/capsule';

const Model = {
    namespace: 'creativeCapsule',
    state: {
        list: {}
    },
    effects: {
        *getList({ payload }, { call, put }) {
            const res = yield call(queryList, payload);
             
            if (res.success) {
                yield put({
                    type: 'setCapsuleList',
                    payload: res.data,
                });
            }
        },
    },
    reducers: {
        setCapsuleList(state, { payload }) {
            return {
                ...state,
                list: {
                    ...state.list,
                    ...payload,
                    docs: (state.list.docs || []).concat(payload.docs)
                },
            };
        },
        clearCapsuleList(state) {
            return {
                ...state,
                list: {},
            };
        },
    },
};
export default Model;
