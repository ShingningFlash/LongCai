<template>
	<view>
		<view class="commodity">
			<view class="commodityTitle">换货商品</view>
			<view class="commodityItem" v-for="(item,index) in order_goods" :key='index'>
				<image :src="item.original_img"></image>
				<view>
					<view class="name">{{item.goods_name}}</view>
					<view class="spec">{{item.spec_key_name}}</view>
				</view>
			</view>
		</view>

		<view class="address">
			<view class="title">收货地址</view>
			<view class="addressItem">
				<view>
					<view class="name">{{addressData.consignee}} {{addressData.mobile}}</view>
					<view class="text">{{addressData.address}}</view>
				</view>
				<image src="https://tm.ydlweb.com/icons/righticon.png"
					@click="clickJump('/pages/addressList/addressList?order_select=true')"></image>
			</view>
		</view>

		<view class="reason">
			<view class="reasonTitle">
				<view class="left">选择原因</view>
				<view class="right" @click='showPicker'>
					<view v-if="causetypeObj.id">{{causetypeObj.name}}</view>
					<view v-else>请选择换货原因</view>
					<image src="https://tm.ydlweb.com/icons/righticon.png"></image>
				</view>
			</view>
			<textarea placeholder="请描述申请售后服务的具体原因" v-model="describe"></textarea>
			<view class="Imglist">

				<view class="img" v-for="(item,index) in chooseImgArr" :key="index">
					<view class="del" @click="delImg(index)">×</view>
					<image :src="item"></image>
				</view>

				<view class="upload" @click="selectImgFunction" v-if="chooseImgArr.length < 6">
					<image src="https://tm.ydlweb.com/icons/icon_48.png"></image>
					<p>(最多6张)</p>
				</view>

			</view>
		</view>

		<view class="submit" @click="HandleOrderRefundFun">提交申请</view>

		<!-- 原因选择器 -->
		<view class="cu-modal" v-if="pickerVisible">
			<view class="cu-dialog">
				<view class="cu-title">
					<view @click="showPicker">取消</view>
					<view @click="determine">确定</view>
				</view>
				<picker-view class="picker-view" indicator-style="height: 50px;" @change="bindChange">
					<picker-view-column>
						<view class="item" v-for="(item,index) in causetype" :key='index'>{{item.name}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		OrderGoodsList, // 商品退换货信息数据 接口
		HandleOrderRefund // 提交退换货表单 接口
	} from '@/api/order.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				pickerVisible: false,

				user_id: null, // 用户id
				describe: '', //问题描述
				rec_id: null, //订单商品id

				value: 0, // 下拉框选中的数据
				reason: null, //退货原因
				chooseImgArr: [], // 选择的图片数组
				address_id: null, //地址id

				order: {}, //订单数据

				// ==================
				order_id: null, // 退货传过来的订单id
				return_type: null, // 退货传过来的类型 1退  2换
				causetype: [], // 退货原因数组
				causetypeObj: {}, // 退货原因对象
				order_goods: [], //订单的商品数据
				orderInfo: {}, // 订单信息
				chooseImgArr: [], // 图片
				addressData: {}, //换货地址
			}
		},
		onLoad(option) {
			if (option.order_id && option.return_type) {
				this.order_id = option.order_id
				this.return_type = option.return_type
				this.OrderGoodsListFun()
			}
		},
		onShow() {

		},
		methods: {
			// 获取退货订单的数据信息
			OrderGoodsListFun() {
				OrderGoodsList({
					order_id: this.order_id
				}, (res) => {
					console.log('获取退货订单的数据信息res', res)
					if (res.status == 1) {
						this.causetype = res.causetype
						this.order_goods = res.ordergoods
						this.orderInfo = res.order
						this.addressData = res.address
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 提交退换货表单
			HandleOrderRefundFun() {
				if (!this.causetypeObj.id) {
					return uni.showToast({
						title: '请选择退货原因',
						icon: 'none'
					})
				}
				if (!this.addressData.address_id) {
					return uni.showToast({
						title: '请选择收货地址',
						icon: 'none'
					})
				}
				let data = {
					refund_type: this.return_type,
					order_id: this.order_id,
					reason: this.causetypeObj.name,
					describe: this.describe,
					refund_imgs: this.chooseImgArr,
					address_id: this.addressData.address_id
				}
				// console.log('退货需要传递的参数', data)
				HandleOrderRefund(data, (res) => {
					if (res.status == 1) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						setTimeout((item) => {
							uni.redirectTo({
								url: '/pages/order/order'
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
			// 选择换货的图片
			selectImgFunction() {
				var _this = this
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: function(res) {
						_this.uploadingFun(res.tempFilePaths[0])
					}
				});
			},

			// 上传图片
			uploadingFun(tempFiles) {
				var _this = this
				uni.uploadFile({
					url: 'https://xcx.gdqhwy.com/Mini/ApiConnect/uploadRefundpic',
					filePath: tempFiles,
					name: 'refund_pic',
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					formData: {
						user_id: uni.getStorageSync('user_id')
					},
					success(res) {
						_this.chooseImgArr.push(JSON.parse(res.data).result)
					},
					fail(err) {
						uni.showToast({
							title: '图片上传失败',
							icon: 'none'
						})
					}
				});
			},

			// 删除图片
			delImg(idx) {
				this.chooseImgArr.splice(idx, 1)
			},
			//选中原因之后的确定事件
			determine() {
				this.reason = this.causetype[this.value].id
				this.causetypeObj = this.causetype[this.value]
				this.pickerVisible = false
			},
			// 显示原因下拉框
			showPicker() {
				if (this.pickerVisible == true) {
					this.pickerVisible = false
				} else {
					this.pickerVisible = true
				}
			},
			// 下拉框选择原因
			bindChange(e) {
				var _this = this
				this.value = e.detail.value
			},
			// 路由跳转
			clickJump(e) {
				uni.navigateTo({
					url: e
				})
			},




			// =============

			// 获取换货商品数据
			async getReturnGoods() {
				var _this = this
				var res = await postData('post', {
					url: '/mini/ApiConnect/OrderGoodsList',
					data: {
						user_id: _this.user_id,
						order_id: _this.order_id,
						rec_id: _this.rec_id
					}
				})
				console.log('换货商品返回的数据', res)
				if (res.data.status == 1) {
					this.causetype = res.data.causetype
					this.addressData = res.data.address
					this.address_id = this.addressData.address_id
					this.order = res.data.order
				}
			},

			// 换货请求
			async ruturnGoods() {
				var _this = this
				if (!uni.getStorageSync('user_id')) {
					uni.showToast({
						title: '登录过期，请登录！',
						icon: 'none',
					})
					return;
				}
				if (!this.addressData.address_id) {
					uni.showToast({
						title: '请选择收货地址',
						icon: 'none',
					})
					return;
				}
				if (!this.reason) {
					uni.showToast({
						title: '请选择换货原因',
						icon: 'none',
					})
					return;
				}
				var res = await postData('post', {
					url: '/mini/ApiConnect/HandleOrderRefund',
					data: {
						user_id: _this.user_id,
						refund_type: _this.type,
						rec_id: _this.rec_id,
						order_id: _this.order_id,
						reason: _this.reason,
						describe: _this.describe,
						refund_imgs: _this.chooseImgArr,
						address_id: _this.address_id,
					}
				})
				console.log('提交返回的数据', res)
				if (res.data.status == 1) {
					uni.showToast({
						title: '提交成功，等待审核',
						icon: 'none'
					})
					if (uni.getStorageSync('returnaddressObj')) {
						uni.removeStorageSync('returnaddressObj');
					}
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/order/order'
						});
					}, 1200)
				} else {
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					})
					if (uni.getStorageSync('returnaddressObj')) {
						uni.removeStorageSync('returnaddressObj');
					}
				}
			},

			// 选择收货地址
			jumpSelectAddress() {
				uni.navigateTo({
					url: '/pages/address/address?returngoods=1'
				})
			},
		}
	}
</script>
<style lang="scss">
	.cu-modal {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		padding-bottom: 30rpx;
		z-index: 99;
	}

	.cu-dialog {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
	}

	.picker-view {
		background-color: #fff;
	}

	picker-view-column {
		height: 400rpx;
		text-align: center;
	}

	.cu-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		background-color: #72808B;
		color: #fff;
		font-weight: bold;
		font-size: 35rpx;
		padding: 0rpx 35rpx;
	}

	/* ===== */
	.submit {
		width: 690rpx;
		height: 90rpx;
		background-color: #667D8B;
		margin: 0 auto;
		font-weight: 400;
		font-size: 36rpx;
		color: #fff;
		position: absolute;
		bottom: 30rpx;
		left: 0;
		right: 0;
		line-height: 90rpx;
		text-align: center;
		border-radius: 15rpx;
	}

	.reason {
		border-radius: 10rpx;
		background: #fff;
		margin: 30rpx;
		padding: 30rpx;

		.reasonTitle {
			display: flex;
			justify-content: space-between;
			border-bottom: 1rpx solid #DDDDDD;
			padding-bottom: 20rpx;

			.left {
				font-weight: bold;
				font-size: 28rpx;
				color: #1e1e1e;
			}

			.right {
				display: flex;
				align-items: center;

				image {
					width: 25rpx;
					height: 25rpx;
					margin-left: 20rpx;
				}

				view {
					font-weight: 400;
					font-size: 24rpx;
					color: #666;
				}
			}
		}

		textarea {
			height: 230rpx;
			border-radius: 10rpx;
			background-color: #f5f5f5;
			margin-top: 30rpx;
			font-weight: 400;
			font-size: 24rpx;
			color: #999;
			padding: 20rpx;
		}

		.Imglist {
			display: flex;
			flex-wrap: wrap;
			margin-top: 40rpx;

			.img {
				width: 140rpx;
				height: 140rpx;
				position: relative;
				margin-right: 20rpx;

				image {
					width: 100%;
					height: 100%;
				}

				.del {
					position: absolute;
					width: 32rpx;
					height: 32rpx;
					background: rgba(0, 0, 0, 0.6);
					right: -16rpx;
					top: -16rpx;
					color: #fff;
					border-radius: 50%;
					line-height: 32rpx;
					text-align: center;
				}
			}

			.upload {
				width: 140rpx;
				height: 140rpx;
				border-radius: 6rpx;
				background: transparent;
				border: 2rpx solid #ddd;
				text-align: center;
				font-weight: 400;
				font-size: 20rpx;
				color: #999;

				image {
					width: 56rpx;
					height: 46rpx;
					margin-top: 20rpx;
				}
			}
		}
	}

	.address {
		border-radius: 20rpx;
		background-color: #fff;
		margin: 0rpx 30rpx;
		padding: 30rpx 30rpx;

		.title {
			font-weight: bold;
			font-size: 28rpx;
			color: #1e1e1e;
			border-bottom: 1rpx solid #DDDDDD;
			padding-bottom: 20rpx;
		}

		.addressItem {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 20rpx;

			image {
				width: 25rpx;
				height: 25rpx
			}

			.name {
				font-weight: 400;
				font-size: 26rpx;
				color: #1e1e1e;
			}

			.text {
				font-weight: 400;
				font-size: 20rpx;
				color: #7e7e7e;
				margin-top: 5rpx;
			}
		}
	}


	.commodity {
		border-radius: 10rpx;
		background-color: #fff;
		padding: 20rpx;
		margin: 30rpx;

		.commodityTitle {
			font-weight: bold;
			font-size: 28rpx;
			color: #1e1e1e;
		}

		.commodityItem {
			display: flex;
			margin-top: 15rpx;

			image {
				width: 210rpx;
				height: 170rpx;
				border-radius: 6rpx;
				margin-right: 20rpx;
			}

			.name {
				font-weight: 400;
				font-size: 26rpx;
				color: #2e2e2e;
			}

			.spec {
				font-weight: 400;
				font-size: 20rpx;
				color: #666;
			}
		}
	}

	page {
		background-color: #f5f5f5;
	}
</style>
