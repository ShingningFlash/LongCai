<template>
	<view>
		<!-- 附近没有打印机展示的页面 -->
		<view class="no-print-box" v-if="printerData.length == 0 ">
			<view class="no-print-warp">
				<image src="https://tm.ydlweb.com/icons/null-cart.png" mode=""></image>
				<view class="text-box">
					<text>附近没有打印机</text>
					<text class="tips">请检查是否打开手机定位...</text>
					<text class="rebtn" @click="Reload">重新加载</text>
				</view>
			</view>
		</view>
		<!-- 搜索列表部分 -->
		<view class="stores-list-box" v-else>
			<view class="stores-list-warp">
				<!-- 循环部分 -->
				<view class="stores-list-item" v-if="item.status == 0" v-for="(item,index) in printerData" :key="index"
					@click="clickJump('/pages/selfPrint/selfPrint?box_id=',item.box_codes)">
					<view class="img-box">
						<image :src="item.printer_img" mode=""></image>
					</view>
					<view class="message-box">
						<view class="top">
							<text>{{item.printer_name}}</text>
						</view>
						<view class="middle">
							<text>{{item.printer_address}}</text>
						</view>
						<view class="bottom">
							<text>距离您{{item.distance}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		GetPrinterList // 搜索附近打印机/云盒 接口
	} from '@/api/order.js'
	let that
	export default {
		data() {
			return {
				latitude: null, // 当前位置纬度
				longitude: null, // 当前位置经度
				printerData: [], // 打印机列表数据
			}
		},
		onLoad() {
			that = this
		},
		onShow() {
			this.GetLocationFun()
		},
		methods: {
			// 重新加载
			Reload(){
				this.GetLocationFun()
			},
			// 获取当前位置经纬度--精准
			GetLocationFun() {
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					success: function(res) {
						that.latitude = res.latitude;
						that.longitude = res.longitude;
						if (that.latitude != null && that.longitude != null) {
							that.GetPrinterListFun(that.longitude, that.latitude)
						} else {
							uni.showToast({
								title: '抱歉，获取不到位置',
								icon: 'none'
							})
						}
					},
					fail(err) {
						console.log('获取地理位置错误',err)
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
			// 				that.GetPrinterListFun(that.longitude, that.latitude)
			// 			} else {
			// 				uni.showToast({
			// 					title: '抱歉，获取不到位置',
			// 					icon: 'none'
			// 				})
			// 			}
			// 		},
			// 		fail(err) {
			// 			console.log('获取地理位置错误',err)
			// 		}
			// 	});
			// },
			// 搜索附近打印机/云盒
			GetPrinterListFun(lon, lat) {
				GetPrinterList({
					longitude: lon,
					latitude: lat
				}, (res) => {
					if (res.status == 1) {
						this.printerData = res.result.rows
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 路由跳转
			clickJump(e, boxid) {
				uni.navigateTo({
					url: e + boxid
				})
			},
		}
	}
</script>

<style lang="scss">
	// 附近没有打印机
	.no-print-box {
		height: 100vh;

		.no-print-warp {
			display: flex;
			flex-direction: column;
			align-items: center;
			height: 100%;
			width: 100%;

			image {
				width: 500rpx;
				height: 300rpx;
				padding-top: 100rpx;
			}

			.text-box {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: #667D8B;
				font-size: 30rpx;
				font-weight: bold;
				margin-top: 100rpx;
				.tips{
					margin-top: 20rpx;
					color: #a6a6a6;
					font-size: 24rpx;
					font-weight: bold;
				}
				.rebtn{
					margin-top: 30rpx;
					
					padding: 10rpx 20rpx;
					border-radius: 10rpx;
					color: #505050;
					background-color: #ececec;
					font-size: 24rpx;
					font-weight: bold;
				}
				.rebtn:active{
					margin-top: 30rpx;
					
					padding: 10rpx 20rpx;
					border-radius: 10rpx;
					color: #8d8d8d;
					background-color: #d3d3d3;
					font-size: 24rpx;
					font-weight: bold;
				}
			}
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
