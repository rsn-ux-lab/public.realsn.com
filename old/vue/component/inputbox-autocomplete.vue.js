(function(){
    // HTML Template
    var template = ''
        + '<div ref="container" class="dcp inputBox">'
        + '    <div class="input">'
        + '        <input type="text" autocomplete="off" ref="input" :id="id" @input="val = $event.target.value" :value="val" :class="$vnode.data.staticClass" :disabled="disabled" :placeholder="$vnode.data.attrs.placeholder" @keyup="evt_keyup" @keydown="evt_keydown"><label :for="id" class="ui_invisible">{{ getLabel }}</label>'
        + '    </div>'
        + '    <div class="list" :style="\'top: \' + pos_top + \'px; left:\' + pos_left + \'px\'">'
        + '        <transition name="fade_posy">'
        + '            <ul v-if="expanded" ref="list" :style="\'min-width:\' + getWid + \'px; max-height:\' + max_hgt + \'px\'" @scroll="evt_list_scroll">'
        + '                <template v-for="( item, idx ) in useDatas">'
        + '                    <li v-bind:key="id + \'_\' + idx">'
        + '                        <button class="item" :class="{ \'is-active\' : idx == selectedIdx }" :data-idx="idx" @click="evt_itemClick" v-html="$options.filters.strToHlStr( item, inputTxt )"></button>'
        + '                    </li>'
        + '                </template>'
        + '            </ul>'
        + '        </transition>'
        + '    </div>'
        + '</div>'

    // Component
    var comp = Vue.component( "comp-autocomplete-box", {
        template: template,
        data: function() {
            return {
                limitCnt: 0,
                pos_top: 0,
                pos_left: 0,
                max_hgt: 0,
                inputTxt: "",
                selectedIdx: -1,
                listScrollTop: 0,
                filterDatas: [],
                useDatas: [],
                expanded: false
            };
        },
        props: {
            id: { type: String },
            value: { type: String },
            disabled: { type: String },
            label: { type: String },
            autocomplete: { type: Array },
            limit: { type: Number, default: 500 },
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
		},
        created: function (){
		},
		mounted: function (){
			$( window ).scroll( this.evt_scroll );
            $( window ).resize( this.evt_resize );
		},
		watch: {
			filterDatas: function( $val ){
				if( $val.length > 0 ) this.expanded = true;
                else this.expanded = false;
                // this.limitCnt = 1;
                this.setUseDatas();
                this.listScrollTop = 0;
                $( this.$refs.list ).scrollTop( 0 );
			},
			expanded: function( $val ){
				if( $val ){
					//this.inputTxt = this.val;
					this.selectedIdx = -1;
					this.set_rePos();
                    $( document ).click( this.evt_docClick );
				} else {
					$( document ).unbind( "click", this.evt_docClick );
				}
			},
			selectedIdx: function( $val ){
				if( $val == -1 ) {
                    if( !this.multiple ) {
                        this.val = this.inputTxt;
                    } else {
                        var str = "";
                        var tmp = this.val.split( "," );
                        tmp.filter( function( $item, $idx ){
                            if( $idx >= tmp.length - 1 ) return;
                            if( $idx > 0 ) str += ", ";
                            str += $item.trim();
                        })
                        if( str.length > 0 ) str += ", ";
                        str += this.inputTxt;
                        this.val = str;
                    }
				} else {
					var item =  $( this.$el ).find( ".item[data-idx=" + $val + "]" );
					var selItemPosY = item.length > 0 ? item.position().top : 0;
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
                    if( $idx < parseInt( _this.limit * _this.limitCnt ) ) {
                        _this.useDatas.push( $item )
                    }
                })
            },
			evt_keyup: function( $e ){
				if( $e.keyCode == 33 || $e.keyCode == 34 || $e.keyCode == 38 || $e.keyCode == 40 ) {
					if( this.expanded && this.selectedIdx != -1 ) {
                        if( !this.multiple ) {
                            this.val = $( this.$el ).find( ".item.is-active" ).text();
                        } else {
                            var str = "";
                            var tmp = this.val.split( "," );
                            tmp.filter( function( $item, $idx ){
                                if( $idx >= tmp.length - 1 ) return;
                                if( $idx > 0 ) str += ", ";
                                str += $item.trim();
                            })
                            if( str.length > 0 ) str += ", ";
                            str += $( this.$el ).find( ".item.is-active" ).text();
                            this.val = str;
                        }
					} else {
                        this.filterDatas = this.getFilterDatas();

                        if( !this.multiple ) {
                            this.inputTxt = $( this.$refs.input ).val();
                        } else {
                            var str = "";
                            var tmp = this.val.split( "," );
                            this.inputTxt = tmp[ tmp.length - 1 ].trim();
                        }
					}
				} else if( $e.keyCode == 13 ){
					this.expanded = false;
				} else if( $e.keyCode == 27 ){
					this.selectedIdx = -1;
					this.expanded = false;
				} else {
                    this.limitCnt = 1;
                    this.filterDatas = this.getFilterDatas();
                    if( !this.multiple ) {
                        this.inputTxt = $( this.$refs.input ).val();
                    } else {
                        var str = "";
                        var tmp = this.val.split( "," );
                        this.inputTxt = tmp[ tmp.length - 1 ].trim();
                    }
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
                            this.evt_list_scroll();
                        }
					}
					if( this.selectedIdx < -1 ) this.selectedIdx = this.useDatas.length - 1;
                    if( this.selectedIdx >= this.useDatas.length ) this.selectedIdx = -1;
				}
			},
			evt_itemClick: function( $e ){
                if( !this.multiple ) {
                    this.val = $( $e.target ).text();
                } else {
                    var str = "";
                    var tmp = this.val.split( "," );
                    tmp.filter( function( $item, $idx ){
                        if( $idx >= tmp.length - 1 ) return;
                        if( $idx > 0 ) str += ", ";
                        str += $item.trim();
                    })
                    if( str.length > 0 ) str += ", ";
                    str += $( $e.target ).text();
                    this.val = str;
                }
				this.expanded = false;
			},
			evt_docClick: function( $e ){
				if( !$.contains( this.$el, $e.target ) ) {
					this.val = $( this.$refs.input ).val();
					this.expanded = false;
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

                var str = this.val;
                if( this.multiple ) str = this.val.split( "," )[ this.val.split( "," ).length - 1 ].trim();
                
				if( str && str.trim().length > 0 && this.autocomplete ) {
					this.autocomplete.filter( function( $item ){
						if( $item.toLowerCase().indexOf( str.toLowerCase() ) >= 0 ) { 
							result.push( $item );
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
            evt_list_scroll: function( $e ){
                if( this.$refs.list.offsetHeight + this.$refs.list.scrollTop + 20 > this.$refs.list.scrollHeight ){
                    this.limitCnt++;
                }
            }
		}
    })
}());
