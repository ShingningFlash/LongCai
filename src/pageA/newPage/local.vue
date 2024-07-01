<template>
	<view>
		<view class="" v-if="type == 1" style="padding-bottom: 90rpx;">
			<view class="local-list" v-for="(item,index) in localList" :key="index">
				<view class="list-item flex m-between s-center">
					<view class="left" style="font-weight: 700;">
						{{item.filename}}
					</view>
					<view class="right flex s-center">
						<view class="page" style="margin-right: 56rpx;font-size: 30rpx;">
							{{item.page}}页
						</view>
						<view class="pre" @click="print(index)">
							预览
						</view>
						<view class="del" @click="del(index)" style="margin-left: 20rpx;">
							删除
						</view>
					</view>
				</view>
				<view class="list-item flex m-between s-center" v-if="item.page > 1">
					<view class="left">
						页码范围
					</view>
					<view class="right flex s-center">

						<view class="btn" v-for="(items,indexs) in btns" :key="indexs">
							<view class="pre" :class="item.current == indexs ? 'activeBtn' : ''"
								@click="changeBtn(index,1,indexs)" style="margin-left:20rpx">
								{{items}}
							</view>
						</view>

					</view>

				</view>
				<view class="" v-if="item.page > 1">
					<view class="inputs flex s-center m-end" v-if="item.current == 0">
						<input class="inputd" type="number" style="margin-right:5rpx;" v-model="item.start">-
						<input class="inputd" type="number" style="margin-left:5rpx;" v-model="item.end">
					</view>
					<view class="inputs flex s-center m-end" v-else>

						<view class="inputd" v-if="item.jpPageRange == ''"
							@click="navTo('/pageA/newPage/appoint/appoint?data='+JSON.stringify(localList[index]) + '&index='+index)">
							前往
						</view>
						<view class="inputdd" v-else
							@click="navTo('/pageA/newPage/appoint/appoint?data='+JSON.stringify(localList[index]) + '&index='+index)">
							<view class="" v-for="(zako,ins) in item.jpPageRange" :key="ins">
								{{zako}},
							</view>
						</view>
					</view>
				</view>

				<view class="list-item flex m-between s-center">
					<view class="left">
						颜色
					</view>
					<view class="right flex s-center">

						<view class="btn" v-for="(items,indexs) in btns1" :key="indexs">
							<view class="pre" :class="item.current1 == indexs ? 'activeBtn' : ''"
								@click="changeBtn(index,2,indexs)" style="margin-left:20rpx">
								{{items}}
							</view>
						</view>

					</view>

				</view>
				<view class="list-item flex m-between s-center" v-if="item.isExcel &&item.current == 0">
					<view class="left">
						页面缩放
					</view>
					<view class="right flex s-center">

						<picker mode="selector" :range="ExcelFitToPages" range-key="name"
							@change="changeExcel($event,index)">
							<view
								style="font-family:'PingFang SC Medium',sans-serif;font-weight: 500;font-size: 26rpx;">
								{{item.chooseExcel}}
							</view>
						</picker>

					</view>

				</view>
				<view class="list-item flex m-between s-center" v-if="item.page > 1">
					<view class="left">
						单双面
					</view>
					<view class="right flex s-center">

						<view class="btn" v-for="(items,indexs) in btns2" :key="indexs">
							<view class="pre" :class="item.current2 == indexs ? 'activeBtn' : ''"
								@click="changeBtn(index,3,indexs)" style="margin-left:20rpx">
								{{items}}
							</view>
						</view>

					</view>

				</view>
				<view class="list-item flex m-between s-center" v-if="item.current2 == 1">
					<view class="left">
						双面打印
					</view>
					<view class="right flex s-center">

						<picker mode="selector" :range="Range" range-key="name" @change="changeStr($event,index)">
							<view
								style="font-family:'PingFang SC Medium',sans-serif;font-weight: 500;font-size: 26rpx;">
								{{item.chooseStr}}
							</view>
						</picker>

					</view>

				</view>
				<view class="list-item flex m-between s-center">
					<view class="left">
						打印份数
					</view>
					<view class="right flex s-center">

						<view class="inputs flex s-center m-end">
							<input class="inputd" type="number" v-model="item.dmCopies">
						</view>

					</view>

				</view>

			</view>
			<button class="btn1" @click="upload">继续上传</button>
			<button class="btn1" @click="getPrinterOrder">提交订单</button>
		</view>
		<view class="" v-if="type == 2">

		</view>

	</view>
</template>

<script>
	var that = this
	import {
		getPageTotal,
		getPrinterStatus,
		setPrinterJob,
		getPrinterOrderInfoA4
	} from '@/api/index.js'
	export default {
		data() {
			return {
				int:0,
				type: 1,
				dataList: {},
				page: 1,
				jobFile: '',
				start: '',
				end: '',
				mid: '',
				jpPageRange: '1',
				dmDuplex: 1,
				dmColor: 2,
				dmCopies: 1,
				localList: [
					// 	{
					// 	filename: '图片名称',
					// 	dmPaperSize: 9, //
					// 	dmCopies: 1,
					// 	dmColor: 1, //颜色
					// 	dmDuplex: 1, //单双面 1 单
					// 	jobFile: '',
					// 	jpPageRange: '1',
					// 	current: 0,
					// 	current1: 0,
					// 	current2: 0,
					// 	page: 3,
					// 	start: 1,
					// 	end: 1,
					// 	mid: 1,
					// 	chooseStr: '长边'
					// },
				],
				btns: ['连续页', '指定页'],
				btns1: ['黑白', '彩色'],
				btns2: ['单面', '双面'],
				ExcelFitToPages: [{
					name: '默认',
					value: "00"
				}, {
					name: '将工作表打印在一页',
					value: "1"
				}, {
					name: '将所有行调整为一页',
					value: "2"
				}, {
					name: '将所有列调整为一页',
					value: "3"
				}, {
					name: '无缩放',
					value: "0"
				}],
				current1: 1,
				current: 0,
				current2: 0,
				chooseStr: '长边',
				Range: [{
					id: 2,
					name: '长边'
				}, {
					id: 3,
					name: '短边'
				}],
				result: [],
				printList: [],
				webViewUrl: null
			}
		},
		onShow() {
			if (uni.getStorageSync('saveTheChoose')) {
				let index = uni.getStorageSync('ChooseIndex')
				this.localList[index] = uni.getStorageSync('saveTheChoose')
				this.localList = JSON.parse(JSON.stringify(this.localList))
				uni.removeStorageSync('saveTheChoose')
				uni.removeStorageSync('ChooseIndex')
			}
		},
		onLoad(e) {
			if (e.imageUrl) {
				this.dataList = JSON.parse(e.imageUrl)
				this.localList[0].filename = this.dataList.filenames
				this.localList[0].jobFile = JSON.parse(e.imageUrl).path
			}
			if (uni.getStorageSync('files')) {
				let info = uni.getStorageSync('info')
				this.dataList = uni.getStorageSync('files')
				console.log(this.dataList);


				(async () => {
					for (let item of this.dataList) {
						let data = {
							device_port: info.port,
							drivce_name: info.drivce_name,
							dmPaperSize: 9,
							jobFile: item.path
						};
						try {
							const resd = await this.getPage(data);
							if (resd.status == 1) {
								// 处理成功响应
								let pr
								if (resd.result > 1) {
									pr = 1 + '-' + resd.result
								} else {
									pr = '1'
								}
								let isExcels
								if (item.path.indexOf('.xls') != -1) {
									isExcels = true
								}
								if (item.path.indexOf('.xlsx') != -1) {
									isExcels = true
								}

								this.localList.push({
									filename: item.filenames,
									dmPaperSize: 9,
									dmCopies: 1,
									dmColor: 2,
									dmDuplex: 1,
									jobFile: item.path,
									jpPageRange: pr,
									current: 0,
									current1: 1,
									current2: 0,
									page: resd.result,
									start: 1,
									end: resd.result,
									mid: 1,
									chooseStr: '长边',
									PageCount: resd.result,
									isExcel: isExcels,
									chooseExcel: '默认',
									officeExcelFitToPages: "00",
									changeP: false
								});

								uni.hideLoading();
								uni.showToast({
									title: '上传成功',
									icon: 'none'
								});
								uni.removeStorageSync('files');
							} else {
								// 处理错误响应
								// ...
								uni.removeStorageSync('files')
								uni.hideLoading()
								
								if (resd) {
									console.log(resd,"resd")
							
									if (resd.result.message) {
										uni.showToast({
											title: resd.result.message,
											icon: 'none'
										})
									}
									else{
										uni.showToast({
											title: resd.result.trace,
											icon: 'none'
										})
									}
								} else {
									uni.showToast({
										title: '接口请求超时',
										icon: 'none'
									})
								}
							}
						} catch (error) {
							uni.showToast({
								title: error.result.trace,
								icon: 'none',
								duration:3000
							})
							
							console.error(error);
							// 处理异常情况
							// ...
						}
					}
				})()


			} else {
				let Arr = []
				if (uni.getStorageSync('filesList')) {
					if (uni.getStorageSync('filesList') != '') {
						Arr = uni.getStorageSync('filesList')
						console.log(Arr, "进入这里");
					}

				}

				this.localList.forEach(itemd => {

					Arr.push(itemd)

				})
				this.localList = Arr
			}
		},
		methods: {
			getPage(data) {
				return new Promise((resolve, reject) => {
					getPageTotal(data, (resd) => {
						if (resd.status == 1) {
							resolve(resd);
						} else {
							reject(resd);
						}
					});

				})
			},


			
			navTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			chooseNumber(index, index1) {

				if (this.localList[index].current == 1) {
					this.localList[index].changeP = true
					if (this.localList[index].jpPageRange.indexOf(index1) !== -1) {
						this.localList[index].jpPageRange.splice(this.localList[index].jpPageRange.indexOf(index1),
							1); //取消
					} else {
						this.localList[index].jpPageRange.push(index1); //选中添加到数组里
					}
				}
			},
			del(index) {

				this.localList.splice(index, 1)
				// uni.setStorageSync('filesList',this.localList)

			},
			uploadFile(file) {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: 'https://tm.ydlweb.com/Mini/ApiConnect/upload',
						filePath: file.path,
						name: 'file',
						header: {},
						formData: {
							"user_id": uni.getStorageSync('user_id'),
							"file_name": file.name
						},
						success(res) {
							const data = JSON.parse(res.data);
							if (data.status === 1) {
								resolve({
									result: data.result
								});
							} else {
								reject(data.msg);
							}
						},
						fail(err) {
							reject('上传请求失败');
						}
					});
				});
			},
			getPageTotald(data) {
				return new Promise((resolve, reject) => {

					let info = uni.getStorageSync('info')


					getPageTotal(data, (resd) => {
						uni.hideLoading()
						if (resd.status == 1) {

							resolve(resd)


						} else {

							reject('获取页码失败或超时')

						}
					})
				})

			},
			async upload() {
				let info = uni.getStorageSync('info')
				let that = this
				const res = await uni.chooseMessageFile({
					count: 10,
					type: 'file'
				});
				console.log(res);
				let arr = []
				for (let i = 0; i < res[1].tempFiles.length; i++) {
					try {
						if (res[1].tempFiles[i].size > 5 * 1024 * 1024) {
							uni.showToast({
								title: '文件大小超过5M，请重新选择文件',
								icon: 'none',
								duration: 2000
							})
							return
						}
						uni.showLoading({
							title: '上传中' + Number(i + 1) + '/' + res[1].tempFiles.length,
							mask: true
						});
						const res2 = await this.uploadFile(res[1].tempFiles[i]);

						console.log(res2);
						let data = {}
						// data.user_id = 45
						data.device_port = info.port
						data.drivce_name = info.drivce_name
						data.dmPaperSize = 9
						data.jobFile = res2.result.path

						that.result = res2.result
						const resd = await this.getPageTotald(data)
						console.log(resd);

						let pr
						if (resd.result > 1) {
							pr = 1 + '-' + resd.result
						} else {
							pr = '1'
						}
						let isExcels
						if (that.result.path.indexOf('.xls') != -1) {
							isExcels = true
						}
						if (that.result.path.indexOf('.xlsx') != -1) {
							isExcels = true
						}
						that.localList.push({
							filename: that.result.filename,
							dmPaperSize: 9,
							dmCopies: 1,
							dmColor: 2,
							dmDuplex: 1,
							jobFile: that.result.path,
							jpPageRange: pr,
							current: 0,
							current1: 1,
							current2: 0,
							page: resd.result,
							start: 1,
							end: resd.result,
							mid: 1,
							chooseStr: '长边',
							PageCount: resd.result,
							isExcel: isExcels,
							chooseExcel: '默认',
							officeExcelFitToPages: "00",
							changeP: false
						})
						uni.hideLoading()
						uni.showToast({
							title: '上传成功',
							icon: 'none'
						})
					} catch (error) {
						uni.showToast({
							title: error,
							icon: "none",
							duration: 2000
						});
					} finally {
						uni.hideLoading();
					}
				}

			},

			getPrinterStatusd(task_id, index) {

				let info = uni.getStorageSync('info')
				let data = {}
				data.device_port = info.port
				data.task_id = task_id
				console.log(this.localList[index])
				this.localList[index].changeP = false
				
				getPrinterStatus(data, (res) => {
					if (res.result.task_state == 'SUCCESS') {
						this.int = 0
						uni.hideLoading()
						let result = res.result.task_result
						if (result.data) {
							uni.setStorageSync('preUrl', result.data.img_list)


							uni.navigateTo({
								url: '/pageA/newPage/webview'
							})
						} else {
							this.int = 0
							uni.showModal({
								title: '提示',
								content: result.msg,
								showCancel: false,
								success: (res) => {
									if (res.confirm) {
										delete this.localList[index].task_id
									}
								}
							})

						}
					} else if (res.result.task_state == 'FAILURE') {
						uni.hideLoading()
						this.int = 0
						uni.showToast({
							title: res.result.task_state,
							icon: 'none'
						})


					} else {
						uni.hideLoading()
						this.int++
						uni.showLoading({
							title: `第${this.int}次查询`,
							mask:true
						})
						setTimeout(() => {

							this.getPrinterStatusd(task_id, index)
						}, 10000)


					}
				})

			},
			print(index) {

				let info = uni.getStorageSync('info')
				let data = {}
				data.device_port = info.port
				data.drivce_name = info.drivce_name
				data.dmPaperSize = this.localList[index].dmPaperSize
				data.dmCopies = this.localList[index].dmCopies
				data.dmColor = this.localList[index].dmColor
				data.dmDuplex = this.localList[index].dmDuplex
				if (this.localList[index].page > 1) {
					if (this.localList[index].current == 0) {
						data.jpPageRange = this.localList[index].start + '-' + this.localList[index].end
					} else {
						let len = this.localList[index].jpPageRange
						if (this.localList[index].jpPageRange != '') {
							if (len.length == 1) {
								data.jpPageRange = len.join() * 1
							} else {
								data.jpPageRange = len.join()
							}
						}
						// data.jpPageRange = this.localList[index].mid
					}
				} else {
					let len = this.localList[index].jpPageRange
					if (this.localList[index].isExcel == true) {
						data.jpPageRange = this.localList[index].jpPageRange
					} else {
						if (this.localList[index].jpPageRange != '') {
							if (len.length == 1) {
								data.jpPageRange = 1
							} else {
								data.jpPageRange = len.join()
							}
						}
					}

				}


				data.isPreview = 1 // 0打印 1预览

				data.jobFile = this.localList[index].jobFile
				if (this.localList[index].isExcel == true) {
					console.log("是表格");
					if (this.localList[index].task_id) {
						if (this.localList[index].changeP == true) {
							if (this.localList[index].officeExcelFitToPages != '00') {
								data.officeExcelFitToPages = this.localList[index].officeExcelFitToPages
							}
							uni.showLoading({
								title:'加载中'
							})
							setPrinterJob(data, (res) => {
								if (res.status == 1) {
									this.localList[index].task_id = res.result.task_id
									this.task_id = res.result.task_id
									uni.setStorageSync('filesList', this.localList)
									this.getPrinterStatusd(res.result.task_id, index)
								}
							})
						} else {
							this.getPrinterStatusd(this.localList[index].task_id, index)
						}
					} else {
						if (this.localList[index].officeExcelFitToPages != '00') {
							data.officeExcelFitToPages = this.localList[index].officeExcelFitToPages
						}
						setPrinterJob(data, (res) => {
							if (res.status == 1) {
								this.localList[index].task_id = res.result.task_id
								this.task_id = res.result.task_id
								uni.setStorageSync('filesList', this.localList)
								this.getPrinterStatusd(res.result.task_id, index)
							}
						})
					}


					// setPrinterJob(data, (res) => {
					// 	if (res.status == 1) {
					// 		this.localList[index].task_id = res.result.task_id
					// 		this.task_id = res.result.task_id
					// 		uni.setStorageSync('filesList',this.localList)
					// 		this.getPrinterStatusd(res.result.task_id,index)
					// 	}
					// })
				} else {
					console.log("不是表格");
					if (this.localList[index].task_id) {
						if (this.localList[index].changeP == true) {
							setPrinterJob(data, (res) => {
								if (res.status == 1) {
									this.localList[index].task_id = res.result.task_id
									this.task_id = res.result.task_id
									uni.setStorageSync('filesList', this.localList)
									this.getPrinterStatusd(res.result.task_id, index)
								}
							})
						} else {
							this.getPrinterStatusd(this.localList[index].task_id, index)
						}


					} else {
						setPrinterJob(data, (res) => {
							if (res.status == 1) {
								this.localList[index].task_id = res.result.task_id
								this.task_id = res.result.task_id
								uni.setStorageSync('filesList', this.localList)
								this.getPrinterStatusd(res.result.task_id, index)
							}
						})
					}
				}



			},
			// 获取页码处理
			makeData(index) {

				uni.showLoading({
					title: '处理中',
					mask: true
				})

				let info = uni.getStorageSync('info')
				let data = {}
				// data.user_id = 45
				data.device_port = info.port
				data.drivce_name = info.drivce_name
				data.dmPaperSize = 9
				data.jobFile = this.localList[index].jobFile
				getPageTotal(data, (resd) => {
					uni.hideLoading()
					if (resd.status == 1) {

						this.localList[index].page = resd.result

						if (this.localList[index].current == 0) {
							console.log("这里");
							this.localList[index].jpPageRange = this.localList[index].start + '-' + this.localList[
								index].end
							this.localList[index].PageCount = this.localList[index].end - this.localList[index]
								.start
						} else {
							this.localList[index].jpPageRange = []
							this.localList[index].PageCount = 1
						}
					} else {
						uni.showToast({
							title: resd.result
						})
					}
				})

			},
			changeExcel(e, index) {
				let indexs = e.detail.value
				this.localList[index].officeExcelFitToPages = this.ExcelFitToPages[indexs].value
				this.localList[index].chooseExcel = this.ExcelFitToPages[indexs].name
				this.localList[index].changeP = true
				if (this.localList[index].officeExcelFitToPages == 0) {
					this.makeData(index)
				}
				if (this.localList[index].officeExcelFitToPages == 1 || this.localList[index].officeExcelFitToPages == 2 ||
					this.localList[index].officeExcelFitToPages == 3) {

					this.localList[index].page = 1
					this.localList[index].jpPageRange = 1

				}
				if (this.localList[index].officeExcelFitToPages == '00') {

					this.makeData(index)

				}

			},
			changeStr(e, index) {
				this.localList[index].changeP = true
				let indexs = e.detail.value
				this.localList[index].chooseStr = this.Range[indexs].name
				if (indexs == 0) {
					this.localList[index].dmDuplex = 2
				} else {
					this.localList[index].dmDuplex = 3
				}
			},
			changeBtn(index, type, indexs) {
				this.localList[index].changeP = true
				if (type == 1) {
					this.localList[index].current = indexs
					if (indexs == 0) {
						console.log("这里");
						this.localList[index].jpPageRange = this.localList[index].start + '-' + this.localList[index].end
						this.localList[index].PageCount = this.localList[index].end - this.localList[index].start
					} else {
						this.localList[index].jpPageRange = []
						this.localList[index].PageCount = 1
					}

				}
				if (type == 2) {
					this.localList[index].current1 = indexs
					if (indexs == 0) {
						this.localList[index].dmColor = 1
					} else {
						this.localList[index].dmColor = 2
					}
				}
				if (type == 3) {
					this.localList[index].current2 = indexs
					if (indexs == 0) {
						this.localList[index].dmDuplex = 1
					} else {
						this.localList[index].dmDuplex = 2
					}
				}

			},


			getPrinterOrder() {
				if (this.localList != '') {
					let data = {}
					let info = uni.getStorageSync('info')
					// data.user_id = 45
					data.device_port = info.port
					data.drivce_name = info.drivce_name

					let listArr = JSON.parse(JSON.stringify(this.localList))
					listArr.forEach((item) => {
						if (item.current == 0) {
							item.jpPageRange = item.start + '-' + item.end
							if (item.officeExcelFitToPages != '00' || item.officeExcelFitToPages != 0) {
								item.jpPageRange = 1
							}
						} else {
							if (item.jpPageRange != '') {
								if (item.jpPageRange.length == 1) {
									item.jpPageRange = item.jpPageRange.join()
								} else {
									item.jpPageRange = item.jpPageRange.join()
								}

							}
						}
					})
					data.printList = listArr
					data.print_type =uni.getStorageSync('print_type')
					// if(this.localList)
					getPrinterOrderInfoA4(data, (res) => {
						if (res.status == 1) {
							uni.navigateTo({
								url: '/pageA/newPage/order?price=' + res.result.total_price +
									'&pay_id=' + res.result.pay_id + '&type=4'
							})
						}
					})

				} else {
					uni.showToast({
						title: '请先上传文件',
						icon: 'none'
					})
				}

			},

		}
	}
</script>
<style>
	page {
		background-color: #f3f3f3;
	}
</style>
<style lang="scss" scoped>
	.local-list {
		width: 690rpx;
		margin: 0 auto;
		margin-top: 40rpx;
		padding: 40rpx 30rpx;
		border-radius: 25rpx;
		box-sizing: border-box;
		background-color: #fff;

		.inputs {

			.inputd {
				margin-top: 10rpx;
				width: 93rpx;
				height: 49rpx;
				border-radius: 5rpx;
				background: #fff;
				border: 1rpx solid #1c5fab;
				text-align: center;
				height: 49rpx;
				font-family: "PingFang SC Medium";
				font-weight: 500;
				font-size: 26rpx;
				color: #000;
				line-height: 49rpx;
			}

			.inputdd {
				min-width: 70rpx;
				padding: 0 5rpx;
			}

			.active {
				background-color: #ccc;
				color: #fff;
			}
		}

		.list-item {
			margin-top: 20rpx;
			display: flex;


			.left {

				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
				overflow: hidden;
				width: 240rpx;
				font-family: "PingFang SC Bold";
				font-weight: 700;
				font-size: 30rpx;
				color: #000;
			}

			.right {

				.pre,
				.del {
					width: 93rpx;
					height: 49rpx;
					border-radius: 5rpx;
					background: #fff;
					border: 1rpx solid #1c5fab;
					text-align: center;
					line-height: 49rpx;
					font-family: "PingFang SC Medium";
					font-weight: 500;
					font-size: 26rpx;
					color: #000;
					// padding: 5rpx;
					white-space: nowrap;
					// border-radius: 6rpx;
					// border: 1rpx solid #185fab;
					// font-size: 30rpx;
					// font-weight: 700;
				}

				.activeBtn {
					background-color: #185FAB;
					color: #fff;
				}

			}
		}
	}

	.btn1 {
		width: 690rpx;
		height: 88.06rpx;
		border-radius: 44.03rpx;
		background: linear-gradient(0.11deg, #185fab 0%, #38b8ef 100%);
		line-height: 88.06rpx;
		text-align: center;
		margin-top: 40rpx;
		font-family: "PingFang SC Heavy";
		font-weight: 900;
		font-size: 30rpx;
		color: #fff;
	}
</style>