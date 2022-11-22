var comp_datepicker_range = {
	template:"\
		<div class='ui_datepicker_range'>\
			<div class='input_wrap'>\
				<button type='button' class='btn_month btn_prv_month' v-if='month_move' :class='{ui_disabled : !start_active}' title='이전달' @click='prev_month()'><span>이전달</span></button>\
				<div class='input' @click='active = !active'>\
					<input :id='id' type='text' class='date_result' :class='{active: active}' readonly :value='render_date'><label :for='id' @click='active = !active'>검색기간</label>	\
				</div>\
				<button type='button' class='btn_month btn_nxt_month' v-if='month_move' :class='{ui_disabled : !end_active}' title='다음달' @click='next_month()'><span>다음달</span></button>\
			</div>\
			<transition name='fade'>\
				<div ref='calendars' class='calendars pos_r' v-if='active'>\
					<div class='calendars_container'>\
						<div class='wrap'>\
							<div class='dp_wrap searchs_dp_start'>\
								<datepicker :id='id' :date.sync='start_date' :mindate='min_date' :maxdate='e_date' :time.sync='start_time'></datepicker>\
							</div>\
							<div class='dp_wrap searchs_dp_end'>\
								<datepicker :id='id' :date.sync='end_date' :mindate='s_date' :maxdate='max_date' :time.sync='end_time'></datepicker>\
							</div>\
						</div>\
					</div>\
				</div>\
			</transition>\
			<ul class='ui_date_grp' v-if='date_grp.length > 0'>\
				<li v-for='item in date_grp'><button type='button'><span v-text='item + \"일\"'></span></button></li>\
			</ul>\
		</div>\
	",
	data: function(){
		return {
			active: false,
			start_date: this.s_date,
			end_date: this.e_date,
			start_time: this.s_time ? this.s_time : null,
			end_time: this.e_time ? this.e_time : null,
			start_active: false,
			end_active: false,
			min_date_fix: null
		};
	},
	props: {
		id: { type: String },
		s_date: { type: String },
		e_date: { type: String },
		s_time: { type: String },
		e_time: { type: String },
		min_date: { type: String },
		max_date: { type: String },
		date_grp: { type: Array },
		month_move: { type: Boolean, default : false },
	},
	components: {
		"datepicker": comp_datepicker
	},
	created: function(){
		this.min_date_fix = this.min_date;
	},
	mounted: function (){
		this.$root.$options.filters.dateToStr( this.start_date ) == this.min_date ? this.start_active = false : this.start_active = true;
		this.$root.$options.filters.dateToStr( this.end_date ) == this.max_date ? this.end_active = false : this.end_active = true;
	},
	computed: {
		render_date: function(){
			return this.s_date + " ~ " + this.e_date;
		},
		date_gap: function(){
			return ( new Date( this.e_date ) - new Date( this.s_date ) ) / 1000 / 60 / 60 / 24;
		}
	},
	watch: {
		s_date: function( $date ){
			this.start_date = $date;
		},
		e_date: function( $date ){
			this.end_date = $date;
		},
		start_date: function( $date ){
			this.$root.$options.filters.dateToStr( $date ) == this.min_date ? this.start_active = false : this.start_active = true;
			this.$emit( "update:s_date", this.$root.$options.filters.dateToStr( $date ) );
		},
		end_date: function( $date ){
			this.$root.$options.filters.dateToStr( $date ) == this.max_date ? this.end_active = false : this.end_active = true;
			this.$emit( "update:e_date", this.$root.$options.filters.dateToStr( $date ) );
		},
		start_time: function( $time ){
			if( this.start_time ) this.$emit( "update:s_time", $time );
		},
		end_time: function( $time ){
			if( this.end_time ) this.$emit( "update:e_time", $time );
		},
		active: function( $val ){
			if( $val ) document.addEventListener( "click", this.documentClick );
			else document.removeEventListener( "click", this.documentClick );
		}
	},
	methods: {
		prev_month: function(){
			var tmp_s_date = new Date( this.start_date );
			tmp_s_date.setMonth( tmp_s_date.getMonth() - 1 );
			tmp_s_date.setDate( 1 );
			var result_s_date = new Date( this.min_date );
			if( tmp_s_date < result_s_date ) tmp_s_date = new Date( result_s_date );
			this.start_date = tmp_s_date.getFullYear() + "-" + ( tmp_s_date.getMonth() + 1 ) + "-" + tmp_s_date.getDate();

			var tmp_e_date = new Date( tmp_s_date );
			tmp_e_date.setMonth( tmp_e_date.getMonth() + 1 );
			tmp_e_date.setDate( tmp_e_date.getDate() - 1 );
			var result_e_date = new Date( this.min_date );
			if( tmp_e_date < result_e_date ) tmp_e_date = new Date( result_e_date );
			this.end_date = tmp_e_date.getFullYear() + "-" + ( tmp_e_date.getMonth() + 1 ) + "-" + tmp_e_date.getDate();
		},
		next_month: function(){
			var tmp_s_date = new Date( this.start_date );
			tmp_s_date.setMonth( tmp_s_date.getMonth() + 1 );
			var result_s_date = new Date( this.max_date );
			if( tmp_s_date > result_s_date ) tmp_s_date = new Date( result_s_date );
			tmp_s_date.setDate( 1 );
			this.start_date = tmp_s_date.getFullYear() + "-" + ( tmp_s_date.getMonth() + 1 ) + "-" + tmp_s_date.getDate();

			var tmp_e_date = new Date( tmp_s_date );
			tmp_e_date.setMonth( tmp_e_date.getMonth() + 1 );
			tmp_e_date.setDate( tmp_e_date.getDate() - 1 );
			var result_e_date = new Date( this.max_date );
			if( tmp_e_date > result_e_date ) tmp_e_date = new Date( result_e_date );
			this.end_date = tmp_e_date.getFullYear() + "-" + ( tmp_e_date.getMonth() + 1 ) + "-" + tmp_e_date.getDate();
		},
		documentClick: function( $e ){
			var el = this.$el;
			var target = $e.target
			if ( el !== target && !el.contains( target ) ) {
				this.active = false;
			}
		}
	}
};