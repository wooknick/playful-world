// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"style.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"script.js":[function(require,module,exports) {
"use strict";

require("./style.css");

console.log("load");
var width = window.innerWidth;
var height = window.innerHeight;
var canvas = document.getElementById("world");
canvas.width = width;
canvas.height = height;
var context = canvas.getContext("2d");
var roads_canvas = document.createElement("canvas");
roads_canvas.width = width;
roads_canvas.height = height;
var roads_context = roads_canvas.getContext("2d");
var watercolor_canvas = document.createElement("canvas");
watercolor_canvas.width = width;
watercolor_canvas.height = height;
var watercolor_context = watercolor_canvas.getContext("2d");
var image, data;
var drawingId = -1;
var boids = [];
document.querySelector("canvas#world").addEventListener("click", function (e) {
  var clientX = e.clientX,
      clientY = e.clientY;
  boids.push(new Boid(clientX, clientY, Math.random() * 180 * Math.PI / 180, 0));

  if (drawingId === -1) {
    drawingId = setInterval(function () {
      drawing(0.015);
    }, 1000 / 60);
  }
}); // functions

var dist = function dist(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
};

var Boid = function Boid(x, y, angle, gen) {
  // 초기값 설정
  // x, y : 그리기 시작점
  // angle, dx, dy : 랜덤 설정된 각도에 따라 거리 1만큼 이동시키기 위한 x, y 델타값
  // stride : 한 틱당 그릴 선분의 길이를 정하기 위한 보폭.
  //        값이 클 수록 한 번에 길게 그리므로, 더 적은 틱으로 수행 가능하다.
  // life, gen : 나중에 추가되는 자식일수록 gen이 높고, gen이 life보다 높으면 바로 kill()한다.
  //            프랙탈 구조가 너무 좁게 들어가는 걸 방지함.
  // dead : 계속 그릴지, 삭제할지를 판단하는 플래그
  // dist : 시작점과 캔버스 중심과의 거리
  // hue : 색상 관련
  this.x = x;
  this.y = y;
  this.angle = Math.pow(Math.random(), 10) + angle;
  this.dx = Math.cos(this.angle);
  this.dy = Math.sin(this.angle);
  this.stride = 2;
  this.life = Math.random() * 30 + 10;
  this.gen = gen;
  this.dead = false;
  this.dist = dist(this.x, this.y, width / 2, height / 2);
  this.hue = Math.random() * 120; // update함수가 실행되면서 선이 그려진다.

  this.update = function () {
    roads_context.strokeStyle = "#808080";
    roads_context.beginPath();
    roads_context.moveTo(this.x, this.y);
    this.x += this.dx * this.stride;
    this.y += this.dy * this.stride;
    this.dist = dist(this.x, this.y, width / 2, height / 2);
    roads_context.lineTo(this.x, this.y);
    roads_context.stroke(); // trail : 음영 색 길이
    // var trail = Math.random() * ((50 - 10) * ((this.dist / width) * 2)) + 10;

    var trail = (Math.random() * Math.random() * 20 + 10) / 5;
    var color = {
      h: this.hue,
      s: "60%",
      l: "50%"
    };
    watercolor_context.strokeStyle = "hsla(" + color.h + "," + color.s + "," + color.l + ",0.1)";
    watercolor_context.lineWidth = 2; // trail은 한 번 그릴 때 5개씩 생기도록 함

    for (var i = 0; i < 5; i++) {
      watercolor_context.beginPath();
      watercolor_context.moveTo(this.x, this.y);
      var px = this.x + Math.cos(this.angle + 90) * (i * trail);
      var py = this.y + Math.sin(this.angle + 90) * (i * trail);
      watercolor_context.lineTo(px, py);
      watercolor_context.stroke();
    } // index : 한 획을 그렸을 때, 펜이 떨어지는 위치의 좌표 값.
    // ctx.getImageData.data 를 통해 얻어지는 1차원 행렬에 저장되어 있는 픽셀정보와 매핑됨
    // 바로 직전의 drawing() 결과와 비교함.
    // 픽셀정보 행렬에는 4개의 값이 하나의 픽셀을 표현함.


    var index = (Math.floor(this.x) + width * Math.floor(this.y)) * 4; // kill 조건
    // 너무 세부적인 반복인 경우

    if (this.gen >= this.life) this.kill(); // 펜을 뗀 픽셀의 알파가 0이 아닌 경우

    if (data[index + 3] > 0) {
      this.kill();
    } // 벽에 부딪힐 경우


    if (this.x < 0 || this.x > width) this.kill();
    if (this.y < 0 || this.y > height) this.kill();
  }; // 배열에서 제거


  this.kill = function () {
    boids.splice(boids.indexOf(this), 1);
    this.dead = true;
  };
};

var drawing = function drawing() {
  var bubbleFrequency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.01;
  // 직전 틱의 canvas 상태를 가져온다.
  image = roads_context.getImageData(0, 0, width, height);
  data = image.data;

  for (var i = 0; i < boids.length; i++) {
    var boid = boids[i];
    boid.update(); // 매 틱마다 2% 확률로 새로운 직선을 추가함.
    // 완성된 직선에서 추가하는게 아니고 조금씩 그려가는 와중에 추가하는 것.

    if (!boid.dead && Math.random() < bubbleFrequency && boids.length < 400) {
      boids.push(new Boid(boid.x, boid.y, (Math.random() > 0.5 ? 90 : -90) * Math.PI / 180 + boid.angle, boid.gen + 1));
    }
  } // 메인 캔버스에 그림을 그린다.


  context.clearRect(0, 0, width, height);
  context.globalAlpha = 0.5;
  context.drawImage(watercolor_canvas, 0, 0);
  context.globalAlpha = 1;
  context.drawImage(roads_canvas, 0, 0);

  if (boids.length == 0) {
    clearInterval(drawingId);
    drawingId = -1;
    console.log("done");
  }
};
},{"./style.css":"style.css"}],"../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59179" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map