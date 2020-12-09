<template>
	<view class="black">
		<image 
			:src="cover"
			class="cover"
			mode="widthFix"
			@longpress="operator"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cover: ""
			};
		},
		onLoad(params) {
			this.cover = params.cover;
			
			// 通过api修改导航栏的属性
			uni.setNavigationBarColor({
				frontColor: "#ffffff",
				backgroundColor: "#000000"
			});
		},
		methods: {
			operator() {
				//​显示操作菜单
				uni.showActionSheet({
					itemList: ["保存图片到本地"],
					success: (res)=>{
						// 下标为0则下载
						if (res.tapIndex == 0) {
							uni.showLoading({
								title: "图片保存中..."
							})
							//下载文件
							uni.downloadFile({
								url: this.cover,
								success: function(result) {
									var tempFilePath = result.tempFilePath;
									//保存图片至系统相册
									uni.saveImageToPhotosAlbum({
										filePath: tempFilePath,
										success: function() {
											uni.showToast({
												title: "保存成功",
												duration: 2000
											})
										},
										complete: function() {
											uni.hideLoading();
										}
									})
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
.black {
	background-color: #000000;
	width: 100%;
	height: 100%;
	
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: fixed;
}
.cover {
	align-self: center;
}
</style>
