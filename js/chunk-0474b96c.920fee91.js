(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0474b96c","chunk-df846282","chunk-f0cc2b02"],{"097f":function(t,e,n){},"11e9":function(t,e,n){var i=n("52a7"),a=n("4630"),r=n("6821"),o=n("6a99"),s=n("69a8"),c=n("c69a"),l=Object.getOwnPropertyDescriptor;e.f=n("9e1e")?l:function(t,e){if(t=r(t),e=o(e,!0),c)try{return l(t,e)}catch(n){}if(s(t,e))return a(!i.f.call(t,e),t[e])}},1334:function(t,e,n){},"19c3":function(t,e,n){"use strict";var i=n("8a7b"),a=n.n(i);a.a},"1b61":function(t,e,n){"use strict";var i=n("5af9"),a=n.n(i);a.a},3590:function(t,e,n){"use strict";var i=n("b479"),a=n.n(i);a.a},"40a3":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.visible?n("div",{staticClass:"Loader"},[n("div",{staticClass:"LoaderBody"},[n("div",{staticClass:"Spinner"}),n("h4",[t._t("default")],2)])]):t._e()},a=[],r={name:"Loader",props:{visible:{type:Boolean,default:!0}}},o=r,s=(n("19c3"),n("2877")),c=Object(s["a"])(o,i,a,!1,null,null,null);e["default"]=c.exports},"4bfe":function(t,e,n){"use strict";var i=n("5e15"),a=n.n(i);a.a},"5af9":function(t,e,n){},"5dbc":function(t,e,n){var i=n("d3f4"),a=n("8b97").set;t.exports=function(t,e,n){var r,o=e.constructor;return o!==n&&"function"==typeof o&&(r=o.prototype)!==n.prototype&&i(r)&&a&&a(t,r),t}},"5e15":function(t,e,n){},6360:function(t,e,n){"use strict";var i=n("097f"),a=n.n(i);a.a},7465:function(t,e,n){"use strict";var i=n("1334"),a=n.n(i);a.a},8460:function(t,e,n){},"8a7b":function(t,e,n){},"8b97":function(t,e,n){var i=n("d3f4"),a=n("cb7c"),r=function(t,e){if(a(t),!i(e)&&null!==e)throw TypeError(e+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,e,i){try{i=n("9b43")(Function.call,n("11e9").f(Object.prototype,"__proto__").set,2),i(t,[]),e=!(t instanceof Array)}catch(a){e=!0}return function(t,n){return r(t,n),e?t.__proto__=n:i(t,n),t}}({},!1):void 0),check:r}},9093:function(t,e,n){var i=n("ce10"),a=n("e11e").concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return i(t,a)}},9289:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"SplitPanel",class:t.splitClass},[n("div",{staticClass:"Panel Primary",style:t.primaryStyle},[t._t("Primary")],2),n("div",{staticClass:"Panel Secondary",style:t.secondaryStyle},[t._t("Secondary")],2)])},a=[],r=(n("c5f6"),{name:"SplitPanel",props:{vertical:Boolean,primarySize:{type:Number,default:1},secondarySize:{type:Number,default:0}},computed:{primaryStyle:function(){return{flexGrow:this.primarySize}},secondaryStyle:function(){return{flexGrow:this.secondarySize}},splitClass:function(){return this.vertical?"Vertical":"Horizontal"}}}),o=r,s=(n("4bfe"),n("2877")),c=Object(s["a"])(o,i,a,!1,null,null,null);e["default"]=c.exports},"9c53":function(t,e,n){"use strict";var i=n("bc53"),a=n.n(i);a.a},aa77:function(t,e,n){var i=n("5ca1"),a=n("be13"),r=n("79e5"),o=n("fdef"),s="["+o+"]",c="​",l=RegExp("^"+s+s+"*"),u=RegExp(s+s+"*$"),h=function(t,e,n){var a={},s=r(function(){return!!o[t]()||c[t]()!=c}),l=a[t]=s?e(v):o[t];n&&(a[n]=l),i(i.P+i.F*s,"String",a)},v=h.trim=function(t,e){return t=String(a(t)),1&e&&(t=t.replace(l,"")),2&e&&(t=t.replace(u,"")),t};t.exports=h},b479:function(t,e,n){},bc53:function(t,e,n){},bca1:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-container",{staticClass:"GamePage",attrs:{dark:""}},[t.game?n("game-player",{staticClass:"Player",attrs:{game:t.game},on:{exit:t.onExitGame,"on-error":t.onError}}):n("game-list",{on:{"select-game":t.onSelectGame,"on-error":t.onError}})],1)},a=[],r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"GamePlayer"},[t.game?n("div",{staticClass:"MainContent"},[n("v-toolbar",{attrs:{dense:"",dark:""}},[n("v-toolbar-title",[t._v(" "+t._s(t.gameType)+" - "+t._s(t.game.id)+" ")]),n("v-spacer"),n("v-toolbar-items",[n("v-btn",{attrs:{icon:""},on:{click:t.onShowMenu}},[n("v-icon",{attrs:{medium:""}},[t._v("apps")])],1)],1)],1),n("div",{staticStyle:{"margin-top":"5px",display:"flex","flex-direction":"row"}},[n("div",{staticStyle:{width:"70%"}},[n("div",{staticClass:"SectionFrame"},[n("div",{staticClass:"Section"},[n("live-maze-viewer",{attrs:{maze:t.game.maze,botLocation:t.currentAction.location,"cell-size":t.mazeCellSize}})],1)]),n("div",{staticClass:"SectionFrame"},[n("div",{staticClass:"Section"},[n("game-controls",{attrs:{gameState:t.gameState,game:t.game},on:{"set-speed":t.onSetSpeed,"set-paused":t.onSetPaused,step:t.onStep,reset:t.onReset}})],1)])]),n("div",{staticClass:"SectionFrame",staticStyle:{width:"30%"}},[n("div",{staticClass:"Section"},[n("game-log",{staticStyle:{width:"100%",height:"100%"},attrs:{actions:t.game.actions,gameState:t.gameState}})],1)])])],1):n("loader",[t._v("Loading game...")])],1)},o=[],s=n("9289"),c=n("40a3"),l=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("table",{staticClass:"LiveMazeViewer"},t._l(t.maze.cells,function(e,i){return n("tr",{key:i},t._l(t.maze.cells[i],function(e,i){return n("LiveMazeViewerCell",{key:i,attrs:{cell:e,maze:t.maze,"bot-location":t.botLocation,size:t.cellSize}})}),1)}),0)},u=[],h=(n("c5f6"),function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("td",{staticClass:"LiveMazeViewerCell",class:t.cellClasses,style:t.cellStyle},[t.iconType?n("div",{staticClass:"IconContainer"},[n("v-icon",{attrs:{dark:"",size:t.iconSize,color:"black"}},[t._v("\n            "+t._s(t.iconType)+"\n        ")])],1):t._e()])}),v=[],p=n("718e"),d={name:"LiveMazeViewerCell",props:{maze:{type:Object,required:!0},cell:{type:Object,required:!0},botLocation:{type:Object,required:!0},size:{type:Number,required:!0}},computed:{cellClasses:function(){return{WallTop:!(this.cell.exits&p["DIRS"].NORTH),WallRight:!(this.cell.exits&p["DIRS"].EAST),WallBottom:!(this.cell.exits&p["DIRS"].SOUTH),WallLeft:!(this.cell.exits&p["DIRS"].WEST),Entrance:this.isEnter,Exit:this.isExit}},cellStyle:function(){return{width:this.size+"px",height:this.size+"px"}},isEnter:function(){return this.maze.startCell.row===this.cell.pos.row&&this.maze.startCell.col===this.cell.pos.col},isExit:function(){return this.maze.finishCell.row===this.cell.pos.row&&this.maze.finishCell.col===this.cell.pos.col},iconType:function(){return this.botLocation.row===this.cell.pos.row&&this.botLocation.col===this.cell.pos.col?"face":this.cell.notes.length>0?"insert_comment":this.cell.tags&p["CELL_TAGS"].LAVA?"flash_on":this.cell.trap&p["CELL_TRAPS"].PIT?"flash_on":this.cell.trap&p["CELL_TRAPS"].BEARTRAP?"flash_on":this.cell.trap&p["CELL_TRAPS"].TARPIT?"flash_on":this.cell.trap&p["CELL_TRAPS"].FLAMETHOWER?"flash_on":null},iconSize:function(){return 3*this.size/4+"px"}}},m=d,f=(n("1b61"),n("2877")),S=n("6544"),g=n.n(S),b=n("132d"),_=Object(f["a"])(m,h,v,!1,null,null,null),y=_.exports;g()(_,{VIcon:b["a"]});var T={name:"LiveMazeViewer",components:{LiveMazeViewerCell:y},props:{maze:{type:Object,required:!0},botLocation:{type:Object,required:!0},cellSize:{type:Number,required:!1,default:30}}},A=T,E=(n("6360"),Object(f["a"])(A,l,u,!1,null,null,null)),C=E.exports,I=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"GameControls"},[n("div",{staticClass:"GameControlsRow"},[n("span",[t._v("Playback speed: "+t._s(t.gameState.speed)+"%")])]),n("div",{staticClass:"GameControlsRow"},[n("v-btn",{attrs:{icon:"",disabled:!t.canSpeedDown},on:{click:t.onSpeedDown}},[n("v-icon",{attrs:{medium:""}},[t._v("remove_circle_outline")])],1),n("v-btn",{on:{click:t.onPlayPauseBtn}},[n("v-icon",{attrs:{medium:""}},[t._v(t._s(t.playPauseIcon))])],1),n("v-btn",{on:{click:t.onRewind}},[n("v-icon",{attrs:{medium:""}},[t._v("replay")])],1),n("v-btn",{attrs:{icon:"",disabled:!t.canSpeedUp},on:{click:t.onSpeedUp}},[n("v-icon",{attrs:{medium:""}},[t._v("add_circle_outline")])],1)],1),n("div",{staticClass:"GameControlsRow"},[n("v-btn",{attrs:{icon:""},on:{click:function(e){return t.onStep(-30)}}},[n("v-icon",{attrs:{medium:""}},[t._v("replay_30")])],1),n("v-btn",{attrs:{icon:""},on:{click:function(e){return t.onStep(-10)}}},[n("v-icon",{attrs:{medium:""}},[t._v("replay_10")])],1),n("v-btn",{attrs:{icon:""},on:{click:function(e){return t.onStep(-5)}}},[n("v-icon",{attrs:{medium:""}},[t._v("replay_5")])],1),n("v-btn",{attrs:{medium:""},on:{click:function(e){return t.onStep(-1)}}},[n("v-icon",{attrs:{large:""}},[t._v("skip_previous")])],1),n("v-btn",{attrs:{medium:""},on:{click:function(e){return t.onStep(1)}}},[n("v-icon",{attrs:{large:""}},[t._v("skip_next")])],1),n("v-btn",{attrs:{icon:""},on:{click:function(e){return t.onStep(5)}}},[n("v-icon",{attrs:{medium:""}},[t._v("forward_5")])],1),n("v-btn",{attrs:{icon:""},on:{click:function(e){return t.onStep(10)}}},[n("v-icon",{attrs:{medium:""}},[t._v("forward_10")])],1),n("v-btn",{attrs:{icon:""},on:{click:function(e){return t.onStep(30)}}},[n("v-icon",{attrs:{medium:""}},[t._v("forward_30")])],1)],1),t.allowManual?n("div",{staticClass:"GameControlsRow"}):t._e()])},w=[],L=400,x=25,R=25,V={name:"GameControls",props:{gameState:{type:Object,required:!0},allowManual:{type:Boolean,required:!1,default:!1}},methods:{onPlayPauseBtn:function(){this.$emit("set-paused",!this.gameState.paused)},onSpeedUp:function(){var t=this.gameState.speed+R;t>L&&(t=L),this.$emit("set-speed",t)},onSpeedDown:function(){var t=this.gameState.speed-R;t<x&&(t=x),this.$emit("set-speed",t)},onRewind:function(){this.$emit("reset")},onStep:function(t){this.$emit("step",t)}},computed:{playPauseIcon:function(){return this.gameState.paused?"play_circle_outline":"pause_circle_outline"},canSpeedUp:function(){return this.gameState.speed<L},canSpeedDown:function(){return this.gameState.speed>x},isPaused:function(){return this.gameState.paused}}},O=V,k=(n("3590"),n("8336")),M=Object(f["a"])(O,I,w,!1,null,null,null),N=M.exports;g()(M,{VBtn:k["a"],VIcon:b["a"]});var P=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"GameLog"},[n("v-toolbar",{attrs:{dense:"",dark:""}},[n("v-toolbar-title",[t._v("Actions")]),n("v-spacer"),n("v-toolbar-items",[n("v-pagination",{attrs:{length:t.pageCount,"total-visible":3},model:{value:t.currentPage,callback:function(e){t.currentPage=e},expression:"currentPage"}})],1)],1),n("v-list",{attrs:{dense:"",dark:"",subheader:""}},t._l(t.displayActions,function(e,i){return n("v-list-tile",{key:i,attrs:{avatar:""},on:{click:function(n){return t.showAction(e)}}},[e?[n("v-list-tile-avatar",[n("v-chip",{attrs:{small:"",color:t.colorForAction(e)}},[t._v("\n                        "+t._s(e.action)+"\n                    ")])],1),n("v-list-tile-content",[n("div",{staticClass:"LogDetails"},[n("div",[t._v("Direction: "+t._s(t.translateDirection(e.direction)))]),n("div",[t._v("Location: "+t._s(t.translateLocation(e.location)))])])]),n("v-list-tile-action",[0===i?n("v-chip",{attrs:{small:"",color:"#6b1414"}},[t._v("Latest")]):t._e()],1)]:t._e()],2)}),1),n("br"),t.selectedAction?n("action-viewer",{attrs:{action:t.selectedAction},on:{hide:function(e){return t.showAction(null)}}}):t._e()],1)},z=[],D=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"ActionViewer"},[n("v-toolbar",{attrs:{dense:"",dark:""}},[n("v-toolbar-title",[t._v("Action Details")]),n("v-spacer"),n("v-toolbar-items",[n("v-btn",{attrs:{icon:""},on:{click:t.onHide}},[n("v-icon",{attrs:{medium:""}},[t._v("cancel")])],1)],1)],1),n("v-card",[n("v-card-title",[n("v-chip",{attrs:{small:"",color:t.actionColor}},[t._v("\n                "+t._s(t.action.action)+"\n            ")]),n("v-chip",{attrs:{small:""}},[t._v("\n                "+t._s(t.actionDirection)+"\n            ")]),n("v-chip",{attrs:{small:""}},[t._v("\n                "+t._s(t.actionLocation)+"\n            ")])],1),n("v-card-text",[n("v-expansion-panel",{attrs:{expandable:""}},[n("v-expansion-panel-content",{scopedSlots:t._u([{key:"header",fn:function(){return[t._v("\n                        Engram\n                    ")]},proxy:!0}])},[n("v-card",[n("v-card-text",[t._v(" "+t._s(t.action.engram)+" ")])],1)],1),n("v-expansion-panel-content",{scopedSlots:t._u([{key:"header",fn:function(){return[t._v("\n                        Score\n                    ")]},proxy:!0}])},[n("v-card",[n("v-card-text",[t._v(" "+t._s(t.action.score)+" ")])],1)],1),n("v-expansion-panel-content",{scopedSlots:t._u([{key:"header",fn:function(){return[t._v("\n                        Outcome\n                    ")]},proxy:!0}])},[n("v-list",{attrs:{dense:"",dark:"",subheader:"","three-line":""}},t._l(t.action.outcome,function(e,i){return n("v-list-tile",{key:i},[n("v-list-tile-content",[t._v("\n                                "+t._s(e)+"\n                            ")])],1)}),1)],1)],1)],1)],1)],1)},G=[],$={name:"ActionViewer",props:{action:{type:Object,required:!0}},data:function(){return{currentPage:1}},methods:{onHide:function(){this.$emit("hide")}},computed:{actionColor:function(){return"MOVE"===this.action.action?"#196719":null},actionDirection:function(){switch(this.action.direction){case p["DIRS"].NONE:return"None";case p["DIRS"].NORTH:return"North";case p["DIRS"].EAST:return"East";case p["DIRS"].SOUTH:return"South";case p["DIRS"].WEST:return"West";default:return dir}},actionLocation:function(){return this.action.location.row+", "+this.action.location.col}}},j=$,B=n("b0af"),H=n("99d9"),W=n("12b2"),U=(n("bf5a"),n("58df")),F=n("9d26"),q=n("b64a"),Y=n("6a18"),J=n("98a1"),X=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},K=Object(U["a"])(q["a"],Y["a"],J["a"]).extend({name:"v-chip",props:{close:Boolean,disabled:Boolean,label:Boolean,outline:Boolean,selected:Boolean,small:Boolean,textColor:String,value:{type:Boolean,default:!0}},computed:{classes:function(){return X({"v-chip--disabled":this.disabled,"v-chip--selected":this.selected&&!this.disabled,"v-chip--label":this.label,"v-chip--outline":this.outline,"v-chip--small":this.small,"v-chip--removable":this.close},this.themeClasses)}},methods:{genClose:function(t){var e=this,n={staticClass:"v-chip__close",on:{click:function(t){t.stopPropagation(),e.$emit("input",!1)}}};return t("div",n,[t(F["a"],"$vuetify.icons.delete")])},genContent:function(t){return t("span",{staticClass:"v-chip__content"},[this.$slots.default,this.close&&this.genClose(t)])}},render:function(t){var e=this.setBackgroundColor(this.color,{staticClass:"v-chip",class:this.classes,attrs:{tabindex:this.disabled?-1:0},directives:[{name:"show",value:this.isActive}],on:this.$listeners}),n=this.textColor||this.outline&&this.color;return t("span",this.setTextColor(n,e),[this.genContent(t)])}}),Q=n("cd55"),Z=n("49e2"),tt=n("8860"),et=n("ba95"),nt=n("5d23"),it=n("80d2"),at=n("a523"),rt=n("549c"),ot=(n("db6d"),n("e8f2")),st=Object(ot["a"])("flex"),ct=Object(ot["a"])("layout"),lt=Object(it["d"])("spacer","div","v-spacer"),ut=(at["a"],rt["a"],n("71d9")),ht=n("2a7f"),vt=Object(f["a"])(j,D,G,!1,null,null,null),pt=vt.exports;g()(vt,{VBtn:k["a"],VCard:B["a"],VCardText:H["a"],VCardTitle:W["a"],VChip:K,VExpansionPanel:Q["a"],VExpansionPanelContent:Z["a"],VIcon:b["a"],VList:tt["a"],VListTile:et["a"],VListTileContent:nt["a"],VSpacer:lt,VToolbar:ut["a"],VToolbarItems:ht["a"],VToolbarTitle:ht["b"]});var dt={name:"GameLog",props:{actions:{type:Array,required:!0},gameState:{type:Object,required:!0},pageSize:{type:Number,default:10}},components:{ActionViewer:pt},data:function(){return{currentPage:1,selectedAction:null}},methods:{colorForAction:function(t){return"MOVE"===t.action?"#196719":null},translateDirection:function(t){switch(t){case p["DIRS"].NONE:return"None";case p["DIRS"].NORTH:return"North";case p["DIRS"].EAST:return"East";case p["DIRS"].SOUTH:return"South";case p["DIRS"].WEST:return"West";default:return t}},translateLocation:function(t){return t.row+", "+t.col},convertActionNumber:function(t){return this.currentActions.length-t},showAction:function(t){this.selectedAction=t}},computed:{currentActions:function(){return 0===this.actions.length?new Array:this.actions.slice(0,this.gameState.actionNumber+1).reverse()},displayActions:function(){var t=this.currentPageIndex*this.pageSize,e=Math.min(t+this.pageSize,this.currentActions.length);return this.currentActions.slice(t,e)},pageCount:function(){return Math.ceil(this.currentActions.length/this.pageSize)},currentPageIndex:function(){return this.currentPage-1}}},mt=dt,ft=(n("7465"),n("40fe")),St=n("c954"),gt=(n("8460"),n("0d3d")),bt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t};function _t(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}var yt=Object(U["a"])(q["a"],Y["a"]).extend({name:"v-pagination",directives:{Resize:gt["a"]},props:{circle:Boolean,disabled:Boolean,length:{type:Number,default:0,validator:function(t){return t%1===0}},totalVisible:[Number,String],nextIcon:{type:String,default:"$vuetify.icons.next"},prevIcon:{type:String,default:"$vuetify.icons.prev"},value:{type:Number,default:0}},data:function(){return{maxButtons:0,selected:null}},computed:{classes:function(){return bt({"v-pagination":!0,"v-pagination--circle":this.circle,"v-pagination--disabled":this.disabled},this.themeClasses)},items:function(){var t=parseInt(this.totalVisible,10)||this.maxButtons;if(this.length<=t)return this.range(1,this.length);var e=t%2===0?1:0,n=Math.floor(t/2),i=this.length-n+1+e;if(this.value>n&&this.value<i){var a=this.value-n+2,r=this.value+n-2-e;return[1,"..."].concat(_t(this.range(a,r)),["...",this.length])}if(this.value===n){var o=this.value+n-1-e;return[].concat(_t(this.range(1,o)),["...",this.length])}if(this.value===i){var s=this.value-n+1;return[1,"..."].concat(_t(this.range(s,this.length)))}return[].concat(_t(this.range(1,n)),["..."],_t(this.range(i,this.length)))}},watch:{value:function(){this.init()}},mounted:function(){this.init()},methods:{init:function(){var t=this;this.selected=null,this.$nextTick(this.onResize),setTimeout(function(){return t.selected=t.value},100)},onResize:function(){var t=this.$el&&this.$el.parentElement?this.$el.parentElement.clientWidth:window.innerWidth;this.maxButtons=Math.floor((t-96)/42)},next:function(t){t.preventDefault(),this.$emit("input",this.value+1),this.$emit("next")},previous:function(t){t.preventDefault(),this.$emit("input",this.value-1),this.$emit("previous")},range:function(t,e){var n=[];t=t>0?t:1;for(var i=t;i<=e;i++)n.push(i);return n},genIcon:function(t,e,n,i){return t("li",[t("button",{staticClass:"v-pagination__navigation",class:{"v-pagination__navigation--disabled":n},attrs:{type:"button"},on:n?{}:{click:i}},[t(F["a"],[e])])])},genItem:function(t,e){var n=this,i=e===this.value&&(this.color||"primary");return t("button",this.setBackgroundColor(i,{staticClass:"v-pagination__item",class:{"v-pagination__item--active":e===this.value},attrs:{type:"button"},on:{click:function(){return n.$emit("input",e)}}}),[e.toString()])},genItems:function(t){var e=this;return this.items.map(function(n,i){return t("li",{key:i},[isNaN(Number(n))?t("span",{class:"v-pagination__more"},[n.toString()]):e.genItem(t,n)])})}},render:function(t){var e=[this.genIcon(t,this.$vuetify.rtl?this.nextIcon:this.prevIcon,this.value<=1,this.previous),this.genItems(t),this.genIcon(t,this.$vuetify.rtl?this.prevIcon:this.nextIcon,this.value>=this.length,this.next)];return t("ul",{directives:[{modifiers:{quiet:!0},name:"resize",value:this.onResize}],class:this.classes},e)}}),Tt=Object(f["a"])(mt,P,z,!1,null,null,null),At=Tt.exports;g()(Tt,{VChip:K,VList:tt["a"],VListTile:et["a"],VListTileAction:ft["a"],VListTileAvatar:St["a"],VListTileContent:nt["a"],VPagination:yt,VSpacer:lt,VToolbar:ut["a"],VToolbarItems:ht["a"],VToolbarTitle:ht["b"]});var Et={name:"GamePlayer",components:{SplitPanel:s["default"],Loader:c["default"],LiveMazeViewer:C,GameControls:N,GameLog:At},props:{game:{type:Object,required:!0}},data:function(){return{gameState:{speed:100,paused:!0,actionNumber:0},tickTimer:null}},methods:{onSetSpeed:function(t){this.gameState.speed=t},onSetPaused:function(t){this.gameState.paused=t},onStep:function(t){var e=this.gameState.actionNumber+t;e>=this.game.actions.length&&(e=this.game.actions.length-1),e<0&&(e=0),this.gameState.actionNumber=e},onReset:function(){this.gameState.actionNumber=0},onShowMenu:function(){this.$emit("exit")},runTick:function(){this.game&&!this.gameState.paused&&this.gameState.actionNumber<this.game.actions.length-1&&this.gameState.actionNumber++,this.setupTickTimer()},setupTickTimer:function(){this.tickTimer=window.setTimeout(this.runTick,1e3/(this.gameState.speed/100))},clearTickTimer:function(){this.tickTimer&&window.clearTimeout(this.tickTimer)}},computed:{currentAction:function(){return this.game.actions[this.gameState.actionNumber]},gameType:function(){return this.game.mode===p["GAME_MODES"].SINGLE_PLAYER?"Singleplayer":this.game.mode===p["GAME_MODES"].MULTI_PLAYER?"Multiplayer":this.game.mode},mazeCellSize:function(){var t=Math.max(this.game.maze.width,this.game.maze.height),e=5/t,n=Math.ceil(50*e);return Math.max(Math.min(n,50),12)}},mounted:function(){this.setupTickTimer()},destroyed:function(){this.clearTickTimer()}},Ct=Et,It=(n("e8a5"),Object(f["a"])(Ct,r,o,!1,null,null,null)),wt=It.exports;g()(It,{VBtn:k["a"],VIcon:b["a"],VSpacer:lt,VToolbar:ut["a"],VToolbarItems:ht["a"],VToolbarTitle:ht["b"]});var Lt=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"GameList"},[t.gameList?n("div",[n("v-toolbar",{attrs:{dense:"",dark:""}},[n("v-toolbar-title",[t._v("Available Games")]),n("v-spacer"),n("v-toolbar-items",[n("v-pagination",{attrs:{length:t.pageCount},model:{value:t.currentPage,callback:function(e){t.currentPage=e},expression:"currentPage"}})],1)],1),n("v-list",{attrs:{dense:"",dark:"",subheader:"","three-line":""}},t._l(t.currentGames,function(e,i){return n("v-list-tile",{key:i},[n("v-list-tile-content",[n("v-list-tile-title",[t._v(t._s(e.id))]),n("v-list-tile-sub-title",[t._v("\n                        Maze: "+t._s(t.getMazeDetails(e.maze))),n("br"),t._v("\n                        Bot: "+t._s(e.teamId)+" / "+t._s(e.botId)+"\n                    ")])],1),n("v-list-tile-action",[n("v-btn",{attrs:{small:""},on:{click:function(n){return t.onSelect(e)}}},[n("v-icon",{attrs:{small:""}},[t._v("play_arrow")])],1)],1)],1)}),1)],1):n("loader",[t._v("Loading game list...")])],1)},xt=[],Rt=n("1429"),Vt=10,Ot={name:"GameList",components:{Loader:c["default"]},data:function(){return{gameList:null,currentPage:1}},methods:{onSelect:function(t){this.$emit("select-game",t)},colorForState:function(t){switch(t){case p["GAME_STATES"].NEW:case p["GAME_STATES"].IN_PROGRESS:case p["GAME_STATES"].FINISHED:case p["GAME_STATES"].ABORTED:case p["GAME_STATES"].ERROR:default:return"#696969"}},getMazeDetails:function(t){return t.width+"x"+t.height+", difficulty"+t.challenge},createMoveAction:function(t,e){t===p["DIRS"].NORTH&&e.row--,t===p["DIRS"].SOUTH&&e.row++,t===p["DIRS"].WEST&&e.col--,t===p["DIRS"].EAST&&e.col++;var n={row:e.row,col:e.col};return{action:"MOVE",direction:t,engram:null,location:n,mazeId:null,score:null,playerState:p["PLAYER_STATES"].STANDING,outcome:[],trophies:[],botCohesion:[]}},createDefaultMazeList:function(){var t=this;Rt["a"].GenerateMaze(5,5,1,"test","abc").then(function(e){var n={row:e.startCell.row,col:e.startCell.col},i=new Array;i.push(t.createMoveAction(p["DIRS"].NONE,n)),i.push(t.createMoveAction(p["DIRS"].WEST,n)),i.push(t.createMoveAction(p["DIRS"].WEST,n)),i.push(t.createMoveAction(p["DIRS"].SOUTH,n)),i.push(t.createMoveAction(p["DIRS"].SOUTH,n)),i.push(t.createMoveAction(p["DIRS"].SOUTH,n)),i.push(t.createMoveAction(p["DIRS"].SOUTH,n)),i.push(t.createMoveAction(p["DIRS"].EAST,n)),i.push(t.createMoveAction(p["DIRS"].NORTH,n)),i.push(t.createMoveAction(p["DIRS"].EAST,n)),i.push(t.createMoveAction(p["DIRS"].EAST,n)),i.push(t.createMoveAction(p["DIRS"].SOUTH,n)),i.push(t.createMoveAction(p["DIRS"].WEST,n)),i.push(t.createMoveAction(p["DIRS"].SOUTH,n));var a={id:"Test Game",state:p["GAME_STATES"].NEW,maze:e,mode:p["GAME_MODES"].SINGLE_PLAYER,score:null,player:null,actions:i,round:0,teamId:"teamsters",botId:"Roomba",lastAccessed:0};t.gameList=new Array,t.gameList.push(a)},function(e){return t.$emit("on-error",e)})}},computed:{currentPageIndex:function(){return this.currentPage-1},pageCount:function(){return Math.ceil(this.gameList.length/Vt)},currentGames:function(){var t=this.currentPageIndex*Vt,e=Math.min(t+Vt,this.gameList.length);return this.gameList.slice(t,e)}},mounted:function(){this.createDefaultMazeList()}},kt=Ot,Mt=(n("e6c8"),Object(f["a"])(kt,Lt,xt,!1,null,null,null)),Nt=Mt.exports;g()(Mt,{VBtn:k["a"],VIcon:b["a"],VList:tt["a"],VListTile:et["a"],VListTileAction:ft["a"],VListTileContent:nt["a"],VListTileSubTitle:nt["b"],VListTileTitle:nt["c"],VPagination:yt,VSpacer:lt,VToolbar:ut["a"],VToolbarItems:ht["a"],VToolbarTitle:ht["b"]});var Pt={name:"GamePage",components:{GamePlayer:wt,GameList:Nt},data:function(){return{game:null}},methods:{onError:function(t){this.$emit("on-error",t)},onSelectGame:function(t){this.game=t},onExitGame:function(){this.game=null}}},zt=Pt,Dt=(n("9c53"),Object(f["a"])(zt,i,a,!1,null,null,null));e["default"]=Dt.exports;g()(Dt,{VContainer:at["a"]})},bf5a:function(t,e,n){},c5f6:function(t,e,n){"use strict";var i=n("7726"),a=n("69a8"),r=n("2d95"),o=n("5dbc"),s=n("6a99"),c=n("79e5"),l=n("9093").f,u=n("11e9").f,h=n("86cc").f,v=n("aa77").trim,p="Number",d=i[p],m=d,f=d.prototype,S=r(n("2aeb")(f))==p,g="trim"in String.prototype,b=function(t){var e=s(t,!1);if("string"==typeof e&&e.length>2){e=g?e.trim():v(e,3);var n,i,a,r=e.charCodeAt(0);if(43===r||45===r){if(n=e.charCodeAt(2),88===n||120===n)return NaN}else if(48===r){switch(e.charCodeAt(1)){case 66:case 98:i=2,a=49;break;case 79:case 111:i=8,a=55;break;default:return+e}for(var o,c=e.slice(2),l=0,u=c.length;l<u;l++)if(o=c.charCodeAt(l),o<48||o>a)return NaN;return parseInt(c,i)}}return+e};if(!d(" 0o1")||!d("0b1")||d("+0x1")){d=function(t){var e=arguments.length<1?0:t,n=this;return n instanceof d&&(S?c(function(){f.valueOf.call(n)}):r(n)!=p)?o(new m(b(e)),n,d):b(e)};for(var _,y=n("9e1e")?l(m):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),T=0;y.length>T;T++)a(m,_=y[T])&&!a(d,_)&&h(d,_,u(m,_));d.prototype=f,f.constructor=d,n("2aba")(i,p,d)}},d6b9:function(t,e,n){},e1e4:function(t,e,n){},e6c8:function(t,e,n){"use strict";var i=n("d6b9"),a=n.n(i);a.a},e8a5:function(t,e,n){"use strict";var i=n("e1e4"),a=n.n(i);a.a},fdef:function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"}}]);
//# sourceMappingURL=chunk-0474b96c.920fee91.js.map