(function(){
    // HTML Template
    var template = ''
        + '<div id="locator" class="ui_location" :class="{ \'is-no-topsearchs\' : !topSearchEnabled }">'
        + '    <div class="wrap">'
        + '        <div class="inner_wrap">'
        + '            <template v-for="item in $store.state.CurGnbLocation">'
        + '                <a class="item ui_lnk" :href="item.href"><span class="txt">{{ item.name }}</span></a>'
        + '            </template>'
        + '            <slot></slot>'
        + '        </div>'
        + '    </div>'
        + '</div>'

    // Component
    var comp = Vue.component( "comp-location", {
        template: template,
        data: function() {
            return {
                gnbDatas: [],
                topSearchEnabled: true
            };
        },
        mounted: function(){
            if( $( ".top_searchs" ).length <= 0 ) {
                this.topSearchEnabled = false;
            }
        }
    })
}());
