(function(){
    // HTML Template
    var template = ''
        + '<div class="ui_datepicker" :class="{ \'is-range\': end_date.date, \'is-time\': getTimeUse }">'
        + '    <div class="input_wrap">'
        + '        <div class="wrap" ref="input" :class="{ \'is-month-move\': month_move, \'is-date-move-start\': date_move_start }">'
        + '            <button v-if="month_move" type="button" class="ui_btn is-icon-only is-prev" :class="$vnode.data.staticClass" :disabled="!start_active || disabled" title="이전달" @click="prev_month()"><span class="icon">&#xe001;</span></button>'
        + '            <comp-selectbox v-if="month_move && date_move_start" id="id + \'_move_range\'" :class="$vnode.data.staticClass" :opts="dateMoveRangeOpts" v-model="dateMoveRange" :disabled="( !start_active && !end_active ) || disabled"></comp-selectbox>'
        + '            <div :id="id" class="date_result" :class="{ \'is-active\': active }" readonly :disabled="disabled" @click="active = !active">{{ render_date }}</div>'
        + '            <button v-if="month_move" type="button" class="ui_btn is-icon-only is-next" :class="$vnode.data.staticClass" :disabled="!end_active || disabled" title="다음달" @click="next_month()"><span class="icon">&#xe000;</span></button>'
        + '        </div>'
        + '        <ul class="date_grp" v-if="date_grp && date_grp.length > 0">'
        + '            <li v-for="( item, idx ) in date_grp" v-bind:key="idx"><button type="button" data-value="item" @click="dateGrpClick( item )" :class="[ $vnode.data.staticClass , {\'is-active\': getDateGrpActive( item )} ]" :disabled="disabled"><span>{{ item | grpToStr }}</span></button></li>'
        + '        </ul>'
        + '    </div>'
        + '    <transition name="fade_posy">'
        + '        <span v-if="active" class="mobile_bg" @click="active = false"></span>'
        + '    </transition>'
        + '    <transition name="fade_posy">'
        + '        <div v-if="active && !disabled" ref="calendars" class="calendars" :style="\'top: \' + pos_top + \'px; left: \' + pos_left + \'px;\'" v-init>'
        + '            <comp-tab v-if="s_date && e_date" :id="id + \'_dp_tab\'" :opts="dpTabOpts" v-model="dpTabSelected"></comp-tab>'
        + '            <div class="calendars_container">'
        + '                <div class="wrap">'
        + '                    <div ref="dp_start_wrap" class="dp_wrap searchs_dp_start" :class="{\'is-active\': dpTabSelected == \'1\' }" :style="\'height:\' + Math.ceil( maxHgt ) + \'px\'">'
        + '                        <datepicker-calendar ref="start_dp" :id="id + \'_start\'" v-model="start_date" :mindate="min_date" :maxdate="max_date" :hgt.sync="s_dp_hgt" :minute-edit="minuteEdit" :second-edit="secondEdit"></datepicker-calendar>'
        + '                    </div>'
        + '                    <hr v-if="end_date.date">'
        + '                    <div v-if="end_date.date" ref="dp_end_wrap" class="dp_wrap searchs_dp_end" :class="{\'is-active\': dpTabSelected == \'2\' }" :style="\'height:\' + Math.ceil( maxHgt ) + \'px\'">'
        + '                        <datepicker-calendar ref="end_dp" :id="id + \'_end\'" v-model="end_date" :mindate="min_date" :maxdate="max_date" :hgt.sync="e_dp_hgt" :minute-edit="minuteEdit" :second-edit="secondEdit"></datepicker-calendar>'
        + '                    </div>'
        + '                </div>'
        + '            </div>'
        + '            <div class="btns" v-if="completeBtn">'
        + '                <button class="ui_btn" @click="active=false"><span>확인</span></button>'
        + '            </div>'
        + '        </div>'
        + '    </transition>'
        + '</div>'

    // Component
    comp = Vue.component( "comp-datapicker", {
        template: template,
        data: function(){
			return {
				curDate: this.$store.state.default && this.$store.state.default.get_curDate ? this.$store.state.default.get_curDate : new Date(),
				active: false,
				evtState: null,
				evtStateTimer: null,
				start_date: this.s_date ? this.s_date : {},
				end_date: this.e_date ? this.e_date : {},
				start_active: true,
				end_active: true,
				min_date_fix: null,
				getTimeUse: this.s_date.time ? true : false,
				pos_top: 0,
                pos_left: 0,
                s_dp_hgt: 0,
                e_dp_hgt: 0,
                maxHgt: 0,
                dpTabSelected: 1,
                dpTabOpts: [
                    { code: "1", name: "시작날짜" },
                    { code: "2", name: "종료날짜" }
                ],
                dateMoveRangeWeekStart: this.date_move_start ? this.date_move_start : "MON",
                dateMoveRange: "1M",
                dateMoveRangeOpts: [
                    { code: "1", name: "일" },
                    { code: "7", name: "주" },
                    { code: "1M", name: "월" }
                ],
                isDateGrpClick: false,
                dateGrpTimer: null
			};
		},
		props: {
			id: { type: String },									// ID
			range: { type: String, default: "1M" },					// 날짜 범위
			s_date: { type: Object },								// 시작 날짜
			e_date: { type: Object },								// 종료 날짜
			min_date: { type: String },								// 최소 날짜
			max_date: { type: String },								// 최대 날짜
			month_move: { type: Boolean, default : false },			// 월 이동 버튼 활성 여부
			date_move_start: { type: String },   	                // 날짜 이동 기본 요일
			date_grp: { type: Array, default : null },				// 날짜그룹 활성 여부
			completeBtn: { type: Boolean },		                    // '확인' 버튼 활성 여부
			sDateStandard: { type: Boolean, default : false },		// 그룹날짜 선택시 시작날짜가 기준이 됨
			disabled: { type: Boolean, default: false },            // Disabled
			minuteEdit: { type: Boolean, default: false },          // 분단위 Edit
			secondEdit: { type: Boolean, default: false },          // 초단위 Edit
		},
		created: function(){
			if( new Date( this.s_date.date ) < new Date( this.min_date ) ) this.start_date.date = this.min_date;
			else if( new Date( this.s_date.date ) > new Date( this.max_date ) ) this.start_date.date = this.max_date;

			if( this.e_date && new Date( this.e_date.date ) < new Date( this.min_date ) ) this.end_date.date = this.min_date;
			else if( this.e_date && new Date( this.e_date.date ) > new Date( this.max_date ) ) this.end_date.date = this.max_date;
		},
		computed: {
			render_date: function(){
				if( this.getTimeUse ){
					if( !this.end_date.date ) return this.start_date.date + ( this.start_date.time ? " " + this.$options.filters.time24to12( this.start_date.time ) : "" );
					else return this.start_date.date + ( this.start_date.time ? " " + this.$options.filters.time24to12( this.start_date.time )  : "" ) + " ~ " + this.end_date.date + (  this.end_date.time ? " " + this.$options.filters.time24to12( this.end_date.time ) : "" );
				}else{
					if( !this.end_date.date ) return this.start_date.date + ( this.start_date.time ? " " + this.$options.filters.time24to12( this.start_date.time ) : "" );
					else return this.start_date.date + ( this.start_date.time ? " " + this.$options.filters.time24to12( this.start_date.time )  : "" ) + " ~ " + this.end_date.date + (  this.end_date.time ? " " + this.$options.filters.time24to12( this.end_date.time ) : "" );
                }
            }
		},
		
		mounted: function (){
			this.start_active = new Date( this.start_date.date ).getFullYear() == new Date( this.min_date ).getFullYear() && new Date( this.start_date.date ).getMonth() == new Date( this.min_date ).getMonth() ? false : true;
			this.end_active = new Date( this.end_date.date ).getFullYear() == new Date( this.max_date ).getFullYear() && new Date( this.end_date.date ).getMonth() == new Date( this.max_date ).getMonth() ? false : true;

			if( !this.e_date ) {
				this.end_active = new Date( this.start_date.date ).getFullYear() == new Date( this.max_date ).getFullYear() && new Date( this.start_date.date ).getMonth() == new Date( this.max_date ).getMonth() ? false : true;
			}

			$( window ).resize( this.evt_resize );
		},
		filters: {
			grpToStr: function( $val ){
				if( String( $val ).toUpperCase().indexOf( "Y" ) >= 0 ) return String( $val ).toUpperCase().split( "Y" )[ 0 ] + "년";
				else if( String( $val ).toUpperCase().indexOf( "M" ) >= 0 ) return String( $val ).toUpperCase().split( "M" )[ 0 ] + "달";
				else if( String( $val ).toUpperCase().indexOf( "TH" ) >= 0 ) return String( $val ).toUpperCase().split( "TH" )[ 0 ] + "월";
				else {
					if( $val == 1 || $val == 0 ) return "금일";
					else if( $val == -1 ) return "전일";
					else return $val + "일";
				};
			}
		},
		watch: {
			s_date: function( $date ){
                this.start_date = $date;
			},
			e_date: function( $date ){
                this.end_date = $date;
			},
			start_date: {
				handler: function( $date ) {
					if( new Date( $date.date ).getFullYear() == new Date( this.min_date ).getFullYear() && new Date( $date.date ).getMonth() == new Date( this.min_date ).getMonth() ) this.start_active = false
					else this.start_active = true;

					if( !this.e_date ) {
						if( new Date( $date.date ).getFullYear() == new Date( this.max_date ).getFullYear() && new Date( $date.date ).getMonth() == new Date( this.max_date ).getMonth() ) this.end_active = false
						else this.end_active = true;
                    }

					this.$emit( "update:s_date", $date );

					if( this.e_date ){
						if( this.evtState == null ) {
							var tmp_s = new Date( $date.date );
							var tmp_e = new Date( this.end_date.date );
							var tmp_c = new Date( $date.date );
							if( tmp_s > tmp_e ) {
								this.end_date = $date;
							} else {
								if( this.range.toUpperCase().indexOf( "Y" ) >= 0 ) {
									tmp_c.setFullYear( tmp_c.getFullYear() + parseInt( this.range.toUpperCase().split( "Y" )[ 0 ] ) );
								} else if( this.range.toUpperCase().indexOf( "M" ) >= 0 ) {
									tmp_c.setMonth( tmp_c.getMonth() + parseInt( this.range.toUpperCase().split( "M" )[ 0 ] ) );
								} else {
									tmp_c.setDate( tmp_c.getDate() + parseInt( this.range ) - 1 );
								}
								if( tmp_c < tmp_e ) this.e_date.date = this.$options.filters.dateToStr( tmp_c );
							}
						}
					}
				},
				deep: true
			},
			end_date: {
				handler: function( $date ) {
					if( new Date( $date.date ).getFullYear() == new Date( this.max_date ).getFullYear() && new Date( $date.date ).getMonth() == new Date( this.max_date ).getMonth() ) this.end_active = false
					else this.end_active = true;
					this.$emit( "update:e_date", $date );

					if( this.evtState == null ) {
						var tmp_s = new Date( this.start_date.date );
						var tmp_e = new Date( $date.date );
						var tmp_c = new Date( $date.date );
						if( tmp_s.getTime() > tmp_e.getTime() ) {
							this.$emit( "update:s_date", $date );
						} else {
							if( this.range.toUpperCase().indexOf( "Y" ) >= 0 ) {
								tmp_c.setFullYear( tmp_c.getFullYear() - parseInt( this.range.toUpperCase().split( "Y" )[ 0 ] ) );
							} else if( this.range.toUpperCase().indexOf( "M" ) >= 0 ) {
								tmp_c.setMonth( tmp_c.getMonth() - parseInt( this.range.toUpperCase().split( "M" )[ 0 ] ) );
							} else {
								tmp_c.setDate( tmp_c.getDate() - parseInt( this.range ) + 1 );
                            }
							if( !this.isDateGrpClick && tmp_c.getTime() > tmp_s.getTime() ) {
                                this.$emit( "update:s_date", { date: this.$options.filters.dateToStr( tmp_c ), time: this.s_date.time } );
                            }
						}
                    }
				},
				deep: true
            },
            s_dp_hgt: function( $val ){
                this.maxHgt = Math.max( $val, this.e_dp_hgt );
            },
            e_dp_hgt: function( $val ){
                this.maxHgt = Math.max( $val, this.s_dp_hgt );
            },
			active: function( $val ){
				if( $val ) {
                    document.addEventListener( "click", this.documentClick );
                    if( $( this.$el ).parents( ".popup_item" ).length > 0 ) $( this.$el ).parents().scroll( this.evt_scroll );
                    else $( window ).scroll( this.evt_scroll );
					//this.set_rePos();
				} else {
                    document.removeEventListener( "click", this.documentClick );
                    if( $( this.$el ).parents( ".popup_item" ).length > 0 ) $( this.$el ).parents().unbind( "scroll", this.evt_scroll );
                    else $( window ).unbind( "scroll", this.evt_scroll );
				}
			},
			evtState: function( $val ){
				var _this = this;
				if( $val ) {
					if( this.evtStateTimer ) clearTimeout( this.evtStateTimer );
					this.evtStateTimer = setTimeout( function(){
						_this.evtStateTimer = null;
						_this.evtState = null;
					}, 300 );
				}
            },
            dpTabSelected: function( $val ){

            }
		},
		methods: {
			evt_scroll: function(){
				this.active = false;
			},
			evt_resize: function(){
				this.active = false;
			},
			prev_month: function(){
                this.evtState = "prev";
                if( this.dateMoveRange == "1M" ) {
                    if( this.end_date.date ) {
                        var tmp_s_date = new Date( this.start_date.date );
                        tmp_s_date.setMonth( tmp_s_date.getMonth() - 1 );
                        tmp_s_date.setDate( 1 );
                        var result_s_date = new Date( this.min_date );
                        if( tmp_s_date < result_s_date ) tmp_s_date = new Date( result_s_date );
                        this.start_date.date = this.$options.filters.dateToStr( tmp_s_date );
    
                        var tmp_e_date = new Date( tmp_s_date );
                        tmp_e_date.setMonth( tmp_e_date.getMonth() + 1 );
                        tmp_e_date.setDate( 1 );
                        tmp_e_date.setDate( tmp_e_date.getDate() - 1 );
                        var result_e_date = new Date( this.min_date );
                        if( tmp_e_date < result_e_date ) tmp_e_date = new Date( result_e_date );
    
                        var rangeDate = new Date( this.start_date.date );
                        if( this.range.toUpperCase().indexOf( "Y" ) >= 0 ) {
                            rangeDate.setFullYear( rangeDate.getFullYear() + parseInt( this.range.toUpperCase().split( "Y" )[ 0 ] ) );
                        } else if( this.range.toUpperCase().indexOf( "M" ) >= 0 ) {
                            rangeDate.setMonth( rangeDate.getMonth() + parseInt( this.range.toUpperCase().split( "M" )[ 0 ] ) );
                        } else {
                            rangeDate.setDate( rangeDate.getDate() + parseInt( this.range ) - 1 );
                        }
                        if( tmp_e_date > rangeDate ) tmp_e_date = new Date( rangeDate );
    
                        this.end_date.date = this.$options.filters.dateToStr( tmp_e_date );
                    } else {
                        var tmp_date = new Date( this.start_date.date );
                        tmp_date.setMonth( tmp_date.getMonth() - 1 );
                        var result_date = new Date( this.min_date );
                        if( tmp_date < result_date ) tmp_date = new Date( result_date );
                        this.start_date.date = this.$options.filters.dateToStr( tmp_date );
                    }
                } else if( this.dateMoveRange == "7" ) {
                    if( this.end_date.date ) {
                        var tmp_s_date = this.$options.filters.dateToWeekStart( new Date( this.start_date.date ) );
                        tmp_s_date.setDate( tmp_s_date.getDate() - 7 );
                        var result_s_date = new Date( this.min_date );
                        if( tmp_s_date < result_s_date ) tmp_s_date = new Date( result_s_date );
                        this.start_date.date = this.$options.filters.dateToStr( tmp_s_date );
    
                        var tmp_e_date = new Date( tmp_s_date );
                        tmp_e_date.setDate( tmp_e_date.getDate() + 6 );
    
                        var rangeDate = new Date( this.start_date.date );
                        if( this.range.toUpperCase().indexOf( "Y" ) >= 0 ) {
                            rangeDate.setFullYear( rangeDate.getFullYear() + parseInt( this.range.toUpperCase().split( "Y" )[ 0 ] ) );
                        } else if( this.range.toUpperCase().indexOf( "M" ) >= 0 ) {
                            rangeDate.setMonth( rangeDate.getMonth() + parseInt( this.range.toUpperCase().split( "M" )[ 0 ] ) );
                        } else {
                            rangeDate.setDate( rangeDate.getDate() + parseInt( this.range ) - 1 );
                        }
                        if( tmp_e_date > rangeDate ) tmp_e_date = new Date( rangeDate );
    
                        this.end_date.date = this.$options.filters.dateToStr( tmp_e_date );
                    } else {
                        // var tmp_date = this.$options.filters.dateToWeekStart( new Date( this.start_date.date ) );
                        var tmp_date = new Date( this.start_date.date );
                        tmp_date.setDate( tmp_date.getDate() - 7 );
                        var result_date = new Date( this.min_date );
                        if( tmp_date < result_date ) tmp_date = new Date( result_date );
                        this.start_date.date = this.$options.filters.dateToStr( tmp_date );
                    }
                } else if( this.dateMoveRange == "1" ) {
                    if( this.end_date.date ) {
                        var tmp_s_date = new Date( this.start_date.date );
                        tmp_s_date.setDate( tmp_s_date.getDate() - 1 );
                        var result_s_date = new Date( this.min_date );
                        if( tmp_s_date < result_s_date ) tmp_s_date = new Date( result_s_date );
                        this.start_date.date = this.$options.filters.dateToStr( tmp_s_date );
    
                        var tmp_e_date = new Date( tmp_s_date );
    
                        var rangeDate = new Date( this.start_date.date );
                        if( this.range.toUpperCase().indexOf( "Y" ) >= 0 ) {
                            rangeDate.setFullYear( rangeDate.getFullYear() + parseInt( this.range.toUpperCase().split( "Y" )[ 0 ] ) );
                        } else if( this.range.toUpperCase().indexOf( "M" ) >= 0 ) {
                            rangeDate.setMonth( rangeDate.getMonth() + parseInt( this.range.toUpperCase().split( "M" )[ 0 ] ) );
                        } else {
                            rangeDate.setDate( rangeDate.getDate() + parseInt( this.range ) - 1 );
                        }
                        if( tmp_e_date > rangeDate ) tmp_e_date = new Date( rangeDate );
    
                        this.end_date.date = this.$options.filters.dateToStr( tmp_e_date );
                    } else {
                        var tmp_date = new Date( this.start_date.date );
                        tmp_date.setDate( tmp_date.getDate() - 1 );
                        var result_date = new Date( this.min_date );
                        if( tmp_date < result_date ) tmp_date = new Date( result_date );
                        this.start_date.date = this.$options.filters.dateToStr( tmp_date );
                    }
                }
                
			},
			next_month: function(){
                this.evtState = "next";
                /*
				if( this.end_date.date ) {
					var tmp_s_date = new Date( this.start_date.date );
					tmp_s_date.setMonth( tmp_s_date.getMonth() + 1 );
					var result_s_date = new Date( this.max_date );
					if( tmp_s_date > result_s_date ) tmp_s_date = new Date( result_s_date );
					tmp_s_date.setDate( 1 );
					this.start_date.date = this.$options.filters.dateToStr( tmp_s_date );

					var tmp_e_date = new Date( tmp_s_date );
					tmp_e_date.setMonth( tmp_e_date.getMonth() + 1 );
					tmp_e_date.setDate( tmp_e_date.getDate() - 1 );
					var result_e_date = new Date( this.max_date );
					if( tmp_e_date > result_e_date ) tmp_e_date = new Date( result_e_date );

					var rangeDate = new Date( this.start_date.date );
					if( this.range.toUpperCase().indexOf( "Y" ) >= 0 ) {
						rangeDate.setFullYear( rangeDate.getFullYear() + parseInt( this.range.toUpperCase().split( "Y" )[ 0 ] ) );
					} else if( this.range.toUpperCase().indexOf( "M" ) >= 0 ) {
						rangeDate.setMonth( rangeDate.getMonth() + parseInt( this.range.toUpperCase().split( "M" )[ 0 ] ) );
					} else {
						rangeDate.setDate( rangeDate.getDate() + parseInt( this.range ) - 1 );
					}
					if( tmp_e_date > rangeDate ) tmp_e_date = new Date( rangeDate );

					this.end_date.date = this.$options.filters.dateToStr( tmp_e_date );
				} else {
					var tmp_date = new Date( this.start_date.date );
					tmp_date.setMonth( tmp_date.getMonth() + 1 );
					var result_date = new Date( this.max_date );
					if( tmp_date > result_date ) tmp_date = new Date( result_date );
					this.start_date.date = this.$options.filters.dateToStr( tmp_date );
                }
                */

               if( this.dateMoveRange == "1M" ) {
                if( this.end_date.date ) {
                    var tmp_s_date = new Date( this.start_date.date );
                    tmp_s_date.setMonth( tmp_s_date.getMonth() + 1 );
                    tmp_s_date.setDate( 1 );
                    var result_s_date = new Date( this.min_date );
                    if( tmp_s_date < result_s_date ) tmp_s_date = new Date( result_s_date );
                    this.start_date.date = this.$options.filters.dateToStr( tmp_s_date );

                    var tmp_e_date = new Date( tmp_s_date );
                    tmp_e_date.setMonth( tmp_e_date.getMonth() + 1 );
                    tmp_e_date.setDate( 1 );
                    tmp_e_date.setDate( tmp_e_date.getDate() - 1 );
                    var result_e_date = new Date( this.min_date );
                    if( tmp_e_date < result_e_date ) tmp_e_date = new Date( result_e_date );

                    var rangeDate = new Date( this.start_date.date );
                    if( this.range.toUpperCase().indexOf( "Y" ) >= 0 ) {
                        rangeDate.setFullYear( rangeDate.getFullYear() + parseInt( this.range.toUpperCase().split( "Y" )[ 0 ] ) );
                    } else if( this.range.toUpperCase().indexOf( "M" ) >= 0 ) {
                        rangeDate.setMonth( rangeDate.getMonth() + parseInt( this.range.toUpperCase().split( "M" )[ 0 ] ) );
                    } else {
                        rangeDate.setDate( rangeDate.getDate() + parseInt( this.range ) - 1 );
                    }
                    if( tmp_e_date > rangeDate ) tmp_e_date = new Date( rangeDate );

                    this.end_date.date = this.$options.filters.dateToStr( tmp_e_date );
                } else {
                    var tmp_date = new Date( this.start_date.date );
                    tmp_date.setMonth( tmp_date.getMonth() + 1 );
                    var result_date = new Date( this.min_date );
                    if( tmp_date < result_date ) tmp_date = new Date( result_date );
                    this.start_date.date = this.$options.filters.dateToStr( tmp_date );
                }
            } else if( this.dateMoveRange == "7" ) {
                if( this.end_date.date ) {
                    var tmp_s_date = this.$options.filters.dateToWeekStart( new Date( this.start_date.date ) );
                    tmp_s_date.setDate( tmp_s_date.getDate() + 7 );
                    var result_s_date = new Date( this.min_date );
                    if( tmp_s_date < result_s_date ) tmp_s_date = new Date( result_s_date );
                    this.start_date.date = this.$options.filters.dateToStr( tmp_s_date );

                    var tmp_e_date = new Date( tmp_s_date );
                    tmp_e_date.setDate( tmp_e_date.getDate() + 6 );

                    var rangeDate = new Date( this.start_date.date );
                    if( this.range.toUpperCase().indexOf( "Y" ) >= 0 ) {
                        rangeDate.setFullYear( rangeDate.getFullYear() + parseInt( this.range.toUpperCase().split( "Y" )[ 0 ] ) );
                    } else if( this.range.toUpperCase().indexOf( "M" ) >= 0 ) {
                        rangeDate.setMonth( rangeDate.getMonth() + parseInt( this.range.toUpperCase().split( "M" )[ 0 ] ) );
                    } else {
                        rangeDate.setDate( rangeDate.getDate() + parseInt( this.range ) - 1 );
                    }
                    if( tmp_e_date > rangeDate ) tmp_e_date = new Date( rangeDate );

                    this.end_date.date = this.$options.filters.dateToStr( tmp_e_date );
                } else {
                    // var tmp_date = this.$options.filters.dateToWeekStart( new Date( this.start_date.date ) );
                    var tmp_date = new Date( this.start_date.date );
                    tmp_date.setDate( tmp_date.getDate() + 7 );
                    var result_date = new Date( this.min_date );
                    if( tmp_date < result_date ) tmp_date = new Date( result_date );
                    this.start_date.date = this.$options.filters.dateToStr( tmp_date );
                }
            } else if( this.dateMoveRange == "1" ) {
                if( this.end_date.date ) {
                    var tmp_s_date = new Date( this.start_date.date );
                    tmp_s_date.setDate( tmp_s_date.getDate() + 1 );
                    var result_s_date = new Date( this.min_date );
                    if( tmp_s_date < result_s_date ) tmp_s_date = new Date( result_s_date );
                    this.start_date.date = this.$options.filters.dateToStr( tmp_s_date );

                    var tmp_e_date = new Date( tmp_s_date );

                    var rangeDate = new Date( this.start_date.date );
                    if( this.range.toUpperCase().indexOf( "Y" ) >= 0 ) {
                        rangeDate.setFullYear( rangeDate.getFullYear() + parseInt( this.range.toUpperCase().split( "Y" )[ 0 ] ) );
                    } else if( this.range.toUpperCase().indexOf( "M" ) >= 0 ) {
                        rangeDate.setMonth( rangeDate.getMonth() + parseInt( this.range.toUpperCase().split( "M" )[ 0 ] ) );
                    } else {
                        rangeDate.setDate( rangeDate.getDate() + parseInt( this.range ) - 1 );
                    }
                    if( tmp_e_date > rangeDate ) tmp_e_date = new Date( rangeDate );

                    this.end_date.date = this.$options.filters.dateToStr( tmp_e_date );
                } else {
                    var tmp_date = new Date( this.start_date.date );
                    tmp_date.setDate( tmp_date.getDate() + 1 );
                    var result_date = new Date( this.min_date );
                    if( tmp_date < result_date ) tmp_date = new Date( result_date );
                    this.start_date.date = this.$options.filters.dateToStr( tmp_date );
                }
            }
			},
			documentClick: function( $e ){
				var el = this.$el;
				var target = $e.target;
				if ( el !== target && !el.contains( target ) ) {
					this.active = false;
				}
			},
			dateGrpClick: function( $val ){
                var _this = this;
				var eDate = new Date( this.curDate );
				var sDate = new Date( this.curDate );

				if( String( $val ).toUpperCase().indexOf( "Y" ) >= 0 ) {
					sDate.setFullYear( sDate.getFullYear() - parseInt( String( $val ).split( "Y" )[ 0 ] ) );
					if( this.e_date ) sDate.setDate( eDate.getDate() + 1 );
				} else if( String( $val ).toUpperCase().indexOf( "M" ) >= 0 ) {
					sDate.setMonth( sDate.getMonth() - parseInt( String( $val ).split( "M" )[ 0 ] ) );
					if( this.e_date ) sDate.setDate( eDate.getDate() + 1 );
				} else if( String( $val ).toUpperCase().indexOf( "TH" ) >= 0 ) {
					sDate.setDate( 1 );
                    sDate.setMonth( parseInt( String( $val ).split( "TH" )[ 0 ] ) - 1 );
                    if( this.e_date ) {
                        eDate.setDate( 1 );
                        eDate.setMonth( parseInt( String( $val ).split( "TH" )[ 0 ] ) );
                        eDate.setDate( eDate.getDate() - 1 );
                    }
				} else {
                    if( $val > 0 ) sDate.setDate( sDate.getDate() - ( parseInt( $val ) - 1 ) );
                    else {
                        sDate.setDate( sDate.getDate() + parseInt( $val ) );
                        if( this.e_date ) eDate.setDate( eDate.getDate() + parseInt( $val ) );
                    }
                }

                if( sDate < new Date( this.min_date ) ) sDate = new Date( this.min_date );

                this.isDateGrpClick = true;
                if( this.dateGrpTimer ) this.dateGrpTimer.clearTimeout();
                this.dateGrpTimer = setTimeout( function(){
                    _this.isDateGrpClick = false;
                    _this.dateGrpTimer = null;
                }, 100 )
				this.start_date.date = this.$options.filters.dateToStr( sDate );
                if( this.e_date ) this.end_date.date = this.$options.filters.dateToStr( eDate );
			},
			getDateGrpActive: function( $item ){
                if( !this.e_date ) return false;

                if( $item == -1 ) {
                    var tmpDate = new Date();
                    tmpDate.setDate( tmpDate.getDate() - 1 );
                    if( this.start_date.date == this.end_date.date ) {
                        if( this.end_date.date == this.$options.filters.dateToStr( tmpDate ) ) {
                            return true;
                        }
                    }
                    return false;
                }

                if( String( $item ).toUpperCase().indexOf( "TH" ) < 0 ) {
                    // 종료날짜가 기준인 경우
                    if( !this.sDateStandard ) {
                        if( this.$options.filters.dateToStr( this.curDate ) != this.end_date.date ) return false;
                    // 시작날짜가 기준인 경우
                    } else {
                        if( this.$options.filters.dateToStr( this.curDate ) != this.start_date.date ) return false;
                    }
                }

				var _this = this;
				var calGap = (function(){
					var sdate = _this.$options.filters.strToDate( _this.start_date.date );
					var edate = _this.$options.filters.strToDate( _this.end_date.date );
					var timeDiff = Math.abs(sdate.getTime() - edate.getTime());
					return Math.ceil(timeDiff / (1000 * 3600 * 24)); 
                })();

				var itemGap = (function(){
					var eDate = new Date( _this.curDate );
					var sDate = new Date( _this.curDate );

					// 종료날짜가 기준인 경우
					if( !_this.sDateStandard ) {
						if( String( $item ).toUpperCase().indexOf( "Y" ) >= 0 ) {
							sDate.setFullYear( sDate.getFullYear() - parseInt( String( $item ).split( "Y" )[ 0 ] ) );
							sDate.setDate( eDate.getDate() + 1 );
						} else if( String( $item ).toUpperCase().indexOf( "M" ) >= 0 ) {
							sDate.setMonth( sDate.getMonth() - parseInt( String( $item ).split( "M" )[ 0 ] ) );
							sDate.setDate( eDate.getDate() + 1 );
						} else if( String( $item ).toUpperCase().indexOf( "TH" ) >= 0 ) {
							sDate.setDate( 1 );
                            sDate.setMonth( parseInt( String( $item ).split( "TH" )[ 0 ] ) - 1 );
                            eDate.setDate( 1 );
                            eDate.setMonth( parseInt( String( $item ).split( "TH" )[ 0 ] ) );
                            eDate.setDate( eDate.getDate() - 1 );
						} else {
							if( $item > 0 ) sDate.setDate( sDate.getDate() - ( parseInt( $item ) - 1 ) );
						}
					// 시작날짜가 기준인 경우
					} else {
						if( String( $item ).toUpperCase().indexOf( "Y" ) >= 0 ) {
							eDate.setFullYear( eDate.getFullYear() + parseInt( String( $item ).split( "Y" )[ 0 ] ) );
							eDate.setDate( eDate.getDate() - 1 );
						} else if( String( $item ).toUpperCase().indexOf( "M" ) >= 0 ) {
							eDate.setMonth( eDate.getMonth() + parseInt( String( $item ).split( "M" )[ 0 ] ) );
							eDate.setDate( eDate.getDate() - 1 );
						} else if( String( $item ).toUpperCase().indexOf( "TH" ) >= 0 ) {
							sDate.setDate( 1 );
                            sDate.setMonth( parseInt( String( $item ).split( "TH" )[ 0 ] ) - 1 );
                            eDate.setDate( 1 );
                            eDate.setMonth( parseInt( String( $item ).split( "TH" )[ 0 ] ) );
                            eDate.setDate( eDate.getDate() - 1 );
						} else {
							if( $item > 0 ) eDate.setDate( eDate.getDate() + ( parseInt( $item ) - 1 ) );
						}
					}
                    var timeDiff = Math.abs(sDate.getTime() - eDate.getTime());
					return Math.ceil(timeDiff / (1000 * 3600 * 24)); 
                })();

                if( String( $item ).toUpperCase().indexOf( "TH" ) >= 0 ) {
                    return calGap == itemGap && parseInt( this.start_date.date.split( "-" )[ 1 ] ) == parseInt( String( $item ).split( "TH" )[ 0 ] ) && parseInt( this.end_date.date.split( "-" )[ 1 ] ) == parseInt( String( $item ).split( "TH" )[ 0 ] )
                } else {
                    return calGap == itemGap 
                }

			},
			set_rePos: function(){
				if( this.active ) {
                    this.pos_top = $( this.$refs.input ).offset().top - $( document ).scrollTop() + $( this.$refs.input ).outerHeight();
                    this.pos_left = $( this.$refs.input ).offset().left - $( document ).scrollLeft();

                    if( this.pos_top + $( this.$refs.calendars ).outerHeight() > $( window ).height() ) this.pos_top -= $( this.$refs.calendars ).outerHeight() + $( this.$refs.input ).outerHeight() + 2;
                    if( this.pos_left + $( this.$refs.calendars ).outerWidth() > $( window ).width() ) this.pos_left -= $( this.$refs.calendars ).outerWidth() - $( this.$refs.input ).outerWidth();

                    if( this.pos_top < 0 ) this.pos_top = $( this.$refs.input ).offset().top - $( document ).scrollTop() + $( this.$refs.input ).outerHeight();
				}
            }
        },
        directives: {
            // 달력 Insereted
            init: {
                inserted: function ( el, binding, vnode ) {
                    vnode.context.set_rePos();
                }
            }
        }
    })
}());