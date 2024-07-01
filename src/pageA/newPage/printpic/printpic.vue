<template>
	<view>
		<view
			style="width: 690rpx;height:690rpx;margin: 0 auto;margin-top: 20rpx;border: 1rpx solid #fff;background-color: #fff;">
			<image :src="imageUrl" style="width: 690rpx;height: 690rpx" mode="aspectFit">

			</image>
		</view>
		<view v-if="showPrivacy">
			<view>是否允许</view>
			<button id="agree-btn" open-type="agreePrivacyAuthorization"
				bindagreeprivacyauthorization="handleAgreePrivacyAuthorization">同意</button>
		</view>
		<view class="" style="width: 690rpx;height:690rpx;margin: 0 auto;margin-top: 20rpx;">
			<button class="btn1" @click="show = true">添加图片</button>
			<button class="btn1" @click="navTo('/pageA/newPage/printpic/local?imageUrl='+JSON.stringify(path))">
				前往打印
			</button>
		</view>
		<u-action-sheet :actions="list"  :show="show" @select="select" :closeOnClickOverlay="true" @close="show = false"></u-action-sheet>
	</view>
</template>

<script>
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
				imageUrl: '',
				imageFile: [],
				path: '',
				showPrivacy: false
			}
		},
		onLoad() {
			wx.onNeedPrivacyAuthorization(resolve => {
				// 需要用户同意隐私授权时
				// 弹出开发者自定义的隐私授权弹窗
				this.showPrivacy = true
				this.resolvePrivacyAuthorization = resolve
			})


		},
		methods: {
			select(e){
				let that = this
				if(e.name == '微信聊天图片'){
					
					this.addpic()
				}
				else if(e.name == '拍照'){
					uni.chooseMedia({
						count:1,
						mediaType:['image'],
						sourceType:['camera'],
						success:res=>{
							that.show = false
							console.log(res);
							if(res.errMsg == 'chooseMedia:ok'){
								uni.uploadFile({
									url: 'https://tm.ydlweb.com/Mini/ApiConnect/upload',
									filePath: res.tempFiles[0].tempFilePath,
									name: 'file',
									header: {
								
									},
									formData: {
										// 'file': res.tempFiles,
										"user_id": uni.getStorageSync('user_id'),
										"file_name": res.type
									},
									success(res2) {
										if (JSON.parse(res2.data).status == 1) {
											console.log(JSON.parse(res2.data));
											that.imageUrl = JSON.parse(res2.data).result.showUrl
											that.path = JSON.parse(res2.data).result
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
							}
							else{
								uni.showToast({
									title: res.errMsg,
									icon: "none",
									duration: 2000
								});
							}
						}
					})
				}
				else{
					uni.chooseMedia({
						count:1,
						mediaType:['image'],
						sourceType:['album'],
						success:res=>{
							that.show = false
							console.log(res);
							if(res.errMsg == 'chooseMedia:ok'){
								uni.showLoading({
									title:'正在上传图片...',
									mask:true
								})
								uni.uploadFile({
									url: 'https://tm.ydlweb.com/Mini/ApiConnect/upload',
									filePath: res.tempFiles[0].tempFilePath,
									name: 'file',
									header: {
								
									},
									formData: {
										// 'file': res.tempFiles,
										"user_id": uni.getStorageSync('user_id'),
										"file_name": res.tempFiles[0].name
									},
									success(res2) {
										if (JSON.parse(res2.data).status == 1) {
											console.log(JSON.parse(res2.data));
											that.imageUrl = JSON.parse(res2.data).result.showUrl
											that.path = JSON.parse(res2.data).result
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
									},
									complete: (com) => {
										uni.hideLoading()
									}
								});
							}
							else{
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
			getPageTotal() {

			},
			navTo(url) {
				if (this.imageUrl != '') {



					uni.navigateTo({
						url: url
					})
				} else {
					uni.showToast({
						title: '请先上传图片',
						icon: 'none'
					})
				}

			},
			handleAgreePrivacyAuthorization() {

			},
			addpic() {
				let that = this
				uni.chooseMessageFile({
					type: 'image',
					success: (res) => {
						console.log(res);
						that.show = false
						if (res.errMsg == 'chooseMessageFile:ok') {
							// that.path =  res.tempFiles
							uni.uploadFile({
								url: 'https://tm.ydlweb.com/Mini/ApiConnect/upload',
								filePath: res.tempFiles[0].path,
								name: 'file',
								header: {

								},
								formData: {
									'file': res.tempFiles,
									"user_id": 45,
									"file_name": res.tempFiles[0].name
								},
								success(res2) {
									if (JSON.parse(res2.data).status == 1) {
										console.log(JSON.parse(res2.data));
										that.imageUrl = JSON.parse(res2.data).result.showUrl
										that.path = JSON.parse(res2.data).result
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
						}
					},
					fail(err) {
						console.log(err);
					}
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #f3f3f3;
	}
</style>
<style lang="scss" scoped>
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
</style>