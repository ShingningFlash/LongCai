<template>
	<view style="padding-bottom: 90rpx;">
		<view class="contents">
			<view class="images" style="position: relative;"  v-for="(item,index) in localList" :key="index">
				<image class="images" :src="'https://tm.ydlweb.com' +item.jobFile"
					mode="aspectFit" @click="print(index)">
					<image class="close"  src="/static/icons/close.svg" @click="del(index)"></image>
			</view>
			
			
		</view>
		<u-action-sheet :actions="list"  :show="show" @select="select" :closeOnClickOverlay="true" @close="show = false"></u-action-sheet>
		<button class="btn1" @click="show = true">继续上传</button>
		<button class="btn1" @click="getPrinterOrder">提交订单</button>

	</view>
</template>

<script>
	import {
		getPageTotal,
		getPrinterStatus,
		setPrinterJob6,
		getPrinterOrderInfo6
	} from '@/api/index.js'
	export default {
		data() {
			return {
				show:false,
				list: [{
						name: '微信聊天图片'
					},
					{
						name: '拍照'
					},
					{
						name: '手机相册'
					}
				
				],
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
				// 	dmPaperSize:285, //
				// 	dmCopies:1,
				// 	dmColor:1,//颜色
				// 	dmDuplex:1,//单双面 1 单
				// 	jobFile:'',
				// 	jpPageRange:'1',
				// 	current:0,
				// 	current1:0,
				// 	current2:0,
				// 	page:1,
				// 	start:1,
				// 	end:1,
				// 	mid:1,
				// 	chooseStr:'长边'
				// },
				],
				btns: ['连续页', '指定页'],
				btns1: ['黑白', '彩色'],
				btns2: ['单面', '双面'],
				current1: 0,
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
				result:[],
				printList:[]
			}
		},
		onLoad(e) {
			if (e.imageUrl) {
				// 
				this.dataList = JSON.parse(e.imageUrl)
				this.localList[0].filename = this.dataList.filename
				this.localList[0].jobFile = JSON.parse(e.imageUrl).path
			}
			
			if (uni.getStorage('files')) {
				let info = uni.getStorageSync('info')
				this.dataList = uni.getStorageSync('files')
				console.log(this.dataList);
			
				uni.showLoading({
					title: '上传处理中',
					mask: true
				})
				this.dataList.forEach(item => {
					let data = {}
					// data.user_id = 45
			
					data.device_port = info.port
					data.drivce_name = info.drivce_name
					data.dmPaperSize = 285
					data.jobFile = item.path
					let pr = '1'
					
					let isExcels
					if (item.path.indexOf('.xls') != -1) {
						isExcels = true
					}
					if (item.path.indexOf('.xlsx') != -1) {
						isExcels = true
					}
					this.localList.push({
						filename: item.filenames,
						dmPaperSize: 285,
						dmCopies: 1,
						dmColor: 2,
						dmDuplex: 1,
						jobFile: item.path,
						jpPageRange: pr,
						current: 0,
						current1: 0,
						current2: 0,
						page: 1,
						start: 1,
						end: 1,
						mid: 1,
						chooseStr: '长边',
						PageCount: 1,
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
					uni.removeStorageSync('files')
			
			
				})
			} else {
				let Arr = []
				if (uni.getStorageSync('filesListss')) {
					if (uni.getStorageSync('filesListss') != '') {
						Arr = uni.getStorageSync('filesListss')
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
			pre(index){
				let arr = []
				this.localList.forEach((item=>{
					arr.push('https://tm.ydlweb.com'+item.jobFile)
				}))
				uni.previewImage({
					urls:arr,
					current:index
				})
			},
			async select(e){
				let info = uni.getStorageSync('info')
				let that = this
				if(e.name == '微信聊天图片'){
					
					this.upload()
				}
				else if(e.name == '拍照'){
					const res = await uni.chooseMedia({
					count: 1,
					  mediaType: ['image'],
					  sourceType: ['camera'],
					});
					
					console.log(res);
					for (let i = 0; i < res[1].tempFiles.length; i++) {
					  try {
					    uni.showLoading({
					      title: '上传中',
					      mask: true
					    });
					    
					    const res2 = await this.uploadFile1(res[1].tempFiles[i]);
					    that.result = res2.result
					    that.localList.push({
					    	filename: that.result.filename,
					    	dmPaperSize: 9,
					    	dmCopies: 1,
					    	dmColor: 2,
					    	dmDuplex: 1,
					    	jobFile: that.result.path,
					    	jpPageRange: 1,
					    	current: 0,
					    	current1: 0,
					    	current2: 0,
					    	page: 1,
					    	start: 1,
					    	end: 1,
					    	mid: 1,
					    	chooseStr: '长边'
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
				}
				else{
					const res = await uni.chooseMedia({
					count: 15,
					  mediaType: ['image'],
					  sourceType: ['album'],
					});
					
					console.log(res);
					for (let i = 0; i < res[1].tempFiles.length; i++) {
					  try {
					    uni.showLoading({
					      title: '上传中',
					      mask: true
					    });
					    
					    const res2 = await this.uploadFile1(res[1].tempFiles[i]);
					    that.result = res2.result
					    that.localList.push({
					    	filename: that.result.filename,
					    	dmPaperSize: 285,
					    	dmCopies: 1,
					    	dmColor: 2,
					    	dmDuplex: 1,
					    	jobFile: that.result.path,
					    	jpPageRange: 1,
					    	current: 0,
					    	current1: 0,
					    	current2: 0,
					    	page: 1,
					    	start: 1,
					    	end: 1,
					    	mid: 1,
					    	chooseStr: '长边'
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
				}
			},
			del(index){
				this.localList.splice(index,1)
				uni.setStorageSync('filesListss',this.localList)
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
			          resolve({ result: data.result });
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
			uploadFile1(file) {
			  return new Promise((resolve, reject) => {
			    uni.uploadFile({
			      url: 'https://tm.ydlweb.com/Mini/ApiConnect/upload',
			      filePath: file.tempFilePath,
			      name: 'file',
			      header: {},
			      formData: {
			        "user_id": uni.getStorageSync('user_id'),
			        "file_name": 'image'
			      },
			      success(res) {
			        const data = JSON.parse(res.data);
			        if (data.status === 1) {
			          resolve({ result: data.result });
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
			async upload() {
				let info = uni.getStorageSync('info')
				let that = this
				
				const res = await uni.chooseMessageFile({
				  count: 15,
				  type: 'image'
				});
				
				console.log(res);
				
							
				for (let i = 0; i < res[1].tempFiles.length; i++) {
				  try {
				    uni.showLoading({
				      title: '上传中',
				      mask: true
				    });
				    
				    const res2 = await this.uploadFile(res[1].tempFiles[i]);
				    
					console.log();		
				    that.result = res2.result
				    
					that.localList.push({
						filename:that.result.filename,
						dmPaperSize:285,
						dmCopies:1,
						dmColor:2,
						dmDuplex:1,
						jobFile:that.result.path,
						jpPageRange:1,
						current:0,
						current1:0,
						current2:0,
						page:1,
						start:1,
						end:1,
						mid:1,
						chooseStr:'长边'
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
			

			getPrinterStatusd(task_id) {
				let info = uni.getStorageSync('info')
				let data = {}
				data.device_port = info.port
				data.task_id = task_id
				getPrinterStatus(data,(res)=>{
					if (res.result.task_state == 'SUCCESS') {
						
						uni.hideLoading()
						let result = res.result.task_result
						uni.setStorageSync('preUrl', result.data.img_list)
						uni.navigateTo({
							url: '/pageA/newPage/webview'
						})
					
					} else if (res.result.task_state == 'FAILURE') {
						uni.hideLoading()
						uni.showToast({
							title: res.result.task_state,
							icon: 'none'
						})
					
					
					} else {
						uni.showLoading({
							title: res.result.task_state
						})
						setTimeout(() => {
							this.getPrinterStatusd(task_id)
						}, 1000)
					
					
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
				if(this.localList[index].page > 1){
					if(this.localList[index].current == 0){
						data.jpPageRange = this.localList[index].start + '-'+this.localList[index].end
					}
					else{
						data.jpPageRange = this.localList[index].mid
					}
				}
				else{
					data.jpPageRange = this.localList[index].mid
				}
				
				data.isPreview = 1 // 0打印 1预览
				data.jobFile = this.localList[index].jobFile
				setPrinterJob6(data,(res)=>{
					if (res.status == 1) {
						this.task_id = res.result.task_id
						this.getPrinterStatusd(res.result.task_id)
					}
				})
				
			},
			changeStr(e,index) {
				let indexs = e.detail.value
				this.localList[index].chooseStr = this.Range[indexs].name
				if (indexs == 0) {
					this.localList[index].dmDuplex = 2
				} else {
					this.localList[index].dmDuplex = 3
				}
			},
			changeBtn(index, type,indexs) {
				if (type == 1) {
					this.localList[index].current = indexs
					if (indexs == 0) {
						this.localList[index].jpPageRange = this.localList[index].start + '-' + this.localList[index].end
					} else {
						this.localList[index].jpPageRange =  this.localList[index].mid
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
		
		
			getPrinterOrder(){
				if(this.localList != ''){
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
					data.printList = this.localList
					data.print_type = uni.getStorageSync('print_type')
					getPrinterOrderInfo6(data,(res)=>{
						if (res.status == 1) {
							uni.navigateTo({
								url:'/pageA/newPage/order?price='+res.result.total_price+'&pay_id='+res.result.pay_id+'&type=6'
							})
						}
					})
					
				}
				else{
					uni.showToast({
						title:'请先上传文件',
						icon:'none'
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
		margin-top: 20rpx;
		padding: 30rpx 40rpx;
		border-radius: 25rpx;
		box-sizing: border-box;
		background-color: #fff;
	
		.inputs {
	
			.inputd {
				margin-top: 10rpx;
				width: 93rpx;
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
			
	
			.active {
				background-color: #ccc;
				color: #fff;
			}
		}
	
		.list-item {
			margin-top: 10rpx;
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
		margin-top: 30rpx;
		font-family: "PingFang SC Heavy";
		font-weight: 900;
		font-size: 30rpx;
		color: #fff;
	}
	.contents {
		width: 690rpx;
		min-height: 494rpx;
		border-radius: 15rpx;
		background: #fff;
		margin: 0 auto;
		margin-top: 40rpx;
		padding: 45rpx;
		box-sizing: border-box;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		row-gap: 40rpx;
	
		.images {
			width: 285rpx;
			height: 396rpx;
			border-radius: 15rpx;
			background: #fff;
			box-shadow: 0 0 15rpx #9f9f9f29;
		}
		.close{
			position: absolute;
			right:5rpx;
			top:5rpx;
			width:45rpx;
			height:45rpx;
		}
	}
</style>