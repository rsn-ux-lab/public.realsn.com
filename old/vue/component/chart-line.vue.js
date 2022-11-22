(function(){
    // HTML Template
    var template = '<div ref="chart" :id="id" class="ui_chart_wrap" :class="{ \'ui_nodata\': !chartData || chartData.graphs.length == 0 || chartData.data.length == 0 }"></div>'

    // Component
    comp = Vue.component( "comp-chart-line", {
        template: template,
        data: function(){
			return {
                chart: null,
                colorSet: null,
                xAxis: null,
                yAxis: null,
                chartCursor: null,
                totalLabel: null,
                highlightGraph: false,
			};
		},
        props: {
            id: { type: String },
            chartData: { type: Object },
            legend: { type: String },
            graphType: { type: String, default: "one" },
            chartClick: { type: Function },
            digitNumber: { type: Number, default: 0 },
            total: {type: Boolean, default: true }
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
                if( !this.chartData || this.chartData.graphs.length == 0 || this.chartData.data.length == 0 ) return false;

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

                        if( $item.highlight ) _this.highlightGraph = $item.valueField;
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
                this.chart.colors = this.colorSet;
                this.chart.responsive.enabled = true;
                this.chart.responsive.useDefault = false;
                this.chart.paddingTop = 10;
                this.chart.paddingBottom = 0;
                this.chart.paddingLeft = 0;
                this.chart.maskBullets = false;
                this.chart.data = this.chartData.data;

                // Total Label
                this.build_totalLabel();

                // xAxis
                this.build_xAxis();

                // yAxis
                this.build_yAxis();

                // Graphs
                this.build_graphs();

                // Cursor
                this.build_chartCursor();

                // Z-Index Setting
                if( this.chart.cursor ) this.chart.cursor.zIndex = -1
                this.chart.seriesContainer.zIndex = 1;
                this.chart.bulletsContainer.zIndex = 10;

                // Legend
                this.build_legend();
            },
            build_xAxis: function(){
                var _this = this;
                if( this.xAxis ) return false;
                if( this.getXaxisTypeDate ) {
                    this.xAxis = this.chart.xAxes.push( new am4charts.DateAxis() );
                    this.xAxis.dateFormats.setKey("day", "MM-dd");
                    this.xAxis.periodChangeDateFormats.setKey("day", "yyyy-MM-dd");
                    this.xAxis.tooltipDateFormat = "yyyy-MM-dd";
                } else {
                    this.xAxis = this.chart.xAxes.push( new am4charts.CategoryAxis() );
                    this.xAxis.dataFields.category = "category";
                }
                this.xAxis.renderer.grid.template.location = 0;
                this.xAxis.renderer.grid.template.disabled = true;
                this.xAxis.renderer.minGridDistance = 10;
                this.xAxis.renderer.labels.template.truncate = true;
                this.xAxis.renderer.labels.template.fill = am4core.color( "#666666" );
                this.xAxis.renderer.labels.template.verticalCenter = "middle";
                this.xAxis.renderer.labels.template.rotation = 0;
                this.xAxis.renderer.labels.template.padding( 10,0,0,0 );
                this.xAxis.startLocation = 0.4;
                this.xAxis.endLocation = 0.6;
                this.xAxis.events.on( "sizechanged", function( $e ) {
                    var axis = $e.target;
                    var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
                    axis.renderer.labels.template.maxWidth = _this.rot ? ( cellWidth < 50 ? cellWidth : 50 ) : cellWidth;
                });
                this.xAxis.tooltip.label.padding( 10,10,10,10 );
                this.xAxis.tooltip.background.strokeWidth = 0;
                this.xAxis.tooltip.background.fill = am4core.color( "#666666" );
                this.xAxis.tooltip.background.cornerRadius = 5;
            },
            build_yAxis: function(){
                if( this.yAxis ) return false;
                this.yAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
                this.yAxis.calculateTotals = true;
                this.yAxis.renderer.minWidth = 50;
                this.yAxis.renderer.baseGrid.disabled = true;
                this.yAxis.renderer.grid.template.stroke = am4core.color( "#E5E5E5" );
                this.yAxis.renderer.grid.template.strokeOpacity = 1;
                this.yAxis.renderer.labels.template.fill = "#CCCCCC";
                this.yAxis.tooltip.background.strokeOpacity = 0;
                this.yAxis.tooltip.background.fillOpacity = 0;
                this.yAxis.tooltip.label.opacity = 0;
                this.yAxis.tooltip.disabled = true;
                this.yAxis.numberFormatter.numberFormat = this.getDigitNumber;
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

                this.chartData.graphs.filter( function( $item ){
                    var graph = _this.addSeries( $item );
                    series.push( graph );
                });

                this.chart.colors = this.colorSet;
            },
            build_chartCursor: function(){
                if( this.chartCursor ) return false;
                this.chartCursor = new am4charts.XYCursor();
                this.chartCursor.fullWidthLineX = true;
                this.chartCursor.xAxis = this.xAxis;
                this.chartCursor.lineX.strokeOpacity = 0;
                this.chartCursor.lineX.fill = am4core.color("#000");
                this.chartCursor.lineX.fillOpacity = 0.05;
                this.chartCursor.lineY.disabled = true;
                this.chart.cursor = this.chartCursor;

                if( this.chartData.data.length < 20 ) this.chartCursor.behavior = "none";
            },
            build_legend: function(){
                var _this = this;

                if( this.legend ) {
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
                    legendMarker.interactionsEnabled = false;
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
                    disableCircle.interactionsEnabled = false;
                    disableCircle.isMeasured = false;
                    disableCircle.x = 12;
                    disableCircle.y = 11;
                    disableCircle.radius = 6;
                    disableCircle.fill = am4core.color( "#FFFFFF" );
                    disableCircle.opacity = 0;
                    var disableLabel = legend.itemContainers.template.createChild( am4core.Label );
                    disableLabel.interactionsEnabled = false;
                    disableLabel.isMeasured = false;
                    disableLabel.x = 8.5;
                    disableLabel.y = 2;
                    disableLabel.fill = am4core.color( "#C6C6C6" );
                    disableLabel.text = "x";
                    disableLabel.fontWeight = "bold";
                    disableLabel.opacity = 0;
    
                    legend.labels.template.interactionsEnabled = false;
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
                                $item.bullets.values[ 0 ].setState( "overActive" );
                                $item.setState( "overActive" );
                            } else {
                                $item.bullets.values[ 0 ].setState( "overDisabled" );
                                $item.setState( "overDisabled" );
                            }
                        })
                    });
                    legend.itemContainers.template.events.on( "out", function( $e ){
                        //if( $e.target.dataItem.dataContext.isHiding || $e.target.dataItem.dataContext.isHidden ) return false;
                        _this.chart.series.values.filter( function( $item ){
                            if( $item.isHiding || $item.isHidden ) return false;
                            $item.bullets.values[ 0 ].setState( "default" );
                            $item.setState( "default" );
                        })
                    });
                }
            },
            build_totalLabel: function(){
                if( !this.total ) return false;
                if( this.totalLabel ) return false;
                var _this = this;
                this.totalLabel = this.chart.seriesContainer.createChild(am4core.Label);
                this.totalLabel.x = am4core.percent(50);
                this.totalLabel.y = 0;
                this.totalLabel.horizontalCenter = "middle";
                this.totalLabel.verticalCenter = "top";
                this.totalLabel.isMeasured = false;
                this.totalLabel.fontSize = 120;
                this.totalLabel.fontWeight = "bold";
                this.totalLabel.opacity = 0.05;
                this.totalLabel.zIndex = -1;
                this.chart.numberFormatter.numberFormat = this.getDigitNumber;
                this.totalLabel.numberFormatter.numberFormat = this.getDigitNumber;
                this.chart.events.on( "datavalidated", function( $e ){
                    var cnt = 0;
                    _this.chart.series.values.filter( function( $item ){
                        if( !_this.rot ) cnt += $item.dataItem.values.valueY.sum || 0;
                        else cnt += $item.dataItem.values.valueX.sum || 0;
                    });
                    _this.totalLabel.text = "T." + ( _this.digitNumber > 0 ? _this.$options.filters.lengthLimitComma( cnt, _this.digitNumber ) : _this.$options.filters.addComma( cnt ) );
                    // _this.totalLabel.text = "T." + _this.$options.filters.lengthLimitComma( cnt, 1 );
                    var scale = _this.chart.seriesContainer.measuredWidth / 900 > 1 ? 1 : _this.chart.seriesContainer.measuredWidth / 900;
                    if( scale < 0.4 ) scale = 0.4;
                    _this.totalLabel.scale = scale;
                });
            },
            addSeries: function( $graph ){
                var _this = this;
                var series = this.chart.series.push( new am4charts.LineSeries() );
                series.showOnInit = false;
                series.padding( 0,0,0,0 );
                series.transitionDuration = 0;
                series.sequencedInterpolation = false;
                series.name = $graph.name;
                series.yAxis = this.yAxis;
                series.dataFields.valueY = $graph.valueField;
                if( this.getXaxisTypeDate ) series.dataFields.dateX = "category";
                else series.dataFields.categoryX = "category";
                series.properties.graphCode = $graph.code ? $graph.code : this.$options.filters.nameToOptsData( series.name ).code;
                series.calculatePercent = true;
                series.strokeWidth = _this.chartData.graphs.length > 1 ? ( $graph.highlight ? 4 : 2 ) : 4;

                // Tooltip
                series.tooltip.autoTextColor = false;
                series.tooltip.interactionsEnabled = true;
                series.tooltip.background.fillOpacity = 1;
                series.tooltip.background.pointerLength = 10;
                series.tooltip.background.interactionsEnabled = true;
                series.tooltip.label.padding( 5,5,5,5 );
                series.tooltip.label.interactionsEnabled = false;
                if( !this.rot ) series.tooltipText = "[bold font-size:14px]{" + ( !$graph ? "category" : "name" ) + "}[/] [opacity:0.3]|[/] {valueY} [opacity:0.3]|[/] ({valueY.percent.formatNumber('#.0')}%)";
                else series.tooltipText = "[bold font-size:14px]{" + ( !$graph ? "category" : "name" ) + "}[/] [opacity:0.3]|[/] {valueX} [opacity:0.3]|[/] ({valueX.percent.formatNumber('#.0')}%)";
               
                series.bullets.zIndex = 10;
                var circleBullet = series.bullets.push(new am4charts.CircleBullet());
                circleBullet.zIndex = -1;
                circleBullet.scale = _this.chartData.graphs.length > 1 ? ( $graph.highlight ? 0.7 : 0.5 ) : 0.7;
                circleBullet.circle.radius = _this.chartData.graphs.length > 1 ? 9 : 11;
                circleBullet.circle.stroke = am4core.color( "#ffffff" );
                circleBullet.circle.strokeWidth = 4;

                circleBullet.adapter.add( "tooltipHTML", function( $value, $target ) {
                    var tooltipResult = "";
                    if( _this.chartClick ) tooltipResult += "<button type=\"button\" class=\"" + ( !$graph.highlight && _this.chartData.graphs.length > 1 ? "chart_tooltip2" : "chart_tooltip" ) + "\">";
                    else tooltipResult += "<div type=\"button\" class=\"" + ( !$graph.highlight && _this.chartData.graphs.length > 1 ? "chart_tooltip2" : "chart_tooltip" ) + "\">";

                    var total = !_this.rot ? $target.dataItem.values.valueY.total : $target.dataItem.values.valueX.total;
                    var val = !_this.rot ? $target.dataItem.values.valueY.value : $target.dataItem.values.valueX.value;
                    var avr = 0;
                    if( _this.highlightGraph ) {
                        total -= parseInt( $target.dataItem.dataContext[ _this.highlightGraph ] );
                    }
                    avr = val ? ( ( val / total ) * 100 ).toFixed(1) : ( 0 ).toFixed(1);

                    if( !$graph.highlight && _this.chartData.graphs.length > 1 ) {
                        tooltipResult += "<strong class=\"per\">" + avr + "%</strong>";
                        tooltipResult += "<strong class=\"title\">{name}</strong>";
                        tooltipResult += "<span class=\"dv\">{valueY}</span>";
                    } else {
                        tooltipResult += !_this.rot ? "<strong class=\"per\">{valueY.percent.formatNumber('#.0')}%</strong>" : "<strong class=\"per\">{valueX.percent.formatNumber('#.0')}%</strong>";
                        tooltipResult += "<div class=\"other\">";
                        tooltipResult += "<strong class=\"title\">{name}</strong>";
                        tooltipResult += "<span class=\"dv\">{valueY}</span>";
                        tooltipResult += "</div>";
                    }
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

                if( _this.chartClick ) {
                    var hs_circle = circleBullet.circle.states.create( "hover" );
                    hs_circle.properties.scale = 1.3;
                }

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
                params.code = this.xAxis.className == "DateAxis" ? $e.target.dataItem.dataContext.category : $e.target.dataItem.dataContext.code || this.$options.filters.nameToOptsData( $e.target.dataItem.dataContext.category ).code;
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