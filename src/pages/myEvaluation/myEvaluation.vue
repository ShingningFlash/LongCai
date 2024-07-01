<template>
	<view>
		<!-- tabs栏部分 -->
		<view class="orderTab">
			<scroll-view :scroll-x="true" :enable-flex='true'
				style="display: flex;justify-content: space-around;height: 70rpx;">
				<view class="tabBox" v-for="(item,index) in tabList" :key="index" @click="Setstatus(item.index)">
					<span :class=" tabIndex == item.index ? 'active' : '' ">{{item.name}}</span>
				</view>
			</scroll-view>
		</view>

		<!-- 全部评价列表部分 -->
		<view class="bottom-box">
			<view class="bottom-warp">
				<!-- 用户评价详情部分 -->
				<view class="evalution-list-box">
					<!-- 循环数据从这里开始 -->
					<!-- ========== -->
					<view class="evalution-list-item-box" v-for="(item,index) in myEvaluateData" :key='index'>
						<view class="item-top-box">
							<view class="item-head-box">
								<image :src="item.userInfo.head_pic" mode=""></image>
							</view>
							<view class="item-name-box">
								<view class="item-name">{{item.userInfo.nickname}}</view>
								<view class="item-vealuation-bottom-box">
									<text>{{item.goodsComment.add_time}}</text><text class="tips">评价</text>
								</view>
							</view>
						</view>
						<view class="item-bottom-box">
							<view class="item-vealuation-box">
								<view class="item-vealuation-top-box">
									<text>{{item.goodsComment.content}}</text>
								</view>
								<view class="item-vealuation-middle-box">
									<image :src="item2" v-for="(item2,index2) in item.goodsComment.img" :key="index2">
									</image>
								</view>
								<view class="item-vealuation-bottom-box-type">
									<view class="item-vealuation-bottom-box-type-left">
										<text
											v-if="item.goodsComment && item.goodsComment.goods_rank != '' && item.goodsComment.goods_rank != null && item.goodsComment.goods_rank != undefined">综合评分：{{item.goodsComment.goods_rank}}星</text>
										<text v-else>综合评分：暂未评价</text>
									</view>
									<view class="item-vealuation-bottom-box-type-right">
										<text>{{item.spec_key_name}}</text>
									</view>
								</view>
								<!-- 客服回复部分 -->
								<!-- <view class="serve-reply-box" v-if="item.reply != '' || item.reply != null"
									v-for="(item2,index2) in item.reply" :key='index2'>
									<view class="serve-reply-warp">
										<text class="text1">商家</text><text class="text2">{{item2.connent}}</text>
									</view>
								</view> -->
								<!-- 商品展示部分 -->
								<view class="serve-reply-box" @click="clickJimp(item.goods_id)">
									<view class="goods-img">
										<image :src="item.goodsOne.original_img" mode=""></image>
									</view>
									<view class="serve-reply-warp">
										<text class="text2">{{item.goodsOne.goods_name}}</text>
									</view>
								</view>

							</view>
						</view>
					</view>
					<!-- ================= -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		MyEvaluate // 我的商品评价列表 接口
	} from '@/api/order.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				tabList: [{
						name: '待评论',
						index: 0
					},
					{
						name: '已评论',
						index: 1
					}
				],
				tabIndex: 0, // 状态栏标识 
				myEvaluateData: [], // 我的评价信息数据
			}
		},
		onShow() {
			this.MyEvaluateFun()
		},
		methods: {
			// 获取我的商品评价列表 数据
			MyEvaluateFun() {
				let data = {
					is_comment: this.tabIndex
				}
				MyEvaluate(data, (res) => {
					console.log('我的评价返回的数据res', res)
					if (res.status == 1) {
						this.myEvaluateData = res.result
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 选择顶部订单状态事件
			Setstatus(e) {
				this.tabIndex = e
				this.MyEvaluateFun()
			},
			// 路由跳转
			clickJimp(goodsid) {
				uni.navigateTo({
					url: '/pages/goodsDetail/goodsDetail?goods_id=' + goodsid
				})
			},
		}
	}
</script>

<style lang="scss">
	// tabs栏部分
	.orderTab {
		background-color: #fff;
		padding: 30rpx 30rpx 0rpx;

		.tabBox {
			display: flex;
			justify-content: space-around;
			font-size: 28rpx;
			font-weight: 400;
			color: #2e2e2e;
			flex-shrink: 0;

			span {
				position: relative;
			}

			.active::after {
				content: '';
				position: absolute;
				bottom: 10rpx;
				left: 0;
				width: 100%;
				height: 8rpx;
				background-color: #667D8B;
				border-radius: 4.35rpx 4.35rpx 0 0;
			}
		}
	}

	//全部评价列表部分
	.bottom-box {
		padding: 0rpx 0rpx 0;

		.bottom-warp {
			background-color: #fff;
			padding: 0rpx 44rpx 0;

			.evalution-list-box {
				background-color: #f5f5f5;
				padding-top: 23rpx;

				.evalution-list-item-box {
					background-color: #fff;
					padding: 20rpx 0;
					margin-bottom: 20rpx;

					.item-top-box {
						display: flex;
						width: 100%;

						.item-head-box {
							width: 76rpx;
							height: 76rpx;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.item-name-box {
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							padding-left: 18rpx;

							.item-name {
								font-size: 28rpx;
								font-weight: 700;
								color: #1e1e1e;
							}

							.item-vealuation-bottom-box {
								padding-bottom: 20rpx;
								padding-top: 5rpx;
								font-size: 24rpx;
								font-weight: 400;
								color: #9e9e9e;

								.tips {
									padding-left: 20rpx;
								}
							}
						}
					}

					.item-bottom-box {
						display: flex;
						width: 100%;
						padding-top: 20rpx;

						.item-head-box {
							width: 76rpx;
							height: 76rpx;
						}

						.item-vealuation-box {
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							padding-left: 18rpx;

							.item-vealuation-top-box {
								font-size: 28rpx;
								font-weight: 400;
								color: #1e1e1e;
							}

							.item-vealuation-middle-box {
								display: flex;
								flex-wrap: wrap;
								align-content: flex-start;
								padding: 20rpx 0;

								image {
									width: 170rpx;
									height: 170rpx;
									margin-right: 15rpx;
								}

								// image:nth-child(3n + 1) {
								// 	margin-left: 15rpx;
								// }
							}

							.item-vealuation-bottom-box-type {
								display: flex;
								align-items: center;
								padding: 10rpx 0;

								.item-vealuation-bottom-box-type-left {
									padding-right: 15rpx;
									border-right: 1rpx solid #ddd;
									font-size: 24rpx;
									font-weight: 400;
									color: #9e9e9e;
								}

								.item-vealuation-bottom-box-type-right {
									padding-left: 15rpx;
									font-size: 24rpx;
									font-weight: 400;
									color: #9e9e9e;
								}
							}

							.serve-reply-box {
								display: flex;
								background-color: #F3F4F6;
								padding: 20rpx 10rpx;
								border-radius: 10rpx;

								.goods-img {
									width: 105rpx;
									height: 85rpx;

									image {
										border-radius: 5rpx;
										width: 100%;
										height: 100%;
									}
								}

								.serve-reply-warp {
									flex: 1;
									display: flex;
									align-items: center;
									padding-left: 20rpx;

									.text2 {
										font-size: 26rpx;
										font-weight: 400;
										color: #2e2e2e;
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>
