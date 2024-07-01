<template>
	<view >
		<view class="" style="padding-bottom: 30rpx;" v-if="type==1">
			<view class="list" v-for="(item,index) in urld" :key="index" >
				<image :src="item" mode="aspectFit" @click="pre(index)"></image>
				<view style="text-align: center;margin-top: 10rpx;">{{index+1}}/{{urld.length}}</view>
			</view>
		</view>
		
		<web-view v-if="type==2" :src="src" @message="getMssage" @onPostMessage="getMssage"></web-view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				urld:uni.getStorageSync('preUrl'),
				type:1,
				result:{},
				src:'https://tm.ydlweb.com/index.html'
			}
		},
		onLoad(e){
			if(e.type){
				this.type=e.type
			}
		},
		methods: {
			getMssage(e) {
				//接收到的消息 e.detail.data 数据格式为数组
				
				console.log('触发');
				let arr =[]
				
				if(uni.getStorageSync('files')){
					arr = uni.getStorageSync('files')
				}
				
				arr.push(JSON.parse(e.detail.data[0].result))
				console.log(arr,"1");
				uni.setStorageSync('files',arr)
				console.log('收到网页发来的消息',JSON.parse(e.detail.data[0].result))
				this.result = e.detail.data[0].result.result
				this.src = ''
				
				uni.navigateTo({
					url:'/pageA/newPage/local'
				})
			},
			pre(index){
				uni.previewImage({
					urls:this.urld,
					current:index
				})
			}
		}
	}
</script>
<style>
	page{
		background-color: #f3f3f3;
	}
</style>
<style scoped lang="scss">
.list{
	width:690rpx;
	height: 800rpx;
	margin:0 auto;
	margin-bottom: 79rpx;
	image{
		width: 100%;
		height: 100%;
	}
	background-color: #fff;
}
</style>
