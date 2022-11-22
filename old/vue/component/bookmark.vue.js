(function(){
    // HTML Template
    var template = ''
        + '<div class="dcp_bookmark">'
        + '    <input :id="id" type="checkbox" :value="val" v-model="checked" :disabled="disabled" @click="evt_click">'
        + '    <label :for="id" :title="checked ? \'관심해제\' : \'관심등록\'">'
        + '        <span class="icon">&#xe030;</span>'
        + '    </label>'
        + '</div>'

    // Component
    comp = Vue.component( "comp-bookmark", {
        template: template,
        data: function() {
            return {
            };
        },
        props: [ "id", "val", "value", "disabled", "click" ],
		computed: {
			checked: {
				get: function() {
					return this.value;
				},
				set: function( $val ) {
					this.$emit( 'input', $val );
				}
            }
        },
        methods: {
            evt_click: function( $e ){
                if( this.click ) eval( this.click )( $e );
            }
        }
    })
}());
