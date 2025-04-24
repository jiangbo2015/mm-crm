import {
    getList as queryList,
    getAllList,
    add as addChannel,
    update as udpateChannel,
    del as deleteChannel,
    findById,
    updateCostomers,
    updateCapsules
} from '@/services/channel';

const Model = {
    namespace: 'channel',
    state: {
        list: [],
        allList: []
    },
    effects: {
        *getList({ payload }, { call, put }) {
            const res = yield call(queryList, payload);
             
            if (res.success) {
                yield put({
                    type: 'setChannelList',
                    payload: res.data,
                });
            }
        },
        *getAllList({ payload }, { call, put }) {
            const res = yield call(getAllList, payload);
             
            if (res.success) {
                yield put({
                    type: 'setAllChannelList',
                    payload: res.data,
                });
            }
        },
        *findById({ payload }, { call, put }) {
            const res = yield call(findById, payload);
             
            if (res.success) {
                yield put({
                    type: 'setCurrentChannel',
                    payload: res.data,
                });
            }
        },

        *add({ payload }, { put, call }) {
            const res = yield call(addChannel, payload);
             
            if (res.success) {
                yield put({
                    type: 'getList',
                });
            }
        },

        *update({ payload }, { put, call }) {
            const res = yield call(udpateChannel, payload);
            if (res.success) {
                yield put({
                    type: 'getList',
                });
            }
            if (res.success) {
                yield put({
                    type: 'findById',
                    payload: {_id : payload?._id}
                });
            }
        },
        *updateCostomers({ payload }, { put, call }) {
            const res = yield call(updateCostomers, payload);
             
            if (res.success) {
                yield put({
                    type: 'findById',
                    payload: {_id : payload?._id}
                });
            }
        },
        *updateCapsules({ payload }, { put, call }) {
            const res = yield call(updateCapsules, payload);
             
            if (res.success) {
                yield put({
                    type: 'findById',
                    payload: {_id : payload?._id}
                });
            }
        },
        *delete({ payload }, { put, call }) {
            const res = yield call(deleteChannel, payload);
             
            if (res.success) {
                yield put({
                    type: 'getList',
                });
            }
        },
    },
    reducers: {
        setChannelList(state, { payload }) {
            return {
                ...state,
                list: payload,
            };
        },
        setCurrentChannel(state, { payload }) {
            return {
                ...state,
                currentChannel: payload,
            };
        },
        setAllChannelList(state, { payload }) {
            return {
                ...state,
                allList: payload,
            };
        },
    },
};
export default Model;