<template>
	<view>
		<view class="canvas data-v-c8c188e0">
			<view class="theContent data-v-c8c188e0 vue-ref" data-ref="Content">
				<slot></slot>
			</view>
			<canvas  @onReady="__e" canvas-id="myCanvas" class="data-v-c8c188e0" id="myCanvas"
				:style="{width:can_width+'px',height:can_height+'px'}"></canvas>
		</view>

	</view>
</template>

<script>
	export default {
		name: "Poster",
		props: {
			list: {
				type: Array,
				required: !0
			},
			width: {
				type: [Number, String],
				default: 0
			},
			height: {
				type: [Number, String],
				default: 0
			},
			backgroundColor: {
				type: String,
				default: "rgb(255, 255, 255)"
			},
			direct: {
				type: String,
				default: ""
			},
			imgObjList: {
				type: Array
			},
			ep_x: {
				type: Number,
				default: 0
			},
			ep_y: {
				type: Number,
				default: 0
			}
		},
		emits: ["on-success", "on-error"],
		data() {
			return {
				posterUrl: "",
				renderList: [],
				ctx: null,
				counter: -1,
				drawPathQueue: [],
				can_width: this.width,
				can_height: this.height,
				scale: 1.25,
				Sscale: 3,
				direction: this.direct
			};
		},
		watch: {
			width: function(t) {
				this.can_width = (t - this.ep_x - this.ep_x) * this.scale * this.Sscale;
			},
			height: function(t) {
				this.can_height = (t - this.ep_y) * this.scale * this.Sscale;
			},
			direct: function(t) {
				this.direction = t;
			},

			drawPathQueue: function(t, e) {
				
				// 函数 i 用于绘制文本
				var i = function(t) {
					this.ctx.setFillStyle(t.color);
					this.ctx.setFontSize(t.size);
					this.ctx.setTextBaseline(t.textBaseline || "top");
					this.ctx.fillText(t.text, t.x, t.y);
				}.bind(this);

				// 函数 a 用于处理文本换行
				var a = function(t) {
					// 处理文本换行
					// ...
					this.ctx.setFontSize(t.size);
					var e = JSON.parse(JSON.stringify(t));
					e.lineSpace = e.lineSpace ? e.lineSpace : 10;
					for (var a = t.text, n = Math.floor((e.height + e.lineSpace) / (e.size + e.lineSpace)), s = a
							.split(""), c = [], o = ""; s.length;) {
						var h = s.shift();
						o += h, this.ctx.measureText(o).width > t.width ? (o = o.substr(0, o.length - 1), c.push(
							o),
							o = "", s.unshift(h)) : s.length || c.push(o);
					}
					if (c.length > n) {
						c.length = n;
						for (var l = this.ctx.measureText("...").width, u = 0, d = c[c.length - 1].split(""), f =
								""; l > u;) f += d.pop(),
							u = this.ctx.measureText(f).width;
						c[c.length - 1] = d.join("") + "...";
					}
					for (var p = 0; p < c.length; p++) {
						var x = p > 0 ? e.size + e.lineSpace : 0;
						e.y = e.y + x, e.text = c[p], i(e);
					}
				};

				// 函数 n 用于绘制圆形、矩形或自定义形状
				var n = function(t, e, i, a, n) {
					// 绘制圆形、矩形或自定义形状
					this.ctx.beginPath(), this.ctx.setFillStyle("transparent"), this.ctx.arc(t + n, e + n, n, Math
							.PI, 1.5 * Math.PI),
						this.ctx.moveTo(t + n, e), this.ctx.lineTo(t + i - n, e), this.ctx.lineTo(t + i, e + n),
						this.ctx.arc(t + i - n, e + n, n, 1.5 * Math.PI, 2 * Math.PI), this.ctx.lineTo(t + i, e +
							a - n),
						this.ctx.lineTo(t + i - n, e + a), this.ctx.arc(t + i - n, e + a - n, n, 0, .5 * Math.PI),
						this.ctx.lineTo(t + n, e + a), this.ctx.lineTo(t, e + a - n), this.ctx.arc(t + n, e + a -
							n, n, .5 * Math.PI, Math.PI),
						this.ctx.lineTo(t, e + n), this.ctx.lineTo(t + n, e), this.ctx.fill(), this.ctx
					.closePath(),
						this.ctx.clip();
				};

				// 函数 s 用于绘制图片
				var s = function(t, e, i, a) {
					// 绘制图片
					var n = t.imgW,
						s = t.imgH,
						c = t.width,
						o = t.height,
						h = c / n,
						l = o / s;
					t.imgW > t.width && t.imgH > t.height || t.imgW < t.width && t.imgH < t.height ? h > l ? this
						.ctx.drawImage(t.path, 0, (s - o / h) / 2, n, o / h, e, i, c, o) : this.ctx.drawImage(t
							.path, (n - c / l) / 2, 0, c / l, s, e, i, c, o) : n < c ? this.ctx.drawImage(t.path,
							0, (s - o / h) / 2, n, o / h, e, i, c, o) : this.ctx.drawImage(t.path, (n - c / l) / 2,
							0, c / l, s, e, i, c, o);
				};

				// 清空画布并填充背景色
				this.ctx.setFillStyle(this.backgroundColor);
				this.ctx.fillRect(0, 0, this.width * this.scale * this.Sscale, this.height * this.scale * this.Sscale);

				// 遍历绘制队列
				for (var h = 0; h < this.drawPathQueue.length; h++) {
					
					var u = this.drawPathQueue[h];
					
					// 根据类型绘制不同的元素
					// if (u.index === h) {
						if ("text" === u.type) {
							i(u);
							this.counter--;
						}

						if ("textarea" === u.type) {
							a(u);
							this.counter--;
						}

						if ("square" === u.type) {
							// 绘制矩形
							// ...
							this.ctx.save()
							this.ctx.beginPath();
							var d = u.x + Number(u.width) / 2,
								f = u.y + Number(u.height) / 2;
							this.ctx.translate(d, f);
							var p = u.rotate ? Number(u.rotate) % 360 : 0;
							this.ctx.rotate(p * Math.PI / 180)
							this.ctx.fillStyle = u.fillStyle
							this.ctx.fillRect(u.x - d, u.y - f, u.width, u.height)
							this.ctx.closePath()
							this.ctx.restore();
							this.counter--;
						}

						if ("image" === u.type) {
							// 绘制图片
							if (u.area) {
								
								this.ctx.save(), this.ctx.beginPath();
								var x, g;
								// 0 == h || 0 == l
								if (x = u.area.width * this.scale * this.Sscale, g = u.area.height * this.scale * this.Sscale){
									this.ctx.rect(u.area.x * this.scale * this.Sscale - this.ep_x *
									this.scale * this.Sscale * 1.25, u.area.y * this.scale * this.Sscale - this
									.ep_y * this.scale * this.Sscale * 1.25, x, 1.25 * g);
								}
								else {
									var m = h + 1;
									this.ctx.rect(u.area.x * this.scale * this.Sscale - this.ep_x * this.scale * this
										.Sscale * m, u.area.y * this.scale * this.Sscale - this.ep_y * this.scale *
										this.Sscale * m, x + this.ep_x * this.scale * this.Sscale * m, g + this
										.ep_y * this.scale * this.Sscale * m);
								}
								// this.ctx.clip();
								var v = u.x + Number(u.width) / 2,
									y = u.y + Number(u.height) / 2;
								this.ctx.translate(v, y);
								var w = u.rotate ? Number(u.rotate) % 360 : 0;
								this.ctx.rotate(w * Math.PI / 180), this.ctx.drawImage(u.path, u.x * this.scale * this
										.Sscale - v - this.ep_x * this.scale * this.Sscale, u.y * this.scale * this
										.Sscale - y - this.ep_y * this.scale * this.Sscale, u.width * this.scale * this
										.Sscale, u.height * this.scale * this.Sscale),
										
										
								console.log("width:",u.x * this.scale * this
										.Sscale - v - this.ep_x * this.scale * this.Sscale);
										
									this.ctx.closePath(), this.ctx.restore();
							} else if ("circle" == u.shape) {
								
								this.ctx.save(), this.ctx.beginPath();
								var b = u.width / 2 + u.x,
									S = u.height / 2 + u.y,
									P = u.width / 2;
								this.ctx.arc(b, S, P, 0, 2 * Math.PI), this.ctx.lineTo(u.x, u.y), this.ctx.fill(),
									this.ctx.clip();
								var I = u.x + Number(u.width) / 2,
									_ = u.y + Number(u.height) / 2;
								this.ctx.translate(I, _);
								var T = u.rotate ? Number(u.rotate) % 360 : 0;
								this.ctx.rotate(T * Math.PI / 180), u.mode ? s(u, u.x - I, u.y - _, u.mode) : this.ctx
									.drawImage(u.path, u.x - I, u.y - _, u.width, u.height),
									this.ctx.closePath(), this.ctx.restore();
									
									
							} else if ("number" == typeof u.shape) {
								this.ctx.save(), this.ctx.beginPath(), n(u.x, u.y, u.width, u.height, u.shape);
								var M = u.x + Number(u.width) / 2,
									N = u.y + Number(u.height) / 2;
								this.ctx.translate(M, N);
								var k = u.rotate ? Number(u.rotate) % 360 : 0;
								this.ctx.rotate(k * Math.PI / 180), u.mode ? s(u, u.x - M, u.y - N, u.mode) : this.ctx
									.drawImage(u.path, u.x - M, u.y - N, u.width, u.height),
									this.ctx.closePath(), this.ctx.restore();
									
							} else this.ctx.drawImage(u.path, u.x, u.y, u.width, u.height);
							this.counter--;
						}
					// }
				}
			},
			
			counter: function(e, r) {
				var i = this;
				0 === e && setTimeout(function() {
					i.ctx.fillStyle = "#10131c", i.ctx.draw(!0, function(e) {
						setTimeout(function() {
							uni.canvasToTempFilePath({
								canvasId: "myCanvas",
								success: function(t) {
									i.posterUrl = t.tempFilePath;
									console.log(t.tempFilePath);
									var e = {
										direction: i.direction,
										url: i.posterUrl
									};
									
									i.$emit("on-success", e);
								},
								fail: function(t) {
									i.$emit("on-error", t);
								}
							}, i);
						}, 2000);
					});
				}, 1000);
			}
		},
		methods: {


			getMatrix: function(t) {
				var e = t[0],
					r = t[1],
					i = (t[2], t[3], Math.sqrt(e * e + r * r));
				return {
					rotate: Math.round(Math.atan2(r, e) * (180 / Math.PI)),
					scale: i
				};
			},
			
			createForElRect: function() {
			    var e = this, r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "Poster", i = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0;
			   
				console.log(r,'rrr');
				uni.createSelectorQuery().selectAll(".Poster").fields({
			        dataset: !0,
			        size: !0,
			        rect: !0,
			        value: !0,
			        scrollOffset: !0,
			        properties: [ "src", "mode" ],
			        computedStyle: [ "margin", "padding", "backgroundColor", "fontSize", "color", "fontWeight", "borderRadius", "transform" ],
			        context: !0
			    }, function(r) {
					console.log("进度到函数",r);
			        var c = [], o = uni.getSystemInfoSync(), h = o.windowWidth / e.width;
					const s = (t) => Array.isArray(t) ? t : (typeof t === 'string' ? t.split('') : Array.from(t)) || (() => { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); })();
			        r.forEach(function(t, s) {
						// console.log(t,"tt");
			            var transformValues = r[s].transform.split("(")[1].split(")")[0].split(",");
			            var u = e.getMatrix(transformValues);
			            var d = t.src || t.dataset.enode || "";
			            var f = t.src ? "image" : t.dataset.etype || "text";
			            var p = t.dataset.enode || "";
			            var x = (t.fontSize.replace("px", "") || 13) / h;
			            var g = t.borderRadius === "50%" ? "circle" : 2 * parseInt(t.borderRadius) / h;
			            var m = (a + t.left - (i ? o.screenWidth : 0)) / h;
			            var v = (n + t.top - (i ? 50 : 0)) / h;
			            
			            var y = {
			                type: f,
			                shape: g,
			                text: p,
			                mode: "center",
			                x: m,
			                y: v,
			                rotate: u.rotate,
			                scale: u.scale,
			                path: d,
			                width: t.width / h,
			                height: t.height / h,
			                size: x,
			                color: t.color,
			                area: {
			                    x: m,
			                    y: v,
			                    width: t.width / h,
			                    height: t.height / h
			                }
			            };
			            
			            if (f === "image") {
			                y.area = {
			                    x: e.imgObjList[s].x,
			                    y: e.imgObjList[s].y,
			                    width: e.imgObjList[s].draw_width / h,
			                    height: e.imgObjList[s].draw_height / h
			                };
			                // console.log("item.area", y.area);
			            }
			            
			            c.push(y);
			        });
			        var l = uni.createCanvasContext("myCanvas", e);
					
			        e.ctx = l, e.renderList = [].concat(s(e.list), c), e.generateImg();
			    }).exec();
			},
			
			create: function() {
				var e = uni.createCanvasContext("myCanvas", this);
				this.ctx = e, this.renderList = this.list, this.generateImg();
			},

			generateImg: function() {
			    return new Promise(function(resolve, reject) {
			        // 初始化计数器和绘制路径队列
			        this.counter = this.renderList.length;
			        this.drawPathQueue = [];
			
			        // 定义一个函数用于获取图片信息
			        function getImageDetails(par) {
			            return new Promise(function(resolve, reject) {
			                // 使用小程序的getImageInfo方法获取图片信息
			                uni.getImageInfo({
			                    src: par.path,
			                    success: function(info) {
			                        resolve(
									par
									// {
			      //                       path: info.path,
			      //                       imgW: info.width,
			      //                       imgH: info.height,
									// 	type:par.type
			      //                   }
									);
			                    },
			                    fail: function(error) {
			                        t.showToast({
			                            title: "图片信息加载失败，可能是不支持的格式",
			                            icon: "none",
			                            duration: 2000
			                        });
			                        resolve({
			                            path: path
			                        });
			                    }
			                });
			            });
			        }
			
			        // 定义一个函数用于处理绘制路径
			        function processDrawPath(item, index) {
						console.log("items",item);
			            // 如果是文本或者图形，直接返回
			            if (item.type === "text" || item.type === "textarea" || item.type === "square") {
			                return Promise.resolve(item);
			            }
			
			            // 处理图片信息获取
			            return getImageDetails(item);
			        }
					let that = this
			        // 循环处理绘制路径
			        Promise.all(this.renderList.map(processDrawPath))
			            .then(function(results) {
			                // 将处理后的结果存入绘制路径队列
			                that.drawPathQueue = results;
			                resolve();
			            })
			            .catch(function(error) {
			                reject(error);
			            });
			    }.bind(this));
			},
			// generateImg: function() {
			//     var e = this;
			// 	function n(t) {
			// 	    return function() {
			// 	        var e = this, r = arguments;
			// 	        return new Promise(function(i, n) {
			// 	            var s = t.apply(e, r);
			// 	            function c(t) {
			// 	                a(s, i, n, c, o, "next", t);
			// 	            }
			// 	            function o(t) {
			// 	                a(s, i, n, c, o, "throw", t);
			// 	            }
			// 	            c(void 0);
			// 	        });
			// 	    };
			// 	}
			// 	var i = function(t) {
			// 	    return t && t.__esModule ? t : {
			// 	        default: t
			// 	    };
			// 	}(r(5));
			//     return n(i.default.mark(function r() {
			//         var a, s, c;
			//         return i.default.wrap(function(r) {
			//             for (;;) switch (r.prev = r.next) {
			//               case 0:
			//                 return e.counter = e.renderList.length, e.drawPathQueue = [], a = function() {
			//                     var e = n(i.default.mark(function e(r) {
			//                         return i.default.wrap(function(e) {
			//                             for (;;) switch (e.prev = e.next) {
			//                               case 0:
			//                                 return e.abrupt("return", new Promise(function(e, i) {
			//                                     uni.getImageInfo ? uni.getImageInfo({
			//                                         src: r.path,
			//                                         success: function(t) {
			//                                             r.path = t.path, r.imgW = t.width, r.imgH = t.height, e(r);
			//                                         },
			//                                         fail: function(e) {
			//                                             t.showToast({
			//                                                 title: "图片信息加载失败，可能是不支持的格式",
			//                                                 icon: "none",
			//                                                 duration: 2e3
			//                                             });
			//                                         }
			//                                     }) : e(r);
			//                                 }));

			//                               case 1:
			//                               case "end":
			//                                 return e.stop();
			//                             }
			//                         }, e);
			//                     }));
			//                     return function(t) {
			//                         return e.apply(this, arguments);
			//                     };
			//                 }(), s = function() {
			//                     var t = n(i.default.mark(function t(r, n) {
			//                         var s;
			//                         return i.default.wrap(function(t) {
			//                             for (;;) switch (t.prev = t.next) {
			//                               case 0:
			//                                 if ((s = e.renderList[n]).index = n, "text" !== s.type && "textarea" !== s.type && "square" !== s.type) {
			//                                     t.next = 6;
			//                                     break;
			//                                 }
			//                                 return t.abrupt("return", s);

			//                               case 6:
			//                                 return t.next = 8, a(s);

			//                               case 8:
			//                                 return t.abrupt("return", t.sent);

			//                               case 9:
			//                               case "end":
			//                                 return t.stop();
			//                             }
			//                         }, t);
			//                     }));
			//                     return function(e, r) {
			//                         return t.apply(this, arguments);
			//                     };
			//                 }(), c = function() {
			//                     var t = n(i.default.mark(function t(e) {
			//                         var r, a;
			//                         return i.default.wrap(function(t) {
			//                             for (;;) switch (t.prev = t.next) {
			//                               case 0:
			//                                 return r = e.map(function(t, e) {
			//                                     return s(t, e);
			//                                 }), t.next = 3, Promise.all(r);

			//                               case 3:
			//                                 return a = t.sent, t.abrupt("return", a);

			//                               case 5:
			//                               case "end":
			//                                 return t.stop();
			//                             }
			//                         }, t);
			//                     }));
			//                     return function(e) {
			//                         return t.apply(this, arguments);
			//                     };
			//                 }(), r.next = 7, c(e.renderList);

			//               case 7:
			//                 e.drawPathQueue = r.sent;

			//               case 8:
			//               case "end":
			//                 return r.stop();
			//             }
			//         }, r);
			//     }))();
			// },
			saveImg: function() {
				uni.canvasToTempFilePath({
					canvasId: "myCanvas",
					// canvas:this.ctx,
					success: function(e) {
						console.log(e);
						uni.hideLoading()
						uni.saveImageToPhotosAlbum({
							filePath: e.tempFilePath,
							success: function() {
								console.log("save success");
							}
						});
					},
					fail(err) {
						uni.hideLoading()
						console.log(err);
					}
				},this);
			}
		}

	}
</script>

<style>
	.canvas.data-v-c8c188e0 {
		left: 750rpx;
		position: fixed;
		top: 100rpx;
		width: 100vw;
	}
</style>