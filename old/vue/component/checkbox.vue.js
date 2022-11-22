(function(){
    // HTML Template
    var template = ''
        + '<div class="dcp checkbox" :class="{ \'is-btn\' : btn, \'is-box\' : box, \'is-not-label\': !label }">'
        + '    <input v-if="click" :id="id" type="checkbox" :data-grp="grp" :value="val" v-model="checked" :disabled="disabled" @click="evt_click">'
        + '    <input v-else :id="id" type="checkbox" :data-grp="grp" :value="val" v-model="checked" :disabled="disabled">'
        + '    <label :for="id">'
        + '        <span class="icon"></span>'
        + '        <span class="txt" :style="getStyle">{{ label }}</span>'
        + '    </label>'
        + '</div>'

    // Component
    comp = Vue.component( "comp-checkbox", {
        template: template,
        data: function() {
            return {
            };
        },
        props: [ "id", "grp", "val", "value", "label", "disabled", "click", "btn", "box" ],
		computed: {
			checked: {
				get: function() {
					return this.value;
				},
				set: function( $val ) {
					this.$emit( 'input', $val );
				}
            },
            getStyle: function(){
                return this.$vnode.data.style ? this.$vnode.data.style : "";
            }
        },
        methods: {
            evt_click: function( $e ){
                eval( this.click )( $e );
            }
        }
    })
}());
