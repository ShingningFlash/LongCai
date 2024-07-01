<template>
	<view>
		<view class="backImg">
			<image src="https://tm.ydlweb.com/icons/bg.png"></image>
		</view>
		<view class="user">
			<view class="userdata">
				<image :src="distributeData.head_pic"></image>
				<view>
					<view class="name">{{distributeData.nickname}}</view>
					<view class="phone">{{distributeData.mobile}}</view>
				</view>
			</view>
			<view class="userMessagebox">
				<view class="userMessagewarp">
					<view class="top">
						<text>可提现（元）</text>
					</view>
					<view class="middle">
						<view class="money">
							<text>{{distributeData.distribut_money_can}}</text>
						</view>
						<view class="top-up-btn-box" @click="clickJump('/pages/accountWithdrawal/accountWithdrawal?money='+distributeData.distribut_money_can)">
							<text>点击提现</text>
						</view>
					</view>
					<view class="bottom">
						<text>累计提现佣金：{{distributeData.distribut_money}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="model">
			<view class="orderTitle">
				<text class='text1'>我的团队</text>
			</view>
			<view class="modelBox">
				<view class="modelBox-warp">
					<view class="modelBox-warp-left">
						<view class="modelBox-warp-left-top">
							<view class="modelBox-warp-left-top-img">
								<image v-if="distributeData.recommend_img == ''" src="../../static/images/head.png"
									mode=""></image>
								<image v-else :src="distributeData.recommend_img" mode=""></image>
							</view>
							<view class="name">
								<text v-if="distributeData.recommend_name == ''">暂无</text>
								<text v-else>{{distributeData.recommend_name}}</text>
							</view>
						</view>
						<view class="modelBox-warp-bottom">
							<text>推荐人</text>
						</view>
					</view>
					<view class="modelBox-warp-middle">
						<view class="modelBox-warp-middle-top">
							<view class="modelBox-warp-middle-top-num">
								<text>{{distributeData.day_count}} 人</text>
							</view>
						</view>
						<view class="modelBox-warp-bottom">
							<text>新增用户</text>
						</view>
					</view>
					<view class="modelBox-warp-right">
						<view class="modelBox-warp-right-top">
							<view class="modelBox-warp-right-top-num">
								<text>{{distributeData.total_count}} 人</text>
							</view>
						</view>
						<view class="modelBox-warp-bottom">
							<text>全部用户</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部选项部分 -->
		<view class="options-box">
			<view class="options-warp">
				<view class="options-warp-item"
					@click="clickJump('/pages/distributionCommission/distributionCommission')">
					<view class="options-warp-item-left">
						<view class="options-warp-item-img">
							<image src="https://tm.ydlweb.com/icons/yjmx.png" mode=""></image>
						</view>
						<view class="options-warp-item-title">
							<text>佣金明细</text>
						</view>
					</view>
					<view class="options-warp-item-right">
						<view class="options-warp-item-icon">
							<image src="https://tm.ydlweb.com/icons/righticon.png" mode=""></image>
						</view>
					</view>
				</view>
				<!-- ==== -->
				<view class="options-warp-item" @click="clickJump('/pages/distributionOrders/distributionOrders')">
					<view class="options-warp-item-left">
						<view class="options-warp-item-img">
							<image src="https://tm.ydlweb.com/icons/fxdd.png" mode=""></image>
						</view>
						<view class="options-warp-item-title">
							<text>分销订单</text>
						</view>
					</view>
					<view class="options-warp-item-right">
						<view class="options-warp-item-icon">
							<image src="https://tm.ydlweb.com/icons/righticon.png" mode=""></image>
						</view>
					</view>
				</view>
				<!-- ==== -->
				<view class="options-warp-item" @click="clickJump('/pages/myTeam/myTeam')">
					<view class="options-warp-item-left">
						<view class="options-warp-item-img">
							<image src="https://tm.ydlweb.com/icons/wdtd.png" mode=""></image>
						</view>
						<view class="options-warp-item-title">
							<text>我的团队</text>
						</view>
					</view>
					<view class="options-warp-item-right">
						<view class="options-warp-item-icon">
							<image src="https://tm.ydlweb.com/icons/righticon.png" mode=""></image>
						</view>
					</view>
				</view>
				<!-- ==== -->
				<view class="options-warp-item" @click="clickJump('/pages/sharePosters/sharePosters')">
					<view class="options-warp-item-left">
						<view class="options-warp-item-img">
							<image src="https://tm.ydlweb.com/icons/ewm.png" mode=""></image>
						</view>
						<view class="options-warp-item-title">
							<text>推广二维码</text>
						</view>
					</view>
					<view class="options-warp-item-right">
						<view class="options-warp-item-icon">
							<image src="https://tm.ydlweb.com/icons/righticon.png" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		DistributeCenter // 分销中心 接口
	} from '@/api/user.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				distributeData: {}, // 分销中心个人数据
			}
		},
		onShow() {
			this.DistributeCenterFun()
		},
		methods: {
			// 获取分销中心的数据
			DistributeCenterFun() {
				DistributeCenter({}, (res) => {
					if (res.status == 1) {
						this.distributeData = res.result
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
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
	// 底部选项部分
	.options-box {
		margin-top: 30rpx;
		padding: 0 30rpx;

		.options-warp {
			background-color: #fff;
			padding: 0 20rpx;
			border-radius: 10rpx;

			.options-warp-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 40rpx 0;
				border-bottom: 1rpx solid #ddd;

				.options-warp-item-left {
					flex: 1;
					display: flex;
					align-items: center;

					.options-warp-item-img {
						width: 38rpx;
						height: 38rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.options-warp-item-title {
						padding-left: 20rpx;
						font-size: 30rpx;
						font-weight: 400;
						color: #1e1e1e;
					}
				}

				.options-warp-item-right {
					padding-left: 20rpx;

					.options-warp-item-icon {
						display: flex;
						width: 25rpx;
						height: 25rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}
			}

			.options-warp-item:last-child {
				border-bottom: 0;
			}
		}
	}


	// 我的团队部分
	.model {
		display: flex;
		flex-direction: column;
		border-radius: 10rpx;
		margin: 0rpx 30rpx;
		padding: 0rpx 30rpx 30rpx;
		background-color: #fff;

		.orderTitle {
			display: flex;
			justify-content: space-between;
			padding: 15rpx 0rpx 20rpx;

			.text1 {
				font-size: 28rpx;
				font-weight: 400;
				color: #1a1a1a;
			}

			.text2 {
				font-size: 24rpx;
				font-weight: 400;
				color: #999;
			}
		}

		.modelBox {
			.modelBox-warp {
				display: flex;
				justify-content: space-around;
				padding: 0 20rpx;

				.modelBox-warp-left {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: cneter;

					.modelBox-warp-left-top {
						display: flex;
						justify-content: center;
						align-items: center;

						.modelBox-warp-left-top-img {
							margin-right: 5rpx;
							width: 50rpx;
							height: 50rpx;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.name {
							font-size: 24rpx;
							font-weight: 400;
							color: #1e1e1e;
						}
					}
				}

				.modelBox-warp-middle {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: cneter;

					.modelBox-warp-middle-top {
						.modelBox-warp-middle-top-num {
							font-size: 36rpx;
							font-weight: 400;
							color: #667D8B;
						}
					}
				}

				.modelBox-warp-right {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: cneter;

					.modelBox-warp-right-top {
						.modelBox-warp-right-top-num {
							font-size: 36rpx;
							font-weight: 400;
							color: #667D8B;
						}
					}
				}

				.modelBox-warp-bottom {
					display: flex;
					justify-content: center;
					padding-top: 10rpx;
					font-size: 20rpx;
					font-weight: 400;
					color: #7e7e7e;
				}
			}
		}
	}

	// 顶部背景图部分
	.backImg {
		position: fixed;
		top: 0;
		width: 100%;
		height: 300rpx;
		z-index: -1;
		left: 0;

		image {
			width: 100%;
			height: 100%;
		}
	}

	// 头像部分
	.user {
		padding: 20rpx 30rpx;

		.userdata {
			display: flex;
			align-items: center;

			image {
				width: 110rpx;
				height: 110rpx;
				margin-right: 20rpx;
				border-radius: 50%;
			}

			.name {
				font-weight: 400;
				font-size: 32rpx;
				color: #fff;

				.vipbox {
					font-weight: 400;
					font-size: 32rpx;
					color: #ffaa00;
					padding-left: 20rpx;
				}
			}

			.phone {
				font-weight: 400;
				font-size: 20rpx;
				color: #ddd;
				margin-top: 10rpx;
			}

			.loginbtn {
				display: flex;
				align-items: center;

				.name {
					padding-left: 20rpx;
					font-size: 32rpx;
					font-weight: 400;
					color: #fff;
				}
			}
		}

		.userItem {
			padding: 20rpx 40rpx;
			display: flex;
			justify-content: space-between;

			.userBox {
				.num {
					font-weight: 500;
					font-size: 32rpx;
					color: #333;
					text-align: center;
				}

				.name {
					font-weight: 500;
					font-size: 24rpx;
					color: #333;
					margin-top: 5rpx;
					text-align: center;
				}
			}
		}

		.userMessagebox {
			margin-top: 25rpx;
			background-color: #fff;
			// background: url(../../static/icons/bg2.png);
			color: #fff;
			padding: 26rpx 48rpx;
			border-radius: 10rpx;

			.userMessagewarp {
				display: flex;
				flex-direction: column;

				.top {
					font-size: 24rpx;
					color: #7e7e7e;
					font-weight: 400;
				}

				.middle {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 20rpx 0 20rpx;

					.money {
						font-size: 48rpx;
						color: #1e1e1e;
						font-weight: 400;
					}

					.top-up-btn-box {
						text {
							font-size: 24rpx;
							color: #fff;
							font-weight: 700;
							padding: 10rpx 30rpx;
							border-radius: 30rpx;
							background-color: #667D8B;
						}
					}
				}

				.bottom {
					font-size: 24rpx;
					color: #7e7e7e;
					font-weight: 400;
				}
			}
		}
	}

	page {
		background-color: #f5f5f5;
	}
</style>
