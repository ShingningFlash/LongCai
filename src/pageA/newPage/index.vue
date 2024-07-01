<template>
	<view>
		<view class="list flex" @click="navTo2('/pageA/newPage/listyun')">
			<view class="">
				<view class="title">
					{{yun.printer_name ? yun.printer_name : '请先选择打印机'}}
				</view>
				<view class="titled flex s-center">
					<image src="/static/icons/icon1.svg" style="width:18rpx;height: 18rpx;margin-right:7rpx"></image>
					{{chooseJ.printer_name ? chooseJ.printer_name : '请先选择打印机'}}
				</view>
			</view>
			<view class="right-top" @click.stop="navTo2('/pageA/newPage/about')">
				价目表>>
			</view>
		</view>
		<view class="index_bg">

		</view>

		<view class="content">
			<view class="flex  s-center">
				<view class="title flex s-center  flex-col">
					<view class="shu">
					</view>
					常见打印
				</view>

			</view>

			<view class="content-list">
				<view class="list-item flex-col s-center" @click="navTo('/pageA/newPage/document')">
					<image class="image" src="/static/image1.png"></image>
					<view class="models">
						文档打印
					</view>
					<view class="models2">
						Word/Excel/PPT/PDF
					</view>
				</view>
				<view class="list-item flex-col s-center" @click="navTo('/pageA/newPage/picture')">
					<image class="image" src="/static/image2.png" mode=""></image>
					<view class="models">
						图片打印
					</view>
					<view class="models2">
						拍照/相片/聊天记录
					</view>
				</view>
				<view class="list-item flex-col s-center" @click="navTo('/pageA/newPage/photo')">
					<image class="image" src="/static/image3.png" mode=""></image>
					<view class="models">
						照片冲印
					</view>
					<view class="models2">
						将照片打印在6寸相片纸上
					</view>
				</view>
				<view class="list-item flex-col s-center" @click="navTo('/pageA/newPage/certificate')">
					<image class="image" src="/static/image4.png"></image>
					<view class="models">
						证件照
					</view>
					<view class="models2">
						专业证件照制作打印
					</view>
				</view>
			</view>
			<view class="flex  s-center" style="margin-top:66rpx">

				<view class="title flex s-center  flex-col">
					<view class="shu">

					</view>
					工厂发货
				</view>

			</view>

			<view class="more flex m-between s-center" style="margin-top:16rpx">
				<image style="width:200rpx" src="/static/images/image1.png" mode=""></image>
				<image style="margin-right:10rpx" src="/static/images/image2.png" mode=""></image>
				<image style="width:200rpx" src="/static/images/image3.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getPrinterLists,
		getCloudBoxLists,
	} from '@/api/index.js'
	export default {
		data() {
			return {
				PrinterList: [],
				chooseJ: {},
				yun: {}
			}
		},
		onLoad() {
			this.getCloudBoxListEvent()
		},
		onShow() {
			if (uni.getStorageSync('info')) {
				this.chooseJ = uni.getStorageSync('info')
			}
			if (uni.getStorageSync('yun')) {
				this.yun = uni.getStorageSync('yun')
			}
		},

		methods: {
			getPrinterListsEvent() {
				let data = {}
				data.box_id = this.yun.id
				getPrinterLists(data, (res) => {
					if (res.status == 1) {
						if (res.result) {
							this.chooseJ = res.result[0]
							uni.setStorageSync('info', res.result[0])
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			getCloudBoxListEvent() {
				var that = this
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					isHighAccuracy: true,

					// 用户允许获取定位
					success: function(res) {
						console.log(res, '经纬度===>')
						if (res.errMsg == "getLocation:ok") {
							that.latitude = res.latitude
							that.longitude = res.longitude
							getCloudBoxLists({
								longitude: that.longitude,
								latitude: that.latitude
							}, (res) => {
								if (res.status == 1) {
									that.yun = res.result.rows[0]
									uni.setStorageSync('yun', res.result.rows[0])
									that.getPrinterListsEvent()
								}
							})

						}
					},
					// 用户拒绝获取定位后 再次点击触发
					fail: function(res) {
						console.log(res)
						if (res.errMsg == "getLocation:fail auth deny") {
							uni.showModal({
								content: '检测到您没打开获取信息功能权限，是否去设置打开？',
								confirmText: "确认",
								cancelText: '取消',
								success: (res) => {
									if (res.confirm) {
										uni.openSetting({
											success: (res) => {
												console.log('确定');
											}
										})
									} else {
										console.log('取消');
										return false;
									}
								}
							})
						}
					},
					complete: () => {
						uni.hideLoading()
					}
				});




			},
			navTo2(url) {
				uni.navigateTo({
					url: url
				})
			},
			navTo(url) {
				if (!uni.getStorageSync('info') && url != '/pageA/newPage/listyun' && url != '/pageA/newPage/about') {
					return uni.showToast({
						title: '请先选择打印机',
						icon: 'none',
						duration: 2000
					})
				}
				if (uni.getStorageSync('info')) {
					let info = uni.getStorageSync('info')
					if (info.isPrinter == 1) {
						uni.navigateTo({
							url: url
						})
					} else {
						uni.showToast({
							title: '当前打印机离线或不可用',
							icon: 'none',
							duration: 2000
						})
					}
				}

			},

		}
	}
</script>
<style>
	page {
		background-color: #F0F4F9;
	}
</style>
<style scoped lang="scss">
	.index_bg {
		width: 100%;
		height: 90rpx;
		position: absolute;
		background-color: #1C5FAB;
		z-index: -1;
		top: 0;
	}

	.list {
		width: 690rpx;
		padding: 24rpx 36rpx;
		box-sizing: border-box;
		background-color: #fff;
		margin: 0 auto;
		margin-top: 20rpx;
		border-radius: 12rpx;
		background: url('/static/indexbg.png') no-repeat center/cover;
		height: 215rpx;
		border-radius: 20rpx;
		position: relative;

		.right-top {
			position: absolute;
			right: 20rpx;
			top: 20rpx;
			color: #fff;
			font-size: 24rpx;
			font-weight: 400;
			padding: 10rpx 20rpx;
		}

		.title {
			font-family: "PingFang SC Bold";
			font-weight: 700;
			font-size: 30rpx;
			color: #fff;


		}

		.titled {
			font-family: "PingFang SC Bold";
			font-weight: 400;
			font-size: 23rpx;
			color: #FFFFFF;
			margin-top: 20rpx;
		}

	}

	.content {

		width: 690rpx;
		// height: 988rpx;
		background: #fff;
		padding: 30rpx;
		box-sizing: border-box;
		margin: 0 auto;
		margin-top: 25rpx;

		.title {
			font-family: "PingFang SC Bold";
			font-weight: 700;
			font-size: 30rpx;
			color: #000;

			.shu {
				width: 137rpx;
				height: 4rpx;
				border-radius: 2rpx;
				background: #1c5fab;
				margin-bottom: 10rpx;
			}
		}

		.rights {
			font-family: "PingFang SC Bold";
			font-weight: 700;
			font-size: 30rpx;
			text-align: right;
			color: #000;
		}

		.content-list {
			margin-top: 30rpx;
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 25rpx;

			.list-item {
				margin-top: 24rpx;

				.image {
					width: 113rpx;
					height: 108.8rpx;

				}

				.models {
					font-family: "PingFang SC Bold";
					font-weight: 700;
					font-size: 34rpx;
					color: #000;
					margin-top: 14rpx;
				}

				.models2 {
					font-family: "PingFang SC Bold";
					font-weight: 700;
					font-size: 24rpx;
					color: #b8b8b8;
					margin-top: 2rpx;
				}

			}
		}
	}

	.more {
		image {
			width: 208rpx;
			height: 110rpx;
		}
	}
</style>