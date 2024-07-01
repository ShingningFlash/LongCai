<template>
	<view>
		
		
		<view class="content">
			<view class="list flex m-center"@click="show = true">
				<image style="width: 108rpx;height: 102rpx;margin-right: 150rpx;" src="/static/image6.svg"></image>
				<view class="">
					<view class="model1" style="font-size: 32rpx;font-weight: bold;">
						6寸照片打印
					</view>
					<view class="model2" style="font-size: 24rpx;color:#A6A7A7;margin-top:10rpx">
						微信聊天记录、手机相册
					</view>
				</view>
			</view>
			<view class="list flex m-center" style="margin-top: 105rpx;" @click="show1 = true">
				<image style="width: 102rpx;height: 86rpx;margin-right: 150rpx;" src="/static/image6cun.svg"></image>
				<view class="">
					<view class="model1" style="font-size: 32rpx;font-weight: bold;">
						多张相片拼版
						
					</view>
					<view class="model1" style="font-size: 32rpx;font-weight: bold;">
						6寸相纸打印
					</view>
					<view class="model2" style="font-size: 24rpx;color:#A6A7A7;margin-top:10rpx">
						微信聊天记录、手机相册
					</view>
				</view>
			</view>
			
		</view>
		<u-action-sheet :actions="list"  :show="show" @select="select" :closeOnClickOverlay="true" @close="show = false"></u-action-sheet>
		<u-action-sheet :actions="list" :show="show1" @select="select1" :closeOnClickOverlay="true"
			@close="show1 = false"></u-action-sheet>
		<!-- <view class="list" >
			6寸照片拼版打印
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:false,
				show1: false,
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
			}
		},
		methods: {
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
			  const info = uni.getStorageSync('info');
			  const res = await uni.chooseMessageFile({
			    count: 15,
			    type: 'image'
			  });
			  
			  console.log(res);
			  let arr = [];
			
			  for (let i = 0; i < res[1].tempFiles.length; i++) {
			    try {
			      uni.showLoading({
			        title: '上传中',
			        mask: true
			      });
			      
			      const res2 = await this.uploadFile(res[1].tempFiles[i]);
			      arr.push(res2.result);
			
			      if (i === res[1].tempFiles.length - 1) {
			        uni.removeStorageSync('files');
			        uni.setStorageSync('files', arr);
			
			        uni.navigateTo({
			          url: '/pageA/newPage/printpic/sixlocal'
			        });
			      }
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
			
			async select(e){
				let info = uni.getStorageSync('info')
				let that = this
				uni.setStorageSync('print_type',4)
				if(e.name == '微信聊天图片'){
					
					this.upload()
				}
				else if(e.name == '拍照'){
					const res = await uni.chooseMedia({
						count: 15,
						mediaType: ['image'],
						sourceType: ['camera'],
					})
					let arr = []
					for (let i = 0; i < res[1].tempFiles.length; i++) {
					  try {
					    uni.showLoading({
					      title: '上传中',
					      mask: true
					    });
					    
					    const res2 = await this.uploadFile1(res[1].tempFiles[i]);
					    arr.push(res2.result);
								
					    if (i === res[1].tempFiles.length - 1) {
					      uni.removeStorageSync('files');
					      uni.setStorageSync('files', arr);
								
					      uni.navigateTo({
					        url: '/pageA/newPage/printpic/sixlocal'
					      });
					    }
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
					})
					let arr = []
					for (let i = 0; i < res[1].tempFiles.length; i++) {
					  try {
					    uni.showLoading({
					      title: '上传中',
					      mask: true
					    });
					    
					    const res2 = await this.uploadFile1(res[1].tempFiles[i]);
					    arr.push(res2.result);
								
					    if (i === res[1].tempFiles.length - 1) {
					      uni.removeStorageSync('files');
					      uni.setStorageSync('files', arr);
								
					      uni.navigateTo({
					        url: '/pageA/newPage/printpic/sixlocal'
					      });
					    }
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
			// 拼版
			upload1() {
				let info = uni.getStorageSync('info')
				let that = this
				uni.chooseMessageFile({
					count: 4,
					type: 'image',
					success(res) {
						let arr = []
						if (uni.getStorageSync('files')) {
							arr = uni.getStorageSync('files')
						}
						for(let i = 0; i < res.tempFiles.length; i++){
							arr.push(res.tempFiles[i].path)
							
						}
						
						uni.setStorageSync('files', arr)
						
						
						uni.navigateTo({
							url: '/pageA/newPage/picpinban?type=6'
						})
						
						
			
					}
				})
			},
			select1(e) {
				let info = uni.getStorageSync('info')
				let that = this
				uni.setStorageSync('print_type',5)
				if (e.name == '微信聊天图片') {
					this.upload1()
				} else if (e.name == '拍照') {
					uni.chooseMedia({
						count: 1,
						mediaType: ['image'],
						sourceType: ['camera'],
						success: res => {
							that.show1 = false
							uni.hideLoading()
							let arr = []
							if (uni.getStorageSync('files')) {
								arr = uni.getStorageSync('files')
							}
			
							arr.push(res.tempFiles[0].tempFilePath)
							uni.setStorageSync('files', arr)
			
			
							uni.navigateTo({
								url: '/pageA/newPage/picpinban?type=6'
							})
						}
			
					})
				} else {
					uni.chooseMedia({
						count: 4,
						mediaType: ['image'],
						sourceType: ['album'],
						success: res => {
							that.show = false
							console.log(res);
							if (res.errMsg == 'chooseMedia:ok') {
								that.show1 = false
								uni.hideLoading()
								let arr = []
								if (uni.getStorageSync('files')) {
									arr = uni.getStorageSync('files')
								}
								for(let i = 0; i < res.tempFiles.length; i++){
									arr.push(res.tempFiles[i].tempFilePath)
									
								}
								
								uni.setStorageSync('files', arr)
								
								
								uni.navigateTo({
									url: '/pageA/newPage/picpinban?type=6'
								})
								
								
							} else {
								uni.showToast({
									title: res.errMsg,
									icon: "none",
									duration: 2000
								});
							}
						}
					})
				}
			},
			navTo(url){
				if(url == '/pageA/newPage/picpinban'){
					uni.chooseImage({
						success: (res) => {
							if(res.errMsg == 'chooseImage:ok'){
								console.log(res.tempFilePaths[0]);
								uni.setStorageSync('pin',res.tempFilePaths[0])
								uni.navigateTo({
									url:url
								})
							}
						}
					})
				}
				else{
					uni.navigateTo({
						url:url
					})
				}
				
			}
		}
	}
</script>

<style>
	page{
		background-color: #f3f3f3;
	}
</style>
<style lang="scss" scoped>
.content{
		width:690rpx;
		margin: 0 auto;
		padding:81rpx 54rpx;
		box-sizing: border-box;
		margin-top:50rpx;
		// height: 564rpx;
		background: #fff;
		.list{
			
			// height: 120rpx;
			margin: 0 auto;
			
			// line-height: 120rpx;
			text-align: center;
			background-color: #fff;
			.model1{
				font-family: "PingFang SC Bold";
				font-weight: 700;
				font-size: 38rpx;
				text-align: center;
				color: #000;
			}
			.model2{
				font-family: "PingFang SC Medium";
				font-weight: 500;
				font-size: 24rpx;
				text-align: center;
				color: #b8b8b8;
			}
			
		}
	}

</style>
