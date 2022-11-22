(function(){
    // HTML Template
    var template = ''
        + '<div class="dcp_chkboxs" :class="{ \'is-all\': allLabel, \'is-btn\': btn, \'is-box\': box }" :style="\'padding-left: \' + allWid">'
        + '    <comp-checkbox v-if="allLabel" class="allChk" :class="[ $vnode.data.staticClass ]" :id="id + \'_all\'" val="" v-model="allChk" :label="allLabel" :btn="btn" :box="box" :click="evt_allClick" :disabled="getAllDisabled" v-allInit></comp-checkbox>'
        + '    <hr v-if="allLabel && !box && !btn">'
        + '    <comp-checkbox v-for="( item, idx ) in opts" :class="[ $vnode.data.staticClass ]" v-bind:key="id + \'_\' + idx" :id="id + \'_\' + idx" :val="item.code" v-model="values" :label="item.name" :btn="btn" :box="box" :disabled="item.disabled"></comp-checkbox>'
        + '</div>'

    // Component
    Vue.component( "comp-checkbox-grp", {
        template: template,
        data: function(){
			return {
                allChk: false,
                allWid: '0px'
			};
		},
		props: [ "id", "value", "label", "opts", "grpType", "allLabel", "btn", "box" ],
		computed: {
			values: {
				get: function() {
					return this.$options.filters.paramToArr( this.value );
				},
				set: function( $val ) {
					this.$emit( 'input', this.$options.filters.arrToParam( $val ) );
				}
			},
			optCnt: function() {
				var result = 0;
				this.opts.filter( function( $item ){
					if( !$item.disabled ) result += 1;
				});
				return result;
            },
            getAllDisabled: function(){
                var result = true;
                this.opts.filter( function( $item ){
                    if( !$item.disabled ) result = false;
                })
                return result;
            }
        },
		watch: {
			values: function( $val ){
				if( $val.length > 0 && $val.length == this.optCnt ) {
					this.allChk = true;
				} else {
					this.allChk = false;
                }
            }
        },
        created: function(){
            if( this.values.length == this.opts.length ) this.allChk = true;
        },
        methods: {
            evt_allClick: function( $e ){
                var chk = $e.target.checked;
                this.allChk = chk;
                var result = [];
                if( chk ) {
                    this.opts.filter( function( $item ){
                        if( !$item.disabled ) result.push( $item.code );
                    });
                }
                this.$emit( 'input', this.$options.filters.arrToParam( result ) );
            }
        },
        directives: {
            // 전체 버튼 Init
            allInit: {
                inserted: function ( el, binding, vnode ) {
                    if( !vnode.context.box ) vnode.context.allWid = $( el ).outerWidth() + ( vnode.context.btn ? 4 : 0 ) + 'px';
                }
            }
        }
    })
}());
