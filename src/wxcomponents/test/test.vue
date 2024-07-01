<template>
<uni-shadow-root class="test-test"><view class="mode-switch">
    <view @click="onModeSwitch" :class="'mode '+(currentMode=='template'?'active':'')" data-mode="template">模版排列</view>
    <view @click="onModeSwitch" :class="'mode '+(currentMode=='freedom'?'active':'')" data-mode="freedom">自由排列</view>
</view>
<view class="hint">
    <image src="/static/img/info.svg"></image>
    <text class="text" v-if="currentMode=='template'">可以点击图片进入详情，调整图片大小和角度</text>
    <view class="text" v-else>
        可以点击 “
        <van-icon class="rotate" name="replay"></van-icon>
        ” 调整图片大小和角度
    </view>
</view>
<view class="workspace" :style="'height:'+(workspaceHeight)+'px'">
    <view class="paper" :style="'width:'+(viewWidth)+'px; height:'+(viewHeight)+'px;'">
        <block v-if="currentMode=='template'">
            <view v-for="(item,index) in (templateSize[curTemplateIdx].style)" :key="item.index" @click="_$self[(imgList[index]?'onImageAdjust':'')||'_$noop']($event)" class="frame" :data-index="index" :id="'frame-'+(index)" :style="isRotate?templateSize[curTemplateIdx].styleRotate[index]:item">
                <image class="template-img" :src="imgList[index]" :style="imgStyle[index]" v-if="imgList[index]"></image>
                <view @click="onAddImg" class="addBox" v-else></view>
                <van-icon @click.native.stop.prevent="onRemoveImg" class="close" :data-index="index" name="cross" v-if="imgList[index]"></van-icon>
            </view>
        </block>
        <view @touchend.stop.prevent="_$self[(move.onTouchEnd)||'_$noop']($event)" @touchmove.stop.prevent="_$self[(move.onTouchMove)||'_$noop']($event)" @touchstart.stop.prevent="_$self[(move.onTouchStart)||'_$noop']($event)" :change:prop="move.onInitData" id="img-list-container" :prop="initData" v-else>
            <image v-for="(item,index) in (initData.list)" :key="item.index" class="freedom-img" :id="'freedom-img-'+(item.index)" :src="item.img" :style="'width:'+(item.imgW)+'px; height:'+(item.imgH)+'px;'">
                <van-icon @touchend.native.stop.prevent="_$self[(move.onHandleTouchEnd)||'_$noop']($event)" @touchmove.native.stop.prevent="_$self[(move.onHandleTouchMove)||'_$noop']($event)" @touchstart.native.stop.prevent="_$self[(move.onHandleTouchStart)||'_$noop']($event)" class="rotate" :id="'handle-'+(item.index)" name="replay"></van-icon>
                <van-icon @touchstart.native.stop.prevent="onRemoveImg" class="close" :data-index="index" :hidden="(!item.img)" :id="'close-'+(item.index)" name="cross"></van-icon>
                <view class="img-background" :id="'img-background-'+(item.index)" v-if="item.bgPadding"></view>
            </image>
        </view>
    </view>
</view>
<view class="template-list" v-if="currentMode=='template'">
    <scroll-view enableFlex scrollX class="template-scroll" scrollY="false">
        <view class="container">
            <view v-for="(template,tempIdx) in (templateSize)" :key="template.tempIdx" class="template" v-if="template.pos.length===imgList.length">
                <view @click="onTemplateClick" :class="'paper-thumb '+(!isRotate&&curTemplateIdx==tempIdx?'active':'')" :data-index="tempIdx" :data-is-rotate="false" :style="'width: '+(template.width)+'rpx; height:'+(template.height)+'rpx'">
                    <view v-for="(item,styleIdx) in (template.style)" :key="item.styleIdx" class="box" :style="item"></view>
                </view>
                <image class="checkIcon" :hidden="(!(!isRotate&&curTemplateIdx==tempIdx))" mode="aspectFit" src="/static/img/cameraScanner/check.png"></image>
            </view>
            <view v-for="(template,tempIdx) in (templateSize)" :key="template.tempIdx" class="template" v-if="template.posRotate.length===imgList.length">
                <view @click="onTemplateClick" :class="'paper-thumb '+(isRotate&&curTemplateIdx==tempIdx?'active':'')" :data-index="tempIdx" :data-is-rotate="true" :style="'width: '+(template.height)+'rpx; height:'+(template.width)+'rpx'">
                    <view v-for="(item,styleIdx) in (template.styleRotate)" :key="item.styleIdx" class="box" :style="item"></view>
                    <image class="checkIcon" :hidden="(!(isRotate&&curTemplateIdx===tempIdx))" mode="aspectFit" src="/static/img/cameraScanner/check.png"></image>
                </view>
            </view>
        </view>
    </scroll-view>
</view>
<view class="btnGroup">
    <button @click="onAddMultiImg" class="btnPlain" hoverClass="btnHover" v-if="imgCount<9">上传图片</button>
    <button disabled class="btnPlain" v-else>最多9张图片</button>
    <button @click="onNext" class="btnPrimary" hoverClass="btnHover">下一步</button>
</view>
<pic-select-popup @afterread="onAfterRead" @cancel="onCancel" :count="maxCount" :isOriginal="false" :show="isShow"></pic-select-popup></uni-shadow-root>
</template>

<script>

global['__wxVueOptions'] = {components:{}}

global['__wxRoute'] = 'test/test'
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
export default global['__wxComponents']['test/test']
</script>
<style platform="mp-weixin">
page {
    box-sizing: border-box;
    padding-left: 5%;
    padding-right: 5%;
    padding-top: 30rpx;
}

.mode-switch {
    background: #f3f3f3;
    border-radius: 12rpx;
}

.mode-switch,.mode-switch .mode {
    display: flex;
}

.mode-switch .mode {
    align-items: center;
    border-radius: 8rpx;
    color: #666;
    font-size: 32rpx;
    height: 68rpx;
    justify-content: center;
    margin: 8rpx;
    width: 330rpx;
}

.mode-switch .mode.active {
    background-color: #fff;
    color: #333;
    font-weight: 700;
}

.hint {
    align-items: center;
    background: #f0faff;
    border-radius: 13rpx;
    color: #333;
    display: flex;
    font-size: 26rpx;
    margin-top: 28rpx;
    padding: 18rpx 26rpx;
}

.hint image {
    height: 28rpx;
    width: 28rpx;
}

.hint .text {
    align-items: center;
    display: flex;
    font-size: 25rpx;
    margin-left: 15rpx;
}

.hint .rotate {
    color: #333;
    height: 44rpx;
    width: 44rpx;
}

.workspace {
    align-items: center;
    background: #d7d7d7;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    margin-top: 28rpx;
    padding-bottom: 32rpx;
    padding-top: 32rpx;
}

.workspace .paper {
    background-color: #fff;
    box-sizing: border-box;
    padding: 16rpx;
    position: relative;
}

.workspace .paper .frame {
    background-color: #f4f2f3;
    box-sizing: border-box;
    overflow: hidden;
    position: absolute;
}

.workspace .template-img {
    box-sizing: border-box;
    position: absolute;
    transform-origin: top left;
}

.workspace .addBox {
    align-items: center;
    background: #f3f3f3;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    width: 100%;
}

.workspace .addBox van-icon {
    color: #24a2fd;
    font-size: 60rpx;
}

.workspace .addBox text {
    color: #333;
    font-size: 28rpx;
    margin-top: 27rpx;
}

.workspace .close {
    background: #202020;
    border-radius: 0 0 0 7rpx;
    color: #fff;
    height: 44rpx;
    opacity: .6;
    position: absolute;
    right: 0;
    top: 0;
    transform-origin: top right;
    width: 44rpx;
}

#img-list-container {
    height: 100%;
    overflow: hidden;
    position: relative;
}

#img-list-container .freedom-img {
    display: block;
    overflow: visible;
    position: absolute;
    transform-origin: top left;
}

#img-list-container .freedom-img .rotate {
    background: #202020;
    border-radius: 50%;
    bottom: -22rpx;
    color: #fff;
    height: 44rpx;
    opacity: .6;
    position: absolute;
    right: -22rpx;
    width: 44rpx;
}

#img-list-container .img-background {
    background-color: #fff;
    position: absolute;
    transform-origin: top left;
    z-index: -1;
}

.template-list {
    margin-top: 60rpx;
}

.template-list>scroll-view .container {
    box-sizing: border-box;
    display: flex;
    padding-bottom: 20rpx;
    width: fit-content;
}

.template-list>scroll-view .container .template {
    align-items: center;
    border: 1px solid transparent;
    display: flex;
    flex-shrink: 0;
    height: 140rpx;
    justify-content: center;
    margin-right: 26rpx;
    position: relative;
}

.template-list>scroll-view .container .template .paper-thumb {
    border: 1px solid #f3f3f3;
    position: relative;
}

.template-list>scroll-view .container .template .paper-thumb.active {
    border: 1px solid #24a2fd;
}

.template-list>scroll-view .container .template .paper-thumb .box {
    background: #f3f3f3;
    position: absolute;
}

.template-list>scroll-view .container .template .checkIcon {
    bottom: 0;
    height: 33rpx;
    position: absolute;
    right: 0;
    width: 33rpx;
}

.btnGroup {
    flex-direction: row;
    margin-top: 10rpx;
    padding-bottom: 40rpx;
}

.btnGroup>button:first-child {
    margin-right: 16rpx;
}

.btnGroup>button:last-child {
    margin-left: 16rpx;
}

.btnGroup>button[disabled] {
    border: 1px solid #d7d7d7;
}
</style>