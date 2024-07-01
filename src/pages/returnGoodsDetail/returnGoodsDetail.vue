<template>

	<view class="details">
		<view class="backImg">
			<image src="https://tm.ydlweb.com/icons/bg.png"></image>
		</view>
		<view class="Top">
			<view class="text">{{returnGoodsData.refund.status_name}}</view>
			<view class="statusList">
				<view class="statusBox">
					<view class="notselect select"></view>
					<view>提交申请</view>
				</view>

				<view class="statusBox">
					<view class="notselect select"></view>
					<view>商家审核</view>
				</view>
				<!-- -2用户取消-1不同意0待审核1通过2已发货3已收货4换货完成5退款完成 -->

				<view class="statusBox" v-if='returnGoodsData.refund.type == 1'>
					<view class="notselect select"></view>
					<view>退货</view>
				</view>
				<view class="statusBox" v-if='returnGoodsData.refund.type == 2'>
					<view class="notselect select"></view>
					<view>换货</view>
				</view>

				<!-- <view class="statusBox">
					<view class="notselect"></view>
					<view>商家发货</view>
				</view> -->

				<view class="statusBox">
					<view class="notselect"></view>
					<view>完成</view>
				</view>
			</view>
		</view>

		<!-- <view class="status" @click="clickJump('/pages/serviceDetail/serviceDetail')"> -->
		<view class="status">
			<!-- === -->
			<view class="left" v-if="returnGoodsData.refund.status==-1">
				<view class="name">商家不同意</view>
				<view class="name2">商家不同意申请，请联系联系客服</view>
			</view>
			<view class="left" v-if="returnGoodsData.refund.status==1">
				<view class="name">商家已同意</view>
				<view class="name2">商家已经通过审核，请及时填写退换货的物流单号</view>
			</view>
			<view class="left" v-if="returnGoodsData.refund.status >1">
				<view class="name">商家正在处理</view>
				<view class="name2">商家正在处理，请留意信息</view>
			</view>
			<!-- === -->
			<!-- <image src="../../static/icons/righticon.png"></image> -->
		</view>

		<view class="commodity">
			<view class="commodityTitle">商品信息</view>
			<view class="commodityitem" v-for="(item,index) in returnGoodsData.order.goodslist">
				<image :src="item.original_img"></image>
				<view class="text">
					<view>
						<view class="name">{{item.goods_name}}</view>
						<view class="spec">{{item.spec_key_name}}</view>
					</view>
					<view class="num">
						<view>￥<text>{{item.goods_price}}</text></view>
						<view>×{{item.goods_num}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="logistics" v-if="returnGoodsData.refund.status > 1">
			<image src="https://tm.ydlweb.com/icons/fhdz.png" class="left"></image>
			<view class="logisticstext">
				<view class="logisticsname">
					[{{shippingData.expName}}]的业务员{{shippingData.courier}}（{{shippingData.courierPhone}}）正在派件</view>
				<view class="logisticstime">{{shippingData.list[0].time}}</view>
			</view>
			<image src="https://tm.ydlweb.com/icons/arrow-right.png" class="right"></image>
		</view>

		<view class="model">
			<view class="modelItem1">
				<view class="modelBox">
					<view class="left">订单编号:</view>
					<view class="right">{{returnGoodsData.refund.order_sn}}</view>
				</view>
				<view class="modelBox">
					<view class="left">申请时间:</view>
					<view class="right">{{returnGoodsData.refund.addtime}}</view>
				</view>
			</view>
			<view class="modelItem2">
				<view class="modelBox">
					<view class="left">服务类型:</view>
					<!-- <view class="right" v-if="returnGoodsData.refund.type == 0">仅退款</view> -->
					<view class="right" v-if="returnGoodsData.refund.type == 1">退货</view>
					<!-- <view class="right">微信支付</view> -->
					<view class="right" v-if="returnGoodsData.refund.type == 2">换货</view>
				</view>
				<view class="modelBox">
					<view class="left">申请时间:</view>
					<view class="right">{{returnGoodsData.refund.addtime}}</view>
				</view>
				<view class="modelBox">
					<view class="left">退款方式:</view>
					<view class="right">原返</view>
				</view>
			</view>

			<view class="modelItem3">
				<view class="modelBox" v-if="returnGoodsData.refund.status>1">
					<view class="left">商品退回</view>
					<view class="right">{{returnGoodsData.delivery.express_name}}</view>
				</view>
				<view class="modelBox" v-if="returnGoodsData.refund.status>1">
					<view class="left">退货单号</view>
					<view class="right">{{returnGoodsData.delivery.express_sn}}</view>
				</view>
				<view class="modelBox" v-if="returnGoodsData.refund.type == 1 || returnGoodsData.refund.type == 2">
					<view class="left">商家信息:</view>
					<view class="right">
						<view>{{returnGoodsData.refund.return_address}}</view>
					</view>
				</view>
				<view class="modelBox" v-if="returnGoodsData.refund.type == 2">
					<view class="left">收货信息:</view>
					<view class="right">
						<view>{{returnGoodsData.order.consignee}} {{returnGoodsData.order.mobile}}</view>
						<view>
							{{returnGoodsData.order.province}}{{returnGoodsData.order.city}}{{returnGoodsData.order.district}}{{returnGoodsData.order.address}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn-box" v-if="returnGoodsData.refund.status==1">
			<view class="btn-warp"
				@click="clickJump('/pages/fillNumber/fillNumber?return_id='+returnGoodsData.refund.id)">
				<text>填写退换货物流号</text>
			</view>
		</view>
		<view class="btn-box" v-if="returnGoodsData.refund.status==3">
			<view class="btn-warp" @click="ConfirmChangeFun(returnGoodsData.refund.id)">
				<text>确认收货</text>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		RefundOrderInfo, // 售后订单详情 接口
		GetShippingData, // 查询物流 接口
		ConfirmChange // 确认换货完成 接口
	} from '@/api/order.js'
	export default {
		data() {
			return {
				user_id: null, //用户id
				return_id: null, //退货订单id
				returnGoodsData: {}, // 退换货订单数据
				shippingData: {}, // 物流信息数据
			}
		},
		onLoad(option) {
			this.RefundOrderInfoFun(option.order_id)
		},
		methods: {
			// 查询物流
			GetShippingDataFun(expressSn) {
				GetShippingData({
					express_sn: expressSn
				}, (res) => {
					console.log('物流信息res', res)
					if (res.status == 1) {
						this.shippingData = res.result
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}

				})
			},
			// 确认换货完成
			ConfirmChangeFun(refundid) {
				ConfirmChange({
					return_id: refundid
				}, (res) => {
					if (res.status == 1) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						setTimeout((item) => {
							uni.redirectTo({
								url: '/pages/afterSalesOrder/afterSalesOrder'
							})
						}, 1000)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 售后订单详情
			RefundOrderInfoFun(orderid) {
				RefundOrderInfo({
					order_id: orderid
				}, (res) => {
					if (res.status == 1) {
						this.returnGoodsData = res.result
						if (this.returnGoodsData.refund.status > 1) {
							this.GetShippingDataFun(this.orderData.express_sn)
						}
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











			// =====================
			// 物流信息
			async getShippingFun() {
				var _this = this

				if (!this.userOrderInfo.express_sn) {
					console.log('没有物流单号')
					return;
				}

				var res = await postData('post', {
					url: '/mini/ApiConnect/getShippingData',
					data: {
						user_id: _this.user_id,
						express_sn: _this.returnGoodsData.delivery.express_sn
					}
				})
				// console.log('查询物流信息返回的数据',res)
				if (res.data.status == 1) {
					this.shippingData = res.data.result
					console.log('查询物流信息返回的数据', this.shippingData)
				} else {
					uni.showToast({
						title: res.data.msg,
						icon: 'none',
					})
				}
			},
			// 跳转到填写退货单号页面
			fillNumber(returnid) {
				uni.navigateTo({
					url: '/pages/submitapply/submitapply?return_id=' + returnid
				});
			},
			// 获取退货换货的订单详情数据
			async refundOrderInfoFun() {
				var _this = this
				var res = await postData('post', {
					url: '/mini/ApiConnect/refundOrderInfo',
					data: {
						user_id: _this.user_id,
						return_id: _this.return_id
					}
				})
				// console.log('退换货订单详情返回的数据',res)
				if (res.data.status == 1) {
					this.returnGoodsData = res.data.result
					console.log('退换货订单详情返回的数据', this.returnGoodsData)
					if (this.returnGoodsData.status >= 2) {
						this.getShippingFun()
					}
				} else {
					uni.showToast({
						title: res.data.msg,
						icon: "none"
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
						// uni.redirectTo({
						// 	url: '/pages/returngoods/returngoods'
						// });
					}, 1000)
				}
			},
		}
	}
</script>
<style lang="scss">
	.model {
		border-radius: 15rpx;
		background-color: #fff;
		margin: 0rpx 30rpx;
		padding: 30rpx;

		.modelItem1 {
			margin-bottom: 48rpx;
		}

		.modelItem2 {
			padding-bottom: 30rpx;
			margin-bottom: 50rpx;
			border-bottom: 1rpx solid #DDDDDD;
		}

		.modelBox {
			display: flex;
			padding-bottom: 20rpx;

			.left {
				width: 130rpx;
				font-weight: 400;
				font-size: 24rpx;
				color: #7e7e7e;
			}

			.right {
				flex: 1;
				font-weight: bold;
				font-size: 24rpx;
				color: #1e1e1e;
			}
		}
	}

	.logistics {
		border-radius: 15rpx;
		background-color: #fff;
		margin: 0rpx 30rpx 30rpx 30rpx;
		display: flex;
		padding: 20rpx;

		.left {
			width: 25rpx;
			height: 25rpx;
			margin-top: 10rpx;
			margin-right: 20rpx;
		}

		.right {
			width: 25rpx;
			height: 25rpx;
			margin-top: 10rpx;
		}

		.logisticstext {
			flex: 1;

			.logisticsname {
				font-weight: bold;
				font-size: 24rpx;
				color: #1e1e1e;
			}

			.logisticstime {
				padding-top: 15rpx;
				font-weight: 400;
				font-size: 24rpx;
				color: #7e7e7e;
			}
		}
	}

	.commodity {
		border-radius: 10rpx;
		background-color: #fff;
		margin: 0rpx 30rpx 30rpx 30rpx;
		border-radius: 15rpx;
		padding: 20rpx;

		.commodityTitle {
			font-weight: 400;
			font-size: 28rpx;
			color: #1e1e1e;
		}

		.commodityitem {
			display: flex;
			margin-top: 20rpx;

			image {
				width: 210rpx;
				height: 170rpx;
				border-radius: 6rpx;
				margin-right: 20rpx;
			}

			.text {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.name {
					font-weight: 400;
					font-size: 26rpx;
					color: #2e2e2e;
				}

				.spec {
					padding-top: 15rpx;
					font-weight: 400;
					font-size: 20rpx;
					color: #666;
				}
			}

			.num {
				display: flex;
				align-items: center;
				justify-content: space-between;

				view:nth-child(1) {
					font-weight: 700;
					font-size: 24rpx;
					color: #ff2d2d;

					text {
						font-size: 32rpx;
					}
				}

				view:nth-child(2) {
					font-weight: 400;
					font-size: 24rpx;
					color: #7e7e7e;
				}
			}
		}
	}

	.status {
		background-color: #fff;
		margin: 0rpx 30rpx 30rpx 30rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx;

		image {
			width: 25rpx;
			height: 25rpx;
		}

		.name {
			font-weight: bold;
			font-size: 26rpx;
			color: #1e1e1e;
		}

		.name2 {
			padding-top: 15rpx;
			font-weight: 400;
			font-size: 20rpx;
			color: #666;
		}
	}

	.Top {
		padding: 30rpx 50rpx;

		.text {
			font-weight: 400;
			font-size: 32rpx;
			;
			color: #fff;
		}

		.statusList {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 20rpx;

			.statusBox {
				flex: 1;
				position: relative;

				.notselect {
					width: 20rpx;
					height: 20rpx;
					border: 4rpx solid #fff;
					border-radius: 50%;
				}

				.select {
					position: relative;
					background-color: #fff;
				}

				.select::after {
					content: ' ';
					position: absolute;
					display: inline-block;
					width: 10rpx;
					height: 5rpx;
					border-width: 0 0 2px 2px;
					overflow: hidden;
					border-color: #667D8B;
					border-style: solid;
					-webkit-transform: rotate(-45deg);
					transform: rotate(-45deg);
					left: calc(50% - 7rpx);
					top: 2px;
				}

				view:nth-child(2) {
					font-weight: 400;
					font-size: 20rpx;
					color: #fff;
					margin-top: 10rpx;
				}
			}

			.statusBox::after {
				content: "";
				position: absolute;
				top: 10rpx;
				left: 30rpx;
				width: 77%;
				height: 4rpx;
				background-color: #fff;
			}

			.statusBox:last-child::after {
				display: none;
			}
		}
	}

	.details {
		.backImg {
			position: fixed;
			top: -50rpx;
			width: 100%;
			height: 300rpx;
			z-index: -1;

			image {
				width: 120%;
				height: 100%;
			}
		}

		.btn-box {
			padding: 0rpx 30rpx;
			margin-bottom: 30rpx;

			.btn-warp {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 20rpx 0;
				border-radius: 12rpx;
				background-color: #667D8B;
				width: 100%;
				font-size: 36rpx;
				font-weight: 400;
				color: #fff;
			}
		}
	}

	page {
		height: 100%;
		background-color: #f5f5f5;
	}
</style>
