/*!
 *
 * @author: GUNI, h2dlhs@realsn.com
 **/
 
 
(function ($){

	var acClass = function( $el, $options ){

		var keyCnt;
		var datas;
		var inputKeyword;
		var activeChk;

		var input;
		var list;
		var list_ul;

		this.init = function (){
			input = $el.find( "input" );
			list = $( "<div class=\"list_wrap\"></div>" );
			list_ul = $( "<ul></ul>" );
			list.append( list_ul );
			$el.append( list );

			input.keydown( evt_keydown );
			input.keyup( evt_keyup );

			reset();
		}

		function reset(){
			datas = $options.datas;

			keyCnt = 0;
			activeChk = false;
		}

		// **********		Build		************************************************************************************************ //




		// **********		Hndler		************************************************************************************************ //
		function hndl_list(){
			if( activeChk ){
				if( list.find( "ul" ).children().length <= 0 ) return;
				$el.find( ".input" ).addClass( "active" );
				list.addClass( "active" );
				addDocClick();
				hndl_pos();
			}else{
				keyCnt = 0;
				list[ 0 ].scrollTop = 0;
				$el.find( ".input" ).removeClass( "active" );
				list.removeClass( "active" );
				list_ul.find( "*" ).remove();
				inputKeyword = "";
				removeDocClick();
			}
		}

		function addDocClick(){
			removeDocClick();
			$( document ).bind( "click", docClick );
		}
		function removeDocClick(){
			$( document ).unbind( "click", docClick );
		}

		function itemActive(){
			list.find( ".item" ).removeClass( "active" );
			if( keyCnt == 0 ) input.focus();
			else {
				list.find( ".item:visible" ).eq( keyCnt - 1 ).addClass( "active" );
				input.val( list.find( ".item:visible" ).eq( keyCnt - 1 ).text() );
			}
		}

		function searchKeyword(){
			keyCnt = 0;
			list.find( ".item" ).removeClass( "active" );
			inputKeyword = input.val();

			if( inputKeyword.trim().length == 0 ) {
				activeChk = false;
				hndl_list();
				return false;
			}

			var realData = datas.filter( function( a, b, c, d ){
				if( $el.attr( "data-search-order" ) ) {		// 검색어 위치 처음부터
					if( $el.attr( "data-search-case" ) ) return a.indexOf( inputKeyword ) == 0;
					else return a.toLowerCase().indexOf( inputKeyword.toLowerCase() ) == 0;
				} else {							// 검색어 위치 설정 없음
					if( $el.attr( "data-search-case" ) ) return a.indexOf( inputKeyword ) >= 0;
					else return a.toLowerCase().indexOf( inputKeyword.toLowerCase() ) >= 0;
				}
			});

			list_ul[ 0 ].innerHTML = "";
			var items = "";
			for( var Loop1 = 0 ; Loop1 < realData.length ; ++Loop1 ){
				activeChk = true;
				items += ( "<li><span class=\"item\">" + realData[ Loop1 ].replace( new RegExp( inputKeyword, "gi" ), "<span class=\"highlight\">" + inputKeyword + "</span>" ) +"</span></li>" );
			}
			list_ul[ 0 ].innerHTML = items;
			list_ul.find( "li .item" ).click( item_click );

			if( activeChk ) hndl_list();

			if( list.find( "li:visible" ).length <= 0 ) {
				activeChk = false;
				hndl_list();
			}
		}

		function hndl_pos(){
			if( !list.is( ":visible" ) ) return;
			if( list.css( "position" ) == "fixed" ) {
				var pos = {};
				$el[ 0 ].getBoundingClientRect()
				pos.top = $el[ 0 ].getBoundingClientRect().top + $el.find( "> .input" ).outerHeight();
				pos.left = $el[ 0 ].getBoundingClientRect().left;
				list.css( { top : pos.top, left : pos.left } );
			}
		}




		// **********		Event		************************************************************************************************ //
		function item_click( $e ){
			input.val( $( this ).text() );
			activeChk = false;
			hndl_list();
		}
		function docClick( $e ){
			var tg = $e.target;
			if( !$el.is( tg ) && $el.has( tg ).length === 0){
				activeChk = false;
				hndl_list();
			}
		}
		function evt_keyup( $e ){
			if( $e.keyCode == 38 || $e.keyCode == 40 || $e.keyCode == 13 ) return;
			searchKeyword();
		}
		function selItem(){
			activeChk = false;
			hndl_list();
			input.blur();
		}

		function evt_keydown( $e ){
			if( $e.keyCode == 38 ) {
				if( inputKeyword.trim().length == 0 ) return false;
				keyCnt--;
				if( keyCnt < 0 ) keyCnt = list.find( ".item:visible" ).length;
				if( keyCnt == 0 ) input.val( inputKeyword );
				itemActive();
				return false;
			} else if( $e.keyCode == 40 ) {
				if( inputKeyword.trim().length == 0 ) return false;
				keyCnt++;
				if( keyCnt > list.find( ".item:visible" ).length ) keyCnt = 0;
				if( keyCnt == 0 ) input.val( inputKeyword );
				itemActive();
				return false;
			} else if( $e.keyCode == 13 ) {
				activeChk = false;
				hndl_list();
				return false;
			}
		}



		// **********		Out Method		************************************************************************************************ //
		this.update = function( $value ){
			//reset();
		}



	};

	$.fn.input_autocomplete = function ( $options ) {
		return this.each(function() {
			var ac = new acClass( $( this ), $options );
			$.data( this, 'input_autocomplete', ac );
			$( document ).ready( ac.init );
		});
	}
})(jQuery);
