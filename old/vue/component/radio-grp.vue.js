(function(){
    var template = ''
    + '<div class="dcp_radios" :class="{ \'is-grp\' : grp || box }">'
    + '     <comp-radio v-for="( item, idx ) in opts" :class="[ $vnode.data.staticClass, { \'is-grp\' : grp || box  } ]" :key="item.id" :name="name" :label="item.name" v-model="checked" :val="item.code" :id="id + \'_\' + idx" :btn="true" :disabled="item.disabled"></comp-radio>'
    + '</div>'

    Vue.component( "comp-radio-grp", {
        template : template,
        data : function(){
            return {
            }
        },
        props: [ "id", "val", "value", "name", "disabled", "label", "grp", "box", "opts" ],
        computed: {
            checked: {
				get: function() {
					return this.value;
				},
				set: function( $val ) {
                    this.$emit( 'input', $val );
				}
            }
        }
    })

}());