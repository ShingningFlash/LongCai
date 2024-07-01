<template>
	<view>
		<!-- 搜索框部分 -->
		<view class="top-search">
			<view class="top-search-icon">
				<image src="https://tm.ydlweb.com/icons/search.png" mode="widthFix"></image>
			</view>
			<input type="text" placeholder="请输入关键字" v-model.trim="keyword" @blur="search" />
		</view>
		<!-- tabs栏部分 -->
		<view class="orderTab">
			<scroll-view :scroll-x="true" :enable-flex='true'
				style="display: flex;justify-content: space-around;height: 70rpx;">
				<view class="tabBox" v-for="(item,index) in tabList" :key="index" @click="Setstatus(item.index)">
					<span :class=" tabIndex == item.index ? 'active' : '' ">{{item.name}}</span>
				</view>
			</scroll-view>
		</view>
		<!-- 订单列表展示部分 -->
		<view class="order-list-box">
			<view class="order-list-warp">
				<view class="order-list-item" v-for="(item,index) in orderRetundListData" :key='index'>
					<view class="order-list-item-top">
						<view class="order-list-item-top-left">
							<text>订单编号：{{item.order_sn}}</text>
						</view>
						<view class="order-list-item-top-right" v-if="tabIndex == 0">
							<text>待商家审核</text>
						</view>
						<view class="order-list-item-top-right" v-if="tabIndex == 1">
							<text>{{item.type_name}}</text>
						</view>
					</view>
					<!-- 订单产品部分 -->
					<view class="order-list-item-middle" v-for="(item1,index1) in item.goods_list" :key='index1'>
						<view class="order-list-item-middle-left">
							<image :src="item1.original_img" mode=""></image>
						</view>
						<view class="order-list-item-middle-right">
							<view class="order-list-item-middle-right-top">
								<view class="order-list-item-middle-right-top-name">
									<text>{{item1.goods_name}}</text>
								</view>
								<view class="order-list-item-middle-right-top-spac">
									<text>{{item1.spec_key_name}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="order-list-item-bottom">
						<!-- <view class="order-list-item-bottom-warp">
							<text class="text2" v-if="tabIndex == 0"
								@click="clickJump('/pages/afterSalesOrderList/afterSalesOrderList')">申请售后</text>
						</view> -->
						<view class="order-list-item-review-box" v-if="tabIndex == 1">
							<view class="order-list-item-review-warp"
								@click="clickJump('/pages/returnGoodsDetail/returnGoodsDetail?order_id='+item.order_id)">
								<!-- ============== -->
								<view class="order-list-item-review-left">
									<text v-if="item.status == -1">商家不同意</text>
									<text v-if="item.status == 0">商家审核中</text>
									<text v-if="item.status > 0 || item.status < 4 ">商家已同意</text>
								</view>
								<view class="order-list-item-review-right">
									<text v-if="item.status == -1">您的申请平台不同意，如有疑问请联系客服</text>
									<text v-if="item.status == 0">您的申请平台审核中，请留意信息</text>
									<text v-if="item.status > 0 || item.status < 4 ">您的申请平台已同意，请填写退换货资料</text>
								</view>
								<!-- =================== -->
							</view>
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
	import {
		OrderRetundList // 获取 退换货订单列表 接口
	} from '@/api/order.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				keyword: '', // 搜索关键字
				tabList: [{
						name: '售后申请',
						index: 0
					},
					{
						name: '处理中',
						index: 1
					},
					{
						name: '已完成',
						index: 2
					}
				],
				tabIndex: 0, // 状态栏标识 
				popupStatus: false, // 弹出框显示隐藏标识
				orderRetundListData: [], //退换货订单列表
			}
		},
		onLoad(option) {

		},
		onShow() {
			this.OrderRetundListFun(this.tabIndex)
		},
		methods: {
			// 退换货订单列表
			OrderRetundListFun(statusid) {
				this.orderRetundListData = []
				OrderRetundList({
					status: statusid,
				}, (res) => {
					if (res.status == 1) {
						console.log("退换货订单列表返回的数据res", res)
						if (res.status == 1) {
							this.orderRetundListData = res.result
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
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
				this.OrderRetundListFun(this.tabIndex)
			},
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

	// 订单列表展示部分
	.order-list-box {
		background-color: #fff;
		margin-top: 20rpx;
		padding: 0rpx 30rpx 0rpx;

		.order-list-warp {
			background-color: #f5f5f5;

			.order-list-item {
				background-color: #fff;
				margin-bottom: 20rpx;
				padding-top: 30rpx;

				.order-list-item-top {
					display: flex;
					justify-content: space-between;

					.order-list-item-top-left {
						font-size: 28rpx;
						font-weight: 400;
						color: #2e2e2e;
					}

					.order-list-item-top-right {
						font-size: 28rpx;
						font-weight: 400;
						color: #ff2d2d;
					}
				}

				// 订单产品部分
				.order-list-item-middle {
					display: flex;
					justify-content: space-between;
					padding: 20rpx 0 0;

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
					}
				}

				.order-list-item-bottom {
					.order-list-item-bottom-warp {
						display: flex;
						justify-content: flex-end;
						padding: 20rpx 0;

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

					.order-list-item-review-box {
						background-color: #fff;
						padding-bottom: 20rpx;
						border-radius: 12rpx;

						.order-list-item-review-warp {
							padding: 10rpx 0;
							display: flex;
							justify-content: space-between;
							background-color: #f5f5f5;

							.order-list-item-review-left {
								padding: 0rpx 25rpx;
								width: 180rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								border-right: 1rpx solid #ddd;

								text {
									font-size: 26rpx;
									font-weight: 400;
									color: #1e1e1e;
								}
							}

							.order-list-item-review-right {
								padding: 0rpx 25rpx;

								text {
									font-size: 20rpx;
									font-weight: 400;
									color: #666;
								}
							}
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
		bottom: 10rpx;
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
			display: flex;
			justify-content: space-around;
			font-size: 28rpx;
			font-weight: 400;
			color: #2e2e2e;
			flex-shrink: 0;

			span {
				position: relative;
			}
		}
	}

	// 搜索框部分
	.top-search {
		position: relative;
		margin: 0 auto;
		padding: 0 20rpx;
		height: 54rpx;
		border-radius: 50rpx;
		overflow: hidden;
		display: flex;
		align-items: center;
		background-color: #fff;

		.top-search-icon {
			width: 54rpx;
			height: 54rpx;
			padding-left: 20rpx;
			overflow: hidden;
			position: absolute;
			top: 0;
			left: 0;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				width: 28rpx;
				height: 28rpx;
			}
		}

		input {
			width: 100%;
			height: 100%;
			line-height: 54rpx;
			border-radius: 50rpx;
			background-color: #f1f1f1;
			font-size: 24rpx;
			color: #999999;
			padding: 0 20rpx 0 60rpx;
			box-sizing: border-box;
		}
	}
</style>
