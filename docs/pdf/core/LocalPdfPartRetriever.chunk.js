/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function(){(window.wpCoreControlsBundle=window.wpCoreControlsBundle||[]).push([[11],{386:function(ia,da,e){e.r(da);var ca=e(1);ia=e(48);var ea=e(351),aa=e(218),ha=window;e=function(){function e(e){var w=this;this.a$=function(e){return e&&("image"===e.type.split("/")[0].toLowerCase()||e.name&&!!e.name.match(/.(jpg|jpeg|png|gif)$/i))};this.file=e;this.n$=new Promise(function(y){return Object(ca.b)(w,void 0,void 0,function(){var r;return Object(ca.d)(this,function(n){switch(n.label){case 0:return this.a$(this.file)?
[4,Object(aa.b)(e)]:[3,2];case 1:r=n.da(),this.file=new File([r],null===e||void 0===e?void 0:e.name,{type:e.type}),n.label=2;case 2:return y(!0),[2]}})})})}e.prototype.getFileData=function(z){var w=this,y=new FileReader;y.onload=function(r){w.trigger(e.Events.DOCUMENT_LOADING_PROGRESS,[r.loaded,r.loaded]);z(new Uint8Array(r.target.result))};y.onprogress=function(r){r.lengthComputable&&w.trigger(e.Events.DOCUMENT_LOADING_PROGRESS,[r.loaded,0<r.total?r.total:0])};y.readAsArrayBuffer(this.file)};e.prototype.getFile=
function(){return Object(ca.b)(this,void 0,Promise,function(){return Object(ca.d)(this,function(e){switch(e.label){case 0:return[4,this.n$];case 1:return e.da(),ha.utils.isJSWorker?[2,this.file.path]:[2,this.file]}})})};e.Events={DOCUMENT_LOADING_PROGRESS:"documentLoadingProgress"};return e}();Object(ia.a)(e);Object(ea.a)(e);Object(ea.b)(e);da["default"]=e}}]);}).call(this || window)