<template>
	<view class="container">
		<view class="wechatapp">
			<view class="header">
				<open-data class="" type="userAvatarUrl"></open-data>
			</view>
		</view>
		<view class="auth-title">申请获取以下权限</view>
		<view class="auth-subtitle">获得你的公开信息（昵称、头像等）</view>
		<view class="login-btn">
			<button class="btn-normal" open-type="getUserInfo" lang="zh_CN" @click="login">授权登录</button>
		</view>
		<view class="no-login-btn">
			<button class="btn-normal" @click="onNotLogin">暂不登录</button>
		</view>
		<view class="popup" v-if='isLogin&&!phone'>
			<view class="popupBox">
				<view class="popupTitle">申请获取以下权限</view>
				<view class='popupHint'>获得你的手机号码（进行绑定）</view>
				<view class='popupBtn'>
					<view class="left" @click="cancel">取 消</view>
					<view class="right">
						<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="phone"></button>
						授 权
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		UserGetMobile, // 获取用户手机号接口
		UserLogin, // 用户注册登录接口
		GetUserData, // 获取 个人资料 接口
		MiniCodeLogin, // 获取opendId接口
		GetTimWebConfig // 获取即时通信的用户id和用户密钥  接口
	} from '../../api/user.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				isLogin: false, // 判断是否点击了登录按钮的标识
				phone: false, // 判断是否获取到手机的标识
				recommend_id: app.globalData.recommend_id, // 推荐人id
				options: {}
			}
		},
		onLoad(options) {
			that = this
			that.options = options
			// if (!uni.getStorageSync('openid')) {
			uni.login({
				success(res) {
					MiniCodeLogin({
						code: res.code
					}, function(item) {
						uni.setStorageSync('openid', item.result.openid)
					})
				},
			})
			// }
		},
		onShow() {},
		methods: {
			// 获取即时通信的用户id和用户密钥
			GetTimWebConfigFun() {
				GetTimWebConfig({}, (res) => {
					if (res.status == 1) {
						app.globalData.user_id_sgin = res.result.userId
						app.globalData.user_Key = res.result.userSig
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 获取 用户个人信息 接口
			GetUserData(id) {
				GetUserData({
					user_id: id
				}, function(res) {
					// console.log("返回的用户信息数据全部", res)
					if (res.status == 1) {
						uni.setStorageSync('userInfo', res.result)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},

			// 微信授权获取手机号
			getPhoneNumber(e) {
				that.getPhone({
						iv: e.detail.iv,
						encryptedData: e.detail.encryptedData,
						openid: wx.getStorageSync('openid'),
					},
					function(res) {
						if (res.status == 1) {
							wx.showToast({
								title: '授权成功',
								icon: 'success',
							})
							that.phone = true
							setTimeout(function() {
								that.onNavigateBack(that.options.delta)
							}, 1000)
						} else {
							wx.showToast({
								title: '授权失败',
								icon: 'none',
							})
						}
					}
				)
			},

			// 获取 手机号码 接口
			getPhone(data, f) {
				UserGetMobile(data, function(res) {
					// console.log("获取手机号码返回的数据", res)
					if (res.status == 1) {
						wx.setStorageSync('phone', res.data.phoneNumber)
						var Pres = res
						let user = wx.getStorageSync('userInfo')
						// 注册登录需要用到的参数
						let postData = {}
						if (that.recommend_id != null) {
							postData = {
								avatarUrl: user.avatarUrl,
								nickName: user.nickName,
								openid: wx.getStorageSync('openid'),
								mobile: wx.getStorageSync('phone'),
								recommend_id: parseInt(that.recommend_id)
							}
						} else {
							postData = {
								avatarUrl: user.avatarUrl,
								nickName: user.nickName,
								openid: wx.getStorageSync('openid'),
								mobile: wx.getStorageSync('phone'),
							}
						}
						// console.log('查看登录页有没有推荐人的id以及提交的参数', postData)
						// 用户注册登录接口
						UserLogin(postData, function(res) {
							// console.log("用户登录成功后返回的userid的数据", res)
							if (res.status == 1) {
								wx.setStorageSync('user_id', res.result.user_id)
								that.GetUserData(uni.getStorageSync('user_id'))
								that.GetTimWebConfigFun()
								f(Pres)
								that.phone = true
								app.globalData.is_userId_phone = true
								// 	app.globalData.recommend_id = null
							} else {
								wx.showToast({
									title: res.msg,
									icon: 'none'
								})
							}
						})
					} else {
						wx.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},

			// 暂不登录
			onNotLogin() {
				let _this = this
				// 跳转回原页面
				_this.onNavigateBack(_this.options.delta)
			},

			// 授权成功 跳转回原页面
			onNavigateBack(delta) {
				wx.navigateBack({
					delta: Number(delta || 1),
				})
			},

			// 授权登录
			login() {
				wx.getUserProfile({
					desc: '用于完善用户资料',
					success: (res) => {
						// console.log("获取头像和昵称返回的数据",res)
						uni.setStorageSync("userInfo", res.userInfo)
						that.isLogin = true
					},
					complete: (res) => {
						console.log('bug',res)
					}
				})
			},

			// 取消登录
			cancel() {
				this.isLogin = false
			},
		},
	}
</script>
<style>
	page {
		background: #fff;
		font-size: 32rpx;
	}

	.container {
		padding: 0 60rpx;
	}

	.wechatapp {
		padding: 80rpx 0 48rpx;
		border-bottom: 1rpx solid #e3e3e3;
		margin-bottom: 72rpx;
		text-align: center;
	}

	.wechatapp .header {
		width: 190rpx;
		height: 190rpx;
		border: 2px solid #fff;
		margin: 0rpx auto 0;
		border-radius: 50%;
		overflow: hidden;
		box-shadow: 1px 0px 5px rgba(50, 50, 50, 0.3);
	}

	.auth-title {
		color: #585858;
		font-size: 34rpx;
		margin-bottom: 40rpx;
	}

	.auth-subtitle {
		color: #888;
		margin-bottom: 88rpx;
		font-size: 28rpx;
	}

	.login-btn {
		padding: 0 20rpx;
	}

	.login-btn button {
		height: 88rpx;
		line-height: 88rpx;
		background: #667D8B;
		color: #fff;
		font-size: 30rpx;
		border-radius: 999rpx;
		text-align: center;
	}

	.no-login-btn {
		margin-top: 20rpx;
		padding: 0 20rpx;
	}

	.no-login-btn button {
		height: 88rpx;
		line-height: 88rpx;
		background: #dfdfdf;
		color: #fff;
		font-size: 30rpx;
		border-radius: 999rpx;
		text-align: center;
	}

	.popup {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.popupBox {
		width: 80%;
		background-color: #fff;
		border-radius: 15rpx;
		overflow: hidden;
	}

	.popupTitle {
		color: #585858;
		font-size: 34rpx;
		padding: 20rpx 20rpx;
		border-bottom: 1px solid rgb(231, 229, 229);
	}

	.popupHint {
		color: #888;
		font-size: 28rpx;
		text-align: center;
		padding: 50rpx 0;
	}

	.popupBtn {
		display: flex;
		align-items: center;
		border-top: 1px solid rgb(231, 229, 229);
	}

	.popupBtn view {
		width: 50%;
		text-align: center;
		padding: 30rpx 0;
		font-size: 28rpx;
		font-weight: 700;
	}

	.popupBtn .left {
		color: rgb(94, 93, 93);
	}

	.popupBtn .left:active {
		background-color: rgb(231, 228, 228);
	}

	.popupBtn .right {
		background-color: #667D8B;
		color: #fff;
		position: relative;
	}

	.popupBtn .right:active {
		background-color: #667D8B;
	}

	.popupBtn .right .phone {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0);
	}
</style>
