<template>
	<view>
		<view style="width:100%;height:100rpx;">

			<view :class="temInfo.direction=='vertical'?'photo-box':'photo-box-h'">
				<view class="poster">
					<view class="poster-sc" ref="posterSc">
						<view @touchstart="touchstartCallback" @touchmove="touchmoveCallback"
							@touchend="touchendCallback" class="poster-img" :id="item.uuid"
							:style="{width:item.cutObj.width+'rpx',height:item.cutObj.height+'rpx',margin:item.cutObj.margin}"
							v-for="(item,index) in photoList" :key="index">
							<view class="fixed-close" @click="delPhoto(index)">
								<image src="../static/close_fill.png"></image>
							</view>
							<image class="Poster" :data-enode="item.url" data-etype="image" :src="item.url"
								:style="{transform:'translate('+item.stv.offsetX+'rpx,'+item.stv.offsetY+'rpx) scale('+item.stv.scale+') rotate('+item.stv.rotate+'deg)',width:item.imgObj.img_width+'rpx',height:item.imgObj.img_height+'rpx'}">
							</image>
						</view>
					</view>
				</view>
			</view>
			<eposter @onError="__e" @onSuccess="onSuccess" class="vue-ref" ref="Eposter" data-ref="Eposter"
				:direct="temInfo.direction" :ep_x="ep_x" :ep_y="ep_y" :height="ep_height" id="Eposter"
				:imgObjList="temInfo.imgObj" :width="ep_width" />
		</view>

		<view class="fixed-resume-list" style="padding-bottom: 200rpx;">
			<scroll-view class="fixed-content" scroll-x v-if="photoList.length == 0 || photoList.length == 1">
				<view class="fixed-item" v-for="(item,index) in temList[0]" :key="index" @click="selTemp(index)">

					<image :data-id="item.id" :class="item.id==temInfo.id?'shadow-inset':''" mode="aspectFit"
						style="width: 100%;height:100%;" :src="item.src"
						:style="{margin:(item[$orig].direction=='transverse'?'40rpx 0;':'0')}"></image>
				</view>
			</scroll-view>
			<scroll-view class="fixed-content" scroll-x v-if="photoList.length == 2">
				<view class="fixed-item" v-for="(item,index) in temList[1]" :key="index" @click="selTemp(index)">
			
					<image :data-id="item.id" :class="item.id==temInfo.id?'shadow-inset':''" mode="aspectFit"
						style="width: 100%;height:100%;" :src="item.src"
						:style="{margin:(item[$orig].direction=='transverse'?'40rpx 0;':'0')}"></image>
				</view>
			</scroll-view>
			<scroll-view class="fixed-content" scroll-x v-if="photoList.length == 3">
				<view class="fixed-item" v-for="(item,index) in temList[2]" :key="index" @click="selTemp(index)">
			
					<image :data-id="item.id" :class="item.id==temInfo.id?'shadow-inset':''" mode="aspectFit"
						style="width: 100%;height:100%;" :src="item.src"
						:style="{margin:(item[$orig].direction=='transverse'?'40rpx 0;':'0')}"></image>
				</view>
			</scroll-view>
			<scroll-view class="fixed-content" scroll-x v-if="photoList.length == 4">
				<view class="fixed-item" v-for="(item,index) in temList[3]" :key="index" @click="selTemp(index)">
			
					<image :data-id="item.id" :class="item.id==temInfo.id?'shadow-inset':''" mode="aspectFit"
						style="width: 100%;height:100%;" :src="item.src"
						:style="{margin:(item[$orig].direction=='transverse'?'40rpx 0;':'0')}"></image>
				</view>
			</scroll-view>
		</view>

		<view class="fixed-resume-list"
			style="display: flex;align-items: center; justify-content: space-around;padding-bottom: ;">
			<view class="btn1" @click="viewDrawToCanvas">继续上传</view>
			<view class="btn1" @click="getElRect1">
				生成
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getPrinterOrderInfoA4,
		getPrinterOrderInfo6
	} from '@/api/index.js'
	import eposter from '@/pageA/components/Poster.vue'
	export default {
		components: {
			eposter
		},

		data() {
			return {
				startX: 0,
				startY: 0,
				moveIndex: 0,
				ep_width: 0,
				ep_height: 0,
				ep_x: 0,
				ep_y: 0,
				// bottomHeight: this.getMobileInfo(),
				photoList: [],
				temInfo: {
					direction: "",
					id: 0,
					imgObj: [],
					src: ""
				},

				temList: [
					[{
						id: 11,
						src: "../static/pb-1-2.png",
						direction: "transverse",
						imgObj: [{
							x: 0,
							y: 0,
							width: 627,
							height: 402,
							margin: "30rpx auto"
						}]
					}, {
						id: 12,
						src: "../static/pb-1-1.png",
						direction: "vertical",
						imgObj: [{
							x: 0,
							y: 0,
							width: 627,
							height: 924,
							margin: "30rpx auto"
						}]
					}, {
						id: 13,
						src: "../static/pb-1-3.png",
						direction: "vertical",
						imgObj: [{
							x: 0,
							y: 0,
							width: 273,
							height: 422,
							margin: "270rpx auto"
						}]
					}, {
						id: 14,
						src: "../static/pb-1-4.png",
						direction: "vertical",
						imgObj: [{
							x: 0,
							y: 0,
							width: 415,
							height: 627,
							margin: "180rpx auto"
						}]
					}],
					[{
						id: 21,
						src: "../static/pb-2-1.png",
						direction: "transverse",
						imgObj: [{
							x: 0,
							y: 0,
							width: 300,
							height: 389,
							margin: "30rpx 15rpx 30rpx 30rpx;display:inline-block;"
						}, {
							x: 0,
							y: 0,
							width: 300,
							height: 389,
							margin: "30rpx 30rpx 30rpx 15rpx;display:inline-block;"
						}]
					}, {
						id: 22,
						src: "../static/pb-2-2.png",
						direction: "vertical",
						imgObj: [{
							x: 0,
							y: 0,
							width: 627,
							height: 429,
							margin: "30rpx auto"
						}, {
							x: 0,
							y: 0,
							width: 627,
							height: 429,
							margin: "30rpx auto"
						}]
					}, {
						id: 23,
						src: "../static/pb-2-3.png",
						direction: "vertical",
						imgObj: [{
							x: 0,
							y: 0,
							width: 429,
							height: 303,
							margin: "113rpx auto"
						}, {
							x: 0,
							y: 0,
							width: 429,
							height: 303,
							margin: "113rpx auto"
						}]
					}, {
						id: 24,
						src: "../static/pb-2-4.png",
						direction: "transverse",
						imgObj: [{
							x: 0,
							y: 0,
							width: 226,
							height: 281,
							margin: "89rpx 39rpx 89rpx 79rpx;display:inline-block;"
						}, {
							x: 0,
							y: 0,
							width: 226,
							height: 281,
							margin: "89rpx 79rpx 89rpx 39rpx;display:inline-block;"
						}]
					}],
					[{
						id: 31,
						src: "../static/pb-3-1.png",
						direction: "transverse",
						imgObj: [{
							x: 0,
							y: 0,
							width: 191,
							height: 405,
							margin: "30rpx 15rpx 30rpx 30rpx;display:inline-block;"
						}, {
							x: 0,
							y: 0,
							width: 191,
							height: 405,
							margin: "30rpx 15rpx;display:inline-block;"
						}, {
							x: 0,
							y: 0,
							width: 191,
							height: 405,
							margin: "30rpx 30rpx 30rpx 15rpx;display:inline-block;"
						}]
					}, {
						id: 32,
						src: "../static/pb-3-2.png",
						direction: "vertical",
						imgObj: [{
							x: 0,
							y: 0,
							width: 627,
							height: 270,
							margin: "30rpx auto"
						}, {
							x: 0,
							y: 0,
							width: 627,
							height: 270,
							margin: "30rpx auto"
						}, {
							x: 0,
							y: 0,
							width: 627,
							height: 270,
							margin: "30rpx auto"
						}]
					}, {
						id: 33,
						src: "../static/pb-3-3.png",
						direction: "vertical",
						imgObj: [{
							x: 0,
							y: 0,
							width: 627,
							height: 429,
							margin: "30rpx 30rpx 15rpx 30rpx;display:inline-block;"
						}, {
							x: 0,
							y: 0,
							width: 303,
							height: 429,
							margin: "15rpx 12.5rpx 30rpx 30rpx;display:inline-block;"
						}, {
							x: 0,
							y: 0,
							width: 303,
							height: 429,
							margin: "15rpx 30rpx 30rpx 13.5rpx;display:inline-block;"
						}]
					}, {
						id: 34,
						src: "../static/pb-3-4.png",
						direction: "transverse",
						imgObj: [{
							x: 0,
							y: 0,
							width: 313,
							height: 405,
							margin: "0;display:inline-block;position:relative;top:32rpx;left:20rpx;"
						}, {
							x: 0,
							y: 0,
							width: 313,
							height: 188,
							margin: "0;display:inline-block;position:relative;top:-182rpx;right:-40rpx;"
						}, {
							x: 0,
							y: 0,
							width: 313,
							height: 188,
							margin: "0;display:inline-block;position:relative;top:-164rpx;right:-354rpx;"
						}]
					}],
					[{
						id: 41,
						src: "../static/pb-4-1.png",
						direction: "vertical",
						imgObj: [{
							x: 0,
							y: 0,
							width: 303,
							height: 429,
							margin: "30rpx 15rpx 15rpx 30rpx;display:inline-block;"
						}, {
							x: 0,
							y: 0,
							width: 303,
							height: 429,
							margin: "30rpx 15rpx 15rpx 15rpx;display:inline-block;"
						}, {
							x: 0,
							y: 0,
							width: 303,
							height: 429,
							margin: "15rpx 15rpx 30rpx 30rpx;display:inline-block;"
						}, {
							x: 0,
							y: 0,
							width: 303,
							height: 429,
							margin: "15rpx 15rpx 30rpx 15rpx;display:inline-block;"
						}]
					}, {
						id: 42,
						src: "../static/pb-4-2.png",
						direction: "vertical",
						imgObj: [{
							x: 0,
							y: 0,
							width: 336,
							height: 429,
							margin: "30rpx 15rpx 15rpx 30rpx;display:inline-block;"
						}, {
							x: 0,
							y: 0,
							width: 270,
							height: 429,
							margin: "30rpx 15rpx 15rpx 15rpx;display:inline-block;"
						}, {
							x: 0,
							y: 0,
							width: 270,
							height: 429,
							margin: "15rpx 15rpx 30rpx 30rpx;display:inline-block;"
						}, {
							x: 0,
							y: 0,
							width: 336,
							height: 429,
							margin: "15rpx 15rpx 30rpx 15rpx;display:inline-block;"
						}]
					}, {
						id: 43,
						src: "../static/pb-4-3.png",
						direction: "transverse",
						imgObj: [{
							x: 0,
							y: 0,
							width: 303,
							height: 190,
							margin: "30rpx 15rpx 7.5rpx 30rpx;display:inline-block;"
						}, {
							x: 0,
							y: 0,
							width: 303,
							height: 190,
							margin: "30rpx 15rpx 7.5rpx 15rpx;display:inline-block;"
						}, {
							x: 0,
							y: 0,
							width: 303,
							height: 190,
							margin: "7.5rpx 15rpx 30rpx 30rpx;display:inline-block;"
						}, {
							x: 0,
							y: 0,
							width: 303,
							height: 190,
							margin: "7.5rpx 15rpx 30rpx 15rpx;display:inline-block;"
						}]
					}, {
						id: 44,
						src: "../static/pb-4-4.png",
						direction: "transverse",
						imgObj: [{
							x: 0,
							y: 0,
							width: 303,
							height: 172,
							margin: "0;display:inline-block;position:relative;top:-27.5rpx;left:27.5rpx;"
						}, {
							x: 0,
							y: 0,
							width: 303,
							height: 222,
							margin: "0;display:inline-block;position:relative;top:27.5rpx;left:52.5rpx;"
						}, {
							x: 0,
							y: 0,
							width: 303,
							height: 222,
							margin: "0;display:inline-block;position:relative;top:-16rpx;left:27.5rpx;"
						}, {
							x: 0,
							y: 0,
							width: 303,
							height: 172,
							margin: "0;display:inline-block;position:relative;top:-16rpx;left:52.5rpx;"
						}]
					}]
				],


				imgArr1: [],
				imgArr: [],
				localList: [],
				status: false,
				dataList: [],
				type: 4,
				saveSize: [],
				RollWidth: 325,
				RollHeight: 425,
				imageUrl: '/static/tx.png',
				current: 0,
				layers: [],
				beginX: 0,
				beginY: 0,
				movedX: 0,
				movedY: 0
			}
		},
		onReady() {
			// 如果需要兼容微信小程序的话，需要用此写法
			console.log(this.$refs);

		},
		onLoad(e) {
			if (e.type) {
				this.type = e.type
			}
			var this1 = this
			if (uni.getStorageSync('files')) {
				let info = uni.getStorageSync('info')
				this.dataList = uni.getStorageSync('files')
				console.log(this.dataList);

				uni.showLoading({
					title: '上传处理中',
					mask: true
				})




				this.dataList.forEach(item => {
					
					var a = {
						uuid: this1.uuid(),
						name: 'image',
						url: item,
						imgObj: {
							img_width: 0,
							img_height: 0
						},
						imageInfo: {},
						stv: {
							offsetX: 0,
							offsetY: 0,
							zoom: !1,
							distance: 0,
							scale: 1,
							rotate: 0,
							canMove: !1
						}
					};
					this.photoList.push(a)

					

					let Arr = []
					if (uni.getStorageSync('imageList')) {
						if (uni.getStorageSync('imageList') != '') {
							Arr = uni.getStorageSync('imageList')
							console.log(Arr, "进入这里");
						}

					}
					uni.removeStorageSync('imageList', Arr)
					uni.hideLoading()
					uni.showToast({
						title: '上传成功',
						icon: 'none'
					})
					uni.removeStorageSync('files')
				})
				
				let isExcels = false
				this.localList.push({
					filename: 'image',
					dmPaperSize: 9,
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
					chooseStr: '长边',
					PageCount: 1,
					isExcel: isExcels,
					chooseExcel: '默认',
					officeExcelFitToPages: "00",
					changeP: false
				})
				if (this.photoList.length == 1) {
					this.selTemp(1)
				} else {
					this.selTemp(0)
				}


			}

		},
		methods: {


			delPhoto: function(i) {
				var e = this,
					n = e.getPhotoListIndex(i);
				uni.showModal({
					title: "是否确认删除图片",
					success: function(res) {
						if (res.confirm) {
							// 删除指定索引处的照片
							if (e.photoList.splice(i, 1), 0 == e.photoList.length) {
								// 如果照片列表为空，返回上一页
								uni.navigateBack({
									
								})
								// e.temInfo = {
								// 	direction: "",
								// 	id: 0,
								// 	imgObj: [],
								// 	src: ""
								// }
								return
							}

							// 更新模板信息
							var o = e.photoList.length;
							e.temInfo = 1 == o ? e.temList[o - 1][1] : e.temList[o - 1][0];

							// 更新每个照片的剪切对象及状态
							e.photoList.forEach(function(photo, index) {
								photo.cutObj = e.temInfo.imgObj[index];
								photo.stv = {
									offsetX: 0,
									offsetY: 0,
									zoom: false,
									distance: 0,
									scale: 1,
									rotate: 0,
									canMove: false
								};
							});

							// 调用相关函数进行更新
							e.photoInfoChange(e.photoList);
							e.getBoxXy();
							e.getDomXY();
						}
					}
				});
			},


			del(e) {
				console.log(e);
				this.imgArr.splice(e.detail, 1)
			},
			getPDFByHTML(html) {

				return request({
						url: 'https://hitmers-api.solotime.xyz/url2pdf/api/render',
						method: 'POST',
						header: {
							'Content-Type': 'application/json'
						},
						responseType: 'arraybuffer',
						data: {
							html
						}
					}).catch(errorHandler)
					.then(statusCodeChecker);
			},
			makeImpositionHtml(params) {
				// 定义 HTML 内容
				let htmlContent = `
			        <meta http-equiv="content-type" content="text/html;charset=utf-8">
			        <style>
			            body {
			                margin: 0;
			                padding: 0;
			            }
			            img {
			                width: 100%;
			                height: auto;
			            }
			            .A4 {
			                width: 263mm;
			                height: 372mm;
			            }
			            .A4-heng {
			                width: 372mm;
			                height: 260mm;
			            }
			        </style>
			        <div class="${params.direction === 'vertical' ? 'A4' : 'A4-heng'}">
			            <img src="${params.url}" width="100%" height="100%">
			        </div>
			    `;

				return htmlContent;
			},
			save(path) {




				var that = this

				uni.showLoading({
					title: '上传中',
					mask: true
				})
				if (this.photoList != '') {
					uni.uploadFile({
						url: 'https://tm.ydlweb.com/Mini/ApiConnect/upload',
						filePath: this.imageUrl,
						name: 'file',
						header: {

						},
						formData: {
							"user_id": uni.getStorageSync('user_id'),
							"file_name": 'image'
						},
						success(res2) {
							uni.hideLoading()
							if (JSON.parse(res2.data).status == 1) {
								let result = JSON.parse(res2.data).result

								that.localList[0].jobFile = result.path
								that.getPrinterOrder()
							} else {
								uni.showToast({
									title: JSON.parse(res2.data).msg,
									icon: "none",
									duration: 2000
								});
							}
						}
					});
				} else {
					uni.showToast({
						title: '请先上传文件',
						icon: 'none'
					})
				}

			},
			touchstartCallback: function(t) {
				var i = t.currentTarget.id;
				this.moveIndex = this.getPhotoListIndex(i);
				var e = this.moveIndex;
				if (this.photoList[e].stv.canMove || (this.photoList[e].stv.canMove = !0), 1 === t.touches.length) {
					var n = t.touches[0],
						o = n.clientX,
						r = n.clientY;
					this.startX = o, this.startY = r, this.touchStartEvent = t.touches;
				} else {
					var s = t.touches[1].clientX - t.touches[0].clientX,
						h = t.touches[1].clientY - t.touches[0].clientY,
						c = Math.sqrt(s * s + h * h);
					a.x1 = 2 * t.touches[0].pageX, a.y1 = 2 * t.touches[0].pageY, a.x2 = 2 * t.touches[1].pageX,
						a.y2 = 2 * t.touches[1].pageY, this.photoList[e].stv.distance = c, this.photoList[e].stv
						.zoom = !0;
				}
			},
			touchmoveCallback: function(t) {
				var i = this,
					e = i.moveIndex;
				if (i.photoList[e].stv.canMove)
					if (1 === t.touches.length) {
						if (!i.photoList[e].stv.zoom) {
							var n = t.touches[0],
								o = n.clientX,
								r = n.clientY,
								a = o - i.startX,
								s = r - i.startY;
							i.startX = o, i.startY = r;
							var h = i.photoList[e].stv;
							h.offsetX += a, h.offsetY += s, h.offsetX = Math.floor(h.offsetX), h.offsetY = Math.floor(h
									.offsetY),
								h.offsetLeftX = -h.offsetX, h.offsetLeftY = -h.offsetY, h.picleftX = h.offsetX,
								h.picleftY = h.offsetY, i.photoList[e].stv.canMove && (i.photoList[e].stv = h);
						}
					} else if (2 === t.touches.length) return;
			},
			touchendCallback: function(t) {
				var i = this.moveIndex;
				0 === t.touches.length && (this.photoList[i].stv.zoom = !1, this.photoList[i].stv.canMove = !1);
			},
			getPhotoListIndex: function(t) {
				var i = 0;
				return this.photoList.forEach(function(e, n) {
					e.uuid == t && (i = n);
				}), i;
			},
			getPrinterOrder() {
				if (this.photoList != '') {
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
						if (this.type == 4) {
							item.dmPaperSize = 9
						} else {
							item.dmPaperSize = 285
						}
					})
					data.printList = listArr
					// if(this.localList)
					data.print_type = uni.getStorageSync('print_type')
					uni.showLoading({
						title: '提交订单中...',
						mask: true
					})
					if (this.type == 4) {
						
						getPrinterOrderInfoA4(data, (res) => {
							uni.hideLoading()
							if (res.status == 1) {
								uni.navigateTo({
									url: '/pageA/newPage/order?price=' + res.result.total_price +
										'&pay_id=' + res.result.pay_id + '&type=4'
								})
							} else {
								uni.showToast({
									title: res.msg,
									icon: 'none'
								})
							}
						})
					} else {

						getPrinterOrderInfo6(data, (res) => {

							uni.hideLoading()
							if (res.status == 1) {
								uni.navigateTo({
									url: '/pageA/newPage/order?price=' + res.result.total_price +
										'&pay_id=' + res.result.pay_id + '&type=4'
								})
							} else {
								uni.showToast({
									title: res.msg,
									icon: 'none'
								})
							}
						})

					}


				} else {
					uni.showToast({
						title: '请先上传文件',
						icon: 'none'
					})
				}

			},


			selTemp: function(t) {
				var i = this;
				let e = this.temList[this.photoList.length - 1][t];
				console.log(e, i.temInfo);
				if (i.temInfo.id != e.id) {
					i.temInfo = e;
					i.photoList.forEach(function(item, index) {
						item.cutObj = i.temInfo.imgObj[index];
					});
					i.photoInfoChange(i.photoList);
					i.getBoxXy();
					i.getDomXY();

				}
			},
			getBoxXy: function() {
				var i = this,
					e = this,
					n = "photo-box-h";
				"vertical" == e.temInfo.direction && (n = "photo-box"), this.$nextTick(function() {
					uni.createSelectorQuery().in(i).selectAll("." + n).fields({
						dataset: !0,
						size: !0,
						rect: !0,
						value: !0,
						scrollOffset: !0,
						context: !0
					}, function(o) {
						uni.getSystemInfoSync().windowWidth, i.width, o.forEach(function(t, i) {
							e.ep_x = t.left, e.ep_y = t.top, e.ep_width = t.width, e
								.ep_height = t.height, "photo-box-h" == n && (e.ep_y = t.top -
									15,
									e.ep_height = t.height + 100);
						});
					}).exec();
				});
			},
			onSuccess: function(i) {
				console.log("success", i);
				var e = this;
				var n = i.url;
				uni.showLoading({
					title: "上传中"
				});



				var r = Date.now() + "" + parseInt(1e3 * Math.random()) + ".jpg";
				// var a = o.data.dir + r;
				// var s = o.data.host + "/" + a;

				uni.uploadFile({
					url: 'https://tm.ydlweb.com/Mini/ApiConnect/upload',
					filePath: n,
					name: "file",
					formData: {
						"user_id": uni.getStorageSync('user_id'),
						"file_name": 'image'
					},
					success: function(t) {
						// i.url = y
						uni.hideLoading();
						let result = JSON.parse(t.data).result

						e.localList[0].jobFile = result.path
						e.getPrinterOrder()
						// e.makeImpositionHtml(i)
						// console.log(e.makeImpositionHtml(i));

					},
					fail: function(i) {
						uni.showToast({
							title: i.errMsg,
							icon: "none",
							duration: 2000
						});
					}
				});


			},

			setPhotoImgAll: function(t) {
				var i = this;
				var e = 0,
					n = 0,
					o = 0,
					r = 0;
				var a = i.photoList[t];

				if (a.imageInfo.width > a.imageInfo.height) {
					if (a.cutObj.width > a.cutObj.height) {
						o = parseInt(a.imageInfo.width / a.imageInfo.height * a.cutObj.height);
						r = a.cutObj.height;
						if (o > a.cutObj.width) {
							o = a.cutObj.width;
							r = parseInt(a.imageInfo.height / a.imageInfo.width * a.cutObj.width);
							n = (a.cutObj.height - r) / 2;
						} else {
							e = (a.cutObj.width - o) / 2;
						}
					} else {
						o = a.cutObj.width;
						r = parseInt(a.imageInfo.height / a.imageInfo.width * a.cutObj.width);
						n = (a.cutObj.height - r) / 2;
					}
				} else {
					if (a.cutObj.width > a.cutObj.height) {
						o = parseInt(a.imageInfo.width / a.imageInfo.height * a.cutObj.height);
						r = a.cutObj.height;
						e = (a.cutObj.width - o) / 2;
					} else {
						r = a.cutObj.height;
						o = parseInt(a.imageInfo.width / a.imageInfo.height * a.cutObj.height);
						e = (a.cutObj.width - o) / 2;
						if (o > a.cutObj.width) {
							o = a.cutObj.width;
							r = parseInt(a.imageInfo.height / a.imageInfo.width * a.cutObj.width);
							e = 0;
							n = (a.cutObj.height - r) / 2;
						}
					}
				}

				i.photoList[t].imgObj.img_width = o;
				i.photoList[t].imgObj.img_height = r;
				i.photoList[t].stv.offsetX = e;
				i.photoList[t].stv.offsetY = n;
			},
			getDomXY: function() {
				var i = this,
					e = this;
				uni.showLoading(), this.$nextTick(function() {
					uni.createSelectorQuery().in(i).selectAll(".poster-img").fields({
						dataset: !0,
						size: !0,
						rect: !0,
						value: !0,
						scrollOffset: !0,
						context: !0
					}, function(n) {
						uni.hideLoading(), uni.getSystemInfoSync().windowWidth, i.width, n.forEach(
							function(t, i) {
								console.log("获取元素节点val", JSON.stringify(t)), e.temInfo.imgObj[i]
									.x = t.left, e.temInfo.imgObj[i].y = t.top,
									e.temInfo.imgObj[i].draw_width = t.width, e.temInfo.imgObj[i]
									.draw_height = t.height;
							});
					}).exec();
				});
			},
			getImageInfo: function(i) {
				return new Promise(function(resolve, reject) {
					uni.getImageInfo({
						src: i,
						success: function(res) {
							resolve(res);
						},
						fail: function(err) {
							uni.showToast({
								title: "图片信息加载失败，可能是不支持的格式",
								icon: "none",
								duration: 2000
							});
							reject(err);
						}
					});
				});
			},
			photoInfoChange: function(t) {
				const self = this;

				function getImageInfoRecursive(index) {
					if (index >= self.photoList.length) {
						return;
					}

					const photo = self.photoList[index];
					self.getImageInfo(photo.url)
						.then((imageInfo) => {
							photo.url = imageInfo.path;
							photo.imageInfo = imageInfo;
							self.setPhotoImgAll(index);
							if (index < self.photoList.length - 1) {
								getImageInfoRecursive(index + 1);
							}
						});
				}

				getImageInfoRecursive(0);
			},


			//绘制到canvas
			viewDrawToCanvas: function() {
				if (this.photoList.length == 4) {
					uni.showToast({
						title: '当前最多上传4张',
						icon: 'none',
						duration: 2000
					})
					return
				}

				const this1 = this
				let MaxCount
				if (this.photoList.length == 0) {
					MaxCount = 4
				}
				if (this.photoList.length == 1) {
					MaxCount = 3
				}
				if (this.photoList.length == 2) {
					MaxCount = 2
				}
				if (this.photoList.length == 3) {
					MaxCount = 1
				}
				wx.chooseImage({
					count: MaxCount,
					sizeType: ["original", "compressed"],
					sourceType: ["album"],
					success(res) {
						console.log(res);
						const tempFilePaths = res.tempFilePaths
						tempFilePaths.forEach(item=>{
							var a = {
								uuid: this1.uuid(),
								name: 'image',
								url: item,
								imgObj: {
									img_width: 0,
									img_height: 0
								},
								imageInfo: {},
								stv: {
									offsetX: 0,
									offsetY: 0,
									zoom: !1,
									distance: 0,
									scale: 1,
									rotate: 0,
									canMove: !1
								}
							};
							this1.photoList.push(a)
							
						})
						
						if (this1.photoList.length == 1) {
							this1.selTemp(1)
						} else {
							this1.selTemp(0)
						}
						
					}
				})

			},
			getElRect1: function(i) {
				var e = this;
				uni.showLoading({
					title: "合成中",
					mask: !0
				}), setTimeout(function() {


					e.$refs.Eposter.createForElRect(i, !1)
					// e.Eposter.$vm.createForElRect(i, !1);
				}, 800);
			},
			//获取临时路径
			getTempFilePath: function() {
				var ctx = uni.createCanvasContext('myCanvas');
				// 当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
				uni.canvasToTempFilePath({
					canvasId: 'myCanvas',
					success: (res) => {
						console.log(res.tempFilePath)
						this.imageUrl = res.tempFilePath
						uni.previewImage({
							urls: [this.imageUrl]
						})
						// this.save()
						// this.saveImageToPhotosAlbum(res.tempFilePath) //保存到相册
					},
					fail: (fail) => {
						console.log(fail);
					}
				})
			},
			//把生成的图片保存至相册
			saveImageToPhotosAlbum: function(imgUrl) {
				uni.hideLoading();
				if (imgUrl) {
					uni.saveImageToPhotosAlbum({
						filePath: imgUrl,
						success: (res) => {
							uni.showToast({
								title: '保存成功',
								icon: 'success',
								duration: 2000
							})
						},
						fail: (err) => {
							uni.showToast({
								title: '保存失败',
								icon: 'none',
								duration: 2000
							})
						}
					})
				} else {
					uni.showToast({
						title: '绘制中……',
						icon: 'loading',
						duration: 3000
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
	.poster {
		width: 100%;
	}

	.poster .poster-sc {
		height: 100%;
		margin-top: 30rpx;
		overflow: hidden;
		width: 100%;
	}

	.poster .poster-sc .poster-img {
		background: #f1f1f1;
		border-radius: 32rrpx;
		margin: 30rpx auto;
		overflow: hidden;
		position: relative;
	}

	.poster .poster-sc .poster-img .fixed-close {
		height: 40rpx;
		position: absolute;
		right: 0;
		top: 0;
		width: 40rpx;
		z-index: 11;
	}

	.poster .poster-sc .poster-img .fixed-close image {
		height: 100%;
		width: 100%;
	}

	.photo-box,
	.photo-box-h {
		background: #fff;
		height: 989;
		margin: 30rpx auto;
		width: 690rpx;
	}

	.photo-box-h {
		height: 463rpx;
		margin: 180rpx auto;
	}

	.fixed-resume-list {
		background: #fff;
		bottom: 30rpx;
		padding: 20rpx 30rpx;
		position: fixed;
		// transition-duration: .5s;
		width: 690rpx;
		z-index: 4;
	}

	.fixed-resume-list .fixed-content {
		white-space: nowrap;
	}

	.fixed-resume-list .fixed-content .fixed-item {
		background: #fff;
		display: inline-block;
		height: 170rpx;
		margin: 0 20rpx;
		overflow: hidden;
		padding: 5rpx;
		width: 120rpx;
	}

	.shadow-inset {
		border: 2rpx solid #00a8f5;
		height: 170rpx;
		width: 120rpx;
	}



	.myBg {
		border: 20rpx solid #fff;

		width: 650rpx;
		height: 850rpx;
		margin: 0 auto;
		margin-top: 60rpx;

	}

	#canvas {
		width: 620rpx;
		height: 620rpx;
	}

	.drawBtn {
		width: 650upx;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
		color: #FFFFFF;
		background-image: linear-gradient(45deg, #ec008c, #6739b6);
		border-radius: 20upx;
		margin: 200upx 50upx;
	}

	/* 绘制图片canvas样式 */
	.canvas-poster {
		position: fixed;
		// width: 794px;
		// height: 1123px;
		// top: 100%;
		// left: 100%;
	}

	.btn1 {
		width: 320rpx;
		height: 88.06rpx;
		border-radius: 44.03rpx;
		background: linear-gradient(0.11deg, #185fab 0%, #38b8ef 100%);
		line-height: 88.06rpx;
		text-align: center;
		margin: 0 auto;
		margin-top: 30rpx;
		font-family: "PingFang SC Heavy";
		font-weight: 900;
		font-size: 30rpx;
		color: #fff;

	}


	.image-container {
		position: relative;
		width: 100%;
		height: 400px;
		/* 设置图片容器的高度 */
		overflow: hidden;
	}

	.movable-area {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	movable-view {
		position: absolute;
	}
</style>