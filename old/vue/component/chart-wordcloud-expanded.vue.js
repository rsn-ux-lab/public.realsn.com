(function(){
    // HTML Template
    var template = ''
    + '<transition name="fade">'
    + '    <div class="expanded_view">'
    + '        <div class="wrap">'
    + '            <span class="bg_top"></span>'
    + '            <button type="button" title="팝업 닫기" class="close" @click="$emit( \'update:active\', false )">닫기</button>'
    + '            <div class="set">'
    + '                <h3>설정</h3>'
    + '                <div class="sets">'
    + '                    <dl>'
    + '                        <dt>'
    + '                            로드 데이터 갯수'
    + '                        </dt>'
    + '                        <dd>'
    + '                            <comp-input-box :id="id + \'_dataLen\'" type="number" v-model="dataLen" :min="0" :max="200" label="입력창" :enter-evt="dataLoad" style="width:220px"></comp-input-box>'
    + '                            <button class="ui_btn" @click="dataLoad"><span class="txt">적용</span></button>'
    + '                        </dd>'
    + '                    </dl>'
    + '                    <dl>'
    + '                        <dt>'
    + '                            아이템 추가'
    + '                        </dt>'
    + '                        <dd>'
    + '                            <comp-input-box :id="id + \'_addData_name\'" v-model="addDataName" style="width:138px" label="추가 키워드명"></comp-input-box>'
    + '                            <comp-input-box :id="id + \'_addData_value\'" type="number" v-model="addDataValue" :min="0" :enter-evt="evt_addItem" label="추가 키워드 수량 입력" style="width:78px"></comp-input-box>'
    + '                            <button class="ui_btn" @click="evt_addItem" :disabled="addDataName.trim().length == 0 || !addDataValue"><span class="txt">추가</span></button>'
    + '                        </dd>'
    + '                    </dl>'
    + '                    <dl>'
    + '                        <dt>'
    + '                            아이템 삭제'
    + '                        </dt>'
    + '                        <dd>'
    + '                            <span style="width:220px;"><strong>{{ $options.filters.paramToArr( selecteds ).length }}</strong> 개 선택</span>'
    + '                            <button class="ui_btn" :disabled="selecteds.trim().length == 0" @click="evt_removeItem"><span class="txt">삭제</span></button>'
    + '                        </dd>'
    + '                    </dl>'
    + '                    <dl>'
    + '                        <dd>'
    + '                            <button class="ui_btn is-xlarge is-color-hl is-wid100p" :disabled="loading || chartLoading" @click="$refs.chart.$emit( \'exportImage\' )"><span class="txt">차트 이미지 다운로드</span></button>'
    + '                        </dd>'
    + '                    </dl>'
    + '                </div>'
    + '            </div>'
    + '            <div class="view" ref="view" :class="{ \'is-loading\': loading }">'
    + '                <div class="total">총 갯수 <strong>{{ chartData.length }}</strong> 개</div>'
    + '                <div class="chart_wrap" ref="chart_wrap">'
    + '                    <div class="resize_wrap" ref="resize_wrap">'
    + '                        <comp-chart-wordcloud :id="id + \'_expaned\'" ref="chart" :chart-data.sync="chartData" :expanded="false" :selecteds.sync="selecteds" :legend="legend" :chart-hgt="chartHgt"></comp-chart-wordcloud>'
    + '                        <span class="size">{{ visibleWid }} <span class="separator">x</span> {{ visibleHgt }}</span>'
    + '                    </div>'
    + '                </div>'
    + '            </div>'
    + '        </div>'
    + '    </div>'
    + '</transition>'

    // Component
    comp = Vue.component( "comp-chart-wordcloud-expanded", {
        template: template,
        data: function(){
			return {
                loading: false,
                chartLoading: false,
                dataLen: 50,
                addDataName: "",
                addDataValue: null,
                visibleWid: 0,
                visibleHgt: 0,
                chartHgt: 0,
                selecteds: "",
                resizeTimer: null,
                chartData: []
			};
		},
        props: {
            id: { type: String },
            commonData: { type: Object },
            legend: { type: Boolean },
            active: { type: Boolean },
            ajaxPath: { type: String },
        },
        created: function(){
            this.chartHgt = $( window ).outerHeight() - 189;
            $( window ).resize( this.evt_resize );
        },
		mounted: function (){
            this.$refs.chart.$on( "chartLoadStart", this.evt_chartLoadStart );
            this.$refs.chart.$on( "chartLoadEnd", this.evt_chartLoadEnd );

            var _this = this;
            this.visibleWid = $( this.$refs.resize_wrap ).outerWidth() - 2;
            this.visibleHgt = $( this.$refs.resize_wrap ).outerHeight() - 2;
            $( this.$refs.resize_wrap ).resizable({
                containment: _this.$refs.chart_wrap,
                minWidth: _this.legend ? 569 : 300,
                minHeight: 300,
                helper: "ui-resizable-helper",
                stop: function(){
                    _this.chartHgt = $( _this.$refs.resize_wrap ).outerHeight();
                },
                resize: function( $e, $ui ){
                    _this.visibleWid = $ui.size.width + 2;
                    _this.visibleHgt = $ui.size.height + 4;
                }
            });

            this.dataLoad();
        },
        methods: {
            dataLoad: function(){
                this.loading = true;
                var _this = this;
                this.params = JSON.parse( JSON.stringify( this.commonData ) );
                this.params.dataLen = this.dataLen;
                ajaxMngr.add( this.ajaxPath, this.params, function( $result ){
                    _this.loading = false;
                    _this.chartData = $result;
                }, function(){
                    console.log( "error" );
                });
            },
            evt_resize: function( $e ){
                if( $( $e.target ).hasClass( "ui-resizable" ) ) return false;
                this.chartHgt = $( this.$refs.resize_wrap ).outerHeight();
                this.visibleWid = $( this.$refs.resize_wrap ).outerWidth() - 2;
                this.visibleHgt = $( this.$refs.resize_wrap ).outerHeight();
            },
            evt_addItem: function(){
                var addData = {};
                addData.code = "add_item_" + parseInt( Math.random() * 1000000000 );
                addData.keyword = this.addDataName;
                addData.value = this.addDataValue;
                this.$refs.chart.$emit( "addData", addData );
                this.addDataName = "";
                this.addDataValue = null;
            },
            evt_removeItem: function(){
                this.$refs.chart.$emit( "removeData", this.selecteds );
            },
            evt_chartLoadStart: function(){
                this.chartLoading = true;
            },
            evt_chartLoadEnd: function(){
                this.chartLoading = false;
            }
        },
        destroyed: function(){
        }
    })
}());
