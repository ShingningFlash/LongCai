<template>
	<view>
		<view class="posters-box">
			<view class="posters-warp">
				<view class="posters-banner">
					<!-- <view class="image-box">
						<image :src='list[0]' mode="widthFix"></image>
					</view> -->
					<u-swiper :list="list2" previousMargin="30" nextMargin="30" circular :autoplay="false" radius="5"
						bgColor="#ffffff" height='450' imgMode='aspectFit' @change="picture"></u-swiper>
				</view>
				<view class="btn" @click="savePicture">
					<text>保存海报</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		// getPoster ,// 分销海报 接口
		getShareCode // 分销海报 接口
	} from '@/api/user.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				list: [], //分销海报的图片数据
				list2: [], //分销海报的图片数据
				itemPicture: '', // 当前的海报地址
			}
		},
		onShow() {
			this.GetPosterFun()
		},
		methods: {
			picture(e) {
				console.log('当前海报', e)
				this.itemPicture = this.list2[e.current]
			},
			// 保存海报
			savePicture() {
				if (this.itemPicture != '') {

					uni.downloadFile({
						url: this.itemPicture,
						success: (res) => {
							console.log('1111111',res)
							if (res.statusCode === 200) {
								uni.saveImageToPhotosAlbum({
									filePath: res.tempFilePath,
									success: function() {
										uni.showToast({
											title: "保存成功",
											icon: "none"
										});
									},
									fail: function() {
										uni.showToast({
											title: "保存失败，请稍后重试",
											icon: "none"
										});
									}
								});
							}
						}
					})
				}
			},

			// 获取推广二维码海报
			GetPosterFun() {
				getShareCode({}, (res) => {
					// getPoster({}, (res) => {

					if (res.status == 1) {

						this.list = res.result
						// this.list = res.result.rows
						for (let i = 0; i < this.list.length; i++) {
							this.list2[i] = this.list[i]
						}
						this.itemPicture = this.list2[0]

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
	.posters-box {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;

		.posters-warp {
			width: 100vh;

			// width: 260rpx;
			.posters-banner {
				width: 750rpx;
				// display: flex;
				// justify-content: center;
				// align-items: center;

				.image-box {
					width: 400rpx;
					height: 400rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.btn {
				padding-top: 66rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				text {
					border-radius: 12rpx;
					background-color: #667D8B;
					width: 620rpx;
					font-size: 32rpx;
					font-weight: 400;
					color: #fff;
					padding: 21rpx 0;
					text-align: center;
				}
			}
		}
	}

	page {
		height: 100vh;
	}
</style>
