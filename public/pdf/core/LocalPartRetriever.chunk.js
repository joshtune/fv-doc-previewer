/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function(){(window.wpCoreControlsBundle=window.wpCoreControlsBundle||[]).push([[10],{350:function(ha,da,f){f.r(da);var ca=f(3),aa=f(1),fa=f(119);ha=f(75);var ea=f(202);f=f(303);var z=window;ha=function(f){function e(e,x,r){x=f.call(this,e,x,r)||this;if(e.name&&"xod"!==e.name.toLowerCase().split(".").pop())throw Error("Not an XOD file");if(!z.FileReader||!z.File||!z.Blob)throw Error("File API is not supported in this browser");x.file=e;x.Mx=[];x.BD=0;return x}Object(ca.c)(e,f);e.prototype.aG=function(e,f,r){var h=
this,n=new FileReader;n.onloadend=function(e){if(0<h.Mx.length){var w=h.Mx.shift();w.V7.readAsBinaryString(w.file)}else h.BD--;if(n.error){e=n.error;if(e.code===e.ABORT_ERR){Object(aa.h)("Request for chunk "+f.start+"-"+f.stop+" was aborted");return}return r(e)}if(e=n.content||e.target.result)return r(!1,e);Object(aa.h)("No data was returned from FileReader.")};f&&(e=(e.slice||e.webkitSlice||e.mozSlice||e.Qda).call(e,f.start,f.stop));0===h.Mx.length&&50>h.BD?(n.readAsBinaryString(e),h.BD++):h.Mx.push({V7:n,
file:e});return function(){n.abort()}};e.prototype.Oq=function(e){var f=this;f.Ix=!0;var n=fa.a;f.aG(f.file,{start:-n,stop:f.file.size},function(h,r){if(h)return Object(aa.h)("Error loading end header: %s "+h),e(h);if(r.length!==n)throw Error("Zip end header data is wrong size!");f.Hd=new ea.a(r);var w=f.Hd.MN();f.aG(f.file,w,function(h,n){if(h)return Object(aa.h)("Error loading central directory: %s "+h),e(h);if(n.length!==w.stop-w.start)throw Error("Zip central directory data is wrong size!");f.Hd.fR(n);
f.nD=!0;f.Ix=!1;return e(!1)})})};e.prototype.PG=function(e,f){var n=this,h=n.Wg[e];if(n.Hd.tM(e)){var w=n.Hd.Ht(e),x=n.aG(n.file,w,function(h,r){delete n.Wg[e];if(h)return Object(aa.h)('Error loading part "%s": %s, '+e+", "+h),f(h);if(r.length!==w.stop-w.start)throw Error("Part data is wrong size!");f(!1,e,r,n.Hd.jP(e))});h.oT=!0;h.cancel=x}else f(Error('File not found: "'+e+'"'),e)};return e}(ha.a);Object(f.a)(ha);Object(f.b)(ha);da["default"]=ha}}]);}).call(this || window)
