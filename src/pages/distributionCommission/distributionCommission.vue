<template>
	<view>
		<!-- tabs栏部分 -->
		<view class="orderTab">
			<scroll-view :scroll-x="true" :enable-flex='true'
				style="display: flex;justify-content: space-around;height: 70rpx;">
				<view class="tabBox" v-for="(item,index) in tabList" :key="index" @click="Setstatus(item.index)">
					<span :class=" tabIndex == item.index ? 'active' : '' ">{{item.name}}</span>
				</view>
			</scroll-view>
		</view>
		<!-- 佣金展示部分 -->
		<view class="totle-box">
			<view class="total-warp">
				<!-- 背景图部分 -->
				<image src="https://tm.ydlweb.com/icons/bg5.png" mode=""></image>
				<view class="total-warp-absolute">
					<view class="total-warp-top">
						<view class="total-warp-top-top">
							<text>可提现佣金(元)</text>
						</view>
						<view class="total-warp-top-bottom">
							<text>{{commissionData.total_money}}</text>
						</view>
					</view>
					<view class="total-warp-bottom">
						<view class="total-warp-bottom-left">
							<text class="text1">今日到账</text>
							<text class="text2">{{commissionData.day_money}}</text>
						</view>
						<view class="total-warp-bottom-middle">
							<text class="text1">昨日到账</text>
							<text class="text2">{{commissionData.yesterday_money}}</text>
						</view>
						<view class="total-warp-bottom-right">
							<text class="text1">冻结金额</text>
							<text class="text2">{{commissionData.frozen_money}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 分销佣金列表部分 -->
		<view class="records-list-box">
			<view class="records-list-warp">
				<!-- ===循环部分=== -->
				<view class="records-list-item" v-for="(item,index) in commissionData.result" :key="index">
					<view class="records-list-item-top">
						<view class="records-list-item-top-left">
							<text>{{item.title}}</text>
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
							<text class="red" v-else>-{{item.credit}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 筛选日期时间 -->
		<u-datetime-picker :show="show" mode="year-month" @confirm="confirmTime" @cancel="cancelTime">
		</u-datetime-picker>
	</view>
</template>

<script>
	import {
		GetDistributeLog // 分销佣金明细 接口
	} from '@/api/user.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				show: false, // 日期弹出框显示隐藏标识
				tabList: [{
						name: '全部',
						index: 0
					},
					{
						name: '收入',
						index: 1
					},
					{
						name: '支出',
						index: 2
					},
					{
						name: '筛选',
						index: 3
					}
				],
				tabIndex: 0, // 状态栏标识 
				commissionData: {}, // 佣金明细数据
				timeValue: null,
			}
		},
		onLoad() {
			that = this
		},
		onShow() {
			this.GetDistributeLogFun()
		},
		methods: {
			// 关闭事件选择器
			cancelTime() {
				this.show = false
			},
			//时间筛选确定事件
			confirmTime(e) {
				this.timeValue = this.dataFormat(new Date(e.value))
				this.show = false
				this.GetDistributeLogFun()
			},
			// 获取 分销佣金明细 数据
			GetDistributeLogFun() {
				let data
				if (this.tabIndex == 3) {
					data = {
						start_time: this.timeValue
					}
				} else {
					data = {
						log_type: this.tabIndex
					}
				}
				GetDistributeLog(data, (res) => {
					if (res.status == 1) {
						this.commissionData = res.result
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 选择顶部订单状态事件
			Setstatus(e) {
				this.tabIndex = e
				if (e == 3) {
					this.show = true
					return;
				}
				if (e == 0) {
					this.timeValue = null
				}
				this.GetDistributeLogFun()
			},
			// 时间戳转化
			dataFormat(time) {
				return `${time.getFullYear()}-${time.getMonth() + 1 >= 10 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)}`;
			},
		}
	}
</script>

<style lang="scss">
	// 分销佣金列表部分
	.records-list-box {
		padding: 0 30rpx;

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

	// 佣金展示部分
	.totle-box {
		padding: 30rpx;

		.total-warp {
			position: relative;
			width: 690rpx;
			height: 300rpx;

			image {
				position: absolute;
				z-index: 88;
				width: 100%;
				height: 100%;
			}

			.total-warp-absolute {
				position: absolute;
				z-index: 99;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 100%;

				.total-warp-top {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					padding: 40rpx;

					.total-warp-top-top {
						font-size: 24rpx;
						font-weight: 400;
						color: #fff;
					}

					.total-warp-top-bottom {
						font-size: 50rpx;
						font-weight: 700;
						color: #fff;
					}
				}

				.total-warp-bottom {
					flex: 1;
					display: flex;
					justify-content: center;

					.total-warp-bottom-left {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						padding: 0 60rpx;

						.text1 {
							font-size: 24rpx;
							font-weight: 400;
							color: #ddd;
						}

						.text2 {
							padding-top: 10rpx;
							font-size: 26rpx;
							font-weight: 700;
							color: #fff;
						}
					}

					.total-warp-bottom-middle {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						padding: 0 60rpx;
						border-left: 1rpx solid #ddd;
						border-right: 1rpx solid #ddd;

						.text1 {
							font-size: 24rpx;
							font-weight: 400;
							color: #ddd;
						}

						.text2 {
							padding-top: 10rpx;
							font-size: 26rpx;
							font-weight: 700;
							color: #fff;
						}
					}

					.total-warp-bottom-right {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						padding: 0 60rpx;

						.text1 {
							font-size: 24rpx;
							font-weight: 400;
							color: #ddd;
						}

						.text2 {
							padding-top: 10rpx;
							font-size: 26rpx;
							font-weight: 700;
							color: #fff;
						}
					}
				}
			}
		}
	}

	// tabs栏部分
	.orderTab {
		background-color: #fff;
		padding: 30rpx 30rpx 0rpx;

		.tabBox {
			display: flex;
			justify-content: space-around;
			font-size: 28rpx;
			font-weight: 400;
			color: #2e2e2e;
			flex-shrink: 0;

			span {
				position: relative;
			}

			.active::after {
				content: '';
				position: absolute;
				bottom: 10rpx;
				left: 0;
				width: 100%;
				height: 8rpx;
				background-color: #667D8B;
				border-radius: 4.35rpx 4.35rpx 0 0;
			}
		}
	}

	page {
		background-color: #f5f5f5;
	}
</style>
