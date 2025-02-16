import {
    getCapsuleById,
    add,
    update,
} from '@/services/diy';
import colorMockData from '../../mock/color'

const Model = {
    namespace: 'diy',
    state: { 
        name: '',
        capsuleItems: colorMockData?.capsuleItems,
        plainColors: colorMockData?.plainColors, //可用素色列表
        flowerColors: colorMockData?.flowerColors, //可用花布列表
        customPlainColors: [], // 自主上传素色列表
        customFlowerColors: [], // 自主上传花布列表
    },
    effects: { // getCapsuleById 
        *getCapsuleById({ payload }, { call, put }) {
            const res = yield call(getCapsuleById, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'setCapsule',
                    payload: res.data,
                });
            }
        },
        *createCapsule({ payload }, { put, call }) {
            const res = yield call(add, payload);
            console.log(res);
        },
        *updateCapsule({ payload }, { put, call }) {
            const res = yield call(update, payload);
            console.log(res);
        },
        *createCapsuleItem({ payload }, { put, call }) {
            const res = yield call(add, payload);
            console.log(res);
        },
    },
    reducers: { 
        setCapsuleName(state, { payload }) {
            return {
                ...state,
                name: payload,
            };
        },
        setPlainColors(state, { payload }) {
            return {
                ...state,
                plainColors: payload,
            };
        },
        setFlowerColors(state, { payload }) {
            return {
                ...state,
                flowerColors: payload,
            };
        },
        setCapsuleItems(state, { payload }) {
            return {
                ...state,
                capsuleItems: payload,
            };
        },
        addCapsuleItem(state, { payload }) {
            return {
                ...state,
                capsuleItems: [...state.capsuleItems, payload],
            };
        },
    },
};
export default Model;
