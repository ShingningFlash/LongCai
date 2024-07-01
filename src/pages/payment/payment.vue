<template>
	<view>
		<!-- 顶部选择发货方式部分 -->
		<view class="payment-box">
			<view class="payment-warp">
				<view class="payment-top-box">
					<!-- tabs栏部分 -->
					<view class="payment-top-taps-box">
						<view :class="flag == 1 ? 'active-right-box' : 'distribution-box'" @click="changeTaps1(1)">
							<text>快递配送</text>
						</view>
						<view :class="flag == 2 ? 'active-left-box' : 'stores-box'" @click="changeTaps2(2)">
							<text>门店自提</text>
						</view>
						<view class="white-box"></view>
					</view>
					<view class="payment-top-taps-bottom-box">
						<!-- 快递配送部分 -->
						<view class="payment-top-taps-bottom-warp" v-if="flag == 1">
							<view v-if="addressData && addressData.address_id"
								@click="clickJump('/pages/addressList/addressList?order_select='+true)">
								<view class="top-box">
									<text class="text1">默认</text><text class="text2">{{addressData.region}}</text>
								</view>
								<view class="middle-box">
									<view class="address-detail-box">{{addressData.address}}</view>
									<view class="icon-box">
										<image src="https://tm.ydlweb.com/icons/righticon.png" mode=""></image>
									</view>
								</view>
								<view class="bottom-box">
									<text class="text1">{{addressData.consignee}}</text>
									<text class="text2">{{addressData.mobile}}</text>
								</view>
							</view>
							<!-- 没有地址时显示 -->
							<view class="middle-box" v-else
								@click="clickJump('/pages/addressList/addressList?order_select='+true)">
								<view class="address-detail-box">请先选择收货地址</view>
								<view class="icon-box">
									<image src="https://tm.ydlweb.com/icons/righticon.png" mode=""></image>
								</view>
							</view>

						</view>
						<!-- 门店自提部分 -->
						<view class="payment-bottom-taps-bottom-warp" v-if="flag == 2">
							<view class="stores-top-box"
								@click="clickJump('/pages/selectStores/selectStores?store_id=' + storeData.id)">
								<view class="img-box">
									<image v-if="storeData.id" :src="storeData.store_img" mode=""></image>
									<image v-else src="https://tm.ydlweb.com/icons/store.png" mode=""></image>
								</view>
								<!-- 选择了门店时 -->
								<view class="stores-address-box" v-if="storeData.id">
									<view class="stores-name">
										<text>自提点：{{storeData.store_name}}</text>
									</view>
									<view class="stores-address-warp">
										<view class="stores-address-warp-left">
											<text>{{storeData.address}}</text>
										</view>
										<view class="stores-address-warp-right"
											@click="clickJump('/pages/selectStores/selectStores?store_id=' + storeData.id)">
											<image src="https://tm.ydlweb.com/icons/righticon.png" mode=""></image>
										</view>
									</view>
								</view>
								<!-- 没有门店时 -->
								<view class="stores-address-box" v-else>
									<view class="stores-name">
										<text>暂无门店</text>
									</view>
									<view class="stores-address-warp">
										<view class="stores-address-warp-left">
											<text>请选择自提的门店</text>
										</view>
										<view class="stores-address-warp-right">
											<image src="https://tm.ydlweb.com/icons/righticon.png" mode=""></image>
										</view>
									</view>
								</view>
							</view>
							<view class="stores-bottom-box">
								<view class="stores-bottom-box-left">
									<view class="time-box">
										<text>自取时间</text>
									</view>
									<view class="time-warp" @click="openPick">
										<view class="time">
											<text>{{pickTime}}</text>
										</view>
										<view class="right-icon-box">
											<image src="https://tm.ydlweb.com/icons/righticon.png" mode=""></image>
										</view>
									</view>
								</view>

								<view class="stores-bottom-box-right">
									<view class="phone-top-box">
										<text>预留手机</text>
									</view>
									<view class="phone-bottom-box">
										<view class="phone-box">
											<view class="phone">
												<input type="phone" v-model="phone" maxlength="11" />
											</view>
											<view class="right-icon-box-edit">
												<image src="https://tm.ydlweb.com/icons/editor.png" mode=""></image>
											</view>
										</view>
										<view class="distance-box" v-if="storeData.id">
											<text>距您{{storeData.distance}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 商品展示部分 -->
				<view class="order-goods-box">
					<view class="order-goods-warp">
						<!-- 循环部分 -->
						<view class="order-goods-item" v-for="(item,index) in goodsArr">
							<view class="order-goods-item-left">
								<image :src="item.original_img" mode=""></image>
							</view>
							<view class="order-goods-item-right">
								<view class="order-goods-item-right-top">
									<view class="goods_name">
										<text>{{item.goods_name}}</text>
									</view>
									<view class="goods_spec">
										<text>{{item.spec_key_name}}</text>
									</view>
									<!-- <view class="goods_spec" style="padding-top: 5rpx;">
										<text>{{item.file[0].filename}}</text>
									</view> -->
									<view class="goods_spec" style="padding-top: 5rpx;" v-if="item.file.length!=0"
										v-for="(item2,index2) in item.file" :key='index2'>
										<text>{{item2.filename}}</text>
									</view>
								</view>
								<view class="order-goods-item-right-bottom">
									<view class="goods-price">
										￥<text class="price">{{item.goods_price}}</text>
									</view>
									<view class="goods-number">
										<text class="price">x{{item.goods_num}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 留言部分 -->
				<view class="note-box">
					<view class="note-warp">
						<view class="note">
							<text>定制要求</text>
						</view>
						<view class="note-input">
							<input type="text" v-model.trim="usernote" placeholder="选填,给商家留言定制要求" />
						</view>
					</view>
				</view>
				<!-- 商品总计部分 -->
				<view class="total-box">

					<!-- 代金券 -->
					<view class="total-top" @click="selectVoucher(orderTotal)">
						<view class="totla-text">
							<text>代金券抵扣</text>
						</view>
						<view class="total-num-box">
							<view class="total-num">
								<text
									v-if="voucherData.id && voucherData.arrive_price != '' && voucherData.arrive_price != null && voucherData.arrive_price != undefined">￥{{voucherData.arrive_price}}</text>
								<text v-else>￥0</text>
							</view>
							<view class="total-num-icon">
								<image src="https://tm.ydlweb.com/icons/arrow-right.png" mode=""></image>
							</view>
						</view>

					</view>

					<view class="total-top">
						<view class="totla-text">
							<text>商品总额</text>
						</view>
						<view class="total-num">
							<text v-if="goods_fee && goods_fee != 0 ">￥{{orderTotal - goods_fee}}</text>
							<text v-else>￥{{orderTotal}}</text>
						</view>
					</view>


					<view class="total-top">
						<view class="totla-text">
							<text>支付方式</text>
						</view>
						<view class="total-num" style="display: flex;">
							<view>
								<radio :checked="gooods_type == 2" @click="gooodsType(2)" /><text
									style="margin-right: 30rpx;">微信</text>
							</view>
							<view>
								<radio :checked="gooods_type == 1" @click="gooodsType(1)" /><text>余额</text>
							</view>
						</view>
					</view>


					<view class="total-top">
						<view class="totla-text">
							<text>运费</text>
						</view>
						<view class="total-num">
							<text v-if="flag == 1 &&  goods_fee && goods_fee != 0">￥{{goods_fee}}</text>
							<text v-else>免运费</text>
						</view>
					</view>
					<view class="total-bottom">
						<view class="totla-price" v-if="flag == 1 &&  goods_fee && goods_fee != 0">
							总计：<text>{{orderTotal}}</text>
						</view>
						<view class="totla-price" v-if="flag == 2">
							总计：<text>{{orderTotal-goods_fee}}</text>
						</view>

					</view>
				</view>

			</view>
		</view>
		<!-- 底部结算按钮部分 -->
		<view class="bottom-btn-box">
			<view class="bottom-btn-warp">
				<view class="bottom-btn-warp-left">
					实付金额：<text class="btn-price"
						v-if="voucherData.id && voucherData.arrive_price != '' && voucherData.arrive_price != null && voucherData.arrive_price != undefined">￥{{ parseFloat(orderTotal-voucherData.arrive_price < 0 ? 0: flag == 1 && goods_fee &&  goods_fee != 0 ? orderTotal-voucherData.arrive_price:orderTotal-voucherData.arrive_price-goods_fee).toFixed(2)   }}</text>
					<text class="btn-price"
						v-else>￥{{ flag == 1 && goods_fee &&  goods_fee != 0 ? orderTotal:orderTotal-goods_fee}}</text>
				</view>
				<view class="bottom-btn-warp-right">
					<text @click="CreatOrderInfoFun">立即支付</text>
				</view>
			</view>
		</view>
		<u-datetime-picker ref="datetimePicker" :show="show" v-model="pickTime" mode="time" @confirm="confirmTime">
		</u-datetime-picker>
	</view>
</template>

<script>
	import {
		GoodsBuyNow, // 在线下单 接口 
		CreatOrderInfo, // 提交订单 接口
		MiniPayOrder, // 微信支付 接口
		CreditPayOrder, // 余额支付 接口
		Payment, // 调起微信支付 接口
		SettleAccounts // 获取购物车结算数据 接口
	} from '@/api/order.js'
	export default {
		data() {
			return {
				show: false, // 时间选择器显示和隐藏
				flag: 2, // 1快递  2自提 
				fileData: [], // 上传的文件数组
				fileIdData: null, // 文件id字符串 1，2，3...
				goodsArr: [], // 订单商品列表
				addressData: {}, // 地址数据
				orderTotal: 0, // 订单总金额
				usernote: '', // 客户留言内容
				spec_id: null, // 传过来的商品规格id
				storeData: {}, // 门店信息数据
				phone: '', // 预留的手机号码
				phoneShow: false, // 预留的手机号码输入框展示
				pickTime: '12:00', // 自提时间
				gooods_type: 2, //支付方式  1余额credit  2微信weixin
				voucherData: {}, // 代金券数据
				goods_fee: 0, // 运费
			}
		},
		onLoad(option) {
			// 立即下单执行该事件
			if (option.fileData) {
				let fileData1 = JSON.parse(option.fileData)
				if (fileData1.length != 0) {
					for (let i = 0; i < fileData1.length; i++) {
						this.fileData.push(JSON.parse(fileData1[i]))
					}
					if (this.fileData.length != 0) {
						let fileIdArr = []
						for (let j = 0; j < this.fileData.length; j++) {
							fileIdArr.push(this.fileData[j].id)
						}
						this.fileIdData = fileIdArr.join(',')
					}
				}
				this.spec_id = option.spec_id
				this.GoodsBuyNow(option.goods_id, option.numIpt, option.spec_id)
			} else {
				// 购物车结算执行的事件
				this.spec_id = null
				this.SettleAccountsFun()
			}
		},
		onUnload() { // 监听页面卸载 
			console.log('结算页面卸载')
			this.voucherData = {}
		},
		methods: {
			// 跳转到代金券页面选择代金券
			selectVoucher(totalMoney) {
				uni.navigateTo({
					url: '/pages/myVoucher/myVoucher?payment=' + true + '&total_money=' + totalMoney
				})
			},
			// 切换支付方式
			gooodsType(e) {
				this.gooods_type = e
			},
			// 关闭事件
			cancelTime() {
				this.show = false
			},
			// 自选时间的确定事件
			confirmTime(e) {
				console.log('自选时间的确定事件', e)
				this.show = false
			},
			// 自选时间
			openPick() {
				this.show = true
			},
			// 立即购买或购物车购买  提交订单 事件
			CreatOrderInfoFun() {
				let data = {}
				// 购物车购买需要的参数
				if (this.spec_id == null) {
					// 快递
					if (this.flag == 1) {
						if (!this.addressData || !this.addressData.address_id) {
							return uni.showToast({
								title: '请选择收货地址',
								icon: 'none'
							})
						}
						data = {
							type: 'cart',
							action: 'submit_order',
							address_id: this.addressData.address_id,
							user_note: this.usernote,
							ship_type: this.flag,
							pay_code: this.gooods_type == 1 ? 'credit' : 'weixin',
							voucher_id: this.voucherData.id ? this.voucherData.id : null
						}
					} else {
						// 自提
						if (!this.storeData.id) {
							return uni.showToast({
								title: '请选择自提门店',
								icon: 'none'
							})
						}
						if (this.phone == '') {
							return uni.showToast({
								title: '请填写手机号',
								icon: 'none'
							})
						}
						if (!(/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.phone))) {
							return uni.showToast({
								title: '请输入正确的手机号',
								icon: 'none'
							})
						}
						data = {
							type: 'cart',
							action: 'submit_order',
							user_note: this.usernote,
							ship_type: this.flag,
							pay_code: this.gooods_type == 1 ? 'credit' : 'weixin',
							store_id: this.storeData.id,
							take_time: this.pickTime,
							take_mobile: this.phone,
							voucher_id: this.voucherData.id ? this.voucherData.id : null
						}
					}
				} else { // 立即购买需要的参数
					if (this.flag == 1) {
						// 快递
						if (!this.addressData || !this.addressData.address_id) {
							return uni.showToast({
								title: '请选择收货地址',
								icon: 'none'
							})
						}
						data = {
							type: 'buynow',
							action: 'submit_order',
							address_id: this.addressData.address_id,
							user_note: this.usernote,
							item_id: this.spec_id,
							goods_id: this.goodsArr[0].goods_id,
							goods_num: this.goodsArr[0].goods_num,
							ship_type: this.flag,
							pay_code: this.gooods_type == 1 ? 'credit' : 'weixin',
							file: this.fileIdData,
							voucher_id: this.voucherData.id ? this.voucherData.id : null
						}
					} else {
						// 自提
						if (!this.storeData.id) {
							return uni.showToast({
								title: '请选择自提门店',
								icon: 'none'
							})
						}
						if (this.phone == '') {
							return uni.showToast({
								title: '请填写手机号',
								icon: 'none'
							})
						}
						if (!(/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.phone))) {
							return uni.showToast({
								title: '请输入正确的手机号',
								icon: 'none'
							})
						}
						data = {
							type: 'buynow',
							action: 'submit_order',
							user_note: this.usernote,
							item_id: this.spec_id,
							goods_id: this.goodsArr[0].goods_id,
							goods_num: this.goodsArr[0].goods_num,
							ship_type: this.flag,
							pay_code: this.gooods_type == 1 ? 'credit' : 'weixin',
							file: this.fileIdData,
							store_id: this.storeData.id,
							take_time: this.pickTime,
							phone: this.phone,
							voucher_id: this.voucherData.id ? this.voucherData.id : null
						}
					}
				}
				// console.log('提交订单参数', data)
				//	生成订单数据
				CreatOrderInfo(data, (res) => {

					if (res.status == 1) {
						if (this.gooods_type == 1) {
							CreditPayOrder({
								order_id: res.order.order_id,
							}, function(res4) {
								if (res4.status == 1) {
									uni.showToast({
										title: res4.msg,
										icon: 'none'
									})
									setTimeout(() => {
										uni.redirectTo({
											url: '/pages/order/order?pay_type=' + 2
										})
									}, 1200)
								} else {
									uni.showToast({
										title: res4.msg,
										icon: 'none'
									})
									setTimeout(() => {
										uni.redirectTo({
											url: '/pages/order/order?pay_type=' + 1
										})
									}, 1200)
								}

							})
						} else {
							// 获取微信支付需要的参数
							MiniPayOrder({
								order_id: res.order.order_id,
								openid: uni.getStorageSync('openid')
							}, (res2) => {
								if (res2.status == 1) {
									// 调起微信支付
									Payment(res2.payinfo, (res3) => {
										if (res3.status == 1) {
											uni.redirectTo({
												url: '/pages/order/order?pay_type=' + 2
											})
										} else {
											uni.showToast({
												title: res3.msg,
												icon: 'none'
											})
											setTimeout(() => {
												uni.redirectTo({
													url: '/pages/order/order?pay_type=' +
														1
												})
											}, 800)
										}
									})
								} else {
									uni.showToast({
										title: res2.msg,
										icon: 'none'
									})
								}
							})
						}

					} else if (res.status == 2) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/order/order?pay_type=' + 2
							})
						}, 800)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}

				})
			},
			// 购物车结算 列表数据
			SettleAccountsFun() {
				SettleAccounts({}, (res) => {
					if (res.status == 1) {
						this.goodsArr = res.goodslist
						this.addressData = res.address
						this.orderTotal = res.allprices
						if (res.goods_fee && res.goods_fee != 0) {
							this.goods_fee = res.goods_fee
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 在线下单 列表数据
			GoodsBuyNow(goodsId, numIpt, specString) {
				let data = {
					goods_id: goodsId,
					goods_num: numIpt,
					item_id: specString
				}
				GoodsBuyNow(data, (res) => {
					if (res.status == 1) {
						this.goodsArr = res.goodslist
						this.addressData = res.address
						this.orderTotal = res.allprices
						if (res.goods_fee && res.goods_fee != 0) {
							this.goods_fee = res.goods_fee
						}

					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 改变商品发货方式
			changeTaps1(id) {
				this.flag = id
			},
			changeTaps2(id) {
				this.flag = id
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
	// 底部结算按钮部分
	.bottom-btn-box {
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #fff;
		padding-bottom: 30rpx;

		.bottom-btn-warp {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx;

			.bottom-btn-warp-left {
				font-size: 32rpx;
				font-weight: 400;
				color: #1e1e1e;

				.btn-price {
					color: #ff2d2d;
				}
			}

			.bottom-btn-warp-right {
				text {
					background-color: #667D8B;
					padding: 20rpx 50rpx;
					color: #fff;
					border-radius: 40rpx;
				}
			}
		}
	}

	// 商品总计部分
	.total-box {
		// margin-bottom: 50rpx;
		background-color: #fff;
		padding: 0 30rpx;
		border-radius: 20rpx;

		.total-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1rpx solid #ccc;
			padding: 30rpx 0rpx;

			.totla-text {
				font-size: 28rpx;
				font-weight: 400;
				color: #111;
			}

			.total-num-box {
				display: flex;
				align-items: center;

				.total-num {
					font-size: 28rpx;
					font-weight: 400;
					color: #111;
				}

				.total-num-icon {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 30rpx;
					height: 30rpx;
					padding-left: 20rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}


		}

		.total-bottom {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			padding: 30rpx 0rpx;
			// margin-bottom: 80rpx;

			.totla-price {
				font-size: 24rpx;
				font-weight: 400;
				color: #1e1e1e;

				text {
					color: #ff2d2d;
				}
			}
		}
	}

	// 留言部分
	.note-box {
		margin: 0rpx 0rpx 20rpx;
		background-color: #fff;
		padding: 15rpx 30rpx;
		border-radius: 20rpx;

		.note-warp {
			display: flex;
			justify-content: space-between;

			.note {
				flex: 1;
				display: flex;
				align-items: center;
				// width: 150rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #1e1e1e;
			}

			.note-input {
				flex: 3;
				display: flex;
				justify-content: flex-end;
				font-size: 24rpx;
				font-weight: 400;
				color: #7e7e7e;

				input {
					text-align: right;
					width: 60%;
				}
			}
		}
	}

	// 商品展示部分
	.order-goods-box {
		margin: 20rpx 0;
		background-color: #fff;
		padding: 30rpx 30rpx 0;
		border-radius: 20rpx;

		.order-goods-warp {
			.order-goods-item {
				display: flex;
				padding-bottom: 30rpx;

				.order-goods-item-left {
					width: 210rpx;
					height: 170rpx;

					image {
						border-radius: 5rpx;
						width: 100%;
						height: 100%;
					}
				}

				.order-goods-item-right {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					padding-left: 20rpx;
					width: 400rpx;

					.order-goods-item-right-top {

						.goods_name {
							font-size: 26rpx;
							font-weight: 400;
							color: #2e2e2e;
						}

						.goods_spec {
							font-size: 20rpx;
							font-weight: 400;
							color: #666;
							word-break: keep-all;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}

					.order-goods-item-right-bottom {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.goods-price {
							font-size: 24rpx;
							font-weight: 700;
							color: #ff2d2d;

							.price {
								font-size: 32rpx;
							}
						}

						.goods-number {
							font-size: 24rpx;
							font-weight: 400;
							color: #7d7d7d;
						}
					}
				}
			}
		}
	}


	// 顶部选择发货方式部分
	.payment-box {
		background: linear-gradient(180.00deg, #667D8B 0%, #f8f8f8 100%);
		padding: 0rpx 30rpx 20rpx;

		.payment-warp {
			padding-bottom: 140rpx;

			.payment-top-box {

				// tabs栏部分
				.payment-top-taps-box {
					position: relative;
					display: flex;
					align-items: flex-end;
					width: 100%;

					.distribution-box {
						flex: 1;
						position: relative;
						z-index: 1;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 24rpx;
						font-weight: 700;
						color: #6C828F;
						background-color: #bac4ca;
						height: 60rpx;
						border-bottom-right-radius: 20rpx;
						border-top-left-radius: 20rpx;
					}

					.stores-box {
						flex: 1;
						position: relative;
						z-index: 1;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 24rpx;
						font-weight: 700;
						color: #6C828F;
						background-color: #bac4ca;
						height: 60rpx;
						border-bottom-left-radius: 20rpx;
						border-top-right-radius: 20rpx;
					}

					.active-left-box {
						position: relative;
						z-index: 2;
						flex: 1;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 30rpx;
						font-weight: 700;
						color: #111;
						background: rgba(255, 255, 255, 1);
						height: 80rpx;
						border-top-left-radius: 20rpx;
						border-top-right-radius: 20rpx;
						padding-right: 20rpx;
					}

					.active-right-box {
						position: relative;
						z-index: 2;
						flex: 1;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 30rpx;
						font-weight: 700;
						color: #111;
						background: rgba(255, 255, 255, 1);
						height: 80rpx;
						border-top-left-radius: 20rpx;
						border-top-right-radius: 20rpx;
						padding-right: 20rpx;
					}

					.white-box {
						position: absolute;
						bottom: 0;
						z-index: 0;
						width: 100%;
						height: 60rpx;
						background: rgba(255, 255, 255, 1);
						border-top-left-radius: 20rpx;
						border-top-right-radius: 20rpx;
					}
				}

				.payment-top-taps-bottom-box {
					padding: 30rpx;
					background: rgba(255, 255, 255, 1);
					border-bottom-left-radius: 20rpx;
					border-bottom-right-radius: 20rpx;

					// 快递配送部分
					.payment-top-taps-bottom-warp {

						.top-box {
							.text1 {
								font-size: 18rpx;
								color: #fff;
								font-weight: 400;
								padding: 4rpx 8rpx;
								background-color: #667D8B;
								border-radius: 4rpx;
							}

							.text2 {
								font-size: 24rpx;
								color: #1e1e1e;
								font-weight: 400;
								padding-left: 20rpx;
								background-color: #fff;
							}
						}

						.middle-box {
							display: flex;
							justify-content: space-between;
							align-items: cneter;
							padding: 10rpx 0;

							.address-detail-box {
								flex: 1;
								font-size: 36rpx;
								font-weight: 700;
								color: #1e1e1e;
							}

							.icon-box {
								display: flex;
								align-items: center;

								padding-left: 30rpx;
								width: 30rpx;

								image {
									width: 100%;
									height: 30rpx;
								}
							}
						}

						.bottom-box {
							font-size: 24rpx;
							font-weight: 400;
							color: #6e6e6e;

							.text1 {
								padding-right: 30rpx;
							}
						}
					}

					// 门店自提部分
					.payment-bottom-taps-bottom-warp {

						.stores-top-box {
							display: flex;

							.img-box {
								width: 150rpx;
								height: 113rpx;

								image {
									border-radius: 6rpx;
									width: 100%;
									height: 100%;
								}
							}

							.stores-address-box {
								flex: 1;
								display: flex;
								flex-direction: column;
								// justify-content: space-between;
								padding-left: 20rpx;

								.stores-name {
									font-size: 28rpx;
									font-weight: 700;
									color: #111;
								}

								.stores-address-warp {
									display: flex;
									justify-content: space-between;
									padding-top: 10rpx;

									.stores-address-warp-left {
										font-size: 24rpx;
										font-weight: 400;
										color: #777;
									}

									.stores-address-warp-right {
										padding-left: 30rpx;
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

						.stores-bottom-box {
							display: flex;
							margin-top: 30rpx;

							.stores-bottom-box-left {
								border-right: 1rpx solid #ccc;
								padding-right: 30rpx;
								display: flex;
								flex-direction: column;
								justify-content: space-between;

								.time-box {

									font-size: 24rpx;
									font-weight: 400;
									color: #898989;

								}

								.time-warp {
									display: flex;
									align-items: center;
									justify-content: space-between;

									.time {
										font-size: 24rpx;
										font-weight: 700;
										color: #111;
									}

									.right-icon-box {
										display: flex;
										width: 23rpx;
										height: 23rpx;

										image {
											width: 100%;
											height: 100%;
										}
									}
								}
							}

							.stores-bottom-box-right {

								flex: 1;
								padding-left: 30rpx;

								.phone-top-box {
									font-size: 24rpx;
									font-weight: 400;
									color: #898989;
								}

								.phone-bottom-box {
									display: flex;
									justify-content: space-between;

									.phone-box {
										flex: 5;
										display: flex;

										.phone {
											padding-right: 10rpx;
											font-size: 24rpx;
											font-weight: 700;
											color: #111;
											width: 180rpx;
											border-bottom: 1rpx solid #ddd;
										}

										.right-icon-box-edit {
											width: 30rpx;
											height: 100%;
											display: flex;
											align-items: center;

											image {
												width: 100%;
												height: 30rpx;
											}
										}
									}

									.distance-box {
										flex: 2;
										font-size: 20rpx;
										font-weight: 400;
										color: #898989;
										display: flex;
										align-items: flex-end;
									}
								}
							}
						}
					}
				}
			}
		}
	}

	page {
		// background: linear-gradient(180.00deg, #667D8B 0%, #f8f8f8 100%);
		background-color: #fff;
	}
</style>
