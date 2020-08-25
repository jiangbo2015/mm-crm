import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import arrayMove from 'array-move';
import {
    getList as queryList,
    add as addGoods,
    del,
    update as updateGoods,
    sort as sortGoods,
} from '@/services/goods';

const Model = {
    namespace: 'goods',
    state: {
        list: [],
        imgUrl: '', //商品图
        category: [{}],
    },
    effects: {
        *getList({ payload }, { call, put }) {
            const res = yield call(queryList, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'setGoodsList',
                    payload: res.data,
                });
            }
        },

        *sort({ payload }, { put, call, select }) {
            const list = yield select(state => state.goods.list);
            const { dragIndex, hoverIndex } = payload;
            yield call(sortGoods, {
                _id: list[dragIndex]._id,
                newIndex: hoverIndex,
            });
            const newList = arrayMove(list, dragIndex, hoverIndex);
            if (newList) {
                yield put({
                    type: 'setGoodsList',
                    payload: newList,
                });
            }
        },
        *add({ payload }, { call, put }) {
            const res = yield call(addGoods, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'getList',
                });
            }
        },

        *delete({ payload }, { call, put }) {
            const res = yield call(del, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'getList',
                });
            }
        },

        *update({ payload }, { call, put }) {
            const res = yield call(updateGoods, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'getList',
                });
            }
        },
    },
    reducers: {
        setGoodsList(state, { payload }) {
            return {
                ...state,
                list: payload,
            };
        },

        setImgUrl(state, { payload }) {
            return {
                ...state,
                imgUrl: payload,
            };
        },

        setCategories(state, { payload }) {
            return {
                ...state,
                category: payload,
            };
        },
    },
};
export default Model;
