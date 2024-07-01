<template>
	<view>
		<view class="flex m-center s-center" style="margin-top: 30rpx;" v-if="pai != ''">
			<image style="width:600rpx;height: 400rpx;" :src="image" v-if="pai == 1" mode="aspectFit"></image>
			<image style="width:600rpx;" :src="image" v-if="pai == 2" mode="aspectFit"></image>
		</view>
		<view class="list">
			
			<view class="list-item flex m-between">
				<view class="key">
					订单实付：
				</view>
				<view class="value">
					￥{{price}}
				</view>
			</view>
			
		</view>
		<button class="btn1" style="margin-top:30rpx" @click="conf" v-if="type==4">提交打印</button>
		<button class="btn1" style="margin-top: 30rpx;" @click="conf6" v-if="type==6">提交打印</button>
	</view>
</template>

<script>
	import {
		setPrinter,
		setPrinter6
	} from '@/api/index.js'
	export default {
		data() {
			return {
				price: 0,
				pay_id: 0,
				type: 4,
				image:uni.getStorageSync('previewUrl') ? uni.getStorageSync('previewUrl') : '',
				pai:''
				
			}
		},
		onLoad(e) {
			if (e.price) {
				this.price = e.price
			}
			if (e.pay_id) {
				this.pay_id = e.pay_id
			}
			if (e.type) {
				this.type = e.type
			}
			if(e.pai){
				this.pai = e.pai
			}
		},
		methods: {

			conf() {
				let data = {}
				let yun = uni.getStorageSync('yun')
				data.box_id = yun.id
				data.pay_id = this.pay_id
				data.openid = uni.getStorageSync('openid')
				uni.showLoading({
					title: '请求中...',
					mask: true
				})
				setPrinter(data, (res) => {
					uni.hideLoading()
					if (res.status == 1) {
						uni.removeStorageSync('filesList')
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: res.result.payinfo.timeStamp,
							nonceStr: res.result.payinfo.nonceStr,
							package: res.result.payinfo.package,
							signType: res.result.payinfo.signType,
							paySign: res.result.payinfo.paySign,
							success(res3) {
								
								if (res3.errMsg == "requestPayment:ok") {
									uni.showToast({
										title: '支付成功',
										icon: 'none'
									})
									setTimeout(() => {
										uni.reLaunch({
											url: '/pageA/newPage/index'
										})
									}, 800)
									// uni.removeStorageSync('addressObj')
								} else {
									return uni.showToast({
										title: '支付失败',
										icon: 'none'
									})
								}
						
							},
							fail(res) {
								uni.showToast({
									title: '支付失败',
									icon: 'none'
								})
						
							}
						})
					}
				})

			},
			conf6() {
				let data = {}
				
				let yun = uni.getStorageSync('yun')
				data.box_id = yun.id
				data.pay_id = this.pay_id
				data.openid = uni.getStorageSync('openid')
				uni.showLoading({
					title: '请求中...',
					mask: true
				})
				setPrinter6(data, (res) => {
					uni.hideLoading()
					if (res.status == 1) {
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: res.result.payinfo.timeStamp,
							nonceStr: res.result.payinfo.nonceStr,
							package: res.result.payinfo.package,
							signType: res.result.payinfo.signType,
							paySign: res.result.payinfo.paySign,
							success(res3) {
								if (res3.errMsg == "requestPayment:ok") {
									uni.showToast({
										title: '支付成功',
										icon: 'none'
									})
									setTimeout(() => {
										uni.reLaunch({
											url: '/pageA/newPage/index'
										})
									}, 800)
									// uni.removeStorageSync('addressObj')
								} else {
									return uni.showToast({
										title: '支付失败',
										icon: 'none'
									})
								}

							},
							fail(res) {
								uni.showToast({
									title: '支付失败',
									icon: 'none'
								})

							}
						})
						
					}
				})

			},

		}
	}
</script>
<style>
	page{
		background-color: #F1F5FB;
	}
</style>
<style lang="scss" scoped>
	.list {
		margin: 0 auto;
		margin-top:30rpx;
		
		width: 690rpx;
		height: 131rpx;
		border-radius: 15rpx;
		background: #fff;
		.list-item {
			
			padding: 40rpx 30rpx;
			color:#DC000C;
			font-weight: 700;
			.key{
				font-family: "PingFang SC Bold";
				font-weight: 700;
				font-size: 28rpx;
				color: #000;
			}
			.value{
				font-family: "PingFang SC Bold";
				font-weight: 700;
				font-size: 30rpx;
				color: #f00;
			}
		}
	}
	.btn1 {
		width: 690rpx;
		height: 88.06rpx;
		border-radius: 44.03rpx;
		background: linear-gradient(0.11deg, #185fab 0%, #38b8ef 100%);
		line-height: 88.06rpx;
		text-align: center;
		margin-top: 30rpx;
		font-family: "PingFang SC Heavy";
		font-weight: 900;
		font-size: 30rpx;
		color: #fff;
	}
</style>