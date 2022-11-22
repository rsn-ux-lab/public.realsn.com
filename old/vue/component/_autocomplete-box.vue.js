(function(){
    // HTML Template
    var template = ''
        + '<div ref="container" class="dcp inputBox is-autoComplete" :class="[ { \'is-btns\' : type == \'select\' }, { \'is-expanded\' : expanded } ]">'
        + '    <div class="input" :class="{ \'is-disabled\': disabled }">'
        // + '        <input type="text" autocomplete="off" ref="input" :id="id" @input="val = $event.target.value" :value="val" :class="$vnode.data.staticClass" :disabled="disabled" :placeholder="$vnode.data.attrs.placeholder" @keyup="evt_keyup" @keydown="evt_keydown"><label :for="id" class="ui_invisible">{{ getLabel }}</label>'
        + '        <input type="text" autocomplete="off" ref="input" :id="id" v-model="input_txt" :class="$vnode.data.staticClass" :disabled="disabled" :placeholder="$vnode.data.attrs.placeholder" :title="type == \'select\' && multiple ? $options.filters.arrToParam( selectedItem, \', \', \'name\' ) : \'\'" @keyup="evt_keyup" @keydown="evt_keydown" @focus="evt_inputFocus" @blur="evt_inputBlur"><label :for="id" class="ui_invisible">{{ getLabel }}</label>'
        + '    </div>'
        + '    <div v-if="type == \'select\'" class="btns" :class="{ \'is-disabled\': disabled }">'
        + '        <button class="select_arrows" @keyup="evt_keyup" @keydown="evt_keydown" @click="evt_btnClick" :disabled="disabled"><span>열기/닫기</span></button>'
        + '    </div>'
        + '    <div class="list" :style="\'top: \' + pos_top + \'px; left:\' + pos_left + \'px\'">'
        + '        <transition name="fade_posy">'
        + '            <div v-if="expanded" ref="expandWrap" class="inner_wrap" @scroll="evt_listScroll" :style="\'min-width:\' + getWid + \'px; max-height:\' + max_hgt + \'px\'" v-init>'
        + '                <ul v-if="!multiple || type == \'input\'" ref="list">'
        + '                    <template v-for="( item, idx ) in getUseOpts">'
        + '                        <li v-bind:key="id + \'_\' + idx">'
        + '                            <button v-if="type == \'input\'" class="item" :class="{ \'is-active\' : idx == selectedIdx }" :data-idx="idx" @click="evt_itemClick( $event, item )" :data-data="JSON.stringify( item )">'
        + '                                <template v-for="( $str, $idx ) in strToHlStr( item, inputTxt ).split( \'/^/^\' )">'
        + '                                    <strong v-if="$str == inputTxt">{{ $str }}</strong>'
        + '                                    <span v-else-if="$str.length > 0">{{ $str }}</span>'
        + '                                </template>'
        + '                            </button>'
        + '                            <button v-else class="item" :class="{ \'is-active\' : idx == selectedIdx }" :data-idx="idx" @click="evt_itemClick( $event, item )" :data-data="JSON.stringify( item )">'
        + '                                <template v-for="( $str, $idx ) in strToHlStr( item.name, inputTxt ).split( \'/^/^\' )">'
        + '                                    <strong v-if="$str == inputTxt">{{ $str }}</strong>'
        + '                                    <span v-else-if="$str.length > 0">{{ $str }}</span>'
        + '                                </template>'
        + '                            </button>'
        + '                        </li>'
        + '                    </template>'
        + '                </ul>'
        + '                <div v-else ref="list" class="multiple_select_list">'
        // + '                    <div class="all">'
        // + '                        <span>All</span>'
        // + '                        <comp-switch-btn class="is-small" :id="id + \'_all\'" v-model="allChecked" :click="evt_allChkClick"></comp-switch-btn>'
        // + '                    </div>'
        + '                    <div ref="checkList" class="checked_list">'
        + '                        <strong>선택됨 <span class="total">총<strong>{{ selectedItem.length | lengthLimitComma }}</strong>건</span></strong>'
        + '                        <ul>'
        + '                            <li v-for="( item, idx ) in selectedItem" v-bind:key="\'checked_list_\' + idx">'
        + '                                <button class="item" :value="item.code" :class="selectedItem.indexOf( item ) >= 0 ? \'is-active\' : \'\'" :disabled="item.disabled" @click="evt_itemClick( $event, item )">{{ item.name }}</button>'
        + '                            </li>'
        + '                        </ul>'
        + '                    </div>'
        + '                    <div v-if="getUnCheckedLists.length > 0" class="unchecked_list">'
        + '                        <strong class="ui_invisible">아이템</strong>'
        + '                        <ul>'
        + '                            <template v-for="( item, idx ) in getUnCheckedLists">'
        + '                                <li v-bind:key="\'unchecked_list_\' + idx">'
        + '                                    <button class="item" :value="item.code" :class="{ \'is-active\' : idx == selectedIdx }" :data-idx="idx" :disabled="item.disabled" @click="evt_itemClick( $event, item )" :data-data="JSON.stringify( item )">'
        + '                                        <template v-for="( $str, $idx ) in strToHlStr( item.name, inputTxt ).split( \'/^/^\' )">'
        + '                                            <strong v-if="$str == inputTxt">{{ $str }}</strong>'
        + '                                            <span v-else-if="$str.length > 0">{{ $str }}</span>'
        + '                                        </template>'
        + '                                    </button>'
        + '                                </li>'
        + '                            </template>'
        + '                        </ul>'
        + '                    </div>'
        + '                </div>'
        + '            </div>'
        + '        </transition>'
        + '    </div>'
        + '</div>'

    // Component
    var comp = Vue.component( "comp-autocomplete-box", {
        template: template,
        data: function() {
            return {
                limitCnt: 1,
                useLimit: this.type == "select" && this.limit > 40 ? 40 : this.limit,
                pos_top: 0,
                pos_left: 0,
                max_hgt: 0,
                inputTxt: "",
                input_txt: "",
                selectedItem: this.type == "select" ? [] : null,
                selectedIdx: -1,
                listScrollTop: 0,
                filterDatas: [],
                useDatas: [],
                expanded: false,
                allChecked: false,
                visibleIdxS: 0,
                visibleIdxE: 50,
            };
        },
        props: {
            id: { type: String },
            type: { type: String, default: "input" },
            value: { type: String },
            disabled: { type: Boolean },
            label: { type: String },
            autocomplete: { type: Array },
            limit: { type: Number, default: 50 },
            multiple: { type: Boolean, default: false}
        },
        computed: {
			val: {
				get: function() {
					return this.value;
				},
				set: function( $val ) {
					this.$emit( "input", $val );
				}
			},
			getLabel: function(){
				return this.label ? this.label : "입력"
			},
			getWid: function(){
				return $( this.$refs.container ).outerWidth();
            },
            getUseOpts: function(){
                var _this = this;
                var result = this.filterDatas;
                result = result.slice( this.visibleIdxS, this.visibleIdxE + 1 );
                return result;
            },
            getCheckedLists: function(){
				var result = [];
                var _this = this;
				// this.getFilterDatas().filter( function( $item ){
				// 	if( _this && _this.selectedItem && _this.selectedItem.indexOf( $item ) >= 0 ) {
				// 		result.push( $item );
				// 	}
                // });
				return result;
            },
            getUnCheckedLists: function(){
				var result = [];
                var _this = this;
				this.filterDatas.filter( function( $item ){
					// if( _this.selectedItem && _this.selectedItem.indexOf( $item ) < 0 ) {
					// 	result.push( $item );
                    // }
                    
                    if( _this.selectedItem ) {
                        var chk = false;
                        _this.selectedItem.filter( function( $item2 ){
                            if( $item2.code == $item.code && $item2.name == $item2.name ) chk = true;
                        })
                        if( !chk ) result.push( $item );
                    }
                });
                result = result.slice( this.visibleIdxS, this.visibleIdxE + 1 );
				return result;
            },
            topSpace: function(){
                return ( Math.max( 0, this.visibleIdxS - 10 ) ) * 23;
            },
            bottomSpace: function(){
                return Math.max( 0, ( this.getFilterDatas().length - this.visibleIdxE ) * 23 );
            },
		},
        created: function (){
            if( this.val ){
                var _this = this;

                if( this.type == "input" ) {
                    this.input_txt = this.val;
                    this.inputTxt = this.val;
                } else {
                    if( !this.multiple ) {
                        this.autocomplete.filter( function( $item ){
                            if( $item.code == _this.val ) {
                                _this.selectedItem = $item;
                                _this.inputTxt = $item.name;
                                return false;                            
                            }
                        });
                    } else {
                        var selArr = this.$options.filters.paramToArr( this.val, "," );
                        var result = [];
                        this.autocomplete.filter( function( $item ){
                            if( selArr.indexOf( String( $item.code ) ) >= 0 ) {
                                result.push( $item );
                            }
                        });
                        this.selectedItem = JSON.parse( JSON.stringify( result ) );
                    }
                }
            }
        },
		mounted: function (){
            $( window ).scroll( this.evt_scroll );
            $( window ).resize( this.evt_resize );
            // if( this.type == "select" && this.limit == 500 ) this.limit = 200;
		},
		watch: {
            value: function( $val ){
                var _this = this;

                if( this.type == "input" ) {
                    this.input_txt = $val;
                    // this.inputTxt = $val;
                } else {
                    if( !this.multiple ) {
                        this.autocomplete.filter( function( $item ){
                            if( $item.code == $val ) {
                                _this.selectedItem = $item;
                                _this.input_txt = $item.name;
                                // _this.inputTxt = $item.name;
                                return false;                            
                            }
                        });
                    } else {
                        var selArr = this.$options.filters.paramToArr( $val, "," );
                        var result = [];
                        this.autocomplete.filter( function( $item ){
                            if( selArr.indexOf( String( $item.code ) ) >= 0 ) {
                                result.push( $item );
                            }
                        });
                        this.selectedItem = JSON.parse( JSON.stringify( result ) );
                    }
                }
            },
            input_txt: function( $val ){
                if( this.type == "input" ) {
                    this.val = $val;
                }
            },
            selectedItem: function( $val ){
                if( this.type == "input" ) return;

                if( !this.multiple ) {
                    this.input_txt = $val.name;
                    this.val = String( $val.code );
                    // this.input_txt = String( $val.code );
                } else {
                    if( this.selectedItem.length > 1 ) this.input_txt = "총 " + this.selectedItem.length + "건 | " + this.selectedItem[ 0 ].name;
                    else this.input_txt = this.selectedItem.length > 0 ? this.selectedItem[ 0 ].name : "";
                    this.val = this.$options.filters.arrToParam( this.selectedItem, ",", "code" );
                    // console.log( "selectedItem  >>  " + $val.code );
                }
            },
			filterDatas: function( $val ){
				if( $val.length > 0 ) this.expanded = true;
                else this.expanded = false;
                // this.limitCnt = 1;
                this.setUseDatas();
                this.listScrollTop = 0;
                $( this.$refs.list ).scrollTop( 0 );
                this.evt_padding();
			},
			expanded: function( $val ){
				if( $val ){
					//this.inputTxt = this.val;
					this.selectedIdx = -1;
                    //this.evt_resize();
                    $( document ).click( this.evt_docClick );
				} else {
					$( document ).unbind( "click", this.evt_docClick );
				}
			},
			selectedIdx: function( $val ){
				if( $val == -1 ) {
                    if( !this.multiple ) {
                        if( this.type == "input" ) this.input_txt = this.inputTxt;
                    } else {
                        console.log( "asdfasdf" );
                        var str = "";
                        var tmp = this.input_txt.split( "," );
                        tmp.filter( function( $item, $idx ){
                            if( $idx >= tmp.length - 1 ) return;
                            if( $idx > 0 ) str += ", ";
                            str += $item.trim();
                        })
                        if( str.length > 0 ) str += ", ";
                        str += this.inputTxt;
                        this.input_txt = str;
                    }
				} else {
                    var item = $( this.$el ).find( ".item[data-idx=" + $val + "]" );
                    var selItemPosY = 0;
                    if( this.type == "input" || !this.multiple ) {
                        selItemPosY = item.length > 0 ? item.position().top : 0;
                    } else {
                        selItemPosY = $( this.$el ).find( ".item[data-idx=" + $val + "]" ).position().top + $( this.$el ).find( ".checked_list" ).outerHeight() - $( this.$refs.list ).scrollTop() + 3;
                    }
                    var delta = selItemPosY + 23 - this.max_hgt;
                    if( delta > 0 ) {
                        this.listScrollTop = $( this.$refs.list ).scrollTop() + delta;
                    } else if( selItemPosY < 0 ) {
                        this.listScrollTop = Math.max( 0, $( this.$refs.list ).scrollTop() + selItemPosY );
                    }
                }
			},
			listScrollTop: function( $val ){
				$( this.$refs.list ).scrollTop( $val );
            },
            limitCnt: function( $val ){
                this.setUseDatas();
            }
		},
		methods: {
            setUseDatas: function(){
                var _this = this;
                this.useDatas = [];
                _this.filterDatas.filter( function( $item, $idx ){
                    //if( $idx < parseInt( _this.useLimit * _this.limitCnt ) ) {
                        _this.useDatas.push( $item )
                    //}
                })
            },
            evt_btnClick: function(){
                this.expanded = !this.expanded;
                if( this.expanded ) {
                    this.limitCnt = 1;
                    this.inputTxt = "";
                    this.filterDatas = this.autocomplete;
                    if( this.type != "select" && !this.multiple ) $( this.$refs.input ).focus();
                }
                // if( !this.multiple ) {
                //     this.inputTxt = $( this.$refs.input ).val();
                // } else {
                //     var str = "";
                //     var tmp = this.input_txt.split( "," );
                //     this.inputTxt = tmp[ tmp.length - 1 ].trim();
                // }
                
            },
			evt_keyup: function( $e ){
				if( $e.keyCode == 33 || $e.keyCode == 34 || $e.keyCode == 38 || $e.keyCode == 40 ) {
					if( this.expanded && this.selectedIdx != -1 ) {
                        if( !this.multiple ) {
                            this.input_txt = $( this.$el ).find( ".item.is-active" ).text();
                        } else {
                            if( this.type != "select" ) {
                                var str = "";
                                var tmp = this.input_txt.split( "," );
                                tmp.filter( function( $item, $idx ){
                                    if( $idx >= tmp.length - 1 ) return;
                                    if( $idx > 0 ) str += ", ";
                                    str += $item.trim();
                                })
                                if( str.length > 0 ) str += ", ";
                                str += $( this.$el ).find( ".item.is-active" ).text();
                                this.input_txt = str;
                            }
                        }
					} else {
                        this.filterDatas = this.getFilterDatas();

                        if( !this.multiple ) {
                            if( this.type == "input" ) this.inputTxt = $( this.$refs.input ).val();
                        } else {
                            if( this.type == "input" ) {
                                var str = "";
                                var tmp = this.input_txt.split( "," );
                                this.inputTxt = tmp[ tmp.length - 1 ].trim();
                            }
                        }
                    }
                    $e.preventDefault();
				} else if( $e.keyCode == 13 ){
                    if( $( this.$el ).find( ".item.is-active" ).length <= 0 ) return false;
                    if( this.type == "input" || !this.multiple ) {
                        this.selectedItem = JSON.parse( $( this.$el ).find( ".item.is-active" ).attr( "data-data" ) );
                        this.inputTxt = this.selectedItem.name;
                        this.expanded = false;
                    } else {
                        var data = JSON.parse( $( this.$el ).find( ".item[data-idx=" + this.selectedIdx + "]" ).attr( "data-data" ) );
                        this.selectedItem.push( data );
                        //this.selectedItem.splice( this.selectedItem.indexOf( data ), 1 );
                    }
				} else if( $e.keyCode == 27 ){
                    this.input_txt = this.inputTxt;
                    this.selectedIdx = -1;
                    this.expanded = false;
                    $( this.$refs.input ).blur();
				} else {
                    this.limitCnt = 1;
                    if( !this.multiple ) {
                        this.inputTxt = $( this.$refs.input ).val();
                    } else {
                        var str = "";
                        var tmp = this.input_txt.split( "," );
                        this.inputTxt = tmp[ tmp.length - 1 ].trim();
                    }
                    this.filterDatas = this.getFilterDatas();
                }
			},
			evt_keydown: function( $e ){
				if( $e.keyCode == 33 || $e.keyCode == 34 || $e.keyCode == 38 || $e.keyCode == 40 ){
					// Up
					if( $e.keyCode == 38 ) {
						this.selectedIdx--;
					// Down
					} else if( $e.keyCode == 40 ) {
						this.selectedIdx++;
					// Page Up
					} else if( $e.keyCode == 33 ) {
						var hgt = parseInt( this.max_hgt / 23 );
						this.selectedIdx -= hgt;
						if( this.selectedIdx < 0 ) this.selectedIdx = 0;
					// Page Down
					} else if( $e.keyCode == 34 ) {
						var hgt = parseInt( this.max_hgt / 23 );
						this.selectedIdx += hgt;
						if( this.selectedIdx >= this.useDatas.length ) {
                            this.selectedIdx = this.useDatas.length - 1;
                            this.evt_listScroll();
                        }
					}
					if( this.selectedIdx < -1 ) this.selectedIdx = this.useDatas.length - 1;
                    if( this.selectedIdx >= this.useDatas.length ) this.selectedIdx = -1;
                    $e.preventDefault();
                }
			},
			evt_itemClick: function( $e, $data ){
                if( !this.multiple ) {
                    this.input_txt = $( $e.target ).text();
                    if( this.type == "select" ) this.selectedItem = $data;
                    this.expanded = false;
                } else {
                    if( this.type == "input" ){
                        var str = "";
                        var tmp = this.input_txt.split( "," );
                        tmp.filter( function( $item, $idx ){
                            if( $idx >= tmp.length - 1 ) return;
                            if( $idx > 0 ) str += ", ";
                            str += $item.trim();
                        })
                        if( str.length > 0 ) str += ", ";
                        str += $( $e.target ).text();
                        this.input_txt = str;
                        this.expanded = false;
                    } else {
                        if( this.selectedItem.indexOf( $data ) >= 0 ) {
                            this.selectedItem.splice( this.selectedItem.indexOf( $data ), 1 );
                        } else {
                            if( $data ) this.selectedItem.push( $data );
                        }
                    }
                }
			},
			evt_docClick: function( $e ){
				if( !$.contains( this.$el, $e.target ) ) {
                    if( !this.multiple ) {
                        this.input_txt = $( this.$refs.input ).val();
                        if( this.type == "select" ) {
                            if( this.selectedItem ) this.input_txt = this.selectedItem.name;
                            else this.input_txt = "";
                        }
                    }
					this.expanded = false;
				}
            },
            evt_inputFocus: function( $e ){
                if( this.type == "select" && this.multiple ) this.input_txt = "";
            },
            evt_inputBlur: function( $e ){
                if( this.type != "select" ) return;

                if( !this.multiple ) {
                    if( this.expanded ) return;
                    if( this.selectedItem ) this.input_txt = this.selectedItem.name;
                    else this.input_txt = "";
                } else {
                    if( this.selectedItem.length > 1 ) this.input_txt = "총 " + this.selectedItem.length + "건 | " + this.selectedItem[ 0 ].name;
                    else this.input_txt = this.selectedItem.length > 0 ? this.selectedItem[ 0 ].name : "";
                    if( this.expanded ) return;
                }
            },
			evt_scroll: function( $e ){
				this.expanded = false;
			},
			evt_resize: function( $e ){
				this.expanded = false;
			},
			getFilterDatas: function(){
				var result =[];
                var _this = this;

                var str = this.inputTxt;
                if( this.multiple ) str = this.inputTxt.split( "," )[ this.inputTxt.split( "," ).length - 1 ].trim();
                
				if( str && str.trim().length > 0 && this.autocomplete ) {
					this.autocomplete.filter( function( $item ){
                        if( _this.type == "input" ) {
                            if( $item.toLowerCase().indexOf( str.toLowerCase() ) >= 0 ) { 
                                result.push( $item );
                            }
                        } else {
                            if( $item.name.toLowerCase().indexOf( str.toLowerCase() ) >= 0 ) { 
                                result.push( $item );
                            }
                        }
					});
                }
				return result;
			},
			set_rePos: function(){
				if( this.expanded ) {
					this.pos_left = this.$refs.input.getBoundingClientRect().left;
                    this.pos_top = this.$refs.input.getBoundingClientRect().top + $( this.$refs.input ).outerHeight();
                    this.max_hgt = $( window ).height() - this.pos_top - 10 > 500 ? 500 : $( window ).height() - this.pos_top - 10;
				}
            },
            evt_listScroll: function( $e ){
                this.visibleIdxS = Math.max( 0, ( Math.floor( ( this.$refs.expandWrap.scrollTop - ( $( this.$refs.checkList ).length > 0 ? $( this.$refs.checkList ).outerHeight() : 0 ) ) / 23 ) ) );
                this.visibleIdxE = this.visibleIdxS + 40;
                this.evt_padding();
            },
            evt_padding: function(){
                if( this.$refs.list ){
                    this.$refs.list.style.paddingTop = Math.max( 0, ( this.visibleIdxS ) * 23 ) + "px";
                    this.$refs.list.style.paddingBottom = Math.max( 0, ( this.filterDatas.length - ( this.multiple ? this.selectedItem.length : 0 ) - this.visibleIdxE ) * 23 ) + "px";
                }
            },
            evt_allChkClick: function( $e ){
                var result = [];
				if( $e.target.checked ){
					// this.opts.filter( function( $item ){
					// 	if( !$item.disabled ) result.push( $item.code );
					// });
                }
                // this.selected = result;
            },
            strToHlStr: function( $val, $txt ){
                var regx = new RegExp( $txt, "gi" );
                return $val.replace( regx, "/^/^" + "$&" + "/^/^" );
            }
        },
        directives: {
            // 달력 Insereted
            init: {
                inserted: function ( el, binding, vnode ) {
                    vnode.context.set_rePos();
                    vnode.context.evt_listScroll();
                    //vnode.context.list_hgt = ;
                }
            }
        }
    })
}());
