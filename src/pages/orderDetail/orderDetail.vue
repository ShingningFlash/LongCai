<template>
	<view>
		<!-- 顶部部分 -->
		<view class="order-detail-box">
			<view class="order-detail-warp">
				<!-- 顶部状态部分 -->
				<view class="order-detail-warp-top">
					<view class="order-detail-warp-top-top">
						<text>{{orderData.status_name}}</text>
					</view>
					<view class="order-detail-warp-top-bottom">
						<text v-if="orderData.orderinfo.type == 1">您的订单未付款，请前去支付。</text>
						<text v-if="orderData.orderinfo.type == 2">您的订单正在发货，请留意信息。</text>
						<text v-if="orderData.orderinfo.type == 3">您的订单已经发货，请留意签收。</text>
						<text v-if="orderData.orderinfo.type == 4">您的订单已经完成，感谢你的购买。</text>
						<text v-if="orderData.orderinfo.type == 5">您的订单已经完成，请留意信息。</text>
					</view>
				</view>
				<!-- 地址、物流部分 -->
				<view class="order-detail-address-box">
					<!-- 快递部分start -->
					<view class="order-detail-address-warp" v-if="orderData.ship_type == 1">
						<view class="order-detail-address-warp-top"
							v-if="orderData.orderinfo.type == 3 || orderData.orderinfo.type == 4"
							@click="clickJump('/pages/logistics/logistics?express_sn='+orderData.express_sn+'&order_id='+order_id)">
							<view class="order-detail-address-warp-top-left">
								<view class="left-img">
									<image src="https://tm.ydlweb.com/icons/userorder.png" mode=""></image>
								</view>
								<view class="right-tips-box">
									<view class="right-tips">
										<text>
											[{{shippingData.expName}}]的业务员正在派件</text>
										<!-- <text>
											[{{shippingData.expName}}]的业务员{{shippingData.courier}}（{{shippingData.courierPhone}}）正在派件</text> -->
									</view>
									<view class="right-tips-time">
										<text>{{shippingData.list[0].time}}</text>
									</view>
								</view>
							</view>
							<view class="order-detail-address-warp-top-right">
								<view class="img">
									<image src="https://tm.ydlweb.com/icons/arrow-right.png" mode=""></image>
								</view>
							</view>
						</view>
						<view class="order-detail-address-warp-bottom">
							<view class="order-detail-address-warp-bottom-left">
								<view class="left-img">
									<image src="https://tm.ydlweb.com/icons/useraddress.png" mode=""></image>
								</view>
								<view class="right-tips-box">
									<view class="right-tips">
										<text>{{orderData.consignee}}</text><text>{{orderData.mobile}}</text>
									</view>
									<view class="right-tips-time">
										<text>地址：{{orderData.province}}{{orderData.city}}{{orderData.district}}{{orderData.address}}</text>
									</view>
								</view>
							</view>
							<view class="order-detail-address-warp-bottom-right">
								<view class="img">
								</view>
							</view>
						</view>
					</view>
					<!-- 快递部分end -->
					<!-- 自提部分start -->
					<view class="order-detail-Since-warp" v-else>
						<view class="order-detail-Since-top">
							<view class="order-detail-Since-top-warp">
								<text class="text1">提货人：</text>
								<text class="text2">{{orderData.consignee}}</text>
								<text class="text3">{{orderData.mobile}}</text>
							</view>
						</view>
						<view class="order-detail-Since-bottom">
							<view class="order-detail-Since-bottom-left">
								<view class="stores-name">自提点：{{orderData.storeArr.store_name}}</view>
								<view class="stores-address">{{orderData.storeArr.address}}</view>
								<!-- <view class="stores-tips">温馨提示：该门店营业时间为{{orderData.storeArr.open_time}}</view> -->
								<view class="stores-tips">营业时间：{{orderData.storeArr.open_time}}</view>
							</view>
							<view class="order-detail-Since-bottom-right"
								@click="navigationStoreFun(orderData.storeArr.latitude,orderData.storeArr.longitude)">
								<view class="navigation-text">导航到店</view>
							</view>
						</view>
					</view>
					<!-- 自提部分end -->
				</view>
				<!-- 订单商品列表部分 -->
				<view class="order-detail-list-box">
					<view class="order-detail-list-warp">
						<view class="order-list-item-middle" v-for="(item1,index1) in orderGoodsData" :key='index1'>
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
								<view class="order-list-item-middle-right-bottom">
									<view class="order-list-item-middle-right-bottom-price">
										￥<text>{{item1.goods_price}}</text>
									</view>
									<view class="order-list-item-middle-right-bottom-number">
										<text>x{{item1.goods_num}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 订单信息部分 -->
				<view class="order-msg-box">
					<view class="order-msg-warp">
						<view class="order-msg-warp-top">

							<view class="order-msg-warp-top-top">
								<view class="order-msg-warp-top-top-top">
									<text class="text1">订单编号：</text><text class="text2">{{orderData.order_sn}}</text>
								</view>
								<view class="order-msg-warp-top-top-bottom">
									<text class="text1">下单时间：</text><text class="text2">{{orderData.add_time}}</text>
								</view>
							</view>

							<view class="order-msg-warp-top-middle" v-if="orderData.pay_status==1">
								<view class="order-msg-warp-top-middle-top">
									<text class="text1">支付方式：</text>
									<text class="text2">{{orderData.orderinfo.pay_name}}</text>
									<!-- <text class="text2">微信支付</text> -->
								</view>
								<view class="order-msg-warp-top-middle-bottom">
									<text class="text1">支付时间：</text><text
										class="text2">{{orderData.orderinfo.pay_time}}</text>
								</view>
							</view>

							<view class="order-msg-warp-top-bottom"
								v-if="(orderData.orderinfo.type == 3 || orderData.orderinfo.type == 4) && orderData.ship_type == 1">
								<view class="order-msg-warp-top-bottom-top">
									<text class="text1">配送快递：</text>
									<text class="text2">{{orderData.shipping_name}}</text>
								</view>
								<view class="order-msg-warp-top-bottom-bottom">
									<text class="text1">快递单号：</text><text class="text2">{{orderData.express_sn}}</text>
								</view>
							</view>
						</view>

						<view class="order-msg-warp-bottom">
							<view class="order-msg-warp-bottom-top">
								<view class="order-msg-warp-bottom-top-left">
									<text class="text1">商品总额：</text><text
										class="text2">￥{{orderData.total_amount}}</text>
								</view>
								<view class="order-msg-warp-bottom-top-right">
									<text class="text1">运费：</text>
									<text class="text2">包邮</text>
									<!-- <text class="text2">{{orderData.orderinfo.shipping_price}}</text> -->
								</view>
							</view>
							<view class="order-msg-warp-bottom-bottom">
								<view class="order-msg-warp-bottom-warp">
									实付款：<text>￥{{orderData.order_amount}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 底部按钮部分 -->
				<view class="order-list-item-bottom">
					<view class="order-list-item-bottom-warp">
						<text class="text2"
							v-if="orderData.orderinfo.type == 4 || orderData.orderinfo.type == 5">再次购买</text>
						<text class="text2" v-if="orderData.orderinfo.type == 3"
							@click.stop="clickJump('/pages/afterSalesOrder/afterSalesOrder')">申请售后</text>
						<!-- <text class="text2" v-if="orderData.orderinfo.type == 1 || orderData.orderinfo.type == 2"
							@click.stop="AllOrderOutFun(orderData.orderinfo.order_id)">取消订单</text> -->
						<text class="text1" v-if="orderData.orderinfo.type == 1"
							@click.stop="MiniPayOrderFun(orderData.orderinfo.order_id)">去支付</text>
						<text class="text1" v-if="orderData.orderinfo.type == 2 || orderData.orderinfo.type == 3"
							@click.stop="UserOrderAffirmFun(orderData.orderinfo.order_id)">确认收货</text>
						<text class="text1" v-if="orderData.orderinfo.type == 4"
							@click.stop="clickJumpEvaluation(orderData)">去评价</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		UserOrderInfo, // 订单详情 接口
		AllOrderOut, // 取消订单 接口
		UserOrderAffirm, // 确认收货 接口
		MiniPayOrder, // 微信支付 接口
		Payment, // 调起微信支付 接口
		GetShippingData // 查询物流 接口
	} from '@/api/order.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				// flag: 0, // 快递0   自提1
				orderData: {}, // 订单详情数据
				orderGoodsData: [], // 订单商品列表数据
				order_id: null, // 订单id
				shippingData: {}, // 物流信息数据
			}
		},
		onLoad(option) {
			if (option.order_id) {
				this.order_id = option.order_id
				this.UserOrderInfoFun(option.order_id)
			}
		},
		methods: {
			// 导航到店按钮事件
			navigationStoreFun(lat, lon) {
				uni.openLocation({
					latitude: parseFloat(lat),
					longitude: parseFloat(lon),
					success: function() {
						// console.log('success');
					}
				});
			},
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
			// 获取订单详情数据
			UserOrderInfoFun(orderid) {
				UserOrderInfo({
					order_id: orderid
				}, (res) => {
					// console.log('订单详情返回的数据res', res)
					if (res.status == 1) {
						this.orderData = res
						this.orderGoodsData = res.goodslist
						if (this.orderData.express_sn) {
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
			// 去支付 事件
			MiniPayOrderFun(orderid) {
				MiniPayOrder({
					order_id: orderid,
					openid: uni.getStorageSync('openid')
				}, (res) => {
					if (res.status == 1) {
						// 调起微信支付
						Payment(res.payinfo, (res2) => {
							if (res2.status == 1) {
								this.UserOrderInfoFun(this.order_id)
							} else {
								uni.showToast({
									title: res.msg,
									icon: 'none'
								})
							}
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 确认收货 事件
			UserOrderAffirmFun(orderid) {
				uni.showModal({
					title: '是否确定商品无损坏',
					success: (res) => {
						if (res.confirm) {
							UserOrderAffirm({
								order_id: orderid
							}, (res1) => {
								if (res1.status == 1) {
									uni.showToast({
										title: res1.msg,
										icon: 'none'
									})
									setTimeout((item) => {
										this.UserOrderInfoFun(this.order_id)
									}, 1000)
								} else {
									uni.showToast({
										title: res1.msg,
										icon: 'none'
									})
								}
							})
						}
					}
				})
			},
			// 取消订单 事件
			AllOrderOutFun(orderid) {
				uni.showModal({
					title: '是否确定取消该订单',
					success: (res) => {
						if (res.confirm) {
							AllOrderOut({
								order_id: orderid
							}, (res1) => {
								if (res1.status == 1) {
									uni.showToast({
										title: res1.msg,
										icon: 'none'
									})
									setTimeout((item) => {
										this.UserOrderInfoFun(this.order_id)
									}, 1000)
								} else {
									uni.showToast({
										title: res1.msg,
										icon: 'none'
									})
								}
							})
						}
					}
				})
			},
			// 跳转到评价列表页还是提交页
			clickJumpEvaluation(obj) {
				let goodsObj = JSON.stringify(obj)
				// if (obj.goodslist.length > 1) {
				// 	uni.navigateTo({
				// 		url: '/pages/evaluationList/evaluationList?goodsObj=' + goodsObj
				// 	})
				// } else {
				uni.navigateTo({
					url: '/pages/evaluationSubmit/evaluationSubmit?goodsObj=' + goodsObj
				})
				// }

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
	// 底部按钮部分
	.order-list-item-bottom {
		padding: 5rpx 48rpx 20rpx;
		background-color: #fff;

		.order-list-item-bottom-warp {
			display: flex;
			justify-content: flex-end;
			padding: 20rpx 0;

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

	// 订单信息部分
	.order-msg-box {
		background-color: #fff;
		padding: 26rpx 48rpx;
		margin: 20rpx 0;

		.order-msg-warp {
			.order-msg-warp-top {
				padding-bottom: 30rpx;
				border-bottom: 1rpx solid #ddd;

				.order-msg-warp-top-top {
					padding-bottom: 25rpx;

					.order-msg-warp-top-top-top {
						padding-bottom: 10rpx;

						.text1 {
							font-size: 24rpx;
							font-weight: 400;
							color: #7e7e7e;
						}

						.text2 {
							font-size: 24rpx;
							font-weight: 700;
							color: #1e1e1e;
						}
					}

					.order-msg-warp-top-top-bottom {
						.text1 {
							font-size: 24rpx;
							font-weight: 400;
							color: #7e7e7e;
						}

						.text2 {
							font-size: 24rpx;
							font-weight: 700;
							color: #1e1e1e;
						}
					}
				}

				.order-msg-warp-top-middle {
					padding-bottom: 25rpx;

					.order-msg-warp-top-middle-top {
						padding-bottom: 10rpx;

						.text1 {
							font-size: 24rpx;
							font-weight: 400;
							color: #7e7e7e;
						}

						.text2 {
							font-size: 24rpx;
							font-weight: 700;
							color: #1e1e1e;
						}
					}

					.order-msg-warp-top-middle-bottom {

						.text1 {
							font-size: 24rpx;
							font-weight: 400;
							color: #7e7e7e;
						}

						.text2 {
							font-size: 24rpx;
							font-weight: 700;
							color: #1e1e1e;
						}
					}
				}

				.order-msg-warp-top-bottom {
					padding-bottom: 25rpx;

					.order-msg-warp-top-bottom-top {
						padding-bottom: 10rpx;

						.text1 {
							font-size: 24rpx;
							font-weight: 400;
							color: #7e7e7e;
						}

						.text2 {
							font-size: 24rpx;
							font-weight: 700;
							color: #1e1e1e;
						}
					}

					.order-msg-warp-top-bottom-bottom {
						.text1 {
							font-size: 24rpx;
							font-weight: 400;
							color: #7e7e7e;
						}

						.text2 {
							font-size: 24rpx;
							font-weight: 700;
							color: #1e1e1e;
						}
					}
				}
			}

			.order-msg-warp-bottom {
				padding: 30rpx 0rpx 20rpx;

				.order-msg-warp-bottom-top {
					padding-bottom: 15rpx;

					.order-msg-warp-bottom-top-left {
						display: flex;
						justify-content: space-between;
						padding-bottom: 10rpx;

						.text1 {
							font-size: 24rpx;
							font-weight: 400;
							color: #7e7e7e;
						}

						.text2 {
							font-size: 24rpx;
							font-weight: 700;
							color: #1e1e1e;
						}
					}

					.order-msg-warp-bottom-top-right {
						display: flex;
						justify-content: space-between;

						.text1 {
							font-size: 24rpx;
							font-weight: 400;
							color: #7e7e7e;
						}

						.text2 {
							font-size: 24rpx;
							font-weight: 700;
							color: #1e1e1e;
						}
					}
				}

				.order-msg-warp-bottom-bottom {
					display: flex;
					justify-content: flex-end;

					.order-msg-warp-bottom-warp {
						font-size: 24rpx;
						font-weight: 700;
						color: #1e1e1e;

						text {
							font-size: 30rpx;
							font-weight: 700;
							color: #ff2d2d;
						}
					}
				}
			}
		}
	}

	// 顶部部分
	.order-detail-box {
		.order-detail-warp {
			background-color: #f5f5f5;

			// 顶部状态部分
			.order-detail-warp-top {
				background-color: #667D8B;
				padding: 0rpx 50rpx 30rpx;
				font-weight: 400;
				color: #fff;

				.order-detail-warp-top-top {
					font-size: 32rpx;
					padding-bottom: 10rpx;
				}

				.order-detail-warp-top-bottom {
					font-size: 24rpx;
				}
			}

			// 地址、物流部分
			.order-detail-address-box {
				background-color: #fff;
				padding: 25rpx 30rpx;

				// 快递部分
				.order-detail-address-warp {
					.order-detail-address-warp-top {
						display: flex;
						justify-content: space-between;
						padding-bottom: 26rpx;

						.order-detail-address-warp-top-left {
							flex: 1;
							display: flex;

							.left-img {
								width: 24.4rpx;
								height: 28rpx;

								image {
									width: 100%;
									height: 100%;
								}
							}

							.right-tips-box {
								flex: 1;
								padding-left: 17rpx;

								.right-tips {
									font-size: 24rpx;
									font-weight: 700;
									color: #1e1e1e;
								}

								.right-tips-time {
									padding-top: 10rpx;
									font-size: 24rpx;
									font-weight: 400;
									color: #7e7e7e;
								}
							}
						}

						.order-detail-address-warp-top-right {
							width: 30rpx;
							height: 30rpx;
							padding-left: 30rpx;

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

					.order-detail-address-warp-bottom {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.order-detail-address-warp-bottom-left {
							flex: 1;
							display: flex;

							.left-img {
								width: 24.4rpx;
								height: 28rpx;

								image {
									width: 100%;
									height: 100%;
								}
							}

							.right-tips-box {
								flex: 1;
								padding-left: 17rpx;

								.right-tips {
									font-size: 24rpx;
									font-weight: 700;
									color: #1e1e1e;
								}

								.right-tips-time {
									padding-top: 10rpx;
									font-size: 24rpx;
									font-weight: 400;
									color: #7e7e7e;
								}
							}
						}

						.order-detail-address-warp-bottom-right {
							width: 20rpx;
							height: 20rpx;
							padding-left: 30rpx;

							.img {
								width: 20rpx;
								height: 20rpx;

							}
						}
					}
				}

				// 自提部分
				.order-detail-Since-warp {
					display: flex;
					flex-direction: column;

					.order-detail-Since-top {
						border-bottom: 1rpx solid #ddd;
						padding-bottom: 20rpx;

						.order-detail-Since-top-warp {
							font-size: 24rpx;
							font-weight: 700;
							color: #1e1e1e;

							.text2 {
								padding-right: 10rpx;
							}
						}
					}

					.order-detail-Since-bottom {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 20rpx 0;

						.order-detail-Since-bottom-left {
							flex: 1;
							display: flex;
							flex-direction: column;


							.stores-name {
								font-size: 24rpx;
								font-weight: 700;
								color: #1e1e1e;
							}

							.stores-address {
								padding: 10rpx 0;
								font-size: 24rpx;
								font-weight: 700;
								color: #7e7e7e;
							}

							.stores-tips {
								font-size: 24rpx;
								font-weight: 700;
								color: #FF293F;
							}
						}

						.order-detail-Since-bottom-right {
							display: flex;
							justify-content: center;
							align-items: center;
							background-color: #667D8B;
							width: 140rpx;
							height: 55rpx;
							border-radius: 27rpx;

							.navigation-text {
								font-size: 22rpx;
								font-weight: 400;
								color: #fff;
							}
						}
					}
				}
			}

			// 订单商品列表部分
			.order-detail-list-box {
				margin-top: 20rpx;
				padding: 20rpx 30rpx;
				background-color: #fff;

				.order-detail-list-warp {
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
				}
			}
		}
	}

	page {
		background-color: #f5f5f5;
	}
</style>
