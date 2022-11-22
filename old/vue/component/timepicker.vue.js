
(function(){
    var template = ''
    +   '<div class="dcp_time_picker" :class="{ \'box_mode\' : box_mode }">'
    +   '   <div class="input_wrap">'
    +   '      <div class="wrap" ref="input">'
    +   '          <div :id="id" class="date_result" :class="{ \'is-active\': active }" readonly :disabled="disabled" @click="active = !active">{{ render_time | time24to12 }}</div>'
    +   '      </div>'
    +   '   </div>'
    +   '   <transition name="fade_posy">'
    +   '       <div class="time_box" v-if="active && !disabled" ref="time_setting" :style="\'top: \' + pos_top + \'px; left: \' + pos_left + \'px;\'" v-init>'
    +   '           <template v-for="item in timeCtrlUseds">'
    +   '               <div class="item">'
    +   '                   <div class="no_use" v-if="!item.use">'
    +   '                       <div class="wrap">'
    +   '                           <span class="res" v-if="item.name == \'hour\'">{{ item.time | timeToTwelve | numAddZero }}</span>'
    +   '                           <span class="res" v-else>{{ item.time | numAddZero }}</span>'
    +   '                       </div>'             
    +   '                   </div>'
    +   '                   <div class="time_bx" v-else>'
    +   '                       <div class="wrap">'
    +   '                           <span class="res" v-if="item.type == \'hour\'">{{ item.time | timeToTwelve | numAddZero }}</span>'
    +   '                           <span class="res" v-else>{{ item.time | numAddZero }}</span>'
    +   '                           <div class="btn">'
    +   '                               <div class="up">'
    +   '                                   <input type="radio" :name="id" :id="id + item.type + \'_up\'">'
    +   '                                   <label :for="id + item.type + \'_up\'" @mousedown="evt_mouseDn( item.type, \'up\' )" @mouseup="evt_mouseUp" @mouseleave="evt_mouseOut"><span class="icon-caret-up"></span></label>'
    +   '                               </div>'
    +   '                               <div class="dn">'
    +   '                                   <input type="radio" :name="id" :id="id + item.type + \'_dn\'">'
    +   '                                   <label :for="id + item.type + \'_dn\'" @mousedown="evt_mouseDn( item.type, \'dn\' )" @mouseup="evt_mouseUp" @mouseleave="evt_mouseOut"><span class="icon-caret-down"></span></label>'
    +   '                               </div>'
    +   '                           </div>'
    +   '                       </div>'             
    +   '                   </div>'
    +   '               </div>'
    +   '           </template>'
    +   '           <div class="item">'
    +   '               <div class="ampm_box">'
    +   '                   <div class="bx">'
    +   '                       <input type="radio" :name="id + \'ampm\'" :id="id + \'ampm1\'" value="AM" v-model="ampmChk" @change="evt_ampmChange">'
    +   '                       <label :for="id + \'ampm1\'">AM</label>'
    +   '                   </div>'
    +   '                   <div class="bx">'
    +   '                       <input type="radio" :name="id + \'ampm\'" :id="id + \'ampm2\'" value="PM" v-model="ampmChk" @change="evt_ampmChange">'
    +   '                       <label :for="id + \'ampm2\'">PM</label>'
    +   '                   </div>'
    +   '               </div>'
    +   '           </div>'
    +   '       </div>'
    +   '   </transition>'
    +   '</div>'
    
    Vue.component( "comp-timepicker", {
        template : template,
        data: function(){
            return {
                active : this.box_mode,
                pos_top: 0,
                pos_left: 0,
                ampmChk : parseInt( this.value.split(":")[ 0 ] ) >= 12 ? "PM" : "AM",
                timeCtrlUseds: [
                    { type: "hour", use: true, time: parseInt( this.value.split(":")[ 0 ] ), limit: 24 },
                    { type: "min", use: this.minutes_set, time: parseInt( this.value.split(":")[ 1 ] ), limit: 60 },
                    { type: "sec", use: this.seconds_set, time: parseInt( this.value.split(":")[ 2 ] ), limit: 60 }
                ],
            }
        },
        props:{
            value: { type: String },
            id : { type: String},
            minutes_set : { type : Boolean, default: false },
            seconds_set : { type : Boolean, default: false },
            disabled : { type: Boolean, default: false },
            box_mode : { type: Boolean, default: false }
        },
        filters: {
            timeToTwelve: function( $t ){
                if( $t > 12 ){
                    $t = $t - 12 
                }
                if( $t == 0 ){
                    $t = 12;
                }
                return $t
            }
        },
        computed: {
            render_time: function(){
                return this.$options.filters.numAddZero( this.timeCtrlUseds[ 0 ].time ) + ":" + this.$options.filters.numAddZero( this.timeCtrlUseds[ 1 ].time ) + ":" + this.$options.filters.numAddZero( this.timeCtrlUseds[ 2 ].time );
            }
        },
        created: function(){
            // this.active = this.box_mode;
        },
        mounted: function(){
            $( window ).scroll( this.evt_scroll );
            $( window ).resize( this.evt_resize );
        },
        watch: {
            value: function( $val ){
                this.timeCtrlUseds[ 0 ].time = parseInt( this.value.split(":")[ 0 ] );
                this.timeCtrlUseds[ 1 ].time = parseInt( this.value.split(":")[ 1 ] );
                this.timeCtrlUseds[ 2 ].time = parseInt( this.value.split(":")[ 2 ] );
            },
            render_time: function( $val ){
                this.$emit( "input", $val );
                if( this.timeCtrlUseds[ 0 ].time >= 12 ){
                    this.ampmChk = "PM";
                }else{
                    this.ampmChk = "AM";
                }
            },
            active: function( $val ){
                if( !this.box_mode ){
                    if( $val ){
                        document.addEventListener( "click", this.documentClick );
                    }else{
                        document.removeEventListener( "click", this.documentClick );
                    }
                }
            }
        },
        methods:{
            time_up: function( $type ){
                var data;
                if( $type == "hour" ) data = this.timeCtrlUseds[ 0 ];
                else if( $type == "min" ) data = this.timeCtrlUseds[ 1 ];
                else data = this.timeCtrlUseds[ 2 ];

                data.time++;

                if(data.time >= data.limit ){
                    data.time = 0;
                    return
                }
            },
            time_dn: function( $type ){
                var data;
                if( $type == "hour" ) data = this.timeCtrlUseds[ 0 ];
                else if( $type == "min" ) data = this.timeCtrlUseds[ 1 ];
                else data = this.timeCtrlUseds[ 2 ];

                data.time--;

                if(data.time < 0  ){
                    data.time = data.limit - 1;
                    return
                }
            },
            evt_mouseDn: function( $type, $dir ){
                var callFunc = $dir == "up" ? this.time_up : this.time_dn;
                var intervalTime = $type == "hour" ? 100 : 50;

                var _this = this;
                callFunc( $type );
                _this.set = setTimeout( function(){
                    _this.inter = setInterval(function(){
                        callFunc( $type );
                    }, intervalTime );
                },500 )
            },
            evt_mouseUp: function( $e ){
                clearTimeout( this.set );
                clearInterval( this.inter );
            },
            evt_mouseOut: function( $e ){
                clearTimeout( this.set );
                clearInterval( this.inter );
            },
            evt_ampmChange: function(){
                if( this.ampmChk == "PM" ){
                    if( this.timeCtrlUseds[ 0 ].time < 12) {
                        this.timeCtrlUseds[ 0 ].time += 12;
                    }
                } else {
                    if( this.timeCtrlUseds[ 0 ].time >= 12) {
                        this.timeCtrlUseds[ 0 ].time -= 12;
                    }
                }
            },
            evt_scroll: function(){
				if( !this.box_mode ) this.active = false;
			},
			evt_resize: function(){
				if( !this.box_mode ) this.active = false;
			},
            documentClick: function( $e ){
                var el = this.$el;
                var target = $e.target;
                if( el !== target && !el.contains( target ) ){
                    this.active = false;
                }
            },
            set_rePos: function(){
                if( this.active ) {
                    if( !this.box_mode ){
                        this.pos_top = $( this.$refs.input ).offset().top - $( document ).scrollTop() + $( this.$refs.input ).outerHeight();
                        this.pos_left = $( this.$refs.input ).offset().left - $( document ).scrollLeft();

                        if( this.pos_top + $( this.$refs.time_setting ).outerHeight() > $( window ).height() ) this.pos_top -= $( this.$refs.time_setting ).outerHeight() + $( this.$refs.input ).outerHeight() + 2;
                        if( this.pos_left + $( this.$refs.time_setting ).outerWidth() > $( window ).width() ) this.pos_left -= $( this.$refs.time_setting ).outerWidth() - $( this.$refs.input ).outerWidth();

                        if( this.pos_top < 0 ) this.pos_top = $( this.$refs.input ).offset().top - $( document ).scrollTop() + $( this.$refs.input ).outerHeight();
                    }
				}
            }
        },
        directives: {
            init: {
                inserted: function ( el, binding, vnode ) {
                    vnode.context.set_rePos();
                }
            }
        }
        
    })
}())