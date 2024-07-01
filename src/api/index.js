import {
	request
} from '@/request/request.js' // 引入请求文件

// 获取 首页轮播图 接口
export function GetAdList(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/GetAdList',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

// 获取 首页导航图 接口
export function GetHomeConf(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getHomeConf',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 获取 首页公告 接口
export function GetNoticeList(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getNoticeList',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 公告详情  接口
export function GetArticle(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getArticle',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

// 获取 服务类别 接口
export function GoodscCateList(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/GoodscCateList',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 获取 服务类别下的商品列表 接口
export function CateGoods(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/CateGoods',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 获取 商品详情 接口 
export function GoodsInfo(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/GoodsInfo',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 获取 商品详情规格 接口 
export function GoodSpec(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/Goodspec',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 获取 文件列表 接口
export function GetFileList(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getFileList',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

// 上传图片 接口
export function UploadRefundpic(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/uploadRefundpic',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 上传文件 接口
export function UploadFile(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/upload',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 获取 附近合作商列表 接口
export function GetStoreList(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getStoreList',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 获取 附近合作商详情 接口
export function GetStoreDetail(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getStoreDetail',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 获取 省市区 接口
export function UserRegionList(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/UserRegionList',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 获取 地址列表 接口
export function UserAddressList(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/UserAddressList',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 修改 地址为默认 接口
export function UserAddressDefault(getData, f) {
	let data = {
		url: '/mini/ApiConnect/UserAddressDefault',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 获取 地址详情 接口
export function UserAddressInfo(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/UserAddressInfo',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 新增、修改地址  接口
export function UserAddressDo(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/UserAddressDo',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 删除地址  接口
export function UserAddressDelete(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/UserAddressDelete',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 合作申请  接口
export function Cooperation(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/cooperation',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 商品详情页取消收藏、收藏  接口
export function HandleCollectGoods(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/HandleCollectGoods',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 声明内容  接口
export function GetStatement(getData, f) {
	let data = {
		url: '/mini/ApiConnect/GetStatement',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 轮播图详情  接口
export function GetAdOne(getData, f) {
	let data = {
		url: '/mini/ApiConnect/GetAdOne',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 加盟合作协议  接口
export function GetAgreement(getData, f) {
	let data = {
		url: '/mini/ApiConnect/GetAgreement',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 获取客服图标  接口
export function GetKefuIcon(getData, f) {
	let data = {
		url: '/mini/ApiConnect/GetKefuIcon',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 购物车跳转到上传文件页面替换购物车里面的旧文件提交  接口
export function UpdateCart(getData, f) {
	let data = {
		url: '/mini/ApiConnect/UpdateCart',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 购物车跳转到上传文件页面替换购物车里面的旧文件提交  接口
export function voucherList(getData, f) {
	let data = {
		url: '/mini/ApiConnect/voucherList',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 代用券下单  接口
export function PurchaseVoucher(getData, f) {
	let data = {
		url: '/mini/ApiConnect/purchaseVoucher',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 代用券支付  接口
export function VoucherPay(getData, f) {
	let data = {
		url: '/mini/ApiConnect/VoucherPay',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 我的代用券列表  接口
export function UserVoucher(getData, f) {
	let data = {
		url: '/mini/ApiConnect/userVoucher',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 获取用户的推荐人id
export function isDistributor(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/isDistributor',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

// 获取打印机
export function getPrinterLists(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getPrinterLists',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

// 获取价目表
export function getPrinterConf(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getPrinterConf',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

// 获取页码
export function getPageTotal(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getPageTotal',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 获取状态
export function getPrinterStatus(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getPrinterStatus',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 打印预览
export function setPrinterJob(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/setPrinterJob',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 打印预览6寸

export function setPrinterJob6(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/setPrinterJob6',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}


// a4打印

export function getPrinterOrderInfoA4(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getPrinterOrderInfoA4',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
//  6寸打印

export function getPrinterOrderInfo6(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getPrinterOrderInfo6',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 下单
export function setPrinter(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/setPrinter',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 下单6
export function setPrinter6(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/setPrinter6',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

export function getCloudBoxLists(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getCloudBoxLists',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}


