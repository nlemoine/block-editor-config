(()=>{"use strict";var e={n:o=>{var n=o&&o.__esModule?()=>o.default:()=>o;return e.d(n,{a:n}),n},d:(o,n)=>{for(var t in n)e.o(n,t)&&!e.o(o,t)&&Object.defineProperty(o,t,{enumerable:!0,get:n[t]})},o:(e,o)=>Object.prototype.hasOwnProperty.call(e,o)};const o=window.wp.domReady;var n=e.n(o);window.wp.hooks;const t=window.wp.blocks,a=window.lodash;var r=e.n(a);window.wp.i18n;const i=blockEditorConfig.blocks,s=blockEditorConfig.blocks.map((e=>e.name)),l=e=>{const o=(0,t.getBlockType)(e.name);if(r().isBoolean(e.styles)&&!e.styles)return void o.styles.forEach((o=>{(0,t.unregisterBlockStyle)(e.name,o.name)}));const n=e.styles.filter((e=>r().isString(e)));n.length&&o.styles.forEach((o=>{n.includes(o.name)||(0,t.unregisterBlockStyle)(e.name,o.name)}));const a=e.styles.filter((e=>r().isObject(e)));a.length&&a.forEach((o=>{(0,t.registerBlockStyle)(e.name,o)}))},c=e=>{const o=(0,t.getBlockType)(e.name);if(r().isBoolean(e.variations)&&!e.variations)return void o.variations.forEach((o=>{(0,t.unregisterBlockVariation)(e.name,o.name)}));const n=e.variations.filter((e=>r().isString(e)));n.length&&o.variations.forEach((o=>{n.includes(o.name)||(0,t.unregisterBlockVariation)(e.name,o.name)}));const a=e.variations.filter((e=>r().isObject(e)));a.length&&a.forEach((o=>{(0,t.registerBlockVariation)(e.name,o)}))};n()((()=>{(0,t.getBlockTypes)().filter((e=>!s.includes(e.name))).forEach((e=>(0,t.unregisterBlockType)(e.name))),i.filter((e=>r().has(e,["styles"]))).forEach(l),i.filter((e=>r().has(e,["variations"]))).forEach(c)}))})();