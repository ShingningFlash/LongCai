<template>
	<view>
		<view class="content1" @click="navTo('/pageA/newPage/choose?type=1')">
			<view class="top flex m-between s-center">
				<image src="/static/head.svg"></image>
				<view class="right">
					<view class="text1">（没有证件照选我）</view>
					<view class="text2">智能证件照</view>
					<view class="text3">电子版保存/打印、智能换底、换装</view>
				</view>
			</view>
			<view class="user flex s-center m-between" style="margin-top:20rpx;">
				<view class="yuan flex-col m-end s-center">
					<image src="../static/photo1.png"></image>
				</view>
				<view class="flex s-center" style="margin-right: 30rpx">
					<view class="red flex-col m-end s-center" style="margin-right: 10rpx;">
						<image src="../static/photo2.png"></image>
					</view>
					<view class="blue flex-col m-end s-center" style="margin-right: 10rpx;">
						<image src="../static/photo3.png"></image>
					</view>
					<view class="white flex-col m-end s-center">
						<image src="../static/photo4.png"></image>
					</view>
				</view>
				
			</view>
			
			<view class="flex" style="margin-top: 15rpx;">
				<view class="btnd">
					原图
				</view>
				<view class="btnd-m">
					智能换背景后的照片
				</view>
			</view>
		</view>
		
		<view class="content1" @click="navTo('/pageA/newPage/choose?type=2')">
			<view class="top flex m-between s-center">
				<image src="/static/head.svg"></image>
				<view class="right" style="margin-right: 60rpx;">
					<view class="text1">（已有证件照选我）</view>
					<view class="text2">普通证件照</view>
					<view class="text3">将已有的证件照排版打印</view>
				</view>
			</view>
			<view class="user flex s-center m-between" style="margin-top:20rpx;">
				<view class=" flex-col m-end s-center" style="margin-left: 30rpx;">
					<image style="width: 140rpx;height: 200rpx;" src="../static/photo1.png"></image>
				</view>
				<view class="s-center flex flex-wrap" style="width: 280rpx;margin-right: 86rpx;">
					<view class="flex-col m-end s-center">
						<image  src="../static/photo5.png" style="width: 140rpx;height: 95rpx;"></image>
					</view>
					<view class=" flex-col m-end s-center" >
						<image src="../static/photo5.png" style="width: 140rpx;height: 95rpx;"></image>
					</view>
					<view class=" flex-col m-end s-center" >
						<image src="../static/photo5.png" style="width: 140rpx;height: 95rpx;"></image>
					</view>
					<view class=" flex-col m-end s-center" >
						<image src="../static/photo5.png" style="width: 140rpx;height: 95rpx;"></image>
					</view>
				</view>
				
			</view>
			
			<view class="flex" style="margin-top: 15rpx;">
				<view class="btnd">
					原图
				</view>
				<view class="btnd-m">
					智能换背景后的照片
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			navTo(url){
				if(url == '/pageA/newPage/choose?type=1'){
					uni.setStorageSync('print_type',6)
				}
				else{
					uni.setStorageSync('print_type',7)
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
.content1{
	width: 690rpx;
	height: 523rpx;
	border-radius: 15rpx;
	background: #fff;
	margin:0 auto;
	margin-top: 40rpx;
	padding:40rpx;
	box-sizing: border-box;
	.top{
		width: 100%;
		height: 172rpx;
		border-radius: 15rpx;
		background: #dfeffb;
		box-shadow: 0 0 15rpx #8b8b8b29;
		padding:20rpx 40rpx;
		box-sizing: border-box;
		image{
			width: 77rpx;
			height: 111rpx;
			margin-left:30rpx;
		}
		.right{
			
			.text1{
				font-family: "PingFang SC";
				font-weight: 400;
				font-size: 24rpx;
				text-align: center;
				color: #1c5fab;
			}
			.text2{
				font-family: "PingFang SC Bold";
				font-weight: 700;
				font-size: 36rpx;
				text-align: center;
				color: #000;
				margin-top:10rpx;
			}
			.text3{
				font-family: "PingFang SC";
				font-weight: 400;
				font-size: 24rpx;
				text-align: center;
				color: #a1a1a1;
				margin-top:10rpx;
			}
		}
	}
	.yuan{
		width:120rpx;
		height: 160rpx;
		margin-left:30rpx;
		
		image{
			width: 100%;
			height: 100%;
		}
	}
	.red{
		width:120rpx;
		height: 160rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.blue{
		width:120rpx;
		height: 160rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.white{
		width:120rpx;
		height: 160rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
	
	.btnd{
		width: 106rpx;
		height: 41rpx;
		border-radius: 20.5rpx;
		background: #fff;
		border: 1rpx dashed #707070;
		text-align: center;
		line-height: 41rpx;
		font-family: "PingFang SC";
		font-weight: 400;
		font-size: 24rpx;
		color: #000;
		margin-left:40rpx;
	}
	.btnd-m{
		width: 256rpx;
		height: 41rpx;
		border-radius: 20.5rpx;
		background: #fff;
		border: 1rpx dashed #707070;
		text-align: center;
		line-height: 41rpx;
		font-family: "PingFang SC";
		font-weight: 400;
		font-size: 24rpx;
		color: #000;
		margin-left:105rpx;
	}
}
</style>
