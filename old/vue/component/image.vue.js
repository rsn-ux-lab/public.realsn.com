(function(){
    // HTML Template
    var template = ''
        + '<div class="ui_image" :class="[ { \'is-no-image\': error }, { \'is-background\': background } ]">'
        + '    <span v-if="background" class="background" :style="background ? ( \'background-image:url(\' + src + \')\' ) : \'\'"></span>'
        + '    <img :src="src" @error="evt_error">'
        + '</div>'

    // Component
    comp = Vue.component( "comp-image", {
        template: template,
        data: function() {
            return {
                error: false
            };
        },
        props: [ "src", "background" ],
        watch: {
            src: function( $val ) {
                this.error = false;
            }
        },
        methods: {
            evt_error: function( $e ){
                this.error = true;
            }
        }
    })
}());
