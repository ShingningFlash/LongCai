<template>
	<view class="accountRecharge">
		<view class="background">
			<image src="https://tm.ydlweb.com/icons/bg.png"></image>
		</view>
		<view class="accountBox">
			<view class="titleNum">
				<p>账户总余额（元）</p>
				<p>{{total_money}}</p>
			</view>
			<view class="titleHint">提现金额</view>
			<view class="priceIpt">
				<view class="leftIcon">¥</view>
				<input type="number" placeholder="0.00" v-model.trin="feemoney">
				<view class="RightIcon" @click="feemoney = total_money">全部提现</view>
			</view>
			<view class="remark"><span>注：</span>每次提现设最低提现款({{price}}元) (提现手续费{{interest}}%)</view>
		</view>
		<view class="btn" @click="WithdrawApplyFun">立即提现</view>
	</view>
</template>
<script>
	import {
		WithdrawApply, // 申请提现 接口
		WithdrawalLimit // 获取最低提现金额 接口
	} from '@/api/user.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				total_money: '0.00', // 总金额
				feemoney: '', // 提现的金额
				price: 0.1, // 限制提现最低金额
				interest: 0.1, // 提现手续费
			}
		},
		onLoad(option) {
			that = this
			if (option.money) {
				this.total_money = option.money
			}
		},
		onShow() {
			this.WithdrawalLimitFun()
		},

		methods: {
			// 获取最低提现金额
			WithdrawalLimitFun() {
				WithdrawalLimit({}, (res) => {
					if (res.status == 1) {
						this.price = res.result.price
						this.interest = res.result.interest
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 申请提现
			WithdrawApplyFun() {

				if (parseFloat(this.feemoney) > parseFloat(this.total_money)) {
					return uni.showToast({
						title: '提现金额不能大于总余额',
						icon: 'none'
					})
				}
				if (parseFloat(this.feemoney) < this.price) {
					return uni.showToast({
						title: '提现金额不能小于' + this.price + '元',
						icon: 'none'
					})
				}
				WithdrawApply({
					withdraw_type: 4,
					fee: this.feemoney
				}, (res) => {
					if (res.status == 1) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/distributionCenter/distributionCenter'
							});
						}, 1000)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>
<style>
	.background image {
		width: 120%;
		height: 100%;
	}

	.background {
		position: fixed;
		top: -50rpx;
		width: 100%;
		height: 200rpx;
		z-index: -1;
		left: 0;
	}

	.btn:active {
		background-color: #718b9a;
	}

	.btn {
		background-color: #667D8B;
		padding: 20rpx;
		border-radius: 50rpx;
		text-align: center;
		color: #fff;
		position: absolute;
		left: 0%;
		right: 0;
		bottom: 5%;
		margin: 0 30rpx;
		font-size: 30rpx
	}

	.selsectBox .leftText {
		flex: 10;
	}

	.selsectBox {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 1px solid #CFCFCF;
		padding: 20rpx 30rpx;
		border-radius: 5rpx;
		margin-top: 20rpx;
	}

	.radio .radioBox .leftRadio .leftRadioBox {
		width: 15rpx;
		height: 15rpx;
		border-radius: 50%;
		background-color: #fff;
		border: 10rpx solid #58A571;

	}

	.radio .radioBox .leftRadio {
		border: 1px solid #DDDDDD;
		border-radius: 50%;
		width: 32rpx;
		height: 32rpx;
	}

	.radio .radioBox .rightText {
		/* margin-left: 10rpx; */
	}

	.radio .radioBox:nth-child(1) {
		margin-left: 0;
	}

	.radio .radioBox {
		margin-left: 45rpx;
	}

	.radio,
	.radio .radioBox {
		display: flex;
		align-items: center;
	}

	.radio {
		margin-top: 30rpx;
	}

	.input {
		border-bottom: 1px solid #DDDDDD;
		margin-top: 30rpx;
		height: 80rpx;

	}

	.input input {
		height: 100%;
		line-height: 80rpx;
	}

	.accountBox .remark span {
		color: red;
	}

	.accountBox .remark {
		color: #BCBCBC;
		margin-top: 30rpx;
		font-size: 24rpx;
	}

	.accountBox .priceIpt input {
		font-size: 46rpx;
		margin-left: 15rpx;
		flex: 1;
	}

	.accountBox .priceIpt .leftIcon {
		font-size: 32rpx;
		line-height: 32rpx;
	}

	.accountBox .priceIpt .RightIcon {
		font-size: 26rpx;
		color: #974621;
	}

	.accountBox .priceIpt {
		display: flex;
		align-items: flex-end;
		padding: 30rpx 0 20rpx;
		border-bottom: 1px solid #DEDEDE;
	}

	.accountBox .titleHint {
		font-size: 28rpx;
		margin-top: 50rpx;
	}

	.accountBox .titleNum p:nth-child(2) {
		color: #ff0000;
		font-size: 60rpx;
		margin-top: 20rpx;
	}

	.accountBox .titleNum p:nth-child(1) {
		color: #818181;
		font-size: 26rpx;
		margin-top: 20rpx;
	}

	.accountBox .titleNum {
		text-align: center;
		color: #818181;
	}

	.accountBox {
		padding: 30rpx 60rpx;
		background-color: #fff;
		margin: 40rpx 30rpx;
		border-radius: 10rpx;
	}

	page {
		background-color: #F5F5F5;
	}
</style>
