(function(){
    // HTML Template
    var template = ''
        + '<div class="ui_type_inputs">'
        + '    <comp-selectbox :id="id + \'_type\'" :opts="$store.state.Opts.KeywordSearchCondition" v-model="search_type" style="width:120px"></comp-selectbox>'
        + '    <comp-input-box :id="id + \'_input\'" class="is-wid100p" v-model="search_keywrod" placeholder="입력하세요." label="입력창" style="width:80%" :enterEvt="evt_key_enter"></comp-input-box>'
        + '</div>'

    // Component
    comp = Vue.component( "comp-search-type-keyword", {
        template: template,
        data: function() {
            return {
                search_type: "",
                search_keywrod: "",
            };
        },
        props: [ "id", "type", "keyword" ],
		watch: {
            search_type: function( $val ){
                this.$emit( "update:type", $val );
            },
            search_keywrod: function( $val ){
                this.$emit( "update:keyword", $val );
            }
        },
        methods: {
            evt_key_enter: function( $e ){
                this.$store.EventBus.$emit( "searchStart" );
            }
        }
    })
}());
