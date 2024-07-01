<template>
	<view>
		<!-- 顶部选择文件框部分 -->
		<view class="select-box">
			<view class="select-warp">
				<view class="img-box">
					<image src="https://tm.ydlweb.com/icons/uploadicon.png" mode=""></image>
				</view>
				<view class="filename-box">
					<text>请选择您要上传的文件</text>
				</view>
				<view class="lookfile-box">
					<text class="text1" @click="openPopup">浏览文件</text>
				</view>
			</view>
		</view>
		<view class="tipstitle-box">
			<view class="tipstitle-warp">
				<text>上传记录</text>
			</view>
		</view>
		<!-- 顶部上传文件记录列表部分 -->
		<view class="filelist-box">
			<view class="filelist-warp">
				<!-- 正在上传部分 -->
				<view class="file-item-box-active" v-if="uploadflag">
					<view class="left-box">
						<view class="left-warp">
							<image src="https://tm.ydlweb.com/icons/fileicon.png" mode=""></image>
						</view>
						<view class="middle-box">
							<view class="filename">
								<text class="text1">{{file_name}}</text>
								<text class="text2">{{progress}}%</text>
							</view>
							<view class="filecapacity-active">
								<u-line-progress :percentage="progress" height="8" :showText="false"></u-line-progress>
							</view>
						</view>
					</view>
					<view class="right-box-active">
						<image src="https://tm.ydlweb.com/icons/del.png" mode=""></image>
					</view>
				</view>

				<!-- 已完成部分列表 -->
				<view class="file-item-box" v-for="(item,index) in fileList" :key="index"
					@click="selectFile(item,item.id)">
					<view class="left-box">
						<view class="left-warp">
							<image src="https://tm.ydlweb.com/icons/fileicon.png" mode=""></image>
						</view>
						<view class="middle-box">
							<view class="filename">
								<text>{{item.filename}}</text>
							</view>
							<view class="filecapacity">
								<text>{{item.size}}</text>
							</view>
						</view>
					</view>
					<view class="right-box">
						<image src="https://tm.ydlweb.com/icons/arrow.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 弹出框部分 -->
		<u-popup :show="show" mode="bottom" :round="15" :closeOnClickOverlay='true' @close='closeFun'>
			<view class="popup-box">
				<view class="popup-box-top">
					<text>请选择上传方式</text>
				</view>
				<view class="popup-box-middle" @click="uploadimg">
					<text>从相册上传</text>
				</view>
				<view class="linebox"></view>
				<view class="popup-box-bottom" @click="wxUploadFile">
					<text>从好友微信窗口上传</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		GetFileList, // 获取 文件列表 接口 
		UploadRefundpic, // 上传图片 接口
		UploadFile, // 上传文件 接口
		UpdateCart // 修改购物车文件 接口
	} from '@/api/index.js'

	export default {
		data() {
			return {
				show: false, // 控制弹出框显示隐藏
				fileList: [], // 文件列表数据
				progress: 0, // 文件上传的进度
				uploadflag: false, // 文件正在上传标识
				file_name: '相册图片', // 选择的文件名称
				fileData: {}, // 选择的文件数据


				goodsFlag: false, // 是不是从商品详情页进来的标识
				cartFlag: false, // 是不是从购物车页进来的标识
				cart_id: null, // 购物车的id
			}
		},
		onLoad(option) {
			if (option.cart && option.cart_id) {
				this.cartFlag = true
				this.goodsFlag = false
				this.cart_id = option.cart_id
			}
			if (option.goods) {
				this.goodsFlag = true
				this.cartFlag = false
			}
		},
		onShow() {
			this.GetFileList()
		},
		methods: {
			// 选择文件
			selectFile(obj, fileid) {
				if (this.cartFlag && this.cart_id != null) {
					let data = {
						cart_id: this.cart_id,
						file: fileid
					}
					this.UpdateCartFun(data)
				} else if (this.goodsFlag) {
					let pages = getCurrentPages(); //获取所有页面栈实例列表
					let nowPage = pages[pages.length - 1]; //当前页页面实例
					let prevPage = pages[pages.length - 2]; //上一页页面实例
					prevPage.$vm.fileData.push(obj); //修改上一页data里面的fileData参数值为obj
					// prevPage.$vm.fileData[0] = obj //修改上一页data里面的fileData参数值为obj
					uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
						delta: 1
					});
				} else {
					console.log('从首页进来的')
				}

			},
			// 添加购物车商品的文件
			// UploadFileFun(data) {
			// 	UploadFile(data, (res) => {
			// 		if (res.status == 1) {
			// 			uni.showToast({
			// 				title: '上传成功',
			// 				icon: 'none'
			// 			})
			// 			setTimeout((item) => {
			// 				uni.navigateBack({
			// 					delta: 1
			// 				})
			// 			}, 800)
			// 		} else {
			// 			uni.showToast({
			// 				title: res.msg,
			// 				icon: 'none'
			// 			})
			// 		}
			// 	})
			// },
			
			// 修改购物车文件  单一
			UpdateCartFun(data) {
				UpdateCart(data, (res) => {
					if (res.status == 1) {
						uni.showToast({
							title: '上传成功',
							icon: 'none'
						})
						setTimeout((item) => {
							uni.navigateBack({
								delta: 1
							})
						}, 800)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 获取 文件列表记录
			GetFileList() {
				GetFileList({}, (res) => {
					// console.log('获取文件列表返回的数据res', res)
					if (res.status == 1) {
						this.fileList = res.result.rows
						// console.log('获取文件列表返回的数据', this.fileList)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 从相册选择图片
			uploadimg() {
				let that = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], // 从相册选择
					success: function(res) {
						console.log('从相册选择', res)
						that.show = false
						that.uploadflag = true
						that.uploading(res.tempFiles[0])
					}
				});
			},
			// 上传从相册选中的图片
			uploading(tempFiles) {
				let that = this
				let uploadTask = uni.uploadFile({
					url: 'https://xcx.gdqhwy.com/Mini/ApiConnect/upload',
					filePath: tempFiles.path,
					name: 'file',
					header: {
						"Content-Type": "multipart/form-data"
					},
					formData: {
						user_id: uni.getStorageSync('user_id'),
						file_name: '相册图片'
					},
					success(res) {
						console.log('从相册选择的图片上传成功返回的res', res)
					}
				});
				uploadTask.onProgressUpdate((res) => {
					that.progress = res.progress
					if (that.progress == 100) {
						setTimeout((item) => {
							that.progress = 0
							that.uploadflag = false
							that.GetFileList()
						}, 1000)
					}
				});
			},
			// 从微信聊天窗口选择文件
			wxUploadFile() {
				let that = this
				wx.chooseMessageFile({
					count: 1,
					type: 'all',
					success(res) {
						// console.log('从微信聊天窗口选择', res)
						that.show = false
						that.uploadflag = true
						that.file_name = res.tempFiles[0].name
						that.UploadFile(res.tempFiles[0])
					}
				})
			},
			// 上传从微信聊天窗口选择的文件
			UploadFile(tempFiles) {
				let that = this
				let uploadTask1 = uni.uploadFile({
					url: 'https://xcx.gdqhwy.com/Mini/ApiConnect/upload', // 客户线上域名 
					filePath: tempFiles.path,
					name: 'file',
					header: {
						"Content-Type": "multipart/form-data"
					},
					formData: {
						user_id: uni.getStorageSync('user_id'),
						file_name: tempFiles.name
					},
					success(res) {
						console.log('从微信聊天窗口选择上传成功返回的res', res)
					}
				});
				uploadTask1.onProgressUpdate((res) => {
					that.progress = res.progress
					if (that.progress == 100) {
						setTimeout((item) => {
							that.progress = 0
							that.uploadflag = false
							that.file_name = ''
							that.GetFileList()
						}, 1000)
					}
				});
			},
			// 打开弹出框
			openPopup() {
				this.show = true
			},
			// 关闭遮罩层
			closeFun() {
				this.show = false
			}
		}
	}
</script>

<style lang="scss">
	//弹出框部分
	// .u-popup__content{
	// 	border-top-left-radius: 20rpx;
	// 	border-top-right-radius: 20rpx;
	// }
	// .bottom-popup-box{
	.popup-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20rpx 0 20rpx;
		font-size: 30rpx;
		color: #1e1e1e;
		font-weight: 400;

		.popup-box-top {
			font-weight: 700;
		}

		.popup-box-middle {
			padding-top: 35rpx;
		}

		.linebox {
			padding-top: 25rpx;
			border-bottom: 1rpx solid #ccc;
			width: 100%;
		}

		.popup-box-bottom {
			padding: 25rpx 0 30rpx;
		}
	}

	// }
	// 顶部上传文件记录列表部分
	.tipstitle-box {
		padding: 0rpx 68rpx 30rpx;

		.tipstitle-warp {
			font-size: 24rpx;
			color: #A0AEB6;
			font-weight: 400;
		}
	}

	.filelist-box {
		padding: 0rpx 68rpx;

		.filelist-warp {

			// 正在上传样式部分
			.file-item-box-active {
				display: flex;
				justify-content: space-between;
				align-items: center;
				box-shadow: 0 12rpx 32rpx rgba(160, 174, 182, 0.32);
				padding: 30rpx 20rpx;

				.left-box {
					flex: 1;
					display: flex;
					padding-right: 30rpx;

					.left-warp {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 73.34rpx;
						height: 58.63rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.middle-box {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						padding-left: 20rpx;

						.filename {
							display: flex;
							justify-content: space-between;

							.text1 {
								font-size: 24rpx;
								font-weight: 400;
								color: #111;
							}

							.text2 {
								font-size: 20rpx;
								font-weight: 400;
								color: #A0AEB6;
							}
						}

						.filecapacity-active {
							padding: 10rpx 0 0;
						}
					}
				}

				.right-box-active {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 31rpx;
					height: 31rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}


			// 已完成的列表样式部分
			.file-item-box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 30rpx 20rpx;

				.left-box {
					flex: 1;
					display: flex;
					padding-right: 30rpx;

					.left-warp {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 73.34rpx;
						height: 58.63rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.middle-box {
						// flex: 1;
						width: 430rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						padding-left: 20rpx;

						.filename {
							font-size: 24rpx;
							font-weight: 400;
							color: #111;
							word-break: keep-all;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						.filecapacity {
							font-size: 20rpx;
							font-weight: 400;
							color: #999;
						}
					}
				}

				.right-box {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 21rpx;
					height: 14.7rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}

	//顶部选择文件框部分
	.select-box {
		padding: 30rpx 68rpx;

		.select-warp {
			background-color: #F8F9F8;
			border: thin dashed #95A4AC;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding: 42rpx 0;

			.img-box {
				width: 90.34rpx;
				height: 57.56rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.filename-box {
				padding: 20rpx 0 45rpx;
				font-size: 24rpx;
				color: #95A3AB;
				font-weight: 400;
			}

			.lookfile-box {
				font-size: 24rpx;
				font-weight: 400;
				color: #fff;

				.text1 {
					padding: 12rpx 42rpx;
					border-radius: 6rpx;
					background: #667d8b;
					opacity: 0.6;
					box-shadow: 0 3rpx 12rpx #a2b0b9;
				}
			}
		}
	}
</style>
