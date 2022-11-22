(function(){
    // HTML Template
    var template = ''
        + '<div ref="container" class="dcp inputBox">'
        + '    <div v-if="( min == null || min == undefined ) && ( max == null || max == undefined )" class="input">'
        + '        <input :type="type" :id="id" :name="name" ref="input" @input="val = $event.target.value" v-model="val" @keyup.enter="evt_keyup_enter" :class="$vnode.data.staticClass" autocomplete="off" :disabled="disabled" :readonly="readonly" :placeholder="getPlaceholder" :min="min" :max="max"><label :for="id" class="ui_invisible">{{ getLabel }}</label>'
        + '    </div>'
        + '    <div v-else class="input">'
        + '        <input :type="type" :id="id" :name="name" ref="input" @input="val = $event.target.value" v-model.numberRange="val" @keypress="evt_keypress" @keyup.enter="evt_keyup_enter" :class="$vnode.data.staticClass" autocomplete="off" :disabled="disabled" :readonly="readonly" :placeholder="getPlaceholder" :min="min" :max="max"><label :for="id" class="ui_invisible">{{ getLabel }}</label>'
        + '    </div>'
        + '</div>'

    // Component
    comp = Vue.component( "comp-input-box", {
        template: template,
        data: function() {
            return {
                inputTxt: ""
            };
        },
        props: [ "id", "name", "value", "type", "disabled", "label", "readonly", "enterEvt", "min", "max" ],
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
		},
        created: function (){
		},
		mounted: function (){
		},
		watch: {
		},
		methods: {
            evt_keypress: function( $e ){
                if( $e.keyCode == 43 || $e.keyCode == 45 ) {
                    $e.preventDefault();
                }
            },
            evt_keyup_enter: function( $e ){
                if( this.enterEvt ) this.enterEvt( $e );
            }
        },
        directives: {
            model: {
                update: function ( $el, $binding, $vnode ) {
                    if ( $binding.modifiers.numberRange ) {
                        var result = String( $binding.value ).replace(/[^0-9]/g,'');
                        if( $vnode.data.attrs.max && Number( result ) > $vnode.data.attrs.max ) {
                            result = $vnode.data.attrs.max;
                        }
                        $vnode.context[ $binding.expression ] = result;
                        $el.value = result;
                    }
                }
            }
        }
    })
}());
