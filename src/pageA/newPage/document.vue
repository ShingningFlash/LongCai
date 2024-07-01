<template>
	<view>
		<view class="content">
			<view class="list flex m-center" @click="upload">
				<image style="width: 108rpx;height: 92rpx;margin-right: 50rpx;" src="/static/wxlogo.svg"></image>
				<view class="">
					<view class="model1" style="font-size: 32rpx;font-weight: bold;">
						微信聊天文档打印
					</view>
					<view class="model2" style="font-size: 24rpx;color:#A6A7A7;margin-top:10rpx">
						从微信聊天记录中选择文档打印
					</view>
				</view>
			</view>
			<view class="list flex m-center" @click="navTo('/pageA/newPage/webview?type=2')" style="margin-top:137rpx">
				<image style="width: 108rpx;height: 92rpx;margin-right: 50rpx;" src="/static/fileIcon.svg"></image>
				<view class="">
					<view class="" style="font-size: 32rpx;font-weight: bold;">
						本地文档打印
					</view>
					<view class="" style="font-size: 24rpx;color:#A6A7A7;margin-top:10rpx">
						从手机本地选择文档一键打印
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			
			navTo(url) {
				uni.setStorageSync('print_type',1)
				uni.navigateTo({
					url: url
				})
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
			async upload() {
				uni.setStorageSync('print_type',1)
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
					  		duration:2000
					  	})
					  	return
					  }
				    uni.showLoading({
				      title: '上传中'+Number(i+1)+'/'+res[1].tempFiles.length,
				      mask: true
				    });
				    const res2 = await this.uploadFile(res[1].tempFiles[i]);
					arr.push(res2.result)
					uni.setStorageSync('files', arr)
					
					
					
					
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
				
				uni.navigateTo({
					url: '/pageA/newPage/local'
				})
			},
		}
	}
</script>
<style>
	page {
		background-color: #F1F5FB;
	}
</style>
<style lang="scss" scoped>
	.content {
		width: 690rpx;
		margin: 0 auto;
		padding: 108rpx 54rpx;
		box-sizing: border-box;
		margin-top: 50rpx;
		height: 564rpx;
		background: #fff;

		.list {

			// height: 120rpx;
			margin: 0 auto;

			// line-height: 120rpx;
			text-align: center;
			background-color: #fff;

			.model1 {
				font-family: "PingFang SC Bold";
				font-weight: 700;
				font-size: 38rpx;
				text-align: center;
				color: #000;
			}

			.model2 {
				font-family: "PingFang SC Medium";
				font-weight: 500;
				font-size: 24rpx;
				text-align: center;
				color: #b8b8b8;
			}

		}
	}
</style>