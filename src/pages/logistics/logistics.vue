<template>
	<view class="logistics">
		<view class="backImg">
			<image src="https://tm.ydlweb.com/icons/bg.png"></image>
		</view>
		<view class="state">
			<view class="top">订单状态</view>
			<view class="ctn">{{orderData.status_name}}</view>
			<view class="btm">订单编号：{{orderData.order_sn}}</view>
		</view>
		<view class="logisticsMessage">
			<view class="title">物流信息</view>
			<view class="logisticsBox">
				<!-- ==================== -->
				<view :class="index == 0?'isShow':'logisticsView'" v-for="(item,index) in expressData.list"
					:key='index'>
					<view class="logisticsText">{{item.status}}</view>
					<view class="logisticsTime">{{item.time}}</view>
				</view>
				<!-- <view :class="true?'isShow':'logisticsView'">
					<view class="logisticsText">客户已签收，欢迎您再次光临，祝您身体每天 陪棒，生活愉快！！！</view>
					<view class="logisticsTime">2021-05-31 17:49:00</view>
				</view>
				<view :class="false?'isShow':'logisticsView'">
					<view class="logisticsText">快递已到广州市，请留意信息！</view>
					<view class="logisticsTime">2021-05-30 17:49:00</view>
				</view>
				<view :class="false?'isShow':'logisticsView'">
					<view class="logisticsText">商家已发货，请注意查收！</view>
					<view class="logisticsTime">2021-05-28 17:49:00</view>
				</view> -->
				<!-- ***************** -->
			</view>
			<view class="btmbox">
				<view class="btnleftbox">
					<text>运单号：</text><text>{{expressData.number}}</text>
				</view>
				<view class="btnleftbox">
					<text>物流公司：</text><text>{{expressData.expName}}</text>
				</view>
			</view>
		</view>
		<view class="orderListBox">
			<view class="goodsTop">
				<!-- ============ -->
				<view class="goodsBox" v-for="(item,index) in orderGoodsData" :key="index">
					<view class="left">
						<image :src="item.original_img"></image>
						<!-- <image src="../../static/image/goods1.png"></image> -->
					</view>
					<view class="right">
						<view class="rightTop">
							<view>{{item.goods_name}}</view>
							<view>×1</view>
						</view>
						<view class="rightDesc">{{item.spec_key_name}}</view>
						<view class="rightPrice">
							<view class="remket">￥<span class="remketBox">{{item.goods_price}}</span></view>
						</view>
					</view>
				</view>
				<!-- =================== -->

				<!-- **************** -->
				<view class="orderCtn">
					<view class="ctnBox">
						<view class="leftTitle">订单编号</view>
						<view class="rightNum">{{orderData.order_sn}}</view>
					</view>
					<view class="ctnBox">
						<view class="leftTitle">订单状态</view>
						<!-- <view class="rightNum">待付款</view> -->
						<!-- <view class="rightNum">待发货</view> -->
						<view class="rightNum">{{orderData.status_name}}</view>
						<!-- <view class="rightNum">已取消</view> -->
						<!-- <view class="rightNum">已完成</view> -->
					</view>
					<view class="ctnBox">
						<view class="leftTitle">订单日期</view>
						<view class="rightNum">{{orderData.shipping_time}}</view>
					</view>
				</view>
				<view class="price">
					<view class="lf">共{{orderGoodsData.length}}件商品</view>
					<view class="ctn">总计：</view>
					<view class="rgt">
						<span>¥</span>
						<span>{{orderData.total_amount}}</span>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		UserOrderInfo, // 订单详情 接口
		GetShippingData // 查询物流 接口
	} from '@/api/order.js'
	let that, app = getApp()
	export default {

		data() {
			return {
				order_id: null, // 订单id
				express_sn: null, //物流单号
				orderData: {}, // 订单详情数据
				orderGoodsData: [], // 订单商品列表数据
				expressData: {}, // 物流信息
			}
		},
		onLoad(e) {
			that = this
			if (e.order_id) {
				this.order_id = e.order_id
				this.UserOrderInfoFun(this.order_id)
			}
			// if (e.express_sn) {
			// 	this.express_sn = e.express_sn
			// 	this.GetShippingDataFun(this.express_sn)
			// }
		},
		methods: {
			// 获取订单详情数据
			UserOrderInfoFun(orderid) {
				UserOrderInfo({
					order_id: orderid
				}, (res) => {
					console.log('订单详情返回的数据res', res)
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
			// 查询物流
			GetShippingDataFun(expressSn) {
				GetShippingData({
					express_sn: expressSn
				}, (res) => {
					console.log('物流信息res', res)
					if (res.status == 1) {
						this.expressData = res.result
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}

				})
			},
		},
	}
</script>
<style>
	.logisticsMessage .logisticsBox .logisticsView .logisticsText {
		color: #3b3b3b;
		font-size: 26rpx;
	}

	.logisticsMessage .logisticsBox .logisticsView .logisticsTime {
		color: #a7a7a7;
		font-size: 22rpx;
	}

	.logisticsMessage .logisticsBox .isShow .logisticsText {
		color: #667D8B;
		font-size: 26rpx;
	}

	.logisticsMessage .logisticsBox .isShow .logisticsTime {
		color: #667D8B;
		font-size: 22rpx;
	}

	.orderListBox {
		margin: 30rpx 30rpx 80rpx 30rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 0rpx 30rpx 30rpx 30rpx;

	}

	.logisticsMessage .logisticsBox .logisticsView:last-child::before,
	.logisticsMessage .logisticsBox .isShow:last-child::before {
		display: none;
	}

	.logisticsMessage .logisticsBox .isShow::before,
	.logisticsMessage .logisticsBox .logisticsView::before {
		content: '';
		position: absolute;
		left: 9rpx;
		top: 5rpx;
		width: 1px;
		height: 100%;
		background-color: #667D8B;
	}

	.logisticsMessage .logisticsBox .isShow::after {
		content: '';
		position: absolute;
		left: -10rpx;
		top: 5rpx;
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		background-color: #667D8B;
		border: 10rpx solid #bce7ff;
	}

	.logisticsMessage .logisticsBox .logisticsView::after {
		content: '';
		position: absolute;
		left: 0;
		top: 5rpx;
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		background-color: #9D9D9D;
	}

	.logisticsMessage .logisticsBox .logisticsView,
	.logisticsMessage .logisticsBox .isShow {
		padding: 0 60rpx 40rpx;
		position: relative;
	}

	.logisticsMessage .btmbox {
		display: flex;
		justify-content: space-between;
		font-size: 26rpx;
		color: #787878;
	}


	.logisticsMessage .logisticsBox {
		margin-top: 30rpx;
	}

	.logisticsMessage .title {
		font-size: 30rpx;
		font-weight: 600;
		color: #000000;
	}

	.logisticsMessage {
		padding: 30rpx;
		background-color: #fff;
		margin: 30rpx 30rpx 0;
		border-radius: 10rpx;
	}

	.state .btm {
		margin-top: 25rpx;
	}

	.state .ctn {
		font-size: 36rpx;
		/* font-weight: 600; */
		margin-top: 15rpx;
		color: #000000;
	}

	.state .top {
		font-size: 24rpx;
		color: #B1B1B1;
	}

	.state .btm {
		font-size: 26rpx;
		color: #B1B1B1;
	}

	.state {
		background-color: #fff;
		margin: 40rpx 30rpx 30rpx;
		border-radius: 10rpx;
		padding: 32rpx 28rpx;
	}

	.backImg image {
		width: 120%;
		height: 100%;
	}

	.backImg {
		position: fixed;
		top: -50rpx;
		width: 100%;
		height: 300rpx;
		z-index: -1;
	}

	.goodsBox {
		display: flex;
		flex: 1;
		height: 180rpx;
		overflow: hidden;
		padding-top: 30rpx;
	}

	.goodsBox .left image {
		width: 178rpx;
		height: 178rpx;
	}

	.goodsBox .right .rightText {
		flex: 1;
	}

	.goodsBox .right {
		flex: 1;
		margin-left: 20rpx;
	}

	.goodsBox .right .rightTop {
		display: flex;
		justify-content: space-between;
	}

	.goodsBox .right .rightTop view:nth-child(1) {
		font-size: 30rpx;
		font-weight: 600;
		color: #2A2A2A;
	}

	.goodsBox .right .rightDesc {
		color: #bebebe;
		font-size: 26rpx;
		margin: 15rpx 0;
	}

	.goodsBox .right .rightPrice {
		display: flex;
		align-items: center;
	}

	.goodsBox .right .rightPrice .remket {
		color: red;
		font-size: 24rpx;
		margin-right: 20rpx;
		color: #FF0000;
	}

	.goodsBox .right .rightPrice .remket .remketBox {
		font-size: 36rpx;
		font-weight: bold;
	}

	.goodsBox .right .rightPrice .cost {
		color: rgba(190, 190, 190);
		font-size: 22rpx;
		text-decoration: line-through
	}

	.orderCtn .ctnBox .rightNum {
		font-size: 26rpx;
		color: #000;
	}

	.orderCtn .ctnBox .leftTitle {
		font-size: 28rpx;
		color: #707070;
		flex: 1;
	}

	.orderCtn .ctnBox {
		display: flex;
		align-items: center;
		margin-top: 25rpx;
	}

	.orderCtn {
		padding-bottom: 30rpx;
		border-bottom: 1px solid #E1E1E1;
	}

	.price .rgt span:nth-child(2) {
		font-size: 40rpx;
	}

	.price .rgt span:nth-child(1) {
		font-size: 26rpx;
	}

	.price .rgt {
		color: #ff0000;
		line-height: 36rpx;
	}

	.price .ctn {
		font-size: 26rpx;
		color: #000000;
	}

	.price .lf {
		font-size: 24rpx;
		color: #9A9A9A;
		margin-right: 15rpx;
	}

	.price {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		margin-top: 30rpx;
	}

	page {
		background-color: #F1F1F1;
	}
</style>
