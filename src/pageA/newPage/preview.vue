<template>
	<view>
		<view class="image flex m-center" style="margin-top: 110rpx;">
			<image style="width:375rpx;height: 520rpx;" :src="picList[currents]" mode=""></image>
		</view>
		<view class="tab flex" style="margin-top: 30rpx;">
			<view class="tab_item" v-for="(item,index) in tabList" :key="index"
				:class="current == index ? 'active' : ''">
				{{item}}
			</view>
		</view>
		<view class="flex m-between s-center" style="gap: 30rpx;padding: 0 30rpx;margin-top: 30rpx;"
			v-if="current == 0">
			<view class="choose" v-for="(item,index) in bgStyleList" :key="index" :style="{background:item.bgColor}"
				:class="currents == index ? 'activeBg' :''" @click="changeBg(index,item.spec_id)">
			</view>
		</view>
		<view class="btn2 flex m-center s-between" style="padding: 0 30rpx;">
			<view class="btn_float" @click="saveImage(currents)">
				保存电子照
			</view>
			<view class="btn_shi" @click="getPrinterOrder">
				立即冲印
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getPrinterOrderInfo6
	} from '@/api/index.js'
	export default {
		data() {
			return {
				imageUrl: '',
				picList: [],
				tabList: ['背景'],
				// '换装','美颜'
				current: 0,
				bgStyleList: [{
					bgColor: 'blue',
					spec_id: 1
				}, {
					bgColor: 'white',
					spec_id: 2
				}, {
					bgColor: 'red',
					spec_id: 3
				}],
				currents: 0,
				saveList: [], //有水印排版
				file_name_print: [], //无水印排版名字
				localList: [
					{
						filename: '',
						dmPaperSize: 70,
						dmCopies: 1,
						dmColor: 2,
						dmDuplex: 1,
						jobFile: '',
						jpPageRange: 1,
						current: 0,
						current1: 0,
						current2: 0,
						page: 1,
						start: 1,
						end: 1,
						mid: 1,
						chooseStr: '长边'
					}
				],
				result:''
			}
		},
		onLoad(option) {
			if (uni.getStorageSync('picList2')) {
				this.picList = uni.getStorageSync('picList2')
				this.saveList = uni.getStorageSync('picList3')
				this.file_name_print = uni.getStorageSync('file_name_print')
				this.getphoto(option.spec_id)
			}
		},
		methods: {
			saveImage(index) {
				console.log(this.picList[index]);
				var that = this
				uni.downloadFile({
					url: that.picList[index],
					success: (res) => {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function(suc) {
								console.log(suc);
								console.log('save success');
								uni.showToast({
									title:'已保存至相册'
								})
							},
							fail: (err) => {
								uni.showModal({
									title:'提示',
									content:err
								})
								console.log(err);
							}
						})
					},
					fail: (err) => {
						uni.showModal({
							title:'提示',
							content:err
						})
					}
				})


			},
			
			
			getPrinterOrder() {

				let that = this
				uni.showLoading({
					title: '正在提交...',
					mask: true
				})
				uni.request({
					url: 'https://apicall.id-photo-verify.com/api/take_cut_pic',
					method: 'POST',
					responseType: 'arraybuffer',
					data: {
						file_name: that.file_name_print[this.currents],
						app_key: '1bc75a0b3380a8f3499e102315a6daacb681896d'
					},
					success: (result) => {
						console.log(result);
						const arrayBuffer = new Uint8Array(result.data)
						const base64 =  'data:image/png;base64,' + uni.arrayBufferToBase64(arrayBuffer)
						
						const fsm = wx.getFileSystemManager();
						const FILE_BASE_NAME = 'tmp_base64src'; //自定义文件名
						const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64) || [];
						if (!format) {
							return (new Error('ERROR_BASE64SRC_PARSE'));
						}
						console.log("");
						const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
						const buffer = wx.base64ToArrayBuffer(bodyData);
						fsm.writeFile({
							filePath,
							data: buffer,
							encoding: 'binary',
							success(r) {
								console.log(r, 'r')
								console.log(filePath, 'filePath')

								uni.uploadFile({
									url: 'https://tm.ydlweb.com/Mini/ApiConnect/upload',
									filePath: filePath,
									name: 'file',
									header: {},
									formData: {
										// 'file': res.tempFiles,
										"user_id": uni.getStorageSync('user_id'),
										"file_name": '证件照'
									},
									success(res2) {
										if (JSON.parse(res2.data).status == 1) {
											
											
											that.result = JSON.parse(res2.data).result
											uni.setStorageSync('previewUrl',that.result.showUrl)
											that.localList[0].filename = that.result.filename
											that.localList[0].jobFile =  that.result.path
											
											let data = {}
											let info = uni.getStorageSync('info')
											if(info.isPrinter == 0){
												return uni.showToast({
													title:'当前打印机离线或不可用',
													icon:'none',
													duration:2000
												})
											}
											// data.user_id = 45
											data.device_port = info.port
											data.drivce_name = info.drivce_name
											data.printList = that.localList
											data.print_type = uni.getStorageSync('print_type')
											uni.showLoading({
												title: '上传处理中',
												mask: true
											})
											getPrinterOrderInfo6(data, (res) => {
												uni.hideLoading()
												if (res.status == 1) {
													uni.navigateTo({
														url: '/pageA/newPage/order?price=' +
															res.result
															.total_price +
															'&pay_id=' +
															res.result
															.pay_id +
															'&type=6' +
															'&pai=1'
													})
												} else {
													uni.showToast({
														title: res.msg,
														icon: 'none'
													})
												}
											})
											uni.hideLoading()
											uni.showToast({
												title: '上传成功',
												icon: 'none'
											})
										} else {
											uni.showToast({
												title: JSON.parse(res2.data).msg,
												icon: "none",
												duration: 2000
											});
										}
									},
									fail(err) {
										console.log(err);
										uni.showToast({
											title: '请求发起失败',
											icon: "none",
											duration: 2000
										});
									}
								});


							},
							fail() {
								return (new Error('ERROR_BASE64SRC_WRITE'));
							},
						});
						return false

					},
					fail: () => {
						uni.hideLoading()
						uni.showToast({
							title:'上传请求发起失败',
							icon:'none',
							duration:2000
						})
					}
				})





			},
			changeBg(index, spec_id) {
				let that = this
				if (this.picList[index]) {
					this.currents = index
				} else {
					uni.showLoading({
						title: '照片处理中...',
						mask: true
					})
					let data = {}
					data.file = uni.getStorageSync('source_file')
					data.spec_id = spec_id
					data.app_key =
						'1bc75a0b3380a8f3499e102315a6daacb681896d'
					uni.request({
						url: 'https://apicall.id-photo-verify.com/api/cut_check_pic',
						method: 'POST',
						data: data,
						success: (res4) => {
							if (res4.data.code == 200) {

								if (res4.data.result.check == 1) {
									let list1 = res4.data.result.img_wm_url_list
									list1.forEach(item => {
										that.picList.push(item)
									})


									let list2 = res4.data.result.print_wm_url_list
									list2.forEach(item => {
										that.saveList.push(item)
									})
									let list3 = res4.data.result.file_name_print
									list3.forEach(item => {
										that.file_name_print.push(item)
									})

									that.currents = index
									// this.picList.push(res4.data.result.img_wm_url_list)
								} else {
									uni.showToast({
										title: "制作时出现异常",
										icon: 'none'
									})
								}
							} else {
								uni.showModal({
									title: '提示',
									content: res4.data.error,
									showCancel: false,
									success: (res) => {
										if (res.confirm) {

										}
									}
								})

							}
						},
						complete: (com) => {
							uni.hideLoading()
						}

					})
				}

			},
			getphoto(spec_id) {

				if (spec_id == 1) {
					this.bgStyleList = [{
						bgColor: 'blue',
						spec_id: 1
					}, {
						bgColor: 'white',
						spec_id: 2
					}, {
						bgColor: 'red',
						spec_id: 3
					}]
				} else if (spec_id == 4) {
					this.bgStyleList = [{
						bgColor: 'blue',
						spec_id: 4
					}, {
						bgColor: 'white',
						spec_id: 5
					}, {
						bgColor: 'red',
						spec_id: 6
					}]
				} else if (spec_id == 7) {
					this.bgStyleList = [{
						bgColor: 'blue',
						spec_id: 7
					}, {
						bgColor: 'white',
						spec_id: 8
					}, {
						bgColor: 'red',
						spec_id: 9
					}]
				} else if (spec_id == 10) {
					this.bgStyleList = [{
						bgColor: 'blue',
						spec_id: 10
					}, {
						bgColor: 'white',
						spec_id: 11
					}, {
						bgColor: 'red',
						spec_id: 12
					}]
				} else if (spec_id == 13) {
					this.bgStyleList = [{
						bgColor: 'blue',
						spec_id: 13
					}, {
						bgColor: 'white',
						spec_id: 14
					}, {
						bgColor: 'red',
						spec_id: 15
					}]
				} else {
					this.bgStyleList = [{
						bgColor: 'blue',
						spec_id: 391
					}]
				}
			}
		}
	}
</script>
<style>
	page {
		background-color: #F0F4F9;
	}
</style>
<style lang="scss" scoped>
	.image {}

	.tab {
		padding: 0 30rpx;
	}

	.tab_item {
		padding: 20rpx 30rpx;
		border-left: 1rpx solid #ccc;
		border-right: 1rpx solid #ccc;
	}

	.active {
		color: #1C5FAB;
	}

	.choose {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		border: 1rpx solid #ccc;
	}

	.activeBg {
		border: 1rpx solid #000;
	}

	.btn2 {
		position: absolute;
		bottom: 60rpx;
		left: 50%;
		transform: translateX(-50%);

		.btn_float {
			width: 333rpx;
			height: 88.06rpx;
			border-radius: 44.03rpx;
			background: transparent;
			border: 2rpx solid #185fab;
			text-align: center;
			line-height: 88.06rpx;
			font-family: "PingFang SC Heavy";
			font-weight: 900;
			font-size: 30rpx;
			color: #000;
		}

		.btn_shi {
			width: 315rpx;
			height: 88.06rpx;
			border-radius: 44.03rpx;
			background: linear-gradient(0.11deg, #185fab 0%, #38b8ef 100%);
			font-family: "PingFang SC Heavy";
			font-weight: 900;
			font-size: 30rpx;
			line-height: 88.06rpx;
			text-align: center;
			color: #fff;
		}
	}
</style>