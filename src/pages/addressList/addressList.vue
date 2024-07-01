<template>
	<view>
		<view class="list">
			<view class="listBox" v-for="(item,index) in addressList" :key="index" @click="orderSel(item)">
				<view class="listItem">
					<view class="name">{{item.consignee}}</view>
					<view class="phone">{{item.mobile}}</view>
				</view>
				<view class="address" style="border-bottom: 0;">
					<text>{{item.province}}{{item.city}}{{item.district}}{{item.address}}</text>
				</view>
				<view class="bun">
					<view class="left" @click="UserAddressDefaultFun(item.address_id,item.is_default)">
						<radio style="transform:scale(0.7)" :checked="item.is_default == 1 ? true : false"
							color="#667D8B"></radio>
						<view>选择该地址为默认地址</view>
					</view>
					<view class="right">
						<view class="rightItem"
							@click.stop="clickJump('/pages/addAndEditAddress/addAndEditAddress',item.address_id)">
							<image src="https://tm.ydlweb.com/icons/editor.png"></image>
							<view>编辑</view>
						</view>
						<view class="rightItem" @click.stop="UserAddressDelete(item.address_id)">
							<image src="https://tm.ydlweb.com/icons/delete.png"></image>
							<view>删除</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="addAddress-box">
			<view class="addAddress-warp" @click="clickJump('/pages/addAndEditAddress/addAndEditAddress',undefined)">
				<view class="add-icon-box">
					<image src="https://tm.ydlweb.com/icons/add.png" mode=""></image>
				</view>
				<view class="add-title">
					<text>新增地址</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		UserAddressList, // 获取 地址列表 接口
		UserAddressDefault, // 修改地址为默认 接口
		UserAddressDelete // 删除地址 接口
	} from '@/api/index.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				addressList: [], // 地址列表数据
				order_select: false, // 从支付订单处跳转过来选择地址的标识
			}
		},
		onLoad(option) {
			that = this
			if (option.order_select) {
				this.order_select = option.order_select
			} else {
				this.order_select = false
			}
		},
		onShow() {
			this.UserAddressList()
		},
		methods: {
			// 修改地址为默认
			UserAddressDefaultFun(addressid, isdefault) {
				if (isdefault == 1) {
					return;
				}
				UserAddressDefault({
					address_id: addressid
				}, (res) => {
					console.log('修改地址为默认返回的数据res', res)
					if (res.status == 1) {
						this.UserAddressList()
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 从订单处跳转过来选地址
			orderSel(obj) {
				if (this.order_select) {
					let pages = getCurrentPages(); //获取所有页面栈实例列表
					let nowPage = pages[pages.length - 1]; //当前页页面实例
					let prevPage = pages[pages.length - 2]; //上一页页面实例
					prevPage.$vm.addressData = obj; //修改上一页data里面的addressData参数值为obj
					uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
						delta: 1
					});
				}
			},
			// 获取 地址列表 接口
			UserAddressList() {
				UserAddressList({}, (res) => {
					// console.log('地址列表返回的数据res',res)
					if (res.status == 1) {
						this.addressList = res.result
						// console.log('地址列表返回的数据', this.addressList)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 删除地址
			UserAddressDelete(addressid) {
				uni.showModal({
					title: '是否删除该地址',
					success: (res) => {
						if (res.confirm) {
							UserAddressDelete({
								address_id: addressid
							}, function(res) {
								if (res.status == 1) {
									that.UserAddressList()
									uni.showToast({
										title: res.msg,
										icon: 'none'
									})
								} else {
									uni.showToast({
										title: res.msg,
										icon: 'none'
									})
								}
							})
						}

					}
				})
			},
			// 路由跳转
			clickJump(e, addressid) {
				uni.navigateTo({
					url: e + '?address_id=' + addressid
				})
			},
		},
	}
</script>
<style lang="scss">
	// 新增地址按钮部分
	.addAddress-box {
		position: fixed;
		bottom: 30rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		.addAddress-warp {
			width: 360rpx;
			height: 78rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #667D8B;
			border-radius: 50rpx;

			.add-icon-box {
				display: flex;
				width: 25rpx;
				height: 25rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.add-title {
				padding-left: 10rpx;
				font-size: 32rpx;
				font-weight: 700;
				color: #fff;
			}
		}
	}

	// 地址列表部分

	.list {
		margin-bottom: 130rpx;
		padding: 0rpx 20rpx;

		.listBox {
			background-color: #fff;
			border-radius: 30rpx;
			border-radius: 12rpx;
			margin-top: 20rpx;
			padding: 20rpx 30rpx;

			.listItem {
				display: flex;
				align-items: center;

				.name {
					font-weight: bold;
					font-size: 30rpx;
					color: #333;
					margin-right: 10rpx;
					margin-left: 10rpx;
				}

				.phone {
					font-weight: 400;
					font-size: 30rpx;
					color: #333;
				}
			}

			.address {
				font-weight: 400;
				font-size: 24rpx;
				color: #999;
				padding: 10rpx 0rpx 20rpx 10rpx;
				border-bottom: 1rpx solid #C3C4CC;
			}

			.bun {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 10rpx;

				.left {
					display: flex;
					align-items: center;


					view {
						font-weight: 400;
						font-size: 26rpx;
						color: #333;
					}
				}

				.right {
					display: flex;
					align-items: center;

					.rightItem {
						display: flex;
						align-items: center;
						font-weight: 400;
						font-size: 26rpx;
						color: #666;
						margin-right: 30rpx;
					}

					.rightItem:nth-child(1) {
						image {
							width: 25rpx;
							height: 25rpx;
							margin-right: 10rpx;
						}
					}

					.rightItem:nth-child(2) {
						image {
							width: 25rpx;
							height: 25rpx;
							margin-right: 10rpx;
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
