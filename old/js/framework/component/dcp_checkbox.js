var comp_chkbox = {
	template:"\
		<div class='dcp'><input :id='id' type='checkbox' :class='{allChecker: allChecker}' :data-grp='grp' :value='val' v-model='checked' @change='evt_change'><label :for='id'><strong></strong></label></div>\
	",
	data: function(){
		return {
			chk: false
		};
	},
	props: [ "id", "grp", "val", "value", "vm", "allChecker" ],
	computed: {
		checked: {
			get: function() {
				return this.value;
			},
			set: function( $val ) {
				this.chk = $val;
			}
		}
	},
	watch: {
	},
	methods: {
		evt_change: function( $val){
			var _this = this;
			this.$emit( 'input', this.chk )

			if( this.allChecker ) {
				var selected = [];
				if( this.chk ){
					$( "input[data-grp='" + this.grp + "']" ).not( '.allChecker' ).each( function(){
						selected.push( $( this ).val() );
					});
					this.$emit( "update:vm", selected );
				} else {
					this.$emit( "update:vm", selected );
				}
			} else {
				var chk = true;
				$( "input[data-grp='" + this.grp + "']" ).not( '.allChecker' ).each( function(){
					if( !this.checked ) chk = false;
				});

				$( "input[data-grp='" + this.grp + "'].allChecker" )[ 0 ].checked = chk;

			}
		}
	}
};