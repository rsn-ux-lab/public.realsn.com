(function(){
    // HTML Template
    var template = '<div ref="chart" :id="id" class="ui_chart_wrap" :class="{ \'ui_nodata\': !chartData || ( chartData.graphs && chartData.graphs.length == 0 ) || chartData.data.length == 0 }"></div>'

    // Component
    comp = Vue.component( "comp-chart-column", {
        template: template,
        data: function(){
			return {
                chart: null,
                colorSet: null,
                xAxis: null,
                yAxis: null,
                yAxis2: null,
                totalLabel: null,
                lineValueField: null,
			};
		},
        props: {
            id: { type: String },
            chartData: { type: Object },
            legend: { type: String },
            graphType: { type: String, default: "one" },
            chartClick: { type: Function },
            rot: { type: Boolean, defualt: false },
            digitNumber: { type: Number, default: 0 },
        },
		computed: {
            getXaxisTypeDate: function(){
                return this.$options.filters.isDate( this.chartData.data[ 0 ].category );
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
            if( this.chartData.data.length > 0 ) this.build_chart();
        },
        watch: {
            "chartData.data": function( $val ){
                if( !this.chartData || ( this.chartData.graphs && this.chartData.graphs.length == 0 ) || this.chartData.data.length == 0 ) return false;

                if( this.chart ) this.build_colorSet();
                if( this.chart ) this.build_graphs();

                if( this.chart ) this.chart.data = $val;
                else this.build_chart();
            }
        },
        methods: {
            build_colorSet: function(){
                var _this = this;

                if( !_this.colorSet ) _this.colorSet = new am4core.ColorSet();
                else _this.colorSet.reset();
                _this.colorSet.list = [];
                
                if( this.chartData.graphs ) {
                    this.chartData.graphs.filter( function( $item ){
                        if( $item.fill ) {
                            _this.colorSet.list.push( am4core.color( $item.fill ) );
                        } else {
                            if( _this.$options.filters.nameToOptsData( $item.name ) ) _this.colorSet.list.push( am4core.color( _this.$options.filters.nameToOptsData( $item.name ).fill ) )
                        }
                    });
                } else {
                    this.chartData.data.filter( function( $item ){
                        if( _this.$options.filters.nameToOptsData( $item.category ) ) _this.colorSet.list.push( am4core.color( _this.$options.filters.nameToOptsData( $item.category ).fill ) )
                    });
                }
            },
            build_chart: function(){
                var _this = this;

                // ColorSet
                this.build_colorSet();

                this.chart = am4core.create( this.$refs.chart, am4charts.XYChart );
                this.chart.responsive.enabled = true;
                this.chart.responsive.useDefault = false;
                this.chart.colors = this.colorSet;
                if( !this.rot ) {
                    this.chart.paddingTop = 10;
                    this.chart.paddingBottom = 0;
                    this.chart.paddingLeft = 0;
                } else {
                    this.chart.paddingTop = 10;
                    this.chart.paddingBottom = 0;
                    this.chart.paddingLeft = 0;
                }
                this.chart.data = this.chartData.data;

                // Total Label
                this.build_totalLabel();

                // xAxis
                this.build_xAxis();

                // yAxis
                this.build_yAxis();

                // Cursor
                this.build_chartCursor();

                // Legend
                this.build_legend();

                // Z-Index Setting
                if( this.chart.cursor ) this.chart.cursor.zIndex = -1
                this.chart.seriesContainer.zIndex = 1;
                this.chart.bulletsContainer.zIndex = 10;

                // Add Series
                this.build_graphs();

                // $( this.$refs.chart ).find( "svg" ).hide();
            },
            build_xAxis: function(){
                var _this = this;

                if( this.getXaxisTypeDate ) {
                    if( !this.rot ) {
                        this.xAxis = this.chart.xAxes.push( new am4charts.DateAxis() );
                    } else {
                        this.xAxis = this.chart.yAxes.push( new am4charts.DateAxis() );
                        this.xAxis.renderer.inversed = true;
                    }
                    this.xAxis.dateFormats.setKey("day", "MM-dd");
                    this.xAxis.periodChangeDateFormats.setKey("day", "yyyy-MM-dd");
                    this.xAxis.tooltipDateFormat = "yyyy-MM-dd";
                } else {
                    if( !this.rot ) {
                        this.xAxis = this.chart.xAxes.push( new am4charts.CategoryAxis() );
                    } else {
                        this.xAxis = this.chart.yAxes.push( new am4charts.CategoryAxis() );
                        this.xAxis.renderer.inversed = true;
                    }
                    this.xAxis.dataFields.category = "category";
                }

                this.xAxis.renderer.grid.template.location = 0;
                this.xAxis.renderer.grid.template.disabled = true;
                this.xAxis.renderer.minGridDistance = 10;
                this.xAxis.renderer.labels.template.maxWidth = parseInt( this.chart.innerWidth * 0.2 );
                this.xAxis.renderer.labels.template.truncate = true;
                this.xAxis.renderer.labels.template.fill = am4core.color( "#666666" );
                this.xAxis.renderer.labels.template.verticalCenter = "middle";
                this.xAxis.renderer.labels.template.rotation = 0;
                if( !this.rot ) {
                    this.xAxis.renderer.labels.template.padding( 10,0,0,0 );
                    this.xAxis.renderer.cellStartLocation = 0.2;
                    this.xAxis.renderer.cellEndLocation = 0.8;

                    this.xAxis.events.on( "sizechanged", function( $e ) {
                        var axis = $e.target;
                        var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
                        axis.renderer.labels.template.maxWidth = _this.rot ? ( cellWidth < 50 ? cellWidth : 50 ) : cellWidth;
                    });
                } else {
                    this.xAxis.renderer.labels.template.padding( 0,10,0,0 );
                    this.xAxis.renderer.cellStartLocation = 0.1;
                    this.xAxis.renderer.cellEndLocation = 0.9;
                }
                if( !this.rot ) this.xAxis.tooltip.dy = -5;
                this.xAxis.tooltip.label.padding( 10,10,10,10 );
                this.xAxis.tooltip.background.strokeWidth = 0;
                this.xAxis.tooltip.background.fill = am4core.color( "#666666" );
                this.xAxis.tooltip.background.cornerRadius = 5;
                this.xAxis.tooltip.zIndex = -1;
            },
            build_yAxis: function(){
                if( !this.rot ) {
                    this.yAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
                } else {
                    this.yAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
                }
                this.yAxis.extraMax = 0.2;
                this.yAxis.calculateTotals = true;
                this.yAxis.numberFormatter.numberFormat = this.getDigitNumber;
                this.yAxis.renderer.minWidth = 50;
                this.yAxis.renderer.baseGrid.disabled = true;
                this.yAxis.renderer.grid.template.stroke = am4core.color( "#E5E5E5" );
                this.yAxis.renderer.grid.template.strokeOpacity = 1;
                this.yAxis.renderer.labels.template.fill = "#CCCCCC";
                this.yAxis.tooltip.background.strokeOpacity = 0;
                this.yAxis.tooltip.background.fillOpacity = 0;
                this.yAxis.tooltip.label.opacity = 0;
                this.yAxis.tooltip.disabled = true;
            },
            build_graphs: function(){
                var _this = this;
                var series = [];

                if( this.chart ) {
                    var cnt = this.chart.series.values.length;
                    for( var Loop1 = 0 ; Loop1 < cnt ; ++Loop1 ){
                        this.chart.series.removeIndex( 0 ).dispose();
                    }
                }

                var series = [];
                if( this.chartData.graphs ) {
                    this.chartData.graphs.filter( function( $item ){
                        var graph = $item.lineType ? _this.addLineSeries( $item ) : _this.addColumnSeries( $item );
                        series.push( graph );
                    });
                } else {
                    var graph = _this.addColumnSeries();
                    series.push( graph );
                }

                this.chart.colors = this.colorSet;
            },
            build_chartCursor: function(){
                var chartCursor = new am4charts.XYCursor();
                if( !this.rot ) {
                    chartCursor.fullWidthLineX = true;
                    chartCursor.xAxis = this.xAxis;
                    chartCursor.lineX.strokeOpacity = 0;
                    chartCursor.lineX.fill = am4core.color("#000");
                    chartCursor.lineX.fillOpacity = 0.05;
                    chartCursor.lineY.disabled = true;
                } else {
                    chartCursor.fullWidthLineY = true;
                    chartCursor.yAxis = this.xAxis;
                    chartCursor.lineY.strokeOpacity = 0;
                    chartCursor.lineY.fill = am4core.color("#000");
                    chartCursor.lineY.fillOpacity = 0.05;
                    chartCursor.lineX.disabled = true;
                }
                this.chart.cursor = chartCursor;
            },
            build_legend: function(){
                if( this.legend ) {
                    var _this = this;
                    var legend = new am4charts.Legend();
                    legend.id = "legend"
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
                        $( $target.dom ).find( "rect" ).addClass( "bg" );
                        if( $target.dataItem ) {
                            $( $target.dom ).find( "rect").attr( "rx", 12 );
                            $( $target.dom ).find( "rect").attr( "height", 22 );
                            return _this.chart.colors.getIndex( $target.dataItem.index );
                        }
                        return am4core.color( "#ffffff" );
                    });
                    legend.itemContainers.template.background.fillOpacity = 0.15;
    
                    var hs_legend = legend.itemContainers.template.background.states.create( "hover" );
                    hs_legend.properties.fillOpacity = 0.4;
    
                    var legendMarker = legend.markers.template.children.getIndex(0);
                    legendMarker.adapter.add( "disabled", function( $val, $target ){
                        $( $target.dom ).find( "path" ).addClass( "marker" );
                        return false;
                    })
                    legendMarker.cornerRadius(6,6,6,6);
                    legendMarker.dx = 6;
                    legendMarker.dy = 5;
                    legendMarker.width = 12;
                    legendMarker.height = 12;
    
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
    
                    legend.labels.template.truncate = true;
                    legend.labels.template.fullWords = false;
                    legend.labels.template.dx = -5;
                    legend.labels.template.dy = 1;
                    legend.labels.template.padding(0,0,0,0);
                    legend.labels.template.fill = am4core.color( "#666666" );
    
                    if( this.legend == "top" ) legend.paddingBottom = 15;
                    if( this.legend == "bottom" ) legend.paddingTop = 15;
                    if( this.legend == "left" ) legend.paddingRight = 30;
                    if( this.legend == "right" ) legend.paddingLeft = 30;
                    
                    if( this.legend == "left" || this.legend == "right" ) {
                        legend.contentAlign = this.legend;
                        legend.width = undefined;
                        legend.itemContainers.template.width = undefined;
                    }
    
                    legend.itemContainers.template.events.on( "over", function( $e ){
                        if( $e.target.dataItem.dataContext.isHiding || $e.target.dataItem.dataContext.isHidden ) return false;
                        _this.chart.series.values.filter( function( $item ){
                            if( $item.isHiding || $item.isHidden ) return false;
                            if( $item == $e.target.dataItem.dataContext ) {
                                if( $item.bullets.values.length > 0 ) $item.bullets.values[ 0 ].setState( "overActive" );
                                $item.setState( "overActive" );
                            } else {
                                if( $item.bullets.values.length > 0 ) $item.bullets.values[ 0 ].setState( "overDisabled" );
                                $item.setState( "overDisabled" );
                            }
                        })
                    });
                    legend.itemContainers.template.events.on( "out", function( $e ){
                        //if( $e.target.dataItem.dataContext.isHiding || $e.target.dataItem.dataContext.isHidden ) return false;
                        _this.chart.series.values.filter( function( $item ){
                            if( $item.isHiding || $item.isHidden ) return false;
                            if( $item.bullets.values.length > 0 ) $item.bullets.values[ 0 ].setState( "default" );
                            $item.setState( "default" );
                        })
                    })
                }
            },
            build_totalLabel: function(){
                var _this = this;
                this.totalLabel = this.chart.seriesContainer.createChild(am4core.Label);
                this.totalLabel.x = !this.rot ? am4core.percent(50) : am4core.percent(100);
                this.totalLabel.y = 0;
                this.totalLabel.horizontalCenter = !this.rot ? "middle" : "right";
                this.totalLabel.verticalCenter = "top";
                this.totalLabel.isMeasured = false;
                this.totalLabel.fontSize = 120;
                this.totalLabel.fontWeight = "bold";
                this.totalLabel.opacity = 0.05;
                this.totalLabel.zIndex = -1;
                this.totalLabel.adapter.add( "fill", function( $val, $target ){
                    return $val;
                });
                this.chart.events.on( "datavalidated", function( $e ){
                    var cnt = 0;
                    _this.chart.series.values.filter( function( $item ){
                        if( $item.className.indexOf( "Line" ) >= 0 ) return;
                        if( !_this.rot ) cnt += $item.dataItem.values.valueY.sum || 0;
                        else cnt += $item.dataItem.values.valueX.sum || 0;
                    });
                    _this.totalLabel.text = "T." + ( _this.digitNumber > 0 ? _this.$options.filters.lengthLimitComma( cnt, _this.digitNumber ) : _this.$options.filters.addComma( cnt ) );
                    //if( _this.chart.legend && _this.chart.legend.measuredHeight ) _this.totalLabel.y = _this.chart.legend.measuredHeight * 0.9;
                    var scale = _this.chart.seriesContainer.measuredWidth / 900 > 1 ? 1 : _this.chart.seriesContainer.measuredWidth / 900;
                    if( scale < 0.4 ) scale = 0.4;
                    _this.totalLabel.scale = scale;
                });
            },
            addColumnSeries: function( $graph ){
                var _this = this;
                var series = _this.chart.series.push( new am4charts.ColumnSeries() );
                series.showOnInit = false;
                series.name = $graph ? $graph.name : "정보량";
                if( $graph ) {
                    series.properties.graphCode = $graph.code ? $graph.code : _this.$options.filters.nameToOptsData( series.name ).code;
                } else {
                    series.properties.graphCode = null;
                }
                series.stacked = _this.graphType.indexOf( "stack" ) >= 0;
                series.padding( 0,0,0,0 );
                if( !_this.rot ) series.dataFields.valueY = $graph ? $graph.valueField : "value";
                else series.dataFields.valueX = $graph ? $graph.valueField : "value";

                if( !_this.rot ) {
                    if( _this.getXaxisTypeDate ) series.dataFields.dateX = "category";
                    else series.dataFields.categoryX = "category";
                } else {
                    if( _this.getXaxisTypeDate ) series.dataFields.dateY = "category";
                    else series.dataFields.categoryY = "category";
                }

                series.yAxis = !_this.rot ? _this.yAxis : _this.xAxis;
                series.calculatePercent = true;
                series.columns.template.width = am4core.percent( 95 );
                series.columns.template.strokeWidth = 0;

                // Series Corner Radius
                if( !_this.rot ) {
                    series.columns.template.column.adapter.add( "cornerRadiusTopLeft", function( $val, $target ){
                        var radius = $target.width * 0.25 > 2 ? $target.width * 0.25 : 2;
                        if( _this.graphType.indexOf( "stack" ) >= 0 ) {
                            return cornerRadius( $target ) ? radius : 0;
                        }
                        return radius;
                    });
                    series.columns.template.column.adapter.add( "cornerRadiusTopRight", function( $val, $target ){
                        var radius = $target.width * 0.25 > 2 ? $target.width * 0.25 : 2;
                        if( _this.graphType.indexOf( "stack" ) >= 0 ) {
                            return cornerRadius( $target ) ? radius : 0;
                        }
                        return radius;
                    });
                } else {
                    series.columns.template.column.adapter.add( "cornerRadiusTopRight", function( $val, $target ){
                        var radius = $target.height * 0.25 > 4 ? $target.height * 0.25 : 4;
                        if( _this.graphType.indexOf( "stack" ) >= 0 ) {
                            return cornerRadius( $target ) ? radius : 0;
                        }
                        return radius;
                    });
                    series.columns.template.column.adapter.add( "cornerRadiusBottomRight", function( $val, $target ){
                        var radius = $target.height * 0.25 > 4 ? $target.height * 0.25 : 4;
                        if( _this.graphType.indexOf( "stack" ) >= 0 ) {
                            return cornerRadius( $target ) ? radius : 0;
                        }
                        return radius;
                    });
                }
                function cornerRadius( $item ) {
                    var dataItem = $item.dataItem;
                    var lastSeries;
                    _this.chart.series.each(function( $series ) {
                        if (( $series.className == "ColumnSeries" && ( dataItem.dataContext[ $series.dataFields.valueY ] || dataItem.dataContext[ $series.dataFields.valueX ] ) && !$series.isHidden && !$series.isHiding ) ) {
                            lastSeries = $series;
                        }
                    });
                    return dataItem.component == lastSeries ? true : false;
                }

                series.columns.template.adapter.add( "fill", function( $val, $target ){
                    if( $target.dataItem.dataContext.fill ) return am4core.color( $target.dataItem.dataContext.fill );
                    if( !$graph ) {
                        return _this.chart.colors.getIndex( $target.dataItem.index );
                    } else {
                        return $val;
                    }
                });

                // var line = series.columns.template.createChild( am4core.Rectangle );
                // line.y = am4core.percent( 100 );
                // line.width = am4core.percent( 100 );
                // line.height = 1;
                // line.fill = am4core.color( "#ffffff" );

                // Tooltip
                if( _this.rot ) {
                    series.tooltip.pointerOrientation = "vertical";
                }
                series.tooltip.zIndex = 1;
                series.tooltip.label.padding( 5,5,5,5 );
                series.tooltip.autoTextColor = false;
                series.tooltip.background.interactionsEnabled = true;
                series.tooltip.label.interactionsEnabled = false;
                series.tooltip.label.fill = am4core.color( "#ffffff" );
                series.tooltip.background.fillOpacity = 1;
                if( !this.rot ) series.tooltipText = "[bold]{" + ( !$graph ? "category" : "name" ) + "}[/] [opacity:0.3]|[/] {valueY} [opacity:0.3]|[/] ({valueY.percent.formatNumber('#.0')}%)";
                else series.tooltipText = "[bold]{" + ( !$graph ? "category" : "name" ) + "}[/] [opacity:0.3]|[/] {valueX} [opacity:0.3]|[/] ({valueX.percent.formatNumber('#.0')}%)";
                series.columns.template.adapter.add( "tooltipHTML", function( $value, $target ) {
                    var tooltipResult = "";
                    if( _this.chartClick ) tooltipResult += "<button type=\"button\" class=\"" + ( $graph ? "chart_tooltip2" : "chart_tooltip" ) + "\">";
                    else tooltipResult += "<div class=\"" + ( $graph ? "chart_tooltip2" : "chart_tooltip" ) + "\">";
                    if( !$graph ) tooltipResult += !_this.rot ? "<strong class=\"per\">{valueY.percent.formatNumber('#.0')}%</strong>" : "<strong class=\"per\">{valueX.percent.formatNumber('#.0')}%</strong>";
                    else {
                        var total = !_this.rot ? $target.dataItem.values.valueY.total : $target.dataItem.values.valueX.total;
                        var val = !_this.rot ? $target.dataItem.values.valueY.value : $target.dataItem.values.valueX.value;
                        var avr = 0;
                        if( _this.lineValueField ) {
                            total -= parseInt( $target.dataItem.dataContext[ _this.lineValueField ] );
                        }
                        avr = ( ( val / total ) * 100 ).toFixed(1); 

                        tooltipResult += "<strong class=\"per\">" + avr + "%</strong>";
                    }
                    if( !$graph ) tooltipResult += "<div class=\"other\">";
                    if( !$graph ) tooltipResult += "<strong class=\"title\">{category}</strong>";
                    else tooltipResult += "<strong class=\"title\">{name}</strong>";
                    tooltipResult += !_this.rot ? "<span class=\"dv\">{valueY}</span>" : "<span class=\"dv\">{valueX}</span>";
                    if( !$graph ) tooltipResult += "</div>";
                    if( _this.chartClick ) tooltipResult += "</button>";
                    else tooltipResult += "</div>";

                    return tooltipResult;
                });

                // Gradient 설정
                series.columns.template.adapter.add( "fillModifier", function( $val, $target ){
                    var fillModifier = new am4core.LinearGradientModifier();
                    fillModifier.brightnesses = [0, 0.8];
                    fillModifier.offsets = [0, 1];
                    fillModifier.gradient.rotation = 180;
                    if( !_this.rot ) fillModifier.gradient.rotation = 90;

                    if( $target.dataItem && ( $target.fill.hex.toLowerCase() == ("#AEAEAE").toLowerCase() || $target.fill.hex.toLowerCase() == ("#c2c2c2").toLowerCase() ) ) fillModifier.brightnesses = [0, 0.4];

                    return fillModifier;
                });

                // State - Hover
                var hs_seriesActive = series.states.create( "overActive" );
                hs_seriesActive.properties.opacity = 1;
                var hs_seriesDisable = series.states.create( "overDisabled" );
                hs_seriesDisable.properties.opacity = 0.1;

                // Event - Click
                if( _this.chartClick ) {
                    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
                    series.columns.template.events.on( "hit", _this.evt_click );
                    series.tooltip.background.cursorOverStyle = am4core.MouseCursorStyle.pointer;
                    series.tooltip.background.events.on( "hit", _this.evt_click );
                }

                return series;
            },
            addLineSeries: function( $graph ){
                var _this = this;
                this.lineValueField = $graph.valueField;

                // New Axis
                if( $graph.newAxis ) {
                    // yAxis
                    if( !_this.rot ) {
                        this.yAxis2 = _this.chart.yAxes.push(new am4charts.ValueAxis());
                        this.yAxis2.position = "right";
                    } else {
                        this.yAxis2 = _this.chart.xAxes.push(new am4charts.ValueAxis());
                        this.yAxis2.position = "top";
                    }
                    this.yAxis2.renderer.opposite = true;
                    this.yAxis2.calculateTotals = true;
                    this.yAxis2.numberFormatter.numberFormat = this.getDigitNumber;
                    this.yAxis2.renderer.baseGrid.disabled = true;
                    this.yAxis2.renderer.grid.template.stroke = 0;
                    this.yAxis2.renderer.grid.template.strokeOpacity = 0;
                    this.yAxis2.renderer.labels.template.adapter.add( "text", function( $val, $target, $key ){
                        return $val + ( $graph.newAxisUnit || "" );
                    })
                    this.yAxis2.renderer.labels.template.fill = "#CCCCCC";
                    this.yAxis2.tooltip.background.strokeOpacity = 0;
                    this.yAxis2.tooltip.background.fillOpacity = 0;
                    this.yAxis2.tooltip.label.opacity = 0;
                    this.yAxis2.tooltip.disabled = true;

                    if( $graph.newAxisMin ) this.yAxis2.min = $graph.newAxisMin;
                    if( $graph.newAxisMax ) this.yAxis2.max = $graph.newAxisMax;
                    if( $graph.newAxisMin || $graph.newAxisMax ) {
                        this.yAxis2.strictMinMax = true;
                    } else {
                        this.yAxis2.extraMax = 0.2;
                    }
                }

                var series = _this.chart.series.push( new am4charts.LineSeries() );
                if( !_this.rot ) {
                    series.dataFields.categoryX = "category";
                    series.dataFields.valueY = $graph.valueField;
                    if( !$graph.newAxis ) series.yAxis = this.yAxis;
                    else series.yAxis = this.yAxis2;
                } else {
                    series.dataFields.categoryY = "category";
                    series.dataFields.valueX = $graph.valueField;
                    if( !$graph.newAxis ) series.xAxis = this.yAxis;
                    else series.xAxis = this.yAxis2;
                }
                series.showOnInit = false;
                series.name = $graph.name;
                series.strokeWidth = 4;
                series.calculatePercent = true;
                if( $graph ) {
                    series.properties.graphCode = $graph.code ? $graph.code : _this.$options.filters.nameToOptsData( series.name ).code;
                } else {
                    series.properties.graphCode = null;
                }

                var circleBullet = series.bullets.push(new am4charts.CircleBullet());
                circleBullet.circle.radius = 11;
                circleBullet.circle.stroke = am4core.color( "#ffffff" );
                circleBullet.circle.strokeWidth = 4;
                circleBullet.scale = 0.7;
                circleBullet.zIndex = 1;

                // Tooltip
                if( _this.rot ) {
                    series.tooltip.pointerOrientation = "vertical";
                    series.tooltip.y = 0;
                }
                series.tooltip.background.interactionsEnabled = true;
                series.tooltip.label.padding( 8,8,8,8 );
                series.tooltip.label.interactionsEnabled = false;
                series.tooltip.zIndex = 1;
                series.tooltip.autoTextColor = false;
                series.tooltip.label.fill = am4core.color( "#ffffff" );
                if( !this.rot ) series.tooltipText = "[bold]{category}[/] : {valueY} ({valueY.percent.formatNumber('#.0')}%)";
                else series.tooltipText = "[font style='font-size:18px'][bold]{category}[/] : {valueX} ({valueX.percent.formatNumber('#.0')}%)[/font]";
                series.adapter.add( "tooltipHTML", function( $value, $target ) {
                    var tooltipResult = "";
                    if( _this.chartClick ) tooltipResult += "<button type=\"button\" class=\"chart_tooltip\">";
                    else tooltipResult += "<div type=\"button\" class=\"chart_tooltip\">";
                    tooltipResult += !_this.rot ? "<strong class=\"per\">{valueY.percent.formatNumber('#.0')}%</strong>" : "<strong class=\"per\">{valueX.percent.formatNumber('#.0')}%</strong>";
                    tooltipResult += "<div class=\"other\">";
                    tooltipResult += "<strong class=\"title\">{category}</strong>";
                    if( !_this.rot ) tooltipResult += "<span class=\"dv\">{valueY}</span>";
                    else tooltipResult += "<span class=\"dv\">{valueX}</span>";
                    tooltipResult += "</div>";
                    if( _this.chartClick ) tooltipResult += "</button>";
                    else tooltipResult += "</div>";

                    return tooltipResult;
                });

                // State
                var hs_seriesActive = series.states.create( "overActive" );
                hs_seriesActive.properties.strokeWidth = 6;
                var hs_bulletActive = circleBullet.states.create( "overActive" );
                hs_bulletActive.properties.scale = 1.4;
                var hs_seriesDisable = series.states.create( "overDisabled" );
                hs_seriesDisable.properties.opacity = 0.1;
                var hs_bulletDisable = circleBullet.states.create( "overDisabled" );
                hs_bulletDisable.properties.opacity = 0.1;

                // Event - Click
                if( this.chartClick ) {
                    circleBullet.cursorOverStyle = am4core.MouseCursorStyle.pointer;
                    series.tooltip.background.cursorOverStyle = am4core.MouseCursorStyle.pointer;
                    circleBullet.events.on( "hit", this.evt_click );
                    series.tooltip.background.events.on( "hit", this.evt_click );
                }
                
                return series;
            },
            evt_click: function( $e ){
                var params = {};
                if( this.chartData && this.chartData.chart && this.chartData.chart.name ) params.chartName = this.chartData.chart.name;
                if( this.chartData && this.chartData.chart && this.chartData.chart.code ) params.chartCode = this.chartData.chart.code;
                params.category = $e.target.dataItem.dataContext.category;
                params.code = $e.target.dataItem.dataContext.code || this.$options.filters.nameToOptsData( $e.target.dataItem.dataContext.category ).code;
                if( $e.target.dataItem.component.name != "정보량" ) params.graph = $e.target.dataItem.component.name;
                if( $e.target.dataItem.component.properties.graphCode ) params.graphCode = $e.target.dataItem.component.properties.graphCode;
                params.value = $e.target.dataItem.valueY || $e.target.dataItem.valueX;
                this.chartClick( params );
            }
        },
        destroyed: function(){
            if( !this.chart ) return false;
            this.chart.disposeChildren();
            this.chart.dispose();
        }
    })
}());
