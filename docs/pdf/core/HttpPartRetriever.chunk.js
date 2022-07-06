/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function(){(window.wpCoreControlsBundle=window.wpCoreControlsBundle||[]).push([[0],{383:function(ia,da,e){e.r(da);e.d(da,"ByteRangeRequest",function(){return ka});var ca=e(1),ea=e(0);e.n(ea);var aa=e(2),ha=e(138);ia=e(88);var ba=e(233),z=e(68),w=e(64),y=e(232),r=e(158);e=e(351);var n=[],h=[],f=window,x=function(){return function(){this.sl=1}}(),fa;(function(f){f[f.UNSENT=0]="UNSENT";f[f.DONE=4]="DONE"})(fa||(fa={}));var ka=function(){function e(e,h,n,r){var w=this;this.url=e;this.range=h;this.Qe=n;this.withCredentials=
r;this.sZ=fa;this.request=new XMLHttpRequest;this.request.open("GET",this.url,!0);f.Uint8Array&&(this.request.responseType="arraybuffer");r&&(this.request.withCredentials=r);ja.DISABLE_RANGE_HEADER||(Object(ea.isUndefined)(h.stop)?this.request.setRequestHeader("Range","bytes="+h.start):this.request.setRequestHeader("Range",["bytes=",h.start,"-",h.stop-1].join("")));this.request.setRequestHeader("X-Requested-With","XMLHttpRequest");n&&Object.keys(n).forEach(function(f){w.request.setRequestHeader(f,
n[f])});this.request.overrideMimeType?this.request.overrideMimeType("text/plain; charset=x-user-defined"):this.request.setRequestHeader("Accept-Charset","x-user-defined");this.status=y.a.NOT_STARTED}e.prototype.start=function(e){var h=this,n=this.request;n.onreadystatechange=function(){if(h.aborted)return h.status=y.a.ABORTED,e({code:y.a.ABORTED});if(this.readyState===h.sZ.DONE){h.AA();var r=0===window.document.URL.indexOf("file:///");200===n.status||206===n.status||r&&0===n.status?(r=f.ZQ(this),
h.Hs(r,e)):(h.status=y.a.ERROR,e({code:h.status,status:h.status}))}};this.request.send(null);this.status=y.a.STARTED};e.prototype.Hs=function(f,e){this.status=y.a.SUCCESS;if(e)return e(!1,f)};e.prototype.abort=function(){this.AA();this.aborted=!0;this.request.abort()};e.prototype.AA=function(){var f=Object(r.c)(this.url,this.range,h);-1!==f&&h.splice(f,1);if(0<n.length){f=n.shift();var w=new e(f.url,f.range,this.Qe,this.withCredentials);f.request=w;h.push(f);w.start(Object(r.d)(f))}};e.prototype.extend=
function(f){var e=Object.assign({},this,f.prototype);e.constructor=f;return e};return e}(),ja=function(f){function e(e,h,n,r,w){n=f.call(this,e,n,r)||this;n.ul={};n.az=h;n.url=e;n.DISABLE_RANGE_HEADER=!1;n.dw=ka;n.mL=3;n.Qe=w||{};return n}Object(ca.c)(e,f);e.prototype.ou=function(f,e,h){var n=-1===f.indexOf("?")?"?":"&";switch(h){case !1:case w.a.NEVER_CACHE:f=f+n+"_="+Object(ea.uniqueId)();break;case !0:case w.a.CACHE:f=f+n+"_="+e.start+","+(Object(ea.isUndefined)(e.stop)?"":e.stop)}return f};e.prototype.iP=
function(f,e,h,n){void 0===h&&(h={});return new this.dw(f,e,h,n)};e.prototype.Q5=function(f,e,r,w,x){for(var y=0;y<n.length;y++)if(Object(ea.isEqual)(n[y].range,e)&&Object(ea.isEqual)(n[y].url,f))return n[y].mg.push(w),n[y].xB++,null;for(y=0;y<h.length;y++)if(Object(ea.isEqual)(h[y].range,e)&&Object(ea.isEqual)(h[y].url,f))return h[y].mg.push(w),h[y].xB++,null;r={url:f,range:e,az:r,mg:[w],xB:1};if(0===n.length&&h.length<this.mL)return h.push(r),r.request=this.iP(f,e,x,this.withCredentials),r;n.push(r);
return null};e.prototype.Sm=function(f,e,w){var x=this.ou(f,e,this.az);(f=this.Q5(x,e,this.az,w,this.Qe))&&f.request.start(Object(r.d)(f));return function(){var f=Object(r.c)(x,e,h);if(-1!==f){var w=--h[f].xB;0===w&&h[f].request&&h[f].request.abort()}else f=Object(r.c)(x,e,n),-1!==f&&(w=--n[f].xB,0===w&&n.splice(f,1))}};e.prototype.EQ=function(){return{start:-ha.a}};e.prototype.X8=function(){var f=-(ha.a+ha.e);return{start:f-ha.d,end:f}};e.prototype.Or=function(f){var e=this;this.gz=!0;var h=ha.a;
this.Sm(this.url,this.EQ(),function(n,r,w){function x(){var h=e.Hd.AQ();e.Sm(e.url,h,function(n,r){if(n)return Object(aa.i)("Error loading central directory: "+n),f(n);r=Object(z.a)(r);if(r.length!==h.stop-h.start)return f("Invalid XOD file: Zip central directory data is wrong size! Should be "+(h.stop-h.start)+" but is "+r.length);e.Hd.gU(r);e.gF=!0;e.gz=!1;return f(!1)})}if(n)return Object(aa.i)("Error loading end header: "+n),f(n,r,w);r=Object(z.a)(r);if(r.length!==h)return f("Invalid XOD file: Zip end header data is wrong size!");
try{e.Hd=new ba.a(r)}catch(la){return f(la)}e.Hd.y$?e.Sm(e.url,e.X8(),function(h,n){if(h)return Object(aa.i)("Error loading zip64 header: "+h),f(h);n=Object(z.a)(n);e.Hd.Q$(n);x()}):x()})};e.prototype.WQ=function(f){f(Object.keys(this.Hd.xm))};e.prototype.dJ=function(f,e){var h=this;if(this.Hd.ZO(f)){var n=this.Hd.sA(f);if(n in this.ul){var r=this.th[f];r.Lq=this.ul[n];r.Lq.sl++;r.cancel=r.Lq.cancel}else{var w=this.Hd.v7(f),y=this.Sm(this.url,w,function(r,x){r?(Object(aa.i)('Error loading part "'+
f+'": '+r),h.Sm(h.url,w,function(r,x){if(r)return e(r,f);h.kU(x,w,n,f,e)})):h.kU(x,w,n,f,e)}),z=this.th[f];z&&(z.hW=!0,z.cancel=function(){z.Lq.sl--;0===z.Lq.sl&&(y(),delete h.ul[n])},this.ul[n]=new x(n),z.Lq=this.ul[n],z.Lq.cancel=z.cancel)}}else delete this.th[f],e(Error('File not found: "'+f+'"'),f)};e.prototype.kU=function(f,e,h,n,r){if(f.length!==e.stop-e.start)r(Error("Part data is wrong size!"),n);else{do{if(!this.ul[h])return;n=this.ul[h].sl;for(var w=e.Cp.length,x=0;x<w;++x){var y=e.Cp[x];
r(!1,y.xp,f["string"===typeof f?"substring":"subarray"](y.start,y.stop),this.Hd.UR(y.xp));y.xp in this.th&&delete this.th[y.xp]}}while(n!==this.ul[h].sl);delete this.ul[h]}};e.DISABLE_RANGE_HEADER=!1;e.mL=3;return e}(ia.a);(function(f){function e(e,h,n){var r=f.call(this)||this,w;for(w in e)r[w]=e[w];r.Gka=e;r.startOffset=h;r.endOffset=n;r.iP=function(f,h,n,w){Object(ea.isUndefined)(h.stop)?(h.start+=r.endOffset,h.stop=r.endOffset):(h.start+=r.startOffset,h.stop+=r.startOffset);f=r.ou(r.url,h,r.az);
return new e.dw(f,h,n,w)};return r}Object(ca.c)(e,f);return e})(ja);Object(e.a)(ja);Object(e.b)(ja);da["default"]=ja}}]);}).call(this || window)