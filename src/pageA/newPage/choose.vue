<template>
	<view>
		<view class="title">
			热门规格
		</view>
		<view class="box">
			<view class="flex-col" @click="navTo('1')">
				<image  src="/static/zj.png"></image>
				<view class="text">
					一寸
				</view>
				<view class="text2">
					25×35mm
				</view>
			</view>
			<view class="flex-col" @click="navTo('10')">
				<image  src="/static/zj.png"></image>
				<view class="text">
					两寸
				</view>
				<view class="text2">
					35×49mm
				</view>
			</view>
			<view class="flex-col" @click="navTo('7')">
				<image  src="/static/zj.png"></image>
				<view class="text">
					大一寸
				</view>
				<view class="text2">
					33×48mm
				</view>
			</view>
			<view class="flex-col" @click="navTo('13')">
				<image  src="/static/zj.png"></image>
				<view class="text">
					小二寸
				</view>
				<view class="text2">
					35×45mm
				</view>
			</view>
			<view class="flex-col" @click="navTo('4')">
				<image  src="/static/zj.png"></image>
				<view class="text">
					小一寸
				</view>
				<view class="text2">
					22×32mm
				</view>
			</view>
			<view class="flex-col" @click="navTo('391')">
				<image  src="/static/zj.png"></image>
				<view class="text">
					简历照片
				</view>
				<view class="text2">
					25×35mm
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:1
			}
		},
		onLoad(e){
			if(e.type){
				this.type = e.type
			}
			
		},
		methods: {
			navTo(id){
				let url
				if(this.type == 1){
					url = '/pageA/newPage/specDetail?id='+id
				}
				else{
					url = '/pageA/newPage/idPhoto?id='+id
				}
				uni.navigateTo({
					url:url
				})
			}
		}
	}
</script>

<style>
page{
	background-color: #F0F4F9;
}
</style>
<style lang="scss" scoped>
	.title{
		font-family: "PingFang SC Bold";
		font-weight: 700;
		font-size: 32rpx;
		color: #000;
		margin-top: 33rpx;
		margin-left:30rpx;
	}
	.box{
		display: grid;
		grid-template-columns: repeat(2,1fr);
		padding:0 73rpx;
		margin-top:20rpx;
		column-gap: 36rpx;
		image{
			width: 275rpx;
			height: 279rpx;
		}
		.text{
			font-family: "PingFang SC Bold";
			font-weight: 700;
			font-size: 32rpx;
			text-align: center;
			color: #000;
		}
		.text2{
			font-family: "PingFang SC Bold";
			font-weight: 700;
			font-size: 23rpx;
			text-align: center;
			margin-top:10rpx;
			color: #9a9a9a;
		}
	}
</style>
