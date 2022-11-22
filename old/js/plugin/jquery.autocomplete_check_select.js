/*!
 *
 * @author: GUNI, h2dlhs@realsn.com
 **/
 
 
(function ($){

	var acsClass = function( $el, $options ){

		var datas;
		var realData;

		var id;
		var m_select;
		var inputs;
		var input_tf;
		var openBtn;
		var list;
		var list_chk;
		var list_use;
		var all_wrap;
		var input_all;

		var opt;
		var inputKeyword;
		var activeChk = false;

		this.init = function (){
			m_select = $el.find( "> select" );
			id = m_select.attr( "id" );

			opt = {};
			opt.readOnly = $el.data( "readonly" ) ? true : false;

			inputs = $( "<div class='input'><input type='text' id='" + id + "_input' class='select_box' " + ( opt.readOnly ? "readonly" : "" ) + "><label for='" + id + "_input' class='ui_invisible'>제품검색</label><button class='btn_expand'><span>열기/닫기</span></button></div>" );
			input_tf = inputs.find( "input" );
			openBtn = inputs.find( ".btn_expand" );
			list = $( "<div class='lists'><ul class='chk_list'></ul><ul class='use_list'></ul></div>" );
			list_chk = list.find( ".chk_list" );
			list_use = list.find( ".use_list" );

			// All 체크 시
			if( $el.attr( "data-all" ) ) {
				all_wrap = $( "<div class='all_wrap'><strong>All</strong><div class='dcp_switch small'><input id='" + id + "_switch' type='checkbox'><label for='" + id + "_switch'><div class='wrap'><span class='anchor'></span></div></label></div></div>" );
				input_all = all_wrap.find( "input[type=checkbox]" );
				input_all.change( evt_allChange );
				list.prepend( all_wrap );
			}

			$el.append( inputs );
			$el.append( list );

			input_tf.focus( input_focus );
			input_tf.keyup( inputKeyup );
			if( opt.readOnly ) inputs.click( btnClick );
			else openBtn.click( btnClick );
			$( document ).bind( "click", docClick );

			if( $el.data( "fixed" ) ){
				$( window, "*" ).scroll( hndl_pos );
				$( window ).resize( hndl_pos );
			}

			new MutationObserver( function( $e ) {
				reset();
			}).observe( m_select[ 0 ], { childList: true, characterData: true, subtree: true });

			reset();
		}

		function reset(){
			list_chk.children().remove();
			list_use.children().remove();

			datas = [];
			var selDatas = [];
			m_select.find( "option" ).each( function( $idx ){
				$( this ).attr( "data-idx", $idx );
				var data = {};
				data.idx = $idx;
				data.value = $( this ).val() ? $( this ).val() : $( this ).text();
				data.txt = $( this ).text();
				datas.push( data );

				if( this.selected ) selDatas.push( data );
			});

			if( selDatas.length > 0 ) {
				list_chk.innerHTML = "";
				var items = "";
				for( var Loop1 = 0 ; Loop1 < selDatas.length ; ++Loop1 ){
					items += "<li><span class='item' data-idx='" + selDatas[ Loop1 ].idx + "' data-value='" + selDatas[ Loop1 ].value + "'>" + selDatas[ Loop1 ].txt + "</span></li>";
				}
				list_chk[ 0 ].innerHTML = items;
				list_chk.find( ".item" ).unbind( "click" ).click( chkItem_click );
			} else {
			}

			if( activeChk ) {
				activeChk = false;
				hndl_list();
				valueChange();
			} else {
				valueChange();
				hndl_allSelect();
				hndl_listChk();
			}
		}

		// **********		Build		************************************************************************************************ //




		// **********		Hndler		************************************************************************************************ //
		function hndl_list(){
			if( activeChk ) {
				if( list_chk.children().length > 0 || list_use.children().length > 0 ){
					inputs.addClass( "active" );
					list.show();
					hndl_pos();
				}
			} else {
				inputs.removeClass( "active" );
				list.hide();
			}

			hndl_listChk();
		}

		function searchKeyword(){
			inputKeyword = input_tf.val();

			if( inputKeyword.trim().length == 0 ) {
				list_use.css( "display", "none" );

				realData = [];
				/*
				activeChk = false;
				hndl_list();
				*/
			} else {
				list_use.css( "display", "block" );
				realData = datas.filter( function( a, b, c, d ){
					if( $el.attr( "data-search-order" ) ) {		// 검색어 위치 처음부터
						if( $el.attr( "data-search-case" ) ) return a.txt.indexOf( inputKeyword ) == 0;
						else return a.txt.toLowerCase().indexOf( inputKeyword.toLowerCase() ) == 0;
					} else {							// 검색어 위치 설정 없음
						if( $el.attr( "data-search-case" ) ) return a.txt.indexOf( inputKeyword ) >= 0;
						else return a.txt.toLowerCase().indexOf( inputKeyword.toLowerCase() ) >= 0;
					}
				});
			}

			buildItems();
		}

		function buildItems() {
			var items = "";

			var activeVals = [];
			m_select.find( "option:selected" ).each( function(){
				activeVals.push( $( this ).val() );
			});

			var tmpData = realData.concat();
			tmpData = tmpData.filter( function( a ){
				return activeVals.indexOf( a.value ) < 0;
			});

			var tmpKeyword = "";
			for( var Loop1 = 0 ; Loop1 < tmpData.length ; ++Loop1 ){
				activeChk = true;
				if( inputKeyword && inputKeyword.length > 0 ) tmpKeyword = tmpData[ Loop1 ].txt.substr( tmpData[ Loop1 ].txt.toLowerCase().indexOf( inputKeyword.toLowerCase() ), inputKeyword.length );
				//items += ( "<li><span class='item" + itemActive + "' data-value='" + tmpData[ Loop1 ].value + "'>" + tmpData[ Loop1 ].txt + "</span></li>" );
				items += ( "<li><span class='item' data-idx='" + tmpData[ Loop1 ].idx + "' data-value='" + tmpData[ Loop1 ].value + "'>" + tmpData[ Loop1 ].txt.replace( new RegExp( inputKeyword, "gi" ), "<span class=\"highlight\">" + tmpKeyword + "</span>" ) + "</span></li>" );
			}
			list_use[ 0 ].innerHTML = items;
			list_use.find( ".item" ).unbind( "click" ).click( item_click );

			if( list_chk.children().length > 0 ) activeChk = true;

			hndl_list();
			hndl_listChk();
		}

		function hndl_mSelect( $val, $type ){
			if( $type == null || $type == undefined || $type == "undefined" ) $type = true;
			if( $type ) {
				m_select.find( "option[value='" + $val + "']" )[ 0 ].selected = true;
			} else {
				m_select.find( "option[value='" + $val + "']" )[ 0 ].selected = false;
			}
		}

		function hndl_listChk(){
			if( list_chk.children().length > 0 ) {
				list_chk.css( "display", "block" );
			} else {
				list_chk.css( "display", "none" );
			}

			if( list_chk.children().length <= 0 && list_use.children().length <= 0 ) {
				list.hide();
			}
		}

		function addItem_chk( $idx, $val, $txt ) {
			var item = $( "<li><span class='item' data-idx='" + $idx + "' data-value='" + $val + "'>" + $txt + "</span></li>" );
			item.find( ".item" ).unbind( "click" ).click( chkItem_click );
			list_chk.append( item );
			valueChange();
			hndl_listChk();
		}
		function addItem_use( $idx, $val, $txt ) {
			var beforeTg;
			list_use.find( ".item" ).each( function(){
				if( $( this ).data( "idx" ) < $idx ) beforeTg = $( this ).parent();
				else return false;
			});

			var item = $( "<li><span class='item' data-idx='" + $idx + "' data-value='" + $val + "'>" + $txt.replace( new RegExp( inputKeyword, "gi" ), "<span class=\"highlight\">" + inputKeyword + "</span>" ) + "</span></li>" );
			item.find( ".item" ).unbind( "click" ).click( item_click );
			if( beforeTg ){
				beforeTg.after( item );
			} else {
				list_use.prepend( item );
			}

			valueChange();
			hndl_listChk();
		}

		function valueChange(){
			var selValue = list_chk.find( ".item" ).eq( 0 ).text().trim();
			if( list_chk.find( ".item" ).length <= 0 ) selValue = "선택하세요";
			else if( list_chk.find( ".item" ).length > 1 ) selValue += " (+" + ( list_chk.find( ".item" ).length - 1 ) + ")";

			if( list_chk.find( ".item" ).length == m_select.find( "option" ).length ) selValue = "All";

			input_tf.val( selValue );
		}

		function hndl_allSelect(){
			if( !all_wrap ) return;
			if( !m_select.val() ) return;

			if( m_select.val().length == m_select.find( "option" ).length ) input_all[ 0 ].checked = true;
			else input_all[ 0 ].checked = false;
		}

		function hndl_pos(){
			if( !list.is( ":visible" ) ) return;
			if( list.css( "position" ) == "fixed" ) {
				list.css( "min-width", inputs.outerWidth() );
				var pos = {};
				$el[ 0 ].getBoundingClientRect()
				pos.top = $el[ 0 ].getBoundingClientRect().top + $el.find( "> .input" ).outerHeight();
				pos.left = $el[ 0 ].getBoundingClientRect().left;
				list.css( { top : pos.top, left : pos.left } );
			}
		}




		// **********		Event		************************************************************************************************ //
		function input_focus(){
			inputs.addClass( "active" );
		}

		function docClick( $e ){
			var tg = $e.target;
			if( $( tg ).is( ":visible" ) && !$el.is( tg ) && $el.has( tg ).length === 0 ){
				activeChk = false;
				hndl_list();
				valueChange();
			}
		}

		function btnClick( $e ){
			activeChk = !activeChk;
			if( activeChk ) {
				inputKeyword = null;
				realData = datas.concat();
				buildItems();
				list_use.css( "display", "block" );
			} else {
				inputKeyword = null;
				//realData = [];
				//buildItems();
				valueChange();
				hndl_list();
			}
		}

		function inputKeyup( $e ){
			if( $e.keyCode == 37 || $e.keyCode == 38 || $e.keyCode == 39 || $e.keyCode == 40 ) return false;
			
			searchKeyword();
		}

		function item_click( $e ){
			$( this ).parent().remove();
			hndl_mSelect( $( this ).data( "value" ) );
			addItem_chk( $( this ).data( "idx" ), $( this ).data( "value" ), $( this ).text() );

			hndl_allSelect();
		}

		function chkItem_click( $e ){
			$( this ).parent().remove();
			hndl_mSelect( $( this ).data( "value" ), false );
			addItem_use( $( this ).data( "idx" ), $( this ).data( "value" ), $( this ).text() );

			hndl_allSelect();
		}

		function evt_allChange( $e ){
			list_use[ 0 ].innerHTML = "";
			list_chk[ 0 ].innerHTML = "";
			inputKeyword = "";

			if( this.checked ){
				m_select.find( "option" ).each( function(){
					this.selected = true;
				});
			} else {
				m_select.find( "option" ).each( function(){
					this.selected = false;
				});
			}

			reset();

			if( !this.checked ){
				realData = datas.concat();
				buildItems();
			}
		}
		



		// **********		Out Method		************************************************************************************************ //
		this.update = function( $value ){
			reset();
		}



	};

	$.fn.autocomplete_check_select = function ( $options ) {
		return this.each(function() {
			var acs = new acsClass( $( this ), $options );
			$.data( this, 'autocomplete_check_select', acs );
			$( document ).ready( acs.init );
		});
	}
})(jQuery);
