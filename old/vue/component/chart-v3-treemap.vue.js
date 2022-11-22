(function(){
    // HTML Template
    var template = ''
        + '<div class="ui_treemap" :class="[ { \'ui_nodata\': !chartData || chartData.data.length == 0 }, { \'is-click\': chartClick || toggleType != \'none\' } ]" :style="\'overflow:\' + ( resizing ? \'hidden\' : \'visible\' )">'
        + '    <div :id="id" ref="treemap" class="treemap_wrap" :style="$vnode.data.staticStyle"></div>'
        // + '    <transition-group name="fade_posy_margin" tag="div" class="treemap_bubble_wrap">'
        + '    <transition-group tag="div" class="treemap_bubble_wrap">'
        + '        <div v-for="( $item, $idx ) in popupDatas" v-bind:key="$item.target + \'-\' + $idx" class="ui_bubble_box" :class="getChartTextColor( $item.color )" :data-bubble-for="id + \'_\' + $item.code" data-pos="CT" v-bubble_init><span class="arrow" :style="\'border-color:\' + $item.color">-</span><div class="wrap" :style="\'background:\' + $item.color"><div class="infos">'
        + '            <span class="title">{{ $item.name }}</span>'
        + '            <strong class="dv">{{ $item.value | lengthLimitComma(1) }}</strong>'
        + '            <span class="fluc" v-if="$item.fluc != undefined"><span class="ui_fluc before" :class="$item.fluc > 0 ? \'up\' : ( $item.fluc < 0 ? \'dn\' : \'none\' )">{{ Math.abs( $item.fluc ) | lengthLimitComma(1) }}{{ flucUnit }}</span></span>'
        + '            <span class="per" v-if="percentage">({{ ( $item.value / totalVal * 100 ).toFixed( 1 ) }}%)</span>'
        + '        </div></div></div>'
        + '    </transition-group>'
        + '</div>'

    // Component
    comp = Vue.component( "comp-chart-v3-treemap", {
        template: template,
        data: function() {
            return {
                colors: [],
                totalVal: 0,
                bubbleItems: [],
                popupDatas: [],
                resizing: false,
                resizeTimer: null,
                elWid: 0,
            };
        },
        props: {
            id: { type: String },
            toggleType: { type: String, default: "none" },
            chartData: { type: Object, default: null },
            chartClick: { type: Function },
            opts: { type: Object },
            value: { type: String, default: "" },
            percentage: { type: Boolean, default: true },
            flucUnit: { type: String, default: "" },
        },
        computed: {
            checked: {
				get: function() {
					return this.value;
				},
				set: function( $val ) {
					this.$emit( 'input', $val );
				}
            },
            getChartData: function(){
                var _this = this;
                var result = [];
                this.chartData.data.filter( function( $item ){
                    _this.totalVal += $item.value;
                });
                this.chartData.data.filter( function( $item ){
                    var obj = {};
                    if( $item.code ) obj.code = $item.code;
                    obj.label = "<span class='infos'><span class='title'>" + $item.name + "</span><strong class='dv'>" + ( _this.$options.filters.lengthLimitComma( $item.value, 1 ) ) + "</strong>" + ( _this.percentage ? "<span class='per'>(" + ( $item.value / _this.totalVal * 100 ).toFixed(1) + "%)</span>" : "" ) + "</span>";
                    obj.name = $item.name;
                    obj.value = $item.value;
                    if( $item.fluc != undefined ) obj.fluc = $item.fluc;
                    if( $item.fill ) obj.fill = $item.fill;
                    obj.data = $item.data;
                    result.push( obj );
                })
                return result;
            }
        },
        created: function(){
            if( this.opts && this.opts.colors ) this.colors = jsgradient.generateGradient( this.opts.colors[ 0 ], this.opts.colors[ 1 ], 12 );
            else this.colors = jsgradient.generateGradient( '#333333', '#c4c4c4', 12 );
            $( window ).resize( this.evt_resize );
        },
		mounted: function() {
            this.build_treemap();
            // this.elWid = $( this.$el ).outerWidth();
        },
        watch: {
            checked: function( $val ){
                var _this = this;
                var tmp = $val.split( "," );
                $( this.$el ).find( ".treemap-node" ).each( function(){
                    if( tmp.indexOf( $( this ).attr( "data-code" ) ) >= 0 ) $( this ).addClass( "is-active" );
                    else $( this ).removeClass( "is-active" );
                });
            },
            elWid: function( $val ) {
                var _this = this;
                this.resizing = true;
                clearTimeout( this.resizeTimer );
                this.resizeTimer = setTimeout( function(){
                    _this.resizing = false;
                    _this.build_treemap();
                }, 300 );
            },
            chartData: {
                deep: true,
                handler: function( $val ){
                    this.build_treemap();
                }
            }
        },
        methods: {
            build_treemap: function(){
                var _this = this;
                this.totalVal = 0;
                var tg = $( this.$refs.treemap );

                if( !this.chartData || this.chartData.data.length == 0 ) return;

                // console.log( "build treemap" );

                tg.treemap( this.getChartData, {
                    smallestFontSize: 12,
                    startingFontSize: 12,
                    nodeClass: function ( $node, $box, $itemLen ){
                        var result = "";
        
                        if( $box.width() < 40 || $box.height() < 30 ) result = "full hide ";
                        else if( $box.width() < 70 || $box.height() < 90 ) result = "hide ";
                        $box.css( "background", _this.colors[ $box.index() ] );
                        if( $node.fill ) $box.css( "background", $node.fill );
                        else $node.fill = _this.colors[ $box.index() ];
                        $box.attr( "data-bubble-id", _this.id + "_" + $node.code );
                        if( $node.data.active ) $box.addClass( "is-active" );
                        if( $node.code ) $box.attr( "data-code", $node.code );

                        return result;
                    },
                    ready: function (){
                    },
                    mouseenter: _this.hndl_bubbleBox_on,
                    mouseleave: _this.hndl_bubbleBox_off,
                    // mousemove: evt_treemap_mouseMove,
                    click: function( $node, $e ){
                        if( _this.toggleType == "one" ) {
                            _this.checked = $node.code
                        } else if( _this.toggleType == "multi" ) {
                            var tmp = _this.checked.split( "," );
                            if( tmp.indexOf( $node.code ) >= 0 ) {
                                var tmpStr = "";
                                tmp.splice( tmp.indexOf( $node.code ), 1 );
                                tmp.filter( function( $item, $idx ){
                                    if( $idx > 0 ) tmpStr += ",";
                                    tmpStr += $item;
                                })
                                _this.checked = tmpStr;
                            } else {
                                if( _this.checked == "" ) _this.checked = $node.code;
                                else _this.checked += "," + $node.code;
                            }
                        }

                        if( _this.chartClick ) _this.chartClick( $node, $e );
                    },
                    itemMargin: 1
                });
            },
            getChartTextColor: function( $val ){
                return jsgradient.getReversal( $val ) ? "" : "is-black";
            },
            hndl_bubbleBox_on: function( $node, $e ){
                var item = {};
                item.code = $node.code;
                item.name = $node.name;
                item.value = $node.value;
                item.color = $node.fill;

                if( $node.fluc != undefined ) item.fluc = $node.fluc;

                this.popupDatas.push( item );
            },
            hndl_bubbleBox_off: function( $node, $e ){
                this.popupDatas = [];
            },
            getPos: function( $btn ){
                var btn = $( $btn );
                var bubbleBox = $( this.$el ).find( "*[data-bubble-for=\"" + btn.attr( "data-bubble-id" ) + "\"]" );
                var result = {};
                var space = 12;
                result.top = ( btn.position().top + ( btn.outerHeight() / 2 ) ) - ( bubbleBox.outerHeight() ) - space;
                result.left = ( btn.position().left + ( btn.outerWidth() / 2 ) ) - ( bubbleBox.outerWidth() / 2 );
                return result;
            },
            evt_resize: function(){
                this.elWid = $( this.$el ).outerWidth();
            }
        },
        directives: {
            bubble_init: {
                inserted: function ( el, binding, vnode ) {
                    var id = $( el ).attr( "data-bubble-for" );
                    var btn = $( vnode.context.$el ).find( "*[data-bubble-id=\"" + id + "\"]" );
                    var pos = vnode.context.getPos( btn );
                    $( el ).css( pos );
                }
            }
        },
    })
}());


