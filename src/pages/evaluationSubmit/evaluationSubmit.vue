<template>
	<view>
		<!-- 顶部商品部分 -->
		<view class="evaluation-box">
			<view class="order-list-item-middle">
				<view class="order-list-item-middle-left">
					<image :src="goodsObj.goods_list[0].original_img" mode=""></image>
				</view>
				<view class="order-list-item-middle-right">
					<view class="order-list-item-middle-right-top">
						<view class="order-list-item-middle-right-top-name">
							<text>{{goodsObj.goods_list[0].goods_name}}</text>
						</view>
						<view class="order-list-item-middle-right-top-spac">
							<text>{{goodsObj.goods_list[0].spec_key_name}}</text>
						</view>
					</view>
					<view class="order-list-item-middle-right-bottom">
						<view class="order-list-item-middle-right-bottom-price">
							￥<text>{{goodsObj.goods_list[0].goods_price}}</text>
						</view>
						<view class="order-list-item-middle-right-bottom-number">
							<text>x{{goodsObj.goods_list[0].goods_num}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 中部星星部分 -->
		<view class="evaluation-star-box">
			<view class="evaluation-star-warp">
				<view class="evaluation-star">
					<u-rate :count="5" v-model="starValue" :size='40'></u-rate>
				</view>
				<view class="evaluation-star-title">
					<text>非常满意，无可挑剔</text>
				</view>
			</view>
		</view>
		<!-- 评价文字和图片部分 -->
		<view class="uploadImgBox-box">
			<view class="uploadImgBox">
				<textarea placeholder="说点什么吧..." v-model.trim="text"></textarea>
				<view class="uploaditem">
					<view class="img" v-for="(item,index) in list" :ket="index">
						<image :src="item"></image>
						<view class="close" @click="close(index)">×</view>
					</view>
					<view class="upload" @click="uploadimg" v-if="list.length < 3">
						<view class="imgicon">
							<image src="https://tm.ydlweb.com/icons/addpicicon.png"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 提交按钮部分 -->
		<view class="submit-box">
			<view class="submit-warp">
				<text @click="UserCommentHandleFun">提交</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		UserCommentHandle // 订单商品评价提交 接口
	} from '@/api/order.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				starValue: 1, // 选中的星星个数
				list: [], //上传的图片数组
				text: '', //评论内容
				goodsObj: {}, // 传过来的订单数据对象
				order_id: null, // 多个评价商品列表传过来的订单id
				rec_id: null, // 多个评价商品传过来的某一个商品id
			}
		},
		onLoad(option) {
			console.log('订单数据option', this.goodsObj)
			if (option.goodsObj) {
				// 单个
				this.goodsObj = JSON.parse(option.goodsObj)
				// 列表页进来
				if (this.goodsObj.goods_list) {
					this.rec_id = this.goodsObj.goods_list[0].rec_id
				} else
					// 详情页进来
					if (this.goodsObj.goodslist) {
						this.rec_id = this.goodsObj.goodslist[0].rec_id
					}


				if (this.goodsObj.order_id) {
					this.order_id = this.goodsObj.order_id
				} else

				if (this.goodsObj.orderinfo.order_id) {
					this.order_id = this.goodsObj.orderinfo.order_id
				}

			}
			if (option.order_id && option.rec_id) {
				// 多个
				this.order_id = option.order_id
				this.rec_id = option.rec_id
			}
		},
		methods: {
			// 提交评价事件
			UserCommentHandleFun() {
				if (this.text == '') {
					return uni.showToast({
						title: '请输入评价内容',
						icon: 'none'
					})
				}
				// if (this.list.length == 0) {
				// 	return uni.showToast({
				// 		title: '请选择评价图片',
				// 		icon: 'none'
				// 	})
				// }
				let data = {
					order_id: this.order_id,
					rec_id: this.rec_id,
					goods_rank: this.starValue,
					content: this.text,
					img: this.list
				}
				// console.log('提交评价需要的参数data', data)
				UserCommentHandle(data, (res) => {
					if (res.status == 1) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						setTimeout((item) => {
							uni.navigateBack({
								delta: 1
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
			// 选择图片
			uploadimg() {
				let that = this
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						that.uploading(res.tempFilePaths)
					}
				});

			},
			// 上传图片
			uploading(tempFilePaths) {
				let that = this
				uni.uploadFile({
					url: 'https://xcx.gdqhwy.com/Mini/ApiConnect/uploadRefundpic',
					filePath: tempFilePaths[0],
					name: 'refund_pic',
					header: {
						"Content-Type": "multipart/form-data"
					},
					formData: {
						user_id: uni.getStorageSync('user_id')
					},
					success(res) {
						that.list.push(JSON.parse(res.data).result)
					}
				});
			},
			// 删除图片
			close(e) {
				this.list.splice(e, 1)
			},

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
	// 提交按钮部分
	.submit-box {
		.submit-warp {
			display: flex;
			justify-content: center;
			align-items: center;

			text {
				width: 690rpx;
				padding: 22rpx 0;
				background-color: #667D8B;
				font-size: 32rpx;
				font-weight: 400;
				color: #fff;
				border-radius: 12rpx;
				text-align: center;
			}

		}
	}

	// 评价文字和图片部分
	.uploadImgBox-box {
		padding: 30rpx;


		.uploadImgBox {
			padding: 20rpx;
			background-color: #F2F2F2;
			border-radius: 12rpx;

			textarea {
				height: 150rpx;
			}

			.upload {
				.imgicon {
					width: 120rpx;
					height: 120rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

			}

			.uploaditem {
				display: flex;
				padding-top: 30rpx;

				.img {
					position: relative;

					.close {
						position: absolute;
						right: 0;
						top: -16rpx;
						background-color: rgba(0, 0, 0, 0.5);
						width: 40rpx;
						height: 40rpx;
						line-height: 40rpx;
						text-align: center;
						border-radius: 50%;
						color: #fff;
						z-index: 9999;
					}

					image {
						width: 120rpx;
						height: 120rpx;
						margin-right: 20rpx;
					}
				}
			}
		}
	}

	// 中部星星部分
	.evaluation-star-box {
		.evaluation-star-warp {
			padding: 30rpx 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin: 40rpx 20rpx 0;
			border-top: 1rpx solid #ddd;

			.evaluation-star-title {
				padding-top: 20rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #9e9e9e;
			}
		}
	}

	// 顶部商品部分
	.evaluation-box {
		padding: 40rpx 0 0;

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
						color: #ff2d2d;

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
	}
</style>
