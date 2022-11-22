var comp_dcp_select = {
	template:"\
		<div class='dcp' :class='add_class'>\
			<select :id='id' :class='add_class' v-model='selected'>\
				<option v-for='opt in opts' :value='opt.value' v-text='opt.text'></option>\
			</select>\
			<label :for='id' v-text='selected_txt'></label>\
		</div>\
	",
	props: [ "id", "add_class", "value", "opts" ],
	data: function(){
		return {
		};
	},
	computed: {
		selected: {
			get: function() {
				if( this.value == "" ) {
					this.$emit( "input" , this.opts[ 0 ].value );
				}
				return this.value;
			},
			set: function( $val ) {
				this.$emit( "input" , $val );
			}
		},
		selected_txt: function(){
			var result;
			var _this = this;
			this.opts.filter( function( a ){
				if( a.value == _this.selected ){
					result = a.text;
				}
			});
			return result;
		}
	},
	created: function (){
	},
	mounted: function (){
	},
	watch: {
	},
	methods: {
	}
};