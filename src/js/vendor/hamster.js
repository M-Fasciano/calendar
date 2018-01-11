!function(e,t){"use strict";var n=function(e){return new n.Instance(e)};n.SUPPORT="wheel",n.ADD_EVENT="addEventListener",n.REMOVE_EVENT="removeEventListener",n.PREFIX="",n.READY=!1,n.Instance=function(e){return n.READY||(n.normalise.browser(),n.READY=!0),this.element=e,this.handlers=[],this},n.Instance.prototype={wheel:function(e,t){return n.event.add(this,n.SUPPORT,e,t),"DOMMouseScroll"===n.SUPPORT&&n.event.add(this,"MozMousePixelScroll",e,t),this},unwheel:function(e,t){return void 0===e&&(e=this.handlers.slice(-1)[0])&&(e=e.original),n.event.remove(this,n.SUPPORT,e,t),"DOMMouseScroll"===n.SUPPORT&&n.event.remove(this,"MozMousePixelScroll",e,t),this}},n.event={add:function(t,l,a,r){var o=a;a=function(t){t||(t=e.event);var l=n.normalise.event(t),a=n.normalise.delta(t);return o(l,a[0],a[1],a[2])},t.element[n.ADD_EVENT](n.PREFIX+l,a,r||!1),t.handlers.push({original:o,normalised:a})},remove:function(e,t,l,a){for(var r,o=l,i={},s=0,d=e.handlers.length;s<d;++s)i[e.handlers[s].original]=e.handlers[s];l=(r=i[o]).normalised,e.element[n.REMOVE_EVENT](n.PREFIX+t,l,a||!1);for(var h in e.handlers)if(e.handlers[h]==r){e.handlers.splice(h,1);break}}};var l,a;n.normalise={browser:function(){"onwheel"in t||t.documentMode>=9||(n.SUPPORT=void 0!==t.onmousewheel?"mousewheel":"DOMMouseScroll"),e.addEventListener||(n.ADD_EVENT="attachEvent",n.REMOVE_EVENT="detachEvent",n.PREFIX="on")},event:function(e){var t={originalEvent:e,target:e.target||e.srcElement,type:"wheel",deltaMode:"MozMousePixelScroll"===e.type?0:1,deltaX:0,delatZ:0,preventDefault:function(){e.preventDefault?e.preventDefault():e.returnValue=!1},stopPropagation:function(){e.stopPropagation?e.stopPropagation():e.cancelBubble=!1}};return e.wheelDelta&&(t.deltaY=-.025*e.wheelDelta),e.wheelDeltaX&&(t.deltaX=-.025*e.wheelDeltaX),e.detail&&(t.deltaY=e.detail),t},delta:function(e){var t,n=0,r=0,o=0,i=0,s=0;return e.deltaY&&(n=o=-1*e.deltaY),e.deltaX&&(n=-1*(r=e.deltaX)),e.wheelDelta&&(n=e.wheelDelta),e.wheelDeltaY&&(o=e.wheelDeltaY),e.wheelDeltaX&&(r=-1*e.wheelDeltaX),e.detail&&(n=-1*e.detail),0===n?[0,0,0]:(i=Math.abs(n),(!l||i<l)&&(l=i),s=Math.max(Math.abs(o),Math.abs(r)),(!a||s<a)&&(a=s),t=n>0?"floor":"ceil",n=Math[t](n/l),r=Math[t](r/a),o=Math[t](o/a),[n,r,o])}},"function"==typeof e.define&&e.define.amd?e.define("hamster",[],function(){return n}):"object"==typeof exports?module.exports=n:e.Hamster=n}(window,window.document);
