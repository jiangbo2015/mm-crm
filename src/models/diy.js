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
        textures: colorMockData?.textures, //可用面料
        customPlainColors: [], // 自主上传素色列表
        customFlowerColors: [], // 自主上传花布列表
        CapsuleItemStyleCurrentFinishedIndexMap: {},
        currentEditCapsuleItemIndex: -1,
        currentEditCapsuleItemFinishedIndex: -1,
        currentEditCapsuleStyleRegion: -1
    },
    effects: { // getCapsuleById 
        *getCapsuleById({ payload }, { call, put }) {
            const res = yield call(getCapsuleById, payload);
             
            if (res.success) {
                yield put({
                    type: 'setCapsule',
                    payload: res.data,
                });
            }
        },
        *createCapsule({ payload }, { put, call }) {
            const res = yield call(add, payload);
             
        },
        *updateCapsule({ payload }, { put, call }) {
            const res = yield call(update, payload);
             
        },
        *createCapsuleItem({ payload }, { put, call }) {
            const res = yield call(add, payload);
             
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
        setCurrentEditCapsuleItem(state, { payload }) {
            return {
                ...state,
                currentEditCapsuleItem: payload,
            };
        },
        setCurrentEditCapsuleItemIndex(state, { payload }) {
            return {
                ...state,
                currentEditCapsuleItemIndex: payload,
            };
        },
        setCurrentEditCapsuleStyleRegion(state, { payload }) {
            return {
                ...state,
                currentEditCapsuleStyleRegion: payload,
            };
            
        }
    },
};
export default Model;
