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
		<!-- 分销订单列表部分 -->
		<view class="list-box">
			<view class="list-warp">
				<!-- ==循环== -->
				<view class="list-item" v-for="(item,index) in dataList" :key='index'>
					<view class="list-item-top">
						<view class="list-item-top-left">
							<view class="item-img">
								<image src="../../static/images/head.png" mode=""></image>
							</view>
							<view class="item-name">
								<text>{{item.nickname}}</text>
							</view>
						</view>
						<view class="list-item-top-right">
							<text v-if="tabIndex==0">预计佣金：￥{{item.commission}}</text>
							<text v-if="tabIndex==1">分成佣金：￥{{item.commission}}</text>
						</view>
					</view>
					<view class="list-item-bottom">
						<view class="list-item-bottom-top">
							<text>消费金额：{{item.order_amount}}</text>
						</view>
						<view class="list-item-bottom-bottom">
							<text>下单时间：{{item.add_time}}</text>
						</view>
					</view>
				</view>
				<!-- ==循环== -->
			</view>
		</view>
	</view>
</template>

<script>
	import {
		GetDistributeOrder // 分销订单 接口
	} from '@/api/user.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				tabList: [{
						name: '未分成',
						index: 0
					},
					{
						name: '已分成',
						index: 1
					}
				],
				tabIndex: 0, // 状态栏标识 
				dataList: [], // 分销订单数据
			}
		},
		onShow() {
			this.GetDistributeOrderFun()
		},
		methods: {
			// 获取分销订单数据
			GetDistributeOrderFun() {
				let data
				// if (this.tabIndex == 0) {
				// 	data = {
				// 		type: 4
				// 	}
				// }
				// if (this.tabIndex == 1) {
				// 	data = {
				// 		type: 5
				// 	}
				// }
				GetDistributeOrder({
					is_distribut:this.tabIndex
				}, (res) => {
					if (res.status == 1) {
						this.dataList = res.result.rows
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
				this.GetDistributeOrderFun()
			},
		}
	}
</script>

<style lang="scss">
	// 分销订单列表部分
	.list-box {
		padding: 30rpx;

		.list-warp {

			background-color: #f5f5f5;
			border-radius: 16rpx;

			.list-item {
				background-color: #fff;
				margin-bottom: 20rpx;
				padding: 20rpx 0rpx 20rpx 25rpx;

				.list-item-top {
					display: flex;
					justify-content: space-between;

					.list-item-top-left {
						// flex: 2;
						display: flex;
						align-items: center;

						.item-img {
							width: 50rpx;
							height: 50rpx;

							image {
								display: flex;
								align-items: center;
								border-radius: 50%;
								width: 100%;
								height: 100%;
							}
						}

						.item-name {
							padding-left: 15rpx;
							font-size: 28rpx;
							font-weight: 400;
							color: #111;
						}
					}

					.list-item-top-right {

						// flex: 1;
						text {
							background-color: #667D8B;
							font-size: 20rpx;
							font-weight: 400;
							color: #fff;
							padding: 15rpx 20rpx 15rpx 28rpx;
							border-top-left-radius: 28rpx;
							border-bottom-left-radius: 28rpx;
						}
					}
				}

				.list-item-bottom {
					padding-top: 17rpx;

					.list-item-bottom-top {
						padding-bottom: 10rpx;
						font-size: 22rpx;
						font-weight: 400;
						color: #6a6a6a;
					}

					.list-item-bottom-bottom {
						font-size: 22rpx;
						font-weight: 400;
						color: #6a6a6a;
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
