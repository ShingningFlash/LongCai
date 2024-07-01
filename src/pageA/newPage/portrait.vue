<template>
	<view>
		<view style="width: 690rpx;height:690rpx;margin: 0 auto;margin-top: 20rpx;background-color: #fff;">
			<image :src="imageUrl" style="width: 690rpx;height: 690rpx" mode="aspectFit">

			</image>
		</view>
		<view v-if="showPrivacy">
			<view>是否允许</view>
			<button id="agree-btn" open-type="agreePrivacyAuthorization"
				bindagreeprivacyauthorization="handleAgreePrivacyAuthorization">同意</button>
		</view>
		<button class="btn1" @click="show = true">添加证件照</button>
		<button class="btn1" @click="show1 = true" style="margin-top:30rpx">添加证件照(去底色)</button>
		<button class="btn1" @click="navTo('/pageA/newPage/printpic/sixlocal?imageUrl='+JSON.stringify(path))" style="margin-top:30rpx">
			前往打印
		</button>
		<u-action-sheet :actions="list"  :show="show" @select="select" :closeOnClickOverlay="true" @close="show = false"></u-action-sheet>
		<u-action-sheet :actions="list"  :show="show1" @select="select1" :closeOnClickOverlay="true" @close="show1 = false"></u-action-sheet>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageUrl: '',
				imageFile: [],
				path: '',
				showPrivacy: false,
				show:false,
				show1:false,
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
		onLoad() {
			wx.onNeedPrivacyAuthorization(resolve => {
				// 需要用户同意隐私授权时
				// 弹出开发者自定义的隐私授权弹窗
				this.showPrivacy = true
				this.resolvePrivacyAuthorization = resolve
			})


		},
		methods: {
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
			// 获取 64转图片格式
			getBase64ImageUrl(base64Url) {
				/// 获取到base64Data
				var base64Data = base64Url;
				/// 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
				base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data));
				/// 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
				const base64ImgUrl = "data:image/png;base64," + base64Data;
				/// 得到的base64ImgUrl直接给图片:src使用即可
				return base64ImgUrl;
			},
			handleAgreePrivacyAuthorization() {

			},
			// 64转本地图片然后上传
			getToLocal(b64) {
				var that = this
				var base64data = b64; // base64
				const fsm = wx.getFileSystemManager();
				const FILE_BASE_NAME = 'tmp_base64src'; //自定义文件名
				const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
				if (!format) {
					return (new Error('ERROR_BASE64SRC_PARSE'));
				}
				const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
				const buffer = wx.base64ToArrayBuffer(bodyData);
				fsm.writeFile({
					filePath,
					data: buffer,
					encoding: 'binary',
					success(r) {
						console.log(r, 'r')
						console.log(filePath, 'filePath')
						uni.showLoading({
							title:'上传中...',
							mask:true
						})
						uni.uploadFile({
							url: 'https://tm.ydlweb.com/Mini/ApiConnect/upload',
							filePath: filePath,
							name: 'file',
							header: {

							},
							formData: {
								'file': filePath,
								"user_id": uni.getStorageSync('user_id')
							},
							success(res2) {
								uni.hideLoading()
								if (JSON.parse(res2.data).status == 1) {
									
									that.result = JSON.parse(res2.data).result
									let arr =[]
									if(uni.getStorageSync('files')){
										arr = uni.getStorageSync('files')
									}
									
									arr.push(that.result)
									uni.setStorageSync('files',arr)
									
									
									uni.navigateTo({
										url:'/pageA/newPage/printpic/sixlocal'
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
							complete: () => {
								uni.hideLoading()
							}
						});
					},
					fail() {
						return (new Error('ERROR_BASE64SRC_WRITE'));
					},
				});
			},
			// 获取去底图片
			getback(tk, pic) {
				console.log("获取去底图片请求");
				uni.request({
					url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/body_seg',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						image: pic,
						access_token: tk
					},
					success: res => {
						console.log(res, 'res');
						let imgUrl
						console.log("获取去底图片请求成功");
						imgUrl = this.getBase64ImageUrl(res.data.foreground)
						this.getToLocal(imgUrl)
					},
					fail: res => {
						console.log(res);
					}
				});
			},
			// 原图
			addpic() {
				let that = this
				uni.chooseMedia({
					mediaType: ['image'],
					success: (res) => {
						console.log(res);
						if (res.errMsg == 'chooseMedia:ok') {
							// that.path =  res.tempFiles
							uni.uploadFile({
								url: 'https://tm.ydlweb.com/Mini/ApiConnect/upload',
								filePath: res.tempFiles[0].tempFilePath,
								name: 'file',
								header: {

								},
								formData: {
									'file': res.tempFiles,
									"user_id": 45
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
			},
			// 去底色
			addpic1() {
				let that = this
				uni.chooseMessageFile({
					count: 1,
					type: 'image',
					success: (res) => {
						console.log(res);
						
							that.show1 = false
							uni.request({
								url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=cjduUClBkEIkZoAv2hnlGPVD&client_secret=6gj2AMmId9SrCuq9SirfrrFNQqNGY9yo',
								method: 'GET',
								success: resd => {
									console.log(resd);
									uni.showLoading({
										title:'处理图像中...',
										mask:true
									})
									let picToBase64
									uni.getFileSystemManager().readFile({
										filePath: res.tempFiles[0].path,
										encoding: 'base64',
										success: (resdf) => {
											console.log('picToBase64');
											picToBase64 = resdf
												.data
											that.getback(resd.data[
													'access_token'
												],
												picToBase64);
										}
									})

								}
							});
							
						
					},
					fail(err) {
						console.log(err);
					}
				})
			},
			upload() {
				let info = uni.getStorageSync('info')
				let that = this
				uni.chooseMessageFile({
					count: 1,
					type: 'image',
					success(res) {
						console.log(res);
						uni.showLoading({
							title: '上传中',
							mask: true
						})
			
						uni.uploadFile({
							url: 'https://tm.ydlweb.com/Mini/ApiConnect/upload',
							filePath: res.tempFiles[0].path,
							name: 'file',
							header: {
			
							},
							formData: {
								'file': res.tempFiles,
								"user_id": uni.getStorageSync('user_id'),
								"file_name": res.tempFiles[0].name
							},
							success(res2) {
								uni.hideLoading()
								if (JSON.parse(res2.data).status == 1) {
									
									that.result = JSON.parse(res2.data).result
									let arr =[]
									if(uni.getStorageSync('files')){
										arr = uni.getStorageSync('files')
									}
									
									arr.push(that.result)
									uni.setStorageSync('files',arr)
									
									
									uni.navigateTo({
										url:'/pageA/newPage/printpic/sixlocal'
									})
									
			
								} else {
									uni.showToast({
										title: JSON.parse(res2.data).msg,
										icon: "none",
										duration: 2000
									});
								}
							}
						});
					}
				})
			},
			select(e){
				let info = uni.getStorageSync('info')
				let that = this
				if(e.name == '微信聊天图片'){
					
					this.upload()
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
										uni.hideLoading()
										if (JSON.parse(res2.data).status == 1) {
											
											that.result = JSON.parse(res2.data).result
											let arr =[]
											if(uni.getStorageSync('files')){
												arr = uni.getStorageSync('files')
											}
											
											arr.push(that.result)
											uni.setStorageSync('files',arr)
											
											
											uni.navigateTo({
												url:'/pageA/newPage/printpic/sixlocal'
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
										uni.hideLoading()
										if (JSON.parse(res2.data).status == 1) {
											
											that.result = JSON.parse(res2.data).result
											let arr =[]
											if(uni.getStorageSync('files')){
												arr = uni.getStorageSync('files')
											}
											
											arr.push(that.result)
											uni.setStorageSync('files',arr)
											
											
											uni.navigateTo({
												url:'/pageA/newPage/printpic/sixlocal'
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
			
			select1(e){
				let info = uni.getStorageSync('info')
				let that = this
				if(e.name == '微信聊天图片'){
					
					this.addpic1()
				}
				else if(e.name == '拍照'){
					uni.chooseMedia({
						count:1,
						mediaType:['image'],
						sourceType:['camera'],
						success:res=>{
							that.show1 = false
							console.log(res);
							
							if(res.errMsg == 'chooseMedia:ok'){
								uni.request({
									url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=cjduUClBkEIkZoAv2hnlGPVD&client_secret=6gj2AMmId9SrCuq9SirfrrFNQqNGY9yo',
									method: 'GET',
									success: resd => {
										console.log(resd);
										uni.showLoading({
											title:'处理图像中...',
											mask:true
										})
										let picToBase64
										uni.getFileSystemManager().readFile({
											filePath: res.tempFiles[0].tempFilePath,
											encoding: 'base64',
											success: (resdf) => {
												console.log("成功");
												picToBase64 = resdf
													.data
												that.getback(resd.data[
														'access_token'
													],
													picToBase64);
											}
										})
								
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
							that.show1 = false
							console.log(res);
							if(res.errMsg == 'chooseMedia:ok'){
								uni.request({
									url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=cjduUClBkEIkZoAv2hnlGPVD&client_secret=6gj2AMmId9SrCuq9SirfrrFNQqNGY9yo',
									method: 'GET',
									success: resd => {
										console.log(resd);
										uni.showLoading({
											title:'处理图像中...',
											mask:true
										})
										let picToBase64
										uni.getFileSystemManager().readFile({
											filePath: res.tempFiles[0].tempFilePath,
											encoding: 'base64',
											success: (resdf) => {
								
												picToBase64 = resdf
													.data
												that.getback(resd.data[
														'access_token'
													],
													picToBase64);
											}
										})
								
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
			
			
			
		}
	}
</script>

<style>
	page{
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