<template>
<uni-shadow-root class="checkimg-index"><view class="component-choosePhoto" v-if="popWindow">
    <view @click.stop.prevent="closePopWindow" class="component-choosePhoto-container">
        <view class="component-choosePhoto-content br20" v-if="selType==0">
            <view @click="chooseImg" class="component-choosePhotoItem" data-id="chooseMessageFile" v-if="showMessageFile">
                <text class="component-choosePhotoItem-text">微信聊天图片</text>
            </view>
            <view @click="chooseImg" class="component-choosePhotoItem" data-id="camera" v-if="showCamera">
                <text class="component-choosePhotoItem-text">拍照</text>
            </view>
            <view @click="chooseImg" class="component-choosePhotoItem" data-id="album" v-if="showAlbum">
                <text class="component-choosePhotoItem-text">手机相册</text>
            </view>
            <view class="component-choosePhotoItem" style="margin-top:20rpx;">
                <text class="component-choosePhotoItem-text">取消</text>
            </view>
        </view>
        <view class="component-choosePhoto-content br20" v-else>
            <view @click="chooseImg" class="component-choosePhotoItem" data-id="chooseMessageFileToComputer" v-if="showMessageFile">
                <text class="component-choosePhotoItem-text">微信聊天文件</text>
            </view>
            <view @click="chooseImg" class="component-choosePhotoItem" data-id="chooseMessageImageFileToComputer" v-if="showMessageFile">
                <text class="component-choosePhotoItem-text">微信聊天图片</text>
            </view>
            <view @click="chooseImg" class="component-choosePhotoItem" data-id="chooseBaidu">
                <text class="component-choosePhotoItem-text">百度网盘文件</text>
            </view>
            <view @click="chooseImg" class="component-choosePhotoItem" data-id="album" v-if="showAlbum">
                <text class="component-choosePhotoItem-text">手机本地相册</text>
            </view>
            <view class="component-choosePhotoItem" style="margin-top:20rpx;">
                <text class="component-choosePhotoItem-text">取消</text>
            </view>
        </view>
    </view>
</view></uni-shadow-root>
</template>

<script>

global['__wxVueOptions'] = {components:{}}

global['__wxRoute'] = 'checkimg/index'
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
export default global['__wxComponents']['checkimg/index']
</script>
<style platform="mp-weixin">
.component-choosePhoto {
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 99999;
}

.component-choosePhoto-container {
    align-items: flex-end;
    animation: alp .5s ease;
    background: rgba(0,0,0,.5);
    display: flex;
    height: 100%;
    justify-content: center;
    width: 100%;
}

.component-choosePhoto-content {
    animation: chooseBottom .3s ease;
    background: #efeff5;
    position: relative;
    width: 100%;
}

.component-choosePhotoItem {
    align-items: center;
    background: #fff;
    border-bottom: 1rpx solid #efeff5;
    display: flex;
    height: 90rpx;
    justify-content: center;
    width: 100%;
}

.component-choosePhotoItem-text {
    color: #333;
    font-size: 34rpx;
}

.br20,.component-choosePhotoItem:first-child {
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
}
</style>