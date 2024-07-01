export function request(data, f) {
	if((data.url != '/mini/ApiConnect/PrinterTransformationPage') && (data.url != '/mini/ApiConnect/PrinterTransformation')){
		uni.showLoading({
			title: '加载中'
		})
	}
	
	data.data.user_id = uni.getStorageSync('user_id') || ''
	if(uni.getStorageSync('yun')){
		data.data.box_id = uni.getStorageSync('yun').id || ''
	}
	// data.data.user_id = 45
	uni.request({
		// url: 'https://tianmei.ydlweb.com' + data.url, // 测试
		url: 'https://tm.ydlweb.com' + data.url, // 客户线上域名
		
		method: data.method,
		data: data.data,
		header: data.header,
		success(res) {
			uni.hideLoading()
			if (res.statusCode === 200) {
				if (res.data) {
					f(res.data)
				}
			}
			if (res.statusCode === 404) {
				uni.showToast({
					title: '请求404,暂无数据',
					icon: 'none'
				})
			}
			if (res.statusCode === 500) {
				uni.showToast({
					title: '请求500,服务端错误',
					icon: 'none'
				})
			}
			if (res.statusCode === 401) {
				uni.showToast({
					title: '已过期，请重新登录',
					icon: 'none'
				})
				uni.clearStorageSync()
			}
		},
		error() {
			uni.showToast({
				title: '请求数据错误',
				icon: 'none'
			})
		}
	})
}
