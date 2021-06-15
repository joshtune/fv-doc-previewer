/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function(){(window.wpCoreControlsBundle=window.wpCoreControlsBundle||[]).push([[6],{359:function(ha,da,f){function ca(e,f,h){f.endsWith("/")||(f+="/");h=h||{};var r=h.disableWebsockets||!1;this.fT=h.singleServerMode||!1;f.endsWith("blackbox/")||(f+="blackbox/");this.Cm=h.uploadData||null;this.Nv=h.uriData||null;this.$L=h.cacheKey||null;this.df=Object(n.a)(f,null,r);this.Lf=f;this.MD=e;this.kf=null;this.Lh=aa();this.Il=aa();this.Rx=!1;this.Yf=this.Ud=this.oe=this.Ve=null;this.sf=[];this.Dy=[];this.cache={};this.timeStamp=
0;this.Hf=[];this.Qg=[];this.jE=null;this.FD=!1;this.vH=this.oh=this.id=null;this.ZF=this.VO=fa;this.AA=0;this.iF=!1;this.U5=1;this.Jz={};this.bz=null;this.rr(!0)}function aa(){var e={promise:null,resolve:null,reject:null,state:0,result:null,request:null,ho:function(){return 1===(e.state&1)},S4:function(){return 2===(e.state&2)},Hh:function(){return!e.S4()&&!e.ho()},A4:function(){return 4===(e.state&4)},wS:function(){e.state|=4}};e.promise=new Promise(function(f,h){e.resolve=function(){if(0===e.state||
4===e.state)e.state=1,e.result=arguments[0],f.apply(null,arguments)};e.reject=function(){if(0===e.state||4===e.state)e.state=2,h.apply(null,arguments)}});return e}function fa(){return!1}function ea(e,f,h){if(!(f in w))return!0;f=w[f];for(var n=0;n<f.length;n++){var r=e;var x=f[n];var y=h;if(x.name in r){var aa="",ba=!1;r=r[x.name];switch(x.type){case "s":aa="String";ba=Object(z.isString)(r);break;case "a":aa="Array";ba=Object(z.isArray)(r);break;case "n":aa="Number";ba=Object(z.isNumber)(r)&&Object(z.isFinite)(r);
break;case "o":aa="Object",ba=Object(z.isObject)(r)&&!Object(z.isArray)(r)}ba||y.reject('Expected response field "'+x.name+'" to have type '+aa);x=ba}else y.reject('Response missing field "'+x.name+'"'),x=!1;if(!x)return!1}return!0}f.r(da);var z=f(0);f.n(z);var x=f(1);ha=f(35);var e=f(26),n=f(376),y=f(75),r=f(303),h=f(123),w={pages:[{name:"pages",type:"a"}],pdf:[{name:"url",type:"s"}],docmod:[{name:"url",type:"s"},{name:"rID",type:"s"}],health:[],tiles:[{name:"z",type:"n"},{name:"rID",type:"n"},{name:"tiles",
type:"a"},{name:"size",type:"n"}],annots:[{name:"url",type:"s"},{name:"name",type:"s"}],image:[{name:"url",type:"s"},{name:"name",type:"s"},{name:"p",type:"n"}],text:[{name:"url",type:"s"},{name:"name",type:"s"},{name:"p",type:"n"}]};ca.prototype=Object(z.extend)(ca.prototype,{h_:function(){var e=this;return new Promise(function(f,h){var n=new XMLHttpRequest;n.open("GET",e.Lf+"ck");n.withCredentials=e.Un();n.onreadystatechange=function(){n.readyState===XMLHttpRequest.DONE&&(200===n.status?f():h())};
n.send()})},l$:function(e,f){this.VO=e||fa;this.ZF=f||fa},pM:function(){var e=this;this.Il=aa();this.Lh=aa();return this.df.YD().then(function(){e.Rx=!1;e.id=null;e.FD=!1;return e.h_()})},gH:function(){this.df.clientId=Object(e.j)(8);this.VO();this.oz();this.Ve&&(this.Ve.Hh()?this.lf(this.Ve.request):this.Ve.ho()&&this.ZF(this.Ve.result.url,"pdf")&&(this.Ve=null,this.UR()));this.Yf&&this.Yf.Hh()&&this.lf(this.Yf.request);this.oe&&this.oe.Hh()?this.lf(this.oe.request):this.Ud&&this.Ud.Hh()&&this.IO(this.Ud.request);
var f;for(f=0;f<this.Hf.length;f++)this.Hf[f]&&this.Hf[f]&&(this.Hf[f].Hh()?this.lf(this.Hf[f].request):this.Hf[f].ho()&&this.ZF(this.Hf[f].result.url,"image")&&(this.Hf[f]=null,this.xA(f)));for(f=0;f<this.Qg.length;f++)this.Qg[f]&&this.Qg[f]&&this.Qg[f].Hh()&&!this.Qg[f].A4()&&this.lf(this.Qg[f].request);for(f=0;f<this.sf.length;f++)this.sf[f]&&this.sf[f].Hh()&&this.lf(this.sf[f].request)},oz:function(e){var f=this;this.Rx||(this.timeStamp=Date.now(),this.df.aI(function(e){f.h6(e)},function(){return null},
function(){return null},this.df.clientId).then(function(){clearInterval(f.rA);f.rA=null},function(n){f.Rx=!1;if(!f.rA){var r=0;f.FD=!0;f.vH=0;f.rA=setInterval(function(){2>r++?f.gH():(clearInterval(f.rA),e&&e.reject(h.a),Object(x.e)("Blackbox connection failed:"+n))},5E3)}}),this.Rx=!0)},uba:function(){var f=this,h=createPromiseCapability();if(this.Cm){var n=new FormData;n.append("file",this.Cm.fileHandle,this.Cm.fileHandle.name);var r=this.Cm.loadCallback;var w="upload";var x=this.Cm.extension}else if(this.Nv){n=
{uri:this.Nv.uri,ffa:this.Nv.shareId};n=Object.keys(n).map(function(e){return e+"="+(n[e]?encodeURIComponent(n[e]):"")}).join("&");var y="application/x-www-form-urlencoded; charset=UTF-8";r=this.Nv.loadCallback;w="url";x=this.Nv.extension}else return Promise.resolve();var z=new XMLHttpRequest;z.open("POST",Object(e.i)(f.Lf,"AuxUpload?ext="+x+"&type="+w+"&bcid="+this.df.clientId+"&auth="+this.oh));z.withCredentials=this.Un();y&&z.setRequestHeader("Content-Type",y);z.addEventListener("load",function(){if(z.readyState===
z.DONE&&200===z.status){var e=JSON.parse(z.response);f.MD=e.uri;r(e);h.resolve(e)}});z.addEventListener("error",function(){h.reject(z.statusText+" "+JSON.stringify(z))});this.Cm&&null!=this.Cm.onProgress&&(z.upload.onprogress=function(e){f.Cm.onProgress(e)});z.send(n);return h.promise},B$:function(e){this.bz=e},z3:function(e){this.password&&this.Lh.ho()?e(this.password):this.bz(e)},X8:function(e){this.password=e||null;this.Lh.ho()||(this.oz(this.Lh),this.lf({t:"pages"}));return this.Lh.promise},hv:function(e){this.jE=
e||null;this.Lh.ho()||(this.oz(this.Lh),this.lf({t:"pages"}));return this.Lh.promise},rM:function(e){e=Object.assign(e,{uri:encodeURIComponent(this.MD)});this.jE&&(e.ext=this.jE);this.kf&&(e.c=this.kf);this.password&&(e.pswd=this.password);this.$L&&(e.cacheKey=this.$L);return e},lf:function(e){e=this.rM(e);this.df.send(e)},Vj:function(e){return e},h6:function(e){var f=this,h=e.data,n=e.err,r=e.t;if(n&&f.bz&&"This document could not be decrypted with the given password"===n)f.bz(function(e){f.X8(e)});
else switch(r){case "upload":n?f.vba.reject(n):f.vba.resolve("Success");break;case "pages":n?f.Lh.reject(n):ea(h,r,f.Lh)&&f.Lh.resolve(h);break;case "config":n?f.Il.reject(n):ea(h,r,f.Il)&&(h.id&&(f.id=h.id),h.auth&&(f.oh=h.auth),h.serverVersion&&(f.Oba=h.serverVersion,Object(x.f)("[WebViewer Server] server version: "+f.Oba)),h.serverID?(f.AA=h.serverID===f.vH&&f.iF?f.AA+1:0,f.vH=h.serverID):f.AA=0,f.iF=!1,f.Il.resolve(h));break;case "health":n?f.Il.reject(n):ea(h,r,f.Il)&&(h=h.unhealthy,f.fT&&h?
Object(x.h)("Server failed health check. Single server mode ignoring check."):!f.Dda&&h&&1>=f.AA&&(f.iF=!0,f.pM().then(function(){f.gH()},function(){f.gH()})));break;case "pdf":h.url=f.Lf+"../"+encodeURI(h.url)+"?bcid="+this.df.clientId+"&auth="+this.oh;n?f.Ve.reject(n):ea(h,r,f.Ve)&&f.Ve.resolve(h);break;case "docmod":h.url=f.Lf+"../"+encodeURI(h.url)+"?bcid="+this.df.clientId+"&auth="+this.oh;n?f.Jz[h.rID].reject(n):ea(h,r,f.Ve)&&f.Jz[h.rID].resolve(h);break;case "xod":if(n)this.oe&&this.oe.Hh()&&
this.oe.reject(n),this.Ud&&this.Ud.Hh()&&this.Ud.reject(n);else if(h.notFound)h.noCreate||this.oe&&this.oe.Hh()&&this.oe.resolve(h),this.Ud&&this.Ud.Hh()&&this.Ud.resolve(h);else{h.url&&(h.url=f.Lf+"../"+encodeURI(h.url)+"?bcid="+this.df.clientId+"&auth="+this.oh);if(!this.Ud||this.Ud.ho())this.Ud=aa(),this.Ud.request={t:"xod",noCreate:!0};this.oe||(this.oe=aa(),this.oe.request={t:"xod"});this.Ud.resolve(h);this.oe.resolve(h)}break;case "annots":if(n)f.Yf.reject(n);else if(ea(h,r,f.Yf)){f.Yf.wS();
var w=new XMLHttpRequest;e=f.Lf+"../"+encodeURI(h.url);var z=h.hasAppearance?e+".xodapp?bcid="+this.df.clientId+"&auth="+this.oh:null;e+="?bcid="+this.df.clientId+"&auth="+this.oh;w.open("GET",e);w.responseType="text";w.withCredentials=this.Un();w.addEventListener("load",function(){w.readyState===w.DONE&&200===w.status&&f.Yf.resolve({yI:w.response,ML:z})});w.addEventListener("error",function(){f.Yf.reject(w.statusText+" "+JSON.stringify(w))});w.send()}break;case "image":var ba=this.Hf[h.p];n?ba.promise.reject(n):
ea(h,r,ba)&&(ba.result=h,ba.result.url=f.Lf+"../"+encodeURI(ba.result.url)+"?bcid="+this.df.clientId+"&auth="+this.oh,ba.resolve(ba.result));break;case "tiles":ba=h.rID;e=this.sf[ba];this.sf[ba]=null;this.Dy.push(ba);if(n)e.reject(n);else if(ea(h,r,e)){for(n=0;n<h.tiles.length;n++)h.tiles[n]=f.Lf+"../"+encodeURI(h.tiles[n])+"?bcid="+this.df.clientId+"&auth="+this.oh;e.resolve(h)}break;case "text":ba=this.Qg[h.p];if(n)ba.reject(n);else if(ea(h,r,ba)){ba.wS();var ca=new XMLHttpRequest;ca.open("GET",
f.Lf+"../"+encodeURI(h.url)+"?bcid="+this.df.clientId+"&auth="+this.oh);ca.withCredentials=this.Un();ca.addEventListener("load",function(){ca.readyState===ca.DONE&&200===ca.status&&(ba.result=JSON.parse(ca.response),ba.resolve(ba.result))});ca.addEventListener("error",function(e){ba.reject(ca.statusText+" "+JSON.stringify(e))});ca.send()}break;case "progress":"loading"===h.t&&f.trigger(y.a.Events.DOCUMENT_LOADING_PROGRESS,[h.bytes,h.total])}},IN:function(){this.oz(this.Il);return this.Il.promise},
B1:function(){this.Yf||(this.Yf=aa(),this.Yf.request={t:"annots"},this.lf(this.Yf.request));return this.Yf.promise},xA:function(e){this.Hf[e]||(this.Hf[e]=aa(),this.Hf[e].request={t:"image",p:e},this.lf(this.Hf[e].request));return this.Hf[e].promise},Y8:function(e){this.Qg[e]||(this.Qg[e]=aa(),this.Qg[e].request={t:"text",p:e},this.lf(this.Qg[e].request));return this.Qg[e].promise},Z8:function(e,f,h,n){var r=this.sf.length;this.Dy.length&&(r=this.Dy.pop());this.sf[r]=aa();this.sf[r].request={t:"tiles",
p:e,z:f,r:h,size:n,rID:r};this.lf(this.sf[r].request);return this.sf[r].promise},UR:function(){this.Ve||(this.Ve=aa(),this.Ve.request={t:"pdf"},this.FD?this.Ve.resolve({url:this.MD}):this.lf(this.Ve.request));return this.Ve.promise},cO:function(e){var f=this,h=new XMLHttpRequest,n=this.Lf+"aul?id="+this.id+"&bcid="+this.df.clientId+"&auth="+this.oh,r=new FormData,w={};e.annots&&(w.annots="xfdf");e.watermark&&(w.watermark="png");e.redactions&&(w.redactions="redact");w={t:"docmod",reqID:this.U5++,parts:w};
e.print&&(w.print=!0);var x=this.rM(w);r.append("msg",JSON.stringify(x));return Promise.all([e.annots,e.watermark,e.redactions].map(function(e){return Promise.resolve(e)})).then(function(e){var w=e[0],y=e[1],z=e[2];w&&r.append("annots",w);y&&r.append("watermark",e.watermark);z&&r.append("redactions",z);f.Jz[x.reqID]=aa();h.open("POST",n);h.withCredentials=f.Un;h.send(r);return f.Jz[x.reqID].promise})},IO:function(){this.Ud||(this.Ud=aa(),this.Ud.request={t:"xod",noCreate:!0},this.lf(this.Ud.request));
return this.Ud.promise},a9:function(){this.oe||(this.oe=aa(),this.oe.request={t:"xod"},this.lf(this.oe.request));return this.oe.promise},lm:function(){return!0},request:function(){},oR:function(){},abort:function(){for(var e=0;e<this.sf.length;e++)this.sf[e]&&(this.sf[e].resolve(null),this.sf[e]=null,this.Dy.push(e));this.close()},KA:function(e){this.kf=this.kf||{};this.kf.headers=e},Zda:function(){return this.kf?Object(z.omit)(this.kf.headers,["Cookie","cookie"]):null},rr:function(e){this.kf=this.kf||
{};this.kf.internal=this.kf.internal||{};this.kf.internal.withCredentials=e},Un:function(){return this.kf&&this.kf.internal?this.kf.internal.withCredentials:null},getFileData:function(){return Promise.reject()}});Object(ha.b)(ca);Object(r.a)(ca);Object(r.b)(ca);da["default"]=ca},376:function(ha,da,f){function ca(f,z,x){function e(e,f,n){function h(e){w().then(function(f){da&&!ea?setTimeout(function(){h(e)},1):f.send(JSON.stringify(e))})}function r(e,f,r,w){var ba=window.createPromiseCapability(),
ia=!1,ja=ba;z=e;aa=f;ca=r;y=null;w&&(n=w);try{e=fa?ha+"/"+fa:ha+"/ws";e+="?bcid="+n;var ka=new WebSocket(e);ka.onopen=function(){ba.resolve();ia=!0;ba=null;da=!1;x.resolve(ka);aa&&aa()};ka.onerror=function(e){da=ea=!0;ba&&ba.reject(e);y&&y.reject()};ka.onclose=function(){x=window.createPromiseCapability();da=!0;y||(y=window.createPromiseCapability());y.resolve();ca&&ca();z&&ia&&z({t:"health",data:{unhealthy:!0,isDead:!0}})};ka.onmessage=function(e){e&&e.data&&(e=JSON.parse(e.data),e.hb?h({hb:!0}):
e.end?close():z(e))}}catch(Ea){ba.reject(Ea),ba=null}return ja.promise}function w(){da&&z&&r(z);return x.promise}var x=window.createPromiseCapability(),y=null,z,aa,ca=null,da=!1,ea=!1,fa=f,ha=function(e){var f=e.indexOf("://"),h="ws://";0>f?f=0:(5===f&&(h="wss://"),f+=3);var n=e.lastIndexOf("/");0>n&&(n=e.length);return h+e.slice(f,n)}(e);return{send:h,aI:r,YD:function(){return y?y.promise:w().then(function(e){y=window.createPromiseCapability();z=null;e.close();return y.promise})},clientId:n}}function n(e){var f=
e.lastIndexOf("/");0>f&&(f=e.length);return e.slice(0,f)}var y=Object(fa.j)(8);return window.WebSocket&&!x?e(f,z,y):function(e,f,w){function h(e){(ea?ea.promise:Promise.resolve(da)).then(function(f){var h=new XMLHttpRequest;f=ca?z+"/"+ca+"pf?id="+f:z+"/pf?id="+f;f+="&bcid="+w;var n=new FormData;n.append("data",JSON.stringify(e));h.open("POST",f);h.withCredentials=!0;h.send(n)})}function r(){da=0;ea||(ea=window.createPromiseCapability())}function x(){y=new XMLHttpRequest;var e=z+"/pf";e+=0!==da?"?id="+
da+"&uc="+va:"?uc="+va;va++;y.open("GET",e,!0);y.withCredentials=!0;y.setRequestHeader("Cache-Control","no-cache");y.setRequestHeader("X-Requested-With","XMLHttpRequest");var f=y,n=!1;y.onreadystatechange=function(){a:if(3<=f.readyState&&!n){try{var e=f.responseText.length}catch(Ba){Object(aa.f)("caught exception");break a}if(0<e)try{var w=f.responseText.split("\n");for(w[w.length-1]&&w.pop();0<w.length&&3>w[w.length-1].length;)"]"===w.pop()&&r();0<w.length&&3>w[0].length&&w.shift();for(e=0;e<w.length;++e)w[e].endsWith(",")&&
(w[e]=w[e].substr(0,w[e].length-1));0===da&&0<w.length&&(da=JSON.parse(w.shift()).id,e=ea,ea=null,e.resolve(da));var y;for(e=0;e<w.length;++e)(y=JSON.parse(w[e]))&&y.end?close():y&&y.hb&&y.id===da?h({hb:!0}):Ca(y)}catch(Ba){}fa||(n=!0,x())}};y.send()}var y,z=n(e),ca=f,da=0,ea=window.createPromiseCapability(),fa=!1,ha=null,Ca=null,va=0;return{send:h,aI:function(e,f,h){Ca=e;ha=h;fa=!1;r();x();f&&f();return Promise.resolve()},YD:function(){r();Ca=null;fa=!0;ha&&ha();y.abort();return Promise.resolve()},
clientId:w}}(f,z,y)}f.d(da,"a",function(){return ca});var aa=f(1),fa=f(26)}}]);}).call(this || window)
