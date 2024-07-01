<template>
	<view>
		<!-- 顶部总评价部分 -->
		<view class="top-box">
			<view class="top-warp">
				<!-- 左侧部分 -->
				<view class="top-left-box">
					<view class="top-left-top-box">
						<text>{{rating}}</text>
					</view>
					<view class="top-left-middle-box">
						<template v-for="(val, index) in starSel">
							<image class="img" src="https://tm.ydlweb.com/icons/star-sel.png" mode="aspectFill"></image>
						</template>
						<template v-for="(val, index) in (5-starSel)">
							<image class="img" src="https://tm.ydlweb.com/icons/star.png" mode="aspectFill"></image>
						</template>
					</view>
					<view class="top-left-bottom-box">
						<text>{{evaluationData.count}}条评论</text>
					</view>
				</view>
				<!-- 右侧部分 -->
				<view class="top-right-box">
					<view class="top-right-warp">
						<view class="top-right-item" v-for="(item,index) in 5">
							<view class="class-num">
								<text>{{5-index}}</text>
							</view>
							<!-- ============== -->
							<view class="class-length" v-if="index == 0">
								<u-line-progress :percentage="parseInt((levelList.five/evaluationData.count)*100)"
									height="10" :showText="false" activeColor="#EE565B">
								</u-line-progress>
							</view>
							<view class="class-length" v-if="index == 1">
								<u-line-progress :percentage="parseInt((levelList.four/evaluationData.count)*100)"
									height="10" :showText="false" activeColor="#EE565B">
								</u-line-progress>
							</view>
							<view class="class-length" v-if="index == 2">
								<u-line-progress :percentage="parseInt((levelList.three/evaluationData.count)*100)"
									height="10" :showText="false" activeColor="#EE565B">
								</u-line-progress>
							</view>
							<view class="class-length" v-if="index == 3">
								<u-line-progress :percentage="parseInt((levelList.two/evaluationData.count)*100)"
									height="10" :showText="false" activeColor="#EE565B">
								</u-line-progress>
							</view>
							<view class="class-length" v-if="index == 4">
								<u-line-progress :percentage="parseInt((levelList.one/evaluationData.count)*100)"
									height="10" :showText="false" activeColor="#EE565B">
								</u-line-progress>
							</view>
							<!-- ================== -->
							<view class="class-percentage" v-if="index == 0">
								<text>{{parseInt((levelList.five/evaluationData.count)*100)}}%</text>
							</view>
							<view class="class-percentage" v-if="index == 1">
								<text>{{parseInt((levelList.four/evaluationData.count)*100)}}%</text>
							</view>
							
							<view class="class-percentage" v-if="index == 2">
								<text>{{parseInt((levelList.three/evaluationData.count)*100)}}%</text>
							</view>
							
							
							<view class="class-percentage" v-if="index == 3">
								<text>{{parseInt((levelList.two/evaluationData.count)*100)}}%</text>
							</view>
							
							
							<view class="class-percentage" v-if="index == 4">
								<text>{{parseInt((levelList.one/evaluationData.count)*100)}}%</text>
							</view>
							<!-- ************************ -->
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 全部评价列表部分 -->
		<view class="bottom-box">
			<view class="bottom-warp">
				<view class="top">
					<text>全部评价</text>
				</view>
				<!-- 用户评价详情部分 -->
				<view class="evalution-list-box">
					<!-- 循环数据从这里开始 -->
					<!-- ========== -->
					<view class="evalution-list-item-box" v-for="(item,index) in commentData" :key='index'>
						<view class="item-top-box">
							<view class="item-head-box">
								<image :src="item.head_pic" mode=""></image>
							</view>
							<view class="item-name-box">
								<view class="item-name">{{item.username}}</view>
								<view class="star">
									<template v-for="(val, index) in item.goods_rank">
										<image class="img" src="https://tm.ydlweb.com/icons/star-sel.png" mode="aspectFill">
										</image>
									</template>
									<template v-for="(val, index) in (5-item.goods_rank)">
										<image class="img" src="https://tm.ydlweb.com/icons/star.png" mode="aspectFill"></image>
									</template>
								</view>
							</view>
						</view>
						<view class="item-bottom-box">
							<view class="item-head-box"></view>
							<view class="item-vealuation-box">
								<view class="item-vealuation-top-box">
									<text>{{item.content}}</text>
								</view>
								<view class="item-vealuation-middle-box">
									<image :src="item1" v-for="(item1,index1) in item.img" :key="index1"></image>
								</view>
								<view class="item-vealuation-bottom-box">
									<text>{{item.add_time}}</text>
								</view>
								<!-- 客服回复部分 -->
								<view class="serve-reply-box" v-if="item.replyList.length != 0"
									v-for="(item2,index2) in item.replyList" :key='index2'>
									<view class="serve-reply-warp">
										<text class="text1">商家</text><text class="text2">{{item2.content}}</text>
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
		TrueGoodsComment // 用户评价 接口
	} from '@/api/order.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				starSel: 1, // 总评分的选中星星数
				commentData: [], // 客户评论数据
				evaluationData: {}, // 评论数据
				rating: 0.0, // 好评率
				levelList: [], // 评价等级
			}
		},
		onLoad(option) {
			that = this
			if (option.goods_id) {
				this.TrueGoodsCommentFun(option.goods_id)
			}
		},
		methods: {
			// 获取用户评价数据信息
			TrueGoodsCommentFun(goodsid) {
				TrueGoodsComment({
					goods_id: goodsid
				}, (res) => {
					if (res.status == 1) {
						this.evaluationData = res
						this.commentData = res.commentList
						this.levelList = res.levelList
						this.rating = ((((res.levelList.five + res.levelList.four) / res.count)/2)*10).toFixed(1)
						this.starSel = parseInt(this.rating)
						if (this.starSel == 0 || !this.starSel) {
							this.starSel = 1
						}
						
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	//全部评价列表部分
	.bottom-box {
		padding: 0rpx 44rpx 0;

		.bottom-warp {
			.top {
				font-size: 32rpx;
				font-weight: 700;
				color: #1e1e1e;
			}

			.evalution-list-box {
				padding-top: 23rpx;

				.evalution-list-item-box {
					margin-bottom: 40rpx;

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

							.star {
								display: flex;
								width: 100%;

								image {
									padding-right: 10rpx;
									width: 26rpx;
									height: 26rpx;
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
								justify-content: space-between;
								align-content: flex-start;
								padding: 20rpx 0;

								image {
									width: 170rpx;
									height: 170rpx;
								}

								image:nth-child(3n + 1) {
									margin-left: 0;
								}
							}

							.item-vealuation-bottom-box {
								padding-bottom: 20rpx;
								font-size: 24rpx;
								font-weight: 400;
								color: #1e1e1e;
							}

							.serve-reply-box {
								background-color: #F3F4F6;
								padding: 20rpx 10rpx;
								border-radius: 10rpx;

								.serve-reply-warp {
									.text1 {
										background-color: #667D8B;
										padding: 4rpx 10rpx;
										font-size: 24rpx;
										font-weight: 400;
										color: #fff;
										margin-right: 14rpx;
										border-radius: 6rpx;
									}

									.text2 {
										font-size: 28rpx;
										font-weight: 400;
										color: #1e1e1e;
									}
								}
							}
						}
					}
				}
			}
		}
	}

	// 顶部总评价部分
	.top-box {
		padding: 32rpx 44rpx 45rpx;

		.top-warp {
			display: flex;

			.top-left-box {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 170rpx;

				.top-left-top-box {
					font-size: 88rpx;
					font-weight: 700;
					color: #1e1e1e;
				}

				.top-left-middle-box {
					display: flex;
					justify-content: space-between;
					width: 100%;
					padding: 0 0 10rpx;

					image {
						width: 26rpx;
						height: 26rpx;
					}
				}

				.top-left-bottom-box {
					font-size: 28rpx;
					font-weight: 400;
					color: #7e7e7e;
				}
			}

			.top-right-box {
				padding-left: 45rpx;
				flex: 1;

				.top-right-warp {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					height: 100%;

					.top-right-item {
						display: flex;
						align-items: center;

						.class-num {
							font-size: 24rpx;
							font-weight: 400;
							color: #7e7e7e;
						}

						.class-length {
							width: 100%;
							padding: 0 30rpx 0 15rpx;
						}

						.class-percentage {
							font-size: 24rpx;
							font-weight: 700;
							color: #7e7e7e;
						}
					}
				}
			}
		}
	}
</style>
