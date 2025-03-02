import { getShopStyleList, updateShopStyle, addShopStyle, delShopStyle, getBranchList,shopStyleSort } from '@/services/shop';
import arrayMove from 'array-move';

const Model = {
    namespace: 'shop',
    state: {
        currentShopStyleList: { docs: [] },
        currentShopStyle: {},
        branchList: []
    },
    effects: {
        *getShopStyleList(_, { call, put, select }) {
            const currentBranch = yield select(state => state.global.currentBranch);
            const params = {};
            if (currentBranch && currentBranch._id) {
                params.branch = currentBranch._id;
            }
            const res = yield call(getShopStyleList, params);
             
            if (res.success) {
                yield put({
                    type: 'setCurrentShopStyleList',
                    payload: res.data,
                });
            }
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
        *addShopStyle({ payload }, { put, call, select }) {
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
             
            if (res.success) {
                yield put({
                    type: 'getShopStyleList',
                });
            }
        },

        *shopStyleSort({ payload }, { put, call,select }) {
            
            const list = yield select(state => state.shop.currentShopStyleList);
            const { dragIndex, hoverIndex } = payload;

            const newList = arrayMove(list.docs, dragIndex, hoverIndex);
            const newSort = newList.map((l, index) => ({ _id: l._id, sort: index }));

            
            const res = yield call(shopStyleSort, {
                newSort,
            });
     
            if (newList) {
                yield put({
                    type: 'setCurrentShopStyleList',
                    payload: {...list, docs: newList},
                });
            }
            
        },
        *deleteShopStyle({ payload }, { put, call }) {
            const res = yield call(delShopStyle, payload);
             
            if (res.success) {
                yield put({
                    type: 'getShopStyleList',
                });
            }
        },
    },
    reducers: {
        setBranchList(state, { payload }) {
            return {
                ...state,
                branchList: payload,
            };
        },
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
