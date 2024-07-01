<template>
	<view class="top-search">
		<view class="top-search-icon">
			<image src="../../static/img/search.png" mode="widthFix"></image>
		</view>
		<input type="text" placeholder="请输入关键词" v-model="keyword" @blur="search" />
	</view>
</template>

<script>
	export default {
		name: "inputSearch",
		data() {
			return {
				keyword: '', // 搜索关键字
			};
		},
		methods: {
			// 将参数通过事件的方式提交到父组件
			search() {
				this.$emit('search', this.keyword)
			}
		},
	}
</script>

<style scoped>
	.top-search {
		position: absolute;
		top: 100rpx;
		bottom: 0;
		left: 0;
		right: 0;
		border-radius: 50rpx;
		overflow: hidden;
		/* position: relative; */
		display: flex;
		align-items: center;
	z-index: 100000;
	}

	.top-search-icon {
		width: 60rpx;
		height: 60rpx;
		overflow: hidden;
		/* position: absolute; */
		/* top: 0; */
		/* left: 0; */
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.top-search-icon>image {
		width: 28rpx;
	}

	.top-search>input {
		width: 100%;
		height: 63rpx;
		line-height: 63rpx;
		border-radius: 50rpx;
		background-color: #fff;
		font-size: 24rpx;
		color: #666;
		padding: 0 20rpx 0 60rpx;
		box-sizing: border-box;
	}
</style>
