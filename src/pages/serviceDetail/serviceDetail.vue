<template>
	<view>
		<view class="logisticsMessage">


			<view class="logisticsBox">
				<!-- ==================== -->
				<!-- <view :class="index == 0?'isShow':'logisticsView'" v-for="(item,index) in expressData.list"
				:key='index'>
				<view class="logisticsText">{{item.node_desc}}</view>
				<view class="logisticsTime">{{item.node_time}}</view>
			</view> -->
				<view :class="true?'isShow':'logisticsView'">
					<view class="logistics-tips">
						<text>退款成功</text>
					</view>
					<view class="logisticsText">您的服务单737615000审核已通过，请您及时填写退货快递单号</view>
					<view class="logisticsTime">2021-05-31 17:49:00</view>
				</view>
				<!-- ================= -->
				<view :class="false?'isShow':'logisticsView'">
					<view class="logistics-tips">
						<text>商家已收货</text>
					</view>
					<view class="logisticsText">您的服务单737615000审核已通过，请您及时填写退货快递单号</view>
					<view class="logisticsTime">2021-05-30 17:49:00</view>
				</view>
				<view :class="false?'isShow':'logisticsView'">
					<view class="logistics-tips">
						<text>等待审核</text>
					</view>
					<view class="logisticsText">您的服务订单申请成功，等待商家审核</view>
					<view class="logisticsTime">2020-01-20 19:10:44</view>
				</view>
				<!-- ***************** -->
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

		}
	}
</script>

<style lang="scss">
	.logisticsMessage {
		padding: 0 56rpx;

		.logisticsBox {
			margin-top: 30rpx;

			.logisticsView {
				.logisticsTime {
					color: #a7a7a7;
					font-size: 22rpx;
				}

				.logisticsText {
					color: #3b3b3b;
					font-size: 26rpx;
				}
			}

			.logisticsView,
			.isShow {
				padding: 0 60rpx 70rpx;
				position: relative;

				.logistics-tips {
					font-size: 28rpx;
					font-weight: 700;
					color: #1e1e1e;
					padding-bottom: 16rpx;
				}

				.logisticsTime {
					color: #7e7e7e;
					font-weight: 400;
					font-size: 20rpx;
				}

				.logisticsText {
					padding-bottom: 10rpx;
					color: #1e1e1e;
					font-weight: 400;
					font-size: 24rpx;
				}
			}

			.logisticsView::after {
				content: '';
				position: absolute;
				left: -5rpx;
				top: 13rpx;
				width: 15rpx;
				height: 15rpx;
				border-radius: 50%;
				background-color: #9D9D9D;
			}

			.isShow::after {
				content: '';
				position: absolute;
				left: -10rpx;
				top: 9rpx;
				width: 22rpx;
				height: 22rpx;
				border-radius: 50%;
				background-color: #667D8B;
			}
		}

		.btmbox {
			display: flex;
			justify-content: space-between;
			font-size: 26rpx;
			color: #787878;
		}
	}
</style>
