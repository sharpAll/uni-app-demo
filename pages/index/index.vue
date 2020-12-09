<template>
	<view class="page">
		<swiper :indicator-dots="true" :autoplay="true" class="carousel">
			<swiper-item v-for="carousel in carouselList" :key="carousel.id">
				<view class="swiper-item">
					<image :src="carousel.image" class="carousel"></image>
				</view>
			</swiper-item>
		</swiper>
		
		<!-- 热门超英标题 -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<image src="../../static/icos/hot.png" class="hot-ico"></image>
				<view class="hot-title">
					热门超英
				</view>
			</view>
		</view>
		<!-- 热门超英横向滚动-->
		<scroll-view scroll-x="true" class="page-block hot">
			<view class="single-poster" v-for="superhero in hotSuperheroList" :key="superhero.id">
				<view class="poster-wapper">
					<navigator open-type="navigate" :url="'../movie/movie?trailerId=' + superhero.id">
						<image :src="superhero.cover" class="poster"></image>
					</navigator>
					<view class="movie-name">
						{{superhero.name}}
					</view>
					<trailer-stars :innerScore="superhero.score" :showNum="1"></trailer-stars>
				</view>
			</view>
		</scroll-view>
		<!-- 热门预告标题 -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<image src="../../static/icos/interest.png" class="hot-ico"></image>
				<view class="hot-title">
					热门预告
				</view>
			</view>
		</view>
		<!-- 热门预告列表-->
		<view class="hot-movies page-block">
			<!-- 使用video组件 src视频源 poster封面 -->
			<video 
				:id="trailer.id"
				:data-playingindex="trailer.id"
				@play="meIsPlaying"
				v-for="trailer in hotTrailerList" 
				:src="trailer.trailer" 
				:poster="trailer.poster" 
				class="hot-movie-single"
				 controls></video>
		</view>
		<!-- 猜你喜欢标题 -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<image src="../../static/icos/guess-u-like.png" class="hot-ico"></image>
				<view class="hot-title">
					猜你喜欢
				</view>
			</view>
		</view>
		<view class="page-block guess-u-like">
			
			<view class="single-like-movie" v-for="(guess,gIndex) in guessULikeList" :key="gIndex">
				
				<navigator open-type="navigate" :url="'../movie/movie?trailerId=' + guess.id">
					<image :src="guess.cover" class="like-movie"></image>
				</navigator>
				
				<view class="movie-desc">
					<view class="movie-title">
						{{guess.name}}
					</view>
					<trailerStars :innerScore="9.1" showNum="0"></trailerStars>
					<view class="movie-info">
						{{guess.basicInfo}}
					</view>
					<view class="movie-info">
						{{guess.releaseDate}}
					</view>
				</view>
				
				<view class="movie-oper" :data-gIndex="gIndex" @click="praiseMe">
					<image src="../../static/icos/praise.png" class="praise-ico"></image>
					<view class="praise-me">
						点赞
					</view>
					<view :animation="animationDataArr[gIndex]" class="praise-me animation-opacity">
						+1
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import trailerStars from "../../components/trailerStars.vue"
	export default {
		data() {
			return {
				carouselList: [],
				hotSuperheroList:[],
				hotTrailerList:[],
				guessULikeList: [],
				animation:null, //动画效果对象
				animationDataArr: [
					{}, {}, {}, {}, {}
				]  //使用数组分别对应组件的animation属性，使其分别展示动画
			}
		},
		onLoad() {
			// serverUrl为在main.js中挂载的全局变量
			uni.request({
			    url: this.serverUrl+'/index/carousel/list?qq='+this.serverKey,
				method:"POST",
			    success: (res) => {
					const resData=res.data;
			        if(resData.status==200){
						this.carouselList=resData.data;
					}
			    }
			});
			//热门超英
			uni.request({
			    url: this.serverUrl+'/index/movie/hot?type=superhero&qq='+this.serverKey,
				method:"POST",
			    success: (res) => {
					const resData=res.data;
			        if(resData.status==200){
						this.hotSuperheroList=resData.data;
					}
			    }
			});
			//热门预告
			uni.request({
			    url: this.serverUrl+'/index/movie/hot?type=trailer&qq='+this.serverKey,
				method:"POST",
			    success: (res) => {
					const resData=res.data;
			        if(resData.status==200){
						this.hotTrailerList=resData.data;
					}
			    }
			});
			//初始化猜你喜欢
			this.refresh();
			
			// #ifdef APP-PLUS || MP-WEIXIN
			// 在页面创建的时候，创建一个临时动画对象（H5不支持该动画对象）
			this.animation = uni.createAnimation();
			// #endif
		},
		onUnload() {
			// 页面卸载的时候，清除动画数据
			this.animationDataArr=[
					{}, {}, {}, {}, {}
				];
		},
		onPullDownRefresh() {
			this.refresh(); //下拉刷新猜你喜欢模块
		},
		//隐藏页面时将影片暂停
		onHide() {
			if (this.videoContext) {
				this.videoContext.pause();
			}
		},
		methods: {
			// 播放一个视频的时候，需要暂停其他正在播放的视频
			meIsPlaying(e) {
				var trailerId = "";
				if (e) {
					trailerId = e.currentTarget.dataset.playingindex;
					this.videoContext = uni.createVideoContext(trailerId);
				}
				var hotTrailerList = this.hotTrailerList;
				for (var i = 0; i < hotTrailerList.length ; i ++) {
					var tempId = hotTrailerList[i].id;
					if (tempId != trailerId) {
						uni.createVideoContext(tempId).pause();
					}
				}
			},
			//获取猜你喜欢
			refresh() {
				//loading提示
				uni.showLoading({
					mask: true //使用遮罩防止点击
				});
				uni.showNavigationBarLoading();//标题导航栏加载中动画（微信中有导航栏）
				// 查询猜你喜欢数据列表
				uni.request({
					url: this.serverUrl + '/index/guessULike?qq='+this.serverKey,
					method: "POST",
					success: (res) => {
						const resData=res.data;
						if (res.data.status == 200) {
							var guessULikeList = resData.data;
							this.guessULikeList = guessULikeList;
						}
					},
					complete: () => {
						uni.stopPullDownRefresh(); //停止H5下拉刷新
						uni.hideLoading();//隐藏loading
						uni.hideNavigationBarLoading(); //隐藏标题导航栏加载中动画
					}
				});
			},
			//点赞动画
			praiseMe(e) {
				// #ifdef APP-PLUS || MP-WEIXIN
				//获取data-绑定的属性（注意为小写）
				var gIndex = e.currentTarget.dataset.gindex;
				// 构建动画数据，并且通过step来表示这组动画的完成
				this.animation.translateY(-60).opacity(1).step({
					duration: 400
				});
				// 导出动画数据到view组件，实现组件的动画效果
				this.animationDataArr[gIndex] = this.animation.export();
				// 还原动画
				setTimeout(function() {
					this.animation.translateY(0).opacity(0).step({
						duration: 0
					});
					this.animationDataArr[gIndex] = this.animation.export();
				}.bind(this), 500)
				// #endif
			}
		},
		components:{
			trailerStars
		}
	}
</script>

<style>
	@import url("index.css");
</style>
