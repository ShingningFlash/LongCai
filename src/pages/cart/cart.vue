<template>
	<view class="shoppingTrolley">
		<!-- 顶部提示和管理部分 -->
		<view class="top">
			<view class="status">购物车</view>
			<view class="tips">
				<view class="info">共{{cartList.length}}件物品，快快下单带回家</view>
				<view class="info" @click="changeOrderStatus">管理</view>
			</view>
		</view>
		<!-- 有商品时购物车列表部分 -->
		<view class="list" v-if="cartList.length != 0">
			<view class="listBox" v-for="(item,index) in cartList" :key="index">
				<view class="listCheckBox" @click="CartChangeInfoFun(item.id,item.selected,item.goods_num)">
					<radio color='#667D8B' :checked="item.selected == 0 ? false : true" />
				</view>
				<view class="listCtn">
					<image :src="item.original_img"></image>
				</view>
				<view class="listRgt">
					<view class="listRgtName">{{item.goods_name}}</view>
					<text class="listRgtNum">{{item.spec_key_name}}</text>

					<!-- <view class="file-item-name-box">
						<view class="file-item-name">
							<text @click="clickJumpUpLoadFileFun(item.id)">上传文件</text>
						</view>
					</view> -->


					<view class="file-item-name-box" v-if="item.file.length != 0">
						<view class="file-item-name">
							<text>{{item.file[0].filename}}</text>
						</view>
						<view class="file-item-name" v-if="item.file.length > 1">
							<text>......</text>
						</view>
					</view>



					<view class="listBtm">
						<view class="btmLeft">
							<view class="goods-price">
								<text>￥</text><text style="font-size: 32rpx;">{{item.goods_price}}</text>
							</view>
						</view>
						<view class="btmRgt">
							<view :class="item.goods_num == 1 ? 'active subtract':'subtract'"
								@click="changenum(item.id,item.selected,item.goods_num,0)">-</view>
							<view class="num">{{item.goods_num}}</view>
							<view class="add" @click="changenum(item.id,item.selected,item.goods_num,1)">+</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 购物车无商品时部分 -->
		<view class="notimg" v-else>
			<image src="https://tm.ydlweb.com/icons/null-cart.png" mode="widthFix"></image>
			<p>暂无数据。请添加商品</p>
		</view>
		<!-- 底部操作部分 -->
		<view class="btmTab">
			<view class="leftRadio" @click="CartChangeAllFun">
				<radio color='#667D8B' :checked="allRadio" />全选
			</view>
			<view class="ctnNum" v-if="!delShow">
				<span>合计：</span>
				<span>¥</span>
				<span>{{AllPrice}}</span>
			</view>
			<view class="rgtBtn" v-if="!delShow" @click="clickJumpOrder('/pages/payment/payment')">结算</view>
			<view class="rgtBtn" v-if="delShow" @click="CartDeleteFun">删除</view>
		</view>
		<!-- 猜你喜欢部分开始 -->
		<!-- <view class="list2">
			<view class="listTitle">
				<view></view>
				<view>猜你喜欢</view>
				<view></view>
			</view>
			<view class="listItem">
				<view class="listBox" v-for="(item,index) in 5" :key="index">
					<image src="../../static/images/guess-you-like1.png"></image>
					<view class="text">
						<view class="name">画册印刷企业宣传册制作样本</view>
						<view class="price">¥39.00</view>
					</view>
				</view>
			</view>
		</view> -->
		<!-- 猜你喜欢部分结束 -->
		<!-- 没登陆的隐形遮罩层 -->
		<view class="login" v-if="!loginPhone||!loginUser_id" @click="tapLogin"></view>
	</view>
</template>
<script>
	import {
		CartAllList, // 购物车列表 接口
		CartChangeInfo, // 购物车商品的选中状态以及数量加减 接口
		CartChangeAll, // 全选、全不选 接口
		CartDelete // 删除购物车商品 接口
	} from '@/api/order.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				cartList: [], // 购物车商品列表数据
				allRadio: true, // 全选单选框按钮标识
				delShow: false, // 删除单选框按钮标识
				AllPrice: 0.00, // 总金额
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
			this.CartAllListFun()
		},
		methods: {
			// 购物车页面跳转到上传文件页面
			clickJumpUpLoadFileFun(cartid) {
				uni.navigateTo({
					url: '/pages/uploadFile/uploadFile?cart_id=' + cartid + '&cart=' +
						true
				})
			},
			// 获取购物车列表数据
			CartAllListFun() {
				CartAllList({}, (res) => {
					console.log('获取到的购物车列表数据res', res)
					if (res.status == 1) {
						this.allRadio = true
						this.cartList = res.result
						this.AllPrice = res.allprice
						for (let i = 0; i < this.cartList.length; i++) {
							if (this.cartList[i].selected == 0) {
								this.allRadio = false
								return;
							}
						}
					} else {
						this.cartList = []
						this.AllPrice = 0.00
						this.allRadio = false
						// uni.showToast({
						// 	title: res.msg,
						// 	icon: 'none'
						// })
					}
				})
			},
			// 删除购物车商品数据
			CartDeleteFun() {
				let cartDelIdArr = []
				let cartDelId = ''
				for (let i = 0; i < this.cartList.length; i++) {
					if (this.cartList[i].selected) {
						cartDelIdArr.push(this.cartList[i].id)
					}
				}
				cartDelId = cartDelIdArr.join(",");
				CartDelete({
					ids: cartDelId
				}, (res) => {
					console.log('删除购物车商品返回的数据res', res)
					if (res.status == 1) {
						this.CartAllListFun()
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 修改订单操作状态
			changeOrderStatus() {
				this.delShow = !this.delShow
			},
			// 全选、全不选
			CartChangeAllFun() {
				this.allRadio = !this.allRadio
				CartChangeAll({
					is_select: this.allRadio == false ? 0 : 1
				}, (res) => {
					console.log('全选全不选返回的数据res', res)
					this.CartAllListFun()
				})
			},
			// 修改购物车商品的数量
			changenum(cartid, cartsel, cartnum, type) {
				if (type == 0) {
					if (cartnum > 1) {
						cartnum = cartnum - 1
					} else {
						return;
					}
				} else if (type == 1) {
					cartnum += 1
				}
				let data = {
					rec_id: cartid,
					is_select: cartsel,
					goods_number: cartnum
				}
				CartChangeInfo(data, (res) => {
					if (res.status == 1) {
						this.CartAllListFun()
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 修改购物车商品的选中状态
			CartChangeInfoFun(cartid, cartsel, cartnum) {
				if (cartsel == 0) {
					cartsel = 1
				} else if (cartsel == 1) {
					cartsel = 0
				}
				let data = {
					rec_id: cartid,
					is_select: cartsel,
					goods_number: cartnum
				}
				CartChangeInfo(data, (res) => {
					if (res.status == 1) {
						this.CartAllListFun()
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},

			// 跳转到订单结算页
			clickJumpOrder(e) {
				// let haveGoods = false

				if (this.cartList.length == 0) {
					return uni.showToast({
						title: '请选择结算商品',
						icon: 'none'
					})
				}
				
				// if (this.cartList.length != 0) {
				// 	for (let i = 0; i < this.cartList.length; i++) {
				// 		if (this.cartList[i].selected == 1) {
				// 			haveGoods = true
				// 			if (this.cartList[i].file.length == 0) {
				// 				return uni.showToast({
				// 					title: '请上传文件',
				// 					icon: 'none'
				// 				})
				// 			}

				// 		}
				// 	}
				// }
				// if (!haveGoods) {
				// 	return uni.showToast({
				// 		title: '请选择结算商品',
				// 		icon: 'none'
				// 	})
				// }

				uni.navigateTo({
					url: e
				})
			},
			// 路由跳转
			clickJump(e) {
				uni.navigateTo({
					url: e
				})
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
		}
	}
</script>
<style>
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

	.list2 .listItem .listBox .text .price {
		font-weight: 400;
		font-size: 27rpx;
		color: #ff0000;
		padding-top: 10rpx;
	}

	.list2 .listItem .listBox .text .name {
		font-weight: 400;
		font-size: 28rpx;
		color: #2e2e2e;
	}

	.list2 .listItem .listBox .text {
		padding: 20rpx;
		border-radius: 0 0 12rpx 12rpx;
		background: #fff;
	}

	.list2 .listItem .listBox image {
		width: 330rpx;
		height: 275rpx;
		border-radius: 12rpx 12rpx 0 0;
		display: block;
	}

	.list2 .listItem .listBox {
		width: 330rpx;
		margin-top: 30rpx;
	}

	.list2 .listItem {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding-bottom: 30rpx;

	}

	.list2 .listTitle view:nth-child(3) {
		width: 43rpx;
		height: 2rpx;
		background-color: #1e1e1e;
	}

	.list2 .listTitle view:nth-child(2) {
		font-weight: 700;
		font-size: 32rpx;
		color: #1e1e1e;
		margin: 0rpx 30rpx;
	}

	.list2 .listTitle view:nth-child(1) {
		width: 43rpx;
		height: 2rpx;
		background-color: #1e1e1e;
	}

	.list2 .listTitle {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.list2 {
		background-color: transparent;
		padding: 20rpx 20rpx 120rpx;
	}




	.top .tips .info {
		font-weight: 400;
		font-size: 24rpx;
		color: #fff;
		margin-top: 10rpx;
	}

	.top .tips {
		display: flex;
		justify-content: space-between;
		padding: 0rpx 20rpx;
	}

	.top .status {
		font-weight: 400;
		font-size: 32rpx;
		color: #fff;
		padding: 0 20rpx;
	}

	.top {
		display: flex;
		flex-direction: column;
		width: 100%;
		/* justify-content: space-between; */
		position: fixed;
		top: -1rpx;
		height: 200rpx;
		z-index: -1;
		background-color: #667D8B;
	}



	.notimg {
		text-align: center;
		margin-top: 120rpx;
	}

	.notimg image {
		width: 500rpx;
	}

	.notimg p {
		margin-top: 30rpx;
		font-size: 30rpx;
		font-weight: bold;
	}

	.btmTab .rgtBtn:active {
		background-color: #667D8B;
	}

	.btmTab .rgtBtn {
		width: 200rpx;
		padding: 15rpx 0;
		background-color: #667D8B;
		color: #fff;
		text-align: center;
		border-radius: 50rpx;
		margin-left: auto;
	}

	.btmTab .ctnNum span:nth-child(3) {
		font-size: 34rpx;
		line-height: 34rpx;
	}

	.btmTab .ctnNum span:nth-child(2) {
		line-height: 40rpx;
	}

	.btmTab .ctnNum span:nth-child(2),
	.btmTab .ctnNum span:nth-child(3) {
		color: #FF0000;
	}

	.btmTab .ctnNum {
		margin-left: 70rpx;
		display: flex;
		align-items: center;
	}

	.btmTab .leftRadio radio {
		margin-right: 10rpx;
	}

	.btmTab .leftRadio {
		color: #B8B8B8;
	}

	.btmTab {
		display: flex;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		padding: 20rpx 30rpx;
	}

	.list .listBox .listRgt .listBtm .btmRgt .num {
		width: 60rpx;
		text-align: center;
		font-size: 32rpx;
	}

	.list .listBox .listRgt .listBtm .btmRgt .active,
	.list .listBox .listRgt .listBtm .btmRgt .active {
		background-color: #F8E0C4 !important;
	}

	.list .listBox .listRgt .listBtm .btmRgt .subtract,
	.list .listBox .listRgt .listBtm .btmRgt .add {
		background-color: #667D8B;
		border-radius: 50%;
		width: 30rpx;
		height: 30rpx;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.list .listBox .listRgt .listBtm .btmRgt {
		display: flex;
		align-items: center;
	}

	.list .listBox .listRgt .listBtm .btmLeft .goods-sales {
		color: #ff0000;
	}

	.list .listBox .listRgt .listBtm .btmLeft .goods-price {
		color: #ff0000;
	}

	.list .listBox .listRgt .listBtm .btmLeft {
		font-size: 22rpx;
		flex: 1;
	}

	.list .listBox .listRgt .listBtm {
		display: flex;
		align-items: center;
		margin-top: 30rpx;
	}
	.list .listBox .listRgt .file-item-name-box .file-item-name {
		width: 300rpx;
		word-break: keep-all;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.list .listBox .listRgt .file-item-name-box .file-item-name text {
		font-size: 20rpx;
		color: #666;
		font-weight: 400;
		margin-top: 10rpx;
		padding: 0rpx 20rpx;
		background-color: #f5f5f5;
	}

	.list .listBox .listRgt .listRgtNum {
		font-size: 20rpx;
		color: #666;
		font-weight: 400;
		margin-top: 10rpx;
		padding: 0rpx 20rpx;
		background-color: #f5f5f5;
	}

	.list .listBox .listRgt .listRgtName {
		font-size: 30rpx;
		font-weight: 400;
		color: #2E2E2E;
	}

	.list .listBox .listRgt {
		margin-left: 20rpx;
		flex: 1;
	}

	.list .listBox .listCtn image {
		height: 100%;
		width: 100%;
	}

	.list .listBox .listCtn {
		width: 250rpx;
		height: 200rpx;
		margin-left: 20rpx;
	}

	.list .listBox:nth-child(1) {
		margin-top: 0;
	}

	.list .listBox {
		display: flex;
		align-items: center;
		margin-top: 50rpx;
	}

	.list {
		background-color: #fff;
		margin: 120rpx 20rpx 0;
		border-radius: 15rpx;
		padding: 30rpx 30rpx;
	}

	.edit p {
		color: #756C61;
		font-size: 26rpx
	}

	.edit .editIcon image {
		height: 100%;
		width: 100%;
		vertical-align: super;
	}

	.edit .editIcon {
		width: 28rpx;
		height: 28rpx;
		margin-right: 20rpx;
	}

	.edit {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 20rpx;
		margin: 20rpx 0;
	}

	.background image {
		width: 120%;
		height: 100%;
	}

	.background {
		position: fixed;
		top: -50rpx;
		width: 100%;
		height: 300rpx;
		z-index: -1;
	}

	page {
		background-color: #F1F1F1;
	}
</style>
