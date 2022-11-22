(function(){
    // HTML Template
    var template = ''
        + '<div class="top_searchs" ref="wrap" :class="[{ \'is-expanded\': $store.state.TopSearchExpanded }, { \'no-result\': hasResultsSlot }]">'
        + '    <div class="wrap">'
        + '        <div class="inner_wrap">'
        + '            <!-- 검색 조건 -->'
        + '            <div class="searchs" ref="searchs">'
        + '                <div class="conditions_wrap">'
        + '                    <slot name="searchs"></slot>'
        + '                </div>'
        + '                <button type="button" class="ui_btn is-large is-hl" @click="searching"><span class="txt">검색</span></button>'
        + '            </div>'
        + '            <!-- // 검색 조건 -->'
        + '            <!-- 검색 결과 -->'
        + '            <div class="results" ref="results" v-a>'
        + '                <slot name="results"></slot>'
        + '            </div>'
        + '            <!-- // 검색 결과 -->'
        + '        </div>'
        + '    </div>'
        + '    <button v-if="hasResultsSlot" class="btn_expander" @click="$store.commit(\'SET_TopSearchExpanded\', !$store.state.TopSearchExpanded)">열고/닫기</button>'
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
        created: function(){
        },
        mounted: function(){
            $( window ).scroll( this.evt_scroll );
            $( window ).resize( this.evt_resize );
            this.hndl_move( 0 );
            this.$emit( 'update:searchDatas', JSON.parse( JSON.stringify( this.searchInputDatas ) ) );
        },
        watch: {
            '$store.state.TopSearchExpanded': function( $val ){
                this.hndl_move();
            }
        },
        methods: {
            hndl_move: function( $tweenTime ) {
                var _this = this;

                if( $tweenTime == undefined ) $tweenTime = 0.5;

                if( this.$store.state.TopSearchExpanded ) {
                    TweenMax.to( this.$refs.searchs, $tweenTime, { "margin-top": 0, "ease": "Expo.easeInOut" } );
                    TweenMax.to( this.$refs.results, $tweenTime, { "margin-bottom": -$( this.$refs.results ).outerHeight() - 10, "ease": "Expo.easeInOut", onUpdate: anying, onComplete: anying } );
                } else {
                    TweenMax.to( this.$refs.searchs, $tweenTime, { "margin-top": -$( this.$refs.searchs ).outerHeight() - 10, "ease": "Expo.easeInOut" } );
                    TweenMax.to( this.$refs.results, $tweenTime, { "margin-bottom": 0, "ease": "Expo.easeInOut", onUpdate: anying, onComplete: anying } );
                }

                function anying(){
                    $( "#content > .wrap > .contents" ).css( "padding-top", $( _this.$refs.wrap ).outerHeight() + $( "#locator" ).outerHeight() )
                }
            },
            evt_scroll: function(){
                if( this.hasResultsSlot && $( window ).scrollTop() > 20 ) this.$store.commit( 'SET_TopSearchExpanded', false );
            },
            evt_resize: function(){
                this.hndl_move( 0 );
            },
            searching: function(){
                this.$emit( 'update:searchDatas', JSON.parse( JSON.stringify( this.searchInputDatas ) ) );
            }
        },
        directives: {
            a: {
                // 디렉티브 정의
                update: function( $el, $bind, $vnode ) {
                    // setTimeout( $vnode.context.hndl_move, 100 );
                    // $vnode.context.hndl_move( 0 );
                }
            }
        }
    })
}());
