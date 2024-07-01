<template>
	<view class="siteDetails">
		<view class="siteDts">
			<view class="siteDtsBox">
				<view class="left">收货人姓名：</view>
				<view class="right">
					<input type="text" placeholder="请输入收货人姓名" v-model.trim="consignee">
				</view>
			</view>
			<view class="siteDtsBox">
				<view class="left">手机号码</view>
				<view class="right">
					<input type="number" placeholder="请输入手机号码" v-model.trim="mobile" maxlength="11">
				</view>
			</view>

			<view class="siteDtsBox" @click="bottomshow = true">
				<view class="left">省市区</view>
				<view class="right">
					<input type="text" placeholder="请选择省/市/区" placeholder-class="ipt" disabled v-model="name" />
				</view>
			</view>

			<view class="siteDtsBox">
				<view class="left">地址</view>
				<view class="right">
					<input type="text" placeholder="请输入地址" v-model.trim="address">
				</view>
			</view>
		</view>

		<!-- 城市选择器 -->
		<view class="cu-modal" v-if="bottomshow">
			<view class="cu-dialog">
				<view class="cu-title">
					<view @click="bottomshow = false">取消</view>
					<view @click="determine">确定</view>
				</view>
				<picker-view class="picker-view" indicator-style="height: 50px;" @change="bindChange">
					<picker-view-column>
						<view class="item" v-for="(item,index) in region[0]" :key="index">{{ item.name}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item,index) in region[1]" :key="index">{{ item.name }}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item,index) in region[2]" :key="index">{{ item.name }}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
		<view class="btn" @click="AddressDo">确认并保存</view>
	</view>
</template>
<script>
	import {
		UserRegionList, // 获取 省市区列表 接口
		UserAddressDo, // 新增、修改地址 接口
		UserAddressInfo // 获取 地址详情 接口
	} from '@/api/index.js'
	let that, app = getApp()
	export default {
		data() {
			return {
				bottomshow: false, // 城市选择器弹出框
				region: [], // 存储接口返回的当前选中省份城市数据 数组第一个是省份  第二是市  第三是区
				value: [0, 0, 0], // 暂时存储自己选中的省市区的id
				province: -1, // 保存省份id
				city: -1, // 保存市id
				district: -1, // 保存区id
				address: '', // 详细地址
				mobile: '', // 电话号码
				consignee: '', // 姓名
				name: '', // 省市区合起来的字符串
				address_id: 0, // 修改的地址id
				is_default: 0, // 是否是默认地址
				Default: false, // 是否设置为默认的按钮

			}
		},
		onLoad(e) {
			that = this
			this.userRegionList(0)
			if (e.address_id != undefined) {
				this.address_id = e.address_id
				this.UserAddressInfo(e.address_id)
			} else {
				this.UserAddressInfo(0)
			}
		},
		methods: {
			// 一开始进来这个页面，（新增地址不管）如果是修改地址，就动态获取数值绑定到输入框 
			UserAddressInfo(id) {
				UserAddressInfo({
					address_id: id
				}, function(res) {
					// console.log("新增地址或者修改地址返回的数据", res)
					if (res.result != '') {
						that.consignee = res.result.consignee
						that.mobile = res.result.mobile
						that.address = res.result.address
						
						that.is_default = res.result.is_default
						that.province = res.result.province // 修改地址原有的省份id
						that.city = res.result.city // 修改地址原有的市id
						that.district = res.result.district // 修改地址原有的区id
					}
					if (res.province != '' && res.city != '' && res.district != '') {
						var addressName = ""
						res.province.forEach((item) => {
							if (item.id == that.province) {
								addressName += item.name
								return
							}
						})
						res.city.forEach((item) => {
							if (item.id == that.city) {
								addressName += '-' + item.name + '-'
								return
							}
						})
						res.district.forEach((item) => {
							if (item.id == that.district) {
								addressName += item.name
								return
							}
						})
						that.name = addressName
					}
				})
			},
			//获取省市区数据
			userRegionList(id) {
				UserRegionList({
					region_id: id
				}, function(res) {
					that.region.push(res.result)
					if (that.region.length < 3) {
						that.userRegionList(res.result[0].id)
					}
				})
				// console.log("省市区数据", that.region)
			},

			// 滑动选择省市区的动态事件
			bindChange(e) {
				this.value = e.detail.value
				if (this.value[0] > 0) {
					UserRegionList({
						region_id: this.region[0][e.detail.value[0]].id
					}, function(res) {
						that.region[1] = res.result
						that.$forceUpdate();
						UserRegionList({
							region_id: that.region[1][e.detail.value[1]].id
						}, function(res) {
							that.region[2] = res.result
							that.$forceUpdate();
						})
					})
				}
				if (this.value[1] > 0) {
					UserRegionList({
						region_id: that.region[1][e.detail.value[1]].id
					}, function(res) {
						that.region[2] = res.result
						that.$forceUpdate();
					})
				}
			},
			// 城市选择器的确定事件
			determine() {
				this.province = this.region[0][this.value[0]].id
				this.city = this.region[1][this.value[1]].id
				this.district = this.region[2][this.value[2]].id
				this.name = this.region[0][this.value[0]].name + '-' + this.region[1][this.value[1]].name + '-' + this
					.region[2][this.value[2]].name
				this.bottomshow = false
			},
			// 新增或修改地址的提交事件
			AddressDo() {
				if (this.consignee == '') {
					return uni.showToast({
						title: '请输入联系人姓名',
						icon: 'none'
					})
				}
				if (!(/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.mobile))) {
					return uni.showToast({
						title: '请输入正确的手机号码',
						icon: 'none'
					})
				}
				if (this.province == -1 || this.city == -1 || this.district == -1) {
					return uni.showToast({
						title: '请选择完整的省市区',
						icon: 'none',
					})
				}
				if (this.address == '') {
					return uni.showToast({
						title: '请输入详细地址',
						icon: 'none',
					})
				}
				let data = {
					address_id: this.address_id,
					consignee: this.consignee,
					mobile: this.mobile,
					province: this.province,
					city: this.city,
					district: this.district,
					address: this.address,
					is_default: this.is_default
				}
				// console.log("新增地址需要的参数", data)
				UserAddressDo(data, function(res) {
					uni.showToast({
						title: res.msg,
						icon: 'none',
					})
					// console.log("提交地址事件", res)
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 500)
				})
			},
		}
	}
</script>
<style lang="scss">
	.cu-modal {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		padding-bottom: 30rpx;
		z-index: 99;
	}

	.cu-dialog {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
	}

	.picker-view {
		background-color: #fff;
	}

	picker-view-column {
		height: 400rpx;
		text-align: center;
	}

	.cu-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		background-color: #667D8B;
		color: #fff;
		font-weight: bold;
		font-size: 35rpx;
		padding: 0rpx 35rpx;
	}

	.siteDetails {
		padding: 35rpx 30rpx;

		.siteDts {
			background-color: #fff;
			padding: 30rpx;
			border-radius: 10rpx;

			.siteDtsBox {
				display: flex;
				align-items: center;
				border-top: 1px solid #E2E2E2;
				padding-top: 30rpx;
				padding-bottom: 35rpx;

				.left {
					font-size: 25rpx;
				}

				.right {
					flex: 1;
					margin-left: 30rpx;

					input {
						font-size: 25rpx;
					}
				}
			}

			.siteDtsBox:nth-child(1) {
				padding-top: 0;
				border-top: 0;
			}

			.siteDtsBox:last-child {
				padding-bottom: 0rpx;
			}
		}

		.btn {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #667D8B;
			border-radius: 50rpx;
			color: #fff;
			padding: 25rpx 0;
			margin: 50rpx 30rpx;
			text-align: center;
		}

		.btn:active {
			background-color: #7691a1;
		}
	}

	page {
		background-color: #EEEEEE;
	}
</style>
