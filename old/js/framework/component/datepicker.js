var comp_datepicker = {
	template:"\
		<div class='ui_calendar'>\
			<div class='day' v-text='date_day'></div>\
			<div class='date_wrap'>\
				<div class='month' v-text='date_month'></div>\
				<div class='date' v-text='date_date'></div>\
				<div class='year' v-text='date_year'></div>\
			</div>\
			<div ref='dp_wrap' class='calendar_wrap'></div>\
			<div class='time_wrap' v-if='time'>\
				<strong>시간</strong>\
				<div class='wrap'>\
					<dcp_select :id='idx + \"_hour\"' :opts='time_hour' :selected.sync='sel_time_hour'></dcp_select>\
					<dcp_select :id='idx + \"_min\"' :opts='time_min' :selected.sync='sel_time_min'></dcp_select>\
				</div>\
			</div>\
			<div class='btns_grp'>\
				<button class='btn_prv_y' title='이전년도' @click.prevent='prev_year()'><span class='icon'>이전년도</span></button>\
				<button class='btn_prv_m' title='이전달' @click.prevent='prev_month()'><span class='icon'>이전월</span></button>\
				<button class='btn_nxt_m' title='다음달' @click.prevent='next_month()'><span class='icon'>다음월</span></button>\
				<button class='btn_nxt_y' title='다음년도' @click.prevent='next_year()'><span class='icon'>다음년도</span></button>\
			</div>\
		</div>\
	",
	data: function(){
		return {
			dp: null,
			date_mtd: new Date( this.date ),
			data_months: [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ],
			data_days: [ "일", "월", "화", "수", "목", "금", "토" ],
			sel_time_hour: this.time ? this.time.split( ":" )[ 0 ] : null,
			sel_time_min: this.time ? this.time.split( ":" )[ 1 ] : null,
			time_hour: [
				{ value: "00", text: "00시" },
				{ value: "01", text: "01시" },
				{ value: "02", text: "02시" },
				{ value: "03", text: "03시" },
				{ value: "04", text: "04시" },
				{ value: "05", text: "05시" },
				{ value: "06", text: "06시" },
				{ value: "07", text: "07시" },
				{ value: "08", text: "08시" },
				{ value: "09", text: "09시" },
				{ value: "10", text: "10시" },
				{ value: "11", text: "11시" },
				{ value: "12", text: "12시" },
				{ value: "13", text: "13시" },
				{ value: "14", text: "14시" },
				{ value: "15", text: "15시" },
				{ value: "16", text: "16시" },
				{ value: "17", text: "17시" },
				{ value: "18", text: "18시" },
				{ value: "19", text: "19시" },
				{ value: "20", text: "20시" },
				{ value: "21", text: "21시" },
				{ value: "22", text: "22시" },
				{ value: "23", text: "23시" }
			],
			time_min: [
				{ value: "00", text: "00분" },
				{ value: "01", text: "01분" },
				{ value: "02", text: "02분" },
				{ value: "03", text: "03분" },
				{ value: "04", text: "04분" },
				{ value: "05", text: "05분" },
				{ value: "06", text: "06분" },
				{ value: "07", text: "07분" },
				{ value: "08", text: "08분" },
				{ value: "09", text: "09분" },
				{ value: "10", text: "10분" },
				{ value: "11", text: "11분" },
				{ value: "12", text: "12분" },
				{ value: "13", text: "13분" },
				{ value: "14", text: "14분" },
				{ value: "15", text: "15분" },
				{ value: "16", text: "16분" },
				{ value: "17", text: "17분" },
				{ value: "18", text: "18분" },
				{ value: "19", text: "19분" },
				{ value: "20", text: "20분" },
				{ value: "21", text: "21분" },
				{ value: "22", text: "22분" },
				{ value: "23", text: "23분" },
				{ value: "24", text: "24분" },
				{ value: "25", text: "25분" },
				{ value: "26", text: "26분" },
				{ value: "27", text: "27분" },
				{ value: "28", text: "28분" },
				{ value: "29", text: "29분" },
				{ value: "30", text: "30분" },
				{ value: "31", text: "31분" },
				{ value: "32", text: "32분" },
				{ value: "33", text: "33분" },
				{ value: "34", text: "34분" },
				{ value: "35", text: "35분" },
				{ value: "36", text: "36분" },
				{ value: "37", text: "37분" },
				{ value: "38", text: "38분" },
				{ value: "39", text: "39분" },
				{ value: "40", text: "40분" },
				{ value: "41", text: "41분" },
				{ value: "42", text: "42분" },
				{ value: "43", text: "43분" },
				{ value: "44", text: "44분" },
				{ value: "45", text: "45분" },
				{ value: "46", text: "46분" },
				{ value: "47", text: "47분" },
				{ value: "48", text: "48분" },
				{ value: "49", text: "49분" },
				{ value: "50", text: "50분" },
				{ value: "51", text: "51분" },
				{ value: "52", text: "52분" },
				{ value: "53", text: "53분" },
				{ value: "54", text: "54분" },
				{ value: "55", text: "55분" },
				{ value: "56", text: "56분" },
				{ value: "57", text: "57분" },
				{ value: "58", text: "58분" },
				{ value: "59", text: "59분" }
			]
		};
	},
	props: [ "id", "date", "mindate", "maxdate", "time"  ],
	components: {
		"dcp_select": comp_dcp_select
	},
	mounted: function (){
		this.dp = $( this.$refs.dp_wrap );
		this.dp.datepicker({
			dateFormat: "yy-mm-dd",
			monthNames: this.data_months,
			dayNamesMin: this.data_days,
			minDate: this.mindate,
			maxDate: this.maxdate,
			onSelect: this.dp_Select,
		}).datepicker( "setDate", this.date );
	},
	computed: {
		idx: function(){
			return this.id + "_" + parseInt( Math.random() * 1000000 );
		},
		date_year: function(){
			return this.date_mtd.getFullYear();
		},
		date_month: function(){
			return new Date( this.date_mtd ).getMonth() + 1;
		},
		date_date: function(){
			return this.date_mtd.getDate();
		},
		date_day: function(){
			return this.data_days[ this.date_mtd.getDay() ];
		}
	},
	watch: {
		date: function( $val ){
			this.dp.datepicker( "option", "minDate", null );
			this.dp.datepicker( "option", "maxDate", null );
			this.date_mtd = new Date( $val );
			this.dp.datepicker( "setDate", $val );
			this.dp.datepicker( "option", "minDate", this.mindate );
			this.dp.datepicker( "option", "maxDate", this.maxdate );
		},
		mindate: function( $val ){
			if( $val ) this.dp.datepicker( "option", "minDate", $val );
		},
		maxdate: function( $val ){
			if( $val ) this.dp.datepicker( "option", "maxDate", $val );
		},
		sel_time_hour: function(){
			this.time_update();
		},
		sel_time_min: function(){
			this.time_update();
		}
	},
	methods: {
		dp_Select: function( $date ){
			this.$emit( "update:date", $date );
		},
		prev_year: function( $e ){
			var tmp = new Date( this.date_mtd );
			tmp.setYear( new Date( this.date_mtd ).getFullYear() - 1 );
			this.dp.datepicker( "setDate", tmp );
			this.$emit( 'update:date', this.dp.datepicker( "getDate" ).getFullYear() + "-" + ( this.dp.datepicker( "getDate" ).getMonth() + 1 ) + "-" + this.dp.datepicker( "getDate" ).getDate() );
		},
		prev_month: function( $e ){
			var tmp = new Date( this.date_mtd );
			tmp.setMonth( new Date( this.date_mtd ).getMonth() - 1 );
			this.dp.datepicker( "setDate", tmp );
			this.$emit( 'update:date', this.dp.datepicker( "getDate" ).getFullYear() + "-" + ( this.dp.datepicker( "getDate" ).getMonth() + 1 ) + "-" + this.dp.datepicker( "getDate" ).getDate() );
		},
		next_year: function( $e ){
			var tmp = new Date( this.date_mtd );
			tmp.setYear( new Date( this.date_mtd ).getFullYear() + 1 );
			this.dp.datepicker( "setDate", tmp );
			this.$emit( 'update:date', this.dp.datepicker( "getDate" ).getFullYear() + "-" + ( this.dp.datepicker( "getDate" ).getMonth() + 1 ) + "-" + this.dp.datepicker( "getDate" ).getDate() );
		},
		next_month: function( $e ){
			var tmp = new Date( this.date_mtd );
			tmp.setMonth( new Date( this.date_mtd ).getMonth() + 1 );
			this.dp.datepicker( "setDate", tmp );
			this.$emit( 'update:date', this.dp.datepicker( "getDate" ).getFullYear() + "-" + ( this.dp.datepicker( "getDate" ).getMonth() + 1 ) + "-" + this.dp.datepicker( "getDate" ).getDate() );
		},
		time_update: function(){
			if( this.time ) this.$emit( "update:time", this.sel_time_hour + ":" + this.sel_time_min );
		}
	}
};