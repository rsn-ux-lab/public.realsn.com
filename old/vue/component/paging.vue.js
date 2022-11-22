(function(){
    // HTML Template
    var template = ''
        + '<div class="ui_paginate">'
        + '    <div class="wrap">'
        + '        <a href="#" class="btn_page first" title="첫 페이지" onclick="return false" :disabled="datas.curIdx == 1" @click="evt_click( 1 )">&#xe003;</a>'
        + '        <a href="#" class="btn_page prev" title="이전 페이지" onclick="return false" :disabled="paging_sIdx == 1" @click="evt_click( paging_sIdx - 1 )">&#xe001;</a>'
        + '        <template>'
        + '            <a v-for="item in pagingData" href="#" class="btn_page" onclick="return false;" v-bind:class="{ \'is-active\' : item.active }" @click="evt_click( item.idx )">{{ item.idx | addComma }}</a>'
        + '        </template>'
        + '        <a href="#" class="btn_page next" title="다음 페이지" onclick="return false" :disabled="paging_eIdx - 1 == totPCnt" @click="evt_click( paging_eIdx )">&#xe000;</a>'
        + '        <a href="#" class="btn_page last" title="마지막 페이지" onclick="return false" :disabled="datas.curIdx == totPCnt" @click="evt_click( totPCnt )">&#xe002;</a>'
        //  Mobile
        + '        <a href="#" class="btn_page first is-mobile" title="첫 페이지" onclick="return false" :disabled="datas.curIdx == 1" @click="evt_click( 1 )">&#xe003;</a>'
        + '        <a href="#" class="btn_page prev is-mobile" title="이전 페이지" onclick="return false" :disabled="datas.curIdx == 1" @click="evt_click( datas.curIdx - 1 )">&#xe001;</a>'
        + '        <span class="is-mobile"><strong>{{ datas.curIdx | addComma }}</strong> / {{ totPCnt | addComma }}</span>'
        + '        <a href="#" class="btn_page next is-mobile" title="다음 페이지" onclick="return false" :disabled="datas.curIdx == totPCnt" @click="evt_click( datas.curIdx + 1 )">&#xe000;</a>'
        + '        <a href="#" class="btn_page last is-mobile" title="마지막 페이지" onclick="return false" :disabled="datas.curIdx == totPCnt" @click="evt_click( totPCnt )">&#xe002;</a>'
        //  Mobile
        + '    </div>'
        + '</div>'

    // Component
    comp = Vue.component( "comp-paginate", {
        template: template,
        data: function(){
			return {
				chk: false
			};
		},
		props: [ "datas", "totalLen", "value", "click" ],
		computed: {
            val: {
				get: function() {
					return this.value;
				},
				set: function( $val ) {
					this.$emit( "input", $val );
				}
			},
			paging_sIdx: function(){
				return parseInt( (( Math.ceil( parseInt( this.datas.curIdx ) / parseInt( this.datas.pagingColCnt ) ) - 1 ) * parseInt( this.datas.pagingColCnt ) ) + 1 );
			},
			paging_eIdx: function(){
                var result = parseInt( this.paging_sIdx + parseInt( this.datas.pagingColCnt ) > parseInt( this.totPCnt ) ? parseInt( this.totPCnt ) + 1 : this.paging_sIdx + parseInt( this.datas.pagingColCnt ) )
				return result == 1 ? 2 : result;
			},
			pagingData: function(){
                var result = [];
				for( var Loop1 = this.paging_sIdx ; Loop1 < this.paging_eIdx ; ++Loop1 ){
					var data = {};
					data.idx = Loop1;
					data.active = Loop1 == parseInt( this.datas.curIdx ) ? true : false;
					result.push( data );
				}
				return result;
			},
			totPCnt: function(){
				return Math.ceil( this.totalLen / this.datas.rowCnt );
			}
		},
		watch: {
		},
		methods: {
            evt_click: function( $val ){
                if( $val < 1 ) return false;
                if( $val > this.totPCnt ) return false;
                this.val = $val;

                if( this.click ) this.click();
            }
		}
    })
}());