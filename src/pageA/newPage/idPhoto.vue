<template>
	<view>
		<view class="" style="text-align: center;color:#ff0000;margin-top:60rpx;">
			可缩放图片调整打印范围
		</view>
		<canvas canvas-id='preview-canvas' disable-scroll="true"
			style="width: 1051px;height: 1500px;left: -10000px;top: -10000px; position: fixed; z-index: -10;"></canvas>
			
		<view class="t-wt-kuang"
			:style="{left:isScale?'calc(50% - 246.6rpx)':'calc(50% - 244rpx)',top:isScale?'calc(50% - 357.8rpx)':'calc((80% - 784rpx)/2)',width:isScale?'493.2rpx':'488rpx',height:isScale?'615.6rpx':'684rpx'}">
			<bt-cropper ref="cropper" :imageSrc="img" :ratio="0" :canvas2d="true"></bt-cropper>
		</view>
		
		<view @click="show = true" v-if="!src" class="t-wt-kuang"
			:style="{backgroundImage:'url(/static/icons/caijiankuang.png)',backgroundSize:'100% 100%',backgroundRepeat:'no-repeat',left:isScale?'calc(50% - 246.6rpx)':'calc(50% - 244rpx)',top:isScale?'calc(50% - 357.8rpx)':'calc((80% - 784rpx)/2)',width:isScale?'493.2rpx':'488rpx',height:isScale?'615.6rpx':'684rpx'}">
			<!-- <image :src="img" style="width: 100%;height:100%"></image> -->
			<image class="t-wt-ktx" src="/pageA/static/touxiang.png"></image>
			<view class="t-add-con t-flex-col">
				<image class="t-add-icon" src="/static/icons/add.png"></image>
				<view class="t-add-txt">上传照片</view>
			</view>
		</view>
		<!-- 底部提示 -->
		<view class="t-zjz-ms1">
			<text v-if="id == 1">1寸照片</text>
			<text v-if="id == 4">小1寸照片</text>
			<text v-if="id == 7">大1寸照片</text>
			<text v-if="id == 10">2寸照片</text>
			<text v-if="id == 13">小二寸照片</text>
			<text v-if="id == 391">简历照片</text>
			<text v-if="id==1">25mm*35mm</text>
			<text v-if="id==4">22mm*32mm</text>
			<text v-if="id==7">33mm*48mm</text>
			<text v-if="id==10">35mm*49mm</text>
			<text v-if="id==13">35mm*45mm</text>
			<text v-if="id==391">25mm*35mm</text>
		</view>
		<view class="btn11" @click="show = true" v-if="img != ''">
			重新上传
		</view>
		<view class="btn1" @click="crop">
			下一步
		</view>



		<!-- <view class="t-zjz-ms2">请将图片铺满方框并把人像对准虚线</view> -->
		<u-action-sheet :actions="list" :show="show" @select="select1" :closeOnClickOverlay="true"
			@close="show = false"></u-action-sheet>
	</view>
</template>

<script>
	import btCropper from '../uni_modules/bt-cropper/components/bt-cropper/bt-cropper'
	import {

		getPrinterOrderInfo6
	} from '@/api/index.js'
	export default {
		components: {
			btCropper
		},
		data() {

			return {
				ww: wx.getSystemInfoSync().windowWidth,
				wh: wx.getSystemInfoSync().windowHeight,
				localList: [{
					filename: 'photo',
					dmPaperSize: 285, //
					dmCopies: 1,
					dmColor: 2, //颜色
					dmDuplex: 1, //单双面 1 单
					jobFile: '',
					jpPageRange: '1',
					current: 0,
					current1: 0,
					current2: 0,
					page: 1,
					start: 1,
					end: 1,
					mid: 1,
					chooseStr: '长边'
				}, ],
				src: false,
				show: false,
				img: '',
				imageSrc: '',
				cutTop: 0,
				cutHeight: 0,
				zjzType: 2,
				id: 2,
				width: 0,
				height: 0,
				isScale: false, //是否缩放，针对小屏高度小于603
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
			initCanvas: function(zjzType, pic) {
				uni.showLoading({
					title: '证件照生成中...',
					mask: true
				})

				const $ = this;
				
				
				if (zjzType == 1 || zjzType == 4 || zjzType == 391) {
					//1寸
					var canvasWidth = 1000;  // 画布宽度，可根据需要调整
					  var canvasHeight = 600;  // 画布高度，可根据需要调整
					  var photoWidth = 160;  // 每张照片的宽度，5个间隔，4张照片
					  var photoHeight = 210;  // 每张照片的高度，3个间隔，2行照片
					  var gap = 10;  // 图片间隔
					
					  var cvx = wx.createCanvasContext("preview-canvas", this);
					    cvx.setFillStyle('white');
					    cvx.fillRect(-30, -30, canvasWidth + 60, canvasHeight + 60);
						 // 计算照片排列起始位置，使照片居中
						 var startX = (canvasWidth - (4 * photoWidth + 3 * gap)) / 2;
						   var startY = (canvasHeight - (2 * photoHeight + gap)) / 2;
					
					for (var i = 0; i < 8; i++) {
					    var row = Math.floor(i / 4);  // 计算行数
					    var col = i % 4;  // 计算列数
					
					    var x = startX + col * (photoWidth + gap);  // 计算照片的 x 坐标
					    var y = startY + row * (photoHeight + gap);  // 计算照片的 y 坐标
					
					    // 绘制照片
					    cvx.drawImage(pic, x, y, photoWidth, photoHeight);
					  }
					// cvx.drawImage(pic, l, t, w, h);
					// cvx.drawImage(pic, l + w + m, t, w, h);
					// cvx.drawImage(pic, l + (w + m) * 2, t, w, h);
					// cvx.drawImage(pic, l, t + h + m, w, h);
					// cvx.drawImage(pic, l + w + m, t + h + m, w, h);
					// cvx.drawImage(pic, l + (w + m) * 2, t + h + m, w, h);
					// cvx.drawImage(pic, l, t + (h + m) * 2, w, h);
					// cvx.drawImage(pic, l + w + m, t + (h + m) * 2, w, h);
					// cvx.drawImage(pic, l + (w + m) * 2, t + (h + m) * 2, w, h);
					  // Draw upper row
					 //     cvx.drawImage(pic, l, t, w, h);
					 //     cvx.drawImage(pic, l + w + gap, t, w, h);
					 //     cvx.drawImage(pic, l + 2 * (w + gap), t, w, h);
					 //     cvx.drawImage(pic, l + 3 * (w + gap), t, w, h);
					 
					 //     // Draw lower row
					 //     cvx.drawImage(pic, l, t + h + gap, w, h);
					 //     cvx.drawImage(pic, l + w + gap, t + h + gap, w, h);
					 //     cvx.drawImage(pic, l + 2 * (w + gap), t + h + gap, w, h);
					 //     cvx.drawImage(pic, l + 3 * (w + gap), t + h + gap, w, h);
				} else if(zjzType == 10 || zjzType == 7 || zjzType == 13) {
					//2寸
					var canvasWidth = 1000;  // 画布宽度，可根据需要调整
					var canvasHeight = 600;  // 画布高度，可根据需要调整
					var photoWidth = 205;  // 每张照片的宽度，5个间隔，4张照片
					var photoHeight = 323;  // 每张照片的高度，3个间隔，1行照片
					var gap = 10;  // 图片间隔
					
					var cvx = wx.createCanvasContext("preview-canvas", this);
					cvx.setFillStyle('white');
					cvx.fillRect(0, 0, canvasWidth, canvasHeight);
					
					// 计算照片排列起始位置，使照片居中
					var totalWidth = 2 * photoHeight + gap;
					var totalHeight = photoWidth * 2 + gap;
					var startX = (canvasWidth - totalWidth) / 2;
					var startY = (canvasHeight - totalHeight) / 2;
					
					for (var i = 0; i < 4; i++) {
					    var row = Math.floor(i / 2);  // 计算行数
					
					    var x = startX + row * (photoHeight + gap);  // 计算照片的 x 坐标
					    var y = startY + (i % 2) * (photoWidth + gap);  // 根据奇偶确定照片的 y 坐标
					
					    // 绘制照片
					    cvx.save();
					    cvx.translate(x + photoHeight / 2, y + photoWidth / 2);  // 移动至图片中心点
					    cvx.rotate(-90 * Math.PI / 180);  // 旋转90°，角度转换为弧度
					    cvx.drawImage(pic, -photoWidth / 2, -photoHeight / 2, photoWidth, photoHeight);
					    cvx.restore();
					}
					
				}
				cvx.draw(true, () => {
					wx.canvasToTempFilePath({
						width: canvasWidth,
						height: canvasHeight,
						destWidth: canvasWidth,
						destHeight: canvasHeight,
						fileType: 'png',
						quality: 1,
						canvasId: 'preview-canvas',
						success: (res1) => {
							console.log(res1.tempFilePath);
							uni.hideLoading()
							uni.showLoading({
								title: '证件照上传中...'
							})
							var that = this
							uni.uploadFile({
								url: 'https://tm.ydlweb.com/Mini/ApiConnect/upload',
								filePath: res1.tempFilePath,
								name: 'file',
								header: {

								},
								formData: {
									"user_id": uni.getStorageSync('user_id'),
									"file_name": 'image'
								},
								success(res2) {

									if (JSON.parse(res2.data).status == 1) {
										let result = JSON.parse(res2.data).result
										uni.setStorageSync('previewUrl', result.showUrl)
										that.localList[0].jobFile = result.path
										that.getPrinterOrder()
									} else {
										uni.showToast({
											title: JSON.parse(res2.data).msg,
											icon: "none",
											duration: 2000
										});
									}
								},
								complete() {
									uni.hideLoading()
								},
								fail() {
									uni.showToast({
										title:'上传失败,请稍后尝试',
										icon:'none',
										duration:2000
									})
								}
							});
						}
					})
				});
			},
			crop() {
				if (this.src) {
					this.$refs.cropper.crop().then((res) => {
						this.imageSrc = res
						this.initCanvas(this.id, this.imageSrc)
					})
				} else {
					uni.showToast({
						title: '请先上传图片',
						icon: 'none',
						duration: 2000
					})
				}
			},
			getPrinterOrder() {
				uni.showLoading({
					title:'正在下单中'
				})
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
				getPrinterOrderInfo6(data, (res) => {
					uni.hideLoading()
					if (res.status == 1) {
						uni.navigateTo({
							url: '/pageA/newPage/order?price=' + res.result.total_price + '&pay_id=' + res
								.result.pay_id + '&type=6' + '&pai=2'
						})
					}
				})
			},

			//rpx转px
			toPx: function(d) {
				var ww = this.ww;
				return ww * d / 750;
			},
			//初始化裁减框
			initCroper: function(imgPath) {
				uni.showLoading({
					title: '正在处理中'
				})

				const $ = this;
				const isScale = $.isScale;
				var w = $.toPx(isScale ? 488 * 0.9 : 488);
				var h = $.toPx(isScale ? 684 * 0.9 : 684);
				wx.getImageInfo({
					src: imgPath,
					success: (res) => {
						console.log(res);
						uni.hideLoading()
						this.src = JSON.stringify(res)
						this.img = res.path
						this.width = w
						this.height = h

					}
				});
			},
			upload1(){
				let that = this
				uni.chooseMessageFile({
					count: 1,
					type: 'image',
					success(res){
						that.show1 = false
						uni.hideLoading()
						that.initCroper(res.tempFiles[0].path)
					}
				})
			},
			select1(e) {
				let info = uni.getStorageSync('info')
				let that = this
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
							if (res.errMsg == 'chooseMedia:ok') {

								uni.hideLoading()
								that.initCroper(res.tempFiles[0].tempFilePath)

							} else {
								uni.showToast({
									title: res.errMsg,
									icon: "none",
									duration: 2000
								});
							}

						}

					})
				} else {
					uni.chooseMedia({
						count: 1,
						mediaType: ['image'],
						sourceType: ['album'],
						success: res => {
							that.show = false
							console.log(res);
							if (res.errMsg == 'chooseMedia:ok') {

								uni.hideLoading()
								that.initCroper(res.tempFiles[0].tempFilePath)

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
		},
		onLoad(e) {
			if (e.id) {
				this.id = e.id
			}
		},
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
		background: #F7F7F7;
	}

	.t-edit-bottom {
		width: 100%;
		height: 100rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		z-index: 10;
		background: #fff;
	}

	.t-edit-wrap {
		width: 100%;
		height: 100%;
		position: relative;
		/* padding-left: 30rpx; */
		box-sizing: border-box;
	}

	.t-qd {
		width: 375rpx;
		height: 100%;
		background: #259f38;
		font-size: 32rpx;
		color: #FFFFFF;
		font-weight: bold;
	}

	.t-cz {
		height: 100%;
	}

	.t-xz {
		width: 40rpx;
		height: 40rpx;
		padding: 20rpx;
		margin-left: 42rpx;
	}

	.t-reupload {
		width: 148rpx;
		height: 66rpx;
		background: #EE9D18;
		font-size: 30rpx;
		color: #FFFFFF;
		margin-left: 30rpx;
	}

	.t-switch-size {
		width: 658rpx;
		height: 137rpx;
		box-sizing: border-box;
		position: absolute;
		z-index: 300;
		left: calc(50% - 329rpx);
		top: 40rpx;
	}

	.t-size-item {
		width: 315rpx;
		height: 100%;
		background: #fff;
		border: 1rpx solid #CFCFCF;
		border-radius: 10rpx;
		box-sizing: border-box;
		padding: 18rpx 22rpx;
	}

	.t-size-item image {
		width: 90rpx;
		height: 100rpx;
	}

	.t-size-desc {
		width: 165rpx;
		align-items: flex-start;
		padding-left: 20rpx;
	}

	.t-size-desc text:nth-child(1) {
		font-size: 32rpx;
		color: #272727;
		font-weight: bold;
		line-height: 45rpx;
	}

	.t-size-desc text:nth-child(2) {
		font-size: 24rpx;
		color: #888888;
		line-height: 33rpx;
		margin-top: 6rpx;
	}

	.t-size-selected {
		background: #259f38 !important;
		border: none !important;
	}

	.t-size-selected text {
		color: #fff !important;
	}

	.t-zjz-ms1 {
		width: 100%;
		margin-top: 44rpx;
		position: absolute;
		z-index: 300;
		left: 0;
		top: calc(50% + 170rpx);
		text-align: center;
	}

	.t-zjz-ms1 text:nth-child(1) {
		font-size: 28rpx;
		color: #272727;
		font-weight: bold;
		line-height: 40rpx;
	}

	.t-zjz-ms1 text:nth-child(2) {
		font-size: 24rpx;
		color: #888888;
		line-height: 33rpx;
		margin-left: 10rpx;
	}

	.t-zjz-ms2 {
		font-size: 24rpx;
		color: #272727;
		width: 100%;
		margin-top: 20rpx;
		position: absolute;
		z-index: 300;
		left: 0;
		text-align: center;
		top: calc(50% + 360rpx);
	}

	.t-wt-kuang {
		/* width: 488rpx;
  height: 684rpx; */
		position: absolute;
		z-index: 300;
		/* left: calc(50% - 244rpx);
  top: calc((100% - 784rpx)/2); */
	}

	.t-wt-ktx {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}

	.t-add-con {
		position: absolute;
		top: 329rpx;
		left: calc(50% - 42rpx);
		z-index: 1;
	}

	.t-add-icon {
		width: 84rpx;
		height: 84rpx;
	}

	.t-add-txt {
		font-size: 24rpx;
		color: #1C5FAB;
		line-height: 33rpx;
		margin-top: 20rpx;
	}

	.t-bt-add {
		font-size: 32rpx;
		color: #259f38;
		font-weight: bold;
		width: calc(100% - 375rpx);
		height: 100%;
	}

	.t-confirm-disable {
		background: #B2B2B2 !important;
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
		position: fixed;
		bottom: 60rpx;
		left: 50%;
		transform: translateX(-50%);
	}

	.btn11 {
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
		position: fixed;
		bottom: 180rpx;
		left: 50%;
		transform: translateX(-50%);
	}
</style>