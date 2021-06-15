/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function(){(window.wpCoreControlsBundle=window.wpCoreControlsBundle||[]).push([[7],{364:function(ha,da,f){f.r(da);var ca=f(3),aa=f(388),fa=f(389),ea;(function(f){f[f.EXTERNAL_XFDF_NOT_REQUESTED=0]="EXTERNAL_XFDF_NOT_REQUESTED";f[f.EXTERNAL_XFDF_NOT_AVAILABLE=1]="EXTERNAL_XFDF_NOT_AVAILABLE";f[f.EXTERNAL_XFDF_AVAILABLE=2]="EXTERNAL_XFDF_AVAILABLE"})(ea||(ea={}));ha=function(){function f(f){this.N=f;this.state=ea.EXTERNAL_XFDF_NOT_REQUESTED}f.prototype.t3=function(){var f=this;return function(e,n,x){return Object(ca.b)(f,
void 0,void 0,function(){var f,h,w,y,z,aa,da,fa=this,ha;return Object(ca.d)(this,function(r){switch(r.label){case 0:if(this.state!==ea.EXTERNAL_XFDF_NOT_REQUESTED)return[3,2];f=this.N.getDocument().lq();return[4,this.a2(f)];case 1:h=r.la(),w=this.EZ(h),this.eE=null!==(ha=null===w||void 0===w?void 0:w.parse())&&void 0!==ha?ha:null,this.state=null===this.eE?ea.EXTERNAL_XFDF_NOT_AVAILABLE:ea.EXTERNAL_XFDF_AVAILABLE,r.label=2;case 2:if(this.state===ea.EXTERNAL_XFDF_NOT_AVAILABLE)return x(e),[2];y=new DOMParser;
z=y.parseFromString(e,"text/xml");n.forEach(function(e){fa.merge(z,fa.eE,e)});aa=new XMLSerializer;da=aa.serializeToString(z);x(da);return[2]}})})}};f.prototype.AH=function(f){this.a2=f};f.prototype.$d=function(){this.eE=void 0;this.state=ea.EXTERNAL_XFDF_NOT_REQUESTED};f.prototype.EZ=function(f){return f?Array.isArray(f)?new aa.a(f):"string"!==typeof f?null:(new DOMParser).parseFromString(f,"text/xml").querySelector("xfdf > add")?new aa.a(f):new fa.a(f):null};f.prototype.merge=function(f,e,n){var x=
this;0===n&&(this.F5(f,e.pn),this.H5(f,e.ND));var r=e.aa[n];r&&(this.I5(f,r.zl),this.K5(f,r.eU,e.xt),this.J5(f,r.page,n),this.G5(f,r.LM));r=this.N.fc();if(n===r-1){var h=e.xt;Object.keys(h).forEach(function(e){h[e].kF||x.YP(f,e,h[e])})}};f.prototype.F5=function(f,e){null!==e&&(f=this.Hs(f),this.Eo(f,"calculation-order",e))};f.prototype.H5=function(f,e){null!==e&&(f=this.Hs(f),this.Eo(f,"document-actions",e))};f.prototype.I5=function(f,e){var n=this,x=this.Gs(f.querySelector("xfdf"),"annots");Object.keys(e).forEach(function(f){n.Eo(x,
'[name="'+f+'"]',e[f])})};f.prototype.K5=function(f,e,n){var x=this;if(0!==e.length){var r=this.Hs(f);e.forEach(function(e){var h=e.getAttribute("field"),y=n[h];y&&(x.YP(f,h,y),x.Eo(r,"null",e))})}};f.prototype.YP=function(f,e,n){var x=this.Hs(f);null!==n.xy&&this.Eo(x,'ffield [name="'+e+'"]',n.xy);f=this.Gs(f.querySelector("xfdf"),"fields");e=e.split(".");this.MG(f,e,0,n.value);n.kF=!0};f.prototype.J5=function(f,e,n){null!==e&&(f=this.Hs(f),f=this.Gs(f,"pages"),this.Eo(f,'[number="'+(n+1)+'"]',e))};
f.prototype.G5=function(f,e){Object.keys(e).forEach(function(e){(e=f.querySelector('annots [name="'+e+'"]'))&&e.parentElement.removeChild(e)})};f.prototype.MG=function(f,e,n,y){if(n===e.length)e=document.createElementNS("","value"),e.textContent=y,this.Eo(f,"value",e);else{var r=e[n];this.Gs(f,'[name="'+r+'"]',"field").setAttribute("name",r);f=f.querySelectorAll('[name="'+r+'"]');1===f.length?this.MG(f[0],e,n+1,y):(r=this.b1(f),this.MG(n===e.length-1?r:this.Paa(f,r),e,n+1,y))}};f.prototype.b1=function(f){for(var e=
null,n=0;n<f.length;n++){var x=f[n];if(0===x.childElementCount||1===x.childElementCount&&"value"===x.children[0].tagName){e=x;break}}return e};f.prototype.Paa=function(f,e){for(var n=0;n<f.length;n++)if(f[n]!==e)return f[n];return null};f.prototype.Eo=function(f,e,n){e=f.querySelector(e);null!==e&&f.removeChild(e);f.appendChild(n)};f.prototype.Hs=function(f){var e=f.querySelector("pdf-info");if(null!==e)return e;e=this.Gs(f.querySelector("xfdf"),"pdf-info");e.setAttribute("xmlns","http://www.pdftron.com/pdfinfo");
e.setAttribute("version","2");e.setAttribute("import-version","3");return e};f.prototype.Gs=function(f,e,n){var x=f.querySelector(e);if(null!==x)return x;x=document.createElementNS("",n||e);f.appendChild(x);return x};return f}();da["default"]=ha},374:function(ha,da){ha=function(){function f(){}f.prototype.ix=function(f){var aa={pn:null,ND:null,xt:{},aa:{}};f=(new DOMParser).parseFromString(f,"text/xml");aa.pn=f.querySelector("pdf-info calculation-order");aa.ND=f.querySelector("pdf-info document-actions");
aa.xt=this.A6(f);aa.aa=this.M6(f);return aa};f.prototype.A6=function(f){var aa=f.querySelector("fields");f=f.querySelectorAll("pdf-info > ffield");if(null===aa&&null===f)return{};var ca={};this.HX(ca,aa);this.FX(ca,f);return ca};f.prototype.HX=function(f,aa){if(null!==aa&&aa.children){for(var ca=[],da=0;da<aa.children.length;da++){var z=aa.children[da];ca.push({name:z.getAttribute("name"),element:z})}for(;0!==ca.length;)for(aa=ca.shift(),da=0;da<aa.element.children.length;da++)z=aa.element.children[da],
"value"===z.tagName?f[aa.name]={value:z.textContent,xy:null,kF:!1}:z.children&&ca.push({name:aa.name+"."+z.getAttribute("name"),element:z})}};f.prototype.FX=function(f,aa){aa.forEach(function(aa){var ca=aa.getAttribute("name");f[ca]?f[ca].xy=aa:f[ca]={value:null,xy:aa,kF:!1}})};f.prototype.M6=function(f){var aa=this,ca={};f.querySelectorAll("pdf-info widget").forEach(function(f){var z=parseInt(f.getAttribute("page"),10)-1;aa.qz(ca,z);ca[z].eU.push(f)});f.querySelectorAll("pdf-info page").forEach(function(f){var z=
parseInt(f.getAttribute("number"),10)-1;aa.qz(ca,z);ca[z].page=f});this.aO(f).forEach(function(f){var z=parseInt(f.getAttribute("page"),10),x=f.getAttribute("name");aa.qz(ca,z);ca[z].zl[x]=f});this.LN(f).forEach(function(f){var z=parseInt(f.getAttribute("page"),10);f=f.textContent;aa.qz(ca,z);ca[z].LM[f]=!0});return ca};f.prototype.qz=function(f,aa){f[aa]||(f[aa]={zl:{},LM:{},eU:[],page:null})};return f}();da.a=ha},388:function(ha,da,f){var ca=f(3),aa=f(0);f.n(aa);ha=function(f){function da(z){var x=
f.call(this)||this;x.R0=Array.isArray(z)?z:[z];return x}Object(ca.c)(da,f);da.prototype.parse=function(){var f=this,x={pn:null,ND:null,xt:{},aa:{}};this.R0.forEach(function(e){x=Object(aa.merge)(x,f.ix(e))});return x};da.prototype.aO=function(f){var x=[];f.querySelectorAll("add > *").forEach(function(e){x.push(e)});f.querySelectorAll("modify > *").forEach(function(e){x.push(e)});return x};da.prototype.LN=function(f){return f.querySelectorAll("delete > *")};return da}(f(374).a);da.a=ha},389:function(ha,
da,f){var ca=f(3);ha=function(f){function aa(aa){var z=f.call(this)||this;z.S0=aa;return z}Object(ca.c)(aa,f);aa.prototype.parse=function(){return this.ix(this.S0)};aa.prototype.aO=function(f){return f.querySelectorAll("annots > *")};aa.prototype.LN=function(){return[]};return aa}(f(374).a);da.a=ha}}]);}).call(this || window)