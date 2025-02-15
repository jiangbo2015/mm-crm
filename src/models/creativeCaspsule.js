
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
            console.log(res);
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
    },
};
export default Model;
