<script>
	import {
		MiniCodeLogin, // 获取opendId接口
		GetTimWebConfig // 获取即时通信的用户id和用户密钥  接口
	} from './api/user'

	export default {
		// 全局变量
		globalData: {
			is_userId_phone: wx.getStorageSync('user_id') && wx.getStorageSync('phone') ? true : false, // 是否有手机号码和user_id
			recommend_id: null, // 推荐人id
			SDKAppId:1400702353,
			
			user_id_sgin:'',
			user_Key:'',
			
			// TUICalling: null, // 视频通话插件实例标识
			
		},

		onLaunch: function(option) {
			GetTimWebConfig({},(res)=>{
				if(res.status == 1){
					this.globalData.user_id_sgin = res.result.userId
					this.globalData.user_Key = res.result.userSig
				}
			})
			console.log('推荐人idAPP页通过二维码获取推荐人id:', option)
			// 如果通过二维码扫码进来，就获取到推荐人id并绑定
			if (option.query.scene) {
				option.query.scene = decodeURIComponent(option.query.scene)
				var arr = option.query.scene.split('=')
				console.log('推荐人idAPP页通过二维码获取推荐人arr:', arr)
				this.globalData.recommend_id = arr[1]
				console.log('推荐人idAPP页通过二维码获取推荐人id', this.globalData.recommend_id)
			} else if (option.query.recommend_id && option.query.recommend_id != '' && option.query.recommend_id !=
				null && option.query.recommend_id != undefined) {
				this.globalData.recommend_id = option.query.recommend_id
				console.log('推荐人idAPP页通过分享获取推荐人id', this.globalData.recommend_id)
			}

			// 检测最新版本(固定代码)
			if (uni.canIUse('getUpdateManager')) {
				const updateManager = uni.getUpdateManager()
				// 检查是否有新版本发布
				updateManager.onCheckForUpdate(function(res) {
					if (res.hasUpdate) {
						//小程序有新版本，则静默下载新版本，做好更新准备
						updateManager.onUpdateReady(function() {
							uni.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success: function(res) {
									if (res.confirm) {
										//新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										updateManager.applyUpdate()
									} else if (res.cancel) {
										//如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
										uni.showModal({
											title: '温馨提示',
											content: '我们已经做了新的优化，请及时更新哦~',
											showCancel: false, //隐藏取消按钮，也可显示，取消会走res.cancel，然后从新开始提示
											success: function(res) {
												//第二次提示后，强制更新           
												if (res.confirm) {
													// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
													updateManager.applyUpdate()
												} else if (res.cancel) {
													//重新回到版本更新提示
													autoUpdate()
												}
											}
										})
									}
								}
							})
						})
						// 新的版本下载失败
						updateManager.onUpdateFailed(function() {
							uni.showModal({
								title: '温馨提示',
								content: '新版本已经上线，请您删除当前小程序，重新搜索打开',
							})
						})
					}
				})
			} else {
				// 提示用户在最新版本的客户端上体验
				uni.showModal({
					title: '温馨提示',
					content: '当前微信版本过低，可能无法使用该功能，请升级到最新版本后重试。'
				})
			}
		},
		methods: {
			getLogin(f) {
				let login_user_id;
				wx.getStorageSync('user_id') && wx.getStorageSync('phone') ? login_user_id = true : login_user_id = false
				f(login_user_id)
			},
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import 'uview-ui/index.scss';
	.flex {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
	}
	
	.flex-row {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-orient: horizontal;
		-webkit-flex-direction: row;
		flex-direction: row;
	}
	
	.flex-row-reverse {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-orient: horizontal;
		-webkit-flex-direction: row-reverse;
		flex-direction: row-reverse;
	}
	
	.flex-col {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-flex-direction: column;
		flex-direction: column;
	}
	
	.flex-wrap {
		flex-wrap: wrap;
	}
	
	.flex-grow-0 {
		min-width: 0;
		-webkit-box-flex: 0;
		-webkit-flex-grow: 0;
		-ms-flex-positive: 0;
		flex-grow: 0;
		-webkit-flex-shrink: 0;
		-ms-flex-negative: 0;
		flex-shrink: 0;
	}
	
	.flex-grow-1 {
		min-width: 0;
		-webkit-box-flex: 1;
		-webkit-flex-grow: 1;
		-ms-flex-positive: 1;
		flex-grow: 1;
		-webkit-flex-shrink: 1;
		-ms-flex-negative: 1;
		flex-shrink: 1;
	}
	
	.flex-x-center {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-pack: center;
		-webkit-justify-content: center;
		-ms-flex-pack: center;
		justify-content: center;
	}
	
	.flex-y-center {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		-ms-grid-row-align: center;
		align-items: center;
	}
	
	.flex-y-bottom {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: end;
		-webkit-align-items: flex-end;
		-ms-flex-align: end;
		-ms-grid-row-align: flex-end;
		align-items: flex-end;
	}
	
	/* 主轴方向 main */
	
	.m-start {
		justify-content: flex-start;
	}
	
	.m-end {
		justify-content: flex-end;
	}
	
	.m-around {
		justify-content: space-around;
	}
	
	.m-between {
		justify-content: space-between;
	}
	
	.m-center {
		justify-content: center;
	}
	
	/* 侧轴方向 second*/
	
	.s-start {
		align-items: flex-start;
	}
	
	.s-end {
		align-items: flex-end;
	}
	
	.s-around {
		align-items: space-around;
	}
	
	.s-between {
		align-items: space-between;
	}
	
	.s-center {
		align-items: center;
	}
</style>
