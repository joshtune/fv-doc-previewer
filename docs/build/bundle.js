
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var webviewer_min = createCommonjsModule(function (module, exports) {
    !function(e,t){module.exports=t();}(window,(function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o});},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0});},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s=1)}([function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")();}catch(e){"object"==typeof window&&(n=window);}e.exports=n;},function(e,t,n){n(2),e.exports=n(6);},function(e,t,n){(function(o,i){var r,a;function s(e){return (s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}!function(o,i){"object"==s(t)&&void 0!==e?i():void 0===(a="function"==typeof(r=i)?r.call(t,n,t,e):r)||(e.exports=a);}(0,(function(){function e(e){var t=this.constructor;return this.then((function(n){return t.resolve(e()).then((function(){return n}))}),(function(n){return t.resolve(e()).then((function(){return t.reject(n)}))}))}function t(){}function n(e){if(!(this instanceof n))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],d(e,this);}function r(e,t){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,n._immediateFn((function(){var n=1===e._state?t.onFulfilled:t.onRejected;if(null!==n){var o;try{o=n(e._value);}catch(e){return void c(t.promise,e)}a(t.promise,o);}else (1===e._state?a:c)(t.promise,e._value);}))):e._deferreds.push(t);}function a(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==s(t)||"function"==typeof t)){var o=t.then;if(t instanceof n)return e._state=3,e._value=t,void l(e);if("function"==typeof o)return void d(function(e,t){return function(){e.apply(t,arguments);}}(o,t),e)}e._state=1,e._value=t,l(e);}catch(t){c(e,t);}}function c(e,t){e._state=2,e._value=t,l(e);}function l(e){2===e._state&&0===e._deferreds.length&&n._immediateFn((function(){e._handled||n._unhandledRejectionFn(e._value);}));for(var t=0,o=e._deferreds.length;o>t;t++)r(e,e._deferreds[t]);e._deferreds=null;}function d(e,t){var n=!1;try{e((function(e){n||(n=!0,a(t,e));}),(function(e){n||(n=!0,c(t,e));}));}catch(e){if(n)return;n=!0,c(t,e);}}var u=setTimeout;n.prototype.catch=function(e){return this.then(null,e)},n.prototype.then=function(e,n){var o=new this.constructor(t);return r(this,new function(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n;}(e,n,o)),o},n.prototype.finally=e,n.all=function(e){return new n((function(t,n){function o(e,a){try{if(a&&("object"==s(a)||"function"==typeof a)){var c=a.then;if("function"==typeof c)return void c.call(a,(function(t){o(e,t);}),n)}i[e]=a,0==--r&&t(i);}catch(e){n(e);}}if(!e||void 0===e.length)throw new TypeError("Promise.all accepts an array");var i=Array.prototype.slice.call(e);if(0===i.length)return t([]);for(var r=i.length,a=0;i.length>a;a++)o(a,i[a]);}))},n.resolve=function(e){return e&&"object"==s(e)&&e.constructor===n?e:new n((function(t){t(e);}))},n.reject=function(e){return new n((function(t,n){n(e);}))},n.race=function(e){return new n((function(t,n){for(var o=0,i=e.length;i>o;o++)e[o].then(t,n);}))},n._immediateFn="function"==typeof o&&function(e){o(e);}||function(e){u(e,0);},n._unhandledRejectionFn=function(e){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",e);};var f=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==i)return i;throw Error("unable to locate global object")}();"Promise"in f?f.Promise.prototype.finally||(f.Promise.prototype.finally=e):f.Promise=n;}));}).call(this,n(3).setImmediate,n(0));},function(e,t,n){(function(e){var o=void 0!==e&&e||"undefined"!=typeof self&&self||window,i=Function.prototype.apply;function r(e,t){this._id=e,this._clearFn=t;}t.setTimeout=function(){return new r(i.call(setTimeout,o,arguments),clearTimeout)},t.setInterval=function(){return new r(i.call(setInterval,o,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e&&e.close();},r.prototype.unref=r.prototype.ref=function(){},r.prototype.close=function(){this._clearFn.call(o,this._id);},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t;},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1;},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout((function(){e._onTimeout&&e._onTimeout();}),t));},n(4),t.setImmediate="undefined"!=typeof self&&self.setImmediate||void 0!==e&&e.setImmediate||this&&this.setImmediate,t.clearImmediate="undefined"!=typeof self&&self.clearImmediate||void 0!==e&&e.clearImmediate||this&&this.clearImmediate;}).call(this,n(0));},function(e,t,n){(function(e,t){!function(e,n){if(!e.setImmediate){var o,i,r,a,s,c=1,l={},d=!1,u=e.document,f=Object.getPrototypeOf&&Object.getPrototypeOf(e);f=f&&f.setTimeout?f:e,"[object process]"==={}.toString.call(e.process)?o=function(e){t.nextTick((function(){h(e);}));}:!function(){if(e.postMessage&&!e.importScripts){var t=!0,n=e.onmessage;return e.onmessage=function(){t=!1;},e.postMessage("","*"),e.onmessage=n,t}}()?e.MessageChannel?((r=new MessageChannel).port1.onmessage=function(e){h(e.data);},o=function(e){r.port2.postMessage(e);}):u&&"onreadystatechange"in u.createElement("script")?(i=u.documentElement,o=function(e){var t=u.createElement("script");t.onreadystatechange=function(){h(e),t.onreadystatechange=null,i.removeChild(t),t=null;},i.appendChild(t);}):o=function(e){setTimeout(h,0,e);}:(a="setImmediate$"+Math.random()+"$",s=function(t){t.source===e&&"string"==typeof t.data&&0===t.data.indexOf(a)&&h(+t.data.slice(a.length));},e.addEventListener?e.addEventListener("message",s,!1):e.attachEvent("onmessage",s),o=function(t){e.postMessage(a+t,"*");}),f.setImmediate=function(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),n=0;n<t.length;n++)t[n]=arguments[n+1];var i={callback:e,args:t};return l[c]=i,o(c),c++},f.clearImmediate=p;}function p(e){delete l[e];}function h(e){if(d)setTimeout(h,0,e);else {var t=l[e];if(t){d=!0;try{!function(e){var t=e.callback,n=e.args;switch(n.length){case 0:t();break;case 1:t(n[0]);break;case 2:t(n[0],n[1]);break;case 3:t(n[0],n[1],n[2]);break;default:t.apply(void 0,n);}}(t);}finally{p(e),d=!1;}}}}}("undefined"==typeof self?void 0===e?this:e:self);}).call(this,n(0),n(5));},function(e,t){var n,o,i=e.exports={};function r(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function s(e){if(n===setTimeout)return setTimeout(e,0);if((n===r||!n)&&setTimeout)return n=setTimeout,setTimeout(e,0);try{return n(e,0)}catch(t){try{return n.call(null,e,0)}catch(t){return n.call(this,e,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:r;}catch(e){n=r;}try{o="function"==typeof clearTimeout?clearTimeout:a;}catch(e){o=a;}}();var c,l=[],d=!1,u=-1;function f(){d&&c&&(d=!1,c.length?l=c.concat(l):u=-1,l.length&&p());}function p(){if(!d){var e=s(f);d=!0;for(var t=l.length;t;){for(c=l,l=[];++u<t;)c&&c[u].run();u=-1,t=l.length;}c=null,d=!1,function(e){if(o===clearTimeout)return clearTimeout(e);if((o===a||!o)&&clearTimeout)return o=clearTimeout,clearTimeout(e);try{o(e);}catch(t){try{return o.call(null,e)}catch(t){return o.call(this,e)}}}(e);}}function h(e,t){this.fun=e,this.array=t;}function m(){}i.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];l.push(new h(e,t)),1!==l.length||d||s(p);},h.prototype.run=function(){this.fun.apply(null,this.array);},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=m,i.addListener=m,i.once=m,i.off=m,i.removeListener=m,i.removeAllListeners=m,i.emit=m,i.prependListener=m,i.prependOnceListener=m,i.listeners=function(e){return []},i.binding=function(e){throw new Error("process.binding is not supported")},i.cwd=function(){return "/"},i.chdir=function(e){throw new Error("process.chdir is not supported")},i.umask=function(){return 0};},function(e,t,n){n.r(t),n.d(t,"getInstance",(function(){return b}));var o={ASM:"asm",WASM:"ems",JS_WORKER:"jsworker",THREADED_WASM:"wasm-threads"};function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o);}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t));}));}return e}function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s={},c=0;"undefined"==typeof console&&(window.console={log:function(){},warn:function(){},error:function(){}});var l=function(){for(var e=1;e<arguments.length;e++)for(var t=Object.keys(arguments[e]),n=0;n<t.length;n++)arguments[0][t[n]]=arguments[e][t[n]];return arguments[0]},d=function(e){var t=[];return e.forEach((function(e){t.push(e);})),t},u=function(e,t){var n;try{n=new CustomEvent(e,{detail:t,bubbles:!0,cancelable:!0});}catch(o){(n=document.createEvent("Event")).initEvent(e,!0,!0),n.detail=t;}return n};window.PDFNet&&!s.skipPDFNetWebViewerWarning&&console.warn("PDFNet.js and WebViewer.js have been included in the same context. See https://www.pdftron.com/kb_same_context for an explanation of why this could be an error in your application.");var f=new Map,p=new Map;s.WebViewer=function(e,t){var n=this;if(p.get(t))throw new Error("Two instances of WebViewer were created on the same HTML element. Please create a new element for each instance of WebViewer");p.set(t,!0);t.addEventListener("ready",(function e(){f.get(t).instance=n.getCompleteInstance(),t.removeEventListener("ready",e);})),this._validateOptions(e);var o=e.webviewerServerURL||e.pdftronServer;e.fullAPI&&o&&(e.forceClientSideInit||console.warn("The fullAPI and webviewerServerURL options have both been set so the forceClientSideInit option is now enabled. This means that WebViewer will switch to client side rendering and processing to allow use of the full API."),e.forceClientSideInit=!0),this.options=l({},s.WebViewer.Options,e);var i=this.options.path.length-1;i>0&&"/"!==this.options.path[i]&&(this.options.path+="/"),this.options.uiPath=this.options.path+this.options.uiPath,t||console.error("ViewerElement is not defined. This may be caused by calling the WebViewer constructor before the DOM is loaded, or an invalid selector. Please see http://r.pdftron.com/guides/quick-start for an example."),this.element=t,this.element.style.overflow="hidden";var r=this;this.messageHandler=function(t){if("requestl"===t.data&&t.source&&t.source.postMessage({type:"responsel",value:e.l||e.licenseKey},"*"),"requestConfig"===t.data.type&&t.data.id===r.id&&t.source){var n=e.config?r._correctRelativePath(e.config):"";t.source.postMessage({type:"responseConfig",value:n},"*");}},window.addEventListener("message",this.messageHandler,!1),this.options.autoCreate&&this.create();};var h={licenseKey:void 0,enableAzureWorkaround:!1,isAdminUser:!1,isReadOnly:!1};s.WebViewer.prototype={version:"8.3.0",create:function(){if(this.options.initialDoc){var e=this._correctRelativePath(this.options.initialDoc);e=encodeURIComponent(e),this.options.initialDoc=e,this._create();}else this._create();},_create:function(){this.id=++c,void 0===this._trigger&&(this._trigger=function(e,t){var n=u(e,t);this.element.dispatchEvent(n);});var e=this.options.type.replace(" ","").split(",");e.length<1&&(e[0]="html5"),this._createViewer(e);},_validateOptions:function(e){for(var t=Object.keys(e),n=0;n<t.length;n++){var o=t[n];o in l({},h,s.WebViewer.Options)||console.warn("".concat(o," is not a valid option name. See http://r.pdftron.com/api/options_anchor for all available options."));}var i=e.webviewerServerURL||e.pdftronServer;!e.enableRedaction||e.fullAPI||i||console.warn("FullAPI or WebViewer Server is needed to apply redactions");},_notSupportedMobile:function(){var e=document.createElement("div");e.id="webviewer-browser-unsupported",e.textContent="PDF document viewing is not supported by this browser.",this.element.appendChild(e);},_createViewer:function(e){var t,n=this;if(n.selectedType=null,this.isMobileDevice()){if(this.options.documentType&&"xod"!==this.options.documentType&&!this._testWebAssembly())return void this._notSupportedMobile();if(e=Array("html5Mobile"),n.selectedType="html5Mobile",this.options.mobileRedirect)return t=this.options.uiPath+this._getHTML5OptionsURL(),void(window.location=t)}for(var o=!1,i=!1,r=0;r<e.length;r++){if("html5mobile"===e[r].toLowerCase()){if(this.options.documentType&&"xod"!==this.options.documentType&&!this._testWebAssembly())continue;if(o=!0,n._testHTML5()){if(this.options.mobileRedirect)return n.selectedType="html5Mobile",t=this.options.uiPath+this._getHTML5OptionsURL(),void(window.location=t);if(this.options.xdomainProxyUrl||n.isSameOrigin(decodeURIComponent(n.options.initialDoc))||n._testCORS()){n.selectedType="html5Mobile";break}i=!0;}}if("html5"===e[r].toLowerCase()&&(o=!0,n._testHTML5())){var a=n.isSameOrigin(decodeURIComponent(n.options.initialDoc));if(this.options.xdomainProxyUrl||a||n._testCORS()){n.selectedType="html5";break}i=!0;}}if("html5"===n.selectedType)n._createHTML5();else if("html5Mobile"===n.selectedType)n._createHTML5Mobile();else {var s;if(i?s="This browser does not support cross origin requests. Please configure xdomain to support CORS.":o&&(s="Please use an HTML5 compatible browser."),s){var c=document.createElement("div");c.id="webviewer-browser-unsupported",c.textContent=s,n.element.appendChild(c);}}},_viewerLoaded:function(e){this._trigger("ready");try{var t=e.contentWindow;if(t.postMessage({type:"viewerLoaded"},"*"),void 0!==this.options.encryption){var n=decodeURIComponent(this.options.initialDoc),o={decrypt:t.CoreControls.Encryption.decrypt,decryptOptions:this.options.encryption,documentId:this.options.documentId,extension:"xod"};this.loadDocument(n,o);}}catch(e){console.warn("Viewer is on a different domain, the promise from WebViewer function is rejected and API functions will not work because of cross domain permissions. See http://r.pdftron.com/kb_cross_origin for more information.");}},_getHTML5OptionsURL:function(){var e,t,n,o=this.options,i=o.webviewerServerURL||o.pdftronServer,r="";if(o.initialDoc&&(r+="#d=".concat(o.initialDoc)),void 0===o.backendType&&(o.backendType=o.pdfBackend),o.documentType&&"xod"===o.documentType&&(e=o.documentType),o.preloadWorker&&"xod"===o.preloadWorker&&(e=o.preloadWorker),o.extension&&(e=o.extension),e&&(r+="&extension=".concat(e)),o.documentType&&"xod"!==o.documentType&&(t=o.documentType),o.preloadWorker&&"xod"!==o.preloadWorker&&(t=o.preloadWorker),t&&(r+="&preloadWorker=".concat(t)),o.backendType&&(r+="&pdf=".concat(o.backendType,"&office=").concat(o.backendType,"&legacyOffice=").concat(o.backendType)),o.filename&&(r+="&filename=".concat(o.filename)),void 0!==o.streaming&&(r+="&streaming=".concat(o.streaming)),o.externalPath){var a=this._correctRelativePath(o.externalPath);a=encodeURIComponent(a),r+="&p=".concat(a);}if(o.encryption&&(r+="&auto_load=false"),o.enableAnnotations&&(r+="&a=1"),o.disabledElements){var s=encodeURIComponent(o.disabledElements.join(","));r+="&disabledElements=".concat(s);}if(o.serverUrl){var c=this._correctRelativePath(o.serverUrl);c=encodeURIComponent(c),r+="&server_url=".concat(c);}if(o.serverUrlHeaders&&(r+="&serverUrlHeaders=".concat(JSON.stringify(o.serverUrlHeaders))),o.documentId&&(r+="&did=".concat(o.documentId)),o.css){var l=this._correctRelativePath(o.css);l=encodeURIComponent(l),r+="&css=".concat(l);}(o.disableI18n&&(r+="&disableI18n=1"),o.enableOfflineMode&&(r+="&offline=1"),o.startOffline&&(r+="&startOffline=1"),(o.enableReadOnlyMode||o.isReadOnly)&&(r+="&readonly=1"),o.hideAnnotationPanel&&(r+="&hideAnnotationPanel=1"),o.disableToolGroupReordering&&(r+="&disableToolGroupReordering=1"),void 0!==o.annotationUser&&(r+="&user=".concat(o.annotationUser)),void 0===o.annotationAdmin&&void 0===o.isAdminUser||(r+="&admin=".concat(o.annotationAdmin||o.isAdminUser?1:0)),void 0!==o.custom&&(r+="&custom=".concat(encodeURIComponent(o.custom))),void 0===o.showLocalFilePicker&&void 0===o.enableFilePicker||(r+="&filepicker=".concat(o.showLocalFilePicker||o.enableFilePicker?1:0)),void 0!==o.fullAPI&&(r+="&pdfnet=".concat(o.fullAPI?1:0)),void 0!==o.enableRedaction&&(r+="&enableRedaction=".concat(o.enableRedaction?1:0)),void 0!==o.enableMeasurement&&(r+="&enableMeasurement=".concat(o.enableMeasurement?1:0)),void 0!==o.showToolbarControl&&(r+="&toolbar=".concat(o.showToolbarControl?"true":"false")),void 0!==o.showPageHistoryButtons&&(r+="&pageHistory=".concat(o.showPageHistoryButtons?1:0)),void 0!==o.notesInLeftPanel&&(r+="&notesInLeftPanel=".concat(o.notesInLeftPanel?1:0)),void 0!==o.xdomainProxyUrl)&&(n="string"==typeof o.xdomainProxyUrl?{url:o.xdomainProxyUrl}:o.xdomainProxyUrl,r+="&xdomain_urls=".concat(encodeURIComponent(JSON.stringify(n))));return (o.azureWorkaround||o.enableAzureWorkaround)&&(r+="&azureWorkaround=1"),o.useDownloader||(r+="&useDownloader=0"),o.disableWebsockets&&(r+="&disableWebsockets=1"),o.disableStreaming&&(r+="&disableStreaming=1"),o.forceClientSideInit&&(r+="&forceClientSideInit=1"),o.loadAsPDF&&(r+="&loadAsPDF=1"),void 0!==o.workerTransportPromise&&(r+="&useSharedWorker=".concat(o.workerTransportPromise?"true":"false")),void 0!==i&&i&&(r+="&webviewerServerURL=".concat(encodeURIComponent(i))),o.fallbackToClientSide&&(r+="&fallbackToClientSide=1"),void 0!==o.singleServerMode&&(r+="&singleServerMode=".concat(o.singleServerMode?"true":"false")),void 0!==o.accessibleMode&&(r+="&accessibleMode=".concat(o.accessibleMode?1:0)),o.disableLogs&&(r+="&disableLogs=1"),o.enableViewStateAnnotations&&(r+="&enableViewStateAnnotations=1"),o.disableFlattenedAnnotations&&(r+="&disableFlattenedAnnotations=1"),o.highContrastMode&&(r+="&highContrastMode=1"),void 0!==o.selectAnnotationOnCreation&&(r+="&selectAnnotationOnCreation=".concat(o.selectAnnotationOnCreation?1:0)),void 0!==o.autoFocusNoteOnAnnotationSelection&&(r+="&autoFocusNoteOnAnnotationSelection=".concat(o.autoFocusNoteOnAnnotationSelection?1:0)),(r+="&id=".concat(this.id)).length>0&&"&"===r[0]&&(r="#".concat(r.slice(1))),r},setInstanceData:function(e){f.set(this.element,{iframe:e,l:this.options.l||this.options.licenseKey,workerTransportPromise:this.options.workerTransportPromise});},_createHTML5:function(){var e=this,t=this.options.uiPath+this._getHTML5OptionsURL(),n=document.createElement("iframe");this.setInstanceData(n),n.id="webviewer-".concat(this.id),n.src=t,n.title="webviewer",n.frameBorder=0,n.width="100%",n.height="100%",n.setAttribute("allowfullscreen",!0),n.setAttribute("webkitallowfullscreen",!0),n.setAttribute("mozallowfullscreen",!0),this.iframe=n,this.options.backgroundColor&&n.setAttribute("data-bgcolor",this.options.backgroundColor),this.options.assetPath&&n.setAttribute("data-assetpath",encodeURIComponent(this.options.assetPath)),this.loadListener=function(){var t=e.iframe;try{e.instance=t.contentWindow.instance,void 0===e.instance?t.contentWindow.addEventListener("viewerLoaded",(function(){e.instance=t.contentWindow.instance,e._viewerLoaded(t);})):e._viewerLoaded(t);}catch(n){e._viewerLoaded(t);}},n.addEventListener("load",this.loadListener),this.element.appendChild(n);},_createHTML5Mobile:function(){var e=this,t=this.options.uiPath+this._getHTML5OptionsURL(),n=document.createElement("iframe");this.setInstanceData(n),n.id="webviewer-".concat(this.id),n.src=t,n.frameborder=0,this.options.assetPath&&n.setAttribute("data-assetpath",encodeURIComponent(this.options.assetPath)),n.style.width="100%",n.style.height="100%",this.iframe=n,this.loadListener=function(){var t=e.iframe;try{e.instance=t.contentWindow.instance,void 0===e.instance?t.contentWindow.addEventListener("viewerLoaded",(function(){e.instance=t.contentWindow.instance,e._viewerLoaded(t);})):e._viewerLoaded(t);}catch(n){e._viewerLoaded(t);}},n.addEventListener("load",this.loadListener),this.element.appendChild(n);},dispose:function(){f.delete(this.element),p.delete(this.element),this.instance.closeDocument(),window.removeEventListener("message",this.messageHandler),this.iframe.removeEventListener("load",this.loadListener),this.iframe=null;},getInstance:function(){return this.instance},setCompleteInstance:function(e){this.completeInstance=e;},getCompleteInstance:function(){return this.completeInstance},_correctRelativePath:function(e){if("string"!=typeof e)return e;var t=window.location.pathname.substr(0,window.location.pathname.lastIndexOf("/"));return /^(\/|%2F|[a-z0-9-]+:)/i.test(e)?e:"".concat(t,"/").concat(e)},_testHTML5:function(){try{var e=document.createElement("canvas");return e&&e.getContext("2d")}catch(e){return !1}},_testWebAssembly:function(){return !(!window.WebAssembly||!window.WebAssembly.validate)},_testCORS:function(){return "XMLHttpRequest"in window&&"withCredentials"in new XMLHttpRequest},isIE:function(){var e=navigator.userAgent.toLowerCase(),t=/(msie) ([\w.]+)/.exec(e)||/(trident)(?:.*? rv:([\w.]+)|)/.exec(e);return t?parseInt(t[2],10):t},isMobileDevice:function(){return !this.isIE()&&(0===this.scrollbarWidth()&&navigator.userAgent.match(/Edge/i)||navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/Touch/i)||navigator.userAgent.match(/IEMobile/i)||navigator.userAgent.match(/Silk/i))},scrollbarWidth:function(){var e=document.createElement("div");e.style.cssText="width:100px;height:100px;overflow:scroll !important;position:absolute;top:-9999px",document.body.appendChild(e);var t=e.offsetWidth-e.clientWidth;return document.body.removeChild(e),t},isSameOrigin:function(e){var t=window.location,n=document.createElement("a");n.href=e,""===n.host&&(n.href=n.href);var o=window.location.port,i=n.port;return "http:"===n.protocol?(i=i||"80",o=o||"80"):"https:"===n.protocol&&(i=i||"443",o=o||"443"),n.hostname===t.hostname&&n.protocol===t.protocol&&i===o}},s.WebViewer.Options={initialDoc:void 0,annotationAdmin:void 0,isAdminUser:void 0,annotationUser:void 0,assetPath:void 0,autoCreate:!0,autoFocusNoteOnAnnotationSelection:!0,azureWorkaround:!1,additionalTranslations:void 0,enableAzureWorkaround:!1,backgroundColor:void 0,backendType:void 0,css:void 0,config:void 0,custom:void 0,documentId:void 0,documentType:void 0,preloadWorker:void 0,extension:void 0,enableAnnotations:!0,filename:void 0,disableI18n:!1,disabledElements:void 0,disableWebsockets:!1,enableOfflineMode:!1,enableReadOnlyMode:!1,isReadOnly:!1,enableRedaction:!1,enableMeasurement:!1,encryption:void 0,externalPath:void 0,hideAnnotationPanel:!1,disableToolGroupReordering:!1,uiPath:"./ui/index.html",l:void 0,licenseKey:void 0,mobileRedirect:!1,path:"",pdfBackend:void 0,webviewerServerURL:void 0,fallbackToClientSide:!1,singleServerMode:!1,fullAPI:!1,preloadPDFWorker:!0,serverUrl:void 0,serverUrlHeaders:void 0,showLocalFilePicker:!1,enableFilePicker:!1,showPageHistoryButtons:!0,showToolbarControl:void 0,startOffline:!1,streaming:void 0,type:"html5",useDownloader:!0,workerTransportPromise:void 0,xdomainProxyUrl:void 0,ui:void 0,forceClientSideInit:!1,loadAsPDF:!1,accessibleMode:void 0,disableLogs:!1,enableViewStateAnnotations:!1,highContrastMode:!1,selectAnnotationOnCreation:!1,notesInLeftPanel:!1,documentXFDFRetriever:void 0,disableFlattenedAnnotations:!1,disableStreaming:!1};var m=function(e,t){return new Promise((function(n,o){e.l=e.l||e.licenseKey,e.azureWorkaround=e.azureWorkaround||e.enableAzureWorkaround,e.annotationAdmin=e.annotationAdmin||e.isAdminUser,e.enableReadOnlyMode=e.enableReadOnlyMode||e.isReadOnly,e.showLocalFilePicker=e.showLocalFilePicker||e.enableFilePicker;t.addEventListener("ready",(function s(){t.removeEventListener("ready",s);try{var c=t.querySelector("iframe").contentWindow;if(void 0===c.Tools)return o("Viewer isn't instantiated correctly. It could be caused by the 'path' option in the WebViewer constructor not being defined correctly. The 'path' option should be relative to the HTML file you're loading the script on and the lib folder needs to be publicly accessible.");var d=i.getInstance(),u={iframeWindow:c,dispose:i.dispose.bind(i)},f=l({},d,r(a({},d.UI_NAMESPACE_KEY,r(r({},d[d.UI_NAMESPACE_KEY]),u)),u));i.setCompleteInstance(f);var p=Promise.resolve();if(e.documentXFDFRetriever&&(p=f[d.CORE_NAMESPACE_KEY].documentViewer.setDocumentXFDFRetriever(e.documentXFDFRetriever)),e.additionalTranslations){var h=e.additionalTranslations;f[d.UI_NAMESPACE_KEY].setTranslations(h.language,h.translations);}p.then((function(){n(f);}));}catch(e){o("Viewer is on a different domain, the promise from WebViewer function is rejected and API functions will not work because of cross domain permissions. See https://www.pdftron.com/kb_cross_origin for more information.");}}));var i=new s.WebViewer(e,t);}))},v=function(e){for(var t=d(f),n=0;n<t.length;n++){var o=t[n];if(o.iframe===e)return o}return null};m.l=function(e){var t=v(e);return t&&t.l},m.workerTransportPromise=function(e){var t=v(e);return t&&t.workerTransportPromise},m.WorkerTypes={ALL:"all",OFFICE:"office",LEGACY_OFFICE:"legacyOffice",PDF:"pdf",CONTENT_EDIT:"contentEdit"},m.BackendTypes=o;var b=function(e){var t=d(f);if(!t.length||!t.filter((function(e){return e.instance})).length)return console.warn("WebViewer.getInstance() was called before any instances were available"),null;if(t.length>1&&!e)throw new Error("More than one instance of WebViewer was found, and no element was passed into getInstance(). Please specify which instance you want to get.");return e?(f.get(e)||{}).instance:(t[0]||{}).instance};m.getInstance=b,window.WebViewer=m;t.default=m;}])}));
    });

    var getInstance = /*@__PURE__*/getDefaultExportFromCjs(webviewer_min);

    // export const LICENSE_KEY = 'Filevine Inc (filevine.com):OEM:Filevine, VineSign::B+:AMS(20221205):28A5390D04A7560A7360B13AD98253F260615FF59928BD2BDD1CE4C2876400F65AAAB6F5C7';
    const LICENSE_KEY = '';

    /* src\App.svelte generated by Svelte v3.38.2 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (73:0) {#each documentItems as doc}
    function create_each_block(ctx) {
    	let button;
    	let t_value = /*doc*/ ctx[5].fileName + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*doc*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			add_location(button, file, 73, 4, 2308);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(73:0) {#each documentItems as doc}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let h1;
    	let t1;
    	let t2;
    	let div0;
    	let t3;

    	let t4_value = (/*documentItem*/ ctx[0]
    	? /*documentItem*/ ctx[0].fileName
    	: "No Document Selected") + "";

    	let t4;
    	let br0;
    	let t5;

    	let t6_value = (/*documentItem*/ ctx[0]
    	? /*documentItem*/ ctx[0].downloadLink
    	: "No Document Selected") + "";

    	let t6;
    	let br1;
    	let t7;
    	let div1;
    	let each_value = /*documentItems*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "App.svelte";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div0 = element("div");
    			t3 = text("Document: ");
    			t4 = text(t4_value);
    			br0 = element("br");
    			t5 = text("\r\n    Document URL: ");
    			t6 = text(t6_value);
    			br1 = element("br");
    			t7 = space();
    			div1 = element("div");
    			add_location(h1, file, 70, 0, 2251);
    			add_location(br0, file, 77, 77, 2494);
    			add_location(br1, file, 78, 85, 2586);
    			attr_dev(div0, "class", "document-info svelte-sygs7z");
    			add_location(div0, file, 76, 0, 2388);
    			attr_dev(div1, "id", docElementId);
    			set_style(div1, "height", "64vh");
    			add_location(div1, file, 81, 0, 2603);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			append_dev(div0, br0);
    			append_dev(div0, t5);
    			append_dev(div0, t6);
    			append_dev(div0, br1);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div1, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*documentItem, documentItems*/ 3) {
    				each_value = /*documentItems*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t2.parentNode, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*documentItem*/ 1 && t4_value !== (t4_value = (/*documentItem*/ ctx[0]
    			? /*documentItem*/ ctx[0].fileName
    			: "No Document Selected") + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*documentItem*/ 1 && t6_value !== (t6_value = (/*documentItem*/ ctx[0]
    			? /*documentItem*/ ctx[0].downloadLink
    			: "No Document Selected") + "")) set_data_dev(t6, t6_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const docElementId = "document-viewer";

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let documentItem;
    	let webViewerInstance;

    	const documentItems = [
    		{
    			downloadLink: "/files/sample-file-0.pdf",
    			fileName: "Sample Local File 0"
    		},
    		{
    			downloadLink: "/files/sample-file-1.pdf",
    			fileName: "Sample Local File 1"
    		}
    	];

    	const elementsToHide = [
    		"downloadButton",
    		"ribbons",
    		"thumbDelete",
    		"leftPanelTabs",
    		"thumbRotateCounterClockwise",
    		"thumbRotateClockwise",
    		"documentControl",
    		"toggleNotesButton",
    		"downloadButton",
    		"header",
    		"toolsHeader",
    		"textPopup"
    	];

    	afterUpdate(() => {
    		if (documentItem) {
    			console.log("... started");

    			setTimeout(
    				() => {
    					console.log("... loading");

    					webViewerInstance === null || webViewerInstance === void 0
    					? void 0
    					: webViewerInstance.loadDocument(documentItem.downloadLink, { filename: documentItem.fileName });
    				},
    				1000
    			);
    		}
    	});

    	onMount(() => {
    		getInstance(
    			{
    				path: "pdf",
    				preloadWorker: "all",
    				fullAPI: true,
    				ui: "default",
    				useDownloader: false,
    				licenseKey: LICENSE_KEY,
    				disabledElements: elementsToHide
    			},
    			document.getElementById(docElementId)
    		).then(instance => {
    			webViewerInstance = instance;

    			webViewerInstance.iframeWindow.addEventListener("loaderror", err => {
    				var _a;
    				const error = err;

    				if (((_a = error.detail.message) === null || _a === void 0
    				? void 0
    				: _a.indexOf("File is not a valid zip archive")) > -1) {
    					webViewerInstance.showErrorMessage("Unable to open this file. Please make sure it is not password protected.");
    				}
    			});

    			webViewerInstance.setPrintQuality(4);
    		}).catch(error => {
    			console.log(`message: Something went wrong on starting the pdf creator`, error);
    			throw error;
    		});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = doc => $$invalidate(0, documentItem = doc);

    	$$self.$capture_state = () => ({
    		WebViewer: getInstance,
    		WebViewerInstance: webviewer_min.WebViewerInstance,
    		getInstance,
    		afterUpdate,
    		onMount,
    		LICENSE_KEY,
    		documentItem,
    		webViewerInstance,
    		documentItems,
    		docElementId,
    		elementsToHide
    	});

    	$$self.$inject_state = $$props => {
    		if ("documentItem" in $$props) $$invalidate(0, documentItem = $$props.documentItem);
    		if ("webViewerInstance" in $$props) webViewerInstance = $$props.webViewerInstance;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [documentItem, documentItems, click_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
