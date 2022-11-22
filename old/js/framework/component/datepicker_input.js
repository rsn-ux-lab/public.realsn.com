var comp_datepicker_input = {
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
				<div v-if='active'>\
					<datepicker :id='id' :date.sync='this_date' :mindate='min_date' :maxdate='max_date'></datepicker>\
				</div>\
			</transition>\
		</div>\
	",
	data: function(){
		return {
			active: false,
			this_date: this.date,
			start_active: false,
			end_active: false
		};
	},
	props: {
		id : { type: String },
		date : { type: String },
		min_date : { type: String },
		max_date : { type: String },
		month_move : { type: Boolean, default : false }
	},
	components: {
		"datepicker": comp_datepicker
	},
	mounted: function (){
		this.start_active = ( this.date == this.min_date ) ? false : true;
		this.end_active = ( this.date == this.max_date ) ? false : true;
	},
	computed: {
		render_date: function(){
			return this.date;
		}
	},
	watch: {
		date: function( $date ){
			this.start_active = ( this.date == this.min_date ) ? false : true;
			this.end_active = ( this.date == this.max_date ) ? false : true;
			this.this_date = $date;
		},
		this_date: function( $date ){
			this.$emit( "update:date", this.$root.$options.filters.dateToStr( $date ) );
		},
		active: function( $val ){
			if( $val ) document.addEventListener( "click", this.documentClick );
			else document.removeEventListener( "click", this.documentClick );
		}
	},
	methods: {
		prev_month: function(){
			var tmp_date = new Date( this.date );
			tmp_date.setMonth( tmp_date.getMonth() - 1 );
			if( tmp_date < new Date( this.min_date ) ) tmp_date = new Date( this.min_date );
			this.this_date = tmp_date.getFullYear() + "-" + ( tmp_date.getMonth() + 1 ) + "-" + tmp_date.getDate();
		},
		next_month: function(){
			var tmp_date = new Date( this.date );
			tmp_date.setMonth( tmp_date.getMonth() + 1 );
			if( tmp_date > new Date( this.max_date ) ) tmp_date = new Date( this.max_date );
			this.this_date = tmp_date.getFullYear() + "-" + ( tmp_date.getMonth() + 1 ) + "-" + tmp_date.getDate();
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