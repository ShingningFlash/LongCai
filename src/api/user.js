import {
	request
} from '@/request/request.js' // 引入请求文件

// 获取 openid 接口
export function MiniCodeLogin(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/MiniCodeLogin',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
//获取 用户手机号 接口
export function UserGetMobile(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getUserMobile',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		return f(res)
	})
}
// 用户 注册登录 接口
export function UserLogin(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/login',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
//获取 个人资料 接口
export function GetUserData(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getUserData',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
//获取 充值额度 接口
export function GetChargeQuota(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getChargeQuota',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
//获取 生成充值余额订单 接口
export function RechargeBalance(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/rechargeBalance',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
//获取 支付余额订单 接口
export function PayRechargeOrder(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/payRechargeOrder',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
//获取 消费记录 接口
export function GetMoneyLog(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getMoneyLog',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
//获取 我的收藏 接口
export function GetCollect(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getCollect',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 分销中心 接口
export function DistributeCenter(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/distributeCenter',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 分销佣金明细 接口
export function GetDistributeLog(getData, f) {
	let data = {
		url: '/mini/ApiConnect/getDistributeLog',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 分销订单 接口
export function GetDistributeOrder(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getDistributeOrder',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 我的团队 接口
export function GetMineTeam(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getMineTeam',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 推广二维码 接口
// export function getPoster(getData, f) {
// 	let data = {
// 		url: '/Mini/ApiConnect/getPoster',
// 		data: getData,
// 		method: 'POST'
// 	}
// 	request(data, function(res) {
// 		f(res)
// 	})
// }
// 推广二维码2 接口
export function getShareCode(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getShareCode',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 申请提现 接口
export function WithdrawApply(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/withdrawApply',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 最低提现金额 接口
export function WithdrawalLimit(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/WithdrawalLimit',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 修改用户信息的提交  接口
export function SaveUserData(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/saveUserData',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}
// 获取即时通信的用户id和用户密钥  接口
export function GetTimWebConfig(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/getTimWebConfig',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

// 提交通话记录  接口
export function CallLog(getData, f) {
	let data = {
		url: '/Mini/ApiConnect/CallLog',
		data: getData,
		method: 'POST'
	}
	request(data, function(res) {
		f(res)
	})
}

