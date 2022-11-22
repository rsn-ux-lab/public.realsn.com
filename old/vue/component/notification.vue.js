(function(){
    // HTML Template
    var template = ''
    + '<div id="notification">'
    + '    <transition-group name="fade_posy_notification" tag="div" class="wrap" v-on:before-leave="beforeLeave">'
    + '        <section class="item" :class="\'is-\' + $item.type" v-for="( $item, $idx ) in stack" :key="$item.id">'
    + '            <table>'
    + '                <tbody>'
    + '                    <tr>'
    + '                        <td v-html="$item.txt"></td>'
    + '                    </tr>'
    + '                </tbody>'
    + '            </table>'
    + '        </section>'
    + '    </transition-group>'
    + '</div>'

    // Component
    comp = Vue.component( "comp-notification", {
        template: template,
        data: function(){
			return {
				stack: [],
                visibleTime: 4000,
				txt: ""
			};
		},
		props: [],
		created: function (){
			this.$store.EventBus.$on( "notification", this.send );
            this.$store.EventBus.$on( "notification_del", this.remove );
		},
		watch: {
            stack: function() {
            }
		},
		methods: {
            beforeLeave: function( $el ){
                $( $el ).css( { "opacity": 0, "margin-top": -$( $el ).outerHeight() } );
            },
			send: function( $txt, $type ){
                var _this = this;
                var stackData = {};
                stackData.id = "noti_" + ( new Date().getTime() ) + "_" + Math.random() * 1000000;
				stackData.txt = $txt;
				stackData.type = $type;
                this.stack.push( stackData );

                setTimeout( function(){
                    _this.remove()
                }, this.visibleTime );
			},
			openMBox: function(){
				
			},
			stackChk: function() {
			},
			remove: function( $id ){
                this.stack.shift();
			},
			destroy: function(){
			}
		}
    })
}());