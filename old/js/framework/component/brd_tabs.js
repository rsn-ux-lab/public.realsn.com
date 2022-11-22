var comp_brd_tabs = {
	template:"\
		<div class='ui_tab'>\
			<ul>\
				<li v-for='( data, idx ) in datas'>\
					<input :id='id + \"_\" + idx' type='radio' :name='id' :value='data.value' v-model='sel_val'><label :for='id + \"_\" + idx'>{{ data.text }}</label>\
				</li>\
			</ul>\
		</div>\
	",
	data: function(){
		return {
			sel_val: this.sel_idx
		};
	},
	props: [ "id", "datas", "sel_idx" ],
	mounted: function (){
	},
	watch: {
		sel_idx: function( $val ){
			$( this.$el ).find( "input[value='" + $val + "']" )[ 0 ].checked = true;
			this.sel_val = $val;
		},
		sel_val: function( $val ){
			this.$emit( "update:sel_idx", $val );
		}
	},
	methods: {
		
	}
};