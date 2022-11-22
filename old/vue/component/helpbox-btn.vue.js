(function(){
    // HTML Template
    var template = ''
        + '<div class="ui_helpbox_btn">'
        + '    <input ref="input" :id="id" type="checkbox" v-model="checked">'
        + '    <label :for="id" class="icon" :title="\'도움말 \' + ( checked ? \'닫기\' : \'열기\' )">&#xe006;</label>'
        + '</div>'

    // Component
    comp = Vue.component( "comp-helpbox-btn", {
        template: template,
        data: function(){
			return {
                checked: this.$store.state.HelperEnable
			};
		},
		props: {
			id: String
		},
        created: function(){
        },
        mounted: function(){
            var idx = $( this.$el ).parent().children().length - 1 - $( this.$el ).parent().children().index( this.$el );
            var helpBox = $( ".ui_help_box[data-for=\"" + this.id + "\"]" );
            helpBox.addClass( "r_" + idx );

            this.hndl_help_content();

            this.$store.EventBus.$on( 'SET_AllHelper', this.evt_allHelper );
        },
		watch: {
            checked: function( $val ){
                this.hndl_help_content();
                if( !$val ) this.$store.commit( 'SET_HelperEnable', false );
            },
            '$store.state.HelperEnable': function( $val ){
                // this.checked = $val;
            }
        },
        methods: {
            hndl_help_content: function(){
                var tg = $( ".ui_help_box[data-for=\"" + this.id + "\"]" );
                if( this.checked ){
                    TweenMax.to( tg, 0.5, { height: tg.find( "> .wrap" ).innerHeight(), ease: Expo.easeInOut } );
                } else {
                    TweenMax.to( tg, 0.5, { height: 0, ease: Expo.easeInOut } );
                }
            },
            evt_allHelper: function( $val ){
                this.checked = $val;
            }
        }
    })
}());
