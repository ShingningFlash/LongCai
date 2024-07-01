<template>
	<view class="userData">
		<view class="background">
			<image src="https://tm.ydlweb.com/icons/bg.png"></image>
		</view>
		<view class="dataBox">
			<view class="listBox">
				<view class="hint">
					<div class="left">头像</div>
					<div class="isOne">点击可更换头像</div>
				</view>
				<view class="userImg" @click="selectImgFunction">
					<image :src="head_pic"></image>
					<!-- <image src="../../static/image/head.png"></image> -->
				</view>
			</view>
			<view class="listBox">
				<view class="hint">
					<div class="left">昵称</div>
				</view>
				<view class="inputBox">
					<input type="text" placeholder="请输入昵称" v-model="nickname">
				</view>
			</view>
			<view class="listBox">
				<view class="hint">
					<div class="left">真实姓名</div>
				</view>
				<view class="inputBox">
					<input type="text" placeholder="请输入真实姓名" v-model="real_name">
				</view>
			</view>

			<view class="listBox">
				<view class="hint">
					<div class="left">手机号(不可修改)</div>
				</view>
				<view class="inputBox">
					<input type="text" placeholder="请输入手机号" v-model="mobile" disabled>
				</view>
			</view>
			<view class="listBox">
				<view class="hint">
					<div class="left">联系地址</div>
				</view>
				<view class="inputBox">
					<input type="text" placeholder="请输入联系地址" v-model="address">
				</view>
			</view>
		</view>
		<view class="btn" @click="SaveUserDataFun">确认并保存</view>
	</view>
</template>
<script>
	import {
		GetUserData, // 获取我的页面的个人信息 接口
		SaveUserData // 修改信息 提交 接口
	} from '@/api/user.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				isUserIdPhone: app.globalData.is_userId_phone, // 判断本地缓存是否有 user_id 和 phone 的标识

				myUserInfo: uni.getStorageSync('userInfo'), // 我的页面 的 个人信息
				head_pic: '', // 头像图片
				nickname: '', // 昵称
				real_name: '', // 真实姓名
				mobile: '', // 手机号
				address: '', //地址
			}
		},
		onLoad() {
			that = this
		},
		onShow() {
			app.getLogin(function(is_login_userid) {
				that.isUserIdPhone = is_login_userid
				if (that.isUserIdPhone) {
					that.GetUserDataFun()
				}
			})
		},
		methods: {
			// 获取 我的页面 个人信息 数据
			GetUserDataFun() {
				GetUserData({}, function(res) {
					if (res.status == 1) {
						that.myUserInfo = res.result
						that.head_pic = res.result.head_pic
						that.nickname = res.result.nickname
						that.real_name = res.result.real_name
						that.mobile = res.result.mobile
						that.address = res.result.address
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 修改个人信息之后的提交事件
			SaveUserDataFun() {
				if (that.head_pic != '' && that.nickname != '' && that.real_name != '' && that.mobile != '') {
					let data = {
						head_pic: that.head_pic,
						nickname: that.nickname,
						real_name: that.real_name,
						mobile: that.mobile,
						address: that.address
					}
					SaveUserData(data, function(res) {
						if (res.status == 1) {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
							that.GetUserDataFun2()
							// setTimeout(()=>{
							// 	that.userCenter()
							// },500)
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					})
				} else {
					uni.showToast({
						title: '请将个人信息输入完整',
						icon: 'none'
					})
				}

			},
			GetUserDataFun2() {
				GetUserData({}, function(res1) {
					if (res1.status == 1) {
						uni.setStorageSync('userInfo', res1.result)
					} else {
						uni.showToast({
							title: res1.msg,
							icon: 'none'
						})
					}
				})
			},
			// 点击头像选择图片事件
			selectImgFunction() {
				let that = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						that.uploading(res.tempFilePaths)
					}
				});
			},

			// 上传选中的图片
			uploading(tempFilePaths) {
				uni.uploadFile({
					url: 'https://xcx.gdqhwy.com/Mini/ApiConnect/uploadRefundpic',
					filePath: tempFilePaths[0],
					name: 'refund_pic',
					header: {
						"Content-Type": "multipart/form-data"
					},
					formData: {
						user_id: uni.getStorageSync('user_id')
					},
					success(res) {
						that.head_pic = JSON.parse(res.data).result
					}
				});
			},
			// 路由跳转事件
			clickJupm(e) {
				uni.navigateTo({
					url: e
				})
			},
		}
	}
</script>
<style>
	.userData .btn:active {
		background-color: #7792a2;
	}

	.userData .btn {
		position: fixed;
		bottom: 50rpx;
		padding: 10rpx 0;
		background-color: #667D8B;
		width: 90%;
		margin: 0 auto;
		color: #fff;
		text-align: center;
		padding: 25rpx 0;
		border-radius: 50rpx;
		font-size: 30rpx;
	}

	.listBox .inputBox .imgbox image {
		width: 100%;
		height: 100%;
		vertical-align: text-top;
	}

	.listBox .inputBox .imgbox {
		width: 14rpx;
		height: 23rpx;
		text-align: right;
	}

	.listBox .inputBox {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		text-align: right;
		font-size: 32rpx;
		font-weight: 700;
	}

	.listBox .userImg image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}

	.listBox .userImg {
		flex: 1;
		text-align: right;
	}

	.listBox .hint .isOne {
		font-size: 24rpx;
		font-weight: 400;
		margin-left: 20rpx;
		color: #787878;
	}

	.listBox .hint .left {
		font-size: 28rpx;
		font-weight: 700;
		color: #000000;
	}

	.listBox .hint {
		display: flex;
		align-items: center;
	}

	.listBox {
		padding: 30rpx 0;
		display: flex;
		align-items: center;
		border-top: 1px solid #E3E3E3;
	}

	.dataBox {
		background-color: #fff;
		padding: 0 20rpx;
		border-radius: 10rpx;
		margin-top: 20rpx;
	}

	.background image {
		width: 120%;
		height: 100%;
	}

	.background {
		position: fixed;
		top: -50rpx;
		width: 100%;
		height: 300rpx;
		z-index: -1;
		left: 0;
	}

	.userData {
		padding: 0 30rpx;
	}

	page {
		background-color: #f1f1f1;
	}
</style>
