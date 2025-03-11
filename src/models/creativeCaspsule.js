
import {
    getList as queryList,
} from '@/services/capsule';

import {
    getList as getFavorites,
    del as delFavorite,
    add as addFavorite,
} from '@/services/favorites'

import { map } from 'lodash'

const Model = {
    namespace: 'creativeCapsule',
    state: {
        list: {},
        favorites: [],
        capsuleFavoritesMap: {}
    },
    effects: {
        *getList({ payload }, { call, put }) {
            const res = yield call(queryList, payload);
             
            if (res.success) {
                yield put({
                    type: 'setCapsuleList',
                    payload: res.data,
                });
            }
        },
        *getFavorites({ payload }, { call, put }) {
            const res = yield call(getFavorites, payload);
             
            if (res.success) {
                const capsuleFavoritesMap = {}
                map(res.data, f => {
                    capsuleFavoritesMap[f?.capsule] = f
                })
                yield put({
                    type: 'setFavorites',
                    payload: res.data,
                });
                yield put({
                    type: 'setCapsuleFavoritesMap',
                    payload: capsuleFavoritesMap
                })
            }
        },
        *addFavorite({ payload }, { put, call }) {
            const res = yield call(addFavorite, payload);
            if (res.success) {
                yield put({
                    type: 'getFavorites'
                });
            }
            
            return res 
        },
        *delFavorite({ payload }, { put, call }) {
            const res = yield call(delFavorite, payload);
            if (res.success) {
                yield put({
                    type: 'getFavorites'
                });
            }
            return res 
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
        clearCapsuleList(state) {
            return {
                ...state,
                list: {},
            };
        },
        setFavorites(state, { payload }) {
            return {
                ...state,
                favorites: payload,
            };
        },
        setCapsuleFavoritesMap(state, { payload }) {
            return {
                ...state,
                capsuleFavoritesMap: payload,
            };
        },
    },
};
export default Model;
