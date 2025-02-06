import {
    getList as queryList,
    add as addChannel,
    update as udpateChannel,
    del as deleteChannel,
    findById
} from '@/services/channel';

const Model = {
    namespace: 'channel',
    state: {
        list: [],
    },
    effects: {
        *getList({ payload }, { call, put }) {
            const res = yield call(queryList, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'setChannelList',
                    payload: res.data,
                });
            }
        },

        *findById({ payload }, { call, put }) {
            const res = yield call(findById, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'setCurrentChannel',
                    payload: res.data,
                });
            }
        },

        *add({ payload }, { put, call }) {
            const res = yield call(addChannel, payload);
            console.log(res);
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
    },
};
export default Model;