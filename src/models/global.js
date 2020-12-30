import { queryNotices } from '@/services/user';
import { notification } from 'antd';
import { getSizeList, add, del, update } from '@/services/size';
import {
    getBranchList,
    add as addBranch,
    del as delBranch,
    update as updateBranch,
} from '@/services/branch';
import {
    getBranchKindList,
    add as addBranchKind,
    del as delBranchKind,
    update as updateBranchKind,
} from '@/services/branch-kind';
import { colorList as getColorList } from '@/services/style';
const GlobalModel = {
    namespace: 'global',
    state: {
        collapsed: false,
        notices: [],
        sizeList: [],
        branchList: [],
        branchKindList: [],
        colorList: {
            values: [{}],
        },
    },
    effects: {
        *fetchSizeList(_, { call, put, select }) {
            const res = yield call(getSizeList);
            if (res.success) {
                yield put({
                    type: 'setSizeList',
                    payload: res.data,
                });
            }
        },
        *fetchColorList({ payload }, { call, put }) {
            const res = yield call(getColorList, { limit: 1000000 });
            console.log('fetchColorList', res);
            if (res.success && res.data) {
                yield put({
                    type: 'setColorList',
                    payload: res.data.docs,
                });
            }
        },
        *addSize({ payload }, { call, put, select }) {
            console.log(payload);
            const res = yield call(add, payload);
            if (res.success) {
                yield put({
                    type: 'fetchSizeList',
                });
            }
        },

        *deleteSize({ payload }, { call, put, select }) {
            console.log(payload);
            const res = yield call(del, payload);
            if (res.success) {
                yield put({
                    type: 'fetchSizeList',
                });
            }
        },

        *updateSize({ payload }, { call, put, select }) {
            console.log(payload);
            const res = yield call(update, payload);
            if (res.success) {
                yield put({
                    type: 'fetchSizeList',
                });
                notification.success({
                    message: '修改成功',
                });
            }
        },

        *fetchNotices(_, { call, put, select }) {
            const data = yield call(queryNotices);
            yield put({
                type: 'saveNotices',
                payload: data,
            });
            const unreadCount = yield select(
                state => state.global.notices.filter(item => !item.read).length,
            );
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: data.length,
                    unreadCount,
                },
            });
        },

        *clearNotices({ payload }, { put, select }) {
            yield put({
                type: 'saveClearedNotices',
                payload,
            });
            const count = yield select(state => state.global.notices.length);
            const unreadCount = yield select(
                state => state.global.notices.filter(item => !item.read).length,
            );
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: count,
                    unreadCount,
                },
            });
        },

        *changeNoticeReadState({ payload }, { put, select }) {
            const notices = yield select(state =>
                state.global.notices.map(item => {
                    const notice = { ...item };

                    if (notice.id === payload) {
                        notice.read = true;
                    }

                    return notice;
                }),
            );
            yield put({
                type: 'saveNotices',
                payload: notices,
            });
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: notices.length,
                    unreadCount: notices.filter(item => !item.read).length,
                },
            });
        },

        *fetchBranchList(_, { call, put, select }) {
            const res = yield call(getBranchList);
            if (res.success) {
                yield put({
                    type: 'setBranchList',
                    payload: res.data,
                });
            }
        },

        *addBranch({ payload }, { call, put, select }) {
            console.log(payload);
            const res = yield call(addBranch, payload);
            if (res.success) {
                yield put({
                    type: 'fetchBranchList',
                });
            }
        },

        *deleteBranch({ payload }, { call, put, select }) {
            console.log(payload);
            const res = yield call(delBranch, payload);
            if (res.success) {
                yield put({
                    type: 'fetchBranchList',
                });
            }
        },

        *updateBranch({ payload }, { call, put, select }) {
            console.log(payload);
            const res = yield call(updateBranch, payload);
            if (res.success) {
                yield put({
                    type: 'fetchBranchList',
                });
                notification.success({
                    message: '修改成功',
                });
            }
        },

        *fetchBranchKindList({ payload }, { call, put, select }) {
            const res = yield call(getBranchKindList, payload);
            if (res.success) {
                yield put({
                    type: 'setBranchKindList',
                    payload: res.data,
                });
            }
        },

        *addBranchKind({ payload }, { call, put, select }) {
            console.log(payload);
            const res = yield call(addBranchKind, payload);
            if (res.success) {
                yield put({
                    type: 'fetchBranchKindList',
                });
            }
        },

        *deleteBranchKind({ payload }, { call, put, select }) {
            console.log(payload);
            const res = yield call(delBranchKind, payload);
            if (res.success) {
                yield put({
                    type: 'fetchBranchKindList',
                });
            }
        },

        *updateBranchKind({ payload }, { call, put, select }) {
            console.log(payload);
            const res = yield call(updateBranchKind, payload);
            if (res.success) {
                yield put({
                    type: 'fetchBranchKindList',
                });
                notification.success({
                    message: '修改成功',
                });
            }
        },
    },
    reducers: {
        setSizeList(state, { payload }) {
            return {
                ...state,
                sizeList: payload,
            };
        },

        setColorList(state, { payload }) {
            return {
                ...state,
                colorList: payload,
            };
        },

        setCurrentSize(state, { payload, callback }) {
            callback && callback();
            return {
                ...state,
                currentSize: payload,
            };
        },

        changeLayoutCollapsed(
            state = {
                notices: [],
                collapsed: true,
            },
            { payload },
        ) {
            return { ...state, collapsed: payload };
        },

        saveNotices(state, { payload }) {
            return {
                collapsed: false,
                ...state,
                notices: payload,
            };
        },

        saveClearedNotices(
            state = {
                notices: [],
                collapsed: true,
            },
            { payload },
        ) {
            return {
                collapsed: false,
                ...state,
                notices: state.notices.filter(item => item.type !== payload),
            };
        },

        setBranchList(state, { payload }) {
            return {
                ...state,
                branchList: payload,
            };
        },

        setBranchKindList(state, { payload }) {
            return {
                ...state,
                branchKindList: payload,
            };
        },
    },
    subscriptions: {
        setup({ history }) {
            // Subscribe history(url) change, trigger `load` action if pathname is `/`
            history.listen(({ pathname, search }) => {
                if (typeof window.ga !== 'undefined') {
                    window.ga('send', 'pageview', pathname + search);
                }
            });
        },
    },
};
export default GlobalModel;
