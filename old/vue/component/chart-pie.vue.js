(function(){
    // HTML Template
    var template = '<div ref="chart" :id="id" class="ui_chart_wrap" :class="{ \'ui_nodata\': !chartData || chartData.data.length == 0 }"></div>'

    // Component
    comp = Vue.component( "comp-chart-pie", {
        template: template,
        data: function(){
			return {
                chart: null,
                colorSet: null,
                circleActiveRadius: this.chartData && this.chartData.label ? 2.2 : 1.6,
                activeCirclePer: parseInt( this.$vnode.data.staticStyle.height ) * 0.8 / 280,
                activeCircleFontSize: parseInt( 24 * parseInt( this.$vnode.data.staticStyle.height ) * 0.8 / 280 ),
			};
		},
        props: {
            id: { type: String },
            chartData: { type: Object },
            legend: { type: String },
            chartClick: { type: Function },
            digitNumber: { type: Number, default: 0 },
        },
		computed: {
            getChartData: function(){
                var _this = this;
                var tmp = JSON.parse( JSON.stringify( this.chartData.data ) );
                if( tmp.length > 0 ) {
                    var max = tmp.reduce(function(a, b) {
                        return Math.max(a, b.value);
                    }, tmp[ 0 ].value );
                    tmp.filter( function( $item ){
                        $item.rv = $item.value == max ? _this.circleActiveRadius : 1;
                        $item.code = $item.code ? $item.code :  _this.$options.filters.nameToOptsData( $item.category ).code;
                    })
                }
                return tmp;
            },
            getDigitNumber: function(){
                var result = "#,###";
                for( var Loop1 = 0 ; Loop1 < this.digitNumber ; ++Loop1 ) {
                    if( Loop1 == 0 ) result += "."
                    result += "#";
                    if( Loop1 == this.digitNumber - 1 ) result += "a";
                }
                return result;
            }
        },
        mounted: function (){
            if( this.chartData && this.chartData.data.length > 0 ) this.build_chart();
        },
        watch: {
            "chartData.data": function( $val ){
                if( !this.chartData || this.chartData.data.length == 0 ) return false;

                if( this.chart ) this.build_colorSet();
                if( this.chart ) this.chart.data = this.getChartData;
                else this.build_chart();
            }
        },
		methods: {
            build_colorSet: function(){
                var _this = this;

                if( !_this.colorSet ) _this.colorSet = new am4core.ColorSet();
                else _this.colorSet.reset();
                this.colorSet.list = [];
    
                this.chartData.data.filter( function( $item ){
                    if( $item.fill ) _this.colorSet.list.push( am4core.color( $item.fill ) )
                    else _this.colorSet.list.push( am4core.color( _this.$options.filters.nameToOptsData( $item.category ).fill ) )
                });
            },
            build_chart: function(){
                var _this = this;
    
                this.build_colorSet();
                
                this.chart = am4core.create( this.$refs.chart, am4charts.PieChart);
                this.chart.innerRadius = am4core.percent(35);
                this.chart.responsive.enabled = true;
                this.chart.responsive.useDefault = false;
                this.chart.padding(20,10,20,10);
                this.chart.data = this.getChartData;
                this.chart.numberFormatter.numberFormat = this.getDigitNumber;
    
                var pieSeries = this.chart.series.push( new am4charts.PieSeries() );
                // if( this.chartData && this.chartData.chart && this.chartData.chart.name ) pieSeries.name = this.chartData.chart.name;
                // if( this.chartData && this.chartData.chart && this.chartData.chart.code ) pieSeries.code = this.chartData.chart.code;
                pieSeries.colors = this.colorSet;
                pieSeries.showOnInit = false;
                pieSeries.radius = am4core.percent(100);
                pieSeries.alignLabels = false;
                pieSeries.dataFields.value = "value";
                pieSeries.dataFields.category = "category";
                pieSeries.dataFields.radiusValue = "rv";
                pieSeries.slices.template.strokeWidth = 0;

                // Label
                pieSeries.labels.template.padding( 2,0,2,0 );
                pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
                pieSeries.labels.template.fontSize = 12;
                pieSeries.labels.template.adapter.add( "fontWeight", function( $color, $target ){
                    if( $target.dataItem && $target.dataItem.dataContext && $target.dataItem.dataContext.rv != 1 ) return "bold";
                    return "normal";
                });
                pieSeries.labels.template.adapter.add( "radius", function( $color, $target ){
                    if( $target.dataItem && $target.dataItem.dataContext && $target.dataItem.dataContext.rv != 1 ) {
                        $target.scale = 1.5 * pieSeries.maxHeight / 300;
                        return -1;
                    }
                    return 10 * _this.activeCirclePer;
                });
                pieSeries.labels.template.interactionsEnabled = false;
                pieSeries.labels.template.adapter.add( "fill", function( $color, $target ){
                    if( $target.dataItem && $target.dataItem.dataContext && $target.dataItem.dataContext.rv != 1 ) {
                        return $target.dataItem.dataContext.fill ? $target.dataItem.dataContext.fill : _this.$options.filters.nameToOptsData( $target.dataItem.dataContext.category ).fill;
                    }
                    return am4core.color( "#999999" );
                });
                pieSeries.labels.template.textAlign = "middle";
                pieSeries.labels.template.background.minWidth = 50;
                pieSeries.labels.template.background.minHeight = 50;
                pieSeries.labels.template.background.dx = -8;
                pieSeries.labels.template.background.dy = -16;
                pieSeries.labels.template.background.strokeWidth = 2;
                pieSeries.labels.template.background.adapter.add( "stroke", function( $color, $target ){
                    if( $target.dataItem && $target.dataItem.dataContext ) {
                        return $target.dataItem.dataContext.fill ? $target.dataItem.dataContext.fill : _this.$options.filters.nameToOptsData( $target.dataItem.dataContext.category ).fill;
                    }
                    return am4core.color( "#ff0000" );
                });
                pieSeries.labels.template.background.adapter.add( "fill", function( $val, $target ){
                    $( $target.dom ).find( "rect" ).attr( "rx", "50%" );
                    if( $target.dataItem && $target.dataItem.dataContext ) {
                        if( $target.dataItem.dataContext.rv == 1 ) {
                            $( $target.dom ).hide();
                        }
                    }
                    return $val;
                });

                pieSeries.ticks.template.adapter.add( "hidden", function( $val, $target ) {
                    return ( $target.dataItem.values.value.percent < 5 ) || ( $target.dataItem && $target.dataItem.dataContext && $target.dataItem.dataContext.rv != 1 ) ? true : false;
                });
                pieSeries.labels.template.adapter.add( "hidden", function( $val, $target ) {
                    return $target.dataItem.values.value.percent < 5 ? true : false;
                });
    
                // 가장 큰 값 슬라이스 설정
                pieSeries.slices.template.adapter.add( "stroke", function( $fill, $target ) {
                    if( $target.dataItem && $target.dataItem.dataContext && $target.dataItem.dataContext.rv != 1 ) {
                        var tmp = $target.filters.push( new am4core.DropShadowFilter() );
                        tmp.dx = 0;
                        tmp.dy = 3;
                        tmp.blur = 4;
                        tmp.color = am4core.color( "rgba( 0, 0, 0, 0.4 )" );
                        $target.zIndex = 9;
                    }
                    return $fill;
                });
    
                // Gradient 설정
                var fillModifier = new am4core.LinearGradientModifier();
                fillModifier.brightnesses = [0, 0.8];
                fillModifier.offsets = [0, 1];
                fillModifier.gradient.rotation = 90;
                pieSeries.slices.template.fillModifier = fillModifier;
    
                // Tooltip
                pieSeries.tooltip.background.cornerRadius = 5;
                pieSeries.tooltip.background.stroke = am4core.color( "#ffffff" );
                pieSeries.tooltip.background.strokeOpacity = 1;
                pieSeries.tooltip.background.strokeWidth = 2;
                pieSeries.tooltip.autoTextColor = false;
                pieSeries.tooltip.label.padding( 5,5,5,5 );
                pieSeries.tooltip.label.fill = am4core.color( "#000000" ).alternative;
                pieSeries.slices.template.tooltipText = "[bold]{category}[/] : {value} ({value.percent.formatNumber('#.0')}%)";
                pieSeries.slices.template.adapter.add( "tooltipHTML", function( $value, $target ) {
                    var tooltipResult = "";
                    tooltipResult += "<div class=\"chart_tooltip\">";
                    tooltipResult += "<strong class=\"per\">{value.percent.formatNumber('#.0')}%</strong>";
                    tooltipResult += "<div class=\"other\">";
                    tooltipResult += "<strong class=\"title\">{category}</strong>";
                    tooltipResult += "<span class=\"dv\">{value}</span>";
                    tooltipResult += "</div>";
                    tooltipResult += "</div>";
                    return tooltipResult;
                });
                var bgLighten = pieSeries.tooltip.background.filters.push( new am4core.LightenFilter());
                bgLighten.lightness = -0.1;
                var tooltipShadow = pieSeries.tooltip.background.filters.getIndex(0);
                tooltipShadow.dx = 0;
                tooltipShadow.dy = 3;
                tooltipShadow.blur = 4;
                tooltipShadow.color = am4core.color( "rgba( 0, 0, 0, 0.4 )" );
    
                // Legend
                if( this.legend ) {
                    var legend = new am4charts.Legend();
                    this.chart.legend = legend;
                    legend.useDefaultMarker = true;
                    legend.valueLabels.template.disabled = true;
                    legend.position = this.legend;
                    legend.fixedWidthGrid = false;
                    legend.padding( 0,0,0,0 );
                    legend.margin( 0,0,0,0 );
                    legend.itemContainers.template.padding( 0,0,4,0 );
                    legend.itemContainers.template.background.measuredHeight = 22;
                    legend.itemContainers.template.background.maxHeight = 22;
                    legend.itemContainers.template.background.adapter.add( "fill", function( $value, $target ) {
                        if( $target.dataItem && $target.dataItem.dataContext ) {
                            $( $target.dom ).find( "rect").attr( "rx", 12 );
                            $( $target.dom ).find( "rect").attr( "height", 22 );
                            return $target.dataItem.dataContext.dataContext.fill ? $target.dataItem.dataContext.dataContext.fill : _this.$options.filters.nameToOptsData( $target.dataItem.dataContext.dataContext.category ).fill;
                        }
                        return am4core.color( "#ffffff" );
                    });
                    legend.itemContainers.template.background.fillOpacity = 0.15;
    
                    var hs_legend = legend.itemContainers.template.background.states.create( "hover" );
                    hs_legend.properties.fillOpacity = 0.4;
    
                    var legendMarker = legend.markers.template.children.getIndex(0)
                    legendMarker.cornerRadius(6,6,6,6);
                    legendMarker.dx = 6;
                    legendMarker.dy = 5;
                    legendMarker.width = 12;
                    legendMarker.height = 12;
                    legend.labels.template.truncate = true;
                    legend.labels.template.fullWords = false;
                    legend.labels.template.dx = -5;
                    legend.labels.template.dy = 1;
                    legend.labels.template.padding(0,0,0,0);
                    legend.labels.template.fill = am4core.color( "#666666" );
    
                    var disableCircle = legend.itemContainers.template.createChild( am4core.Circle );
                    disableCircle.isMeasured = false;
                    disableCircle.x = 12;
                    disableCircle.y = 11;
                    disableCircle.radius = 6;
                    disableCircle.fill = am4core.color( "#FFFFFF" );
                    disableCircle.opacity = 0;
                    var disableLabel = legend.itemContainers.template.createChild( am4core.Label );
                    disableLabel.isMeasured = false;
                    disableLabel.x = 8.5;
                    disableLabel.y = 2;
                    disableLabel.fill = am4core.color( "#C6C6C6" );
                    disableLabel.text = "x";
                    disableLabel.fontWeight = "bold";
                    disableLabel.opacity = 0;
                    
                    if( this.legend == "left" || this.legend == "right" ) {
                        legend.contentAlign = this.legend;
                        legend.width = undefined;
                        legend.itemContainers.template.width = undefined;
                    }
                }
    
                // Center Label
                if( this.chartData.label ) {
                    var _this = this;
                    var clabel_title = null;
                    var clabel_value = null;
                    pieSeries.events.on( "ready", function(){
                        _this.chart.innerRadius = am4core.percent(50);
                        if( _this.chartData.label.title && !_this.chartData.label.value ) {
                            if( !clabel_title ) clabel_title = _this.chart.seriesContainer.createChild( am4core.Label );
                            clabel_title.wrap = true;
                            clabel_title.dy = 5;
                            clabel_title.maxWidth = parseInt( _this.chart.seriesContainer.measuredHeight * 0.55 );
                            clabel_title.text = _this.chartData.label.title;
                            clabel_title.horizontalCenter = "middle";
                            clabel_title.verticalCenter = "middle";
                            clabel_title.fill = am4core.color( "#333333" );
                            clabel_title.fontSize = parseInt( _this.chart.seriesContainer.measuredHeight * 0.1 );
                            clabel_title.fontWeight = "bold";
                        } else if( !_this.chartData.label.title && _this.chartData.label.value ) {
                            if( !clabel_value ) clabel_value = _this.chart.seriesContainer.createChild( am4core.Label );
                            clabel_value.dy = 5;
                            clabel_value.text = _this.$options.filters.lengthLimitComma( _this.chartData.label.value, 1 );
                            clabel_value.horizontalCenter = "middle";
                            clabel_value.verticalCenter = "middle";
                            clabel_value.fill = am4core.color( "#333333" );
                            clabel_value.fontSize = parseInt( _this.chart.seriesContainer.measuredHeight * 0.14 );
                            clabel_value.fontWeight = "bold";
                            //clabel_value
                        } else {
                            if( !clabel_value ) clabel_value = _this.chart.seriesContainer.createChild( am4core.Label );
                            clabel_value.text = _this.$options.filters.lengthLimitComma( _this.chartData.label.value, 1 );
                            clabel_value.horizontalCenter = "middle";
                            clabel_value.verticalCenter = "middle";
                            clabel_value.fill = am4core.color( "#333333" );
                            clabel_value.fontSize = parseInt( _this.chart.seriesContainer.measuredHeight * 0.14 );
                            clabel_value.fontWeight = "bold";
    
                            var clabel_line = _this.chart.seriesContainer.createChild( am4core.Rectangle );
                            clabel_line.width = 23;
                            clabel_line.height = 2;
                            clabel_line.horizontalCenter = "middle";
                            clabel_line.verticalCenter = "middle";
                            clabel_line.dy = parseInt( _this.chart.seriesContainer.measuredHeight * 0.1 );
                            clabel_line.fill = am4core.color( "#E6E6E6" );
    
                            if( !clabel_title ) clabel_title = _this.chart.seriesContainer.createChild( am4core.Label );
                            clabel_title.maxWidth = 80;
                            clabel_title.dy = parseInt( _this.chart.seriesContainer.measuredHeight * 0.16 );
                            clabel_title.text = _this.chartData.label.title;
                            clabel_title.horizontalCenter = "middle";
                            clabel_title.verticalCenter = "middle";
                            clabel_value.fill = am4core.color( "#666666" );
                            clabel_title.fontSize = 12;
                        }
                    });

                    this.chart.events.on( "datavalidated", function( $e ){
                        if( clabel_title ) clabel_title.text = _this.chartData.label.title;
                        if( clabel_value ) clabel_value.text = _this.$options.filters.lengthLimitComma( _this.chartData.label.value, 1 );
                    });
                }
    
                // State - Hover
                var ds_slice_filter = pieSeries.slices.template.filters.push( new am4core.LightenFilter() );
                ds_slice_filter.lightness = 0;
                var pie_hs = pieSeries.slices.template.states.getKey( "hover" );
                pie_hs.properties.scale = 1.05;
                if( _this.chartClick ) {
                    var hs_slice_filter = pie_hs.filters.push( new am4core.LightenFilter() );
                    hs_slice_filter.lightness = -0.3;
                }
    
                // State - Active
                var pie_as = pieSeries.slices.template.states.getKey( "active" );
                pie_as.properties.shiftRadius = 0;
    
                // Event - Click
                if( _this.chartClick ) {
                    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
                    pieSeries.slices.template.events.on( "hit", function( $e ){
                        var params = JSON.parse( JSON.stringify( $e.target.dataItem.dataContext ) );
                        if( _this.chartData && _this.chartData.chart && _this.chartData.chart.name ) params.chartName = _this.chartData.chart.name;
                        if( _this.chartData && _this.chartData.chart && _this.chartData.chart.code ) params.chartCode = _this.chartData.chart.code;
                        _this.chartClick( params );
                    });
                }
    
                pieSeries.events.on( "sizechanged", function( $e ) {
                    $e.target.labels.values.filter( function( $item ){
                        if( $item.dataItem.dataContext.rv != 1 ) {
                            $item.scale = $e.target.measuredHeight / 300;
                        }
                    })
                });
            },
        },
        destroyed: function(){
            if( !this.chart ) return false;
            this.chart.disposeChildren();
            this.chart.dispose();
        }
    })
}());
