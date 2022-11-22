(function(){
    // HTML Template
    var template = '<div ref="chart" :id="id" class="ui_chart_wrap" :class="[ { \'ui_nodata\': !chartData.data || chartData.data.length == 0 }, { \'is-click\': chartClick } ]"></div>'

    // Component
    comp = Vue.component( "comp-chart-v3-pie", {
        template: template,
        data: function(){
			return {
                chart: null,
                defaultChartOpts: {
                    "type": "pie",
                    "balloonText": '<div class="v3_chart_tooltip"><strong class="title">[[title]]</strong><span class="dv">[[value]]</span><span class="per">([[percents]]%)</span></div>',
                    "colors": [
                        "#6ED1DB",
                        "#5CBEE5",
                        "#49AADB",
                        "#478FDD",
                        "#8154EF",
                        "#DA42E2",
                        "#DD3E60",
                        "#EF6852",
                        "#EA8D1F",
                        "#EDCA1D",
                        "#DADD3C",
                        "#B8CC42",
                        "#6CCC44",
                        "#46BC94",
                        "#31C8C8"
                    ],
                    "fontSize": 12,
                    "autoDisplay": true,
                    "addClassNames": true,
                    "radius": "40%",
                    "innerRadius": "60%",
                    "labelRadius": -20,
                    "labelText": " [[percents]]%",
                    "hideLabelsPercent": 4,
                    "labelColorField": "#FFFFFF",
                    "marginBottom": 0,
                    "marginTop": 0,
                    "startDuration": 0,
                    "titleField": "category",
                    "valueField": "value",
                    "color": "#FFFFFF",
                    "percentPrecision": 1,
                    "pullOutRadius": "0%",
	                "usePrefixes": true,
                    "allLabels": [],
                    "balloon": {
                        "adjustBorderColor": false,
                        "fixedPosition": true,
                        "animationDuration": 0,
                        "fadeOutDuration": 0,
                        "fillAlpha": 1,
                        "horizontalPadding": 5,
                        "shadowAlpha": 0.1,
                        "verticalPadding": 3
                    },
                    "legend": {
                        "enabled": true,
                        "position": this.legend ? this.legend : "top",
                        "align": "center",
                        "equalWidths": false,
                        // "autoMargins": false,
                        "color": "#666666",
                        "marginTop": 0,
                        "marginLeft": 10,
                        "marginRight": 10,
                        "markerSize": 12,
                        "markerType": "circle",
                        "spacing": 25,
                        "verticalGap": 5,
                        "valueText": "",
                        "valueWidth": 0,
                        // "switchable": false
                    },
                    "titles": []
                },
                chartOpts: null
			};
		},
        props: {
            id: { type: String },
            opts: { type: Object },
            chartData: { type: Object },
            legend: { type: String },
            chartClick: { type: Function },
            digitNumber: { type: Number, default: 0 },
        },
		computed: {
            
        },
        mounted: function (){
            if( this.chartData.data ) {
                this.set_opts();
                this.build_chart();
            }
        },
        watch: {
            opts: {
                deep: true,
                handler: function( $val ) {
                    this.set_opts();
                }
            },
            chartData: {
                deep: true,
                handler: function( $val ) {
                    this.set_opts();
                    this.build_chart();
                }
            }
        },
		methods: {
            set_opts: function(){
                var _this = this;
                this.chartOpts = JSON.parse( JSON.stringify( this.defaultChartOpts ) );
                if( this.opts ) {
                    Object.keys( this.opts ).forEach( function( $key, $idx ){
                        if( _this.opts[ $key ].constructor == Object ) {
                            _this.chartOpts[ $key ] = Object.assign( _this.chartOpts[ $key ], _this.opts[ $key ] );
                        } else if( _this.opts[ $key ].constructor == Array ) {
                            _this.opts[ $key ].filter( function( $item, $idx2 ){
                                if( $item.constructor == Object ) {
                                    _this.chartOpts[ $key ][ $idx2 ] = Object.assign( _this.chartOpts[ $key ][ $idx2 ], $item );
                                } else {
                                    _this.chartOpts[ $key ][ $idx2 ] = $item;
                                }
                            });
                        } else {
                            _this.chartOpts[ $key ] = _this.opts[ $key ];
                        }
                    });
                }

                if( this.chartData.label ) {
                    this.chartOpts.allLabels = [];
                    var labelLen = Object.keys( this.chartData.label ).length;
                    Object.keys( this.chartData.label ).forEach( function( $key, $idx ){
                        var label = {
                            "align": "center",
                            "bold": $idx == 0 ? true : false,
                            "id": "Label-title",
                            "size": $idx == 0 ? 20 : 12,
                            "text": $idx == 0 ? _this.chartData.label[ $key ] : _this.$options.filters.lengthLimitComma( _this.chartData.label[ $key ], 1 ),
                            "color": $idx == 0 ? "#333333" : "#666666",
                            "y": labelLen == 1 ? "47%" : ( $idx == 0 ? "43%" : "54%" )
                        }
                        _this.chartOpts.allLabels.push( label );
                    });
                }

                // Balloon
                this.chartOpts.balloonFunction = function( $val, $e ){
                    return '<div class="v3_chart_tooltip' + ( jsgradient.getReversal( $val.color ) ? '' : ' is-black' ) + '"><strong class="title">' + $val.title + '</strong><span class="dv">' + _this.$options.filters.lengthLimitComma( $val.value, 1 ) + '</span><span class="per">(' + ( _this.$options.filters.lengthLimitComma( $val.percents, 1 ) ) + '%)</span></div>'
                }

                // Legend Events
                if( this.legend ) {
                    this.chartOpts.legend.listeners = [
                        {
                            "event": "rollOverItem",
                            "method": function( $e ) {
                                var selIdx = $e.dataItem.index;
                                $( $e.chart.chartData ).filter( function( $idx ){
                                    if( $idx != selIdx ) {
                                        if( this.wedge ) TweenMax.to( this.wedge.node, 0, { autoAlpha: .1 } );
                                    }
                                });
                                TweenMax.to( $e.event.target, 0, { "fill-opacity": .4 } );
                            }
                        },
                        {
                            "event": "rollOutItem",
                            "method": function( $e ) {
                                var selIdx = $e.dataItem.index;
                                $( $e.chart.chartData ).filter( function( $idx ){
                                    if( $idx != selIdx ) {
                                        if( this.wedge ) TweenMax.to( this.wedge.node, 0, { autoAlpha: 1 } );
                                    }
                                });
                                TweenMax.to( $e.event.target, 0, { "fill-opacity": .15 } );
                            }
                        },
                        {
                            "event": "hideItem",
                            "method": function( $e ) {
                                _this.evt_chartInit( $e );
                            }
                        },
                        {
                            "event": "showItem",
                            "method": function( $e ) {
                                _this.evt_chartInit( $e );
                            }
                        }
                    ];
                } else {
                    this.chartOpts.legend.enabled = false;
                }

                // init
                this.chartOpts.listeners = [
                    {
                        "event": "rendered",
                        "method": function( $e ) {
                            _this.evt_chartInit( $e );
                        }
                    }
                ]
            },
            build_chart: function(){
                if( this.chart ) {
                    this.chart.clear();
                    this.chart = null;
                }

                var _this = this;
                this.chartOpts.dataProvider = this.chartData.data;
                this.chart = AmCharts.makeChart( this.$refs.chart, this.chartOpts );

                // Events
                if( this.chartClick ) {
                    this.chart.addListener( "clickSlice", this.evt_chartClick )
                }
            },
            evt_chartInit: function( $e ){
                var _this = this;
                $( $e.chart.legendDiv ).find( ".amcharts-legend-switch" ).filter( function( $idx ) {
                    $( this ).parent().addClass( ".amcharts-legend-item-AmGraph-" + $idx );

                    var rect = $( this ).parent().find( "rect" );
                    rect.attr( "x", -5 );
                    rect.attr( "y", -2 );
                    rect.attr( "width", parseInt( rect.attr( "width" ) ) + 30 );
                    rect.attr( "height", 22 );
                    rect.attr( "fill", _this.chartOpts.colors[ $idx ] );
                    rect.attr( "fill-opacity", 0.15 );
                    rect.attr( "rx", 11 );
                    rect.attr( "ry", 11 );
                    $( this ).parent().prepend( rect );

                    var circle = $( this ).parent().find( "circle" );
                    circle.attr( "fill", _this.chartOpts.colors[ $idx ] );
                    circle.attr( "stroke", _this.chartOpts.colors[ $idx ] );
                });
            },
            evt_chartClick: function( $e ){
                this.chartClick( $e );
            }
        },
        destroyed: function(){
            if( !this.chart ) return false;
            this.chart.clear();
            this.chart = null;
        }
    })
}());
