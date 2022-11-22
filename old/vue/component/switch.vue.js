(function(){
    // HTML Template
    var template = ''
        + '<div class="dcp_switch" :class="{ \'is-box\': box }">'
        //+ '    <input v-if="click" ref="checkbox" :id="id" type="checkbox" v-model="checked" :value="val" @change="evt_change" @click="evt_click" :disabled="disabled">'
        //+ '    <input v-else ref="checkbox" :id="id" type="checkbox" v-model="checked" :value="val" @change="evt_change" :disabled="disabled">'

        + '    <input v-if="radioGrp" :id="id" type="radio" :name="grp" v-model="checked" :value="val" :disabled="disabled" @click="evt_click">'
        + '    <input v-else :id="id" type="checkbox" v-model="checked" :value="val" :disabled="disabled" @click="evt_click">'

        + '    <label :for="id">'
        + '        <strong v-if="label" class="txt">{{ label }}</strong><div class="wrap"><span class="bg"></span><span class="anchor"></span></div>'
        + '    </label>'
        + '</div>'

    // Component
    comp = Vue.component( "comp-switch-btn", {
        template: template,
        data: function(){
			return {
				chk: false
			};
		},
		props: {
			id: String,
			val: String,
			value: {},
            label: String,
            click: Function,
            radioGrp: String,
            grp: String,
            box: { type: Boolean, default: false },
            disabled: Boolean
		},
		computed: {
			checked: {
				get: function() {
					return this.value;
				},
				set: function( $val ) {
                    this.$emit( "input" , $val );
				}
			}
		},
		watch: {
		},
		mounted: function(){
		},
		updated: function(){
		},
		methods: {
            evt_click: function( $e ){
                if( this.click ) this.click( $e );
            }
		}
    })
}());
