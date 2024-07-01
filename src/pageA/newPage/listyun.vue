<template>
	<view>
		<view class="list flex m-between s-center" v-for="(item,index) in PrinterList" :key="index" @click="choose(index)">
			<view class="">
				<view class="title">
					{{item.printer_name}}
				</view>
				<view class="">
					<text v-if="item.isPrinter == 1">打印机可用</text>
					<text v-if="item.isPrinter == 0">打印机不在线，打印机卡纸中，打印机打印中</text>
				</view>
			</view>
			<view class="">
				距离{{item.distance}}>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCloudBoxLists
	} from '@/api/index.js'
	export default {
		data() {
			return {
				PrinterList:[],
				latitude:'',
				longitude:''
			}
		},
		onLoad(){
			// this.getPrinterListsd()
			this.getLocation()
		},
		methods: {
			getLocation(){
				var that = this
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					isHighAccuracy:true,
					// 用户允许获取定位
					success: function(res) {
						console.log(res, '经纬度===>')
						if (res.errMsg == "getLocation:ok") {
							that.latitude = res.latitude
							that.longitude = res.longitude
							that.getPrinterListsd()
						}
					},
					// 用户拒绝获取定位后 再次点击触发
					fail: function(res) {
						console.log(res)
						if (res.errMsg == "getLocation:fail auth deny") {
							uni.showModal({
								content: '检测到您没打开获取信息功能权限，是否去设置打开？',
								confirmText: "确认",
								cancelText: '取消',
								success: (res) => {
									if (res.confirm) {
										uni.openSetting({
											success: (res) => {
												console.log('确定');
											}
										})
									} else {
										console.log('取消');
										return false;
									}
								}
							})
						}
					},
					complete: () => {
						uni.hideLoading()
					}
				});
			},
			choose(index){
				uni.setStorageSync('yun',this.PrinterList[index])
				uni.navigateTo({
					url:'/pageA/newPage/list?id='+this.PrinterList[index].id
				})
			},
			getPrinterListsd(){
				
				getCloudBoxLists({latitude:this.latitude,longitude:this.longitude}, (res) => {
					if (res.status == 1) {
						this.PrinterList = res.result.rows
						
					}
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
<style lang="scss" scoped>
.list{
		width: 690rpx;
		
		padding: 30rpx 20rpx;
		box-sizing: border-box;
		background-color: #fff;
		margin:0 auto;
		margin-top: 20rpx;
		border-radius: 12rpx;
		
	}
</style>
