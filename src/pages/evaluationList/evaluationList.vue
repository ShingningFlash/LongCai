<template>
	<view>
		<view class="order-list-box">
			<view class="order-list-warp">
				<view class="order-list-item" v-for="(item,index) in goodsObj.goods_list" :key='index'>
					<view class="order-list-item-middle">
						<view class="order-list-item-middle-left">
							<image :src="item.original_img" mode=""></image>
						</view>
						<view class="order-list-item-middle-right">
							<view class="order-list-item-middle-right-top">
								<view class="order-list-item-middle-right-top-name">
									<text>{{item.goods_name}}</text>
								</view>
								<view class="order-list-item-middle-right-top-spac">
									<text>{{item.spec_key_name}}</text>
								</view>
							</view>
							<view class="order-list-item-middle-right-bottom">
								<view class="order-list-item-middle-right-bottom-price">
									￥<text>{{item.goods_price}}</text>
								</view>
								<view class="order-list-item-middle-right-bottom-number">
									<text>x{{item.goods_num}}</text>
								</view>
							</view>
						</view>
					</view>

					<view class="order-list-item-bottom">
						<view class="order-list-item-bottom-warp">
							<!-- <text class="text2" v-if="tabIndex == 4">再次购买</text>
							<text class="text2" v-if="tabIndex == 3">申请售后</text> -->
							<text class="text1"
								@click="clickJump('/pages/evaluationSubmit/evaluationSubmit?order_id'+goodsObj.order_id+'&red_id='+item.rec_id)">去评价</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import {

	// } from '@/api/order.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				goodsObj: {}, // 传过来的订单数据对象
			}
		},
		onLoad(option) {
			if (option.goodsObj) {
				this.goodsObj = JSON.parse(option.goodsObj)
				console.log('订单数据res', this.goodsObj)
			}
		},
		methods: {

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
	.order-list-box {
		background-color: #fff;
		margin-top: 20rpx;
		padding: 0rpx 30rpx 0rpx;

		.order-list-warp {
			background-color: #f5f5f5;

			.order-list-item {
				box-shadow: 5rpx 8rpx 10rpx rgba($color: #6d6d6d, $alpha: 0.2);
				margin-bottom: 20rpx;
				padding-top: 30rpx;
				border-radius: 10rpx;

				// 订单产品部分
				.order-list-item-middle {
					display: flex;
					justify-content: space-between;
					padding: 0rpx 20rpx 0;

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

				.order-list-item-bottom {
					.order-list-item-bottom-warp {
						display: flex;
						justify-content: flex-end;
						padding: 20rpx 20rpx 20rpx 0;

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
			}
		}
	}
</style>
