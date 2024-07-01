<template>
	<view>
		<view class="records-box">
			<view class="records-warp">
				<!-- 账户余额展示框部分 -->
				<view class="records-warp-top">
					<view class="records-warp-top-top">
						<text>账户余额</text>
					</view>
					<view class="records-warp-top-bottom">
						<text>{{totalBalance}}</text>
					</view>
				</view>
				<!-- 筛选部分 -->
				<view class="screening-box">
					<view class="screening-warp">
						<view class="screening-warp-left" @click="clearTime">
							<view class="screening">
								<text>全部</text>
							</view>
						</view>
						<view class="screening-warp-right" @click="openTime">
							<view class="screening">
								<text v-if="timeValue != null">{{timeValue}}</text>
								<text v-else>筛选</text>
							</view>
							<view class="img">
								<image src="https://tm.ydlweb.com/icons/arrow-right.png" mode=""></image>
							</view>
						</view>
					</view>
				</view>
				<!-- 消费记录列表部分 -->
				<view class="records-list-box">
					<view class="records-list-warp">
						<!-- ===循环部分=== -->
						<view class="records-list-item" v-for="(item,index) in consumptionList" :key="index">
							<view class="records-list-item-top">
								<view class="records-list-item-top-left">
									<text>{{item.remark}}</text>
								</view>
								<view class="records-list-item-top-right">
									<text>{{item.add_at}}</text>
								</view>
							</view>
							<view class="records-list-item-bottom">
								<view class="records-list-item-bottom-left">
									<text>账户余额：{{item.new_credit}}</text>
								</view>
								<view class="records-list-item-bottom-right">
									<text class="green" v-if="item.log_type == 1">+{{item.credit}}</text>
									<text class="red">-{{item.credit}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-datetime-picker :show="show" mode="year-month" @confirm="confirmTime" @cancel="cancelTime">
		</u-datetime-picker>
	</view>
</template>

<script>
	import {
		GetMoneyLog // 获取 消费记录 接口
	} from '@/api/user.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				show: false, // 时间选择框
				timeValue: null, // 筛选的时间
				totalBalance: 0.00, // 账户总余额
				consumptionList: [], // 消费记录列表
			}
		},
		onLoad(option) {
			if (option.balance) {
				this.totalBalance = option.balance
				this.GetMoneyLogFun()
			}
		},
		methods: {
			// 查找全部订单
			clearTime() {
				this.timeValue = null
			},
			// 关闭时间筛选
			cancelTime() {
				this.show = false
			},
			//时间筛选确定事件
			confirmTime(e) {
				this.timeValue = this.dataFormat(new Date(e.value))
				this.show = false
			},
			// 打开时间筛选
			openTime() {
				this.show = true
			},
			// 获取 消费记录 列表 数据
			GetMoneyLogFun() {
				GetMoneyLog({}, (res) => {
					if (res.status == 1) {
						this.consumptionList = res.result.rows
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 时间戳转化
			dataFormat(time) {
				return `${time.getFullYear()}-${time.getMonth() + 1 >= 10 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)}`;
			}
		}
	}
</script>

<style lang="scss">
	.records-box {
		padding: 30rpx;

		.records-warp {

			// 账户余额展示框部分
			.records-warp-top {
				background: url(https://tm.ydlweb.com/icons/bg2.png);
				border-radius: 10rpx;
				height: 250rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				box-shadow: 0 5rpx 12rpx rgba(35, 141, 219, 0.2);

				.records-warp-top-top {
					font-size: 26rpx;
					font-weight: 400;
					color: #fff;
				}

				.records-warp-top-bottom {
					font-size: 60rpx;
					font-weight: 500;
					color: #fff;
				}
			}

			// 筛选部分
			.screening-box {
				.screening-warp {
					display: flex;
					justify-content: space-between;

					.screening-warp-left {
						display: flex;
						padding: 20rpx 0;

						.screening {
							font-size: 28rpx;
							color: #2e2e2e;
							font-weight: 400;
						}
					}

					.screening-warp-right {
						display: flex;
						justify-content: flex-end;
						padding: 20rpx 0;

						.screening {
							font-size: 28rpx;
							color: #2e2e2e;
							font-weight: 400;
						}

						.img {
							width: 30rpx;
							height: 30rpx;

							image {
								width: 100%;
								height: 100%;
							}
						}
					}
				}
			}

			// 消费记录列表部分
			.records-list-box {
				.records-list-warp {
					.records-list-item {
						display: flex;
						flex-direction: column;
						background-color: #fff;
						padding: 20rpx 30rpx;
						border-radius: 10rpx;
						margin-bottom: 20rpx;

						.records-list-item-top {
							display: flex;
							justify-content: space-between;

							.records-list-item-top-left {
								font-size: 28rpx;
								font-weight: 400;
								color: #333;
							}

							.records-list-item-top-right {
								font-size: 24rpx;
								font-weight: 400;
								color: #9e9e9e;
							}
						}

						.records-list-item-bottom {
							display: flex;
							justify-content: space-between;
							align-items: center;
							padding-top: 4rpx;

							.records-list-item-bottom-left {
								font-size: 24rpx;
								font-weight: 400;
								color: #1e1e1e;
							}

							.records-list-item-bottom-right {
								font-size: 24rpx;
								font-weight: 400;

								.green {
									color: #2ABB39;
								}

								.red {
									color: #FF1A1A;
								}
							}
						}
					}
				}
			}
		}
	}

	page {
		background-color: #F5F5F5;
	}
</style>
