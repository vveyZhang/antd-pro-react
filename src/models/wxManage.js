
import {
    _queryBanner, _updateBanner, _createBanner, _deleteBanner, _articleRefresh, _queryArticle, _articleUpdate,
    _queryVideo, _createVideo, _deleteVideo, _updateVideo
} from '../services/wxManage'
import { message } from 'antd'
export default {
    namespace: 'wxManage',
    state: {
        banners: [],
        bannerModalShow: false,
        alricles: [],
        alriclesModalShow: false,
        videos: [],
        videoModalShow: false,
    },

    effects: {
        *queryBanner(action, { call, put }) {
            const data = yield call(_queryBanner);
            if (data.error.ErrorCode != 0) return;
            yield put({
                type: 'saveData', data: {
                    banners: data.banners
                }
            })
        },
        *updateBanner({ params }, { call, put }) {
            const data = yield call(_updateBanner, params);
            if (data.error.ErrorCode != 0) return;
            message.success('操作成功');
            yield put({ type: 'queryBanner' });
            yield put({
                type: 'saveData', data: {
                    bannerModalShow: false
                }
            })
        },
        *createBanner({ params }, { call, put }) {
            const data = yield call(_createBanner, params);
            if (data.error.ErrorCode != 0) return;
            message.success('操作成功');
            yield put({ type: 'queryBanner' });
            yield put({
                type: 'saveData', data: {
                    bannerModalShow: false
                }
            })
        },
        *deleteBanner({ params }, { call, put }) {
            const data = yield call(_deleteBanner, params);
            if (data.error.ErrorCode != 0) return;
            message.success('删除成功');
            yield put({ type: 'queryBanner' });
        },
        *queryArticle({ params }, { call, put }) {
            const data = yield call(_queryArticle);
            if (data.error.ErrorCode != 0) return;
            yield put({
                type: 'saveData', data: {
                    alricles: data.news
                }
            })
        },
        *articleUpdate({ params }, { call, put }) {
            const data = yield call(_articleUpdate, params);
            if (data.error.ErrorCode != 0) return;
            yield put({
                type: 'saveData', data: {
                    alriclesModalShow: false
                }
            })
            yield put({ type: 'queryArticle' });
        },
        *articleRefresh({ params }, { call, put }) {
            const data = yield call(_articleRefresh);
            if (data.error.ErrorCode != 0) return;
            message.success('拉取成功');
            yield put({ type: 'queryArticle' });
        },
        *queryVideo(action, { call, put }) {
            const data = yield call(_queryVideo);
            if (data.error.ErrorCode != 0) return;
            yield put({
                type: 'saveData', data: {
                    videos: data.videos
                }
            })
        },
        *updateVideo({ params }, { call, put }) {
            const data = yield call(_updateVideo, params);
            
            if (data.error.ErrorCode != 0) return;
            message.success('操作成功');
            yield put({ type: 'queryVideo' });
            yield put({
                type: 'saveData', data: {
                    videoModalShow: false
                }
            })
        },
        *createVideo({ params }, { call, put }) {
            const data = yield call(_createVideo, params);

            if (data.error.ErrorCode != 0) return;
            message.success('操作成功');
            yield put({ type: 'queryVideo' });
            yield put({
                type: 'saveData', data: {
                    videoModalShow: false
                }
            })
        },
        *deleteVideo({ params }, { call, put }) {
            const data = yield call(_deleteVideo, params);
            if (data.error.ErrorCode != 0) return;
            message.success('删除成功');
            yield put({ type: 'queryVideo' });
        },
    },
    reducers: {
        saveData(state, { data }) {
            return {
                ...state,
                ...data,
            };
        },
    },
};
