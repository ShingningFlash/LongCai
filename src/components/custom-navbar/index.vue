<template>
	<view class="topbox">
		<view style="position: absolute;">
			<u-navbar :title="title" :placeholder="true" bgColor="transparent" :titleStyle="titleStyle">
				<view slot="left"></view>
			</u-navbar>
		</view>

		<!-- 搜索框部分 -->
		<view class="top-search" @click="clickJump('/pages/listGoods/listGoods')">
			<view class="top-search-icon">
				<image src="https://tm.ydlweb.com/icons/search.png" mode="widthFix"></image>
			</view>
			<input type="text" placeholder="请输入关键词" :disabled="true" />
		</view>


		<!-- 轮播图部分 -->
		<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
			:duration="duration">
			<swiper-item v-for="(item,index) in bannerList" :key='index'
				@click="clickJump('/pages/bannerDetail/bannerDetail?ad_id='+item.ad_id)">
				<view class="swiper-item">
					<!-- item.ad_code -->
					     
					<image src="https://tm.ydlweb.com/public/upload/ad/2023/10-18/bf5e3072d0ff36bc4ef2b7f489d5db4b.jpg" mode=""></image>
				</view>
			</swiper-item>
		</swiper>

	</view>
</template>

<script>
	export default {
		props: {
			title: String,
			bannerList: {
				type: Array
			}
		},
		data() {
			return {
				indicatorDots: true,
				autoplay: true,
				interval: 4000,
				duration: 500,
				titleStyle: {
					color: '#fff',
					width: '100%',
					paddingLeft: '30rpx',
					fontSize: '36rpx',
					fontWeight: 700
				}
			};
		},
		methods: {
			// 路由跳转
			clickJump(e) {
				uni.navigateTo({
					url: e
				})
			}
		}
	};
</script>

<style lang="scss">
	.topbox {
		position: relative;
		width: 100%;
		height: 540rpx;

		.top-search {
			margin: 0 auto;
			padding: 0 30rpx;
			// width: 90%;
			height: 68rpx;
			position: absolute;
			top: 180rpx;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 99;
			border-radius: 50rpx;
			overflow: hidden;
			display: flex;
			align-items: center;

			.top-search-icon {
				width: 68rpx;
				height: 68rpx;
				padding-left: 30rpx;
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
				background: rgba(10, 10, 10, 0.25);
				font-size: 24rpx;
				color: #fff;
				padding: 0 20rpx 0 60rpx;
				box-sizing: border-box;
			}
		}

		.swiper {
			position: relative;
			width: 100%;
			height: 100%;

			swiper-item {
				.swiper-item {
					width: 100%;
					height: 540rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
</style>
