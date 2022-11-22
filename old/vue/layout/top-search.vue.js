(function(){
    // HTML Template
    var template = ''
        + '<div class="top_searchs" ref="wrap" :class="[{ \'is-expanded\': $store.state.TopSearchExpanded }, { \'no-result\': hasResultsSlot }]">'
        + '    <div class="wrap">'
        + '        <slot name="searchs"></slot>'
        + '        <button type="button" class="ui_btn is-large is-color-hl" @click="searching"><span class="txt">검색</span></button>'
        + '    </div>'
        + '</div>'

    // Component
    var comp = Vue.component( "comp-topsearch", {
        template: template,
        data: function() {
            return {
                space: 0
            };
        },
        props: [ "searchInputDatas", "searchDatas" ],
        computed: {
            hasResultsSlot: function() {
                return !!this.$slots[ 'results' ];
            }
		},
        mounted: function(){
            this.$emit( 'update:searchDatas', JSON.parse( JSON.stringify( this.searchInputDatas ) ) );
        },
        methods: {
            searching: function(){
                this.$emit( 'update:searchDatas', JSON.parse( JSON.stringify( this.searchInputDatas ) ) );
            }
        }
    })
}());
