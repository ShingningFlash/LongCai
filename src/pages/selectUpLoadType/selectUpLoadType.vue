<template>
	<view>
		<!-- 没有打印的文件 -->
		<view class="no-print-box" v-if="fileData && fileData.length == 0">
			<view class="no-print-warp">
				<image src="https://tm.ydlweb.com/icons/null-cart.png" mode=""></image>
				<view class="text-box">
					<text>暂无文件哦~</text>
				</view>
			</view>
		</view>

		<!-- 有打印的文件 -->
		<view class="print-box" v-else>
			<view class="print-warp">
				<view class="item-box" v-for="(item,index) in fileData" :key='index'>
					<view class="item-name-box">
						<view class="item-name-left">
							<text>{{item.file_name}}</text>
						</view>
						<view class="item-name-right">
							<text>共{{item.file_end_total_num}}页</text>
						</view>
					</view>

					<view class="item-scope-box">
						<view class="item-scope-left">
							<text>页码范围</text>
						</view>
						<view class="item-scope-right">
							<view class="scope-start-box">
								<input type="number" v-model.number="item.startPage" @blur="changePage(item,0)" />
							</view>
							<view class="line-box">
								<text>-</text>
							</view>
							<view class="scope-end-box">
								<input type="number" v-model.number="item.endPage" @blur="changePage(item,1)" />
							</view>
						</view>
					</view>

					<view class="item-num-box">
						<view class="item-num-left">
							<text>打印份数</text>
						</view>
						<view class="item-num-right">
							<view class="num-minus-box" @click="changeNum('minu',item)">
								<text>-</text>
							</view>
							<view class="num-box">
								<input type="number" v-model.number="item.paperCount" @blur="changeNum('input',item)" />
							</view>
							<view class="num-add-box" @click="changeNum('add',item)">
								<text>+</text>
							</view>
						</view>
					</view>

					<view class="item-page-box">
						<view class="item-page-left">
							<text>打印页面</text>
						</view>
						<view class="item-page-right">
							<view :class="item.printType == 1 ? 'page-single-box-active' :'page-single-box' "
								@click="changeActive('s',item)">
								<text>单</text>
							</view>
							<view :class="item.printType == 2 ? 'page-double-box-active' : 'page-double-box'"
								@click="changeActive('d',item)">
								<text>双</text>
							</view>
						</view>
					</view>

					<view class="item-type-box">
						<view class="item-type-left">
							<text>打印页面</text>
						</view>
						<view class="item-type-right">
							<view :class="item.colorType == 1 ? 'type-box-black-active' : 'type-box-black'"
								@click="changeActive('b',item)">
								<text>黑白</text>
							</view>
							<view :class="item.colorType == 2 ?  'type-box-caise-active' : 'type-box-caise'"
								@click="changeActive('c',item)">
								<text>彩色</text>
							</view>
						</view>
					</view>

					<view class="item-operation-box">
						<view class="item-operation-warp">
							<view class="preview-box" @click="preview(item)">
								<view class="icon-box">
									<image src="https://tm.ydlweb.com/icons/dyyl.png" mode=""></image>
								</view>
								<view class="text">
									<text>预览</text>
								</view>
							</view>
							<view class="delete-box" @click="deleteFile(item)">
								<view class="icon-box">
									<image src="https://tm.ydlweb.com/icons/del2.png" mode=""></image>
								</view>
								<view class="text">
									<text>删除</text>
								</view>
							</view>
						</view>
					</view>

				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="btm-box">
			<view class="btm-warp">
				<view class="btm-item1" @click="openPopup">
					<view>选择文件/图片</view>
				</view>
				<view class="btm-item2" @click="clickSettlement">
					<view>下单打印</view>
				</view>
			</view>
		</view>

		<!-- 选择文件弹窗 -->
		<u-popup :show="show" mode="bottom" :round="15" :closeOnClickOverlay='true' @close='closeFun'>
			<view class="popup-box">
				<view class="popup-box-middle" @click="uploadimg">
					<text>从相册选择</text>
					<text class="tips">支持常用照片格式png、jpg</text>
				</view>
				<view class="linebox"></view>
				<view class="popup-box-bottom" @click="wxUploadFile">
					<text>从好友微信窗口选择</text>
					<text class="tips">支持word、ppt、pdf、png、jpg</text>
				</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	import {
		PrinterTransformation, // 上传文件转PDF
		PrinterTransformationPage // 文件PDF页数
	} from '@/api/order.js'
	let that
	export default {
		data() {
			return {
				show: false, // 控制弹出框显示隐藏

				file_start_num: 1, //页码范围开始
				taps1: 1, // 选中1  不选中2  1单 2双
				taps2: 2, // 选中1  不选中2  1黑白 2彩色
				number: 1, // 份数

				// 文件数组对象
				fileData: [],
				printFlag: false, // 文档打印上传中，不能点击的标识
				box_id: null, // 云盒id
				portraitFlag: 0, // 判断是人像还是文档图片类型的标识
				timerPage: null, // 定时器标识
			}
		},
		onLoad(option) {
			that = this
			if (option.box_id && option.portrait) {
				this.box_id = option.box_id
				this.portraitFlag = option.portrait
			}
		},
		onUnload() {
			if (this.timerPage != null) {
				clearInterval(this.timerPage)
			}
			this.timerPage = null
		},
		methods: {
			// 改变打印页码的范围
			changePage(obj, flag) {
				if (flag == 0) {
					if (obj.startPage == '') {
						obj.startPage = 1
					} else if (obj.startPage > obj.file_end_total_num) {
						uni.showToast({
							title: '开始页不能大于总页数',
							icon: 'none'
						})
						obj.startPage = 1
					} else if (obj.startPage < 1) {
						uni.showToast({
							title: '开始页不能小于1页',
							icon: 'none'
						})
						obj.startPage = 1
					} else if (obj.startPage > obj.endPage) {
						uni.showToast({
							title: '开始页不能大于结束页',
							icon: 'none'
						})
						obj.startPage = 1
					}
				}
				if (flag == 1) {
					if (obj.endPage == '') {
						obj.endPage = obj.file_end_total_num
					} else if (obj.endPage > obj.file_end_total_num) {
						uni.showToast({
							title: '结束页不能大于总页数',
							icon: 'none'
						})
						obj.endPage = obj.file_end_total_num
					} else if (obj.endPage < 1) {
						uni.showToast({
							title: '结束页不能小于1页',
							icon: 'none'
						})
						obj.endPage = obj.file_end_total_num
					} else if (obj.endPage < obj.startPage) {
						uni.showToast({
							title: '结束页不能小于开始页',
							icon: 'none'
						})
						obj.endPage = obj.file_end_total_num
					}
				}
			},
			// 预览
			preview(obj) {
				let i = obj.fileArr[0].substring(obj.fileArr[0].lastIndexOf('.') + 1)
				if (i == 'png' || i == 'jpg' || i == 'jpeg') {
					uni.previewImage({
						current: 1,
						urls: obj.fileArr
					})
				} else {
					uni.showLoading({
						title: '打开文件中...',
						icon: 'none'
					});
					uni.downloadFile({
						url: obj.fileArr[0],
						success: function(res) {
							var filePath = res.tempFilePath;
							uni.openDocument({
								filePath: filePath,
								showMenu: true,
								success: function(res1) {
									uni.hideLoading();
								},
								fail: function(err1) {
									uni.hideLoading();
									uni.showToast({
										title: '打开文件失败',
										icon: 'none'
									})
								}
							});
						},
						fail: function(err) {
							uni.hideLoading();
							uni.showToast({
								title: '打开文件失败',
								icon: 'none'
							})
						}
					});
				}
			},
			// 删除文件
			deleteFile(obj) {
				this.fileData.forEach((item, index) => {
					if (item.requestNo == obj.requestNo) {
						this.fileData.splice(index, 1)
					}
				})
			},
			// 改变份数数量
			changeNum(parm, obj) {
				if (parm == 'minu') {
					if (obj.paperCount > 1) {
						obj.paperCount = obj.paperCount - 1
					} else {
						obj.paperCount = 1
					}
				}
				if (parm == 'add') {
					if (obj.paperCount > 998) {
						uni.showToast({
							title: '最多打印999份',
							icon: 'none'
						})
						obj.paperCount = 999
					} else {
						obj.paperCount = obj.paperCount + 1
					}
				}
				if (parm == 'input') {
					if (obj.paperCount > 999) {
						uni.showToast({
							title: '最多打印999份',
							icon: 'none'
						})
						obj.paperCount = 999
					} else if (obj.paperCount < 1) {
						uni.showToast({
							title: '最少打印1份',
							icon: 'none'
						})
						obj.paperCount = 1
					}
				}
			},
			// 改变单双黑色彩色选中状态
			changeActive(parm, obj) {
				if (parm == 's') {
					obj.printType = 1
				}
				if (parm == 'd') {
					let i = obj.fileArr[0].substring(obj.fileArr[0].lastIndexOf('.') + 1)
					// console.log('后缀名', i)
					if (i == 'png' || i == 'jpg' || i == 'jpeg') {
						uni.showToast({
							title: '图片只能打印单面',
							icon: 'none'
						})
						obj.printType = 1
					} else {
						obj.printType = 2
					}
				}
				if (parm == 'b') {
					obj.colorType = 1
				}
				if (parm == 'c') {
					obj.colorType = 2
				}
			},
			// 从相册选择图片
			uploadimg() {
				if (this.portraitFlag == 2) {
					// 不是人像打印
					uni.chooseImage({
						count: 6, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album'], // 从相册选择
						success: function(res) {
							that.show = false
							that.uploading(res.tempFiles[0], 0)
						}
					});
				} else if (this.portraitFlag == 1) {
					// 是人像打印
					uni.chooseImage({
						count: 1, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album'], // 从相册选择
						success: function(res) {
							// console.log('从相册选择', res)
							that.show = false
							that.uploading(res.tempFiles[0], 1)
						}
					});
				}

			},
			// 上传从相册选中的图片
			uploading(tempFiles, Flag) {
				let that = this
				uni.showLoading({
					title: '文件上传中...',
					icon: 'none'
				});
				uni.uploadFile({
					url: 'https://xcx.gdqhwy.com/mini/ApiConnect/fileUpload',
					filePath: tempFiles.path,
					name: 'file',
					header: {
						"Content-Type": "multipart/form-data"
					},
					formData: {
						user_id: uni.getStorageSync('user_id'),
						type: Flag
					},
					success(res) {
						if (res.statusCode == 200) {
							let data = JSON.parse(res.data)
							if (data.status == 1) {
								that.PrinterTransformationFun(data.result.fileName, data.result.fileSize, '相册图片')
							} else {
								uni.hideLoading();
								uni.showToast({
									title: data.msg,
									icon: 'none'
								})
							}
						} else {
							uni.hideLoading();
							uni.showToast({
								title: res.errMsg,
								icon: 'none'
							})
						}
					},
					fail(err) {
						uni.hideLoading();
					},
				})
			},
			// 从微信聊天窗口选择文件
			wxUploadFile() {

				if (this.portraitFlag == 2) {
					wx.chooseMessageFile({
						count: 1,
						type: 'all',
						success(res) {
							// console.log('从微信聊天窗口选择', res)
							that.show = false
							that.UploadFile(res.tempFiles[0], 0)
						}
					})
				} else if (this.portraitFlag == 1) {
					wx.chooseMessageFile({
						count: 1,
						type: 'all',
						success(res) {
							// console.log('从微信聊天窗口选择', res)
							that.show = false
							that.UploadFile(res.tempFiles[0], 1)
						}
					})
				}
			},
			// 上传从微信聊天窗口选择的文件
			UploadFile(tempFiles, flag) {
				uni.showLoading({
					title: '文件上传中...',
					icon: 'none'
				});
				uni.uploadFile({
					url: 'https://xcx.gdqhwy.com/mini/ApiConnect/fileUpload',
					filePath: tempFiles.path,
					name: 'file',
					header: {
						"Content-Type": "multipart/form-data"
					},
					formData: {
						user_id: uni.getStorageSync('user_id'),
						type: flag
					},
					success(res) {
						if (res.statusCode == 200) {
							let data = JSON.parse(res.data)
							if (data.status == 1) {
								that.PrinterTransformationFun(data.result.fileName, data.result.fileSize, tempFiles
									.name)
							} else {
								uni.hideLoading();
								uni.showToast({
									title: data.msg,
									icon: 'none'
								})
							}
						} else {
							uni.hideLoading();
							uni.showToast({
								title: res.errMsg,
								icon: 'none'
							})
						}
					},
					fail(err) {
						uni.hideLoading();
					},
				})
			},
			// 上传文件转PDF
			PrinterTransformationFun(fileUrl, fileSize, filename) {
				let filetype = 1
				let i = fileUrl.substring(fileUrl.lastIndexOf('.') + 1)
				if ((i == 'png' || i == 'jpg' || i == 'jpeg') && (this.portraitFlag != null && this.portraitFlag != 1)) {
					filetype = 0
				} else {
					filetype = 1
				}
				PrinterTransformation({
					fileName: fileUrl,
					// type: 1
					type: filetype
				}, (res) => {
					if (res.status == 1) {
						that.printFlag = true
						uni.showLoading({
							title: '文件上传中...',
							icon: 'none'
						});
						setTimeout((item) => {
							that.printFlag = false
							this.timerPage = setInterval((itempage) => {
								this.PrinterTransformationPageFun(res.data.requestNo, fileSize,
									filename)
							}, 400)
						}, 200)

					} else {
						uni.hideLoading();
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 获取文件的页数
			PrinterTransformationPageFun(fileNo, fileSize, filename) {
				uni.showLoading({
					title: '文件上传中...',
					icon: 'none'
				});

				PrinterTransformationPage({
					requestNo: fileNo
				}, (res) => {
					if (res.status == 1) {
						if (res.data.page == null) {
							uni.showLoading({
								title: '文件上传中...',
								icon: 'none'
							});
							return
						} else {
							uni.hideLoading();
							clearInterval(this.timerPage);
							if (that.box_id != null) {
								let obj = {}
								let colours = 2

								obj.requestNo = res.data.requestNo
								obj.file_end_total_num = res.data.page // 传回来的文件总页数
								obj.file_name = filename // 文件名称
								obj.fileArr = res.data.fileDownloadUrl
								obj.fileSize = fileSize
								obj.boxCodes = that.box_id

								obj.endPage = obj.file_end_total_num // 打印结束页
								obj.startPage = that.file_start_num // 打印开始页
								obj.paperCount = that.number // 打印份数
								obj.printType = that.taps1 // 单双
								obj.colorType = that.taps2 // 黑白 彩色
								that.fileData.push(obj)
							} else {
								uni.showToast({
									title: '找不到打印机云盒',
									icon: 'none'
								})
							}
						}
					} else {
						uni.hideLoading();
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 跳转到结算页
			clickSettlement() {
				if (!this.printFlag && this.fileData.length != 0) {
					let fileJsonData = JSON.stringify(this.fileData)
					uni.navigateTo({
						url: '/pages/printSettlement/printSettlement?portraitFlag=' + this.portraitFlag +
							'&file_data=' + fileJsonData
					})
				}
			},
			// 打开弹出框
			openPopup() {
				// if (!this.printFlag && this.fileData.length == 0) {
				this.show = true
				// }else if(!this.printFlag && this.fileData.length != 0){
				// 	uni.showToast({
				// 		title:'为保证打印准确，请打印完当前文件再上传',
				// 		icon:'none'
				// 	})
				// }
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
	.popup-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20rpx 0 20rpx;
		font-size: 30rpx;
		color: #1e1e1e;
		font-weight: 400;

		.popup-box-middle {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding-top: 10rpx;

			.tips {
				padding-top: 4rpx;
				font-size: 20rpx;
				color: #fd5d5d;
				font-weight: 400;
			}
		}

		.linebox {
			padding-top: 25rpx;
			border-bottom: 1rpx solid #ccc;
			width: 100%;
		}

		.popup-box-bottom {
			padding: 25rpx 0 30rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.tips {
				padding-top: 4rpx;
				font-size: 20rpx;
				color: #fd5d5d;
				font-weight: 400;
			}
		}
	}

	// 底部按钮
	.btm-box {
		position: fixed;
		bottom: 20rpx;
		width: 100%;

		.btm-warp {
			display: flex;
			justify-content: space-between;
			align-items: cenetr;
			padding: 10rpx 10rpx;

			.btm-item1 {
				display: flex;
				justify-content: center;
				align-items: cenetr;
				width: 360rpx;
				height: 100rpx;
				line-height: 100rpx;
				background-color: #667d8b;
				font-size: 32rpx;
				font-weight: 400;
				color: #fff;
				border-radius: 20rpx;
			}

			.no-btm-item1 {
				display: flex;
				justify-content: center;
				align-items: cenetr;
				width: 360rpx;
				height: 100rpx;
				line-height: 100rpx;
				background-color: #c5c5c5;
				font-size: 32rpx;
				font-weight: 400;
				color: #1E1E1E;
				border-radius: 20rpx;
			}

			.btm-item2 {
				display: flex;
				justify-content: center;
				align-items: cenetr;
				width: 360rpx;
				height: 100rpx;
				line-height: 100rpx;
				background-color: #667d8b;
				font-size: 32rpx;
				font-weight: 400;
				color: #fff;
				border-radius: 20rpx;
			}

			.no-btm-item2 {
				display: flex;
				justify-content: center;
				align-items: cenetr;
				width: 360rpx;
				height: 100rpx;
				line-height: 100rpx;
				background-color: #c5c5c5;
				font-size: 32rpx;
				font-weight: 400;
				color: #1E1E1E;
				border-radius: 20rpx;
			}
		}
	}

	// 有打印文件
	.print-box {
		padding-bottom: 130rpx;

		.print-warp {
			padding: 20rpx;

			.item-box {
				display: flex;
				flex-direction: column;
				background-color: #fff;
				border-radius: 15rpx;
				padding: 10rpx;
				margin-bottom: 20rpx;

				.item-name-box {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 25rpx 0;

					.item-name-left {
						flex: 1;
						word-break: keep-all;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.item-name-right {
						color: #9a9a9a;
						font-size: 24rpx;
						font-weight: 400;
						width: 100rpx;
					}
				}

				.item-scope-box {
					padding: 25rpx 0;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.item-scope-left {}

					.item-scope-right {
						display: flex;

						.scope-start-box {
							display: flex;
							justify-content: center;
							align-items: center;
							border: 1rpx solid #667D8B;
							width: 80rpx;
							height: 60rpx;

							input {
								text-align: center;
							}
						}

						.line-box {
							display: flex;
							justify-content: center;
							align-items: center;
							color: #667D8B;
							padding: 0 15rpx;
						}

						.scope-end-box {
							display: flex;
							justify-content: center;
							align-items: center;
							border: 1rpx solid #667D8B;
							width: 80rpx;
							height: 60rpx;

							input {
								text-align: center;
							}
						}
					}
				}

				.item-num-box {
					padding: 25rpx 0;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.item-num-left {}

					.item-num-right {
						display: flex;

						.num-minus-box {
							display: flex;
							justify-content: center;
							align-items: center;
							background-color: #dedede;
							width: 70rpx;
							height: 68rpx;
						}

						.num-box {
							border: 1rpx solid #667D8B;
							width: 70rpx;
							height: 64rpx;
							display: flex;
							justify-content: center;
							align-items: center;

							input {
								text-align: center;
							}
						}

						.num-add-box {
							display: flex;
							justify-content: center;
							align-items: center;
							background-color: #dedede;
							width: 70rpx;
							height: 68rpx;
						}
					}
				}

				.item-page-box {
					padding: 25rpx 0;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.item-page-left {}

					.item-page-right {
						display: flex;

						.page-single-box {
							display: flex;
							justify-content: center;
							align-items: center;
							width: 108rpx;
							height: 68rpx;
							background-color: #dedede;
							color: #1a1a1a;
							font-size: 28rpx;
						}

						.page-single-box-active {
							display: flex;
							justify-content: center;
							align-items: center;
							width: 108rpx;
							height: 68rpx;
							background-color: #667D8B;
							color: #fff;
							font-size: 28rpx;
						}

						.page-double-box {
							display: flex;
							justify-content: center;
							align-items: center;
							width: 108rpx;
							height: 68rpx;
							background-color: #dedede;
							color: #1a1a1a;
							font-size: 28rpx;
						}

						.page-double-box-active {
							display: flex;
							justify-content: center;
							align-items: center;
							width: 108rpx;
							height: 68rpx;
							background-color: #667D8B;
							color: #fff;
							font-size: 28rpx;
						}
					}
				}

				.item-type-box {
					padding: 25rpx 0;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.item-type-left {}

					.item-type-right {
						display: flex;

						.type-box-black {
							display: flex;
							justify-content: center;
							align-items: center;
							width: 108rpx;
							height: 68rpx;
							background-color: #dedede;
							color: #1a1a1a;
							font-size: 28rpx;
						}

						.type-box-black-active {
							display: flex;
							justify-content: center;
							align-items: center;
							width: 108rpx;
							height: 68rpx;
							background-color: #667D8B;
							color: #fff;
							font-size: 28rpx;
						}

						.type-box-caise {
							display: flex;
							justify-content: center;
							align-items: center;
							width: 108rpx;
							height: 68rpx;
							background-color: #dedede;
							color: #1a1a1a;
							font-size: 28rpx;
						}

						.type-box-caise-active {
							display: flex;
							justify-content: center;
							align-items: center;
							width: 108rpx;
							height: 68rpx;
							background-color: #667D8B;
							color: #fff;
							font-size: 28rpx;
						}
					}
				}

				.item-operation-box {
					padding: 25rpx 0;

					.item-operation-warp {
						display: flex;
						justify-content: flex-end;

						.preview-box {
							display: flex;
							justify-content: center;
							align-items: center;
							border: 1rpx solid #667D8B;
							padding: 10rpx 20rpx;
							margin-right: 20rpx;
							border-radius: 5rpx;

							.icon-box {
								display: flex;
								width: 30rpx;
								height: 30rpx;

								image {
									width: 100%;
									height: 100%;
								}
							}

							.text {
								font-size: 26rpx;
								color: #667D8B;
							}
						}

						.delete-box {
							display: flex;
							justify-content: center;
							align-items: center;
							border: 1rpx solid #1E1E1E;
							padding: 10rpx 20rpx;
							border-radius: 5rpx;

							.icon-box {
								display: flex;
								width: 30rpx;
								height: 30rpx;

								image {
									width: 100%;
									height: 100%;
								}
							}

							.text {
								font-size: 26rpx;
							}
						}
					}
				}
			}
		}
	}

	// 没有打印文件
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
		background-color: #f1f1f1;
	}
</style>
