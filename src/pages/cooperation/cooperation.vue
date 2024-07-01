<template>
	<view>
		<!-- 搜索框部分 -->
		<view class="top-search">
			<view class="top-search-icon">
				<image src="https://tm.ydlweb.com/icons/search.png" mode="widthFix"></image>
			</view>
			<input type="text" placeholder="请输入门店名称" v-model.trim="keyword" @blur="search" />
		</view>
		<!-- 门店列表部分 -->
		<view class="stores-list-box">
			<view class="stores-list-warp">
				<!-- 循环部分 -->
				<view class="stores-list-item" v-for="(item,index) in cooperationData" :key="index"
					@click="clickJump('/pages/partnerDetail/partnerDetail',item.id)">
					<view class="img-box">
						<image :src="item.store_img" mode=""></image>
					</view>
					<view class="message-box">
						<view class="top">
							<text>自提点：</text><text>{{item.store_name}}</text>
						</view>
						<view class="middle">
							<text>{{item.address}}</text>
						</view>
						<view class="bottom">
							<text>距离您{{item.distance}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 没登陆的隐形遮罩层 -->
		<view class="login" v-if="!loginPhone||!loginUser_id" @click="tapLogin"></view>
	</view>
</template>

<script>
	import {
		GetStoreList // 获取 附近合作商列表 接口
	} from '@/api/index.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				keyword: '', // 搜索关键字
				latitude: null, // 当前位置纬度
				longitude: null, // 当前位置经度
				cooperationData: [], // 附近合作商列表数据
				loginPhone: uni.getStorageSync('phone'), // 登录的手机号码标识
				loginUser_id: uni.getStorageSync('user_id'), // 登录的用户id标识
			}
		},
		onLoad() {
			that = this
		},
		onShow() {
			this.loginPhone = uni.getStorageSync('phone') // 登录的手机号码标识
			this.loginUser_id = uni.getStorageSync('user_id') // 登录的用户id标识
			that.GetLocationFun()
		},
		methods: {
			// 获取附近合作商列表
			GetStoreList(keyword) {
				let data = {
					keyword: keyword,
					latitude: this.latitude,
					longitude: this.longitude
				}
				GetStoreList(data, (res) => {
					// console.log('获取到的附近合作商res', res)
					if (res.status == 1) {
						this.cooperationData = res.result.rows
						console.log('获取到的附近合作商', this.cooperationData)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 获取当前位置经纬度--精准
			GetLocationFun() {
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					success: function(res) {
						that.latitude = res.latitude;
						that.longitude = res.longitude;
						if (that.latitude != null && that.longitude != null) {
							that.GetStoreList(that.keyword)
						} else {
							uni.showToast({
								title: '抱歉，获取不到位置',
								icon: 'none'
							})
						}
					}
				});
			},
			// 获取当前位置经纬度--模糊
			// GetLocationFun() {
			// 	wx.getFuzzyLocation({
			// 		type: 'gcj02', //返回可以用于uni.openLocation的经纬度
			// 		success: function(res) {
			// 			that.latitude = res.latitude;
			// 			that.longitude = res.longitude;
			// 			if (that.latitude != null && that.longitude != null) {
			// 				that.GetStoreList(that.keyword)
			// 			} else {
			// 				uni.showToast({
			// 					title: '抱歉，获取不到位置',
			// 					icon: 'none'
			// 				})
			// 			}
			// 		}
			// 	});
			// },
			// 关键字搜索
			search() {
				this.GetStoreList(this.keyword)
			},
			// 路由跳转
			clickJump(e, storeid) {
				uni.navigateTo({
					url: e + '?store_id=' + storeid
				})
			},
			// 没登陆就跳转到登录页
			tapLogin() {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				})
				setTimeout((res) => {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				}, 800)
			},
		}
	}
</script>

<style lang="scss">
	// 登录
	.login {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100% !important;
		z-index: 999;
		background-color: rgba(0, 0, 0, 0);
	}
	// 搜索框部分
	.top-search {
		position: relative;
		margin: 0 auto;
		padding: 0 20rpx;
		height: 68rpx;
		border-radius: 50rpx;
		overflow: hidden;
		display: flex;
		align-items: center;

		.top-search-icon {
			width: 68rpx;
			height: 68rpx;
			padding-left: 20rpx;
			overflow: hidden;
			position: absolute;
			top: 0;
			left: 0;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				width: 28rpx;
				height: 28rpx;
			}
		}

		input {
			width: 100%;
			height: 100%;
			line-height: 68rpx;
			border-radius: 50rpx;
			background-color: #f1f1f1;
			font-size: 24rpx;
			color: #1e1e1e;
			padding: 0 20rpx 0 60rpx;
			box-sizing: border-box;
		}
	}

	//列表部分
	.stores-list-box {
		padding: 0 20rpx;

		.stores-list-warp {
			display: flex;
			flex-direction: column;

			.stores-list-item {
				display: flex;
				padding: 30rpx 0 30rpx;
				border-bottom: 1rpx solid #e6e6e6;

				.img-box {      
					width: 200rpx;
					height: 150rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.message-box {
					flex: 1;
					display: flex;
					flex-direction: column;
					padding-left: 20rpx;

					justify-content: space-around;

					.top {
						font-size: 32rpx;
						font-weight: 700;
						color: #111;
					}

					.middle {
						padding: 6rpx 0;
						font-size: 24rpx;
						color: #777;
						font-weight: 400;
					}

					.bottom {
						font-size: 24rpx;
						color: #777;
						font-weight: 400;
					}
				}
			}
		}
	}
</style>
