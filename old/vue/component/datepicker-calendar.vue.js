(function(){
    // HTML Template
    var template = ''
		+ '<div class="ui_calendar" :class="{\'is-time\': getTimeUse}">'
        + '    <div class="date_wrap">'
        + '        <div class="date">{{ getDate_date | numAddZero }}</div>'
        + '        <div class="year_month">{{ getDate_year }}.{{ getDate_month | numAddZero }}</div>'
        + '        <div class="day">{{ getDate_day }}요일</div>'
        + '    </div>'
        + '    <div ref="dp_wrap" class="calendar_wrap"></div>'
		+ '    <div class="time_wrap" v-if="getTimeUse">'
		+ '        <comp-timepicker :id="id + \'tpc\'" v-model="value.time" :box_mode="true" :minutes_set="minuteEdit" :seconds_set="secondEdit"></comp-timepicker>'
        + '    </div>'
        + '    <div class="btns_grp">'
        + '        <div class="lc">'
        + '            <button type="button" class="ui_btn is-icon-only is-small" title="이전년도" @click.prevent="prev_year()" :disabled="getPrevYearDisabled"><span class="icon">&#xe003;</span></button>'
        + '            <button type="button" class="ui_btn is-icon-only is-small" title="이전달" @click.prevent="prev_month()" :disabled="getPrevMonthDisabled"><span class="icon">&#xe001;</span></button>'
        + '        </div>'
        + '        <div class="rc">'
        + '            <button type="button" class="ui_btn is-icon-only is-small" title="다음달" @click.prevent="next_month()" :disabled="getNextMonthDisabled"><span class="icon">&#xe000;</span></button>'
        + '            <button type="button" class="ui_btn is-icon-only is-small" title="다음년도" @click.prevent="next_year()" :disabled="getNextYearDisabled"><span class="icon">&#xe002;</span></button>'
        + '        </div>'
        + '    </div>'
        + '</div>'

    // Component
    comp = Vue.component( "datepicker-calendar", {
        template: template,
        data: function(){
			return {
				dp: null,
				date_mtd: new Date( this.$options.filters.dateToStr( this.date ) ),
				data_months: [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ],
                data_days: [ "일", "월", "화", "수", "목", "금", "토" ]
			};
		},
		props: [ "id", "value", "mindate", "maxdate", "hgt", "minuteEdit", "secondEdit" ],
		computed: {
			date: {
				get: function() {
                    var hgt = 0;
                    $( this.$el ).find( "> *:not(.time_wrap)" ).each( function(){
                        hgt += $( this ).outerHeight();
                    })
                    this.$emit( "update:hgt", hgt + Math.random() );
					return this.value;
				},
				set: function( $val ) {
					this.$emit( "input", $val );
				}
			},
			getTimeUse: function(){
				return this.date.time ? true : false;
			},
			getDate: function(){
				return this.date.date;
			},
			getTime: function(){
				return this.date.time ? this.date.time : "";
			},
			getDate_year: function(){
				var tmp = new Date( this.getDate );
				return tmp.getFullYear();
			},
			getDate_month: function(){
				var tmp = new Date( this.getDate );
				return tmp.getMonth() + 1;
			},
			getDate_date: function(){
				var tmp = new Date( this.getDate );
				return tmp.getDate();
			},
			getDate_day: function(){
				var tmp = new Date( this.getDate );
				return this.data_days[ tmp.getDay() ];
			},
			getPrevYearDisabled: function(){
				return new Date( this.getDate ).getFullYear() == new Date( this.mindate ).getFullYear();
			},
			getPrevMonthDisabled: function(){
				return new Date( this.getDate ).getFullYear() == new Date( this.mindate ).getFullYear() && new Date( this.getDate ).getMonth() == new Date( this.mindate ).getMonth();
			},
			getNextMonthDisabled: function(){
				return new Date( this.getDate ).getFullYear() == new Date( this.maxdate ).getFullYear() && new Date( this.getDate ).getMonth() == new Date( this.maxdate ).getMonth();
			},
			getNextYearDisabled: function(){
				return new Date( this.getDate ).getFullYear() == new Date( this.maxdate ).getFullYear();
			}
		},
		mounted: function(){
            this.dp = $( this.$refs.dp_wrap );
			this.dp.datepicker({
				dateFormat: "yy-mm-dd",
				monthNames: this.data_months,
				dayNamesMin: this.data_days,
				minDate: this.mindate,
				maxDate: this.maxdate,
				onSelect: this.dp_Select,
            }).datepicker( "setDate", this.getDate );
            this.$emit( "update:hgt", $( this.$el ).outerHeight() );
		},
		watch: {
			date: {
				handler: function( $val ) {
					this.date_mtd = new Date( $val.date );
					this.dp.datepicker( "setDate", $val.date );
				},
				deep: true
			},
			calTime: function( $val ) {
				this.date = {
					date: this.getDate,
					time: this.$options.filters.numAddZero( $val ) + ":00:00"
				}
			},
			mindate: function( $val ){
				if( $val ) this.dp.datepicker( "option", "minDate", $val );
			},
			maxdate: function( $val ){
				if( $val ) this.dp.datepicker( "option", "maxDate", $val );
			}
		},
		methods: {
			dp_Select: function( $date ){
                var tmp = {
                    date: $date
                }
                if( this.getTimeUse ) tmp.time = this.getTime;
				this.date = tmp;
			},
			prev_year: function( $e ){
                this.dp.datepicker( "setDate", "c-1y" );
                var tmp = {
                    date: this.$options.filters.dateToStr( this.dp.datepicker( "getDate" ) )
                }
                if( this.getTimeUse ) tmp.time = this.getTime;
                this.date = tmp;
			},
			prev_month: function( $e ){
                this.dp.datepicker( "setDate", "c-1m" );
                var tmp = {
                    date: this.$options.filters.dateToStr( this.dp.datepicker( "getDate" ) )
                }
                if( this.getTimeUse ) tmp.time = this.getTime;
                this.date = tmp;
			},
			next_year: function( $e ){
                this.dp.datepicker( "setDate", "c+1y" );
                var tmp = {
                    date: this.$options.filters.dateToStr( this.dp.datepicker( "getDate" ) )
                }
                if( this.getTimeUse ) tmp.time = this.getTime;
                this.date = tmp;
			},
			next_month: function( $e ){
                this.dp.datepicker( "setDate", "c+1m" );
                var tmp = {
                    date: this.$options.filters.dateToStr( this.dp.datepicker( "getDate" ) )
                }
                if( this.getTimeUse ) tmp.time = this.getTime;
                this.date = tmp;
			}
		}
    })
}());