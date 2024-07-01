<template>
	<view>
		<!-- 顶部搜索框部分 -->
		<view class="demo">
			<view class="demo-warp">
				<view class="search">
					<image src="https://tm.ydlweb.com/icons/search.png"></image>
					<input type="text" placeholder="请输入关键字" v-model.trim="keyword" @blur="searchCateGoods(twoTapIdx)" />
				</view>
			</view>
		</view>
		<!-- 一级分类部分 -->
		<view class="nav">
			<scroll-view class="navlist" scroll-x="true" enable-flex>
				<view :class="oneTapIdx == item.id ? 'select' : '' " v-for="(item,index) in serveType" :key="index"
					@click="OneTaps(item.id,item.son,index)">{{item.name}}</view>
			</scroll-view>
		</view>
		<!-- 二级分类和列表部分 -->
		<view class="list">
			<view class="left">

				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="listimodelleft" enable-flex>
					<view :class="twoTapIdx == item2.id ? 'select' : '' " v-for="(item2,index2) in serveTypeSon"
						:key="index2" @click="TwoTaps(item2.id,item2.id)">{{item2.name}}</view>
				</scroll-view>

			</view>
			<view class="listRight">
				<scroll-view :scroll-top="scrollTop" @scrolltolower="moreGoodsFun" scroll-y="true"
					:style="'height:'+demo.rightheight + 'px'" class="listimodel" enable-flex>
					<view class="listBOX" v-for="(item3,index3) in goodsList" :key='index3'
						@click="clickJump('/pages/goodsDetail/goodsDetail',item3.goods_id)">

						<image :src="item3.original_img"></image>

						<view class="text">
							<view class="name">{{item3.goods_name}}</view>
							<view class="price">¥{{item3.shop_price}}</view>
						</view>
					</view>
					<view class="listBOX" style="visibility: hidden;height: 0;" v-for="(item4,index4) in 50"
						:key='index4'>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 联系客服部分图标 -->
		<view class="serve-box" @click="openPopup">
			<view class="serve-warp">
				<view class="img">
					<image :src="getKefuIconDataIcon.img" mode=""></image>
				</view>
				<view class="serve-title">
					<text>联系客服</text>
				</view>
			</view>
		</view>

		<!-- 客服二维码 -->
		<view class="warp-box" v-if="show2" @click="show2 = false">
			<view class="rect">
				<view class="head_box">
					<image src="../../static/images/head.png" mode=""></image>
				</view>
				<view class="user_name-box">
					<text>{{getKefuIconData.kf_name}}</text>
					<text>长按识别添加客服</text>
				</view>
				<view class="wxcode_box">
					<view class="wxcode_warp">
						<image :src="getKefuIconData.kf_img" mode="" :show-menu-by-longpress="true"></image>
					</view>
				</view>
			</view>
		</view>

		<!-- 弹出框部分 -->
		<u-popup :show="show2" mode="bottom" :round="15" :closeOnClickOverlay='true' @close='closeFun'>

			<view class="popup-box">
				<view class="popup-warp" @click="voiceCall(getKefuIconData.user_id)">
					<view class="icon-warp">
						<image src="https://tm.ydlweb.com/icons/yuyinicon.png" mode=""></image>
					</view>
					<view class="text1">语音客服</view>
				</view>
				<view class="popup-warp" @click="videoCall(getKefuIconData.user_id)">
					<view class="icon-warp">
						<image src="https://tm.ydlweb.com/icons/shipinicon.png" mode=""></image>
					</view>
					<view class="text1">视频客服</view>
				</view>
				<view class="popup-warp" @click="kfCode">
					<view class="icon-warp">
						<image src="https://tm.ydlweb.com/icons/weixinicon.png" mode=""></image>
					</view>
					<view class="text1">客服微信</view>
				</view>
			</view>
		</u-popup>
		<u-overlay :show="show3" @click="show3 = false">
			<view class="warp">
				<view class="rect">
					<view class="head_box">
						<image src="../../static/images/head.png" mode=""></image>
					</view>
					<view class="user_name-box">
						<text>{{getKefuIconData.kf_name}}</text>
						<text>长按识别添加客服</text>
					</view>
					<view class="wxcode_box">
						<view class="wxcode_warp">
							<image :src="getKefuIconData.kf_img" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</u-overlay>
		<!--视频通话组件 -->
		<tuicalling ref="TUICalling2" id="TUICalling-component2" :config="config"></tuicalling>
	</view>
</template>

<script>
	import {
		GoodscCateList, // 获取 服务类别 接口
		CateGoods, // 获取 服务类别下的商品列表 接口
		GetKefuIcon // 获取客服图标  接口
	} from '@/api/index.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				config: { // 视频通话插件实例用户参数
					sdkAppID: 1400702353, // 开通实时音视频服务创建应用后分配的 SDKAppID
					userID: app.globalData.user_id_sgin, // 用户自己的 ID，可以由您的帐号系统指定
					userSig: app.globalData.user_Key, // 用户自己的 ID身份签名，相当于登录密码的作用
					tim: null
				},
				TUICalling2: null, // 视频通话插件实例标识
				userID: '', // 接听方用户id(相当于是客服的id)
				demo: {
					leftheight: 0,
					rightheight: 0
				},
				keyword: '', // 搜索关键字
				oneTapIdx: -1, // 一级分类选中项
				twoTapIdx: 0, // 二级分类选中项
				serveType: [], // 服务类别一级数据
				serveTypeSon: [], // 服务类别二级分类数据
				goodsList: [], // 对应服务类别下的商品列表数据
				getKefuIconData: {}, // 客服数据
				getKefuIconDataIcon: {}, // 客服图标数据
				show2: false, // 选择客服类型弹出框显示隐藏标识
				show3: false, // 客服二维码的弹窗显示隐藏标识
				page: 1, // 页码
			}
		},
		created() {
			const {
				windowHeight
			} = uni.getSystemInfoSync();
			this.demo.rightheight = windowHeight
			let that = this
			uni.getSystemInfo({
				success(res) {
					let scroolH = uni.createSelectorQuery().select(".list")

					scroolH.boundingClientRect(data => {
						that.demo.rightheight = (res.windowHeight - data.top) - 10
					}).exec()
				}
			})
		},
		onLoad(option) {
			that = this
			if (option.Pid) {
				this.oneTapIdx = option.Pid
				// console.log('传过来的服务类别id', this.oneTapIdx)
			}
		},
		onShow() {
			this.page = 1
			this.goodsList = []
			this.GoodscCateList()
			this.GetKefuIconFun()
			if (this.config.userID != '' && this.config.userSig != '') {
				setTimeout(() => {
					this.TUICalling2 = this.$refs.TUICalling2;
					this.$nextTick(() => {
						this.TUICalling2.init();
						this.TUICalling2._addTSignalingEvent();
					})
				}, 1000)
			}
		},
		onHide() {
			if (this.config.userID != '' && this.config.userSig != '') {
				// this.TUICalling2._removeTSignalingEvent();
				this.TUICalling2.destroyed();
			}
		},
		onUnload() {
			if (this.config.userID != '' && this.config.userSig != '') {
				// this.TUICalling2._removeTSignalingEvent();
				this.TUICalling2.destroyed();
			}
		},
		methods: {
			// 搜索关键字
			searchCateGoods(twoId) {
				this.page = 1
				this.goodsList = []
				this.serveTypeSon = [{
					id: 0,
					name: '全部'
				}]
				this.oneTapIdx = 0
				this.twoTapIdx = 0
				this.CateGoods(this.twoTapIdx)
			},

			// 下拉触底加载
			moreGoodsFun() {
				this.page++
				this.CateGoods(this.twoTapIdx)
			},


			voiceCall(userid) {
				this.userID = userid
				this.show2 = false
				this.TUICalling2.call({
					userID: this.userID, // 是客服的userID
					type: 1 // 1语言
				});
			},
			videoCall(userid) {
				this.userID = userid
				this.show2 = false
				this.TUICalling2.call({
					userID: this.userID, // 是客服的userID
					type: 2 // 2视频
				});
			},

			// 打开弹出框
			openPopup() {
				this.show2 = true
			},
			// 关闭遮罩层
			closeFun() {
				this.show2 = false
			},
			// 显示客服二维码
			kfCode() {
				this.show2 = false
				this.show3 = true
			},
			// 获取客服图标
			GetKefuIconFun() {
				GetKefuIcon({}, (res) => {
					if (res.status == 1) {
						this.getKefuIconDataIcon = res.result
					}
				})
			},
			// 获取 服务类别大类 接口
			GoodscCateList() {
				GoodscCateList({}, (res) => {
					// console.log('商品列表页返回的服务类别数据res', res)
					if (res.status == 1) {
						this.serveType = res.result
						this.serveType.unshift({
							id: 0,
							name: '全部',
							son: []
						})

						this.serveType.forEach((item) => {
							if (item.son) {
								item.son.unshift({
									id: 0,
									name: '全部'
								})
							}
						})

						this.serveTypeSon = this.serveType[0].son
						// console.log('商品列表页返回的服务类别数据', this.serveType)
						// 判断是不是从首页点击服务类别进来这个页面的 不是的话执行 1步骤  是的话执行2步骤  
						if (this.oneTapIdx == '-1') {
							// 1步骤
							this.oneTapIdx = this.serveType[0].id
							if (this.twoTapIdx == 0) {
								this.twoTapIdx = this.serveTypeSon[0].id
							}

						} else {
							// 2步骤 ：查找服务类型数据是不是从首页传过来的一级id，有的话执行3步骤 
							for (let i = 0; i < this.serveType.length; i++) {
								if (this.serveType[i].id == this.oneTapIdx) {
									this.getKefuIconData = this.serveType[i].kfInfo
									// 3步骤
									this.oneTapIdx = this.serveType[i].id

									this.serveTypeSon = this.serveType[i].son
									if (this.twoTapIdx == 0) {
										this.twoTapIdx = this.serveTypeSon[0].id
									}
								}
							}
						}
						this.CateGoods(this.twoTapIdx)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 获取 服务类别下小类的商品列表 接口
			CateGoods(twoid) {
				let data = {
					keywords: this.keyword,
					cat_id: this.oneTapIdx,
					cat_id_2: twoid,
					p: this.page
				}
				CateGoods(data, (res) => {
					// console.log('服务类别下的商品列表数据res', res)
					if (res.status == 1) {
						if (res.goodslist.length != 0) {
							for (let i = 0; i < res.goodslist.length; i++) {
								this.goodsList.push(res.goodslist[i])
							}
						}
						// console.log('服务类别下的商品列表数据', this.goodsList)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},

			// 一级标题点击事件
			OneTaps(idx, sonItem, index) {
				this.page = 1
				this.goodsList = []
				this.oneTapIdx = idx
				this.serveTypeSon = sonItem
				this.twoTapIdx = this.serveTypeSon[0].id
				if (index != -1) {
					this.getKefuIconData = this.serveType[index].kfInfo
				}
				this.CateGoods(this.twoTapIdx)
			},
			// 二级标题点击事件
			TwoTaps(idx, towObj) {
				this.page = 1
				this.goodsList = []
				this.twoTapIdx = idx
				this.CateGoods(this.twoTapIdx)
			},

			// 路由跳转
			clickJump(e, goodsid) {
				uni.navigateTo({
					url: e + '?goods_id=' + goodsid
				})
			},
			// 退回上个页面
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
		}
	}
</script>

<style lang="scss">
	// 客服二维码部分外层
	.warp-box {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		z-index: 10075;

		.rect {

			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			width: 540rpx;
			height: 720rpx;
			border-radius: 30rpx;
			background-color: #fff;

			.head_box {
				position: absolute;
				left: 176rpx;
				top: -94rpx;
				width: 188rpx;
				height: 188rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.user_name-box {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 30rpx 0 0;

				text:first-child {
					padding: 20rpx 0;
				}
			}

			.wxcode_box {

				.wxcode_warp {
					width: 380rpx;
					height: 380rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

		}
	}

	// 客服二维码部分里层
	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		background-color: #6a818e;

		.rect {
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			width: 540rpx;
			height: 720rpx;
			border-radius: 30rpx;
			background-color: #fff;

			.head_box {
				position: absolute;
				left: 176rpx;
				top: -94rpx;
				width: 188rpx;
				height: 188rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.user_name-box {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 30rpx 0 0;

				text:first-child {
					padding: 20rpx 0;
				}
			}

			.wxcode_box {

				.wxcode_warp {
					width: 380rpx;
					height: 380rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

		}
	}

	// 联系客服弹出框样式
	.popup-box {
		display: flex;
		width: 100%;
		justify-content: space-around;
		align-items: center;

		.popup-warp {
			width: 122rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 25rpx 0;

			.icon-warp {
				width: 96rpx;
				height: 96rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.text1 {
				font-size: 28rpx;
				color: #1e1e1e;
				font-weight: 400;
			}
		}
	}

	// 联系客服图标部分
	.serve-box {
		background: rgba(211, 213, 212, 0.39);
		border-radius: 15rpx;
		position: fixed;
		bottom: 80rpx;
		left: 30rpx;
		width: 120rpx;
		height: 120rpx;

		.serve-warp {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;

			.img {
				width: 76rpx;
				height: 76rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.serve-title {
				font-size: 24rpx;
				font-weight: 400;
				color: #667d8b;
			}
		}
	}

	// 二级分类部分
	.list .left .select::after {
		position: absolute;
		left: 0;
		content: "";
		top: 30rpx;
		width: 10rpx;
		height: 36rpx;
		background-color: #667d8b;
		border-radius: 0rpx 30rpx 30rpx 0rpx;
	}

	.list {
		display: flex;
		height: 100%;

		.left {
			width: 180rpx;
			height: 100%;
			color: #fff;


			.listimodelleft {
				display: flex;
				justify-content: space-around;
				flex-wrap: wrap;
				// height: 900rpx;
				background-color: #fff;


				view {
					width: 180rpx;
					height: 90rpx;
					white-space: nowrap;
					text-align: left;
					text-overflow: ellipsis;
					overflow: hidden;
					word-break: break-all;
					box-sizing: border-box;
					line-height: 90rpx;
					color: #AFB9C5;
					font-size: 24rpx;
					display: flex;
					justify-content: center;
				}

				.select {
					background: rgba(211, 213, 212, 0.39);
					position: relative;
				}


			}




		}

		.listRight {
			flex: 1;

			.listimodel {
				display: flex;
				justify-content: space-around;
				flex-wrap: wrap;
				// height: 1000rpx;
				margin-top: 5rpx;
				background-color: #f5f5f5;

				.listBOX {
					width: 240rpx;
					height: 315rpx;
					margin-top: 40rpx;

					image {
						width: 240rpx;
						height: 200rpx;
						border-radius: 12rpx 12rpx 0 0;
						display: block;
					}

					.text {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						padding: 10rpx;
						height: 114rpx;
						border-radius: 0 0 12rpx 12rpx;
						background: rgba(255, 255, 255, 1);

						.name {
							font-weight: 400;
							font-size: 24rpx;
							text-align: left;
							color: #111;
							text-overflow: -o-ellipsis-lastline;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							line-clamp: 2;
							-webkit-box-orient: vertical;
						}

						.price {
							font-weight: 400;
							font-size: 22rpx;
							text-align: left;
							color: #FF2D2d;
							padding: 10rpx 0;
						}
					}
				}

				.listBOX:nth-child(1) {
					margin-top: 20rpx;
				}

				.listBOX:nth-child(2) {
					margin-top: 20rpx;
				}
			}
		}
	}

	// 一级分类部分
	.nav .navlist .select::after {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		width: 84rpx;
		height: 6rpx;
		background-color: #D2DCE9;
		content: "";
		left: calc(50% - 42rpx);
	}

	.nav {
		background-color: #fff;

		.navlist {
			height: 80rpx;
			display: flex;
			box-shadow: 0 3rpx 6rpx rgba(0, 0, 0, 0.16);

			view {
				flex-shrink: 0;
				padding: 15rpx 30rpx;
				font-size: 28rpx;
				color: #111;
				font-weight: 400;
			}

			.select {
				position: relative;
				color: #667D8B;
			}
		}
	}

	// 顶部搜索框部分
	.demo {

		padding: 20rpx 30rpx;

		.demo-warp {
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #fff;
			width: 100%;
			height: 64rpx;


			.search {
				width: 690rpx;
				display: flex;
				align-items: center;
				height: 63rpx;
				border-radius: 30.5rpx;
				background-color: #f1f1f1;
				padding: 0rpx 20rpx;
				color: #fff;

				image {
					width: 28rpx;
					height: 28rpx;
					margin-right: 10rpx;
				}

				input {
					font-size: 24rpx;
					font-weight: 400;
					color: #667D8B;
					flex: 1;
				}
			}
		}


	}
</style>
