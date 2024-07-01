<template>
	<view>

		<view class="top-box">
			<view class="top-warp">
				<view class="top-text">
					<text>本次付款</text>
				</view>
				<view class="top-price">
					<text>￥</text><text class="price">{{totalPrice}}</text>
				</view>
			</view>
		</view>

		<view class="settlement-box">
			<view class="settlement-warp">
				<view class="settlement-type">
					<radio-group @change="radioChange">
						<label class="settlement-type-label" v-for="(item, index) in itemsType" :key="item.value">
							<view class="text">{{item.name}}</view>
							<view>
								<radio :value="item.value" :checked="index === current" color='#667D8B' />
							</view>
						</label>
					</radio-group>
				</view>
			</view>
		</view>

		<view class="buttom-box">
			<view class="bottom-warp" @click="PrinterOrderFun">
				<text>确认下单</text>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		PrinterPrice, // 打印金额计算 接口
		PrinterOrder, // 打印下单 接口
		PrinterPay, // 打印微信支付 接口
		PrinterBalancePay, // 打印余额支付 接口
		Payment // 调起微信支付
	} from '@/api/order.js'
	let that
	export default {
		data() {
			return {
				itemsType: [{
					value: '1',
					name: '微信支付'
				}, {
					value: '2',
					name: '余额支付'
				}],
				current: 0,
				fileData: [], // 打印的文件数组
				totalPrice: 0, // 打印总金额,


				requestNo: [], // 转换PDF文件流水号
				boxCodes: [], // 云盒SN;没有搜索，默认使用：1002042009102681
				paperCount: [], // 打印 pdf 文档的份数。
				fileSize: [], // 文件大小。单位：字节。上传文件时返回的大小传递过来即可
				printType: [], // 单面、双面打印。1-单面、2- 双面。
				colorType: [], // 颜色模式。颜色模式，1:黑 白，2:彩色
				printQuality: [], // 打印质量, 1:一般,2:最高
				startPage: [], // 打印起始页数
				endPage: [], // 打印结束页数
				paperPages: [], // 文档页数(结束页)
				pages: [], // 需要打印的文档页数
				paperType: [], //  纸张大小。纸张类型。1:A4 ,2:A3，3:5 寸，4:6 寸，5：7 寸。
				PrintMode: [], //  首字母注意大写 打印格式。1:文本，2 图片 3人像
				no_color_total: [], // 黑白
				yes_color_total: [], // 彩色
				portraitFlag: null, // 判断是人像还是文档图片类型的标识

				// colorNumber: 0, // 记录彩色文件的份数
				// blackandwhiteNumber: 0, // 记录黑白文件的份数

			}
		},
		onLoad(option) {
			that = this
			if (option.file_data && option.portraitFlag) {
				this.portraitFlag = option.portraitFlag
				this.fileData = JSON.parse(option.file_data)
				// console.log('结算页的文件数组', this.fileData)
				this.fileData.forEach(item => {
					let number = (item.endPage - item.startPage) + 1 // 打印的页数 

					let i = item.fileArr[0].substring(item.fileArr[0].lastIndexOf('.') + 1)
					let type = 1 // 打印的文件类型
					let paper = 1
					if (this.portraitFlag == 1) {
						type = 3
						paper = 4
					}

					item.pages = number // 打印的页数 
					// item.boxCodes = 1002042009102681 // 云盒SN
					item.printQuality = 2 // 打印质量, 1:一般,2:最高
					item.paperType = paper // 纸张大小。纸张类型。1:A4 纸张,2:A3 纸张，3:5 寸，4:6 寸，5：7 寸。
					item.PrintMode = type // 首字母注意大写 打印格式。1:文档，2 图片 3人像

					let number2 = 0
					let number3 = 0

					// 再循环计算彩色的总份数,黑白的总份数======================
					this.fileData.forEach(item2 => {

						if (item2.colorType == 1) {
							number2 = number2 + (((item2.endPage - item2.startPage) + 1) * item2
								.paperCount) // 黑白打印的页数 
						} else if (item2.colorType == 2) {
							number3 = number3 + (((item2.endPage - item2.startPage) + 1) * item2
								.paperCount) // 彩色打印的页数
						}
					})
					item.no_color_total = number2
					item.yes_color_total = number3

					// =======================================================
					this.PrinterPriceFun(item)
				})
			}
		},
		methods: {
			// 打印金额计算
			PrinterPriceFun(obj) {
				PrinterPrice({
					page: obj.pages, // 打印页数
					type: obj.PrintMode, // 打印文件的类型 1文档  2图片  3人像
					color: obj.colorType, // 打印的彩色还是黑白  1黑白 2彩色
					count: obj.paperCount, // 打印的份数
					no_color_total: obj.no_color_total,
					yes_color_total: obj.yes_color_total
				}, (res) => {
					if (res.status == 1) {
						this.totalPrice = res.data.price + this.totalPrice
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 改变支付方式的单选框
			radioChange: function(evt) {
				for (let i = 0; i < this.itemsType.length; i++) {
					if (this.itemsType[i].value === evt.detail.value) {
						this.current = i;
						break;
					}
				}
			},
			// 打印下单
			PrinterOrderFun() {
				this.fileData.forEach(item => {
					this.requestNo.push(item.requestNo)
					this.boxCodes.push(item.boxCodes)
					this.pages.push(item.pages)
					this.paperCount.push(item.paperCount)
					this.fileSize.push(item.fileSize)
					this.printType.push(item.printType)
					this.colorType.push(item.colorType)
					this.printQuality.push(item.printQuality)
					this.startPage.push(item.startPage)
					this.endPage.push(item.endPage)
					this.paperType.push(item.paperType)
					this.PrintMode.push(item.PrintMode)
					this.paperPages.push(item.file_end_total_num)
					this.no_color_total.push(item.no_color_total)
					this.yes_color_total.push(item.yes_color_total)
				})

				let data = {
					pay_type: this.current + 1,
					requestNo: this.requestNo,
					boxCodes: this.boxCodes,
					paperPages: this.paperPages,
					pages: this.pages,
					paperCount: this.paperCount,
					fileSize: this.fileSize,
					printType: this.printType,
					colorType: this.colorType,
					printQuality: this.printQuality,
					startPage: this.startPage,
					endPage: this.endPage,
					paperType: this.paperType,
					PrintMode: this.PrintMode,
					no_color_total:this.no_color_total,
					yes_color_total:this.yes_color_total
				}
				// console.log('打印下单需要的参数data', data)
				PrinterOrder(data, (res) => {
					if (res.status == 1) {
						if (this.current == 0) {
							this.PrinterPayFun(res.data.requestNo)
						}
						if (this.current == 1) {
							this.PrinterBalancePayFun(res.data.requestNo)
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 微信支付接口
			PrinterPayFun(requestNoid) {
				PrinterPay({
					requestNo: requestNoid,
					openid: uni.getStorageSync('openid')
				}, (res2) => {
					if (res2.status == 1) {
						Payment(res2.payinfo, (res3) => {
							console.log("res3", res3)
							if (res3.errMsg == 'requestPayment:ok') {
								setTimeout((item) => {
									let pages = getCurrentPages(); //获取所有页面栈实例列表
									let nowPage = pages[pages.length - 1]; //当前页页面实例
									let prevPage = pages[pages.length - 2]; //上一页页面实例
									prevPage.$vm.fileData = []; //修改上一页data里面的fileData参数值为空数组
									uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
										delta: 1
									});
								}, 800)
							} else {
								uni.showToast({
									title: res3.errMsg,
									icon: 'none'
								})
							}
						})
					} else {
						uni.showToast({
							title: res2.msg,
							icon: 'none'
						})
					}
				})
			},
			// 余额支付接口
			PrinterBalancePayFun(requestNoid) {
				PrinterBalancePay({
					requestNo: requestNoid
				}, (res4) => {
					if (res4.status == 1) {
						uni.showToast({
							title: res4.msg,
							icon: 'none'
						})
						setTimeout((item) => {
							let pages = getCurrentPages(); //获取所有页面栈实例列表
							let nowPage = pages[pages.length - 1]; //当前页页面实例
							let prevPage = pages[pages.length - 2]; //上一页页面实例
							prevPage.$vm.fileData = []; //修改上一页data里面的fileData参数值为空数组
							uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
								delta: 1
							});
						}, 800)
					} else {
						uni.showToast({
							title: res4.msg,
							icon: 'none'
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.top-box {
		padding: 30rpx;

		.top-warp {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.top-text {
				font-size: 28rpx;
				font-weight: 400;
				color: #868686;
				padding-bottom: 15rpx;
			}

			.top-price {
				font-size: 32rpx;
				font-weight: 700;
				color: #1E1E1E;

				.price {
					font-size: 46rpx;
					font-weight: 700;
					color: #1E1E1E;
				}
			}
		}
	}

	.settlement-box {
		.settlement-warp {
			padding: 0 30rpx;

			.settlement-type {
				background-color: #fff;
				border-radius: 25rpx;

				.settlement-type-label {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 30rpx 20rpx;
					border-bottom: 1rpx solid #e6e6e6;

					.text {
						font-size: 26rpx;
					}
				}

				.settlement-type-label:last-child {
					border-bottom: none;
				}
			}
		}
	}

	.buttom-box {
		position: fixed;
		bottom: 0;
		background-color: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		margin: 20rpx 0;

		.bottom-warp {
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #667D8B;
			width: 690rpx;
			padding: 25rpx 0rpx;
			border-radius: 36rpx;

			text {
				color: #ffffff;
				font-size: 28rpx;
				font-weight: 400;
			}
		}
	}

	page {
		background-color: #F1F1F1;
		height: 100vh;
	}
</style>
