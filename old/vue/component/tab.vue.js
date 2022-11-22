(function(){
    // HTML Template
    var template = ''
        + '<div class="ui_tab">'
        + '    <ul>'
        + '        <li v-for="( item, idx ) in opts" v-bind:key="idx">'
        + '            <input :id="id + \'_\' + idx" type="radio" :name="id + \'_grp\'" :value="item.code" :disabled="item.disabled" v-model="selected">'
        + '            <label :for="id + \'_\' + idx"><span class="txt">{{ item.name }}</span></label>'
        + '        </li>'
        + '    </ul>'
        + '</div>'

    // Component
    comp = Vue.component( "comp-tab", {
        template: template,
        data: function(){
			return {
			};
		},
		props: [ "id", "value", "opts" ],
		computed: {
			selected: {
				get: function() {
					return this.value;
				},
				set: function( $val ) {
					this.$emit( "input" , String( $val ) );
				}
			},
		},
		created: function (){
		}
    })
}());
