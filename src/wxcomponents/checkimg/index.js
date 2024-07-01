Component({
    data: {
        popWindow: !1,
        showCamera: !0,
        showAlbum: !0,
        showMessageFile: !0,
        original: !0,
        compressed: !0,
        chooseImgNum: 9,
        selType: 0
    },
    properties: {
        showPop: {
            type: Boolean,
            value: !1,
            observer: function(e) {
                console.log("newval=", e), this.setData({
                    popWindow: e
                });
            }
        },
        camera: {
            type: Boolean,
            value: !0,
            observer: function(e) {
                this.setData({
                    showCamera: e
                });
            }
        },
        album: {
            type: Boolean,
            value: !0,
            observer: function(e) {
                this.setData({
                    showAlbum: e
                });
            }
        },
        original: {
            type: Boolean,
            value: !0,
            observer: function(e) {
                this.setData({
                    original: e
                });
            }
        },
        compressed: {
            type: Boolean,
            value: !0,
            observer: function(e) {
                this.setData({
                    compressed: e
                });
            }
        },
        messageFile: {
            type: Boolean,
            value: !0,
            observer: function(e) {
                console.log("messageFile=", e), this.setData({
                    showMessageFile: e
                });
            }
        },
        imgNum: {
            type: Number,
            value: 9,
            observer: function(e) {
                this.setData({
                    chooseImgNum: e
                });
            }
        },
        selectType: {
            type: Number,
            value: 0,
            observer: function(e) {
                this.setData({
                    selType: e
                });
            }
        }
    },
    methods: {
        chooseImg: function(e) {
            var o = e.currentTarget.dataset.id;
            console.log(o), this.closePopWindow();
            var s = {}, t = this;
            s.choosePath = o, "chooseMessageFile" == o ? wx.chooseMessageFile({
                count: this.data.chooseImgNum,
                type: "image",
                success: function(e) {
                    "chooseMessageFile:ok" == e.errMsg ? (s.tempFiles = e.tempFiles, t.triggerEvent("chooseImg", s)) : wx.showToast({
                        title: "选择文件失败，请重试",
                        icon: "none"
                    });
                }
            }) : "camera" == o ? wx.chooseImage({
                count: 1,
                sizeType: [ "original" ],
                sourceType: [ "camera" ],
                success: function(e) {
                    s.tempFiles = e.tempFiles, t.triggerEvent("chooseImg", s);
                }
            }) : "album" == o ? wx.chooseImage({
                count: this.data.chooseImgNum,
                sizeType: [ "original" ],
                sourceType: [ "album" ],
                success: function(e) {
                    s.tempFiles = e.tempFiles, t.triggerEvent("chooseImg", s);
                }
            }) : "chooseMessageImageFileToComputer" == o ? wx.chooseMessageFile({
                count: this.data.chooseImgNum,
                type: "image",
                success: function(e) {
                    "chooseMessageFile:ok" == e.errMsg ? (s.tempFiles = e.tempFiles, t.triggerEvent("chooseImg", s)) : wx.showToast({
                        title: "选择文件失败，请重试",
                        icon: "none"
                    });
                }
            }) : "chooseMessageFileToComputer" == o ? wx.chooseMessageFile({
                count: this.data.chooseImgNum,
                type: "file",
                extension: [ "doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "jpg", "jpeg", "png", "DOC", "DOCX", "XLS", "XLSX", "PPT", "PPTX", "PDF", "JPG", "JPEG", "PNG", "rar", "RAR", "zip", "ZIP", "dwg", "DWG", "ai", "AI", "cdr", "CDR", "psd", "PSD", "caj", "CAJ" ],
                success: function(e) {
                    "chooseMessageFile:ok" == e.errMsg ? (s.tempFiles = e.tempFiles, t.triggerEvent("chooseImg", s)) : wx.showToast({
                        title: "选择文件失败，请重试",
                        icon: "none"
                    });
                }
            }) : "chooseBaidu" == o && t.triggerEvent("chooseImg", 1);
        },
        closePopWindow: function() {
            var e = getCurrentPages();
            e[e.length - 1].setData({
                popWindow: !1
            });
        }
    }
});