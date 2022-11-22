var comp_datepicker_range_select = {
	template:"\
		<div class='ui_datepicker_range_select'>\
			<div class='input_wrap'><div class='input' v-text='render_date'></div></div>\
			<ul class='ui_date_grp' v-if='date_grp.length > 0'>\
				<li v-for='(item, idx ) in date_grp'><input :id='this.id + \"_\" + idx' type='radio' name='this.id' :value='item' v-model='selected'><label :for='this.id + \"_\" + idx'><span v-text='item + \"일\"'></span></label></li>\
			</ul>\
		</div>\
	",
	data: function(){
		return {
			sDate: new Date( this.edate ),
			eDate: new Date( this.edate ),
			selected: this.value
		};
	},
	props: {
		value: { type: Number },
		id: { type: String },
		sdate: { type: String },
		edate: { type: String },
		date_grp: { type: Array }
	},
	computed: {
		render_date: function(){
			var sd = this.$options.filters.dateToStr( this.sDate );
			var ed = this.$options.filters.dateToStr( this.eDate );
			this.$emit( "update:sdate", sd );
			this.$emit( "update:edate", ed );
			return sd + " ~ " + ed;
		},
		date_gap: function(){
			return ( new Date( this.e_date ) - new Date( this.s_date ) ) / 1000 / 60 / 60 / 24;
		}
	},
	components: {
	},
	created: function(){
	},
	mounted: function (){
		
	},
	watch: {
		selected: function( $val ){
			this.$emit( "input", $val );
		},
		value: function( $val ){
			this.sDate = new Date( this.sDate.setDate( this.eDate.getDate() - ( $val - 1 ) ) );
		}
	},
	methods: {
	}
};