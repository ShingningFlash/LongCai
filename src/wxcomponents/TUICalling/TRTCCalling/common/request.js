export function request(data, f) {
	// if((data.url != '/mini/ApiConnect/PrinterTransformationPage') && (data.url != '/mini/ApiConnect/PrinterTransformation')){
		// wx.showLoading({
		// 	title: '加载中'
		// })
	// }
	
	data.data.user_id = wx.getStorageSync('user_id') || ''
	// data.data.user_id = 45
	wx.request({
		// url: 'https://tianmei.ydlweb.com' + data.url, // 测试
		url: 'https://xcx.gdqhwy.com' + data.url, // 客户线上域名
		
		method: data.method,
		data: data.data,
		header: data.header,
		success(res) {
			// wx.hideLoading()
			if (res.statusCode === 200) {
				if (res.data) {
					f(res.data)
				}
			}
			if (res.statusCode === 404) {
				wx.showToast({
					title: '请求404,暂无数据',
					icon: 'none'
				})
			}
			if (res.statusCode === 500) {
				wx.showToast({
					title: '请求500,服务端错误',
					icon: 'none'
				})
			}
			if (res.statusCode === 401) {
				wx.showToast({
					title: '已过期，请重新登录',
					icon: 'none'
				})
				wx.clearStorageSync()
			}
		},
		error() {
			wx.showToast({
				title: '请求数据错误',
				icon: 'none'
			})
		}
	})
}
