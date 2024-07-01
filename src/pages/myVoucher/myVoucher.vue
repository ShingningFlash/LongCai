<template>
	<view>
		<!-- tabs栏部分 -->
		<view class="orderTab">
			<scroll-view :scroll-x="true" :enable-flex='true'
				style="display: flex;justify-content: space-around;height: 70rpx;">
				<view class="tabBox" v-for="(item,index) in tabList" :key="index" @click="Setstatus(item.index)">
					<span :class=" tabIndex == item.index ? 'active':''">{{item.name}}</span>
				</view>
			</scroll-view>
		</view>

		<!-- 代金券部分 -->
		<view class="vouvher-box">
			<view class="vouvher-warp">

				<view class="vouvher-item" v-for="(item,index) in userVoucherList" :key="index"
					@click.stop="selectVoucher(item)">
					<view @click.stop="judgmentFun" class="mark-box"
						style="position: absolute;display: flex;;background:#ccc ;opacity:0.5;width: 100%;height: 100%;"
						v-if="payFlag && (total_money < parseFloat(item.threshold_price))">
					</view>
					<view class="vouvher-left">
						<image src="https://tm.ydlweb.com/icons/hb.png" mode=""></image>
					</view>
					<view class="vouvher-right">
						<view class="vouvher-right-left">
							<view class="name">
								<text>{{item.title}}</text>
							</view>
							<view class="time" v-if="item.is_use == 0">
								<text>购买日期：{{item.create_time}}</text>
								<!-- <text>购买日期：2022-07-15 15:15</text> -->
							</view>
							<view class="time" v-if="item.is_use == 1">
								<text>使用日期：{{item.use_time}}</text>
							</view>
						</view>

						<view class="vouvher-right-center">
							<view class="icon" v-if="item.is_use != 0">
								<image src="https://tm.ydlweb.com/icons/ysy.png" mode=""></image>
							</view>
							<view class="icon" v-else>
								<!-- <image src="../../static/icons/ygq.png" mode=""></image> -->
							</view>
						</view>

						<view class="vouvher-right-right">
							<view :class="item.is_use== 0? 'price' :'price-no'"
								:style="payFlag && total_money < parseFloat(item.threshold_price)?'color:#ccc':''">
								￥<text
									:style="payFlag && total_money < parseFloat(item.threshold_price)?'color:#ccc':''">{{item.arrive_price}}</text>
							</view>
							<view :class="item.is_use== 0? 'spec' :'spec-no'">
								<text v-if="item.threshold_price && item.threshold_price == '0.00'" :style="payFlag && total_money < parseFloat(item.threshold_price)?'color:#ccc':''">无门槛</text>
								<text v-else>满{{item.threshold_price}}使用</text>
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
		UserVoucher, // 我的代金券列表 接口
	} from '@/api/index.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				tabIndex: 0, // 状态栏标识 
				tabList: [{
						name: '待使用',
						index: 0
					},
					{
						name: '已使用',
						index: 1
					}
					// ,
					// {
					// 	name: '已过期',
					// 	index: 2
					// }
				],
				userVoucherList: [], // 我的代金券列表
				useStatus: 0, // 待使用0  已使用1
				payFlag: false, // 是不是从结算也过来的标识
				total_money: null, // 传过来的订单总金额
			}
		},
		onLoad(option) {
			that = this
			if (option.payment) {
				this.payFlag = true
			}
			if (option.total_money) {
				this.total_money = option.total_money
			}
		},
		onShow() {
			this.UserVoucherFun()
		},
		methods: {
			// 选择代金券到结算页面
			selectVoucher(obj) {
				if (this.payFlag) {
					if (obj.is_use == 0) {
						let pages = getCurrentPages(); //获取所有页面栈实例列表
						let nowPage = pages[pages.length - 1]; //当前页页面实例
						let prevPage = pages[pages.length - 2]; //上一页页面实例
						prevPage.$vm.voucherData = obj; //修改上一页data里面的voucherData参数值为obj
						uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
							delta: 1
						});
					}
				}
			},
			// 获取我的代金券列表数据
			UserVoucherFun() {
				UserVoucher({
					useStatus: this.useStatus
				}, (res) => {
					if (res.status == 1) {
						this.userVoucherList = res.result
						// console.log("类型", typeof(this.userVoucherList[0].threshold_price))
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
				this.useStatus = e
				this.tabIndex = e
				this.userVoucherList = []
				this.UserVoucherFun()
			},

			judgmentFun() {
				return false
			},

		}
	}
</script>

<style lang="scss">
	// 代金券部分
	.vouvher-box {
		margin: 0rpx 20rpx 30rpx;
		background-color: #F4F6F7;

		.vouvher-warp {
			background-color: #F4F6F7;

			.mark-box {}

			.vouvher-item {
				position: relative;
				display: flex;
				background-color: #fff;
				margin-top: 20rpx;
				border-radius: 10rpx;

				.vouvher-left {
					width: 131rpx;
					height: 131rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.vouvher-right {
					flex: 1;
					display: flex;
					align-items: center;

					.vouvher-right-left {
						flex: 1;

						.name {
							font-size: 32rpx;
							font-weight: 700;
							color: #111;
						}

						.time {
							padding-top: 10rpx;
							font-size: 23rpx;
							font-weight: 400;
							color: #666;
						}
					}

					.vouvher-right-center {
						.icon {
							width: 101rpx;
							height: 76rpx;

							image {
								width: 100%;
								height: 100%;
							}
						}
					}

					.vouvher-right-right {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						padding: 0 10rpx;

						.price {
							font-weight: 700;
							color: #FF704F;
							font-size: 28rpx;

							text {
								font-size: 36rpx;
							}
						}

						.price-no {
							font-weight: 700;
							color: #6e6e6e;
							font-size: 28rpx;

							text {
								font-size: 36rpx;
							}
						}

						.spec {
							font-size: 24rpx;
							font-weight: 400;
							color: #FF704F;
						}

						.spec-no {
							font-size: 24rpx;
							font-weight: 400;
							color: #6e6e6e;
						}
					}
				}
			}
		}
	}

	// tabs栏部分
	.orderTab .tabBox .active::after {
		content: '';
		position: absolute;
		bottom: -20rpx;
		left: 0;
		width: 100%;
		height: 8rpx;
		background-color: #667D8B;
		border-radius: 4.35rpx 4.35rpx 0 0;
	}

	.orderTab {
		background-color: #fff;
		padding: 30rpx 30rpx 0rpx;

		.tabBox {

			font-size: 28rpx;
			font-weight: 400;
			color: #2e2e2e;
			flex-shrink: 0;

			span {
				position: relative;
			}
		}
	}

	page {
		background-color: #F4F6F7;
	}
</style>
