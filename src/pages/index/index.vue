<template>
	<view>
		<custom-navbar title="双图文印" :bannerList='bannerArr' :loginPhone='loginPhone' :loginUser_id='loginUser_id'>
		</custom-navbar>

		<!-- 中间导航列表 -->
		<view class="middlebox">
			<view class="middle-warp">
				<view class="middle-left-box" @click="clickJumpFun('/pageA/newPage/index')">
					<view class="middle-icon">
						<image :src="navigationData.auto_print" mode="aspectFit"></image>
					</view>
				</view>
				<view class="middle-left-box" @click="clickJumpFun('/pages/partnershipAnd/partnershipAnd')">
					<view class="middle-icon">
						<image :src="navigationData.league_img" mode="aspectFit"></image>
					</view>
				</view>
				<view class="middle-left-box" @click="clickJumpFun('/pages/uploadFile/uploadFile')">
					<view class="middle-icon">
						<image :src="navigationData.file_upload" mode="aspectFit"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 中间喇叭公告部分 -->
		<view class="middle-horn-box">
			<view class="middle-horn-warp">
				<view class="horn-warp-left">
					<text class="text-one">双图</text><text class="text-two">快讯</text>
				</view>
				<swiper :autoplay='true' :vertical='true' :circular='true' class="swiperBox">
					<block v-for="(item,index) in noticeList" :key="index">
						<swiper-item @click="clickJumpAlertsFun('/pages/alertsDetail/alertsDetail',item.article_id)">
							<view class="swiper-item">
								<text>{{item.title}}</text>
							</view>
						</swiper-item>
					</block>
				</swiper>
				<view class="horn-warp-right" @click="clickJumpFun('/pages/alerts/alerts')">
					<text class="text-three">更多</text>
				</view>
			</view>
		</view>
		<view class="type-box">
			<text>服务类别</text>
		</view>
		<!-- 底部类别列表项 -->
		<view class="type-item-box">
			<view class="type-item-warp" v-for="(item,index) in serveType" :key="index"
				@click="clickJumpFun('/pages/listGoods/listGoods',item.id,1)">
				<image :src="item.image" mode="widthFix"></image>
			</view>
		</view>
		<!-- 弹框声明部分 -->
		<!-- 系统公告弹窗 -->
		<u-popup :show="popupShow" mode="center" bgColor="transparent" @close="popupShow = false">
			<view class="myPopup flex-col">
				<view class="bg">
					<view class="title">{{statementData.sm_title}}</view>
					<view class="time">{{statementData.sm_create_time}}</view>
					<scroll-view scroll-y="true" class="scroll-Y">
						<view class="info">
							<rich-text :nodes="statementData.sm_content"></rich-text>
						</view>
					</scroll-view>
					<view class="confirm" @click="popupShow = false">确认</view>
				</view>
				<image class="close" src="https://tm.ydlweb.com/icons/popup-close.png" @click="popupShow = false"></image>
			</view>
		</u-popup>
		<!-- 没登陆的隐形遮罩层 -->
		<!-- <view class="login" v-if="!loginPhone||!loginUser_id" @click="tapLogin"></view> -->
		<!--视频通话组件 -->
		<tuicalling ref="TUICalling1" id="TUICalling-component1" :config="config"></tuicalling>
	</view>
</template>

<script>
	import {
		CustomNavbar, // 自定义首页顶部轮播图
	} from '@/components/custom-navbar/index';
	import {
		GetAdList, // 获取 首页轮播图 接口
		GetHomeConf, // 获取 首页导航 接口
		GetNoticeList, // 获取 公告 接口
		GoodscCateList, // 获取 服务类别 接口
		GetStatement, // 声明内容 接口
		isDistributor // 获取用户的推荐人id
	} from '@/api/index.js'
	let that, app = getApp()
	export default {
		components: {
			CustomNavbar
		},
		data() {
			return {

				config: { // 视频通话插件实例用户参数
					sdkAppID: 1400702353, // 开通实时音视频服务创建应用后分配的 SDKAppID
					userID: app.globalData.user_id_sgin, // 用户自己的 ID，可以由您的帐号系统指定
					userSig: app.globalData.user_Key, // 用户自己的 ID身份签名，相当于登录密码的作用
					tim: null
				},
				TUICalling1: null, // 视频通话插件实例标识
				bannerArr: [], // 轮播图数据
				navigationData: [], // 首页导航数据
				noticeList: [], // 公告数据
				serveType: [], // 服务类别数据
				statementShow: false, // 声明弹框展示隐藏标识
				loginPhone: uni.getStorageSync('phone'), // 登录的手机号码标识
				loginUser_id: uni.getStorageSync('user_id'), // 登录的用户id标识
				popupShow: false, // 系统公告弹窗标识
				statementData: {}, // 声明内容信息数据
				flag: false, // 判断是不是合伙人
			}
		},
		// 分享给朋友
		onShareAppMessage: function() {
			return {
				title: '双图文印',
				path: '/pages/index/index?recommend_id=' + uni.getStorageSync('recommend_id'),
			};
		},
		// 分享到朋友圈
		onShareTimeline() {
			return {
				title: '双图文印',
				path: '/pages/index/index?recommend_id=' + uni.getStorageSync('recommend_id'),
			}
		},
		onLoad() {
			// console.log('this.loginPhone',this.loginPhone)
			// console.log('!this.loginUser_id',!this.loginUser_id)


			this.GetStatementFun()
			this.GetAdList()
			this.GetHomeConf()
			this.GetNoticeList()
			this.GoodscCateList()
		},
		onShow() {
			this.loginPhone = uni.getStorageSync('phone') // 登录的手机号码标识
			this.loginUser_id = uni.getStorageSync('user_id') // 登录的用户id标识
			if (this.config.userID != '' && this.config.userSig != '') {
				setTimeout(() => {
					this.TUICalling1 = this.$refs.TUICalling1;
					this.$nextTick(() => {
						this.TUICalling1.init();
						this.TUICalling1._addTSignalingEvent();
					})
				}, 1000)
			}
			// this.isDistributorFun()
		},
		onHide() {
			if (this.config.userID != '' && this.config.userSig != '') {
				this.TUICalling1._removeTSignalingEvent();
				this.$refs.TUICalling1.destroyed();
			}
		},
		onUnload() {
			if (this.config.userID != '' && this.config.userSig != '') {
				this.TUICalling1._removeTSignalingEvent();
				this.$refs.TUICalling1.destroyed();
			}
		},
		methods: {
			// 获取用户的推荐人id
			isDistributorFun() {
				isDistributor({
					user_id: this.loginUser_id
				}, (res) => {
					if (res.status == 1) {
						uni.setStorageSync('recommend_id', this.loginUser_id)
						console.log('成功')
					} else {
						uni.removeStorageSync('recommend_id')
						console.log('失败')
					}
				})
			},
			// 声明内容 接口
			GetStatementFun() {
				GetStatement({}, (res) => {
					if (res.status == 1) {
						this.statementData = res.result
						if (this.statementData.sm_is_show) {
							this.popupShow = this.statementData.sm_is_show == 0 ? true : false
						}
					}
				})
			},
			// 获取 首页轮播图 接口
			GetAdList() {
				GetAdList({}, (res) => {
					// console.log('首页返回的轮播图数据res', res)
					if (res.status == 1) {
						this.bannerArr = res.result
						// console.log('首页返回的轮播图数据', this.bannerArr)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 获取 首页导航 接口
			GetHomeConf() {
				GetHomeConf({}, (res) => {
					console.log('首页导航返回的全部数据', res)
					if (res.status == 1) {
						this.navigationData = res.result
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 获取 公告 接口
			GetNoticeList() {
				GetNoticeList({}, (res) => {
					// console.log('首页返回的公告数据res', res)
					if (res.status == 1) {
						this.noticeList = res.result.rows
						// console.log('首页返回的公告数据', this.noticeList)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 获取 服务类别 接口
			GoodscCateList() {
				GoodscCateList({}, (res) => {
					// console.log('首页返回的服务类别数据res', res)
					if (res.status == 1) {
						this.serveType = res.result
						// console.log('首页返回的服务类别数据', this.serveType)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 路由跳转
			clickJumpFun(e, typeid, flag) {

				if (!this.loginPhone || !this.loginUser_id) {
					if (e == '/pageA/newPage/index') {
						uni.navigateTo({
							url: e
						})
					} 
					
					else {
						uni.navigateTo({
							url: '/pages/login/login',
						})
					}
				} else {
					if (flag == 1) {
						uni.navigateTo({
							url: e + '?Pid=' + typeid
						})
					} else {
						uni.navigateTo({
							url: e
						})
					}
				}
			},
			// 跳转到文章详情页面
			clickJumpAlertsFun(e, articleid) {
				uni.navigateTo({
					url: e + "?article_id=" + articleid
				})
			},
			// 没登陆就跳转到登录页
			tapLogin() {
				// uni.showToast({
				// 	title: '请先登录',
				// 	icon: 'none'
				// })
				// setTimeout((res) => {
				uni.navigateTo({
					url: '/pages/login/login',
				})
				// }, 800)
			},



			// handleUserAccept: function(event) {
			// 	console.log(`远端${event.data.userID}已接通电话`);
			// 	// uni.showToast({
			// 	// 	title:`${event.data.userID}已接通电话`,
			// 	// 	icon:'none'
			// 	// })
			// },
			// handleUserReject: function(event) {
			// 	// console.log(`远端${event.data.invitee}拒绝电话`);
			// 	uni.showToast({
			// 		title: `${event.data.invitee}拒绝电话`,
			// 		icon: 'none'
			// 	})
			// },
			// handleNoResponse: function(event) {
			// 	// console.log(`远端${event.data.timeoutUserList[0]}无应答`);
			// 	uni.showToast({
			// 		title: `${event.data.timeoutUserList[0]}无应答`,
			// 		icon: 'none'
			// 	})
			// },
			// voiceCall() {
			// 	this.userID = this.getKefuIconData.user_id
			// 	this.show2 = false
			// 	this.TUICalling1.call({
			// 		userID: this.userID, // 是客服的userID
			// 		type: 1 // 1语言
			// 	});
			// },
			// videoCall() {
			// 	this.userID = this.getKefuIconData.user_id
			// 	this.show2 = false
			// 	this.TUICalling1.call({
			// 		userID: this.userID, // 是客服的userID
			// 		type: 2 // 2视频
			// 	});
			// },


		}
	}
</script>

<style lang="scss">
	// 登录
	.login {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100% !important;
		z-index: 999;
		background-color: rgba(0, 0, 0, 0);
	}

	// 中间导航栏部分
	.middlebox {
		padding: 20rpx 20rpx;

		.middle-warp {
			display: flex;

			.middle-left-box {
				background-color: #F0F2F9;
				display: flex;
				width: 225rpx;
				height: 150rpx;
				margin-left: 10rpx;

				.middle-icon {
					width: 100%;
					height: 100%;

					image {
						border-radius: 16rpx;
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}

	// 公告喇叭部分
	.middle-horn-box {
		padding: 0 20rpx;

		.middle-horn-warp {
			display: flex;
			align-items: center;
			background-color: #F0F2F9;
			border-radius: 16rpx;

			.horn-warp-left {
				display: flex;
				justify-content: center;
				width: 160rpx;
				height: 100%;
				font-size: 30rpx;

				.text-one {
					color: #667D8B;
				}

				.text-two {
					color: #333333;
				}
			}

			.swiperBox {
				flex: 1;
				line-height: 70rpx;
				height: 70rpx;
				font-size: 22rpx;
				color: #7e7e7e;

				.swiper-item {
					word-break: keep-all;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.horn-warp-right {
				display: flex;
				justify-content: center;
				width: 90rpx;
				height: 100%;
				font-size: 22rpx;
				color: #616161;

				.text-three {
					padding: 0 17rpx;
					border-left: 1rpx solid #616161;
				}
			}
		}
	}

	.type-box {
		padding: 20rpx;
		font-size: 30rpx;
		font-weight: 700;
		color: #111;
	}

	// 服务类别列表
	.type-item-box {
		padding: 0 20rpx;
		display: flex;
		flex-direction: column;

		.type-item-warp {
			flex: 1;
			height: 84rpx;
			padding-bottom: 16rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	// 消息弹窗
	.myPopup {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-flex-direction: column;
		flex-direction: column;
		justify-content: center;
		// align-items: center;
		width: 600rpx;

		.bg {
			position: relative;
			min-height: 800rpx;
			border-radius: 10rpx;
			box-sizing: border-box;
			background-color: #fff;
			padding: 58rpx 67rpx 68rpx 77rpx;
			background-size: 100% 800rpx;
			background-image: url(https://xcx.gdqhwy.com/public/upload/goods/2022/07-26/52e7366466df38abb0d9ba4d891d4a38.png);

			.scroll-Y {
				height: 380rpx;

				.info {
					font-weight: 400;
					font-size: 28rpx;
					color: #6b6a6a;
					// margin-top: 280rpx;
					// margin-bottom: 69rpx;
				}
			}

			.title {
				font-size: 48rpx;
				font-weight: 700;
				color: #667D8B;
				// margin-bottom: 130rpx;
			}

			.time {
				font-size: 26rpx;
				font-weight: 400;
				color: #667D8B;
				margin-top: 5rpx;
				margin-bottom: 130rpx;
			}

			.confirm {
				position: absolute;
				bottom: 25rpx;
				color: #fff;
				width: 457rpx;
				height: 80rpx;
				font-weight: 400;
				font-size: 30rpx;
				line-height: 80rpx;
				text-align: center;
				border-radius: 10rpx;
				background-color: #667D8B;
			}
		}

		.close {
			width: 50rpx;
			height: 50rpx;
			margin: 106rpx auto 0 auto;
		}
	}
</style>
