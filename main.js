import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
// 使用挂载实现全局变量
//官方接口地址（验证key经常会变）
Vue.prototype.serverUrl="https://www.imovietrailer.com/superhero";
//官方接口权限校验码（验证key经常会变）
Vue.prototype.serverKey="lee29587930";
//自制mock地址（稳定但数据固定）
// Vue.prototype.serverUrl="https://www.fastmock.site/mock/d63d46140d78624041e86d462ab96f22/superhero";

// 使用挂载方法存储用户数据
Vue.prototype.getGlobalUser = function(key) {
	var userInfo = uni.getStorageSync("globalUser");
	if (userInfo != null && userInfo != "" && userInfo != undefined) {
		return userInfo;
	} else {
		return null;
	}
}

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
