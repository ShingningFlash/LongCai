Component({
    data: {
        
    },
    properties: {
        
    },
    methods: {
        
    }
});
Page({
	data:{
		viewWidth: 0,
		viewHeight: 0,
		// rpx: m.rpx2px(1),
		paper: "a4",
		paperWH: {
		    a4: [ 210, 297 ],
		    "6in": [ 102, 152 ]
		},
		templateSize: [],
		currentMode: "template",
		workspaceStyle: "",
		isRotate: !1,
		curTemplateIdx: 0,
		frameSize: [],
		imgList: [],
		initData: {
		    originX: 0,
		    originY: 0,
		    list: []
		},
		imgCount: 0,
		imgSize: [],
		imgStyle: [],
		maxCount: 9,
		initStatus: [],
		firstLoad: !0,
		removeId: null,
		exit: !1,
		isShow: !1
	},
	onLoad() {
		
	}
})