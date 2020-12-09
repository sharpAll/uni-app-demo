<template>
	<view class="page">
		<view class="search-block">
			
			<view class="search-ico-wapper">
				<image src="../../static/icos/search.png" class="search-ico"></image>
			</view>
			<!-- confirm-type设置键盘右下角按钮的文字，仅在 type="text" 时生效。 -->
			<input 
				placeholder="搜索预告" 
				maxlength="10" 
				class="search-text" 
				confirm-type="search"
				@confirm="searchMe"
			/>
		</view>
		<view class="movie-list page-block">
			<view class="movie-wapper" v-for="trailer in trailerList">
				<image 
					:src="trailer.cover" 
					:data-trailerId="trailer.id"
					@click="showTrailer"
					class="poster"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				trailerList: [],
				keywords: "",			// 搜索的关键字
				page: "",				// 当前第几页
				totalPages: ""			// 总页数
			}
		},
		onLoad() {
			uni.showLoading({
				mask: true,
				title: "请稍后..."
			});
			uni.showNavigationBarLoading();
			
			var serverUrl = this.serverUrl;
			// 查询猜你喜欢数据列表
			uni.request({
				url: serverUrl + '/search/list?keywords=&page=&pageSize=&qq='+this.serverKey,
				method: "POST",
				success: (res) => {
					const resData=res.data;
					if (resData.status == 200) {
						// debugger;
						this.trailerList = resData.data.rows;
					}
				},
				complete: () => {
					uni.hideNavigationBarLoading();
					uni.hideLoading();
				}
			});
		},
		// 页面上拉触底事件
		onReachBottom() {
			var page = this.page + 1;			// 查询下一页面，当前页数累加1
			var keywords = this.keywords;		// 获得当前页面中data里的搜索值
			var totalPages = this.totalPages;	// 获取总页数
			// 如果当前需要分页的分页数和总页数相等，就不分页
			if (page > totalPages) {
				return;
			}
			this.pagedTrailerList(keywords, page, 15);
		},
		methods: {
			searchMe(e) {
				// 获取搜索的内容
				var value = e.detail.value;
				this.keywords = value;
				this.trailerList = [];
				this.pagedTrailerList(value, 1, 15);
			},
			pagedTrailerList(keywords, page, pageSize) {
				uni.showLoading({
					mask: true,
					title: "请稍后..."
				});
				uni.showNavigationBarLoading();
				// 查询猜你喜欢数据列表
				uni.request({
					url: this.serverUrl + '/search/list?keywords=' + keywords
															+ '&page=' + page
															+ '&pageSize=' + pageSize
															+ '&qq=' + this.serverKey,
					method: "POST",
					success: (res) => {
						// 获取真实数据之前，务必判断状态是否为200
						if (res.data.status == 200) {
							const resData=res.data;
							var tempList = resData.data.rows;
							this.trailerList = this.trailerList.concat(tempList);
							this.totalPages = resData.data.total;	// 获取总页数
							this.page = page;		// 覆盖当前页面里的page
						}
					},
					complete: () => {
						uni.hideNavigationBarLoading();
						uni.hideLoading();
					}
				});
			},
			showTrailer(e) {
				var trailerId = e.currentTarget.dataset.trailerid;
				//保留当前页面，跳转到应用内的某个页面 
				uni.navigateTo({
					url: "../movie/movie?trailerId=" + trailerId
				})
			}
		}
	}
</script>

<style>
	@import url("search.css"); 
</style>
