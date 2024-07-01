<template>
	<view>
		<!-- 搜索框部分 -->
		<view class="top-search">
			<view class="top-search-icon">
				<image src="https://tm.ydlweb.com/icons/search.png" mode="widthFix"></image>
			</view>
			<input type="text" placeholder="请输入门店名称" v-model.trim="keyword" @blur="search" />
		</view>
		<!-- 门店列表部分 -->
		<view class="stores-list-box">
			<view class="stores-list-warp">
				<!-- 循环部分 -->
				<view class="stores-list-item" v-for="(item,index) in storeslist" :key='index'
					@click="radioChange(item.id)">
					<view class="img-box">
						<image :src="item.store_img" mode=""></image>
					</view>
					<view class="message-box">
						<view class="top">
							<text>自提点：</text><text>{{item.store_name}}</text>
						</view>
						<view class="middle">
							<text>{{item.address}}</text>
						</view>
						<view class="bottom">
							<text>距离您{{item.distance}}</text>
						</view>
					</view>
					<!-- <view class="radio-box">
						<radio :value="item.id" :checked="item.disabled" @click="radioChange(item.id)"
							color="#667D8B" />
					</view> -->
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import {
		GetStoreList // 获取 附近合作商列表 接口
	} from '@/api/index.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				keyword: '', // 搜索关键字
				latitude: null, // 当前位置纬度
				longitude: null, // 当前位置经度
				storeslist: [], // 门店列表数据
				store_id: null, // 传过来的门店id
			}
		},
		onLoad(option) {
			that = this
			if (option.store_id) {
				this.store_id = option.store_id
			}
			console.log('传过来的门店id', option)
		},
		onShow() {
			that.GetLocationFun()
		},
		methods: {
			// 获取当前位置经纬度
			GetLocationFun() {
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					success: function(res) {
						that.latitude = res.latitude;
						that.longitude = res.longitude;
						if (that.latitude != null && that.longitude != null) {
							that.GetStoreList(that.keyword)
						} else {
							uni.showToast({
								title: '抱歉，获取不到位置',
								icon: 'none'
							})
						}
					}
				});
			},
			// 获取附近合作商列表
			GetStoreList(keyword) {
				let data = {
					keyword: keyword,
					latitude: this.latitude,
					longitude: this.longitude
				}
				GetStoreList(data, (res) => {
					// console.log('获取到的附近合作商res', res)
					if (res.status == 1) {
						// res.result.rows.forEach((item) => {
						// 	item.disabled = false
						// })
						// if (this.store_id) {
						// 	res.result.rows.forEach((item2) => {
						// 		if (item2.id == this.store_id) {
						// 			item2.disabled = true
						// 		}
						// 	})
						// }
						this.storeslist = res.result.rows
						console.log('获取到的门店列表', this.storeslist)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},

			// 选择自提门店单选框事件
			radioChange(id) {

				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例

				for (let i = 0; i < this.storeslist.length; i++) {
					// 2.匹配传过来的门店id,如果不相等,就改为没有选中的状态,即false
					if (this.storeslist[i].id == id) {
						prevPage.$vm.storeData = this.storeslist[i]; //修改上一页data里面的storeData参数值
						uni.navigateBack({
							delta: 1
						})
						return;
					}
				}
			},

			// 路由跳转
			clickJump(e) {
				uni.navigateTo({
					url: e
				})
			},
		}
	}
</script>

<style lang="scss">
	// 搜索框部分
	.top-search {
		position: relative;
		margin: 0 auto;
		padding: 0 20rpx;
		height: 68rpx;
		border-radius: 50rpx;
		overflow: hidden;
		display: flex;
		align-items: center;

		.top-search-icon {
			width: 68rpx;
			height: 68rpx;
			padding-left: 20rpx;
			overflow: hidden;
			position: absolute;
			top: 0;
			left: 0;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				width: 28rpx;
				height: 28rpx;
			}
		}

		input {
			width: 100%;
			height: 100%;
			line-height: 68rpx;
			border-radius: 50rpx;
			background-color: #f1f1f1;
			font-size: 24rpx;
			color: #fff;
			padding: 0 20rpx 0 60rpx;
			box-sizing: border-box;
		}
	}

	//列表部分
	.stores-list-box {
		padding: 0 20rpx;

		.stores-list-warp {
			display: flex;
			flex-direction: column;

			.stores-list-item {
				display: flex;
				padding: 30rpx 0 30rpx;
				border-bottom: 1rpx solid #e6e6e6;

				.img-box {
					width: 200rpx;
					height: 150rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.message-box {
					flex: 1;
					display: flex;
					flex-direction: column;
					padding-left: 20rpx;

					justify-content: space-around;

					.top {
						font-size: 32rpx;
						font-weight: 700;
						color: #111;
					}

					.middle {
						padding: 6rpx 0;
						font-size: 24rpx;
						color: #777;
						font-weight: 400;
					}

					.bottom {
						font-size: 24rpx;
						color: #777;
						font-weight: 400;
					}
				}

				.radio-box {
					display: flex;
					flex-direction: column;
					justify-content: center;
				}
			}
		}
	}
</style>
