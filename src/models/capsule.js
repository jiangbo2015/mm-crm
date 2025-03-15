import arrayMove from 'array-move';
import {
    getAdminList as queryList,
    add,
    update,
    del,
    getCapsuleStyleList,
    updateCapsuleStyle,
    addCapsuleStyle,
    delCapsuleStyle,
    sortCapsuleStyle,
    getCapsuleById
} from '@/services/capsule';

import { message } from 'antd';
import { getPageQuery } from '@/utils/utils';

const Model = {
    namespace: 'capsule',
    state: {
        list: [],
        currentCapsule: {},
        currentCapsuleStyleList: [],
    },
    effects: {
        *getCapsuleById({ payload }, { call, put }) {
            
        },
        *getList({ payload }, { call, put }) {
            const res = yield call(queryList, payload);
             
            if (res.success) {
                yield put({
                    type: 'setCapsuleList',
                    payload: res.data,
                });
            }
        },

        *add({ payload }, { put, call }) {
            const res = yield call(add, payload);
            console.log(payload);
            if (res.success) {
                yield put({
                    type: 'getList',
                });
            }
        },

        *update({ payload }, { put, call }) {
            const res = yield call(update, payload);
             
            if (res.success) {
                yield put({
                    type: 'getList',
                });
            }
        },

        *delete({ payload }, { put, call }) {
            const res = yield call(del, payload);
             
            if (res.success) {
                yield put({
                    type: 'getList',
                });
            }
        },
        *getCapsuleStyleList(_, { call, put, select }) {
            const currentCapsule = yield select(state => state.capsule.currentCapsule);
            const res = yield call(getCapsuleStyleList, { capsule: currentCapsule._id, limit: 1000 });
            // const res = yield call(getCapsuleStyleList);
             
            if (res.success) {
                yield put({
                    type: 'setCurrentCapsuleStyleList',
                    payload: res.data,
                });
            }
        },

        *addCapsuleStyle({ payload }, { put, call, select }) {
            const hide = message.loading('保存中...', 0)
            const currentCapsule = yield select(state => state.capsule.currentCapsule);
            // const res = yield call(getCapsuleStyleList, { capsule: currentCapsule._id });
            const res = yield call(addCapsuleStyle, { capsule: currentCapsule._id, ...payload });
            console.log(payload);
            if (res.success) {
                yield put({
                    type: 'getCapsuleStyleList',
                });
                message.success('保存成功')
                hide()
            }else{
                message.error('保存失败')
                hide()
            }
        },

        *updateCapsuleStyle({ payload }, { put, call }) {
            const hide = message.loading('保存中...', 0)
            // const currentCapsule = yield select(state => state.capsule.currentCapsule);
            // const res = yield call(updateCapsuleStyle, { capsule: currentCapsule._id, ...payload });
            const res = yield call(updateCapsuleStyle, payload);
             
            if (res.success) {
                yield put({
                    type: 'getCapsuleStyleList',
                });
                message.success('保存成功')
                hide()
            }else{
                message.error('保存失败')
                hide()
            }
        },

        *deleteCapsuleStyle({ payload }, { put, call }) {
            const res = yield call(delCapsuleStyle, payload);
             
            if (res.success) {
                yield put({
                    type: 'getCapsuleStyleList',
                });
            }
        },
        *sortCapsuleStyle({ payload }, { put, call,select }) {
            
            const list = yield select(state => state.capsule.currentCapsuleStyleList);
            const { dragIndex, hoverIndex } = payload;

            const newList = arrayMove(list.docs, dragIndex, hoverIndex);
            const newSort = newList.map((l, index) => ({ _id: l._id, sort: index }));

            
            const res = yield call(sortCapsuleStyle, {
                newSort,
            });
     
            if (newList) {
                yield put({
                    type: 'setCurrentCapsuleStyleList',
                    payload: {...list, docs: newList},
                });
            }
            
        },
    },
    reducers: {
        setCapsuleList(state, { payload }) {
            return {
                ...state,
                list: payload,
            };
        },
        setCurrentCapsule(state, { payload }) {
            return {
                ...state,
                currentCapsule: payload,
            };
        },
        setCurrentCapsuleStyleList(state, { payload }) {
            return {
                ...state,
                currentCapsuleStyleList: payload,
            };
        },
    },
};
export default Model;
