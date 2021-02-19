/**
 * Cesium - https://github.com/AnalyticalGraphicsInc/cesium
 *
 * Copyright 2011-2017 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/AnalyticalGraphicsInc/cesium/blob/master/LICENSE.md for full licensing details.
 */
/**
  @license
  when.js - https://github.com/cujojs/when

  MIT License (c) copyright B Cavalier & J Hann

 * A lightweight CommonJS Promises/A and when() implementation
 * when is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @version 1.7.1
 */

!function(){!function(n){"use strict";n("ThirdParty/when",[],function(){function n(n,e,t,o){return r(n).then(e,t,o)}function r(n){var r,e;return n instanceof t?r=n:f(n)?(e=i(),n.then(function(n){e.resolve(n)},function(n){e.reject(n)},function(n){e.progress(n)}),r=e.promise):r=o(n),r}function e(r){return n(r,u)}function t(n){this.then=n}function o(n){return new t(function(e){try{return r(e?e(n):n)}catch(n){return u(n)}})}function u(n){return new t(function(e,t){try{return t?r(t(n)):u(n)}catch(n){return u(n)}})}function i(){function n(n,r,e){return l(n,r,e)}function e(n){return p(n)}function o(n){return p(u(n))}function f(n){return d(n)}var c,s,a,h,l,d,p;return s=new t(n),c={then:n,resolve:e,reject:o,progress:f,promise:s,resolver:{resolve:e,reject:o,progress:f}},a=[],h=[],l=function(n,r,e){var t,o;return t=i(),o="function"==typeof e?function(n){try{t.progress(e(n))}catch(n){t.progress(n)}}:function(n){t.progress(n)},a.push(function(e){e.then(n,r).then(t.resolve,t.reject,o)}),h.push(o),t.promise},d=function(n){return v(h,n),n},p=function(n){return n=r(n),l=n.then,p=r,d=m,v(a,n),h=a=k,n},c}function f(n){return n&&"function"==typeof n.then}function c(r,e,t,o,u){return g(2,arguments),n(r,function(r){function f(n){v(n)}function c(n){p(n)}var s,a,h,l,d,p,v,g,y,w;if(y=r.length>>>0,s=Math.max(0,Math.min(e,y)),h=[],a=y-s+1,l=[],d=i(),s)for(g=d.progress,v=function(n){l.push(n),--a||(p=v=m,d.reject(l))},p=function(n){h.push(n),--s||(p=v=m,d.resolve(h))},w=0;w<y;++w)w in r&&n(r[w],c,f,g);else d.resolve(h);return d.then(t,o,u)})}function s(n,r,e,t){function o(n){return r?r(n[0]):n[0]}return c(n,1,o,e,t)}function a(n,r,e,t){return g(1,arguments),l(n,y).then(r,e,t)}function h(){return l(arguments,y)}function l(r,e){return n(r,function(r){var t,o,u,f,c,s;if(u=o=r.length>>>0,t=[],s=i(),u)for(f=function(r,o){n(r,e).then(function(n){t[o]=n,--u||s.resolve(t)},s.reject)},c=0;c<o;c++)c in r?f(r[c],c):--u;else s.resolve(t);return s.promise})}function d(r,e){var t=j.call(arguments,1);return n(r,function(r){var o;return o=r.length,t[0]=function(r,t,u){return n(r,function(r){return n(t,function(n){return e(r,n,u,o)})})},w.apply(r,t)})}function p(r,e,t){var o=arguments.length>2;return n(r,function(n){return n=o?t:n,e.resolve(n),n},function(n){return e.reject(n),u(n)},e.progress)}function v(n,r){for(var e,t=0;e=n[t++];)e(r)}function g(n,r){for(var e,t=r.length;t>n;)if(null!=(e=r[--t])&&"function"!=typeof e)throw new Error("arg "+t+" must be a function")}function m(){}function y(n){return n}var w,j,k;return n.defer=i,n.resolve=r,n.reject=e,n.join=h,n.all=a,n.map=l,n.reduce=d,n.any=s,n.some=c,n.chain=p,n.isPromise=f,t.prototype={always:function(n,r){return this.then(n,n,r)},otherwise:function(n){return this.then(k,n)},yield:function(n){return this.then(function(){return n})},spread:function(n){return this.then(function(r){return a(r,function(r){return n.apply(k,r)})})}},j=[].slice,w=[].reduce||function(n){var r,e,t,o,u;if(u=0,r=Object(this),o=r.length>>>0,e=arguments,e.length<=1)for(;;){if(u in r){t=r[u++];break}if(++u>=o)throw new TypeError}else t=e[1];for(;u<o;++u)u in r&&(t=n(t,r[u],u,r));return t},n})}("function"==typeof define&&define.amd?define:function(n){"object"==typeof exports?module.exports=n():this.when=n()}),define("Core/defined",[],function(){"use strict";function n(n){return void 0!==n&&null!==n}return n}),define("Core/freezeObject",["./defined"],function(n){"use strict";var r=Object.freeze;return n(r)||(r=function(n){return n}),r}),define("Core/defaultValue",["./freezeObject"],function(n){"use strict";function r(n,r){return void 0!==n&&null!==n?n:r}return r.EMPTY_OBJECT=n({}),r}),define("Core/formatError",["./defined"],function(n){"use strict";function r(r){var e,t=r.name,o=r.message;e=n(t)&&n(o)?t+": "+o:r.toString();var u=r.stack;return n(u)&&(e+="\n"+u),e}return r}),define("Workers/createTaskProcessorWorker",["../ThirdParty/when","../Core/defaultValue","../Core/defined","../Core/formatError"],function(n,r,e,t){"use strict";function o(r,e,t){try{return r(e,t)}catch(r){return n.reject(r)}}function u(u){var i;return function(f){var c=f.data,s=[],a={id:c.id,result:void 0,error:void 0};return n(o(u,c.parameters,s)).then(function(n){a.result=n}).otherwise(function(n){n instanceof Error?a.error={name:n.name,message:n.message,stack:n.stack}:a.error=n}).always(function(){e(i)||(i=r(self.webkitPostMessage,self.postMessage)),c.canTransferArrayBuffer||(s.length=0);try{i(a,s)}catch(n){a.result=void 0,a.error="postMessage failed with error: "+t(n)+"\n  with responseMessage: "+JSON.stringify(a),i(a)}})}}return u}),define("Workers/createHashCodeFromStringWorker",["./createTaskProcessorWorker"],function(n){"use strict";function r(n,r){var e,t,o=n.str,u=0;if(0===o.length)return u;for(e=0;e<o.length;e++)t=o.charCodeAt(e),u=(u<<5)-u+t,u|=0;return u}return n(r)})}();