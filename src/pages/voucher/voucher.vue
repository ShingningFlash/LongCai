<template>

	<view class="details">
		<view class="backImg-box">
			<view class="backImg-warp">
				
				<image src="https://xcx.gdqhwy.com/public/upload/goods/2022/07-21/0074f078a5c415e222f17d0124c084ad.png"></image>
				<!-- <image src="../../static/icons/voucherbg.png"></image> -->
			</view>
			<view class="title-box">
				<view class="title-warp">
					<text>双图文印代金券抢购</text>
				</view>
				<view class="my-box">
					<text>我的代金券</text>
				</view>
			</view>
		</view>

		<view class="commodity-box">
			<view class="commodity-warp">

				<view class="item-box" v-for="(item,index) in voucherListData" :key='index'>
					<view class="item-left">
						<view class="item-bg">
							<image src="https://tm.ydlweb.com/icons/voucherbg2.png" mode=""></image>
						</view>
						<view class="item-title">
							<view class="item-price">
								￥<text>{{item.arrive_price}}</text>
							</view>
							<view class="item-tips">
								<text v-if="item.threshold_price && item.threshold_price == '0.00'">无门槛</text>
								<text v-else>满{{item.threshold_price}}使用</text>
							</view>
						</view>
					</view>
					<view class="item-right">
						<view class="item-top">
							<view class="item-name">
								<text>{{item.title}}</text>
							</view>
						</view>
						<view class="item-bottom">
							<view class="item-center">
								<view class="item-cneter-left">
									<view class="item-center-price">
										￥<text>{{item.price}}</text>
									</view>
									<view class="number-box" style="display: flex;">
										<text v-if="item.limit_buy == 0" style="font-size: 20rpx;color: #9e9c9c;">不限购</text>
										<text v-else style="font-size: 20rpx;color: #9e9c9c;">限购{{item.limit_buy}}张</text>
									</view>
								</view>
								<view class="item-cneter-right">
									<view class="item-center-buy">
										<text @click="snapUp(item.id)">立即抢购</text>
									</view>
								</view>
							</view>
							<view class="item-spec" v-if="item.label.length != 0">
								<text v-for="(item2,index2) in item.label" :key="index2">{{item2}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		voucherList, // 代金券列表 接口
		PurchaseVoucher, // 代用券下单  接口
		VoucherPay // 代用券支付  接口
	} from '@/api/index.js'
	import {
		Payment // 调起微信支付 接口
	} from '@/api/order.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				voucherListData: [], // 代金券列表数据
			}
		},
		onLoad(option) {
			that = this
		},
		onShow() {
			this.voucherListFun()
		},
		methods: {
			// 立即抢购按钮 弹出提示框
			snapUp(id) {
				uni.showModal({
					title: '是否确定购买该代金券',
					success: (res) => {
						if (res.confirm) {
							this.PurchaseVoucherFun(id)
						}
					}
				})

			},
			// 代金券下单购买
			PurchaseVoucherFun(id) {
				// console.log('代金券id', id)
				PurchaseVoucher({
					voucher_id: id
				}, (res) => {
					if (res.status == 1) {
						VoucherPay({
							voucher_id: res.result.id,
							openid: uni.getStorageSync('openid')
						}, (res2) => {
							if (res2.status == 1) {
								Payment(res2.payinfo, (res3) => {
									if (res3.status == 1) {
										setTimeout(() => {
											uni.redirectTo({
												url: '/pages/myVoucher/myVoucher'
											})
										}, 800)
									} else {
										uni.showToast({
											title: res3.msg,
											icon: 'none'
										})
									}
								})
							} else {
								uni.showToast({
									title: res2.msg,
									icon: 'none'
								})
							}
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 获取代金券列表数据
			voucherListFun() {
				voucherList({}, (res) => {
					if (res.status == 1) {
						if (res.result.length != 0) {
							res.result.forEach((item) => {
								let pricearr = []
								pricearr = item.arrive_price.split('.')
								item.arrive_price = pricearr[0]
							})
						}
						this.voucherListData = res.result
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
		}
	}
</script>
<style lang="scss">
	.details {
		.backImg-box {
			position: relative;
			width: 750rpx;
			height: 360rpx;

			.backImg-warp {
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				z-index: -1;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.title-box {
				position: absolute;
				padding: 74rpx 54rpx;

				.title-warp {
					font-size: 42rpx;
					font-weight: 700;
					color: #fff;
					padding-bottom: 30rpx;
				}

				.my-box {
					text {
						font-size: 28rpx;
						font-weight: 400;
						color: #fff;
						border: 1rpx solid #fff;
						border-radius: 25rpx;
						padding: 5rpx 30rpx;
					}

				}
			}
		}

		.commodity-box {
			border-radius: 10rpx;
			background-color: #fff;
			margin: -80rpx 30rpx 30rpx 30rpx;
			border-radius: 15rpx;
			padding: 0rpx 20rpx;

			.commodity-warp {
				.item-box {
					padding: 40rpx 0 0;
					display: flex;

					.item-left {
						position: relative;
						width: 157rpx;
						height: 180rpx;

						.item-bg {
							position: absolute;
							top: 0;
							bottom: 0;
							left: 0;
							right: 0;
							z-index: 0;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.item-title {
							position: absolute;
							top: 0;
							bottom: 0;
							left: 0;
							right: 0;
							z-index: 1;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							align-items: center;

							.item-price {
								flex: 1;
								display: flex;
								justify-content: center;
								align-items: center;
								font-size: 22rpx;
								font-weight: 400;
								color: #fff;

								text {
									font-size: 48rpx;
									font-weight: 700;
									color: #fff;
								}
							}

							.item-tips {
								display: flex;
								justify-content: center;
								align-items: center;
								height: 60rpx;

								text {
									font-size: 20rpx;
									font-weight: 400;
									color: #fff;
								}
							}
						}
					}

					.item-right {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						padding-left: 20rpx;

						.item-top {
							.item-name {
								font-size: 32rpx;
								font-weight: 700;
								color: #111;
							}
						}

						.item-bottom {
							display: flex;
							flex-direction: column;
							padding-bottom: 14rpx;

							.item-center {
								flex: 1;
								display: flex;
								justify-content: space-between;
								margin-bottom: 15rpx;

								.item-cneter-left {
									.item-center-price {
										font-size: 24rpx;
										font-weight: 700;
										color: #FB1F1F;

										text {
											font-size: 32rpx;
											font-weight: 700;
											color: #FB1F1F;
										}
									}
								}

								.item-cneter-right {
									.item-center-buy {
										text {
											font-size: 22rpx;
											font-weight: 400;
											color: #Fff;
											padding: 12rpx 26rpx;
											border-radius: 27rpx;
											background-color: #FE5438;
										}
									}
								}
							}

							.item-spec {
								font-size: 22rpx;
								font-weight: 400;
								color: #FB1F1F;

								text {
									border: 1rpx solid #fb1f1f;
									padding: 0rpx 7rpx;
									border-radius: 6rpx;
									margin-right: 10rpx;
								}

							}
						}
					}
				}

			}
		}
	}


	page {
		height: 100%;
		background-color: #f5f5f5;
	}
</style>
