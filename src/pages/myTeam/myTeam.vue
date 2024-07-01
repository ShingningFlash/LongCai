<template>
	<view>
		<!-- 搜索框部分 -->
		<view class="top-search">
			<view class="top-search-icon">
				<image src="https://tm.ydlweb.com/icons/search.png" mode="widthFix"></image>
			</view>
			<input type="text" placeholder="请输入关键字" v-model.trim="keyword" @blur="search" />
		</view>
		<!-- 团队成员列表部分 -->
		<view class="team-box">
			<view class="team-warp" v-for="(item,index) in teamData" :key='index'>
				<view class="team-item">
					<view class="team-item-left">
						<view class="team-item-left-img">
							<image :src="item.head_pic" mode=""></image>
						</view>
						<view class="team-item-left-name">
							<text class="text1">{{item.nickname}}</text>
							<text class="text2">{{item.reg_time}}</text>
						</view>
					</view>
					<view class="team-item-right">
						<view class="team-item-right-ordernum">
							<text class="text1">{{item.orderNum}}</text>
						</view>
						<view class="team-item-right-ordermoney">
							<text class="text1">{{item.orderMoney}}元</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		GetMineTeam // 我的团队 接口
	} from '@/api/user.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				keyword: '', // 搜索关键字
				teamData: [], // 我的团队数据
			}
		},
		onShow() {
			this.GetMineTeamFun()
		},
		methods: {
			// 获取我的团队 数据列表
			GetMineTeamFun() {
				GetMineTeam({
					lay: 1
				}, (res) => {
					console.log('我的团队返回的数据res', res)
					if (res.status == 1) {
						this.teamData = res.result.rows
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	// 团队成员列表部分
	.team-box {
		padding: 30rpx;

		.team-warp {
			background-color: #fff;
			padding: 25rpx;
			border-radius: 10rpx;
			margin-bottom: 20rpx;

			.team-item {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.team-item-left {
					display: flex;
					align-items: center;

					.team-item-left-img {
						width: 80rpx;
						height: 80rpx;

						image {
							border-radius: 50%;
							width: 100%;
							height: 100%;
						}
					}

					.team-item-left-name {
						padding-left: 15rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						.text1 {
							font-size: 28rpx;
							font-weight: 400;
							color: #111;
						}

						.text2 {
							padding-top: 10rpx;
							font-size: 24rpx;
							font-weight: 400;
							color: #6a6a6a;
						}
					}
				}

				.team-item-right {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: flex-end;

					.team-item-right-ordernum {
						.text1 {
							background-color: #667D8B;
							font-size: 24rpx;
							font-weight: 400;
							color: #fff;
							padding: 2rpx 12rpx;
							border-radius: 5rpx;
						}
					}

					.team-item-right-ordermoney {
						.text1 {
							font-size: 24rpx;
							font-weight: 400;
							color: #111;
						}
					}
				}
			}
		}
	}

	// 搜索框部分
	.top-search {
		position: relative;
		margin: 0 auto;
		padding: 0 20rpx 24rpx;
		height: 68rpx;
		overflow: hidden;
		display: flex;
		align-items: center;
		background-color: #fff;

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
