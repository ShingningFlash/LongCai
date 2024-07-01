<template>
	<view>
		<!-- 顶部轮播部分 -->
		<view class="banner-box">
			<scroll-view scroll-x="true" class="listBox" enable-flex>
				<view class="listItem" v-for="(item,index) in noticeList" :key='index' v-if="index < 3" @click="clickJumpFun('/pages/alertsDetail/alertsDetail',item.article_id)">
					<view class="img">
						<image :src="item.thumb"></image>
					</view>
					<view class="leftnamebox">
						<view class="item-title">{{item.title}}</view>
						<view class="item-time">{{item.publish_time}}</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 底部列表部分 -->
		<view class="list-box">
			<view class="list-warp">
				<view class="list-item-box" v-for="(item,index) in noticeList" :key='index' v-if="index > 2"
					@click="clickJumpFun('/pages/alertsDetail/alertsDetail',item.article_id)">
					<view class="list-item-left-box">
						<image :src="item.thumb" mode="widthFix"></image>
					</view>
					<view class="list-item-right-box">
						<view class="list-item-title-box">
							<text>{{item.title}}</text>
						</view>
						<view class="list-item-time-box">
							<text>{{item.publish_time}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		GetNoticeList // 获取 公告 接口
	} from '@/api/index.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				noticeList: [], // 公告数据
			}
		},
		onLoad() {
			that = this
		},
		onShow() {
			this.GetNoticeList()
		},
		methods: {
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
			// 路由跳转
			clickJumpFun(e,articleid) {
				uni.navigateTo({
					url: e + "?article_id=" + articleid
				})
			},
		}
	}
</script>

<style lang="scss">
	//底部列表部分
	.list-box {
		padding: 10rpx 30rpx;

		.list-warp {
			.list-item-box {
				display: flex;
				margin-bottom: 30rpx;

				.list-item-left-box {
					width: 181rpx;
					height: 136rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.list-item-right-box {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					padding-left: 30rpx;
				}

				.list-item-title-box {
					font-size: 28rpx;
					font-weight: 400;
					color: #111;
				}

				.list-item-time-box {
					font-size: 20rpx;
					font-weight: 400;
					color: #6B6B6B;
				}
			}
		}
	}

	// 顶部轮播部分
	.banner-box {
		padding: 20rpx 30rpx 30rpx;

		.listBox {
			display: flex;
			height: 320rpx;
			;

			.listItem {
				flex-shrink: 0; // scroll-view标签一行布局的关键
				position: relative;
				width: 485rpx;
				height: 320rpx;
				margin-right: 30rpx;
				border-radius: 10rpx;

				.img {
					width: 100%;
					height: 100%;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.leftnamebox {
					position: absolute;
					bottom: 20rpx;
					padding: 0 20rpx;
					z-index: 10;

					.item-title {
						font-size: 28rpx;
						font-weight: 700;
						color: #fff;
					}

					.item-time {
						padding-top: 10rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: #C5C5C7;
					}
				}
			}
		}
	}
</style>
