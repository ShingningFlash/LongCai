var canvasOrigin = null;
var finger1 = ({});
var finger2 = ({});
var currentId = null;
var singleId = null;
var dataList = [];
var startCenter = ({
  x: 0,
  y: 0,
});
var startRotate = 0;
var startLen = 0;
var handleStart = null;
var usingHandle = false;
var hackFail = 0;

function getDataById(id, instance) {
  instance = undefined === instance ? null : instance;
  if (dataList.length === 0 && instance) {
    hackFail++;
    console.log("FUCK！！！dataList not set", hackFail);
    var hack = hackGetInitData(instance);
    if (!hack) {
      return
    };
    if (hackFail > 5) {
      return
    };
    onInitData(hack, null, instance)
  };
  for (var i = 0; i < dataList.length; i++) {
    var data = dataList[((nt_0 = (i), null == nt_0 ? undefined : 'number' === typeof nt_0 ? nt_0 : "" + nt_0))];
    if (data.id == id) {
      return (data)
    }
  }
};

function clone(obj) {
  return (JSON.parse(JSON.stringify(obj)))
};

function getDataIndex(id) {
  for (var i = 0; i < dataList.length; i++) {
    var data = dataList[((nt_1 = (i), null == nt_1 ? undefined : 'number' === typeof nt_1 ? nt_1 : "" + nt_1))];
    if (data.id == id) {
      return (i)
    }
  };
  return (null)
};

function hasValue(v) {
  return (!(v === undefined || v === null))
};

function isValidImgId(id) {
  for (var i = 0; i < dataList.length; i++) {
    var data = dataList[((nt_2 = (i), null == nt_2 ? undefined : 'number' === typeof nt_2 ? nt_2 : "" + nt_2))];
    if (data.id == id) {
      return (true)
    }
  };
  return (false)
};

function composeMatrixRSP(rotate, scale, dx, dy) {
  return ([
    [scale * Math.cos(rotate), scale * Math.sin(rotate), 0],
    [-scale * Math.sin(rotate), scale * Math.cos(rotate), 0],
    [dx, dy, 1]
  ])
};

function matrixTransform(x, y, matrix) {
  var x2 = x * matrix[(0)][(0)] + y * matrix[(1)][(0)] + matrix[(2)][(0)];
  var y2 = x * matrix[(0)][(1)] + y * matrix[(1)][(1)] + matrix[(2)][(1)];
  return (({
    x: x2,
    y: y2,
  }))
};

function calcRotate(p1, p2) {
  var x = p2.x - p1.x;
  var y = p2.y - p1.y;
  return (Math.atan2(y, x))
};

function calcDistance(p1, p2) {
  var x = p2.x - p1.x;
  var y = p2.y - p1.y;
  return (Math.sqrt(x * x + y * y))
};

function calcCenter(p1, p2) {
  var x = (p2.x + p1.x) / 2;
  var y = (p2.y + p1.y) / 2;
  return ({
    x,
    y
  })
};

function rotatePoint(x, y, angle) {
  return (({
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: y * Math.cos(angle) + x * Math.sin(angle),
  }))
};

function getImgCenter(id) {
  var data = getDataById(id);
  var imgSize = data.imgSize;
  var initPan = data.initPan;
  var initScale = data.initScale;
  var initRotate = data.initRotate;
  var w = (imgSize.width / 2) * initScale;
  var h = (imgSize.height / 2) * initScale;
  var p = rotatePoint(w, h, initRotate);
  return (({
    x: p.x + initPan.x,
    y: p.y + initPan.y,
    imgSize: imgSize,
  }))
};

function arc2deg(arc) {
  return ((180 * arc) / Math.PI)
};

function deg2arc(deg) {
  return ((deg * Math.PI) / 180)
};

function applyCss(id, instance, transform) {
  var data = getDataById(id, instance);
  var component = instance.selectComponent("#" + id);
  if (component) {
    component.setStyle(({
      left: transform.pan.x + "px",
      top: transform.pan.y + "px",
      transform: "rotate(" + arc2deg(transform.rotate) + "deg) scale(" + transform.scale + ")",
      "z-index": data.zindex,
    }))
  } else {
    console.log("NO component", id)
  };
  if (transform.scale !== 1) {
    for (var i = 0; i < data.ctrlNodeIds.length; i++) {
      var tid = data.ctrlNodeIds[((nt_9 = (i), null == nt_9 ? undefined : 'number' === typeof nt_9 ? nt_9 : "" + nt_9))];
      var component = instance.selectComponent("#" + tid);
      if (component) {
        component.setStyle(({
          transform: "scale(" + 1 / transform.scale + ")",
        }))
      }
    }
  };
  if (data.bgId && data.bgPadding) {
    var component = instance.selectComponent("#" + data.bgId);
    if (component) {
      var padding = data.bgPadding * (1 / transform.scale);
      var width = data.imgSize.width + 2 * padding;
      var height = data.imgSize.height + 2 * padding;
      component.setStyle(({
        top: -padding + "px",
        left: -padding + "px",
        width: width + "px",
        height: height + "px",
      }))
    }
  }
};

function doTransform(id, startPos, dx, dy, rotate, scale, initPan, initRotate, initScale, instance) {
  instance = undefined === instance ? null : instance;
  var x = initPan.x - startPos.x;
  var y = initPan.y - startPos.y;
  var tmpFinal = matrixTransform(x, y, composeMatrixRSP(rotate, scale, 0, 0));
  var globalFinal = ({
    x: tmpFinal.x + startPos.x + dx,
    y: tmpFinal.y + startPos.y + dy,
  });
  var transform = ({
    pan: globalFinal,
    rotate: rotate + initRotate,
    scale: scale * initScale,
  });
  if (instance) {
    applyCss(id, instance, transform)
  };
  return (transform)
};

function magnetSucker(id, rotate, scale) {
  var data = getDataById(id);
  var initScale = data.initScale;
  var initRotate = data.initRotate;
  var magRotate = deg2arc(5);
  var rem = (rotate + initRotate + 2 * Math.PI) % (Math.PI / 2);
  if (rem < magRotate) {
    rotate -= rem
  } else if (rem > Math.PI / 2 - magRotate) {
    rotate += Math.PI / 2 - rem
  };
  return ({
    rotate,
    scale
  })
};

function moveTopZindex(id, instance) {
  var maxZindex = 0;
  var idx = 0;
  for (var i = 0; i < dataList.length; i++) {
    if (dataList[((nt_10 = (i), null == nt_10 ? undefined : 'number' === typeof nt_10 ? nt_10 : "" + nt_10))].id == id) {
      idx = i
    };
    if (dataList[((nt_11 = (i), null == nt_11 ? undefined : 'number' === typeof nt_11 ? nt_11 : "" + nt_11))].zindex > maxZindex) {
      maxZindex = dataList[((nt_12 = (i), null == nt_12 ? undefined : 'number' === typeof nt_12 ? nt_12 : "" + nt_12))].zindex
    }
  };
  for (var i = 0; i < dataList.length; i++) {
    if (dataList[((nt_13 = (i), null == nt_13 ? undefined : 'number' === typeof nt_13 ? nt_13 : "" + nt_13))].zindex > dataList[((nt_14 = (idx), null == nt_14 ? undefined : 'number' === typeof nt_14 ? nt_14 : "" + nt_14))].zindex) {
      dataList[((nt_15 = (i), null == nt_15 ? undefined : 'number' === typeof nt_15 ? nt_15 : "" + nt_15))].zindex -= 1;
      doTransform(dataList[((nt_16 = (i), null == nt_16 ? undefined : 'number' === typeof nt_16 ? nt_16 : "" + nt_16))].id, ({
        x: 0,
        y: 0,
      }), 0, 0, 0, 1, dataList[((nt_17 = (i), null == nt_17 ? undefined : 'number' === typeof nt_17 ? nt_17 : "" + nt_17))].initPan, dataList[((nt_18 = (i), null == nt_18 ? undefined : 'number' === typeof nt_18 ? nt_18 : "" + nt_18))].initRotate, dataList[((nt_19 = (i), null == nt_19 ? undefined : 'number' === typeof nt_19 ? nt_19 : "" + nt_19))].initScale, instance)
    }
  };
  dataList[((nt_20 = (idx), null == nt_20 ? undefined : 'number' === typeof nt_20 ? nt_20 : "" + nt_20))].zindex = maxZindex;
  doTransform(id, ({
    x: 0,
    y: 0,
  }), 0, 0, 0, 1, dataList[((nt_21 = (idx), null == nt_21 ? undefined : 'number' === typeof nt_21 ? nt_21 : "" + nt_21))].initPan, dataList[((nt_22 = (idx), null == nt_22 ? undefined : 'number' === typeof nt_22 ? nt_22 : "" + nt_22))].initRotate, dataList[((nt_23 = (idx), null == nt_23 ? undefined : 'number' === typeof nt_23 ? nt_23 : "" + nt_23))].initScale, instance)
};
var onTouchStart = (function (event, instance) {
  currentId = event.target.id;
  if (singleId) {
    currentId = singleId
  };
  if (!isValidImgId(currentId)) {
    return
  };
  for (var i = 0; i < event.touches.length; i++) {
    if (!hasValue(finger1.identifier)) {
      finger1.identifier = event.touches[((nt_24 = (i), null == nt_24 ? undefined : 'number' === typeof nt_24 ? nt_24 : "" + nt_24))].identifier;
      finger1.start = ({
        x: event.touches[((nt_25 = (i), null == nt_25 ? undefined : 'number' === typeof nt_25 ? nt_25 : "" + nt_25))].pageX - canvasOrigin.x,
        y: event.touches[((nt_26 = (i), null == nt_26 ? undefined : 'number' === typeof nt_26 ? nt_26 : "" + nt_26))].pageY - canvasOrigin.y,
      });
      finger1.cur = clone(finger1.start)
    } else if (hasValue(finger1.identifier) && !hasValue(finger2.identifier) && finger1.identifier !== event.touches[((nt_27 = (i), null == nt_27 ? undefined : 'number' === typeof nt_27 ? nt_27 : "" + nt_27))].identifier) {
      finger2.identifier = event.touches[((nt_28 = (i), null == nt_28 ? undefined : 'number' === typeof nt_28 ? nt_28 : "" + nt_28))].identifier;
      finger2.start = ({
        x: event.touches[((nt_29 = (i), null == nt_29 ? undefined : 'number' === typeof nt_29 ? nt_29 : "" + nt_29))].pageX - canvasOrigin.x,
        y: event.touches[((nt_30 = (i), null == nt_30 ? undefined : 'number' === typeof nt_30 ? nt_30 : "" + nt_30))].pageY - canvasOrigin.y,
      });
      finger2.cur = clone(finger2.start)
    }
  };
  if (hasValue(finger1.identifier) && hasValue(finger2.identifier)) {
    startCenter = calcCenter(finger2.start, finger1.start);
    startRotate = calcRotate(finger2.start, finger1.start);
    startLen = calcDistance(finger2.start, finger1.start)
  };
  if (hasValue(finger1.identifier) && !hasValue(finger2.identifier)) {
    moveTopZindex(currentId, instance)
  };
  var data = getDataById(currentId);
  instance.callMethod("onTouchStartBack", ({
    index: data.index,
  }))
});
var onTouchMove = (function (event, instance) {
  currentId = event.target.id;
  if (singleId) {
    currentId = singleId
  };
  if (!isValidImgId(currentId)) {
    return
  };
  var data = getDataById(currentId);
  if (usingHandle) {
    return
  };
  if (currentId == null) {
    return
  };
  for (var i = 0; i < event.touches.length; i++) {
    if (finger1.identifier === event.touches[((nt_31 = (i), null == nt_31 ? undefined : 'number' === typeof nt_31 ? nt_31 : "" + nt_31))].identifier) {
      finger1.cur = ({
        x: event.touches[((nt_32 = (i), null == nt_32 ? undefined : 'number' === typeof nt_32 ? nt_32 : "" + nt_32))].pageX - canvasOrigin.x,
        y: event.touches[((nt_33 = (i), null == nt_33 ? undefined : 'number' === typeof nt_33 ? nt_33 : "" + nt_33))].pageY - canvasOrigin.y,
      })
    } else if (finger2.identifier === event.touches[((nt_34 = (i), null == nt_34 ? undefined : 'number' === typeof nt_34 ? nt_34 : "" + nt_34))].identifier) {
      finger2.cur = ({
        x: event.touches[((nt_35 = (i), null == nt_35 ? undefined : 'number' === typeof nt_35 ? nt_35 : "" + nt_35))].pageX - canvasOrigin.x,
        y: event.touches[((nt_36 = (i), null == nt_36 ? undefined : 'number' === typeof nt_36 ? nt_36 : "" + nt_36))].pageY - canvasOrigin.y,
      })
    }
  };
  if (hasValue(finger1.identifier) && !hasValue(finger2.identifier)) {
    var dx = finger1.cur.x - finger1.start.x;
    var dy = finger1.cur.y - finger1.start.y;
    var curTransform = doTransform(currentId, finger1.cur, dx, dy, 0, 1, data.initPan, data.initRotate, data.initScale, instance);
    var dataIdx = getDataIndex(currentId);
    dataList[((nt_37 = (dataIdx), null == nt_37 ? undefined : 'number' === typeof nt_37 ? nt_37 : "" + nt_37))].curTransform = curTransform
  };
  if (hasValue(finger1.identifier) && hasValue(finger2.identifier)) {
    var curCenter = calcCenter(finger2.cur, finger1.cur);
    var curRotate = calcRotate(finger2.cur, finger1.cur);
    var curLen = calcDistance(finger2.cur, finger1.cur);
    var scale = curLen / startLen;
    var rotate = curRotate - startRotate;
    var dx = curCenter.x - startCenter.x;
    var dy = curCenter.y - startCenter.y;
    var mag = magnetSucker(currentId, rotate, scale);
    rotate = mag.rotate;
    scale = mag.scale;
    var curTransform = doTransform(currentId, startCenter, dx, dy, rotate, scale, data.initPan, data.initRotate, data.initScale, instance);
    var dataIdx = getDataIndex(currentId);
    dataList[((nt_38 = (dataIdx), null == nt_38 ? undefined : 'number' === typeof nt_38 ? nt_38 : "" + nt_38))].curTransform = curTransform
  }
});
var onTouchEnd = (function (event, instance) {
  var isFingerLeave = (function (finger) {
    if (!hasValue(finger.identifier)) {
      return (true)
    };
    for (var i = 0; i < event.touches.length; i++) {
      if (event.touches[((nt_39 = (i), null == nt_39 ? undefined : 'number' === typeof nt_39 ? nt_39 : "" + nt_39))].identifier == finger.identifier) {
        return (false)
      }
    };
    return (true)
  });
  if (isFingerLeave(finger1)) {
    finger1 = ({})
  };
  if (isFingerLeave(finger2)) {
    finger2 = ({})
  };
  if (!isValidImgId(currentId)) {
    return
  };
  if (currentId != null) {
    var dataIdx = getDataIndex(currentId);
    if (dataList[((nt_40 = (dataIdx), null == nt_40 ? undefined : 'number' === typeof nt_40 ? nt_40 : "" + nt_40))].curTransform) {
      dataList[((nt_41 = (dataIdx), null == nt_41 ? undefined : 'number' === typeof nt_41 ? nt_41 : "" + nt_41))].initPan = dataList[((nt_42 = (dataIdx), null == nt_42 ? undefined : 'number' === typeof nt_42 ? nt_42 : "" + nt_42))].curTransform.pan;
      dataList[((nt_43 = (dataIdx), null == nt_43 ? undefined : 'number' === typeof nt_43 ? nt_43 : "" + nt_43))].initRotate = dataList[((nt_44 = (dataIdx), null == nt_44 ? undefined : 'number' === typeof nt_44 ? nt_44 : "" + nt_44))].curTransform.rotate;
      dataList[((nt_45 = (dataIdx), null == nt_45 ? undefined : 'number' === typeof nt_45 ? nt_45 : "" + nt_45))].initScale = dataList[((nt_46 = (dataIdx), null == nt_46 ? undefined : 'number' === typeof nt_46 ? nt_46 : "" + nt_46))].curTransform.scale
    };
    instance.callMethod("onUpdateTransform", ({
      id: currentId,
      pan: dataList[((nt_47 = (dataIdx), null == nt_47 ? undefined : 'number' === typeof nt_47 ? nt_47 : "" + nt_47))].initPan,
      rotate: dataList[((nt_48 = (dataIdx), null == nt_48 ? undefined : 'number' === typeof nt_48 ? nt_48 : "" + nt_48))].initRotate,
      scale: dataList[((nt_49 = (dataIdx), null == nt_49 ? undefined : 'number' === typeof nt_49 ? nt_49 : "" + nt_49))].initScale,
    }));
    if (dataList.length > 1) {
      for (var i = 0; i < dataList.length; i++) {
        instance.callMethod("onUpdateTransform", ({
          id: dataList[((nt_50 = (i), null == nt_50 ? undefined : 'number' === typeof nt_50 ? nt_50 : "" + nt_50))].id,
          zindexOnly: true,
          zindex: dataList[((nt_51 = (i), null == nt_51 ? undefined : 'number' === typeof nt_51 ? nt_51 : "" + nt_51))].zindex,
        }))
      }
    };
    if (!event.touches.length) {
      currentId = null
    }
  }
});

function getParentId(nodeId) {
  for (var i = 0; i < dataList.length; i++) {
    var id = dataList[((nt_52 = (i), null == nt_52 ? undefined : 'number' === typeof nt_52 ? nt_52 : "" + nt_52))].id;
    if (nodeId == id) {
      console.log("HEY!, this is child node, not parent!!");
      return (id)
    };
    var data = getDataById(id);
    for (var j = 0; j < data.ctrlNodeIds.length; j++) {
      if (nodeId === data.ctrlNodeIds[((nt_53 = (j), null == nt_53 ? undefined : 'number' === typeof nt_53 ? nt_53 : "" + nt_53))]) {
        return (id)
      }
    }
  }
};
var onHandleTouchStart = (function (event, instance) {
  var childId = event.target.id;
  currentId = getParentId(childId);
  if (singleId) {
    currentId = singleId
  };
  var touch = event.touches[(0)];
  var touchX = touch.pageX - canvasOrigin.x;
  var touchY = touch.pageY - canvasOrigin.y;
  handleStart = ({
    x: touchX,
    y: touchY,
  });
  usingHandle = true;
  moveTopZindex(currentId, instance)
});
var onHandleTouchMove = (function (event, instance) {
  var data = getDataById(currentId);
  var touch = event.touches[(0)];
  var touchX = touch.pageX - canvasOrigin.x;
  var touchY = touch.pageY - canvasOrigin.y;
  var handleCur = ({
    x: touchX,
    y: touchY,
  });
  var imgCenter = getImgCenter(currentId);
  var startRotate = calcRotate(handleStart, imgCenter);
  var curRotate = calcRotate(handleCur, imgCenter);
  var rotate = curRotate - startRotate;
  var startLen = calcDistance(handleStart, imgCenter);
  var curLen = calcDistance(handleCur, imgCenter);
  var scale = curLen / startLen;
  var mag = magnetSucker(currentId, rotate, scale);
  rotate = mag.rotate;
  scale = mag.scale;
  var curTransform = doTransform(currentId, imgCenter, 0, 0, rotate, scale, data.initPan, data.initRotate, data.initScale, instance);
  var dataIdx = getDataIndex(currentId);
  dataList[((nt_56 = (dataIdx), null == nt_56 ? undefined : 'number' === typeof nt_56 ? nt_56 : "" + nt_56))].curTransform = curTransform;
  instance.callMethod("onMoveCallBack", ({
    scale: scale,
  }))
});
var onHandleTouchEnd = (function (event, instance) {
  usingHandle = false;
  if (currentId != null) {
    var dataIdx = getDataIndex(currentId);
    if (dataList[((nt_57 = (dataIdx), null == nt_57 ? undefined : 'number' === typeof nt_57 ? nt_57 : "" + nt_57))].curTransform) {
      dataList[((nt_58 = (dataIdx), null == nt_58 ? undefined : 'number' === typeof nt_58 ? nt_58 : "" + nt_58))].initPan = dataList[((nt_59 = (dataIdx), null == nt_59 ? undefined : 'number' === typeof nt_59 ? nt_59 : "" + nt_59))].curTransform.pan;
      dataList[((nt_60 = (dataIdx), null == nt_60 ? undefined : 'number' === typeof nt_60 ? nt_60 : "" + nt_60))].initRotate = dataList[((nt_61 = (dataIdx), null == nt_61 ? undefined : 'number' === typeof nt_61 ? nt_61 : "" + nt_61))].curTransform.rotate;
      dataList[((nt_62 = (dataIdx), null == nt_62 ? undefined : 'number' === typeof nt_62 ? nt_62 : "" + nt_62))].initScale = dataList[((nt_63 = (dataIdx), null == nt_63 ? undefined : 'number' === typeof nt_63 ? nt_63 : "" + nt_63))].curTransform.scale
    };
    instance.callMethod("onUpdateTransform", ({
      id: currentId,
      pan: dataList[((nt_64 = (dataIdx), null == nt_64 ? undefined : 'number' === typeof nt_64 ? nt_64 : "" + nt_64))].initPan,
      rotate: dataList[((nt_65 = (dataIdx), null == nt_65 ? undefined : 'number' === typeof nt_65 ? nt_65 : "" + nt_65))].initRotate,
      scale: dataList[((nt_66 = (dataIdx), null == nt_66 ? undefined : 'number' === typeof nt_66 ? nt_66 : "" + nt_66))].initScale,
    }))
  };
  currentId = null
});
var onInitData = (function (value, oldValue, ownerInstance, instance) {
  if (value) {
    canvasOrigin = ({
      x: value.originX,
      y: value.originY,
    });
    if (value.singleId) {
      singleId = value.singleId
    };
    for (var i = 0; i < value.list.length; i++) {
      var item = value.list[((nt_67 = (i), null == nt_67 ? undefined : 'number' === typeof nt_67 ? nt_67 : "" + nt_67))];
      var id = item.id;
      var data = ({
        index: item.index,
        id: id,
        initPan: ({
          x: item.pan.x,
          y: item.pan.y,
        }),
        initRotate: item.rotate,
        initScale: item.scale,
        ctrlNodeIds: item.ctrlNodeIds,
        bgId: item.bgId,
        bgPadding: item.bgPadding,
        imgSize: ({
          width: item.imgW,
          height: item.imgH,
        }),
        zindex: item.zindex,
      });
      var dataIdx = getDataIndex(id);
      if (dataIdx == null) {
        dataList.push(data)
      } else {
        dataList[((nt_68 = (dataIdx), null == nt_68 ? undefined : 'number' === typeof nt_68 ? nt_68 : "" + nt_68))] = data
      };
      doTransform(id, ({
        x: 0,
        y: 0,
      }), 0, 0, 0, 1, data.initPan, data.initRotate, data.initScale, ownerInstance)
    }
  }
});

function hackGetInitData(ownerInstance) {
  var instance = ownerInstance.selectComponent("#hack-fix");
  return (instance.getDataset().initData)
};
module.exports = ({
  onInitData: onInitData,
  onTouchStart: onTouchStart,
  onTouchMove: onTouchMove,
  onTouchEnd: onTouchEnd,
  onHandleTouchStart: onHandleTouchStart,
  onHandleTouchMove: onHandleTouchMove,
  onHandleTouchEnd: onHandleTouchEnd,
});