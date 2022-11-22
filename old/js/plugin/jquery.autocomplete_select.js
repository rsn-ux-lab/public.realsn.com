/*!
 *
 * @author: GUNI, h2dlhs@realsn.com
 **/
 
 
(function ($){

	var asClass = function( $el, $options ){

		var activeChk = false;
		var input;
		var btn;
		var list;
		var list_ul;
		var datas;
		var inputKeyword;

		var oriSelect;
		var keyCnt;
		var selVal;

		this.init = function (){
			oriSelect = $el.find( "> select" );
			var idx = "as_" + new Date().getTime() + "_" + parseInt( Math.random() * 100000 );
			var $inputWrap = $( "<div class=\"input\"><input type=\"text\" id=\"" + idx + "\" class=\"select_box\"><label for=\"" + idx + "\" class=\"ui_invisible\">제품검색</label><button class=\"btn_expand\"><span>열기/닫기</span></button></div>" );
			var $listWrap = $( "<div class=\"lists\"><ul></ul></div>" );
			$el.append( $inputWrap );
			$el.append( $listWrap );

			input = $el.find( ".select_box" );
			btn = $el.find( ".btn_expand" );
			list = $el.find( ".lists" );
			list_ul = list.find( "> ul" );
			input.keyup( inputKeyup );
			input.blur( evt_inputBlur );
			btn.click( btnClick );
			if( input.attr( "readonly" ) ) $el.find( ".input" ).addClass( "readonly" ).click( btnClick );
			$( input ).keydown( evt_keyDown );

			$( window, "*" ).scroll( hndl_pos );
			$( window ).resize( hndl_pos );

			new MutationObserver( function( $e ) {
				reset();
			}).observe( oriSelect[ 0 ], { childList: true, characterData: true, subtree: true });

			new MutationObserver( function( $e ) {
				if( oriSelect.attr( "value" ) ) {
					oriSelect[ 0 ].value = oriSelect.attr( "value" );
				}
				valueChange();
			}).observe( oriSelect[ 0 ], { attributes: true });

			reset();
		}

		function reset(){
			selVal = null;
			keyCnt = 0;
			$( list.find( ".item" ) ).unbind( "keydown", evt_keyDown ).keydown( evt_keyDown );
			
			inputKeyword = "";
			datas = [];
			oriSelect.find( "option" ).each( function( $idx ){
				datas[ $idx ] = {};
				datas[ $idx ].txt = $( this ).text().trim();
				datas[ $idx ].value = $( this ).val();
			});
			valueChange();
		}

		// **********		Build		************************************************************************************************ //




		// **********		Hndler		************************************************************************************************ //
		function hndl_list(){
			if( activeChk ){
				if( list.find( "ul" ).children().length <= 0 ) return;
				$el.find( ".input" ).addClass( "active" );
				list.css( "min-width", Math.floor( $el.find( "> .input" )[ 0 ].getBoundingClientRect().width ) );
				list.addClass( "active" );
				removeDocClick();
				addDocClick();
				hndl_pos();
			}else{
				keyCnt = 0;
				$el.find( ".input" ).removeClass( "active" );
				list.removeClass( "active" );
				inputKeyword = "";
				removeDocClick();

				var chk = false;
				list.find( ".item" ).each( function(){
					if( $( this ).text() == input.val() ) chk = true;
				});
				if( !chk ) selVal = null;
				valueChange();
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
			inputKeyword = input.val();

			if( inputKeyword.trim().length == 0 ) {
				activeChk = false;
				keyCnt = 0;
				$el.find( ".input" ).removeClass( "active" );
				list.removeClass( "active" );
				removeDocClick();
				return false;
			}

			var realData = datas.filter( function( a, b, c, d ){
				if( $el.attr( "data-search-order" ) ) {		// 검색어 위치 처음부터
					if( $el.attr( "data-search-case" ) ) return a.txt.indexOf( inputKeyword ) == 0;
					else return a.txt.toLowerCase().indexOf( inputKeyword.toLowerCase() ) == 0;
				} else {							// 검색어 위치 설정 없음
					if( $el.attr( "data-search-case" ) ) return a.txt.indexOf( inputKeyword ) >= 0;
					else return a.txt.toLowerCase().indexOf( inputKeyword.toLowerCase() ) >= 0;
				}
			});

			list_ul.find( "*" ).remove();
			var items = "";
			for( var Loop1 = 0 ; Loop1 < realData.length ; ++Loop1 ){
				activeChk = true;
				items += ( "<li><span class=\"item" + ( datas[ Loop1 ].value == oriSelect[ 0 ].value ? " active" : "" ) + "\" data-value=\"" + realData[ Loop1 ].value + "\">" + realData[ Loop1 ].txt.replace( new RegExp( inputKeyword, "gi" ), "<span class=\"highlight\">" + inputKeyword + "</span>" ) +"</span></li>" );
			}
			list_ul[ 0 ].innerHTML = items;
			list_ul.find( "li .item" ).unbind( "click", selItem ).click( selItem );

			if( activeChk ) hndl_list();

			if( list.find( "li:visible" ).length <= 0 ) {
				activeChk = false;
				keyCnt = 0;
				$el.find( ".input" ).removeClass( "active" );
				list.removeClass( "active" );
				removeDocClick();
			}
		}
		function valueChange(){
			if( selVal == oriSelect[ 0 ].options[ oriSelect[ 0 ].selectedIndex ].value ) return;
			if( selVal ) oriSelect.trigger( "change" );
			selVal = oriSelect[ 0 ].options[ oriSelect[ 0 ].selectedIndex ].value;
			input.val( $( oriSelect[ 0 ].options[ oriSelect[ 0 ].selectedIndex ] ).text() );
			list.find( ".item" ).removeClass( "active" );
			list.find( ".item[data-value=" + oriSelect[ 0 ].options[ oriSelect[ 0 ].selectedIndex ].value + "]" ).addClass( "active" );
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
		function btnClick( $e ){
			keyCnt = 0;
			inputKeyword = "";
			input.focus();
			activeChk = !activeChk;

			if( activeChk ) {
				var items = "";
				for( var Loop1 = 0 ; Loop1 < datas.length ; ++Loop1 ){
					activeChk = true;
					items += ( "<li><span class=\"item" + ( datas[ Loop1 ].value == oriSelect[ 0 ].value ? " active" : "" ) + "\" data-value=\"" + datas[ Loop1 ].value + "\">" + datas[ Loop1 ].txt  + "</span></li>" );
				}
				list_ul[ 0 ].innerHTML = items;
				list_ul.find( "li .item" ).unbind( "click", selItem ).click( selItem );
			}

			hndl_list();
		}
		function docClick( $e ){
			var tg = $e.target;
			if( !$el.is( tg ) && $el.has( tg ).length === 0){
				removeDocClick();
				activeChk = false;
				hndl_list();
			}
		}
		function inputKeyup( $e ){
			if( $e.keyCode == 38 || $e.keyCode == 40 || $e.keyCode == 13 ) return;
			searchKeyword();
		}
		function selItem(){
			oriSelect[ 0 ].value = "" + $( this ).data( "value" );
			activeChk = false;
			hndl_list();
		}

		function evt_keyDown( $e ){
			if( $e.keyCode == 38 ) {
				keyCnt--;
				if( keyCnt < 0 ) keyCnt = list.find( ".item:visible" ).length;
				if( keyCnt == 0 ) input.val( inputKeyword );
				itemActive();
				return false;
			} else if( $e.keyCode == 40 ) {
				keyCnt++;
				if( keyCnt > list.find( ".item:visible" ).length ) keyCnt = 0;
				if( keyCnt == 0 ) input.val( inputKeyword );
				itemActive();
				return false;
			} else if( $e.keyCode == 13 ) {
				if( inputKeyword.trim().length <= 0 ) return false;
				oriSelect[ 0 ].value = list.find( ".item.active" ).data( "value" );
				activeChk = false;
				hndl_list();
				return false;
			}
		}

		function evt_inputBlur(){
			if( !activeChk ) {
				var chk = false;
				list.find( ".item" ).each( function(){
					if( $( this ).text() == input.val() ) chk = true;
				});
				if( !chk ) selVal = null;
				valueChange();
			}
		}
		



		// **********		Out Method		************************************************************************************************ //
		this.update = function( $value ){
			//reset();
		}



	};

	$.fn.autocomplete_select = function ( $options ) {
		return this.each(function() {
			var as = new asClass( $( this ), $options );
			$.data( this, 'autocomplete_select', as );
			$( document ).ready( as.init );
		});
	}
})(jQuery);
