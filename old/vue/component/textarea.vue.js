(function(){
    // HTML Template
    var template = ''
        + '<div ref="container" class="dcp textarea">'
        + '    <textarea :id="id" @input="val = $event.target.value" v-model="val" :disabled="disabled" :cols="cols" :rows="rows"></textarea>'
        + '</div>';

    // Component
    comp = Vue.component( "comp-textarea", {
        template: template,
        props: [ "id", "value", "disabled", "cols", "rows" ],
        computed: {
			val: {
				get: function() {
					return this.value;
				},
				set: function( $val ) {
					this.$emit( "input", $val );
				}
			},
			getLabel: function(){
				return this.label ? this.label : "입력"
            },
            getPlaceholder: function(){
                return this.disabled != undefined ? '입력불가' : this.$vnode.data.attrs.placeholder;
            }
		}
    })
}());
