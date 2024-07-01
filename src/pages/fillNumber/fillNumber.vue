<template>
	<view>
		<view class="model">
			<view class="modelBox">
				<view class="left">物流单号</view>
				<input type="text" placeholder="请输入物流单号" v-model="express_sn">
			</view>
			<view class="modelBox">
				<view class="left">配送物流</view>
				<input type="text" placeholder="请选择配送物流" v-model="express_name">
				<!-- <view class="right">
					<view>请选择配送物流</view>
					<image src="../../static/img/right.png"></image>
				</view> -->
			</view>
			<view class="modelBox">
				<view class="left">上传凭证</view>
				<view class="Imglist">
					<view class="img" v-for="(item,index) in chooseImgArr" :key="index">
						<view class="del" @click="delImg(index)">×</view>
						<image :src="item"></image>
					</view>
					<view class="upload" @click="selectImgFunction" v-if="chooseImgArr.length < 6">
						<image src="https://tm.ydlweb.com/icons/icon_48.png"></image>
						<p>(最多6张)</p>
					</view>
				</view>
			</view>
		</view>
		<view class="submit" @click="BackExpressFun">提交</view>
	</view>
</template>
<script>
	import {
		BackExpress // 退换货寄回物流 接口
	} from '@/api/order.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				user_id: null, //用户id
				return_id: null, //退货订单号
				express_name: null, //物流名称
				express_sn: null, // 物流单号
				chooseImgArr: [], //图片
			}
		},
		onLoad(option) {
			this.return_id = option.return_id
		},
		methods: {
			// 提交退换货寄回物流
			BackExpressFun() {
				if (this.express_sn == null) {
					uni.showToast({
						title: '物流单号不能为空',
						icon: 'none'
					})
				}
				if (this.express_name == null) {
					uni.showToast({
						title: '物流名称不能为空',
						icon: 'none'
					})
				}
				BackExpress({
					return_id: this.return_id,
					express_sn: this.express_sn,
					express_name: this.express_name
				}, (res) => {
					if (res.status == 1) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						setTimeout((item) => {
							uni.redirectTo({
								url: '/pages/afterSalesOrder/afterSalesOrder'
							})
						}, 1000)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 选择退货换货的图片
			selectImgFunction() {
				let _this = this
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: function(res) {
						// _this.chooseImgArr.push(res.tempFilePaths[0])
						_this.uploadingFun(res.tempFilePaths[0])
					}
				});
			},

			// 上传图片
			uploadingFun(tempFiles) {
				var _this = this
				uni.uploadFile({
					url: 'https://xcx.gdqhwy.com/Mini/ApiConnect/uploadRefundpic',
					filePath: tempFiles,
					name: 'refund_pic',
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					formData: {
						user_id: uni.getStorageSync('user_id')
					},
					success(res) {
						_this.chooseImgArr.push(JSON.parse(res.data).result)
						// console.log('图片上传成功返回的数据', _this.chooseImgArr)
					},
					fail(err) {
						console.log('上传失败', err)
						uni.showToast({
							title: '图片上传失败',
							icon: 'none'
						})
					}
				});
			},

			// 删除图片
			delImg(idx) {
				this.chooseImgArr.splice(idx, 1)
				console.log('数组del', this.chooseImgArr)
			},
			//提交事件


			// =====================
			async fillNumberFun() {
				var _this = this
				if (!uni.getStorageInfoSync('user_id')) {
					uni.showToast({
						title: '登录过期，请登录！',
						icon: 'none',
					})
					return;
				}
				if (_this.express_name == null || _this.express_sn == null) {
					uni.showToast({
						title: '请填写正确的物流信息！',
						icon: 'none',
					})
					return;
				}
				var res = await postData('post', {
					url: '/mini/ApiConnect/backExpress',
					data: {
						user_id: _this.user_id,
						return_id: _this.return_id,
						express_name: _this.express_name,
						express_sn: _this.express_sn,
					}
				})
				console.log('填写物流信息返回的数据', res)
				if (res.data.status == 1) {
					uni.showToast({
						title: '提交成功，请等待审核',
						icon: 'none',
					})
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/user/user'
						});
					}, 1500)

				} else {
					uni.showToast({
						title: res.data.msg,
						icon: 'none',
					})
				}
			}
		}
	}
</script>
<style lang="scss">
	.submit {
		width: 690rpx;
		height: 90rpx;
		background: #667D8B;
		margin: 0 auto;
		font-weight: 400;
		font-size: 36rpx;
		color: #fff;
		position: absolute;
		bottom: 30rpx;
		left: 0;
		right: 0;
		line-height: 90rpx;
		text-align: center;
		border-radius: 15rpx;
	}

	.model {
		border-radius: 10rpx;
		background-color: #fff;
		margin-top: 20rpx;
		padding: 0rpx 30rpx 20rpx;

		.modelBox:nth-child(1) {
			border-bottom: 1rpx solid #EEEEEE;
		}

		.modelBox:nth-child(2) {
			border-bottom: 1rpx solid #EEEEEE;
		}

		.modelBox {
			display: flex;
			padding: 30rpx 0rpx;

			.left {
				width: 120rpx;
				font-weight: 400;
				font-size: 30rpx;
				color: #1e1e1e;
				margin-right: 20rpx;
			}

			.right {
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex: 1;

				view {
					font-weight: 400;
					font-size: 28rpx;
					color: #a4a4a4;
				}

				image {
					width: 15rpx;
					height: 20rpx;
				}
			}

			input {
				font-weight: 400;
				font-size: 28rpx;
				color: #8c969f;
			}

			.Imglist {
				flex: 1;
				display: flex;
				flex-wrap: wrap;

				.upload {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 140rpx;
					height: 140rpx;
					border-radius: 6rpx;
					background: transparent;
					border: 2rpx solid #ddd;
					text-align: center;
					font-weight: 400;
					font-size: 20rpx;
					color: #999;

					image {
						width: 56rpx;
						height: 46rpx;
						margin-bottom: 10rpx;
					}
				}

				.img {
					width: 140rpx;
					height: 140rpx;
					position: relative;
					margin-right: 20rpx;
					margin-bottom: 30rpx;

					image {
						width: 100%;
						height: 100%;
					}

					.del {
						position: absolute;
						width: 32rpx;
						height: 32rpx;
						background: rgba(0, 0, 0, 0.6);
						right: -16rpx;
						top: -16rpx;
						color: #fff;
						border-radius: 50%;
						line-height: 32rpx;
						text-align: center;
					}
				}
			}
		}
	}

	page {
		background-color: #f5f5f5;
	}
</style>
