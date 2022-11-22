(function(){
    // HTML Template
    var template = ''
        + '<div class="ui_table_sort">'
        + '    <div class="up">'
        + '        <input :id="name + \'_\' + id + \'_up\'" type="radio" :name="name" v-model="checked" :value="name + \'_\' + id + \'_up\'"></input>'
        + '        <label :for="name + \'_\' + id + \'_up\'"></label>'
        + '    </div>'
        + '    <div class="dn">'
        + '        <input :id="name + \'_\' + id + \'_dn\'" type="radio" :name="name" v-model="checked" :value="name + \'_\' + id + \'_dn\'"></input>'
        + '        <label :for="name + \'_\' + id + \'_dn\'"></label>'
        + '    </div>'
        + '</div>'

    // Component
    comp = Vue.component( "table-sort", {
        template: template,
        props: [ "id", "name", "value" ],
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
		mounted: function() {
            $( this.$el ).parent().addClass( "has-sort" );
        },
        methods: {
        }
    })
}());