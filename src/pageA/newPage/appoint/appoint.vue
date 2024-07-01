<template>
	<view>
		<view class="content">
			<view v-for="(itemdd,indexdd) in img_list" :key="indexdd" class="inputd"
				:class="{'active':localList.jpPageRange.indexOf(indexdd+1) != -1}"
				>
				<image style="width: 230rpx;height: 340rpx;" :src="itemdd" mode="aspectFit" @click="pre(indexdd)"></image>
				<view class="rad">
					<radio-group @change="chang">
						<label>
							<radio :value="indexdd+1" :checked="localList.jpPageRange.indexOf(indexdd+1) != -1" @click="chooseNumber(index,indexdd+1)" />
						</label>
					</radio-group>
				</view>
			</view>
		</view>
		<button class="btn1" @click="confirm">确认</button>
	</view>
</template>

<script>
	import {
		setPrinterJob,
		getPrinterStatus
	} from '@/api/index.js'
	export default {
		data() {
			return {
				localList: {

				},
				img_list: [
				]
			}
		},
		onLoad(e) {
			if (e.data) {
				this.localList = JSON.parse(e.data)
				console.log(this.localList, e.data, JSON.parse(e.data));
				
				this.print(0)
			}
			if(e.index){
				uni.setStorageSync('ChooseIndex',e.index)
			}
		},
		methods: {
			confirm(){
				uni.setStorageSync('saveTheChoose',this.localList)
				uni.navigateBack({
					delta:1
				})
			},
			chang(e){
				
			},
			pre(index){
				uni.previewImage({
					urls:this.img_list,
					current:index
				})
			},
			chooseNumber(index, index1) {

				if (this.localList.current == 1) {

					if (this.localList.jpPageRange.indexOf(index1) !== -1) {
						this.localList.jpPageRange.splice(this.localList.jpPageRange.indexOf(index1), 1); //取消
					} else {
						this.localList.jpPageRange.push(index1); //选中添加到数组里
					}
				}



			},
			print(index) {

				let info = uni.getStorageSync('info')
				let data = {}
				data.device_port = info.port
				data.drivce_name = info.drivce_name
				data.dmPaperSize = this.localList.dmPaperSize
				data.dmCopies = this.localList.dmCopies
				data.dmColor = this.localList.dmColor
				data.dmDuplex = this.localList.dmDuplex
				data.isPreview = 1 // 0打印 1预览
				data.jobFile = this.localList.jobFile
				if(this.localList.task_id){
					if(this.localList.changP == true){
						setPrinterJob(data, (res) => {
							if (res.status == 1) {
								this.localList.task_id = res.result.task_id
								this.task_id = res.result.task_id
								this.getPrinterStatusd(res.result.task_id)
							}
						})
					}
					else{
						this.getPrinterStatusd(this.localList.task_id)
					}
					
				}
				else{
					setPrinterJob(data, (res) => {
						if (res.status == 1) {
							this.localList.task_id = res.result.task_id
							this.task_id = res.result.task_id
							this.getPrinterStatusd(res.result.task_id)
						}
					})
				}
				

			},
			getPrinterStatusd(task_id) {
				
				let info = uni.getStorageSync('info')
				let data = {}
				data.device_port = info.port
				data.task_id = task_id
				getPrinterStatus(data, (res) => {
					if (res.result.task_state == 'SUCCESS') {
						console.log(res);
						uni.hideLoading()
						let result = res.result.task_result
						if(result.data){
							this.img_list = result.data.img_list
						}
						else{
							uni.showModal({
								title:'提示',
								content:result.msg,
								showCancel:false,
								success: (res) => {
									
								}
							})
						}
						


					} else if (res.result.task_state == 'FAILURE') {
						uni.hideLoading()
						uni.showToast({
							title: res.result.task_state,
							icon: 'none'
						})


					} else {
						uni.showLoading({
							title: res.result.task_state,
							mask: true
						})
						setTimeout(() => {
							this.getPrinterStatusd(task_id)
						}, 10000)


					}
				})

			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 690rpx;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		margin-top: 20rpx;
		padding-bottom: 55rpx;
	}

	.inputd {
		// width: 204rpx;
		height: 350rpx;
		border: 1rpx solid #ccc;
		position: relative;
	}

	.active {
		border: 1rpx solid #1C5FAB;
		color: #fff;
	}
	
	.rad{
		position: absolute;
		bottom:0;
		right:0;
	}
	.btn1{
		width: 690rpx;
		height: 88.06rpx;
		border-radius: 44.03rpx;
		background: linear-gradient(0.11deg, #185fab 0%, #38b8ef 100%);
		line-height: 88.06rpx;
		text-align: center;
		font-family: "PingFang SC Heavy";
		font-weight: 900;
		font-size: 30rpx;
		color: #fff;
		position: fixed;
		bottom:30rpx;
		left:50%;
		transform: translateX(-50%);
	}
</style>