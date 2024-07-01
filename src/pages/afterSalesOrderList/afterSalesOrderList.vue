<template>
	<view>
		<!-- 售后商品卡片部分 -->
		<view class="order-list-box">
			<view class="order-list-warp">
				<view class="order-list-item" v-for="(item,index) in 3" :key='index'>
					<view class="order-list-item-middle">
						<view class="order-list-item-middle-left">
							<image src="../../static/images/goodspopup1.png" mode=""></image>
						</view>
						<view class="order-list-item-middle-right">
							<view class="order-list-item-middle-right-top">
								<view class="order-list-item-middle-right-top-name">
									<text>画册印刷企业宣传册制作样本产品图册</text>
								</view>
								<view class="order-list-item-middle-right-top-spac">
									<text>A4尺寸，300克铜版纸</text>
								</view>
							</view>
							<view class="order-list-item-middle-right-bottom">
								<view class="order-list-item-middle-right-bottom-price">
									￥<text>39.00</text>
								</view>
								<view class="order-list-item-middle-right-bottom-number">
									<text>x1</text>
								</view>
							</view>
						</view>
					</view>
					<view class="order-list-item-bottom">
						<view class="order-list-item-bottom-warp" @click="openPopupFun">
							<text class="text1">申请售后</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部弹出框部分 -->
		<view class="popup" v-if="popupStatus">
			<view class="popupFlex">
				<view class="popupFlex-top-box">
					<view class="title">
						请选择售后类型
					</view>
					<view class="close-icon-box" @click="closePopupFun">
						<image src="https://tm.ydlweb.com/icons/del.png" mode=""></image>
					</view>
				</view>

				<view class="commodity">
					<image src="../../static/images/goodspopup1.png"></image>
					<view class="text">
						<view>
							<view class="name">画册印刷企业宣传册制作样本产品图册</view>
							<view class="spec">A4尺寸，300克铜版纸</view>
						</view>
						<view class="spec2">单价 ￥39.00<text>数量 1</text></view>
					</view>
				</view>
				<view class="model" @click="clickJump('/pages/returnGoods/returnGoods')">
					<view class="left">
						<image src="https://tm.ydlweb.com/icons/tuiicon.png"></image>
						<view>退货</view>
					</view>
					<view class="right">
						<view>退回您收到的商品</view>
						<image src="https://tm.ydlweb.com/icons/righticon.png"></image>
					</view>
				</view>
				<view class="model" @click="clickJump('/pages/exchangeGoods/exchangeGoods')">
					<view class="left">
						<image src="https://tm.ydlweb.com/icons/huanicon.png"></image>
						<view>换货</view>
					</view>
					<view class="right">
						<view>退换您收到的商品</view>
						<image src="https://tm.ydlweb.com/icons/righticon.png"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popupStatus: false, // 弹出框显示隐藏标识
			}
		},
		methods: {
			// 打开弹出框
			openPopupFun() {
				this.popupStatus = true
			},
			// 关闭弹出框
			closePopupFun() {
				this.popupStatus = false
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
	// 底部弹出框部分

	.popup {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column-reverse;

		.popupFlex {
			height: 894rpx;
			border-radius: 20rpx 20rpx 0 0;
			background: #fff;
			padding: 0rpx 30rpx;

			.popupFlex-top-box {
				display: flex;
				align-items: center;

				.title {
					flex: 1;
					font-weight: bold;
					font-size: 30rpx;
					color: #1e1e1e;
					text-align: center;
					padding: 24rpx 0rpx;
				}

				.close-icon-box {
					display: flex;
					justify-content: center;
					align-items: center;
					padding-left: 30rpx;
					width: 30rpx;
					height: 30rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}



			.commodity {
				display: flex;
				align-items: center;

				image {
					width: 170rpx;
					height: 170rpx;
					border-radius: 6rpx;
					margin-right: 20rpx;
				}

				.text {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					height: 170rpx;

					.name {
						font-weight: 400;
						font-size: 26rpx;
						color: #1e1e1e;
					}

					.spec {
						font-weight: 400;
						font-size: 24rpx;
						color: #7e7e7e;
					}

					.spec2 {
						font-weight: 400;
						font-size: 24rpx;
						color: #1e1e1e;

						text {
							padding-left: 20rpx;
						}
					}
				}
			}

			.model {
				height: 100rpx;
				border-radius: 15rpx;
				background: #f5f5f5;
				margin-top: 40rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0rpx 20rpx;

				.left {
					display: flex;
					align-items: center;

					image {
						width: 60rpx;
						height: 56rpx;
						margin-right: 10rpx;
					}

					view {
						font-weight: 400;
						font-size: 40rpx;
						color: #1e1e1e;
					}
				}

				.right {
					display: flex;
					align-items: center;

					image {
						width: 25rpx;
						height: 25rpx;
					}

					view {
						font-weight: 400;
						font-size: 24rpx;
						color: #7e7e7e;
						margin-right: 10rpx;
					}
				}
			}
		}
	}

	// 售后商品卡片部分
	.order-list-box {
		background-color: #fff;
		margin-top: 20rpx;
		padding: 0rpx 30rpx 0rpx;

		.order-list-warp {
			background-color: #f5f5f5;

			.order-list-item {
				box-shadow: 5rpx 8rpx 10rpx rgba($color: #6d6d6d, $alpha: 0.2);
				margin-bottom: 20rpx;
				padding-top: 30rpx;
				border-radius: 10rpx;

				// 订单产品部分
				.order-list-item-middle {
					display: flex;
					justify-content: space-between;
					padding: 0rpx 20rpx 0;

					.order-list-item-middle-left {
						width: 210rpx;
						height: 170rpx;

						image {
							border-radius: 5rpx;
							width: 100%;
							height: 100%;
						}
					}

					.order-list-item-middle-right {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						padding-left: 20rpx;

						.order-list-item-middle-right-top {
							.order-list-item-middle-right-top-name {
								font-size: 26rpx;
								font-weight: 400;
								color: #2e2e2e;
							}

							.order-list-item-middle-right-top-spac {
								padding-top: 10rpx;
								font-size: 20rpx;
								font-weight: 400;
								color: #666;
							}
						}

						.order-list-item-middle-right-bottom {
							display: flex;
							justify-content: space-between;

							.order-list-item-middle-right-bottom-price {
								font-size: 24rpx;
								font-weight: 700;
								color: #111;

								text {
									font-size: 32rpx;
								}
							}

							.order-list-item-middle-right-bottom-number {
								font-size: 24rpx;
								font-weight: 400;
								color: #7e7e7e;
							}
						}
					}
				}

				.order-list-item-bottom {
					.order-list-item-bottom-warp {
						display: flex;
						justify-content: flex-end;
						padding: 20rpx 20rpx 20rpx 0;

						.text1 {
							padding: 10rpx 44rpx;
							background-color: #667D8B;
							font-size: 24rpx;
							font-weight: 400;
							color: #fff;
							border-radius: 30rpx;
						}

						.text2 {
							margin-right: 20rpx;
							border: 2rpx solid #9e9e9e;
							padding: 8rpx 42rpx;
							background-color: #fff;
							font-size: 24rpx;
							font-weight: 400;
							color: #3E3E3E;
							border-radius: 30rpx;
						}
					}
				}
			}
		}
	}
</style>
