<template>
	<view>
		<view class="topup-box">
			<view class="topup-warp">
				<!-- 充值提示文字部分 -->
				<view class="topup-top-box">
					<view class="topup-top-left-box">
						<text>充值</text>
					</view>
					<view class="topup-top-right-box"
						@click="clickJump('/pages/recordsConsumption/recordsConsumption?balance='+balanceTotal)">
						<view class="tips-text">消费记录</view>
						<view class="img">
							<image src="https://tm.ydlweb.com/icons/righticon.png" mode=""></image>
						</view>
					</view>
				</view>
				<!-- 账户余额部分 -->
				<view class="topup-middle-box">
					<view class="topup-middle-left-box">
						<text>账户余额</text>
					</view>
					<view class="topup-middle-right-box">
						<view class="tips-text">
							<text class="money">{{balanceTotal}}</text>元
						</view>
					</view>
				</view>
				<!-- 充值数额部分 -->
				<view class="moneynum-box">
					<view class="moneynum-warp">
						<!-- <view class="moneynum-item">
							<text>50</text>元
						</view>
						<view class="moneynum-item">
							<text>200</text>元
						</view>
						<view class="moneynum-item">
							<text>500</text>元
						</view> -->
						<view :class="clickStatus==index?'moneynum-item-active':'moneynum-item'"
							v-for="(item,index) in lines.quota" :key="index" @click="clickPrice(index,item)">
							<text class="give-title-box" v-if="item.quota_send!=0">赠{{item.quota_send}}元</text>
							<text>{{item.quota}}</text>元
						</view>
						<!-- <view class="moneynum-item-active">
							<text class="give-title-box">赠300元</text>
							<text>2000</text>元
						</view>
						<view class="moneynum-item">
							<text class="give-title-box">赠700元</text>
							<text>5000</text>元
						</view> -->
					</view>
				</view>
				<!-- 底部提示部分 -->
				<view class="bottom-tips-box">
					<view class="bottom-tips-warp">
						<view class="bottom-tips-warp-top">
							<text>微信提示：</text>
						</view>
						<view class="bottom-tips-warp-middle">
							<text>{{lines.charge_remark}}</text>
						</view>
						<!-- <view class="bottom-tips-warp-bottom">
							<text>2、如有问题，请拨打“400-0000-000”联系客服进行反馈。</text>
						</view> -->
					</view>
				</view>
			</view>
			<!-- 底部按钮部分 -->
			<view class="bottom-btn-box">
				<view class="bottom-btn-warp">
					<text @click="topUpPrice">确认充值</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		GetChargeQuota, // 充值额度 接口
		RechargeBalance, // 生成充值余额订单 接口
		PayRechargeOrder, // 支付余额订单 接口
	} from '@/api/user.js'
	import {
		Payment // 调起微信支付 接口
	} from '@/api/order.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				balanceTotal: 0.00, // 账户余额
				lines: {}, // 充值额度
				clickStatus: -1, // 点击的状态
				topUpObj: {}, // 充值的金额对象
			}
		},
		onLoad(option) {
			that = this
			console.log('账户余额', option)
			if (option.balance) {
				this.balanceTotal = option.balance
				this.GetChargeQuotaFun()
			}
		},
		methods: {
			// 立即充值
			topUpPrice() {
				RechargeBalance({
					amount: this.topUpObj.quota
				}, (res) => {
					if (res.status == 1) {
						PayRechargeOrder({
							order_id: res.result.data.order_id
						}, (res2) => {
							if (res2.status == 1) {
								console.log('res2返回的数据', res2)
								Payment(res2.result, (res3) => {
									if (res3.status == 1) {
										uni.showToast({
											title: res3.msg,
											icon:'none'
										})
										setTimeout((item) => {
											uni.redirectTo({
												url: '/pages/user/user'
											})
										}, 1000)
									} else {
										uni.showToast({
											title: res3.msg,
											icon:'none'
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
					}
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				})
			},
			// 点击充值金额的额度
			clickPrice(idx, obj) {
				this.clickStatus = idx
				this.topUpObj = obj
			},
			// 获取充值额度
			GetChargeQuotaFun() {
				GetChargeQuota({}, (res) => {
					this.lines = res.result
				})
			},
			// 路由跳转
			clickJump(e) {
				uni.navigateTo({
					url: e
				})
			},
		}
	}
</script>

<style lang="scss">
	.topup-box {
		height: 100vh;
		padding: 0 30rpx;

		.topup-warp {

			// 充值提示文字部分
			.topup-top-box {
				display: flex;
				justify-content: space-between;
				padding-bottom: 30rpx;

				.topup-top-left-box {
					font-size: 58rpx;
					font-weight: 700;
					color: #1e1e1e;
				}

				.topup-top-right-box {
					display: flex;
					align-items: center;

					.tips-text {
						font-size: 30rpx;
						font-weight: 400;
						color: #777;
					}

					.img {
						display: flex;
						align-items: center;
						width: 25rpx;
						height: 25rpx;
						padding-left: 20rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}
			}

			// 账户余额部分
			.topup-middle-box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 30rpx 0;
				border-bottom: 1rpx solid #ccc;

				.topup-middle-left-box {
					font-size: 30rpx;
					font-weight: 700;
					color: #111;
				}

				.topup-middle-right-box {
					.tips-text {
						font-size: 28rpx;
						font-weight: 700;
						color: #111;

						.money {
							padding-right: 10rpx;
							font-size: 52rpx;
							font-weight: 700;
							color: #111;
						}
					}
				}
			}

			// 充值数额部分
			.moneynum-box {
				padding: 50rpx 0;

				.moneynum-warp {
					display: flex;
					flex-wrap: wrap;

					.moneynum-item {
						position: relative;
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 12rpx;
						width: 216rpx;
						height: 140rpx;
						background-color: #F7F6FB;
						color: #949398;
						font-size: 42rpx;
						font-weight: 700;
						margin-left: 20rpx;

						.give-title-box {
							position: absolute;
							top: 0;
							right: 0;
							padding: 2rpx 13rpx;
							font-size: 20rpx;
							font-weight: 400;
							color: #fff;
							background-color: #E5404F;
							border-radius: 0 12rpx 0 12rpx;
						}
					}

					.moneynum-item-active {
						position: relative;
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 12rpx;
						width: 216rpx;
						height: 140rpx;
						background-color: #667D8B;
						color: #fff;
						font-size: 42rpx;
						font-weight: 700;
						margin-left: 20rpx;

						.give-title-box {
							position: absolute;
							top: 0;
							right: 0;
							padding: 2rpx 13rpx;
							font-size: 20rpx;
							font-weight: 400;
							color: #fff;
							background-color: #E5404F;
							border-radius: 0 12rpx 0 12rpx;
						}
					}

					.moneynum-item:nth-child(3n + 1) {
						margin-left: 0;
					}

					.moneynum-item:nth-child(n + 4) {
						margin-top: 20rpx;
					}

					.moneynum-item-active:nth-child(3n + 1) {
						margin-left: 0;
					}

					.moneynum-item-active:nth-child(n + 4) {
						margin-top: 20rpx;
					}
				}
			}

			.bottom-tips-box {
				.bottom-tips-warp {
					font-size: 24rpx;
					font-weight: 400;
					color: #777;

					.bottom-tips-warp-middle {
						padding: 6rpx 0;
					}
				}
			}
		}

		.bottom-btn-box {
			position: fixed;
			display: flex;
			bottom: 60rpx;

			.bottom-btn-warp {
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #667D8B;
				width: 690rpx;
				height: 95rpx;
				border-radius: 16rpx;
				font-size: 32rpx;
				font-weight: 700;
				color: #fff;
			}
		}
	}
</style>
