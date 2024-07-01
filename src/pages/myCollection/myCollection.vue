<template>
	<view>
		<!-- 搜索框部分 -->
		<view class="top-search">
			<view class="top-search-icon">
				<image src="https://tm.ydlweb.com/icons/search.png" mode="widthFix"></image>
			</view>
			<input type="text" placeholder="请输入关键字" v-model.trim="keyword" @blur="search" />
		</view>
		<!-- 商品列表部分 -->
		<view class="goodsBox">
			<!-- ==========循环开始=========== -->
			<view class="goods-item" v-for="(item,index) in collectList" :key='index'
				@click="clickJump('/pages/goodsDetail/goodsDetail?goods_id='+item.goods_id)">
				<view class="goods-img">
					<image :src="item.original_img" mode="widthFix"></image>
				</view>
				<view class="goods-text">
					<view class="goods-name">{{item.goods_name}}</view>
					<view class="goods-flex">
						<view class="leftbox">
							￥<text>{{item.shop_price}}</text>
						</view>
						<view class="rightbox">
							<view class="imgbox">
								<image src="https://tm.ydlweb.com/icons/love.png"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- ==========循环结束=========== -->
		</view>
	</view>
</template>

<script>
	import {
		GetCollect // 获取 我的收藏 接口
	} from '@/api/user.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				keyword: '', // 搜索关键字
				collectList: [], // 我的收藏数据列表
			}
		},
		onShow() {
			this.GetCollectFun()
		},
		methods: {
			// 我的收藏 数据列表
			GetCollectFun() {
				GetCollect({
					keyword: this.keyword
				}, (res) => {
					if (res.status == 1) {
						this.collectList = res.result.rows
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 失去焦点
			search() {
				this.GetCollectFun()
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
	// 商品列表部分
	.goodsBox {
		margin: 30rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.goods-item {
			width: 330rpx;
			background-color: #fff;
			border-radius: 10rpx;
			flex-direction: column;
			justify-content: space-between;
			margin-bottom: 30rpx;
			box-shadow: 0 5rpx 10rpx #ddd;
			overflow: hidden;

			.goods-img {
				width: 330rpx;
				height: 275rpx;
				flex-shrink: 0;
				overflow: hidden;

				image {
					height: 100%;
					width: 100%;
				}
			}

			.goods-text {
				width: 100%;
				padding: 20rpx 20rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.goods-name {
					font-size: 26rpx;
					color: #111;
					font-weight: 400;

					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
		}

		.goods-flex {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 10rpx;
			height: 100%;

			.leftbox {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 23rpx;
				font-weight: 400;
				color: #ff2d2d;

				text {
					font-size: 28rpx;
					font-weight: 400;
					color: #ff2d2d;
				}
			}

			.rightbox {
				width: 30rpx;
				height: 30rpx;

				.imgbox {
					width: 30rpx;
					height: 30rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}

		.cartIconBox {
			position: fixed;
			right: 10rpx;
			bottom: 150rpx;
			width: 150rpx;
			height: 150rpx;
			border-radius: 50%;

			.cartIconWarp {
				width: 150rpx;
				height: 150rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

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
			color: #1e1e1e;
			padding: 0 20rpx 0 60rpx;
			box-sizing: border-box;
		}
	}

	page {
		background-color: #f5f5f5;
	}
</style>
