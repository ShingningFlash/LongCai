<template>
	<view>
		<view class="" style="padding: 0 20rpx;box-sizing: border-box;">
			<rich-text :nodes="content"></rich-text>
		</view>
		
	</view>
</template>

<script>
	
	import {
		getPrinterConf
	} from '@/api/index.js'
	export default {
		data() {
			return {
				content:''
			}
		},
		onLoad() {
			this.get()
		},
		methods: {
			get(){
				getPrinterConf({}, (res) => {
					if (res.status == 1) {
						this.content = res.result.content
					}
				})
			}
		}
	}
</script>

<style>

</style>
