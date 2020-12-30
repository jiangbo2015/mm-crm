import { getShopStyleList, updateShopStyle, addShopStyle, delShopStyle } from '@/services/shop';

const Model = {
    namespace: 'shop',
    state: {
        currentShopStyleList: { docs: [] },
        currentShopStyle: {},
    },
    effects: {
        *getShopStyleList(_, { call, put, select }) {
            const currentCapsule = yield select(state => state.capsule.currentCapsule);
            const res = yield call(getShopStyleList, { capsule: currentCapsule._id });
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'setCurrentShopStyleList',
                    payload: res.data,
                });
            }
        },

        *addShopStyle({ payload }, { put, call }) {
            const res = yield call(addShopStyle, payload);
            console.log(payload);
            if (res.success) {
                yield put({
                    type: 'getShopStyleList',
                });
            }
        },

        *updateShopStyle({ payload }, { put, call }) {
            const res = yield call(updateShopStyle, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'getShopStyleList',
                });
            }
        },

        *deleteShopStyle({ payload }, { put, call }) {
            const res = yield call(delShopStyle, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'getShopStyleList',
                });
            }
        },
    },
    reducers: {
        setCurrentShopStyleList(state, { payload }) {
            return {
                ...state,
                currentShopStyleList: payload,
            };
        },
        setCurrentShopStyle(state, { payload }) {
            return {
                ...state,
                currentShopStyle: payload,
            };
        },
    },
};
export default Model;
