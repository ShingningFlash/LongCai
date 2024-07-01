<template>
	<view class="">
		<view class="flex m-center">
			<view class="flex-col" style="margin-top:30rpx" @click="navTo('/pageA/newPage/specDetail?id=1')">
				<image style="width:275rpx;height:280rpx;" src="/static/zj.png"></image>
				<view class="text">
					{{dataList.spec_name}}
				</view>
				<view class="text2">
					{{dataList.width_mm}}x{{dataList.height_mm}}mm
				</view>

			</view>
		</view>

		<view class="content" style="">
			<view class="flex m-between s-center">
				<view>冲印尺寸</view>
				<view>{{dataList.width_mm}}x{{dataList.height_mm}}mm</view>
			</view>
			<view class="flex m-between s-center" style="margin-top: 30rpx;">
				<view>像素尺寸</view>
				<view>{{dataList.width_px}}x{{dataList.height_px}}mm</view>
			</view>
			<view class="flex m-between s-center" style="margin-top: 30rpx;">
				<view>分辨率</view>
				<view>无要求</view>
			</view>
			<view class="flex m-between s-center" style="margin-top: 30rpx;">
				<view>文件大小</view>
				<view>{{dataList.file_size_max == null ? '无要求' : '文件最大不超过'+ dataList.file_size_max*1024 +'kb' }}</view>
			</view>
			<view class="flex m-between s-center" style="margin-top: 30rpx;">
				<view>颜色</view>
				<view v-for="(item,index) in dataList.background_color" :key="index" style="width:45rpx;height: 45
				rpx;border-radius: 50%;margin-left: 20rpx;" :style="{background:item.color_name}"></view>
			</view>

		</view>
		<view class="flex m-between s-center" style="padding: 0 30rpx;">
			<view class="btn1" @click="xcEvent('xc')">
				从相册选择
			</view>
			<view class="btn1" @click="xcEvent('xj')">
				用相机拍摄
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				dataList: {},
				spec_id: ''
			}
		},
		onLoad(e) {
			if (e.id) {
				this.spec_id = e.id
				this.getSpecDetail(e.id)
			}
		},
		methods: {
			
			xcEvent(type) {
				let source 
				if(type == 'xc'){
					source = 'album'
				}
				else{
					source = 'camera'
				}
				let that = this
				uni.chooseMedia({
					count: 1,
					mediaType: ['image'],
					sourceType: [source],
					success: res => {
						uni.getImageInfo({
							src: res.tempFiles[0].tempFilePath,
							success: (res2) => {
								uni.showLoading({
									title: '制作并检测中...',
									mask: true
								})

								// 转换为Base64编码
								const filePath = res2.path;
								uni.getFileSystemManager().readFile({
									filePath: filePath,
									encoding: 'base64',
									success: function(res3) {
										// 转换成功，获取到Base64编码的图片
										console.log(res.data); // Base64编码的图片数据
										let data = {}
										data.file = res3.data
										data.spec_id = that.spec_id
										data.app_key =
											'1bc75a0b3380a8f3499e102315a6daacb681896d'
										uni.request({
											url: 'https://apicall.id-photo-verify.com/api/cut_check_pic',
											method: 'POST',
											data: data,
											success: (res4) => {
												if (res4.data.code ==200) {
													uni.hideLoading()
													console.log(res4);
													if(res4.data.result.check == 1){
														uni.setStorageSync('source_file',res4.data.result.source_file)
														uni.setStorageSync('picList',res4.data.result.file_name_wm) //带水印图片名字，包括多种可选颜色
														uni.setStorageSync('picList1',res4.data.result.file_name_print_wm) //带水印排版图片名字，包括多种可选颜色
														uni.setStorageSync('picList2',res4.data.result.img_wm_url_list) //带水印排版图片url，包括多种可选颜色
														uni.setStorageSync('picList3',res4.data.result.print_wm_url_list) //带水印排版图url，包括多种可选颜色
														uni.setStorageSync('file_name_print',res4.data.result.file_name_print) //无水印排版图片名字，包括多种可选颜色
														
														uni.navigateTo({
															url:'/pageA/newPage/preview?spec_id='+that.spec_id
														})
													}
													else{
														if(res4.data.not_check_result){
															uni.showToast({
																title:res4.data.not_check_result[0].param_message,
																icon:'none',
																duration:2000
															})
														}
														else{
															uni.showToast({
																title:"制作时出现异常",
																icon:'none'
															})
														}
														
														
													}
												}
												else{
													uni.hideLoading()
													uni.showModal({
														title:'提示',
														content:res4.data.error,
														showCancel:false,
														success: (res) => {
															if(res.confirm){
																
															}
														}
													})
													
												}
											},
											complete: (com) => {
												
											}

										})

									},
									fail: function(error) {
										// 转换失败，处理错误
										console.error(error);
										uni.hideLoading()
									}
								})




							}
						})

					}
				})






			},
			getSpecDetail(id) {
				uni.request({
					url: 'https://apicall.id-photo-verify.com/api/get_specs/' + id,
					method: 'GET',
					success: (res) => {
						if (res.data.code == 200) {
							this.dataList = res.data
							this.dataList.background_color = JSON.parse(this.dataList.background_color)
							console.log(this.dataList);
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.text {
		font-family: "PingFang SC Bold";
		font-weight: 700;
		font-size: 32rpx;
		text-align: center;
		color: #000;
	}

	.text2 {
		font-family: "PingFang SC Bold";
		font-weight: 700;
		font-size: 23rpx;
		text-align: center;
		margin-top: 10rpx;
		color: #9a9a9a;
	}


	.content {
		padding: 0 30rpx;
		margin-top: 20rpx;
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
</style>