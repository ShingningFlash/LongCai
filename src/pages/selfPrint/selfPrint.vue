<template>
	<view>
		<!-- 附近没有打印机展示的页面 -->
		<view class="no-print-box" v-if="false">
			<view class="no-print-warp">
				<image src="https://tm.ydlweb.com/icons/null-cart.png" mode=""></image>
				<view class="text-box">
					<text>附近没有打印机</text>
				</view>
			</view>
		</view>
		<!-- 附近有打印机展示的页面 -->
		<view class="have-print-box">
			<view class="have-print-warp">
				<!-- <view class="have-print-item1"
					@click="clickJump('/pages/selectUpLoadType/selectUpLoadType?portrait='+1+'&box_id=')">
					<view class="icon-box">
						<image src="../../static/icons/print1.png" mode=""></image>
					</view>
					<view class="text">
						<text>人像打印</text>
					</view>
				</view>
				<view class="have-print-item2"
					@click="clickJump('/pages/selectUpLoadType/selectUpLoadType?portrait='+2+'&box_id=')">
					<view class="icon-box">
						<image src="../../static/icons/print2.png" mode=""></image>
					</view>
					<view class="text">
						<text>文档/图片打印</text>
					</view>
				</view> -->


				<view v-if="printerDetail.word_show == 1">
					<view class="have-print-item1"
						@click="clickJumpMiniFun(printerDetail.word_url,printerDetail.weixin_appid)"
						style="margin-bottom: 30rpx;">
						<view class="text">
							<text>文档/图片打印</text>
						</view>
					</view>
				</view>
				<view v-if="printerDetail.image_show == 1">
					<view class="have-print-item1"
						@click="clickJumpMiniFun(printerDetail.image_url,printerDetail.weixin_appid)"
						style="margin-bottom: 30rpx;">
						<view class="text">
							<text>扫描复印</text>
						</view>
					</view>
				</view>
				<view v-if="printerDetail.six_image_show == 1">
					<view class="have-print-item1"
						@click="clickJumpMiniFun(printerDetail.six_image_url,printerDetail.weixin_appid)">
						<view class="text">
							<text>6寸相片纸打印</text>
						</view>
					</view>
				</view>
				<view v-if="printerDetail.certificates_show == 1">
					<view class="have-print-item1"
						@click="clickJumpMiniFun(printerDetail.certificates_url,printerDetail.weixin_appid)">
						<view class="text">
							<text>证件照打印</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 内容说明文本框 -->
			<view class="content-box">
				<view class="content-warp">
					<view class="title-box">
						<view class="title-warp">
							<text>自助打印说明</text>
						</view>
					</view>
					<scroll-view scroll-y="true" class="scroll-Y">
						<view class="info">
							<rich-text :nodes="content"></rich-text>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getPrinterContent, // 自助打印说明 接口
		getPrinterOne // 获取打印机外接小程序信息 接口
	} from '@/api/order.js'
	let that
	export default {
		data() {
			return {
				box_id: null, // 云盒id
				content: '', // 自助打印说明
				printerDetail: {}, // 打印机信息
			}
		},
		onLoad(option) {
			that = this
			if (option.box_id) {
				this.box_id = option.box_id
				this.getPrinterOneFun()
			}

		},
		onShow() {
			this.getPrinterContentFun()
		},
		methods: {
			// 跳转到其他小程序
			clickJumpMiniFun(url, appid) {
				
				uni.navigateToMiniProgram({
					appId: appid,
					path: url,
					success(res) {
						console.log("跳转成功")
					}
				})
			},

			// 获取当前打印机信息
			getPrinterOneFun() {
				if (this.box_id == null) {
					return uni.showToast({
						title: '打印机信息出错',
						icon: 'none'
					})
				}
				getPrinterOne({
					box_id: this.box_id
				}, (res) => {
					this.printerDetail = res
				})
			},

			// 自助打印说明
			getPrinterContentFun() {
				getPrinterContent({}, (res) => {
					res = this.textRach(res)
					this.content = res
				})
			},
			// 路由跳转
			clickJump(e) {
				if (this.box_id != null) {
					uni.navigateTo({
						url: e + this.box_id
					})
				} else {
					uni.showToast({
						title: '找不到打印机云盒',
						icon: 'none'
					})
				}

			},
			// 富文本内容修改样式
			textRach(textArea) {
				let text = textArea
					.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/gi, '<p')
					.replace(
						/<p>/gi,
						'<p style="font-size: 15px; line-height: 25px;width:100%;">'
					)
					.replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/gi, '<img$1')
					.replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/gi, '<img$1')
					.replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/gi, '<img$1')
					.replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/gi, '<img$1')
					.replace(/<img([\s\w"-=\/\.:;]+)/gi, '<img style="width: 100%;" $1')
				return text
			},
		}
	}
</script>

<style lang="scss">
	//附近有打印机
	.have-print-box {
		.have-print-warp {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			padding: 30rpx 20rpx;

			view {
				.have-print-item1 {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 345rpx;
					height: 200rpx;
					background-color: #fff;
					border-radius: 30rpx;

					.icon-box {
						width: 60rpx;
						height: 60rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.text {
						padding-left: 15rpx;
						font-size: 32rpx;
						font-weight: 700;
						color: #667D8B;
					}
				}

				.have-print-item2 {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 345rpx;
					height: 200rpx;
					background-color: #fff;
					border-radius: 30rpx;

					.icon-box {
						width: 60rpx;
						height: 60rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.text {
						padding-left: 15rpx;
						font-size: 32rpx;
						font-weight: 700;
						color: #1e1e1e;
					}
				}
			}
		}

		.content-box {
			padding: 30rpx;

			.content-warp {
				padding: 20rpx;
				background-color: #fff;
				border-radius: 10rpx;

				.title-box {
					padding-bottom: 30rpx;

					.title-warp {
						display: flex;
						justify-content: center;
						align-items: center;

						text {
							font-size: 40rpx;
							font-weight: 700;
							color: #667D8B;
						}
					}
				}

				.scroll-Y {
					height: 500rpx;

					.info {
						font-weight: 400;
						font-size: 28rpx;
						color: #6b6a6a;
					}
				}
			}
		}
	}

	// 附近没有打印机
	.no-print-box {
		height: 100vh;

		.no-print-warp {
			display: flex;
			flex-direction: column;
			align-items: center;
			height: 100%;
			width: 100%;

			image {
				width: 500rpx;
				height: 300rpx;
				padding-top: 100rpx;
			}

			.text-box {
				color: #667D8B;
				font-size: 30rpx;
				font-weight: bold;
				margin-top: 100rpx;
			}
		}
	}

	page {
		background-color: #F1F1F1;
	}
</style>
