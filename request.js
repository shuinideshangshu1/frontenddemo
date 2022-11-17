import axios from "axios";
import { ElLoading } from 'element-plus'
import { debounce } from "lodash";

let loadingInstance;
const LoadingOpts = {
    text: "加载中，请稍后......"
};

const RequestStack = [];
let RequestId = 0; // 也可以不用

const closeLoading = debounce(() => {
    if (!RequestStack.length) {
        loadingInstance && loadingInstance.close();
        loadingInstance = null
    }
}, 100);


const instance = axios.create({});
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 开启 Loading
    !loadingInstance && (loadingInstance = ElLoading.service(LoadingOpts))
    RequestStack.push(RequestId++);
    return config;
}, function (error) {
    // 发生错误时清除一个元素
    RequestStack.pop();
    closeLoading();
    return Promise.reject(error);
});

// 添加响应拦截器，不管成功还是失败都需要关闭 loading
instance.interceptors.response.use(function (response) {
    RequestStack.pop();
    closeLoading();
    return response;
}, function (error) {
    RequestStack.pop();
    closeLoading();
    return Promise.reject(error);
});
export let myaxios = instance;