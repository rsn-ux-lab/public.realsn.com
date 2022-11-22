(function(){
    // HTML Template
    var template = ''
        + '<div class="dcp selectBox">'
        + '    <select ref="select" :id="id" v-model="selected" :multiple="multiple" :class="{\'is-multiple\': multiple}">'
        + '        <option v-for="item in getUseOpts" :value="item.code" :disabled="item.disabled">{{ item.name }}</option>'
        + '    </select>'
        + '    <label :for="id"></label>'
        + '    <div class="wrap" ref="container">'
        + '        <button ref="input" type="button" class="inputs" :class="{\'is-expanded\': expanded}" @click="evt_inputClick" v-html="selected_txt" :title="getTitle" :disabled="disabled"><span class="icon"></span></button>'
        + '        <div ref="list" class="list" :style="\'top: \' + pos_top + \'px; left:\' + pos_left + \'px\'">'
        + '            <transition name="fade_posy">'
        + '                <span v-if="expanded" class="mobile_bg" @click="expanded = false"></span>'
        + '            </transition>'
        + '            <transition name="fade_posy">'
        + '                <div v-if="expanded" ref="expandWrap" class="wrap" :class="{ \'is-multiple\' : multiple }" :style="\'min-width:\' + getWid + \'px; max-height:\' + max_hgt + \'px\'" @scroll="evt_listScroll" v-init>'
        + '                    <div v-if="!multiple" class="not_multiple">'
        + '                        <ul ref="expandList">'
        + '                            <template v-for="( item, idx ) in getUseOpts">'
        + '                                <li v-bind:key="\'list_\' + idx">'
        + '                                    <button class="item" :value="item.code" :class="item.code == selected ? \'is-active\' : \'\'" :disabled="item.disabled" @click="evt_itemClick">{{ item.name }}</button>'
        + '                                </li>'
        + '                            </template>'
        + '                        </ul>'
        + '                    </div>'
        + '                    <div v-else class="is-multiple">'
        + '                        <div class="all">'
        + '                            <span>All</span>'
        + '                            <comp-switch-btn class="is-small" :id="id + \'_all\'" v-model="allChecked" :click="evt_allChkClick"></comp-switch-btn>'
        + '                        </div>'
        + '                        <div class="list_wrap">'
        + '                            <div class="checked_list">'
        + '                                <strong>선택됨 <span class="total">총<strong>{{ selected.length | lengthLimitComma }}</strong>건</span></strong>'
        + '                                <ul>'
        + '                                    <li v-for="item in getCheckedLists">'
        + '                                        <button class="item" :value="item.code" :class="selected.indexOf( item.code ) >= 0 ? \'is-active\' : \'\'" :disabled="item.disabled" @click="evt_itemClick">{{ item.name }}</button>'
        + '                                    </li>'
        + '                                </ul>'
        + '                            </div>'
        + '                            <div v-if="getUnCheckedLists.length > 0" class="unchecked_list">'
        + '                                <strong class="ui_invisible">아이템</strong>'
        + '                                <ul>'
        + '                                    <li v-for="item in getUnCheckedLists">'
        + '                                        <button class="item" :value="item.code" :class="selected.indexOf( item.code ) >= 0 ? \'is-active\' : \'\'" :disabled="item.disabled" @click="evt_itemClick">{{ item.name }}</button>'
        + '                                    </li>'
        + '                                </ul>'
        + '                            </div>'
        + '                        </div>'
        // Mobile ---------------------------------------------------------------------------------------------------
        + '                        <div class="list_wrap is-mobile" :style="\'height:\' + multi_scroll_hgt + \'px\'">'
        + '                            <div class="checked_list">'
        + '                                <strong>선택됨 <span class="total">총<strong>{{ selected.length | lengthLimitComma }}</strong>건</span></strong>'
        + '                                <ul>'
        + '                                    <li v-for="item in getCheckedLists">'
        + '                                        <button class="item" :value="item.code" :class="selected.indexOf( item.code ) >= 0 ? \'is-active\' : \'\'" :disabled="item.disabled" @click="evt_itemClick">{{ item.name }}</button>'
        + '                                    </li>'
        + '                                </ul>'
        + '                            </div>'
        + '                            <div v-if="getUnCheckedLists.length > 0" class="unchecked_list">'
        + '                                <strong class="ui_invisible">아이템</strong>'
        + '                                <ul>'
        + '                                    <li v-for="item in getUnCheckedLists">'
        + '                                        <button class="item" :value="item.code" :class="selected.indexOf( item.code ) >= 0 ? \'is-active\' : \'\'" :disabled="item.disabled" @click="evt_itemClick">{{ item.name }}</button>'
        + '                                    </li>'
        + '                                </ul>'
        + '                            </div>'
        + '                        </div>'
        + '                        <div class="btns">'
        + '                            <button class="ui_btn" @click="expanded=false"><span>확인</span></button>'
        + '                        </div>'
        + '                    </div>'
        + '                </div>'
        + '            </transition>'
        + '        </div>'
        + '    </div>'
        + '</div>'

    // Component
    comp = Vue.component( "comp-selectbox", {
        template: template,
        data: function(){
			return {
				expanded: false,
				pos_top: 0,
				pos_left: 0,
                max_hgt: 0,
                list_hgt: 0,
				multi_scroll_hgt: 0,
				allChecked: this.selected && this.selected.length == this.opts.length ? true : false,
				checke_list: [],
                unchecke_list: [],
                visibleIdxS: 0,
                visibleIdxE: 26,
                listScroll: 0,
			};
		},
		props: [ "id", "value", "opts", "multiple", "disabled", "notSelectedLabel", "allSelectedLabel" ],
		computed: {
            topSpace: function(){
                //return ( Math.max( 0, this.visibleIdxS - 10 ) ) * 23;
            },
            bottomSpace: function(){
                //return Math.max( 0, ( this.opts.length - this.visibleIdxE ) * 23 );
            },
            getUseOpts: function(){
                var result = this.opts.concat();
                if( this.allSelectedLabel ) {
                    var allCode = "";
                    result.filter( function( $item, $idx ){
                        if( !$item.disabled ) {
                            if( $idx != 0 && allCode != "" ) allCode += ",";
                            allCode += $item.code;
                        }
                    });
                    result.unshift( { code: allCode, name: this.allSelectedLabel } );
                }
                if( !this.notSelectedLabel && !this.allSelectedLabel && ( this.value == "" || this.value == undefined || this.value == null ) ) {
                    this.$emit( "input", result[ 0 ].code );
                }
                if( !this.multiple ) result = result.slice( this.visibleIdxS, this.visibleIdxE + 1 );
                return result;
            },
			selected: {
				get: function() {
                    if( this.allSelectedLabel && ( this.value == "" || this.value == null || this.value == undefined ) ) {
                        this.$emit( "input", this.getUseOpts[ 0 ].code );
                        return this.getUseOpts[ 0 ].code;
                    }
                    if( !this.multiple ) return this.value;
                    else {
                        return this.$options.filters.paramToArr( this.value );
                    }
				},
				set: function( $val ) {
                    if( $val ) this.$emit( "input", this.multiple ? this.$options.filters.arrToParam( $val ) : $val );
                    else {
                        if( !this.allSelectedLabel && !this.notSelectedLabel ) this.$emit( "input", this.getUseOpts[ 0 ].code );
                    }
				}
			},
			selected_txt: function(){
				var result = "";
				var _this = this;
				if( !this.multiple ) {
					this.opts.filter( function( $item ){
						if( $item.code == _this.selected ){
							result = $item.name;
						}
                    });
                    if( !result ) {
                        if( this.allSelectedLabel ) result = this.allSelectedLabel;
                        if( this.notSelectedLabel ) result = this.notSelectedLabel;
                    }
				} else {
					for( var Loop1 = 0 ; Loop1 < this.opts.length ; ++Loop1 ){
						if( this.selected.indexOf( this.opts[ Loop1 ].code ) >= 0 ) {
							result = this.opts[ Loop1 ].name;
							break;
						}
					}
                    if( this.selected.length > 1 ) result = "<span class=\"checked_len\">총<strong>" + this.$options.filters.lengthLimitComma( this.selected.length ) + "</strong>건</span>" + result;
                    
                    if( !result ) result = "선택하세요";
                }
				
				return result;
            },
            getTitle: function(){
                var result = this.multiple ? "총 " + this.getCheckedLists.length + "개 / " : "";
                if( this.multiple ) {
                    this.getCheckedLists.filter( function( $item, $idx ){
                        if( $idx != 0 ) result += ", ";
                        result += $item.name;
                    });
                }
                return result;
            },
			getWid: function(){
				return $( this.$refs.container ).outerWidth();
			},
			getMrn: function(){
				return $( document )[ 0 ].scrollTop;
			},
			getEnabledOpts: function(){
				var result = [];
				var _this = this;
				this.opts.filter( function( $item ){
					if( !$item.disabled ) {
						result.push( $item );
					}
				});
				return result;
			},
			getCheckedLists: function(){
				var result = [];
                var _this = this;
				this.opts.filter( function( $item ){
					if( _this && _this.selected && _this.selected.indexOf( $item.code ) >= 0 ) {
						result.push( JSON.parse( JSON.stringify( $item ) ) );
					}
                });
				return result;
			},
			getUnCheckedLists: function(){
				var result = [];
				var _this = this;
				this.opts.filter( function( $item ){
					if( _this.selected && _this.selected.indexOf( $item.code ) < 0 ) {
						result.push( $item );
					}
				});
				return result;
			}
		},
		created: function (){
            if( !this.notSelectedLabel && !this.allSelectedLabel && ( this.value == "" || this.value == undefined || this.value == null ) ) {
                this.$emit( "input", this.getUseOpts[ 0 ].code );
            }
            if( this.multiple ) {
                if( this.getCheckedLists.length == this.getEnabledOpts.length ) this.allChecked = true;
                else this.allChecked = false;
            }
		},
		mounted: function (){
			var _this = this;
			$( this.getScrollParents( this.$el ) ).each( function(){
				$( this ).scroll( _this.evt_scroll );
			});

			$( window ).scroll( this.evt_scroll );
            $( window ).resize( this.evt_resize );
		},
		watch: {
            opts: function(){
                this.$emit( "input", "" );
            },
            allChecked: function( $val ){
                // var result = [];
				// if( $val ){
				// 	this.opts.filter( function( $item ){
				// 		if( !$item.disabled ) result.push( $item.code );
				// 	});
                // }
                // console.log( "set before >> " + result );
                // this.$emit( "input", this.$options.filters.arrToParam( result ) );
                // this.selected = result;
            },
			value: function( $val ){
                // if( $val == "" || $val == null || $val == undefined ) $val = "1,2,3"
				if( this.multiple ) {
					if( this.getCheckedLists.length == this.getEnabledOpts.length ) this.allChecked = true;
					else this.allChecked = false;
				}
			},
			expanded: function( $val ){
				if( $val ) {
					$( document ).click( this.evt_docClick );
				} else {
					$( document ).unbind( "click", this.evt_docClick );
				}
			}
		},
		methods: {
			evt_docClick: function( $e ){
				if( !$.contains( this.$el, $e.target ) ) this.expanded = false;
			},
			evt_inputClick: function( $e ){
				this.expanded = !this.expanded;
			},
			evt_itemClick: function( $e ){
				if( !this.multiple ){
					this.expanded = false;
					this.selected = String( $e.target.value );
				} else {
					$e.stopPropagation();
					var tmp = this.selected.concat();
					if( tmp.indexOf( $e.target.value ) < 0 ) {
						tmp.push( $e.target.value );
					} else {
						tmp.splice( tmp.indexOf( $e.target.value ), 1 );
                    }
					this.selected = tmp;
				}
            },
            evt_allChkClick: function( $e ){
                var result = [];
				if( $e.target.checked ){
                    this.opts.filter( function( $item ){
                        if( !$item.disabled ) result.push( $item.code );
					});
                }
                this.selected = result;
            },
			evt_scroll: function( $e ){
				this.expanded = false;
			},
			evt_resize: function( $e ){
				this.expanded = false;
			},
			getScrollParents: function( $node ){
				var result = [];

                getElements( $node );
                
				function getElements( $el ){
					if( $el == null ) {
						return null;
					}

					if( $el.scrollHeight > $el.clientHeight ) {
						result.push( $el );
						return getElements( $el.parentNode );
					} else {
						return getElements( $el.parentNode );
					}
				}

				return result;
			},
			set_rePos: function(){
				if( this.expanded ) {
                    this.pos_top = $( this.$refs.input ).offset().top - $( document ).scrollTop() + $( this.$refs.input ).outerHeight();
                    this.pos_left = $( this.$refs.input ).offset().left - $( document ).scrollLeft();
                    this.max_hgt = $( window ).height() - this.pos_top - 10 > 500 ? 500 : $( window ).height() - this.pos_top - 10;
                    this.multi_scroll_hgt = $( window ).height() - 134 - 35 - 50;
				}
            },
            evt_listScroll: function( $e ){
                this.visibleIdxS = Math.max( 0, Math.floor( ( this.$refs.expandWrap.scrollTop ) / 23 ) );
                this.visibleIdxE = this.visibleIdxS + 40;
                if( this.$refs.expandList ){
                    this.$refs.expandList.style.paddingTop = ( ( Math.max( 0, this.visibleIdxS - 10 ) ) * 23 ) + "px";
                    this.$refs.expandList.style.paddingBottom = Math.max( 0, ( this.opts.length - this.visibleIdxE ) * 23 ) + "px";
                }
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
