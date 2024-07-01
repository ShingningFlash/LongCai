<template>
	<view>
		<!-- 顶部进度条部分 -->
		<view class="logisticsMessage">
			<view class="logisticsBox">
				<view :class="status == 1 ? 'isShow' : 'logisticsView' ">
					<view class="logisticsTime">提交申请</view>
				</view>
				<view :class="status == 1 ?'isShow':'logisticsView'">
					<view class="logisticsTime">平台审核</view>
				</view>
				<view :class="status == 3 ?'isShow':'logisticsView'">
					<view class="logisticsTime">审核结果</view>
				</view>
			</view>
		</view>
		<!-- 客户信息部分 -->
		<view class="message-box">
			<view class="message-title">
				<text>商户信息</text>
			</view>
			<view class="message-warp">
				<view class="listBox">
					<view class="hint">
						<div class="left">店铺名称</div>
					</view>
					<view class="inputBox">
						<input type="text" placeholder="请输入店铺名称" v-model.trim="store_name">
					</view>
				</view>

				<!-- <view class="listBox">
					<view class="hint">
						<div class="left">定位信息</div>
					</view>
					<view class="inputBox">
						<input type="text" v-if="location != '' " :disabled="true" placeholder="请输入定位信息"
							v-model.trim="location">
						<view class="postionbox" @click="selectPositionFun">
							<image src="../../static/icons/positionicon.png" mode=""></image>
						</view>
					</view>
				</view> -->

				<view class="listBox">
					<view class="hint">
						<div class="left">店铺详细地址</div>
					</view>
					<view class="inputBox">
						<input type="text" placeholder="请输入店铺详细地址" v-model.trim="address">
					</view>
				</view>

				<view class="listBox">
					<view class="hint">
						<div class="left">统一社会信用代码</div>
					</view>
					<view class="inputBox">
						<input type="text" placeholder="请输入统一社会信用代码" v-model.trim="credit_code">
					</view>
				</view>

				<view class="listBox">
					<view class="hint">
						<div class="left">上传营业执照</div>
					</view>
					<view class="inputBoxpic">

						<view class="imgboxpic" v-if="license_list.length == 0" @click="uploadimg">
							<image src="https://tm.ydlweb.com/icons/addpicicon.png" mode=""></image>
						</view>

						<view class="imgboxpic" v-else v-for="(item,index) in license_list" :key="index">
							<image :src="item" mode=""></image>
							<view class="close" @click='close(index)'>
								<image src="https://tm.ydlweb.com/icons/del.png" mode=""></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部联系信息部分 -->
		<view class="message-box box2">
			<view class="message-title">
				<text>联系信息</text>
			</view>
			<view class="message-warp">
				<view class="listBox">
					<view class="hint">
						<div class="left">联系人</div>
					</view>
					<view class="inputBox">
						<input type="text" placeholder="请输入联系人姓名" v-model.trim="user_name">
					</view>
				</view>
				<view class="listBox">
					<view class="hint">
						<div class="left">联系电话</div>
					</view>
					<view class="inputBox">
						<input type="text" placeholder="请输入联系电话" v-model.trim="user_mobile">
					</view>
				</view>
			</view>
		</view>
		<!-- 底部按钮部分 -->
		<view class="bottomBtnbox">
			<view class="bottomBtnWarp" @click="Cooperation">
				<text>提交申请</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		Cooperation // 合作申请 接口
	} from '@/api/index.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				status: 1, //进度状态
				type_id: null, // 传过来的加入类型
				store_name: '', // 店铺名称
				location: '', // 地图选中的定位信息
				address: '', // 详细地址
				credit_code: '', // 社会信用统一代码
				license_list: [], //营业执照图片
				user_name: '', // 联系人姓名
				user_mobile: '', // 联系人电话
			}
		},
		onLoad(option) {
			that = this
			this.type_id = option.type_id
		},
		methods: {
			// 获取定位
			// selectPositionFun() {
			// 	uni.getLocation({
			// 		type: 'gcj02', //返回可以用于uni.openLocation的经纬度
			// 		success: function(res) {
			// 			const latitude1 = res.latitude;
			// 			const longitude1 = res.longitude;
			// 			uni.chooseLocation({
			// 				latitude: latitude1,
			// 				longitude: longitude1,
			// 				success: function(res2) {
			// 					that.location = res2.address + res2.name
			// 				}
			// 			})
			// 		}
			// 	});
			// },
			// 合作申请接口
			Cooperation() {
				if(this.user_name == ''){
					return uni.showToast({
						title:'请填写联系人姓名',
						icon:'none'
					})
				}
				if(this.user_mobile == ''){
					return uni.showToast({
						title:'请填写联系人电话',
						icon:'none'
					})
				}
				let data = {
					league_type: this.type_id,
					store_name: this.store_name,
					location: this.location,
					address: this.address,
					credit_sn: this.credit_code,
					license: this.license_list[0],
					real_name: this.user_name,
					mobile: this.user_mobile,
				}
				// console.log('合作申请提交的参数', data)
				Cooperation(data, (res) => {
					console.log('合作申请返回的数据res', res)
					if(res.status == 1){
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}else{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}
				})
			},
			// 选择上传的图片
			uploadimg() {
				let that = this
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						that.uploading(res.tempFilePaths)
					}
				});
			},
			// 上传图片
			uploading(tempFilePaths) {
				let that = this
				uni.uploadFile({
					url: 'https://xcx.gdqhwy.com/Mini/ApiConnect/uploadRefundpic',
					filePath: tempFilePaths[0],
					name: 'refund_pic',
					header: {
						"Content-Type": "multipart/form-data"
					},
					formData: {
						user_id: uni.getStorageSync('user_id'),
					},
					success(res) {
						that.license_list = []
						that.license_list.push(JSON.parse(res.data).result)
					},
					fail(err) {
						uni.showToast({
							title: '上传文件出错',
							icon: 'none'
						})
					}
				});
			},
			// 删除图片
			close(e) {
				this.license_list.splice(e, 1)
			},
		}
	}
</script>

<style lang="scss">
	// 底部按钮部分
	.bottomBtnbox {
		position: fixed;
		width: 100%;
		bottom: 30rpx;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 99;

		.bottomBtnWarp {
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #667D8B;
			border-radius: 10rpx;
			margin: 0 30rpx;
			font-size: 36rpx;
			font-weight: 400;
			color: #fff;
			width: 100%;
			height: 90rpx;
		}
	}


	// 商户信息部分
	.box2 {
		margin-top: 30rpx;
		margin-bottom: 130rpx;
	}

	.message-box {
		background-color: #fff;
		padding: 30rpx;

		.message-title {
			font-size: 36rpx;
			font-weight: 700;
			color: #111;
		}

		.message-warp {
			.listBox {
				border-bottom: 1px solid #ccc;
				padding: 30rpx 0;
				display: flex;
				align-items: center;

				.hint {
					flex: 3;
					display: flex;
					align-items: center;

					.left {
						font-size: 32rpx;
						font-weight: 400;
						color: #777;
					}
				}

				.inputBox {
					flex: 5;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					text-align: right;
					font-size: 32rpx;
					font-weight: 500;
					color: #111;

					.postionbox {
						padding: 0 10rpx;
						width: 38rpx;
						height: 46rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}

				.inputBoxpic {
					flex: 5;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					text-align: right;

					.imgboxpic {
						position: relative;
						width: 120rpx;
						height: 120rpx;
						text-align: right;

						image {
							width: 100%;
							height: 100%;
							vertical-align: text-top;
						}

						.close {
							position: absolute;
							right: -15rpx;
							top: -15rpx;
							width: 30rpx;
							height: 30rpx;

							image {
								width: 100%;
								height: 100%;
							}
						}
					}
				}

			}
		}
	}

	// 顶部进度条部分
	.logisticsMessage .logisticsBox .logisticsView .logisticsTime {
		color: #a7a7a7;
		font-size: 24rpx;
		width: 100rpx;
		margin-left: -20rpx;
		font-weight: 400;
	}

	.logisticsMessage .logisticsBox .isShow .logisticsTime {
		color: #fff;
		font-size: 24rpx;
		width: 100rpx;
		margin-left: -20rpx;
		font-weight: 400;
	}

	.logisticsMessage .logisticsBox .logisticsView:last-child::before,
	.logisticsMessage .logisticsBox .isShow:last-child::before {
		display: none;
	}

	.logisticsMessage .logisticsBox .isShow::before {
		content: '';
		position: absolute;
		left: 9rpx;
		top: 36rpx;
		width: 150px;
		height: 2px;
		background-color: #fff;
	}

	.logisticsMessage .logisticsBox .logisticsView::before {
		content: '';
		position: absolute;
		left: 9rpx;
		top: 36rpx;
		width: 150px;
		height: 2px;
		background-color: #fff;
	}

	.logisticsMessage .logisticsBox .isShow::after {
		content: '';
		position: absolute;
		left: -10rpx;
		top: 5rpx;
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		background-color: #93b5c8;
		border: 10rpx solid #dedede;
	}

	.logisticsMessage .logisticsBox .logisticsView::after {
		content: '';
		position: absolute;
		left: 0;
		top: 13rpx;
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		background-color: #fff;
	}

	.logisticsMessage .logisticsBox .logisticsView,
	.logisticsMessage .logisticsBox .isShow {
		padding: 0 210rpx 0rpx 0;
		position: relative;
		display: flex;
		padding-top: 80rpx;
	}

	.logisticsMessage .logisticsBox {
		display: flex;
		padding: 20rpx 0 50rpx;
	}

	.logisticsMessage {
		padding: 30rpx 60rpx;
		background-color: #fff;
		background-color: #667D8B;
	}

	page {
		background-color: #f1f1f1;
	}
</style>
