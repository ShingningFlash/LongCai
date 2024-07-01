<template>
	<view>
		<!-- 快讯详情部分 -->
		<view class="alert-detail-box">
			<view class="alert-detail-warp">
				<view class="alert-detail-top-warp">
					<text>{{noticeDetail.title}}</text>
				</view>
				<view class="alert-detail-bottom-warp">
					<text class="time-box">{{noticeDetail.publish_time}}</text>
					<text>{{noticeDetail.author}}</text>
				</view>
			</view>
			<rich-text :nodes="noticeDetail.content"></rich-text>
			<!-- <view class="article-box">
				<view class="article">
					<text>
						近日，第七届哈尔滨工业大学建造节落下帷幕，哈尔滨工业大学参赛作品“叶满藩篱”和哈尔滨理工大学参赛作品“另一面”获得建造节纸板建筑设计与建造竞赛大学组一等奖，省实验中学作品“所有人的家”获得高中组一等奖。大连理工大学等4高校作品获得大学组二等奖。
					</text>
				</view>
				<view class="article-img">
					<image src="../../static/images/articleimg1.png" mode="widthFix"></image>
				</view>
				<view class="article">
					<text>
						　　哈工大建造节是以大学生为主体的实验与课程竞赛活动，旨在让学生理解建筑寿命周期的概念，培养学生专业兴趣与团队协作能力，目前已发展成为一项全国性建筑类竞赛活动。本届哈工大邀请了北京建筑大学、内蒙古工业大学、大连理工大学、吉林建筑大学、哈尔滨理工大学等省内外多所高校参加。此外，还特别邀请了哈市部分高中生参与，培养他们的创新精神。
						　　哈工大相关负责人介绍，本届大赛的主题是“都市游牧”，建筑材料使用统一的瓦楞纸板，参赛者需要利用有限的材料设计并建造出可供人们躲避噪音、恶劣气候和自然灾害的建筑场所。</text>
					</text>
				</view>
			</view> -->
		</view>
		<!-- 底部列表部分 -->
		<view class="other-alerts-list-box">
			<view class="other-alerts-list-warp">
				<view class="other-alerts-title-box">
					<text>其他快讯</text>
				</view>
				<view class="other-alerts-list-item-box">
					<view class="other-alerts-list-item-warp" v-for="(item,index) in noticeList" :key="index"
						@click="clickJump('/pages/alertsDetail/alertsDetail',item.article_id)">
						<view class="list-item-left-box">
							<image :src="item.thumb" mode=""></image>
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
	</view>
</template>

<script>
	import {
		GetNoticeList, // 获取 公告 接口
		GetArticle // 公告详情 接口
	} from '@/api/index.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				noticeList: [], // 公告数据
				noticeDetail: {}, // 公告详情数据
			}
		},
		onLoad(option) {
			that = this
			this.GetArticle(option.article_id)
			this.GetNoticeList(option.article_id)
		},
		methods: {
			// 获取公告详情 数据
			GetArticle(articleid) {
				GetArticle({
					article_id: articleid
				}, (res) => {
					if (res.status == 1) {
						this.noticeDetail = res.result
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 获取 公告 数据
			GetNoticeList(articleid) {
				GetNoticeList({
					exclude_ids: articleid
				}, (res) => {
					// console.log('返回的公告数据res', res)
					if (res.status == 1) {
						this.noticeList = res.result.rows
						// console.log('返回的公告数据', this.noticeList)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 路由跳转
			clickJump(e, articleid) {
				uni.redirectTo({
					url: e + "?article_id=" + articleid
				});
			},
		}
	}
</script>

<style lang="scss">
	//底部列表部分
	.other-alerts-list-box {
		padding: 0 30rpx;

		.other-alerts-list-warp {
			.other-alerts-title-box {
				padding: 30rpx 0;
				font-size: 32rpx;
				color: #2F2F2F;
				font-weight: 700;
			}

			.other-alerts-list-item-box {
				.other-alerts-list-item-warp {
					display: flex;
					padding-bottom: 30rpx;

					.list-item-left-box {
						width: 180rpx;
						height: 135rpx;

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

						.list-item-title-box {
							font-size: 28rpx;
							font-weight: 400;
							color: #111;
							line-height: 48rpx;
						}

						.list-item-time-box {
							font-size: 20rpx;
							font-weight: 400;
							color: #6B6B6B;
						}
					}
				}
			}
		}
	}

	// 快讯详情部分
	.alert-detail-box {
		padding: 30rpx 30rpx 0;

		.alert-detail-warp {

			.alert-detail-top-warp {
				font-size: 40rpx;
				font-weight: 700;
				color: #111;
			}

			.alert-detail-bottom-warp {
				padding-top: 15rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #9B9B9B;

				.time-box {
					padding-right: 15rpx;
				}
			}
		}

		.article-box {
			font-size: 28rpx;
			font-weight: 400;
			color: #333;
			padding: 40rpx 0;
			line-height: 56rpx;

			.article-img {
				padding: 30rpx 0;
				width: 692rpx;
				height: 100%;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
