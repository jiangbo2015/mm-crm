import {
    getCapsuleById,
    add,
    update,
    applyForPublication
} from '@/services/diy';
import {
    colorAdd,
    colorList
} from '@/services/style';
import colorMockData from '../../mock/color'
const ColorTypeToreducerKey = {
    0: 'setCustomPlainColors',
    1: 'setCustomFlowerColors',
    2: 'setTextures'
}

const initState = {
    _id: undefined,
    author: undefined,
    name: '',
    status: 'draft',
    mode: 'detail',
    capsuleItems: [], // colorMockData?.capsuleItems,
    plainColors:  [], // colorMockData?.plainColors, //可用素色列表
    flowerColors:  [], // colorMockData?.flowerColors, //可用花布列表
    textures: [], //colorMockData?.textures, //可用面料
    customPlainColors: [], // 自主上传素色列表
    customFlowerColors: [], // 自主上传花布列表
    currentEditCapsuleItemIndex: -1,
    currentEditCapsuleItemFinishedIndex: -1,
    currentEditCapsuleStyleRegion: -1,
    selectedGoodId: undefined,
    selectedGoodCategryId: undefined,

}
const Model = {
    namespace: 'diy',
    state: initState,
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
            if (res.success) {
                yield put({
                    type: 'setCapsule',
                    payload: {_id: res.data?._id,}
                });
            }
            return res 
        },
        *updateCapsule({ payload }, { put, call }) {
            const res = yield call(update, payload);
            return res
        },
        *createCapsuleItem({ payload }, { put, call }) {
            const res = yield call(add, payload);
        },
        *createCustomColor({ payload }, { put, call }) {
            const res = yield call(colorAdd, payload);
            if(res.success) {
                yield put({
                    type: 'getColorList',
                    payload: {
                        page: 1,
                        limit: 10,
                        type: payload.type,
                        isCustom: 1,
                    },
                });
            }
            return res
        },
        *getColorList({ payload }, { call, put }) {
            const res = yield call(colorList, payload);
                
            if (res.success && res.data) {

                yield put({
                    type: ColorTypeToreducerKey[payload.type],
                    payload: res.data?.docs,
                });
            }
        },
        *applyForPublication({ payload }, { put, call }) {
            const res = yield call(applyForPublication, payload);
            if (res.success) {
                yield put({
                    type: 'setCapsule',
                    payload: {status: res.data?.status}
                });
            }
             return res
        },
        *approve({ payload }, { put, call }) {
            const res = yield call(update, payload);
            if (res.success) {
                yield put({
                    type: 'setCapsule',
                    payload: {status: res.data?.status}
                });
            }
             return res
        },
    },
    reducers: {
        clearCapsule(state) {
            return {
                ...state,
                ...initState,
            };
        },
        setCapsule(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
        setCapsuleName(state, { payload }) {
            return {
                ...state,
                name: payload,
            };
        },
        setMode(state, { payload }) {
            return {
                ...state,
                mode: payload,
            };
        },
        setPlainColors(state, { payload }) {
            return {
                ...state,
                plainColors: payload,
            };
        },
        setTextures(state, { payload }) {
            return {
                ...state,
                textures: payload,
            };
        },
        setFlowerColors(state, { payload }) {
            return {
                ...state,
                flowerColors: payload,
            };
        },
        setCustomPlainColors(state, { payload }) {
            return {
                ...state,
                customPlainColors: payload,
            };
        },
        setCustomFlowerColors(state, { payload }) {
            return {
                ...state,
                customFlowerColors: payload,
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
        setCurrentEditCapsuleItemFinishedIndex(state, { payload }) {
            return {
                ...state,
                currentEditCapsuleItemFinishedIndex: payload,
            };
        },
        setCurrentEditCapsuleStyleRegion(state, { payload }) {
            return {
                ...state,
                currentEditCapsuleStyleRegion: payload,
            };
            
        },
        setCurrentEnlargeCapsuleItemIndex(state, { payload }) {
            return {
                ...state,
                currentEnlargeCapsuleItemIndex: payload,
            };
        },
        setCurrentEnlargeCapsuleItemFinishedIndex(state, { payload }) {
            return {
                ...state,
                currentEnlargeCapsuleItemFinishedIndex: payload,
            };
        },
        setSelectedGoodId(state, { payload }) {
            return {
                ...state,
                selectedGoodId: payload,
            };
        },
        setSelectedGoodCategryId(state, { payload }) {
            return {
                ...state,
                selectedGoodCategryId: payload,
            };
        },
    },
};
export default Model;
