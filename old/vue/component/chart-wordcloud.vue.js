(function(){
    // HTML Template
    var template = ''
    +'<div class="ui_word_cloud_container">'
    +'    <div ref="chart" :id="id" class="ui_chart_wrap is-wordCloud is-loader" :class="[ { \'ui_nodata\': chartData.length == 0 }, { \'is-loading\': loading } ]" :style="\'height:\' + getHgt + \'px\'"></div>'
    +'    <button v-if="expandData" type="button" class="ui_btn is-icon-only" @click="expandedActive = true" title="확장해서 보기"><span class="icon">&#xe050;</span></button>'
    +'    <comp-chart-wordcloud-expanded v-if="expandData && expandedActive" :id="id" :common-data="expandData.commonData" :chart-data="chartData" :ajax-path="expandData.ajaxPath" :active.sync="expandedActive" :legend="legend"></comp-chart-wordcloud-expanded>'
    +'</div>';

    var legendTemplate = ''
    +'<div class="color_set">'
    +'    <ul>'
    +'        <li class="item"><span>~</span>10%</li>'
    +'        <li class="item"><span>~</span>20%</li>'
    +'        <li class="item"><span>~</span>30%</li>'
    +'        <li class="item"><span>~</span>40%</li>'
    +'        <li class="item"><span>~</span>50%</li>'
    +'        <li class="item"><span>~</span>60%</li>'
    +'        <li class="item"><span>~</span>70%</li>'
    +'        <li class="item"><span>~</span>80%</li>'
    +'        <li class="item"><span>~</span>90%</li>'
    +'        <li class="item"><span>~</span>100%</li>'
    +'    </ul>'
    +'</div>'

    // Component
    comp = Vue.component( "comp-chart-wordcloud", {
        template: template,
        data: function(){
			return {
                loading: false,
                chart: null,
                series: null,
                minValue: 0,
                maxValue: 0,
                hgt: 0,
                colors: [ "#AAAAAA", "#9C69DF", "#3972D5", "#1E9BC9", "#28AA53", "#69B229", "#ABC834", "#F6B61F", "#F58B39", "#EC5151", "#EC5151" ],
                expandedActive: false
			};
		},
        props: {
            id: { type: String },
            chartData: { type: Array },
            chartClick: { type: Function },
            legend: { type: Boolean },
            selectedKeyword: { type: String },
            digitNumber: { type: Number, default: 0 },
            selecteds: { type: String },
            chartHgt: { type: Number, default: null },
            expandData: { type: Object },
        },
		computed: {
            getHgt: function(){
                if( this.chartHgt ) {
                    return this.chartHgt;
                } else {
                    return parseInt( this.$vnode.data.staticStyle.height );
                }
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
        created: function(){
            this.$on( "addData", this.evt_addData );
            this.$on( "removeData", this.evt_removeData );
            this.$on( "exportImage", this.evt_exportImage );
        },
		mounted: function (){
            if( this.chartData && this.chartData.length > 0 ) {
                var _this = this;
                if( this.chartData.length > 0 ) {
                    this.minValue = Object.keys( this.chartData ).reduce(function( a, b ){ 
                        return parseInt( _this.chartData[ b ].value > a ? a : _this.chartData[ b ].value );
                    }, _this.chartData[0].value );
                    this.maxValue = Object.keys( this.chartData ).reduce(function( a, b ){
                        return _this.chartData[ b ].value > a ? _this.chartData[ b ].value : a;
                    }, 0 );
                    this.build_chart();
                }
            }
        },
        watch: {
            loading: function( $val ){
                if( $val ) this.$emit( "chartLoadStart" );
                else this.$emit( "chartLoadEnd" );
            },
            chartData: function( $val ){
                if( $val.length == 0 ) return;

                this.minValue = Object.keys( $val ).reduce(function( a, b ){ 
                    return parseInt( $val[ b ].value > a ? a : $val[ b ].value );
                }, $val[0].value );
                this.maxValue = Object.keys( $val ).reduce(function( a, b ){
                    return $val[ b ].value > a ? $val[ b ].value : a;
                }, 0 );

                var _this = this;
                if( this.chart ) {
                    this.chart.disposeChildren();
                    this.chart.dispose();
                    this.build_chart();
                } else {
                    this.build_chart();
                }
            },
            selectedKeyword: function( $val ){
                this.hndl_selectedItem();
            },
            selecteds: function( $val ){
                this.hndl_selectedItem();
            }
        },
        methods: {
            build_chart: function(){
                var _this = this;
                this.chart = am4core.create( this.$refs.chart, am4plugins_wordCloud.WordCloud );
                this.chart.numberFormatter.numberFormat = this.getDigitNumber;
                this.chart.padding( 0,0,0,0 );
                this.chart.margin( 0,0,0,0 );
                this.chart.export = {
                    enabled: true,
                }

                this.series = this.chart.series.push( new am4plugins_wordCloud.WordCloudSeries() );
                this.series.accuracy = 4;
                this.series.randomness = 0;
                this.series.rotationThreshold = 0;
                this.series.minFontSize = 12;
                this.series.padding( 10,20,10,20 );
                if( this.legend ) this.series.padding( 10,20,40,20 );
                this.series.calculatePercent = true;
                this.series.data = this.chartData;
                this.series.id = "wordCloud";

                this.series.dataFields.word = "keyword";
                this.series.dataFields.value = "value";

                if( this.legend ) {
                    this.series.labels.template.adapter.add( "fill", function( $val, $target ){
                        if( $target.dataItem.dataContext ) {
                            $( $target.background.dom ).find( "rect" ).attr( "rx", ( $target.background.measuredHeight / 2 ) + 2 );
                            var color = _this.colors[ Math.floor( ( ( $target.dataItem.dataContext.value - _this.minValue ) / ( _this.maxValue - _this.minValue ) ) * 10 ) ];
                            if( !color ) color = _this.colors[ _this.colors.length - 1 ];
                            return color;
                        }
                        return $val;
                    });

                    var legendContainer = this.chart.chartContainer.createChild( am4core.Container );
                    legendContainer.width = am4core.percent( 100 );
                    legendContainer.height = 20;
                    legendContainer.valign = "bottom";
                    for( var Loop1 = 0 ; Loop1 < 10 ; ++Loop1 ) {
                        var legendRect = legendContainer.createChild( am4core.RoundedRectangle );
                        legendRect.x = am4core.percent( 10 * Loop1 );
                        legendRect.width = am4core.percent( 10 );
                        legendRect.height = 20;
                        legendRect.cornerRadiusTopLeft = Loop1 == 0 ? 10 : 0;
                        legendRect.cornerRadiusTopRight = Loop1 == 9 ? 10 : 0;
                        legendRect.cornerRadiusBottomLeft = Loop1 == 0 ? 10 : 0;
                        legendRect.cornerRadiusBottomRight = Loop1 == 9 ? 10 : 0;
                        legendRect.fill = am4core.color( this.colors[ Math.abs( 10 - ( Loop1 + 1 ) ) ] );
                        var legendLabel = legendContainer.createChild( am4core.Label );
                        legendLabel.x = am4core.percent( 10 * Loop1 );
                        legendLabel.width = am4core.percent( 10 );
                        legendLabel.height = 20;
                        legendLabel.contentHeight = 20;
                        legendLabel.padding( 2,3,0,3 )
                        legendLabel.fill = am4core.color( "#ffffff" )
                        legendLabel.text = "~" + ( ( Loop1 + 1 ) * 10 ) + "%";
                        legendLabel.textAlign = "end";
                    }
                } else {
                    this.series.heatRules.push({
                        "target": _this.series.labels.template,
                        "property": "fill",
                        "min": am4core.color("#CCCCCC"),
                        "max": am4core.color("#333333"),
                        "dataField": "value"
                    });
                    this.series.labels.template.adapter.add( "fill", function( $val, $target ){
                        if( $target.dataItem.dataContext ) {
                            $( $target.background.dom ).find( "rect" ).attr( "rx", ( $target.background.measuredHeight / 2 ) + 5 );
                            if( $target.dataItem.dataContext.fill ) return $target.dataItem.dataContext.fill;
                        }
                        return $val;
                    })
                }

                this.series.labels.template.background.adapter.add( "dy", function( $val, $target ){
                    if( $target.height > 0 ) return -$target.height * 0.06;
                    return $val;
                });
                this.series.labels.template.background.padding( -2,-10,-2,-10 );
                this.series.labels.template.background.margin( 0,0,0,0 );
                this.series.labels.template.background.interactionsEnabled = false;
                this.series.labels.template.background.opacity = 0;
                // this.series.labels.template.background.dom.fill = am4core.color( "#ff0000" );
                this.series.labels.template.background.fillOpacity = 0.3;
                this.series.labels.template.background.strokeWidth = 1;
                this.series.labels.template.background.adapter.add( "stroke", function( $val, $target ){
                    if( $target.dataItem && $target.dataItem.dataContext ) {
                        $target.fill = am4core.color( $target.dataItem.dataContext.fill );
                        return $target.dataItem.dataContext.fill;
                    }
                    return $val;
                });

                // Tooltip(Bubble)
                this.series.tooltip.background.cornerRadius = 5;
                this.series.tooltip.background.stroke = am4core.color( "#ffffff" );
                this.series.tooltip.background.strokeOpacity = 1;
                this.series.tooltip.background.strokeWidth = 2;
                this.series.tooltip.background.fillOpacity = 1;
                this.series.tooltip.autoTextColor = false;
                this.series.tooltip.label.padding( 5,5,5,5 );
                this.series.tooltip.label.fill = am4core.color( "#000000" ).alternative;
                this.series.labels.template.tooltipText = "[bold]{word}[/] : {value} ({value.percent.formatNumber('#.0')}%)";
                this.series.labels.template.adapter.add( "tooltipHTML", function( $value, $target ) {
                    var tooltipResult = "";
                    tooltipResult += "<div class=\"chart_tooltip\">";
                    tooltipResult += "<strong class=\"per\">{value.percent.formatNumber('#.0')}%</strong>";
                    tooltipResult += "<div class=\"other\">";
                    tooltipResult += "<strong class=\"title\">{word}</strong>";
                    tooltipResult += "<span class=\"dv\">{value}</span>";
                    tooltipResult += "</div>";
                    tooltipResult += "</div>";
                    return tooltipResult;
                });

                // Event
                this.series.labels.template.events.on( "over", function( $e ){
                    setTimeout( function(){
                        if( $e.target.tooltip.verticalOrientation == "up" ) $e.target.tooltip.dy = -( $e.target.background.measuredHeight / 2 );
                        else $e.target.tooltip.dy = ( $e.target.background.measuredHeight / 2 );
                    }, 50 )

                    if( $e.target.dataItem.dataContext.code != _this.selectedKeyword ) {
                        $( $e.target.background.dom ).find( "rect" ).attr( "fill", "#CECECE" );
                        $( $e.target.background.dom ).find( "rect" ).attr( "stroke", "#CECECE" );
                    }
                    TweenMax.to( $e.target.background.dom, 0.3, { autoAlpha : 1 } )
                });
                this.series.labels.template.events.on( "out", function( $e ){
                    if( $e.target.dataItem.dataContext.code == _this.selectedKeyword || ( _this.selecteds && _this.$options.filters.paramToArr( _this.selecteds ).indexOf( $e.target.dataItem.dataContext.code ) >= 0 ) ) return;
                    TweenMax.to( $e.target.background.dom, 0.3, { autoAlpha : 0 } )
                });
                this.series.events.on("arrangestarted", function(ev) {
                    _this.loading = true;
                    _this.$emit( "update:selecteds", "" )
                });
                this.series.events.on("arrangeended", function(ev) {
                    _this.loading = false;
                });

                // Event - Click
                if( _this.chartClick ) {
                    this.series.labels.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
                    this.series.labels.template.events.on( "hit", function( $e ){
                        var params = JSON.parse( JSON.stringify( $e.target.dataItem.dataContext ) );
                        if( _this.chartData && _this.chartData.chart && _this.chartData.chart.name ) params.chartName = _this.chartData.chart.name;
                        if( _this.chartData && _this.chartData.chart && _this.chartData.chart.code ) params.chartCode = _this.chartData.chart.code;
                        _this.chartClick( params );
                    });
                }

                if( _this.selecteds != null && _this.selecteds != undefined ) {
                    this.series.labels.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
                    this.series.labels.template.events.on( "hit", function( $e ){
                        var tmp = _this.$options.filters.paramToArr( _this.selecteds );
                        if( tmp.indexOf( $e.target.dataItem.dataContext.code ) < 0 ) {
                            tmp.push( $e.target.dataItem.dataContext.code );
                        } else {
                            tmp.splice( tmp.indexOf( $e.target.dataItem.dataContext.code ), 1 );
                        }
                        _this.$emit( "update:selecteds", _this.$options.filters.arrToParam( tmp ) )
                    });
                }

                if( _this.selectedKeyword ) {
                    this.series.labels.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
                    this.series.labels.template.events.on( "hit", function( $e ){
                        _this.$emit( "update:selectedKeyword", $e.target.dataItem.dataContext.code )
                    });
                }

                this.chart.events.on( "ready", function( $e ){
                    if( _this.chartData.length > 0 && _this.selectedKeyword ) _this.hndl_selectedItem();
                })
            },
            hndl_selectedItem: function(){
                var _this = this;
                this.series.labels.values.filter( function( $item ){
                    if( $item.dataItem.dataContext.code == _this.selectedKeyword || ( _this.selecteds && _this.$options.filters.paramToArr( _this.selecteds ).indexOf( $item.dataItem.dataContext.code ) >= 0 ) ){
                        TweenMax.to( $( $item.background.dom ).find( "rect" ), 0.3, { fill : $item.fill.hex || $item.fill, stroke: $item.fill.hex || $item.fill, strokeWidth: 3 } );
                        TweenMax.to( $item.background.dom, 0.3, { autoAlpha : 1 } );
                    } else {
                        TweenMax.to( $( $item.background.dom ).find( "rect" ), 0.3, { fill : "#CECECE", stroke : "#CECECE", strokeWidth: 1 } );
                        TweenMax.to( $item.background.dom, 0.3, { autoAlpha : 0 } );
                    }
                });
            },
            evt_addData: function( $val ){
                var tmp = JSON.parse( JSON.stringify( this.chartData ) );
                tmp.push( $val );
                tmp.sort(function( a, b ){
                    if( a.value < b.value ) return 1;
                    if( a.value > b.value ) return -1;
                    return 0;
                });
                this.$emit( "update:chartData", tmp );
            },
            evt_removeData: function( $val ){
                var val = this.$options.filters.paramToArr( $val );
                var tmp = this.chartData.filter( function( $item ){
                    if( val.indexOf( $item.code ) < 0 ) return $item;
                })
                this.$emit( "update:chartData", tmp );
            },
            evt_exportImage: function(){
                if( this.chart ) {
                    this.chart.exporting.filePrefix = "rsn_chart_wordcloud(" + this.$options.filters.dateToStr( new Date() ) + ")";
                    this.chart.exporting.export( "png" );
                }
            }
        },
        destroyed: function(){
            this.chart.disposeChildren();
            this.chart.dispose();
        }
    })
}());
