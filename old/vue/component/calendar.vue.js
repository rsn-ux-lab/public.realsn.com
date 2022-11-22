(function(){
    // HTML Template
    var template = ''
        + '<div class="ui_calendar">'
        + '    <div class="wrap" @mousedown="evt_mouseDown">'
        + '        <table class="calendar" v-calendarInit>'
        + '            <thead>'
        + '                <tr>'
        + '                    <template v-for="( $item, $idx ) in arrDays">'
        + '                        <th v-bind:key="\'dat_\' + $idx">{{ $item }}</th>'
        + '                    </template>'
        + '                </tr>'
        + '            </thead>'
        + '            <tbody ref="wrap">'
        + '                <tr v-for="( $item, $idx ) in getCalendarDate" v-bind:key="\'row_\' + $idx" :ref="\'tr_\' + $idx">'
        + '                    <td v-for="( $item2, $idx2 ) in $item" v-bind:key="\'col_\' + $idx + \'_\' + $idx2" :ref="\'td_\' + $options.filters.dateToStr( $item2 )" :data-row="$idx" :data-col="$idx2" :data-date="$options.filters.dateToStr( $item2 )" :class="{ \'is-selecting\': getSelected( $item2 ) }">'
        // + '                        <span class="dummy" data- style="position:absolute;top:0;left:0;width:100%;height:20px;background:blue" @mousedown="evt_item_mouseDown"></span>'
        + '                        <span class="date">{{ $item2 | dateToStr().split( "-" )[ 2 ] }}</span>'
        + '                    </td>'
        + '                </tr>'
        + '            </tbody>'
        + '        </table>'
        + '        <div v-if="renderComplete" ref="works" class="works">'
        + '            <div v-for="( $item, $idx ) in getWorks" v-bind:key="\'week_\' + $idx" class="weekend" :style="\'top:\' + getWeekPosTop( $idx ) + \'px\'">'
        + '                <button type="button" v-for="( $item2, $idx2 ) in $item" v-bind:key="\'work_\' + $idx + \'_\' + $idx2" class="work" :class="{ \'is-prevweek\' : $item2.rsDate && $item2.startDate != $item2.rsDate, \'is-nextweek\' : $item2.reDate && $item2.endDate != $item2.reDate }" :style="getWorkStyle( $item2, $idx2 )">'
        + '                    <span class="bg"></span>'
        + '                    <span class="title">{{ $item2.pjt }} : {{ $item2.rowIdx }}</span>'
        + '                </button>'
        + '            </div>'
        + '        </div>'
        + '        <div ref="drag" class="drag" :style="\'top:\' + dragPos.top + \'px;left:\' + dragPos.left + \'px\'"></div>'
        + '    </div>'
        + '</div>'

    // Component
    comp = Vue.component( "comp-calendar", {
        template: template,
        data: function(){
			return {
                renderComplete: false,
                arrDays: [ "일", "월", "화", "수", "목", "금", "토" ],
                curDate: new Date(),
                selectYear: 2020,
                selectMonth: 7,
                dragStart: null,
                dragEnd: null,
                draging: false,
                dragPos: { top: 0, left: 0 },
                selectStart: null,
                selectEnd: null,
                work_datas: [
                    { date: "2020-07-01", time: 240, pjt: "테스트 프로젝트 0", work: "이런저런일을 했음" },

                    { date: "2020-07-01", time: 240, pjt: "테스트 프로젝트 1", work: "이런저런일을 했음" },
                    { date: "2020-07-02", time: 240, pjt: "테스트 프로젝트 1", work: "이런저런일을 했음" },
                    { date: "2020-07-03", time: 240, pjt: "테스트 프로젝트 1", work: "이런저런일을 했음" },
                    { date: "2020-07-04", time: 240, pjt: "테스트 프로젝트 1", work: "이런저런일을 했음" },
                    { date: "2020-07-05", time: 240, pjt: "테스트 프로젝트 1", work: "이런저런일을 했음" },
                    { date: "2020-07-06", time: 240, pjt: "테스트 프로젝트 1", work: "이런저런일을 했음" },
                    { date: "2020-07-07", time: 240, pjt: "테스트 프로젝트 1", work: "이런저런일을 했음" },
                    { date: "2020-07-08", time: 240, pjt: "테스트 프로젝트 1", work: "이런저런일을 했음" },
                    { date: "2020-07-09", time: 240, pjt: "테스트 프로젝트 1", work: "이런저런일을 했음" },
                    { date: "2020-07-10", time: 240, pjt: "테스트 프로젝트 1", work: "이런저런일을 했음" },

                    { date: "2020-07-02", time: 240, pjt: "테스트 프로젝트 2", work: "이런저런일을 했음" },

                    { date: "2020-07-02", time: 240, pjt: "테스트 프로젝트 3", work: "이런저런일을 했음" },

                    { date: "2020-07-02", time: 240, pjt: "테스트 프로젝트 4", work: "이런저런일을 했음" },
                    { date: "2020-07-03", time: 240, pjt: "테스트 프로젝트 4", work: "이런저런일을 했음" },
                    // { date: "2020-07-04", time: 240, pjt: "테스트 프로젝트 4", work: "이런저런일을 했음" },
                    // { date: "2020-07-05", time: 240, pjt: "테스트 프로젝트 4", work: "이런저런일을 했음" },
                    { date: "2020-07-06", time: 240, pjt: "테스트 프로젝트 4", work: "이런저런일을 했음" },
                    { date: "2020-07-07", time: 240, pjt: "테스트 프로젝트 4", work: "이런저런일을 했음" },

                    // { date: "2020-07-05", time: 240, pjt: "테스트 프로젝트 5", work: "이런저런일을 했음" },
                    { date: "2020-07-06", time: 240, pjt: "테스트 프로젝트 5", work: "이런저런일을 했음" },
                ],
                workDraging: false
			};
		},
		props: {
		},
		created: function(){
            // console.log( this.curDate );
            // console.log( this.$options.filters.getWeek( this.curDate ) );
		},
		computed: {
            getCalendarDate: function(){
                var result = [];

                var tmpDate = new Date();
                tmpDate.setFullYear( this.selectYear );
                tmpDate.setMonth( this.selectMonth - 1 );
                tmpDate.setDate( 1 );

                // 시작 하는 날짜
                var date = new Date( tmpDate );
                var day = date.getDay()
                var diff = date.getDate() - day + ( day == 0 ? -6 : 1 );
                date = new Date( date.setDate( diff - 1 ) );

                var endChk = false;

                for( var Loop1 = 0 ; Loop1 < 6 ; ++Loop1 ) {
                    result[ Loop1 ] = [];
                    for( var Loop2 = 0 ; Loop2 < 7 ; ++Loop2 ) {
                        result[ Loop1 ][ Loop2 ] = new Date( date );
                        date.setDate( date.getDate() + 1 );
                        if( this.selectMonth < date.getMonth() + 1 ) endChk = true;
                    }
                    if( endChk ) break;
                }

                return result;
            },
            getWorks: function(){
                var result = [];
                var _this = this;
                this.work_datas.sort( function( a, b ){
                    return new Date( a.date ) - new Date( b.date );
                })
                this.getCalendarDate.filter( function( $item, $idx ){
                    result[ $idx ] = [];
                    var rowCnt = 0;
                    _this.work_datas.filter( function( $item2, $idx2, $arr ){
                        var sDate = new Date( _this.$options.filters.dateToStr( $item[ 0 ] ) + " 00:00:00" );
                        var eDate = new Date( _this.$options.filters.dateToStr( $item[ 6 ] ) + " 00:00:00" );
                        var itemDate = new Date( $item2.date + " 00:00:00" );
                        if( itemDate >= sDate && itemDate <= eDate ) {
                            var item = {};
                            item.pjt = $item2.pjt;
                            item.work = $item2.work;
                            var hasItem;
                            for( var Loop1 = 0 ; Loop1 < result[ $idx ].length ; ++Loop1 ){
                                if( item.pjt == result[ $idx ][ Loop1 ].pjt && item.work == result[ $idx ][ Loop1 ].work ) {
                                    var tmpDate = new Date( $item2.date );
                                    tmpDate.setDate( tmpDate.getDate() - 1 );
                                    tmpDate = _this.$options.filters.dateToStr( tmpDate );
    
                                    if( result[ $idx ][ Loop1 ].endDate == tmpDate ) {
                                        hasItem = result[ $idx ][ Loop1 ];
                                        break;
                                    }
                                }
                            }

                            if( hasItem ) {
                                hasItem.endDate = $item2.date;
                            } else {
                                item.startDate = $item2.date;
                                item.endDate = $item2.date;
                                result[ $idx ].push( item );
                            }
                        }
                    })
                })

                var flatData = result.reduce( function( a, b ){
                    return a.concat( b );
                })
                
                result.filter( function( $item ){
                    $item.filter( function( $item2, $idx2, $list2 ){
                        flatData.filter( function( $item3 ){
                            if( $item2.pjt == $item3.pjt && $item2.work == $item3.work ) {
                                var datePrv = new Date( $item2.endDate + " 00:00:00" );
                                var dateCur = new Date( $item3.startDate + " 00:00:00" );
                                // if( dateCur.getDay() == 0 ) {
                                //     dateCur.setDate( dateCur.getDate() - 2 );
                                // } else if( dateCur.getDay() == 6 ) {
                                //     dateCur.setDate( dateCur.getDate() - 1 );
                                // } else {
                                //     dateCur.setDate( dateCur.getDate() - 1 );
                                // }

                                if( dateCur.getDay() == 1 ) {
                                    dateCur.setDate( dateCur.getDate() - 3 );
                                } else {
                                    dateCur.setDate( dateCur.getDate() - 1 );
                                }

                                if( _this.$options.filters.dateToStr( datePrv ) == _this.$options.filters.dateToStr( dateCur ) ) {
                                    $item2.reDate = $item3.endDate;
                                    $item3.rsDate = $item2.startDate;
                                }

                            }
                        })
                        var cnt = 0;
                        var posArr = [];
                        for( var Loop1 = 0 ; Loop1 < $idx2 ; ++Loop1 ) {
                            var tmpSdate = new Date( $list2[ Loop1 ].startDate + " 00:00:00" );
                            var tmpEdate = new Date( $list2[ Loop1 ].endDate + " 00:00:00" );
                            if( new Date( $item2.startDate + " 00:00:00" ).getTime() >= tmpSdate.getTime() && new Date( $item2.startDate + " 00:00:00" ).getTime() <= tmpEdate.getTime() ) {
                                function cntChk( $val1, $val2 ){
                                    if( $val1 == $val2 ) {
                                        cnt++;
                                        cntChk( cnt, $val2 );
                                    }
                                    if( posArr[ cnt ] ){
                                        cnt++;
                                        cntChk( cnt, $val2 );
                                    }
                                }
                                posArr[ $list2[ Loop1 ].rowIdx ] = "1";
                                cntChk( cnt, $list2[ Loop1 ].rowIdx );
                            }
                        }
                        $item2.rowIdx = cnt;
                    });
                });

                console.log( result );
                return result;
            }
		},
		mounted: function (){
            this.getWorks;
		},
		filters: {
		},
		watch: {
		},
		methods: {
            getSelected: function( $date ){
                $date = new Date( this.$options.filters.dateToStr( $date ) + " 00:00:00" )
                var sDate = new Date( this.$options.filters.dateToStr( this.dragStart ) + " 00:00:00" );
                var eDate = new Date( this.$options.filters.dateToStr( this.dragEnd ) + " 00:00:00" );
                if( sDate > eDate ) {
                    var tmpDate = new Date( sDate );
                    sDate = eDate;
                    eDate = tmpDate;
                }
                if( $date >= sDate && $date <= eDate ) return true;
                return false;
            },
            getWeekPosTop: function( $idx ){
                return this.$refs[ "tr_" + $idx ] ? this.$refs[ "tr_" + $idx ][ 0 ].getBoundingClientRect().top - this.$refs.wrap.getBoundingClientRect().top : 0;
            },
            getWorkStyle: function( $item, $idx ){
                var result = "";
                var widGap = 0;
                if( this.$refs[ "td_" + $item.endDate ] ) {
                    var tmpA = new Date( $item.startDate + " 00:00:00" );
                    var tmpB = new Date( $item.endDate + " 00:00:00" );
                    widGap = this.$options.filters.getDateGap( tmpA, tmpB );
                }
                result += "top:" + ( $item.rowIdx * 22 ) + "px;"
                result += "margin-left:" + ( this.$refs[ "td_" + $item.startDate ] ? $( this.$refs[ "td_" + $item.startDate ][ 0 ] ).data( "col" ) * 14.28 : 0 ) + "%;"
                result += "width:" + ( widGap * 14.28 ) + "%;"
                return result;
            },
            evt_item_mouseDown: function( $e ){
                $e.preventDefault();
            },
            evt_mouseDown: function( $e ){
                this.draging = true;
                $( document ).mousemove( this.evt_mouseMove );
                $( document ).mouseup( this.evt_mouseUp );
                this.dragMove( $e );
            },
            evt_mouseMove: function( $e ){
                if( !this.draging ) return;
                this.dragMove( $e );
            },
            evt_mouseUp: function( $e ){
                this.draging = false;
                $( document ).unbind( "mousemove", this.evt_mouseMove );
                $( document ).unbind( "mouseup", this.evt_mouseUp );
                this.dragStart = null;
                this.dragEnd = null;
            },
            dragMove: function( $e ){
                var space = 5;
                this.dragPos = { top: $e.pageY, left: $e.pageX };
                if( this.dragPos.top < this.$refs.wrap.getBoundingClientRect().top ) this.dragPos.top = this.$refs.wrap.getBoundingClientRect().top;
                if( this.dragPos.top > this.$refs.wrap.getBoundingClientRect().top + this.$refs.wrap.getBoundingClientRect().height ) this.dragPos.top = this.$refs.wrap.getBoundingClientRect().top + this.$refs.wrap.getBoundingClientRect().height;
                if( this.dragPos.left < this.$refs.wrap.getBoundingClientRect().left ) this.dragPos.left = this.$refs.wrap.getBoundingClientRect().left;
                if( this.dragPos.left > this.$refs.wrap.getBoundingClientRect().left + this.$refs.wrap.getBoundingClientRect().width ) this.dragPos.left = this.$refs.wrap.getBoundingClientRect().left + this.$refs.wrap.getBoundingClientRect().width;

                // Hit Chk
                var _this = this;
                $( this.$refs.wrap ).find( "td" ).filter( function( $item ){
                    if( _this.dragPos.top + space > this.getBoundingClientRect().top && _this.dragPos.top - space < this.getBoundingClientRect().bottom && _this.dragPos.left + space > this.getBoundingClientRect().left && _this.dragPos.left - space < this.getBoundingClientRect().right ) {
                        if( !_this.dragStart ) _this.dragStart = $( this ).data( "date" );
                        _this.dragEnd = $( this ).data( "date" );
                    }
                })
            }
        },
        directives: {
            // Calendar Init
            calendarInit: {
                inserted: function ( el, binding, vnode ) {
                    vnode.context.renderComplete = true;
                }
            }
        }
    })
}());