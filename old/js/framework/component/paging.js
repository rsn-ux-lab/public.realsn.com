var comp_paging = {
	template:"\
		<div id='brd_paging' class='ui_paginate'>\
			<div class='in_wrap'>\
				<a href='#' class='page_prev' onclick='return false' v-bind:class='{ ui_disabled : paging_sIdx == 1}' v-on:click='clickEvent(paging_sIdx - 1)'>이전페이지</a>\
				<template v-for='data in pagingData'>\
					<a href='#' onclick='return false;' v-bind:class='{ active : data.active }' v-on:click='clickEvent( data.idx )'>{{ data.idx }}</a>\
				</template>\
				<a href='#' class='page_next' onclick='return false;' v-bind:class='{ ui_disabled : paging_eIdx - 1 == totPCnt }' v-on:click='clickEvent( paging_eIdx )'>다음페이지</a>\
			</div>\
		</div>\
	",
	data: function(){
		return {
			
		};
	},
	props: [ "data", "pagelen", "clickEvent" ],
	computed: {
		paging_sIdx: function(){
			return parseInt( (( Math.ceil( parseInt( this.data.page ) / parseInt( this.pagelen ) ) - 1 ) * parseInt( this.pagelen ) ) + 1 );
		},
		paging_eIdx: function(){
			return parseInt( this.paging_sIdx + parseInt( this.pagelen ) > parseInt( this.totPCnt ) ? parseInt( this.totPCnt ) + 1 : this.paging_sIdx + parseInt( this.pagelen ) );
		},
		pagingData: function(){
			var result = [];
			for( var Loop1 = this.paging_sIdx ; Loop1 < this.paging_eIdx ; ++Loop1 ){
				var data = {};
				data.idx = Loop1;
				data.active = Loop1 == parseInt( this.data.page ) ? true : false;
				result.push( data );
			}
			return result;
		},
		totPCnt: function(){
			return Math.floor( parseInt( this.data.totalcnt ) / parseInt( this.data.rowcnt ) ) + 1;
		}
	}
};