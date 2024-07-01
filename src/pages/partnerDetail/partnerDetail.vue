<template>
	<view>
		<view class="partner-box">
			<view class="partner-warp">
				<!-- 合作商顶部店名、图片部分 -->
				<view class="partner-top-box">
					<view class="partner-top-img-box">
						<image :src="storeDetailData.store_img" mode="widthFix"></image>
						<view class="partner-top-address-box">
							<view class="partner-top-address-left-box">
								<view class="shop-name-box">
									<text>{{storeDetailData.store_name}}</text>
								</view>
								<view class="shop-address-box">
									<text>{{storeDetailData.address}}</text>
								</view>
							</view>
							<view class="partner-top-address-right-box"
								@click="navigationStoreFun(storeDetailData.latitude,storeDetailData.longitude)">
								<view class="navigation-btn-box">
									<text>导航到店</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 合作商详情介绍部分 -->
				<view class="detailMsg-box">
					<view class="msg-title">
						<text>合作商介绍</text>
					</view>
					<view class="msg-text" v-html="storeDetailData.content"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		GetStoreDetail // 获取 附近合作商详情 接口
	} from '@/api/index.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				storeDetailData: {}, //附近合作商详情数据
			}
		},
		onLoad(option) {
			that = this
			if (option.store_id) {
				this.GetStoreDetail(option.store_id)
			}
		},
		methods: {
			// 获取 附近合作商详情
			GetStoreDetail(storeid) {
				GetStoreDetail({
					store_id: storeid
				}, (res) => {
					// console.log('附近合作商详情返回的数据res', res)
					if (res.status == 1) {
						this.storeDetailData = res.result
						// console.log('附近合作商详情返回的数据', this.storeDetailData)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 导航到店按钮事件
			navigationStoreFun(lat, lon) {
				uni.openLocation({
					latitude: parseFloat(lat),
					longitude: parseFloat(lon),
					success: function() {
						// console.log('success');
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	// 合作商详情介绍部分



	// 合作商顶部店名、图片部分
	.partner-box {
		padding: 30rpx;

		.partner-warp {
			.partner-top-box {
				border-radius: 10rpx;
				overflow: hidden;

				.partner-top-img-box {
					position: relative;
					width: 690rpx;
					height: 420rpx;

					image {
						width: 100%;
						height: 100%;
					}

					.partner-top-address-box {
						width: 690rpx;
						position: absolute;
						bottom: 0;
						display: flex;
						justify-content: space-between;
						align-items: center;
						background-color: #fff;


						.partner-top-address-left-box {
							padding: 25rpx 15rpx;

							.shop-name-box {
								font-size: 30rpx;
								font-weight: 700;
								color: #1e1e1e;
							}

							.shop-address-box {
								padding-top: 10rpx;
								font-size: 20rpx;
								font-weight: 400;
								color: #cecece;
							}
						}

						.partner-top-address-right-box {
							padding: 25rpx 15rpx;

							.navigation-btn-box {
								text {
									background-color: #667D8B;
									padding: 10rpx 25rpx;
									font-size: 26rpx;
									color: #fff;
									border-radius: 30rpx;
								}
							}
						}
					}
				}
			}

			.detailMsg-box {
				.msg-title {
					padding: 35rpx 0 30rpx;

					text {
						font-size: 38rpx;
						font-weight: 700;
						color: #1e1e1e;
					}
				}

				.msg-text {
					padding-left: 50rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #3E3E3E;
				}

			}
		}
	}

	page {
		background: linear-gradient(180.00deg, #667d8b 0%, #f3f3f3 100%);
	}
</style>
