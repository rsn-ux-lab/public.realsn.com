(function(){
    // HTML Template
    var template = '<div ref="chart" :id="id" class="ui_chart_wrap" :class="[ { \'ui_nodata\': !chartData || chartData.data.length == 0 }, { \'is-click\': chartClick } ]"></div>'

    // Component
    comp = Vue.component( "comp-chart-v3-line", {
        template: template,
        data: function(){
			return {
                chart: null,
                defaultChartOpts: {
                    "type": "serial",
                    "categoryField": "category",
                    "columnWidth": 0.7,
                    "columnSpacing": 2,
                    "autoMarginOffset": 15,
                    "marginBottom": 10,
                    "marginLeft": 10,
                    "marginRight": 10,
                    "marginTop": 10,
                    "rotate": this.rotate,
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
                    "addClassNames": true,
                    "color": "#666666",
                    "fontSize": 12,
                    "percentPrecision": 1,
                    "usePrefixes": true,
                    "categoryAxis": {
                        "gridPosition": "middle",
                        "gridThickness": 0,
                        "autoWrap": true,
                        "axisThickness": 1,
                        "axisColor": "#f2f2f2",
                    },
                    "chartCursor": {
                        "enabled": true,
                        "cursorAlpha": 0.1,
                        "cursorColor": "#888888",
                        "fullWidth": true,
                        "graphBulletSize": 1,
                        "animationDuration": 0
                    },
                    "chartScrollbar": {
                        "enabled": false,
                        "dragIcon": "dragIconRoundSmall",
                        "offset": 20,
                        "dragIconHeight": 20,
                        "dragIconWidth": 20,
                        "scrollbarHeight": 6
                    },
                    "trendLines": [],
                    "graphs": [],
                    "guides": [],
                    "valueAxes": [
                        {
                            "id": "ValueAxis-1",
                            "labelsEnabled": this.graphType == "100%" ? false : true,
                            "minimum": "",
                            "usePrefixes": true,
                            "zeroGridAlpha": 0,
                            "axisThickness": 0,
                            "color": "#CCCCCC",
                            "gridAlpha": 0.05,
                            "tickLength": 0,
                            "title": "",
                        }
                    ],
                    "allLabels": [],
                    "balloon": {
                        "adjustBorderColor": false,
                        "fixedPosition": false,
                        "animationDuration": 0,
                        "fadeOutDuration": 0,
                        "fillAlpha": 1,
                        "horizontalPadding": 5,
                        "shadowAlpha": 0.1,
                        "verticalPadding": 3
                    },
                    "legend": {
                        "enabled": true,
                        "equalWidths": false,
                        "align": "center",
                        "autoMargins": false,
                        "color": "#666666",
                        "marginTop": 10,
                        "marginLeft": 0,
                        "marginRight": 0,
                        "markerSize": 12,
                        "markerType": "circle",
                        "valueText": "",
                        "valueWidth": 0,
                        "spacing": 20,
                        "verticalGap": 5
                    },
                    "titles": []
                },
                chartOpts: null,
                minValue: 0,
                maxValue: 0,
                totalValue: 0,
                totalValue_newAxis: 0,
			};
		},
        props: {
            id: { type: String },
            opts: { type: Object },
            graphType: { type: String },
            rotate: { type: Boolean, default: false },
            chartData: { type: Object },
            legend: { type: String },
            chartClick: { type: Function },
            digitNumber: { type: Number, default: 0 },
            totalLabel: { type: Boolean, default: true },
            balloonPercentage: { type: Boolean, default: true },
            chartScroll: {type: Boolean, default: false }
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

                    if( this.opts.colors && !this.chartData.graphs ) {
                        this.chartData.data.filter( function( $item, $idx ){
                            $item.fill = _this.opts.colors[ $idx ];
                        })
                    }
                }

                if( this.chartOpts.valueAxes[ 0 ].minimum == null ) {
                    delete this.chartOpts.valueAxes[ 0 ].minimum;
                }

                // Has Graphs Colors
                if( this.chartData.graphs && this.chartData.graphs.length > 0 ) {
                    var tmp = [];
                    this.chartData.graphs.filter( function( $item ){
                        if( $item.fill ) tmp.push( $item.fill );
                    })
                    if( tmp.length > 0 ) this.chartOpts.colors = JSON.parse( JSON.stringify( tmp ) );
                }

                // Total value & Max Value
                var exptValues = [];
                if( this.chartData.graphs ) {
                    for( var Loop1 = 0 ; Loop1 < this.chartData.graphs.length ; ++Loop1 ) {
                        if( this.chartData.graphs[ Loop1 ].exptTotal ) exptValues.push( this.chartData.graphs[ Loop1 ].value_field );
                    }
                }
                this.maxValue = 0;
                this.totalValue = 0;
                this.totalValue_newAxis = 0;
                for( var Loop1 = 0 ; Loop1 < this.chartData.data.length ; ++Loop1 ) {
                    var max = 0;
                    Object.keys( this.chartData.data[ Loop1 ] ).forEach( function( $key, $idx ){
                        if( $key.indexOf( "value" ) >= 0 ) {
                            _this.totalValue += parseInt( _this.chartData.data[ Loop1 ][ $key ] );
                            if( _this.graphType != "stack" ) _this.maxValue = _this.maxValue > parseInt( _this.chartData.data[ Loop1 ][ $key ] ) ? _this.maxValue : parseInt( _this.chartData.data[ Loop1 ][ $key ] );
                            max += parseInt( _this.chartData.data[ Loop1 ][ $key ] );
                        }
                    });
                    if( _this.graphType == "stack" ) {
                        _this.maxValue = _this.maxValue > max ? _this.maxValue : max;
                    }

                    for( var Loop2 = 0 ; Loop2 < exptValues.length ; ++Loop2 ) {
                        _this.totalValue -= parseInt( _this.chartData.data[ Loop1 ][ exptValues[ Loop2 ] ] );
                        _this.totalValue_newAxis += parseInt( _this.chartData.data[ Loop1 ][ exptValues[ Loop2 ] ] );
                    }
                }
                if( _this.graphType != "100%" && _this.totalLabel ) {
                    // this.chartOpts.valueAxes[ 0 ].maximum = parseInt( this.maxValue ) * 1.3;
                }
                if( !_this.chartOpts.valueAxes[ 0 ].minimum ) {
                    //this.chartOpts.valueAxes[ 0 ].maximum = parseInt( this.maxValue ) * 1.3;
                }

                // New Axe
                if( this.chartData.graphs ) {
                    var newAxeChk = false;
                    var newAxeUnit = "";
                    var min;
                    var max;
                    this.chartData.graphs.filter( function( $item ){
                        if( $item.newAxis && ( $item.newAxis.unit || $item.newAxis.min || $item.newAxis.max ) ) {
                            newAxeChk = true;
                            newAxeUnit = $item.newAxis.unit;
                            min = $item.newAxis.min;
                            max = $item.newAxis.max;
                        }
                    });
                    if( newAxeChk ) {
                        var axis = {
                            "id": "ValueAxis-2",
                            "position": "right",
                            "usePrefixes": true,
                            "zeroGridAlpha": 0,
                            "axisThickness": 0,
                            "color": "#CCCCCC",
                            "gridAlpha": 0,
                            "tickLength": 0,
                            "title": "",
                            "unit": newAxeUnit
                        }
                        if( min ) axis.minimum = min;
                        if( max ) axis.maximum = max;
                        this.chartOpts.valueAxes.push( axis );
                    }
                }
                
                // Total Label
                if( _this.graphType != "100%" && _this.totalLabel ) {
                    this.chartOpts.allLabels = [];
                    var label = {
                        "align": !this.rotate ? "center" : "right",
                        "bold": true,
                        "id": "Label-total",
                        "size": $( this.$el ).outerHeight() * 0.25,
                        "text": "T." + this.$options.filters.lengthLimitComma( this.totalValue, 1 ),
                        "color": "#000000",
                        "alpha": 0.03,
                        "y": !this.rotate ? ( this.chartOpts.chartScrollbar.enabled ? "7%" : "-3%" ) : "5%"
                    }
                    if( this.rotate ) label.x = "97%";
                    _this.chartOpts.allLabels.push( label );
                }

                // Category Axe Date
                if( this.chartData.data.length > 0 ) {
                    if( _this.$options.filters.isDate( this.chartData.data[ 0 ].category ) ) this.chartOpts.categoryAxis.autoWrap = false;
                }
                this.chartOpts.categoryAxis.labelFunction = function( $val )  {
                    if( _this.$options.filters.isDate( $val ) ) {
                        return _this.$options.filters.dateToStr( new Date( $val ), "MM-DD" );
                    }
                    return $val;
                }
                this.chartOpts.chartCursor.categoryBalloonFunction = function( $val )  {
                    if( _this.rotate && _this.$options.filters.isDate( $val ) ) {
                        return $val.replace( "-", "<br>" );
                    }
                    return $val;
                }

                // Legend
                if( this.legend ) this.chartOpts.legend.position = this.legend;
                else this.chartOpts.legend.enabled = false;
                if( this.legend == "top" ) this.chartOpts.legend.marginTop = 0;

                this.chartOpts.legend.listeners = [
                    {
                        "event": "rollOverItem",
                        "method": function( $e ) {
                            var selIdx = $e.dataItem.index;
                            $e.chart.graphs.filter( function( $item, $idx ){
                                if( $idx != selIdx ) {
                                    TweenMax.to( $( _this.$el ).find( ".amcharts-graph-" + $item.id ), 0.3, { autoAlpha: .05 } );
                                }
                            });
                            TweenMax.to( $e.event.target, .24, { "fill-opacity": .4 } );
                        }
                    },
                    {
                        "event": "rollOutItem",
                        "method": function( $e ) {
                            var selIdx = $e.dataItem.index;
                            $e.chart.graphs.filter( function( $item, $idx ){
                                TweenMax.to( $( _this.$el ).find( ".amcharts-graph-" + $item.id ), 0.3, { autoAlpha: 1 } );
                            })
                            TweenMax.to( $e.event.target, .24, { "fill-opacity": .15 } );
                        }
                    },
                    {
                        "event": "showItem",
                        "method": function( $e ) {
                            _this.setMinMax();
                        }
                    },
                    {
                        "event": "hideItem",
                        "method": function( $e ) {
                            _this.setMinMax();
                        }
                    }
                ]
            },
            setMinMax: function(){
                // var _this = this;
                // var max = 0;
                // this.chart.graphs.filter( function( $item ){
                //     if( !$item.hidden ) {
                //         //if( max < $item. )
                //         $item.data.filter( function( $item2 ){
                //             if( $item2.dataContext[ $item.valueField ] && $item2.dataContext[ $item.valueField ] > max ) max = $item2.dataContext[ $item.valueField ];
                //         })
                //     }
                // })
                
                // if( this.chart ) {
                //     this.chart.valueAxes[ 0 ].maximum = max * 1.3;
                //     this.chart.invalidateSize();
                // }
            },
            build_chart: function(){
                var _this = this;

                if( this.chart ) {
                    this.chart.clear();
                    this.chart = null;
                }

                this.buildGraphs();
                this.chart = AmCharts.makeChart( this.$refs.chart, this.chartOpts );
                this.chart.dataProvider = this.chartData.data;
                this.chart.invalidateSize();
                this.chart.validateData();
                
                // Events
                this.chart.addListener( "drawn", this.evt_chartInit );
                if( this.chartClick ) {
                    this.chart.addListener( "clickGraphItem", this.evt_chartClick );
                }
            },
            buildGraphs: function(){
                var _this = this;
                var graphs = [];
                if( this.chartData.graphs ) {
                    this.chartData.graphs.filter( function( $item, $idx ){
                        var graph = {
                            "graphCode": $item.graphCode,
                            "balloonFunction": function( $val, $e ){
                                if( $e.axisUnit == "%" ) return '<div class="v3_chart_tooltip' + ( jsgradient.getReversal( $val.lineColor || $e.lineColorR ) ? '' : ' is-black' ) + '"><strong class="title">' + $val.graph.title + '</strong><span class="dv">' + ( $val.values.value / _this.totalValue_newAxis * 100 ).toFixed( 1 ) + '%</span></div>';
                                return '<div class="v3_chart_tooltip2' + ( jsgradient.getReversal( $val.lineColor || $e.lineColorR ) ? '' : ' is-black' ) + '"><strong class="title">' + $val.graph.title + '</strong><span class="dv">' + _this.$options.filters.lengthLimitComma( $val.values.value, 1 ) + '</span>' + ( _this.balloonPercentage ? ( '<span class="per">(' + ( $val.values.percents || 0 ).toFixed( 1 ) + '%)</span>' ) : '' ) + '</div>';
                            },
                            "id": "AmGraph-" + $idx,
                            "title": $item.name,
                            "fontSize": 12,
                            "valueAxis": $item.newAxis ? "ValueAxis-2" : "ValueAxis-1",
                            "valueField": $item.value_field,
                            "showHandOnHover": _this.chartClick ? true : false,
                            "bullet": "round",
                            "bulletBorderAlpha": 1,
                            "bulletBorderColor": "#FFFFFF",
                            "bulletBorderThickness": 3,
                            "bulletSize": 12,
                            "lineThickness": 3
                        }
                        if( $item.newAxis && $item.newAxis.unit == "%" ) graph.axisUnit = "%";
                        if( $item.fill ) {
                            graph.lineColor = $item.fill;
                        }
                        if( $item.opts ) Object.assign( graph, $item.opts );
                        graphs.push( graph );
                    });
                } else {
                    var graph = {
                        "balloonFunction": function( $val, $e ){
                            return '<div class="v3_chart_tooltip2' + ( jsgradient.getReversal( $val.fillColors || $e.fillColorsR ) ? '' : ' is-black' ) + '"><strong class="title">' + $val.graph.title + '</strong><span class="dv">' + _this.$options.filters.lengthLimitComma( $val.values.value, 1 ) + '</span>' + (  _this.balloonPercentage ? ( '<span class="per">(' +( $val.values.value / _this.totalValue * 100 ).toFixed( 1 ) + '%)</span>' ) : '' ) + '</div>'
                        },
                        "id": "AmGraph-0",
                        "labelText": "[[value]]",
                        "title": "?????????",
                        "fontSize": 14,
                        "valueField": "value",
                        "showHandOnHover": _this.chartClick ? true : false,
                        "bullet": "round",
                        "bulletBorderAlpha": 1,
                        "bulletBorderColor": "#FFFFFF",
                        "bulletBorderThickness": 3,
                        "bulletSize": 12,
                        "lineThickness": 3,
                        "showAllValueLabels": true,
                    }
                    graphs.push( graph );
                }
                this.chartOpts.graphs = graphs;
            },
            evt_chartInit: function( $e ){
                var _this = this;
                $e.chart.graphs.filter( function( $item, $idx ){
                    // Legend Reset
                    var rect = $( $e.chart.legendDiv ).find( ".amcharts-legend-item-AmGraph-" + $idx + " rect" );
                    rect.attr( "x", -5 );
                    rect.attr( "y", -2 );
                    rect.attr( "width", parseInt( rect.attr( "width" ) ) + 30 );
                    rect.attr( "height", 22 );
                    rect.attr( "fill", _this.chartOpts.colors[ $idx ] );
                    rect.attr( "fill-opacity", 0.15 );
                    rect.attr( "rx", 11 );
                    rect.attr( "ry", 11 );
                    $( $e.chart.legendDiv ).find( ".amcharts-legend-item-AmGraph-" + $idx ).prepend( rect );

                    var circle = $( $e.chart.legendDiv ).find( ".amcharts-legend-item-AmGraph-" + $idx ).find( "circle" );
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
