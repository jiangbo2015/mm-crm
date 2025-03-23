import { queryCurrent, getList, add, del, update as updateUser, download } from '@/services/user';
import { api } from '@/utils/apiconfig';
import { setAuthority, RoleToAuthority } from '@/utils/authority';

const KEY = {
    // 0: 'productorList',
    1: 'productorList',
    2: 'designerList',
    3: 'customerList',
    5: 'graphicDesignerList'
};

const UserModel = {
    namespace: 'user',
    state: {
        currentUser: {},
        productorList: [],
        designerList: [],
        customerList: [],
        graphicDesignerList: [],
    },
    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(getList, payload);
            console.log(response);
            yield put({
                type: 'setUsers',
                payload: {
                    role: payload.role,
                    data: response.data,
                },
            });
        },

        *download({ payload }, { call, put }) {
            const { success, data } = yield call(download, payload);
            if (success && data.url) {
                window.open(api + '/' + data.url);
            }
        },

        *add({ payload }, { call, put }) {
            const { fetchParams, ...data } = payload
            const { success } = yield call(add, data);
            if (success) {
                yield put({
                    type: 'fetch',
                    payload: fetchParams ?? {role: payload.role},
                });
            }
        },

        *update({ payload }, { call, put }) {
            const { success } = yield call(updateUser, payload);
            if (success) {
                yield put({
                    type: 'fetch',
                    payload: {
                        role: payload.role,
                    },
                });
            }
        },

        *delete({ payload }, { call, put }) {
            const { success } = yield call(del, payload);
            if (success) {
                yield put({
                    type: 'fetch',
                    payload: {
                        role: payload.role,
                    },
                });
            }
        },

        *fetchCurrent(_, { call, put }) {
            const response = yield call(queryCurrent);
            yield put({
                type: 'saveCurrentUser',
                payload: response.data,
            });
        },
        *updateEmail({ payload }, { call, put }) {
            const { success } = yield call(updateUser, payload);
            if (success) {
                yield put({
                    type: 'fetchCurrent',
                });
                yield put({
                    type: 'setEmailModalOpen',
                    payload: false
                });
            }
        },
    },
    reducers: {
        saveCurrentUser(state, action) {
            setAuthority(RoleToAuthority[action?.payload?.role]);
            return { ...state, currentUser: { ...state.currentUser, ...action.payload, authority: RoleToAuthority[action?.payload?.role]} || {} };
        },
        setUsers(state, { payload }) {
            console.log(payload);
            return { ...state, [KEY[payload.role]]: payload.data };
        },
        setEmailModalOpen(state, { payload }) {
            return { ...state, emailModalOpen: payload };
        },
        changeNotifyCount(
            state = {
                currentUser: {},
            },
            action,
        ) {
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    notifyCount: action.payload.totalCount,
                    unreadCount: action.payload.unreadCount,
                },
            };
        },
    },
};
export default UserModel;
