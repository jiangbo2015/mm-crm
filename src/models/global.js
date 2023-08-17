import { queryNotices } from '@/services/user';
import { notification } from 'antd';
import { getSizeList, getStyleSizeList, addStyleSize, add, del, update } from '@/services/size';
import {
    getBranchAll,
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

import { getAllCapsule } from '@/services/capsule';

import { colorList as getColorList } from '@/services/style';
import { PropertySafetyFilled } from '@ant-design/icons';
const GlobalModel = {
    namespace: 'global',
    state: {
        collapsed: false,
        notices: [],
        sizeList: [],
        styleSizeList: [],
        currentBranch: {},
        branchList: [],
        branchKindList: [],
        capsuleList: [],
        colorList: [],
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
        *fetchStyleSizeList(_, { call, put, select }) {
            const res = yield call(getStyleSizeList);
            if (res.success) {
                yield put({
                    type: 'setStyleSizeList',
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
        *fetchCapsuleList({ payload }, { call, put }) {
            const res = yield call(getAllCapsule);
            if (res.success && res.data) {
                yield put({
                    type: 'setCapsuleList',
                    payload: res.data,
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
        *addStyleSize({ payload }, { call, put, select }) {
            console.log(payload);
            const res = yield call(addStyleSize, payload);
            if (res.success) {
                yield put({
                    type: 'fetchStyleSizeList',
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
        *fetchAllBranchList(_, { call, put, select }) {
            const res = yield call(getBranchAll);
            if (res.success) {
                yield put({
                    type: 'setAllBranchList',
                    payload: res.data,
                });
            }
        },

        *addBranch({ payload }, { call, put, select }) {
            console.log(payload);
            const { kind, ...props } = payload;
            const res = yield call(addBranch, props);
            if (payload.kind) {
                console.log('res.data._id', res.data._id);
                for (let i = 0; i < payload.kind.length; i++) {
                    yield call(addBranchKind, { ...payload.kind[i], branch: res.data._id });
                }
            }
            if (res.success) {
                yield put({
                    type: 'fetchAllBranchList',
                });
            }
        },

        *deleteBranch({ payload }, { call, put, select }) {
            console.log(payload);
            const res = yield call(delBranch, payload);
            if (res.success) {
                yield put({
                    type: 'fetchAllBranchList',
                });
            }
        },

        *updateBranch({ payload }, { call, put, select }) {
            const { kind, ...props } = payload;
            const res = yield call(updateBranch, props);
            if (kind) {
                console.log('res.data._id', res.data._id);
                for (let i = 0; i < kind.length; i++) {
                    if (kind[i]._id) {
                        yield call(updateBranchKind, { ...kind[i], branch: res.data._id });
                    } else {
                        yield call(addBranchKind, { ...kind[i], branch: res.data._id });
                    }
                }
            }
            if (res.success) {
                yield put({
                    type: 'fetchAllBranchList',
                });
            }
            if (res.success) {
                yield put({
                    type: 'fetchAllBranchList',
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
                    payload: { branch: payload.branch },
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
        setCurrentBranch(state, { payload }) {
            return {
                ...state,
                currentBranch: payload,
            };
        }, //styleSizeList
        setSizeList(state, { payload }) {
            return {
                ...state,
                sizeList: payload,
            };
        }, //styleSizeList
        setStyleSizeList(state, { payload }) {
            return {
                ...state,
                styleSizeList: payload,
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
        setAllBranchList(state, { payload }) {
            return {
                ...state,
                allBranchList: payload,
            };
        },
        
        setBranchKindList(state, { payload }) {
            return {
                ...state,
                branchKindList: payload,
            };
        },
        setCapsuleList(state, { payload }) {
            return {
                ...state,
                capsuleList: payload,
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
