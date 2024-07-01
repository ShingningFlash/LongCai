import {
	request
} from '@/request/request.js' // 引入请求文件

// 在线下单获取下单数据 接口
export function GoodsBuyNow(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/GoodsBuyNow',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 加入购物车 接口
export function AjaxJionCart(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/AjaxJionCart',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 购物车列表 接口
export function CartAllList(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/CartAllList',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 购物车选中以及数量加减 接口
export function CartChangeInfo(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/CartChangeInfo',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 购物车全选、全不选 接口
export function CartChangeAll(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/CartChangeAll',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 删除购物车商品 接口
export function CartDelete(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/CartDelete',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 提交订单 接口
export function CreatOrderInfo(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/CreatOrderInfo',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 购物车结算 接口
export function SettleAccounts(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/SettleAccounts',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 余额支付 接口
export function CreditPayOrder(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/creditPayOrder',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 微信支付 接口
export function MiniPayOrder(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/MiniPayOrder',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 发起微信支付
export function Payment(getData, f) {
	uni.requestPayment({
		provider: 'wxpay',
		timeStamp: getData.timeStamp,
		nonceStr: getData.nonceStr,
		package: getData.package,
		signType: getData.signType,
		paySign: getData.paySign,
		success(res) {
			uni.showToast({
				title: '支付成功',
				icon: 'none'
			})
			f(res)
		},
		fail(res) {
			// uni.showToast({
			// 	title: res.msg,
			// 	icon: 'none'
			// })
			
			uni.navigateBack({
				delta: 1
			})
		}
	})
}
// 订单列表 接口
export function UserOrderList(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/UserOrderList',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 订单详情 接口
export function UserOrderInfo(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/UserOrderInfo',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

// 我的商品评价列表 接口
export function UserCommentList(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/UserCommentList',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

// 退换货订单列表 接口
export function OrderRetundList(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/OrderRetundList',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

// 取消订单 接口
export function AllOrderOut(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/AllOrderOut',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 确认收货 接口
export function UserOrderAffirm(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/UserOrderAffirm',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 订单商品评价提交 接口
export function UserCommentHandle(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/UserCommentHandle',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 商品退换货信息数据 接口
export function OrderGoodsList(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/OrderGoodsList',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 用户评价 接口
export function TrueGoodsComment(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/TrueGoodsComment',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 提交退换货表单 接口
export function HandleOrderRefund(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/HandleOrderRefund',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

// 查询物流 接口
export function GetShippingData(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getShippingData',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 我的评价 接口
export function MyEvaluate(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/myEvaluate',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 售后订单详情 接口
export function RefundOrderInfo(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/refundOrderInfo',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 退换货寄回物流 接口
export function BackExpress(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/backExpress',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 确认换货完成 接口
export function ConfirmChange(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/confirmChange',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

// 上传文件转PDF 接口
export function PrinterTransformation(getData, f) {
	let data = {
		url: '/mini/ApiConnect/PrinterTransformation',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

// 获取文件PDF页数 接口
export function PrinterTransformationPage(getData, f) {
	let data = {
		url: '/mini/ApiConnect/PrinterTransformationPage',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

// 打印金额计算 接口
export function PrinterPrice(getData, f) {
	let data = {
		url: '/mini/ApiConnect/PrinterPrice',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

// 打印下单 接口
export function PrinterOrder(getData, f) {
	let data = {
		url: '/mini/ApiConnect/PrinterOrder',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

// 打印微信支付 接口
export function PrinterPay(getData, f) {
	let data = {
		url: '/mini/ApiConnect/PrinterPay',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

// 打印余额支付 接口
export function PrinterBalancePay(getData, f) {
	let data = {
		url: '/mini/ApiConnect/PrinterBalancePay',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 搜索附近打印机/云盒 接口
export function GetPrinterList(getData, f) {
	let data = {
		url: '/mini/ApiConnect/getPrinterLists',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 自助打印说明 接口
export function getPrinterContent(getData, f) {
	let data = {
		url: '/mini/ApiConnect/getPrinterContent',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 获取打印机外接小程序信息 接口
export function getPrinterOne(getData, f) {
	let data = {
		url: '/mini/ApiConnect/getPrinterOne',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}