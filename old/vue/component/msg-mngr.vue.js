(function(){
    // HTML Template
    var template = ''
        + '<transition name="fade_scale">'
        + '    <section id="msg_box" v-if="open">'
        + '        <div class="wrap">'
        + '            <div class="bg"></div>'
        + '            <div class="box">'
        + '                <div class="icons" v-if="mType != undefined">'
        + '                    <span v-if="mType == \'error\'" class="icon_error"></span>'
        + '                    <span v-if="mType == \'warning\'" class="icon_warning"></span>'
        + '                    <span v-if="mType == \'info\'" class="icon_info"></span>'
        + '                    <span v-if="mType == \'question\'" class="icon_question"></span>'
        + '                    <span v-if="mType == \'complete\'" class="icon_complete"></span>'
        + '                </div>'
        + '                <h2 class="title" v-if="title" v-html="title"></h2>'
        + '                <div class="txts" :class="{ alone: mType == undefined }" v-if="txt"><span v-html="txt"></span></div>'
        + '                <div class="btns">'
        + '                    <button type="button" class="ui_btn is-large is-color-hl" v-if="btnType == 0 || btnType == 1" @click="evt_click( 0 )"><span>확인</span></button>'
        + '                    <button type="button" class="ui_btn is-large is-color-hl" v-if="btnType == 2 || btnType == 3" @click="evt_click( 2 )"><span>예</span></button>'
        + '                    <button type="button" class="ui_btn is-large" v-if="btnType == 2 || btnType == 3" @click="evt_click( 3 )"><span>아니요</span></button>'
        + '                    <button type="button" class="ui_btn is-large" v-if="btnType == 1 || btnType == 3" @click="evt_click( 1 )"><span>취소</span></button>'
        + '                </div>'
        + '            </div>'
        + '        </div>'
        + '    </section>'
        + '</transition>'

    // Component
    comp = Vue.component( "comp-msg-mngr", {
        template: template,
        data: function(){
			return {
				stack: [],
				open: false,
				aniChk: false,
				title: "",
				txt: "",
				mType: NaN,
				btnType: 0,
				func: null
			};
		},
		props: [],
		computed: {
			isOpen: function(){
				return $( this.$el ).is( ":visible" );
			}
		},
		created: function (){
			this.$store.EventBus.$on( "msgMngr", this.send );
			this.$store.EventBus.$on( "msgMngr.destroy", this.destroy );
		},
		mounted: function (){
		},
		watch: {
			open: function( $type ){
				this.$nextTick( function(){
					var _this = this;
                    this.aniChk = true;
                    /*
					if( $type ){
						$( this.$el ).find( ".box" ).css( { "margin-top": ( -$( this.$el ).find( ".box" ).outerHeight() / 2 ) + 50,  "margin-left": ( -$( this.$el ).find( ".box" ).outerWidth() / 2 ) } );
						$( this.$el ).find( ".box" ).animate( { "margin-top" : -$( this.$el ).find( ".box" ).outerHeight() / 2 }, 400, "easeOutQuad", function(){
							_this.aniChk = false;
							$( "#msg_box button" ).eq( 0 ).focus();
						});
					} else {
						$( this.$el ).find( ".box" ).animate( { "margin-top" : ( -$( this.$el ).find( ".box" ).outerHeight() / 2 ) - 50 }, 300, "easeOutQuad", function(){
							_this.aniChk = false;
							_this.remove();
						});
                    }
                    */
                });

                if( $type ) {
                    $( "#wrap" ).addClass( "is-blured" );
                } else {
                    $( "#wrap" ).removeClass( "is-blured" );
                    this.remove();
                }
			}
		},
		methods: {
			send: function( $txt, $title, $mType, $btnType, $func ){
				var stackData = {};
				stackData.txt = $txt;
				stackData.title = $title;
				stackData.btnType = $btnType ? $btnType : 0;
				stackData.mType = $mType;
				stackData.func = $func;
				this.stack.push( stackData );
                if( !this.open ) this.stackChk();
			},
			openMBox: function(){
				this.title = this.stack[ 0 ].title;
				this.txt = this.stack[ 0 ].txt;
				this.btnType = this.stack[ 0 ].btnType;
				this.mType = this.stack[ 0 ].mType;
				this.func = this.stack[ 0 ].func;

				this.open = true;
			},
			stackChk: function() {
				if( this.stack.length > 0 ) this.openMBox();
			},
			remove: function(){
				this.stack.shift();
				this.stackChk();
			},
			destroy: function(){
				this.stack = [];
			},
			evt_click: function( $val ){
				this.open = false;
				if( this.func ) this.func( $val );
			}
		}
    })
}());