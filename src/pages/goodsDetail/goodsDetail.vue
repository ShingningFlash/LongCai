<template>
	<view>
		<!-- 轮播图部分 -->
		<view class="banner">
			<swiper class="swiper" :indicator-dots="true">
				<swiper-item v-for="(item,index) in goodsBannerData" :key="index">
					<image :src="item"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 商品信息部分 -->
		<view class="Top">
			<view class="TopPrice">
				<view class="left">
					<view>
						<span class="moneyicon" style="font-size: 32rpx;">￥</span>
						{{goodsDetailData.shop_price}}
					</view>
				</view>
				<view class="right">
					<image v-if="is_collect == 0" src="https://tm.ydlweb.com/icons/collect.png"
						@click="HandleCollectGoods(goodsId,1)"></image>
					<image v-else src="https://tm.ydlweb.com/icons/collect-sel.png" @click="HandleCollectGoods(goodsId,0)">
					</image>
					<view v-if="is_collect == 0" @click="HandleCollectGoods(goodsId,1)">收藏</view>
					<view v-else @click="HandleCollectGoods(goodsId,0)">已收藏</view>
				</view>
			</view>
			<view class="name">{{goodsDetailData.goods_name}}</view>
			<view class="remarks">{{goodsDetailData.goods_remark}}</view>
		</view>
		<!-- 商品规格部分 -->
		<view class="Spec">
			<view class="SpecItem" @click="openPupop">
				<view class="left">规格</view>
				<view class="right" v-if="spectitle != ''">
					<view class="addressbox">{{spectitle}}</view>
					<image src="https://tm.ydlweb.com/icons/arrow-right.png"></image>
				</view>
				<view class="right" v-else>
					<view class="addressbox">请选择规格</view>
					<image src="https://tm.ydlweb.com/icons/arrow-right.png"></image>
				</view>
			</view>
		</view>
		<!-- 用户评价部分 -->
		<view class="comment">
			<view class="comment-title">
				<view class="left" @click="userSgin">用户评价</view>
				<view class="right"
					@click="clickJump('/pages/evaluationDetail/evaluationDetail?goods_id='+goodsDetailData.goods_id)">
					<view>好评率{{rating}}%</view>
					<image src="https://tm.ydlweb.com/icons/arrow-right.png"></image>
				</view>
			</view>
			<view class="commentList" v-if="commentData.length != 0">
				<scroll-view class="commentscroll" scroll-x="true" enable-flex>
					<view class="commentbox" v-for="(item,index) in commentData" :key="index" v-if="item.img">
						<view class="commentuser">
							<view class="img">
								<image :src="item.head_pic"></image>
							</view>
							<view class="text">
								<view class="name">{{item.username}}</view>
								<view class="time">{{item.add_time}}</view>
							</view>
						</view>
						<view class="content">{{item.content}}</view>
						<scroll-view class="commentimg" :scroll-x="true" enable-flex v-if="item.img != 0">
							<view class="img" v-for="(item2,index2) in item.img" :key="index2">
								<image :src="item2"></image>
							</view>
						</scroll-view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 商品详情和常见问题切换部分 -->
		<view class="recommend">
			<view class="recommendTitle">
				<view :class="changeIndex == 0 ? 'recommendSelect' : '' " @click="changeClass(0)">商品详情</view>
				<view :class="changeIndex == 1 ? 'recommendSelect' : '' " @click="changeClass(1)">常见问题</view>
			</view>
		</view>
		<!-- 商品详情和常见问题展示部分 -->
		<view class="introduce">
			<view v-for="(item, index) in needArticleList1" :key="index">
				<view v-if="item.type=='rich-text'" v-html="item.value"></view>
				<video class='mainteacherbox' v-if="item.type=='video' && item.value" :src="item.value"
					style="width:100%;" frameborder="0"></video>
			</view>
		</view>
		<!-- 底部操作部分 -->
		<view class="btmTab">
			<view class="left">

				<view @click="openPopup" style="margin-left: 15rpx;">
					<image src="https://tm.ydlweb.com/icons/hhzx.png"></image>
					<view>客服</view>
				</view>

				<view @click="clickJumpCart">
					<image src="https://tm.ydlweb.com/icons/carticon.png"></image>
					<view>购物车</view>
				</view>


			</view>
			<view class="right">
				<view @click="AjaxJionCartFun">加入购物车</view>
				<view @click="GoodsBuyNow" style="margin-right: 15rpx;">在线下单</view>
			</view>
		</view>
		<!-- 规格弹出框部分 -->
		<view class="popup" v-if="show">
			<!-- <scroll-view :scroll-top="0" scroll-y="true" style="height:1050rpx" class="listimodel" enable-flex
				:show-scrollbar="true"> -->
			<view class="popupFlex">
				<view class="closeBtn-box">
					<view class="closeBtn-warp" @click="closePopup">
						<image src="https://tm.ydlweb.com/icons/del.png" mode=""></image>
					</view>
				</view>
				<view class="popupTop">
					<view class="img">
						<image :src="goodsDetailData.original_img"></image>
					</view>
					<view class="text">
						<view class="name">{{goodsDetailData.goods_name}}</view>
						<view class="price">
							<view v-if="specList.length == goods_filter_spec.length && spec_obj.price != undefined">
								<span>￥</span>{{spec_obj.price}}
							</view>
							<view v-else>
								<span>￥</span>{{goodsDetailData.shop_price}}
							</view>
						</view>
						<view class="text">
							已选：<text>{{spectitle}}</text>
						</view>
					</view>
				</view>
				<scroll-view :scroll-top="0" scroll-y="true" style="height:800rpx" class="listimodel" enable-flex
					:show-scrollbar="true">
					<view class="popupspec" v-for="(item,index) in goods_filter_spec" :key="index">
						<view class="title">{{item.name}}</view>
						<view class="list">
							<view :class="{select:item2.active == true}" v-for="(item2,index2) in item.item"
								:key="index2" @click="clickSpec(index,index2,item2.item)">
								{{item2.item}}
							</view>
						</view>
					</view>
					<!-- </scroll-view> -->
					<view class="popupspec">
						<view class="title">上传文件</view>
						<view class="list"
							style="display: flex;justify-content: space-between;align-items:center;border-radius: 20rpx;background-color: #ebebeb;padding-left: 20rpx;"
							@click="clickJump('/pages/uploadFile/uploadFile?goods='+true)">
							<input type="text" :disabled="true" placeholder="请上传相关文件" style="flex: 1;" />
							<view class="righticon" style="display: flex;justify-content: space-between;align-items:center;margin:0 0">
								<image src="https://tm.ydlweb.com/icons/arrow-right.png" mode=""
									style="width: 30rpx;height: 30rpx;">
								</image>
							</view>
						</view>
						<view class="file-box" v-if="fileData.length != 0 " v-for="(item3,index3) in fileData"
							:key="index">
							<text>{{item3.filename}}</text>
						</view>
					</view>
					<view class="popupnum">
						<view class="left">数量</view>
						<view class="right">
							<view @click="clickNum(2)">-</view>
							<input type="number" v-model.trim="numIpt" />
							<view @click="clickNum(1)">+</view>
						</view>
					</view>
					<view class="bun">
						<view @click="AjaxJionCartFun">加入购物车</view>
						<view @click="GoodsBuyNow">在线下单</view>
					</view>
				</scroll-view>
			</view>
			<!-- </scroll-view> -->
		</view>
		<!--视频通话组件 -->
		<tuicalling ref="TUICalling3" id="TUICalling-component3" :config="config"></tuicalling>
		<!-- 客服二维码 -->
		<view class="warp-box" v-if="show2" @click="show2 = false">
			<view class="rect">
				<view class="head_box">
					<image src="../../static/images/head.png" mode=""></image>
				</view>
				<view class="user_name-box">
					<text>{{kf.kf_name}}</text>
					<text>长按识别添加客服</text>
				</view>
				<view class="wxcode_box">
					<view class="wxcode_warp">
						<image :src="kf.kf_img" mode="" :show-menu-by-longpress="true"></image>
					</view>
				</view>
			</view>
		</view>

		<!-- 弹出框部分 -->
		<u-popup :show="show2" mode="bottom" :round="15" :closeOnClickOverlay='true' @close='closeFun'>
			<view class="popup-box">
				<view class="popup-warp" @click="voiceCall">
					<view class="icon-warp">
						<image src="https://tm.ydlweb.com/icons/yuyinicon.png" mode=""></image>
					</view>
					<view class="text1">语音客服</view>
				</view>
				<view class="popup-warp" @click="videoCall">
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
						<text>{{kf.kf_name}}</text>
						<text>长按识别添加客服</text>
					</view>
					<view class="wxcode_box">
						<view class="wxcode_warp">
							<image :src="kf.kf_img" mode="" :show-menu-by-longpress="true"></image>
						</view>
					</view>
				</view>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	import {
		genTestUserSig
	} from '@/debug/GenerateTestUserSig.js'

	// ==========
	import {
		GoodsInfo, // 获取 商品详情 接口 
		GoodSpec, // 获取 商品详情规格 接口 
		HandleCollectGoods, // 取消收藏、收藏 接口
		GetKefuIcon // 获取客服图标  接口
	} from '@/api/index.js'
	import {
		AjaxJionCart, // 加入购物车 接口
		TrueGoodsComment // 用户评价 接口
	} from '@/api/order.js'
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
				TUICalling3: null, // 视频通话插件实例标识
				userID: '', // 接听方用户id(相当于是客服的id)



				getKefuIconData: {}, // 客服图标数据
				kf: {}, // 商品客服信息
				show: false, // 规格弹出框显示隐藏标识
				show2: false, // 选择客服类型弹出框显示隐藏标识
				show3: false, // 客服二维码的弹窗显示隐藏标识


				goodsDetailData: {}, // 商品详情 数据
				goodsBannerData: [], // 商品详情轮播图数据
				is_collect: 0, // 是否收藏的标识 0不是  1是
				goods_filter_spec: [], // 当前产品的规格数据
				goods_filter_spec_all: [], // 所有规格组合起来的商品规格数据
				specList: [], // 存储选中的商品规格的id
				specName: [], // 存储选中的商品规格的名称
				spectitle: '', // 存储选中的商品规格的名称字符串
				spec_obj: {}, // 商品规格组合起来的详情信息
				commentData: [], // 客户评论数据
				needArticleList1: [], // 存储商品详情里面的数据（分类出图片，table表格，视频）
				numIpt: 1, // 商品数量

				goodsId: null, // 传过来
				fileData: [], // 存储需要上传的文件

				changeIndex: 0, // 切换商品商品详情（0）和 常见问题（1）

				rating: 0, // 好评率

			}
		},
		onLoad(option) {
			that = this
			if (option.goods_id) {
				this.goodsId = option.goods_id
				this.GoodsInfo(option.goods_id)
				this.GoodSpec(option.goods_id)
				this.TrueGoodsCommentFun(option.goods_id)
			}
		},
		onShow() {
			this.GetKefuIconFun()
			if (this.config.userID != '' && this.config.userSig != '') {
				setTimeout(() => {
					this.TUICalling3 = this.$refs.TUICalling3;
					this.$nextTick(() => {
						this.TUICalling3.init();
						this.TUICalling3._addTSignalingEvent();
					})
				}, 1000)
			}
		},
		onHide() {
			if (this.config.userID != '' && this.config.userSig != '') {
				this.TUICalling3._removeTSignalingEvent();
				this.TUICalling3.destroyed();
			}
		},
		onUnload() {
			if (this.config.userID != '' && this.config.userSig != '') {
				this.TUICalling3._removeTSignalingEvent();
				this.TUICalling3.destroyed();
			}
		},
		methods: {
			// 获取客服图标
			GetKefuIconFun() {
				GetKefuIcon({}, (res) => {
					if (res.status == 1) {
						this.getKefuIconData = res.result
					}
				})
			},
			// 显示客服二维码
			kfCode() {
				this.show2 = false
				this.show3 = true
			},
			// 打开弹出框
			openPopup() {
				this.show2 = true
			},
			// 关闭遮罩层
			closeFun() {
				this.show2 = false
			},

			// ============
			voiceCall() {
				this.userID = this.kf.user_id
				this.show2 = false
				this.TUICalling3.call({
					userID: this.userID, // 是客服的userID
					type: 1 // 1语言
				});
			},
			videoCall() {
				this.userID = this.kf.user_id
				this.show2 = false
				this.TUICalling3.call({
					userID: this.userID, // 是客服的userID
					type: 2 // 2视频
				});
			},

			// 获取用户评价数据信息
			TrueGoodsCommentFun(goodsid) {
				TrueGoodsComment({
					goods_id: goodsid
				}, (res) => {
					if (res.status == 1) {
						this.commentData = res.commentList
						this.rating = (parseFloat(((res.levelList.five + res.levelList.four) / res
								.count)) * 100)
							.toFixed(2)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 加入购物车事件
			AjaxJionCartFun() {
				if (this.specList.length != this.goods_filter_spec.length) {
					if (!this.show) {
						this.openPupop()
					}
					return uni.showToast({
						title: '请选择商品规格',
						icon: 'none'
					})
				}
				
				if (this.numIpt < 1) {
				   return uni.showToast({
						title: '商品数量有误',
						icon: 'none'
					})
				}
				
				let specString = null
				let fileIdData = null
				let fileIdArr = []
				let specId = null
				let stringSpecArr = []
				stringSpecArr = JSON.parse(JSON.stringify(this.specList))
				if (stringSpecArr.length != 0) {
					stringSpecArr.sort((old, New) => {
						return old - New
					})
				}

				if (stringSpecArr.length != 0) {
					specString = stringSpecArr.join("_");
				}
				for (let i = 0; i < this.goods_filter_spec_all.length; i++) {
					if (this.goods_filter_spec_all[i].key == specString) {
						specId = this.goods_filter_spec_all[i].item_id
					}
				}
				if (specId == null) {
					return uni.showToast({
						title: '商品规格出错',
						icon: 'none'
					})
				}

				// 拼接文件id
				if (this.fileData.length != 0) {
					for (let i = 0; i < this.fileData.length; i++) {
						fileIdArr.push(this.fileData[i].id)
					}
					fileIdData = fileIdArr.join(",");
				}

				let data = {
					goods_id: this.goodsId,
					goods_num: this.numIpt,
					item_id: specId,
					file: fileIdData
				}
				// console.log('加入购物车需要的参数', data)
				AjaxJionCart(data, (res) => {
					if (res.status == 1) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						this.show = false
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 在线下单按钮跳转到结算页面
			GoodsBuyNow() {
				if (this.specList.length != this.goods_filter_spec.length) {
					if (!this.show) {
						this.openPupop()
					}
					return uni.showToast({
						title: '请选择商品规格',
						icon: 'none'
					})
				}
				if (this.numIpt < 1) {
				   return uni.showToast({
						title: '商品数量有误',
						icon: 'none'
					})
				}
				let objArr = []
				let specString = ''
				let specId = null
				let stringSpecArr = []

				stringSpecArr = JSON.parse(JSON.stringify(this.specList))
				stringSpecArr.sort((old, New) => {
					return old - New
				})

				if (stringSpecArr.length != 0) {
					stringSpecArr.sort()
				}

				specString = stringSpecArr.join("_");
				for (let i = 0; i < this.goods_filter_spec_all.length; i++) {
					if (this.goods_filter_spec_all[i].key == specString) {
						specId = this.goods_filter_spec_all[i].item_id
					}
				}
				if (specId == null) {
					return uni.showToast({
						title: '商品库存不足',
						icon: 'none'
					})
				}
				// console.log('传过去的商品规格id', specId)
				if (this.fileData.length != 0) {
					for (let i = 0; i < this.fileData.length; i++) {
						objArr.push(JSON.stringify(this.fileData[i]))
					}
				}
				objArr = JSON.stringify(objArr)
				uni.navigateTo({
					url: '/pages/payment/payment?goods_id=' + this.goodsId + '&numIpt=' + this.numIpt +
						'&spec_id=' + specId + '&fileData=' + objArr
				})
			},
			// 修改商品数量
			clickNum(is) {
				this.numIpt = Number(this.numIpt)
				if (is == 1) {
					this.numIpt += 1
				} else if (this.numIpt > 1) {
					this.numIpt -= 1
				}
			},
			// 取消收藏、收藏 事件
			HandleCollectGoods(goodsid, type) {
				HandleCollectGoods({
					goods_id: goodsid,
					status: type
				}, (res) => {
					if (res.status == 1) {
						this.is_collect = res.result.is_collect
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 获取 商品详情 数据
			GoodsInfo(goodsid) {
				GoodsInfo({
					goods_id: goodsid
				}, (res) => {
					if (res.status == 1) {
						res.result.goods_content = this.textRach(res.result.goods_content)
						res.result.goods_content = this.formatRichText(res.result.goods_content)
						this.needArticleList1 = this.getVideo(res.result.goods_content)
						this.goodsDetailData = res.result

						// this.commentData = res.comment
						this.is_collect = this.goodsDetailData.is_collect
						this.goodsBannerData = res.goods_images
						this.kf = res.kfInfo

						// 给商品规格小类规格添加一个当前是否是选中的标识
						res.filter_spec.forEach(item => {
							item.item.forEach(item2 => {
								this.$set(item2, 'active', false)
							})
						})
						this.goods_filter_spec = res.filter_spec
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
					// console.log('获取商品详情返回的数据res', res)
				})
			},
			// 获取当前商品的所有规格数据
			GoodSpec(goodsid) {
				GoodSpec({
					goods_id: goodsid
				}, function(res) {
					// console.log('详情商品规格返回的数据res', res)
					that.goods_filter_spec_all = res.result // 商品所有组合规格数据
				})
			},
			// 更换选择的商品规格
			clickSpec(index, index2, specname) {
				if (this.specList.length == 0) {
					for (let p = 0; p < this.goods_filter_spec.length; p++) {
						this.specList.push('')
						this.specName.push('')
					}
				}

				this.goods_filter_spec.forEach((item, idx) => {
					if (idx == index) {
						item.item.forEach((items, idxs) => {
							if (idxs == index2) {
								this.specList.splice(index, 1, items.id)
								this.specName.splice(index, 1, specname)
								items.active = true
							} else {
								items.active = false
							}
						})
					}
				})
				let sort1 = []
				sort1 = JSON.parse(JSON.stringify(this.specList))
				sort1.sort((old, New) => {
					return old - New
				})
				let specKey = sort1.join('_')
				this.spectitle = this.specName.join(';')
				for (let key = 0; key < that.goods_filter_spec_all.length; key++) {
					if (that.goods_filter_spec_all[key].key == specKey) {
						that.spec_obj = that.goods_filter_spec_all[key]
					}
				}
				this.goods_filter_spec = JSON.stringify(this.goods_filter_spec)
				this.goods_filter_spec = JSON.parse(this.goods_filter_spec)
			},


			// 关闭规格弹出框
			closePopup() {
				this.show = false
			},
			// 打开规格弹出框
			openPupop() {
				this.show = true
			},
			// 切换商品详情和常见问题
			changeClass(idx) {
				this.changeIndex = idx
			},
			// 路由跳转到购物车
			clickJumpCart() {
				uni.switchTab({
					url: '/pages/cart/cart'
				})
			},
			// 路由跳转
			clickJump(e) {
				uni.navigateTo({
					url: e
				})
			},
			// 富文本内容修改样式
			textRach(textArea) {
				let text = textArea
					.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/gi, '<p')
					.replace(
						/<p>/gi,
						'<p style="font-size: 15px; line-height: 25px;width:100%;">'
					)
					.replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/gi, '<img$1')
					.replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/gi, '<img$1')
					.replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/gi, '<img$1')
					.replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/gi, '<img$1')
					.replace(/<img([\s\w"-=\/\.:;]+)/gi, '<img style="width: 100%;" $1')
				return text
			},
			// 富文本table的处理

			formatRichText(html) {

				/* 
				 * 处理富文本里的图片宽度自适应
				 * 1.去掉img标签里的style、width、height属性
				 * 2.img标签添加style属性：max-width:100%;height:auto
				 * 3.修改所有style里的width属性为max-width:100%
				 * 4.去掉<br/>标签
				 * @param html
				 * @returns {void|string|*}
				 */
				let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
					match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi,
						'max-width:100%;');
					return match;
				});
				// newContent = newContent.replace(/<br[^>]*\/>/gi, '');
				newContent = newContent.replace(/\<img/gi,
					'<img style="max-width:100%;height:auto;display:inline-block;"');

				//去除table的宽度
				newContent = newContent.replace(/<table[^>]*>/gi, function(match, capture) {
					return match.replace(/width=\"(.*)\"/gi, '');
				});
				return newContent;
			},

			// 富文本视频解析
			getVideo(data) {
				let videoList = [];
				let videoReg = /<video.*?(?:>|\/>)/gi; //匹配到字符串中的 video 标签
				let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; //匹配到字符串中的 video 标签 的路径
				let arr = data.match(videoReg) || []; // arr 为包含所有video标签的数组
				let articleList = data.split('</video>') // 把字符串  从视频标签分成数组
				arr.forEach((item, index) => {
					var src = item.match(srcReg);
					videoList.push(src[1]) //所要显示的字符串中 所有的video 标签 的路径
				})
				let needArticleList = [];
				articleList.forEach((item, index) => {
					if (item != "" && item != undefined) { //  常见的标签渲染
						needArticleList.push({
							type: 'rich-text',
							value: item + "</video>"
						});
					}
					let articleListLength = articleList.length; // 插入到原有video 标签位置
					if (index < articleListLength && videoList[index] != undefined) {
						needArticleList.push({
							type: 'video',
							value: videoList[index]
						})
					}
				})
				return needArticleList
			},
		}
	}
</script>

<style lang="scss">
	// 客服弹窗外层
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
		// background-color: #6a818e;

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

	// 客服弹窗里层
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

	// 规格弹出框部分
	.popup {
		//	这个是遮罩层部分开始
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column-reverse;

		//	内容展示部分
		.popupFlex {
			background-color: #fff;
			border-radius: 30rpx 30rpx 0rpx 0rpx;
			padding: 0rpx 30rpx 30rpx;

			.closeBtn-box {
				padding: 30rpx 0;
				display: flex;
				justify-content: flex-end;

				.closeBtn-warp {
					width: 40rpx;
					height: 40rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

			}

			.popupTop {
				display: flex;

				.img {
					image {
						width: 250rpx;
						height: 200rpx;
						margin-right: 20rpx;
					}
				}

				.text {
					color: #fff;
					font-size: 24rpx;
					margin-top: 10rpx;

					.name {
						font-size: 30rpx;
						color: #1E1E1E;
						font-weight: bold;
					}

					.price {
						display: flex;
						align-items: center;
						margin-top: 10rpx;
						color: #EB2929;
						font-size: 36rpx;
						margin-right: 15rpx;
						font-weight: 400;

						span {
							font-size: 26rpx;
						}
					}

					.text {
						font-size: 24rpx;
						color: #9E9E9E;
						font-weight: 400;

						text {
							color: #1e1e1e;
						}
					}
				}
			}

			.popupspec {
				margin-top: 5rpx;

				.title {
					font-size: 24rpx;
					font-weight: 400;
					color: #000;
					padding: 20rpx 0rpx 30rpx;
				}

				.list {
					display: flex;
					flex-wrap: wrap;

					input {
						font-size: 24rpx;
					}

					.select {
						padding: 12rpx 30rpx;
						background-color: #667D8B;
						border-radius: 20rpx;
						text-align: center;
						font-size: 24rpx;
						color: #fff;
						font-weight: 400;
						margin-right: 10rpx;
					}

					view {
						padding: 12rpx 30rpx;
						background-color: #ebebeb;
						border-radius: 20rpx;
						text-align: center;
						font-size: 24rpx;
						color: #515151;
						margin-right: 10rpx;
						margin-bottom: 20rpx;
					}
				}

				.file-box {
					font-size: 24rpx;
					color: #515151;
					font-weight: 400;
					padding: 20rpx;
					border-bottom: 1rpx solid #ddd;
				}
			}

			.popupnum {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 30rpx 0;

				.left {
					font-size: 24rpx;
					color: #000;
				}

				input {
					width: 90rpx;
					text-align: center;
				}

				.right {
					display: flex;
					align-items: center;

					view:nth-child(1) {
						width: 50rpx;
						height: 50rpx;
						background-color: #F5F5F5;
						border-radius: 10rpx;
						font-size: 37rpx;
						line-height: 30rpx;
						text-align: center;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					
					view:nth-child(2) {
						width: 50rpx;
						height: 50rpx;
						background-color: #F5F5F5;
						border-radius: 10rpx;
						font-size: 37rpx;
						line-height: 30rpx;
						text-align: center;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					
					view:nth-child(3) {
						width: 50rpx;
						height: 50rpx;
						background-color: #F5F5F5;
						border-radius: 10rpx;
						font-size: 37rpx;
						line-height: 30rpx;
						text-align: center;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}

			.bun {
				display: flex;
				align-items: center;

				view {
					flex: 1;
					width: 220rpx;
					height: 70rpx;
					border-radius: 40rpx;
					text-align: center;
					line-height: 70rpx;
					font-size: 28rpx;
					font-weight: bold;
				}

				view:nth-child(1) {
					background-color: #c2c2c2;
					margin-right: 10rpx;
					color: #4d4d4d;
				}

				view:nth-child(2) {
					background-color: #667D8B;
					color: #fff;
				}
			}
		}
	}

	// 底部操作部分

	.btmTab {
		position: fixed;
		bottom: 0rpx;
		left: 0;
		right: 0;
		background-color: #fff;
		height: 120rpx;
		display: flex;
		align-items: center;
		padding-bottom: 20rpx;

		.left {
			flex: 3;
			display: flex;
			align-items: center;

			view {
				flex: 1;
				text-align: center;
				font-size: 18rpx;

				image {
					width: 40rpx;
					height: 40rpx;
				}
			}


		}

		.right {
			flex: 8;
			display: flex;
			justify-content: space-around;
			align-items: center;

			view {
				width: 250rpx;
				height: 70rpx;
				border-radius: 40rpx;
				text-align: center;
				line-height: 70rpx;
				font-size: 28rpx;
				font-weight: bold;
			}


			view:nth-child(1) {
				background-color: #c2c2c2;
				margin-right: 10rpx;
				color: #4d4d4d;
			}

			view:nth-child(2) {
				background-color: #667D8B;
				color: #fff;
			}
		}
	}


	// 商品详情和常见问题展示部分

	.introduce {
		background-color: rgba(10, 10, 10, .25);
		// margin-bottom: 77rpx;
		padding-bottom: 130rpx;

		.Product_introduction {
			font-size: 0;
			width: 750rpx;
			height: 100%;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	// 商品详情和常见问题切换部分
	.recommend .recommendTitle .recommendSelect::after {
		width: 77rpx;
		height: 5rpx;
		background-color: #667D8B;
		position: absolute;
		left: calc(50% - 40rpx);
		bottom: 0;
		right: 0;
		content: "";
	}

	.recommend {
		background-color: #fff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		padding: 30rpx 30rpx;
		margin-top: 20rpx;

		.recommendTitle {
			display: flex;
			align-items: center;

			view {
				flex: 1;
				text-align: center;
				font-size: 23rpx;
				color: #667D8B;
				font-weight: 700;
				padding-bottom: 20rpx;
			}

			.recommendSelect {
				position: relative;
			}
		}
	}

	// 用户评价部分
	.comment {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx 30rpx;
		margin-top: 20rpx;

		.comment-title {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left {
				font-size: 30rpx;
				font-weight: bold;
				color: #1e1e1e;
			}

			.right {
				display: flex;
				align-items: center;
				font-size: 20rpx;
				color: #7e7e7e;

				image {
					width: 30rpx;
					height: 30rpx;
					margin-left: 20rpx;
				}
			}
		}

		.commentList {
			margin-top: 30rpx;

			.commentscroll {
				display: flex;
				height: 353rpx;

				.commentbox {
					width: 560.97rpx;
					height: 353rpx;
					background: #fff;
					border: 1rpx solid #ddd;
					border-radius: 20rpx;
					flex-shrink: 0;
					margin-right: 20rpx;
					padding: 20rpx;
					box-sizing: border-box;

					.commentuser {
						display: flex;
						align-items: center;

						image {
							width: 64rpx;
							height: 58rpx;
							margin-right: 20rpx;
						}

						.name {
							font-size: 24rpx;
							font-weight: bold;
							color: #1e1e1e;
						}

						.time {
							font-size: 20rpx;
							font-weight: 400;
							color: #9e9e9e;
						}
					}

					.content {
						font-size: 24rpx;
						font-weight: 400;
						color: #6e6e6e;
						margin-top: 20rpx;
					}

					.commentimg {
						display: flex;
						align-items: center;
						margin-top: 10rpx;

						image {
							width: 160rpx;
							height: 160rpx;
							margin-right: 10rpx;
						}
					}
				}
			}
		}
	}

	// 商品规格部分

	.Spec {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 0rpx 30rpx;
		margin-top: 20rpx;

		.SpecItem {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			font-weight: 400;
			color: #1e1e1e;

			.left {
				margin-right: 30rpx;
				height: 94rpx;
				display: flex;
				align-items: center;
			}

			.right {
				flex: 1;
				height: 94rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.addressbox {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-box-orient: vertical;
					flex: 1;
				}

				image {
					width: 30rpx;
					height: 30rpx;
				}
			}
		}
	}

	// 商品信息部分
	.Top {
		background-color: #fff;
		border-radius: 0rpx 0rpx 20rpx 20rpx;
		padding: 20rpx 30rpx;

		.TopPrice {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;
				color: #FF2D2D;

				view:nth-child(1) {
					font-size: 52rpx;
					margin-right: 20rpx;
					font-weight: 400;
				}

				// view:nth-child(2) {
				// 	color: #242424;
				// 	font-size: 24rpx;
				// 	text-decoration: line-through
				// }
			}

			.right {
				text-align: center;

				image {
					width: 33rpx;
					height: 33rpx;
				}

				view {
					font-size: 18.07rpx;
					font-weight: 400;
					color: #292929;
				}
			}
		}

		.name {
			font-size: 32rpx;
			font-weight: 400;
			color: #1E1E1E;
			margin: 10rpx 0rpx;
		}

		.remarks {
			font-size: 22rpx;
			color: #6E6E6E;
			font-weight: 400;
		}
	}

	// 轮播图数据
	.banner {
		position: relative;

		.swiper {
			height: 650rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	page {
		background-color: #f3f3f3;
	}
</style>
