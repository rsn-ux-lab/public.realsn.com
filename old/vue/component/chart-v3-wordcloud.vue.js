(function(){
    // HTML Template
    var template = ''
    + '<div class="ui_word_cloud_container" v-init>'
    + '    <div ref="chart" class="ui_chart_wrap is-wordCloud-v3" :class="[ { \'is-click\': chartClick || value != null }, { \'ui_nodata\': chartData.data.length == 0 }, { \'is-legend\': legend } ]" :style="\'height:\' + getHgt + \'px;overflow:\' + ( resizing ? \'hidden\' : \'visible\' )"></div>'
    // + '    <transition-group name="fade_posy_margin" tag="div" class="bubble_wrap">'
    + '    <transition-group tag="div" class="bubble_wrap">'
    + '        <div v-for="( $item, $idx ) in popupDatas" v-bind:key="$item.target + \'-\' + $idx" class="ui_bubble_box" :class="getChartTextColor( $item.color || \'#666666\' )" :data-bubble-for="id + \'_\' + $item.code" data-pos="CT" v-bubble_init><span class="arrow" :style="\'border-color:\' + $item.color">-</span><div class="wrap" :style="\'background:\' + $item.color"><div class="infos">'
    + '            <span class="title">{{ $item.word }}</span>'
    + '            <strong class="dv">{{ $item.weight | lengthLimitComma(1) }}</strong>'
    + '            <span v-if="bubblePercentage" class="per">({{ ( $item.weight / totalVal * 100 ).toFixed( 1 ) }}%)</span>'
    + '        </div></div></div>'
    + '    </transition-group>'
    + '    <div v-if="legend" class="color_set">'
    + '        <ul>'
    + '            <li class="item"><span>~</span>10%</li>'
    + '            <li class="item"><span>~</span>20%</li>'
    + '            <li class="item"><span>~</span>30%</li>'
    + '            <li class="item"><span>~</span>40%</li>'
    + '            <li class="item"><span>~</span>50%</li>'
    + '            <li class="item"><span>~</span>60%</li>'
    + '            <li class="item"><span>~</span>70%</li>'
    + '            <li class="item"><span>~</span>80%</li>'
    + '            <li class="item"><span>~</span>90%</li>'
    + '            <li class="item"><span>~</span>100%</li>'
    + '        </ul>'
    + '    </div>'
    + '</div>'

    var legendTemplate = ''

    // Component
    comp = Vue.component( "comp-chart-v3-wordcloud", {
        template: template,
        data: function(){
			return {
                loading: false,
                chart: null,
                series: null,
                minValue: 0,
                maxValue: 0,
                hgt: 0,
                totalVal: 0,
                colors: [ "#EC5151", "#F58B39", "#F6B61F", "#ABC834", "#69B229", "#28AA53", "#1E9BC9", "#3972D5", "#9C69DF", "#AAAAAA" ],
                expandedActive: false,
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
            opts: { type: Object, default: null },
            legend: { type: Boolean, default: false },
            // selectedKeyword: { type: String },
            // digitNumber: { type: Number, default: 0 },
            // selecteds: { type: String },
            // chartHgt: { type: Number, default: null },
            expandData: { type: Object },
            value: { type: String, default: null },
            rotation: { type: Boolean, default: true },
            bubblePercentage: { type: Boolean, default: true },
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
            getHgt: function(){
                if( this.legend ) {
                    return parseInt( this.$vnode.data.staticStyle.height ) - 40;
                } else {
                    return parseInt( this.$vnode.data.staticStyle.height );
                }
            },
            getChartData: function(){
                var _this = this;
                var result = [];
                var rangeCnt = Math.ceil( this.chartData.data.length / this.colors.length );
                var legendCnt = 0;
                this.totalVal = 0;
                this.chartData.data.filter( function( $item ){
                    _this.totalVal += parseInt( $item.value );
                });
                this.chartData.data.filter( function( $item, $idx ){
                    var item = {};
                    item.code = $item.code;
                    item.word = $item.keyword;
                    item.weight = $item.value;
                    if( $item.fill ) item.color = $item.fill;
                    if( _this.legend ) {
                        item.color = _this.colors[ legendCnt ];
                        if( $idx != 0 && $idx%rangeCnt == 0 ) legendCnt++;
                    }
                    result.push( item );
                })
                return result;
            }
        },
        created: function(){
            $( window ).resize( this.evt_resize );
        },
		mounted: function (){
            this.elWid = $( this.$el ).outerWidth();
            // this.buildChart();
        },
        watch: {
            checked: function( $val ){
                var _this = this;
                var tmp = $val.split( "," );
                $( this.$el ).find( ".word_item" ).each( function(){
                    if( tmp.indexOf( $( this ).attr( "data-code" ) ) >= 0 ) $( this ).addClass( "is-active" );
                    else $( this ).removeClass( "is-active" );
                });
            },
            loading: function( $val ){
                if( $val ) this.$emit( "chartLoadStart" );
                else this.$emit( "chartLoadEnd" );
            },
            chartData: {
                deep: true,
                handler: function( $val ){
                    this.buildChart();
                }
            },
            elWid: function( $val ) {
                var _this = this;
                this.resizing = true;
                clearTimeout( this.resizeTimer );
                this.resizeTimer = setTimeout( function(){
                    _this.resizing = false;
                    _this.buildChart();
                }, 300 );
            },
            // resizing: function( $val ){
            //     // if( $val ) $( this.$el ).css( "overflow", "hidden" );
            // }
        },
        methods: {
            buildChart: function(){
                if( this.chartData.data.length > 0 ) {
                    if( this.chart ) {
                        $( this.$refs.chart ).html( "" );
                        this.chart = null;
                    }
                    this.chart = "chart";
                    var opts = {
                        id: this.id,
                        words: this.getChartData,
                        minFont: 11,
                        maxFont: 50,
                        word_common_classes: "word_item",
                        word_click: this.evt_chartClick,
                        word_mouseOver: this.hndl_bubbleBox_on,
                        word_mouseOut: this.hndl_bubbleBox_off,
                        verticalEnabled: this.rotation,
                    };
                    var useOpts = Object.assign( opts, this.opts );
                    if( this.$store.state.mq.indexOf( "mobile" ) >= 0 ) useOpts.maxFont = 40;
                    $( this.$refs.chart ).jQWCloud( useOpts );
                }
            },
            getChartTextColor: function( $val ){
                return jsgradient.getReversal( $val ) ? "" : "is-black";
            },
            evt_chartClick: function( $e ){
                if( this.toggleType == "one" ) {
                    this.checked = $e.code;
                } else if( this.toggleType == "multi" ) {
                    var tmp = this.checked.split( "," );
                    if( tmp.indexOf( $e.code ) >= 0 ) {
                        var tmpStr = "";
                        tmp.splice( tmp.indexOf( $e.code ), 1 );
                        tmp.filter( function( $item, $idx ){
                            if( $idx > 0 ) tmpStr += ",";
                            tmpStr += $item;
                        })
                        this.checked = tmpStr;
                    } else {
                        if( this.checked == "" ) this.checked = $e.code;
                        else this.checked += "," + $e.code;
                    }
                }

                if( this.chartClick ) this.chartClick( $e );
            },
            hndl_bubbleBox_on: function( $e, $val ){
                var btn = $( $e.target );
                this.popupDatas.push( $val );
            },
            hndl_bubbleBox_off: function( $e, $val ){
                this.popupDatas = [];
                //this.popupDatas.shift();
            },
            getPos: function( $btn ){
                var btn = $( $btn );
                var bubbleBox = $( this.$el ).find( "*[data-bubble-for=\"" + btn.attr( "data-bubble-id" ) + "\"]" );
                var result = {};
                var space = parseInt( btn.outerHeight() * 0.5 ) + 8;
                if( btn.css( "transform" ) == "none" ) {
                    result.top = ( btn.position().top + ( btn.outerHeight() / 2 ) ) - ( bubbleBox.outerHeight() ) - space + "px";
                    result.left = ( btn.position().left + ( btn.outerWidth() / 2 ) ) - ( bubbleBox.outerWidth() / 2 ) + "px";
                } else {
                    result.top = ( btn.position().top + ( btn.outerWidth() / 2 ) ) - ( bubbleBox.outerHeight() ) - space + "px";
                    result.left = ( btn.position().left + ( btn.outerHeight() / 2 ) ) - ( bubbleBox.outerWidth() / 2 ) + "px";
                }
                return result;
            },
            evt_resize: function(){
                this.elWid = $( this.$el ).outerWidth();
            }
        },
        directives: {
            init: {
                inserted: function ( el, binding, vnode ) {
                    // el.css( "width" )
                    // var id = $( el ).attr( "data-bubble-for" );
                    // var btn = $( vnode.context.$el ).find( "*[data-bubble-id=\"" + id + "\"]" );
                    // var pos = vnode.context.getPos( btn );
                    // $( el ).css( pos );
                }
            },
            bubble_init: {
                inserted: function ( el, binding, vnode ) {
                    var id = $( el ).attr( "data-bubble-for" );
                    var btn = $( vnode.context.$el ).find( "*[data-bubble-id=\"" + id + "\"]" );
                    var pos = vnode.context.getPos( btn );
                    $( el ).css( pos );
                }
            }
        },
        destroyed: function(){
            // if( this.chart ) {
            //     this.chart.disposeChildren();
            //     this.chart.dispose();
            // }
        }
    })
}());
