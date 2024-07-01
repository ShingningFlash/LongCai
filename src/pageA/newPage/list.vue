<template>
	<view>
		<view class="list flex m-between s-center" v-for="(item,index) in PrinterList" :key="index" @click="choose(index)">
			<view class="">
				<view class="title">
					{{item.printer_name}}
				</view>
				<view class="">
					<text v-if="item.isPrinter == 1">打印机可用</text>
					<text v-if="item.isPrinter == 0">打印机不在线/打印机卡纸中/打印机打印中</text>
				</view>
			</view>
			<view class="">
				>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getPrinterLists
	} from '@/api/index.js'
	export default {
		data() {
			return {
				PrinterList:[]
			}
		},
		onLoad(e){
			if(e.id){
				this.box_id = e.id
				this.getPrinterListsd()
			}
			
		},
		methods: {
			choose(index){
				// if(this.PrinterList[index].printer_state == 'idle'){
					uni.setStorageSync('info',this.PrinterList[index])
					
					uni.navigateBack({
						delta:2
					})
				// }
				// else if(this.PrinterList[index].printer_state =='printing'){
				// 	uni.showToast({
				// 		title:'当前打印机正在打印中',
				// 		icon:'none',
				// 		duration:2000
				// 	})
				// }
				// else if(this.PrinterList[index].printer_state =='stopped'){
				// 	uni.showToast({
				// 		title:'当前打印机异常',
				// 		icon:'none',
				// 		duration:2000
				// 	})
				// }
				// else if(this.PrinterList[index].printer_state == 'headOpened'){
				// 	uni.showToast({
				// 		title:'盖子已开启',
				// 		icon:'none',
				// 		duration:2000
				// 	})
				// }
				// else if(this.PrinterList[index].printer_state == 'paperJam'){
				// 	uni.showToast({
				// 		title:'卡纸',
				// 		icon:'none',
				// 		duration:2000
				// 	})
				// }
				// else if(this.PrinterList[index].printer_state == 'outOfPaper'){
				// 	uni.setStorageSync('info',this.PrinterList[index])
				// 	uni.navigateBack({
				// 		delta:2
				// 	})
				// 	// uni.showToast({
				// 	// 	title:'缺纸',
				// 	// 	icon:'none',
				// 	// 	duration:2000
				// 	// })
				// }
				// else if(this.PrinterList[index].printer_state == 'outOfRibbon'){
				// 	uni.showToast({
				// 		title:'缺碳带',
				// 		icon:'none',
				// 		duration:2000
				// 	})
				// }
				// else if(this.PrinterList[index].printer_state == 'outOfInk'){
				// 	uni.showToast({
				// 		title:'低墨量/碳粉',
				// 		icon:'none',
				// 		duration:2000
				// 	})
				// }
				// else if(this.PrinterList[index].printer_state == 'pause'){
				// 	uni.showToast({
				// 		title:'打印机暂停',
				// 		icon:'none',
				// 		duration:2000
				// 	})
				// }
				// else {
				// 	uni.showToast({
				// 		title:'当前设备状态不可用',
				// 		icon:'none',
				// 		duration:2000
				// 	})
				// }
				
			},
			getPrinterListsd(){
				let data ={}
				data.box_id = this.box_id
				getPrinterLists(data, (res) => {
					if (res.status == 1) {
						this.PrinterList = res.result
						
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
		padding: 20rpx;
		box-sizing: border-box;
		background-color: #fff;
		margin:0 auto;
		margin-top: 20rpx;
		border-radius: 12rpx;
		
	}
</style>
