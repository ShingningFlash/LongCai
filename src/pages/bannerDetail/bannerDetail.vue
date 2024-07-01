<template>
	<view>
		<!-- 快讯详情部分 -->
		<view class="alert-detail-box">
			<view class="alert-detail-warp">
				<view class="alert-detail-top-warp">
					<text>{{AdOneData.ad_name}}</text>
				</view>
				<!-- <view class="alert-detail-bottom-warp">
					<text class="time-box">2011-12-12</text>
					<text></text>
				</view> -->
			</view>

			<view class="introduce">
				<view v-for="(item, index) in needArticleList1" :key="index">
					<view v-if="item.type=='rich-text'" v-html="item.value"></view>
					<video class='mainteacherbox' v-if="item.type=='video' && item.value" :src="item.value"
						style="width:100%;" frameborder="0"></video>
				</view>
			</view>


			<!-- <rich-text :nodes="AdOneData.content"></rich-text> -->
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
		<!-- <view class="other-alerts-list-box">
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
		</view> -->
	</view>
</template>

<script>
	import {
		GetAdOne
	} from '@/api/index.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				AdOneData: {}, // 轮播图详情数据
				needArticleList1: []
			}
		},
		onLoad(option) {
			that = this
			if (option.ad_id) {
				this.GetAdOneFun(option.ad_id)
			}
		},
		methods: {
			// 获取轮播图详情 数据
			GetAdOneFun(adId) {
				GetAdOne({
					ad_id: adId
				}, (res) => {
					if (res.status == 1) {
						res.result.content = this.textRach(res.result.content)
						res.result.content = this.formatRichText(res.result.content)
						this.needArticleList1 = this.getVideo(res.result.content)
						this.AdOneData = res.result
					}
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

		.introduce {
			margin-bottom: 77rpx;

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
