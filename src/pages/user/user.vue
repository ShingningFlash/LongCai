<template>
	<view>
		<view class="backImg">
			<image src="https://tm.ydlweb.com/icons/bg.png"></image>
		</view>
		<view class="user">
			<view class="userdata">
				<image v-if="isUserIdPhone" :src="userInfo.head_pic"></image>
				<image v-else src="../../static/images/head.png"></image>
				<view v-if="isUserIdPhone">
					<view class="name">{{userInfo.nickname}}</view>
					<view class="phone">{{userInfo.mobile}}</view>
				</view>
				<view v-else>
					<view class="name" @click="clickJump('/pages/login/login',0)">请点击登录</view>
				</view>
			</view>
			<view class="userMessagebox">
				<view class="userMessagewarp">
					<view class="top">
						<text>账户余额</text>
					</view>
					<view class="middle">
						<view class="money">
							<text v-if="isUserIdPhone">￥{{userInfo.user_money}}</text>
							<text v-else>￥0.00</text>
						</view>
						<view class="top-up-btn-box">
							<text @click="clickJump('/pages/topUp/topUp?balance='+userInfo.user_money,1)">立即充值</text>
						</view>
					</view>
					<view class="bottom"
						@click="clickJump('/pages/recordsConsumption/recordsConsumption?balance='+userInfo.user_money,1)">
						<text>消费记录 > </text>
					</view>
				</view>
			</view>
		</view>
		<view class="model">
			<view class="orderTitle">
				<text class='text1'>我的订单</text>
				<text class="text2" @click="clickJump('/pages/order/order?pay_type=0',1)">查看全部订单</text>
			</view>
			<view class="modelBox">
				<view class="modelBox2" @click="clickJump('/pages/order/order?pay_type=1',1)">
					<image src="https://tm.ydlweb.com/icons/dfk.png"></image>
					<view>待付款</view>
				</view>
				<view class="modelBox2" @click="clickJump('/pages/order/order?pay_type=2',1)">
					<image src="https://tm.ydlweb.com/icons/dfh.png"></image>
					<view>待发货</view>
				</view>
				<view class="modelBox2" @click="clickJump('/pages/order/order?pay_type=3',1)">
					<image src="https://tm.ydlweb.com/icons/dsh.png"></image>
					<view>待收货</view>
				</view>
				<view class="modelBox2" @click="clickJump('/pages/order/order?pay_type=4',1)">
					<image src="https://tm.ydlweb.com/icons/ywc.png"></image>
					<view>已完成</view>
				</view>
				<view class="modelBox2" @click="clickJump('/pages/afterSalesOrder/afterSalesOrder',1)">
					<image src="https://tm.ydlweb.com/icons/thh.png"></image>
					<view>退款/售后</view>
				</view>
			</view>
		</view>
		<view class="Commonly">
			<view class="CommonlyTitle">常用功能</view>
			<view class="CommonlyList">
				<view class="CommonlyBox" @click="clickJump('/pages/myCollection/myCollection',1)">
					<image src="https://tm.ydlweb.com/icons/wdsc.png"></image>
					<view>我的收藏</view>
				</view>
				<view class="CommonlyBox" @click="clickJump('/pages/addressList/addressList',1)">
					<image src="https://tm.ydlweb.com/icons/shdz.png"></image>
					<view>收货地址</view>
				</view>
				<view class="CommonlyBox" @click="clickJump('/pages/myEvaluation/myEvaluation',1)">
					<image src="https://tm.ydlweb.com/icons/wdpj.png"></image>
					<view>我的评价</view>
				</view>
				<view class="CommonlyBox" @click="clickJump('/pages/modifyUserDetail/modifyUserDetail',1)">
					<image src="https://tm.ydlweb.com/icons/grsz.png"></image>
					<view>个人设置</view>
				</view>
				<view class="CommonlyBox" @click="clickJump('/pages/voucher/voucher',1)">
					<image src="https://tm.ydlweb.com/icons/hhzx.png"></image>
					<view>购买代金券</view>
				</view>
				<view class="CommonlyBox" @click="clickJump('/pages/myVoucher/myVoucher',1)">
					<image src="https://tm.ydlweb.com/icons/hhzx.png"></image>
					<view>我的代金券</view>
				</view>
				<view class="CommonlyBox" v-if="userInfo && userInfo.is_distribut && userInfo.is_distribut == 1"
					@click="clickJump('/pages/distributionCenter/distributionCenter',1)">
					<image src="https://tm.ydlweb.com/icons/hhzx.png"></image>
					<view>合伙中心</view>
				</view>
				<view class="CommonlyBox" @click="exitFun">
					<image src="https://tm.ydlweb.com/icons/hhzx.png"></image>
					<view>退出登录</view>
				</view>
				<!-- ============ -->
				<view class="CommonlyBox" style="visibility: hidden;height: 0;"></view>
				<view class="CommonlyBox" style="visibility: hidden;height: 0;"></view>
				<view class="CommonlyBox" style="visibility: hidden;height: 0;"></view>
				<!-- ============= -->
			</view>
		</view>
		<!-- 没登陆的隐形遮罩层 -->
		<view class="login" v-if="!loginPhone||!loginUser_id" @click="tapLogin"></view>
	</view>
</template>
<script>
	import {
		GetUserData // 获取 个人资料 接口
	} from '@/api/user.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				userInfo: uni.getStorageSync('userInfo'), // 我的页面 的 个人信息
				isUserIdPhone: app.globalData.is_userId_phone, // 判断本地缓存是否有 user_id 和 phone 的标识
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
			// 判断全局变量中的 is_userId_phone 是true还是false
			app.getLogin(function(is_login_userid) {
				that.isUserIdPhone = is_login_userid
				if (that.isUserIdPhone) {
					that.GetUserData()
				}
			})
		},
		methods: {
			// 获取 个人资料 数据接口
			GetUserData() {
				GetUserData({}, function(res) {
					if (res.status == 1) {
						that.userInfo = res.result
					}
				})
			},
			// 退出登录
			exitFun() {
				if (this.isUserIdPhone) {
					uni.showModal({
						title: '是否确定退出',
						success: (res) => {
							if (res.confirm) {
								uni.clearStorageSync()
								app.getLogin(function(is_login_userid) {
									that.isUserIdPhone = is_login_userid
								})
							}
						}
					})
				} else {
					uni.showToast({
						title: '请先登录...',
						icon: 'none'
					})
				}
			},
			// 路由跳转
			clickJump(e, flag) {
				if (flag == 0) {
					uni.navigateTo({
						url: e
					})
				} else {
					if (this.isUserIdPhone) {
						uni.navigateTo({
							url: e
						})
					} else {
						uni.showToast({
							title: '请先登录...',
							icon: 'none'
						})
					}
				}
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
		},
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
			background: url(https://tm.ydlweb.com/icons/bg2.png);
			color: #fff;
			padding: 26rpx 48rpx;
			border-radius: 10rpx;

			.userMessagewarp {
				display: flex;
				flex-direction: column;

				.top {
					font-size: 24rpx;
					color: #fff;
					font-weight: 400;
				}

				.middle {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 20rpx 0 20rpx;

					.money {
						font-size: 50rpx;
						color: #fff;
						font-weight: 700;
					}

					.top-up-btn-box {
						text {
							font-size: 24rpx;
							color: #667D8B;
							font-weight: 700;
							padding: 10rpx 30rpx;
							border-radius: 30rpx;
							background-color: #fff;
						}
					}
				}

				.bottom {
					font-size: 24rpx;
					color: #fff;
					font-weight: 400;
				}
			}
		}
	}

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

	.Commonly {
		margin: 30rpx 30rpx 30rpx 30rpx;
		border-radius: 10rpx;
		padding: 20rpx 30rpx;
		background-color: #fff;

		.CommonlyList {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.CommonlyBox {
				width: 150rpx;
				height: 90rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				text-align: center;
				padding-top: 30rpx;

				view {
					font-weight: 400;
					font-size: 24rpx;
					color: #1a1a1a;
				}
			}

			.CommonlyBox:nth-child(1) image {
				width: 36.64rpx;
				height: 40.41rpx;
			}

			.CommonlyBox:nth-child(2) image {
				width: 38.24rpx;
				height: 40.33rpx;
			}

			.CommonlyBox:nth-child(3) image {
				width: 37.18rpx;
				height: 39.11rpx;
			}

			.CommonlyBox:nth-child(4) image {
				width: 42.22rpx;
				height: 39.92rpx;
			}

			.CommonlyBox:nth-child(5) image {
				width: 42.95rpx;
				height: 39.54rpx;
			}

			.CommonlyBox:nth-child(6) image {
				width: 42.95rpx;
				height: 39.54rpx;
			}

			.CommonlyBox:nth-child(7) image {
				width: 42.95rpx;
				height: 39.54rpx;
			}

			.CommonlyBox:nth-child(8) image {
				width: 42.95rpx;
				height: 39.54rpx;
			}

			.CommonlyBox:nth-child(9) image {
				width: 40rpx;
				height: 40rpx;
			}
		}

		.CommonlyTitle {
			font-weight: bold;
			font-size: 28rpx;
			color: #1a1a1a;
		}
	}

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
				font-weight: 700;
				color: #1a1a1a;
			}

			.text2 {
				font-size: 24rpx;
				font-weight: 400;
				color: #999;
			}
		}

		.modelBox {
			display: flex;
			align-items: center;

			.modelBox2 {
				flex: 1;
				text-align: center;

				view {
					font-weight: 400;
					font-size: 24rpx;
					color: #333;
					margin-top: 8rpx;
				}
			}

			.modelBox2:nth-child(1) image {
				width: 42.35rpx;
				height: 39.61rpx;
			}

			.modelBox2:nth-child(2) image {
				width: 44.92rpx;
				height: 37.28rpx;
			}

			.modelBox2:nth-child(3) image {
				width: 41.64rpx;
				height: 38.56rpx;
			}

			.modelBox2:nth-child(4) image {
				width: 37.64rpx;
				height: 40.82rpx;
			}

			.modelBox2:nth-child(5) image {
				width: 47.03rpx;
				height: 39.26rpx;
			}
		}
	}

	page {
		height: 100%;
		background-color: #F1F1F1;
	}
</style>
