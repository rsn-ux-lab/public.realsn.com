/*!
 *
 * @author: RSN R&D Team LHS(GUNI)
 *			h2dlhs@realsn.com
 *
 *
 **/


// Nav Form Send
function gotoPage( $url ){
	location.href = $url;
}

// Page Title
function setPageTitle( $val ){
	document.title = $val;
}

// Add Locator
var addLocItem = [];
function addLocator( $val ){
	addLocItem.push( $val );
}

// UI Reset
function ui_reset( $tg ){
	if( !$tg ) $tg = $( "body" );

	// Design SelectBox 셋팅
	$tg.find( ".dcp > select" ).each( function(){
		var tg = $( this );
		tg.change( selectSet );
		selectSet();
		new MutationObserver( function( $e ) {
			if( tg.attr( "value" ) ) {
				tg[ 0 ].value = tg.attr( "value" );
				tg.removeAttr( "value" );
				tg.trigger( "change" );
			} else {
				selectSet();
			}
		}).observe( tg[ 0 ], { attributes: true, childList: true, characterData: true, subtree: true, attributeOldValue: true, characterDataOldValue: true });

		function selectSet() {
			tg.find( "+ label" ).html( tg.find( "> option:selected" ).html() );
		}
	});

	// Design CheckBox - 전체선택 기능
	designChk( $tg );
	function designChk( $tg ){
		$tg.find( ".dcp > input[type='checkbox'], .dcp_c > input[type='checkbox'], .ui_tab .tab_comp input[type='checkbox']" ).unbind( "change", hndl_designChk ).change( hndl_designChk );
		function hndl_designChk(){
			if( $( this ).hasClass( "boardAllChecker" ) ) {
				if( this.checked ) {
					$tg.find( "input[data-group='" + $( this ).attr( "data-group" ) + "']:not(.boardAllChecker)" ).not( "[disabled]" ).each(function(){
						this.checked = true;
					});
				} else {
					$tg.find( "input[data-group='" + $( this ).attr( "data-group" ) + "']:not(.boardAllChecker)" ).not( "[disabled]" ).each(function(){
						this.checked = false;
					});
				}
			} else {
				var allChker = true;
				$tg.find( "input[data-group='" + $( this ).attr( "data-group" ) + "']:not(.boardAllChecker)" ).not( "[disabled]" ).each(function(){
					if( !this.checked ) allChker = false;
				});
				if( allChker ) {
					$tg.find( "input[data-group='" + $( this ).attr( "data-group" ) + "'].boardAllChecker" ).not( "[disabled]" ).prop( "checked", true );
				} else {
					$tg.find( "input[data-group='" + $( this ).attr( "data-group" ) + "'].boardAllChecker" ).not( "[disabled]" ).prop( "checked", false );
				}
			}
		}
	}

	// 날짜 검색 설정
	$tg.find( ".ui_datepicker_range" ).each( function(){
		var calWrap = $( this );

		calWrap.find( ".dp_wrap" ).datepicker({
			dateFormat: "yy-mm-dd",
			monthNames: [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ],
			dayNamesMin: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ]
		});

		calWrap.find( ".date_result" ).click( hndl_calendars );
		calWrap.find( ".btns button" ).click( function(){
			hndl_calendars();
		});
		function hndl_calendars(){
			
			if( !calWrap.parent().find( ".calendars" ).is( ":visible" ) ){
				calWrap.find( ".date_result" ).addClass( "active" );
				calWrap.addClass( "active" );
				calWrap.parent().find( ".calendars" ).fadeIn( 120 );
				$( document ).click( docClick );
				var contentChkPos = parseInt( $( "#content" ).offset().left ) + parseInt( $( "#content" ).outerWidth() );
				var calChkPos = parseInt( calWrap.parent().find( ".calendars" ).offset().left ) + parseInt( calWrap.parent().find( ".calendars" ).outerWidth() );
				if( calChkPos > contentChkPos ) {
					calWrap.parent().find( ".calendars" ).css({
						left : "auto",
						right : 0
					});
				}
			} else {
				calWrap.find( ".date_result" ).removeClass( "active" );
				calWrap.removeClass( "active" );
				$( document ).unbind( "click", docClick );
				calWrap.parent().find( ".calendars" ).fadeOut( 120 );
			}
		}
		function docClick( $e ){
			var tg = $e.target;
			if(  $( tg ).closest( calWrap ).length == 0 && $( tg ).parents( ".ui-datepicker-header" ).length == 0 ) hndl_calendars();
		}
	});

	// 게시판 정렬 토글
	$tg.find( ".ui_btn_sort" ).each( function(){
		var tg = $( this );
		tg.click( function(){
			var val = parseInt( tg.attr( "data-sort" ) ) + 1;
			tg.attr( "data-sort", ( ( val <= 2 ) ? val : 0 ) ); 
			hndl_sort();
		});
		hndl_sort();
		function hndl_sort(){
			switch( tg.attr( "data-sort" ) ){
				case "0" :
					tg.attr( "title", "정렬없음" );
					break;
				case "1" :
					tg.attr( "title", "오름차순" );
					break;
				case "2" :
					tg.attr( "title", "내림차순" );
					break;
			}
		}
	});

	// 미리보기
	$tg.find( ".ui_preview_item" ).each( function(){
		var popupChk = false;
		var preview_container = $( "#content > .content_wrap" );
		if( $( this ).parents( ".popup_item" ).length > 0 ) {
			popupChk = true;
			preview_container = $( this ).parents( ".popup_item" ).eq( 0 );
		}

		$( this ).hover( function( $e ){
			if( $e.type == "mouseenter" ) hndl_add_preview( this, $( this ).attr( "data-preview" ) );
			else if( $e.type == "mouseleave" ) hndl_remove_preview( this, $( this ).attr( "data-preview-idx" ) );
		});

		function hndl_add_preview( $tg, $data ){
			var idx = "preview_" + new Date().getTime() + "_" + parseInt( Math.random() * 99999999 );
			var tg = $( $tg );
			var preview = $( "<div class='ui_preview' />" );
			tg.attr( "data-preview-idx", idx );
			preview.html( $data );
			preview.attr( "data-preview-idx", idx );
			preview_container.prepend( preview );
			preview.show();
			if( popupChk ) preview.css( "z-index", 31 );

			var pos = {};
			pos.top = tg.offset().top - preview_container.offset().top - preview.outerHeight();
			pos.left = tg.offset().left - preview_container.offset().left - 20;
			preview.css({
				top : pos.top,
				left : pos.left
			});

			if( parseInt( preview.position().left ) + preview.outerWidth() >= preview_container.outerWidth() - 5 ) {
				preview.width( preview_container.width() - parseInt( pos.left ) - 50 );
				pos.top = tg.offset().top - preview_container.offset().top - preview.outerHeight();
				preview.css({
					top : pos.top,
				});
			}
		}
		function hndl_remove_preview( $tg, $idx ){
			var tg = $( $tg );
			var preview = $( ".ui_preview[data-preview-idx=" + $idx + "]" );
			tg.attr( "data-preview-idx", "null" );
			preview.remove();
		}
	});

	// Toggle버튼
	$tg.find( ".ui_toggle_btn" ).each( function(){
		$( this ).click( function(){
			$( this ).toggleClass( "active" );
		});
	});

	// Loader 삽입
	$tg.find( ".ui_loader_container" ).each( function(){
		if( $( this ).find( "> .ui_loader" ).length <= 0 ) {
			$( this ).append( "<div class=\"ui_loader\"><span class=\"loader\">Load</span></div>" );
		}
	});

	// Sort Dropable
	$tg.find( ".ui_drop_sort > ul" ).each( function(){
		var tg = $( this );
		tg.sortable({
			containment: tg.parent(),
			opacity: 0.7, 
			scrollSpeed: 10,
			placeholder: "ui-state-highlight"
		});
	});

	// Switch Toggle
	$tg.find( ".dcp_switch[data-idx]" ).each( function(){
		var content = $tg.find( ".switch_content[data-for=" + $( this ).data( "idx" ) + "]" );
		var input = $( this ).find( "input[type=checkbox]" );
		input.change( hndl_switch );

		hndl_switch();
		function hndl_switch(){
			if( input[ 0 ].checked ) content.removeClass( "ui_disabled" );	
			else content.addClass( "ui_disabled" );
		}
	});

	// Modify Input
	$tg.find( ".ui_mdfy_input_btn:not(.btn_confirm)" ).each( function(){
		var btn_mdfy = $( this );
		var btn_confirm = $( this ).next();
		var con = $tg.find( ".ui_mdfy_input[data-for='" + btn_mdfy.data( "idx" ) + "']" );

		btn_mdfy.click( function(){
			btn_mdfy.hide();
			btn_confirm.show();
			con.attr( "readonly", false );
			con.select();
		});

		btn_confirm.click( function(){
			btn_mdfy.show();
			btn_confirm.hide();
			con.attr( "readonly", true );
			document.getSelection().removeAllRanges();
		});
	});
}

// 메세지 매니저
var msgMngr = {
	stack : [],
	send : function( $txt, $title, $btnType, $mType, $func ) {
		var stackData = {};
		stackData.txt = $txt;
		stackData.title = $title;
		stackData.btnType = $btnType;
		stackData.mType = $mType;
		stackData.func = $func;
		msgMngr.stack.push( stackData );
		if( !$( "#msg_box" ).is( ":visible" ) ) msgMngr.openMBox();
	},
	openMBox : function(){
		var arrAlertType = [];
			arrAlertType[ 1 ] = $( "<div class='icons'><span class='icon_error'></span></div>" );
			arrAlertType[ 2 ] = $( "<div class='icons'><span class='icon_warning'></span></div>" );
			arrAlertType[ 3 ] = $( "<div class='icons'><span class='icon_info'></span></div>" );
			arrAlertType[ 4 ] = $( "<div class='icons'><span class='icon_question'></span></div>" );
		var arrAlertBtns = [];
			arrAlertBtns[ 0 ] = $( "<button type='button' class='ui_shadow_00' data-value='0'><span>확인</span></button>" );
			arrAlertBtns[ 1 ] = $( "<button type='button' class='ui_shadow_00' data-value='1'><span>취소</span></button>" );
			arrAlertBtns[ 2 ] = $( "<button type='button' class='ui_shadow_00' data-value='2'><span>예</span></button>" );
			arrAlertBtns[ 3 ] = $( "<button type='button' class='ui_shadow_00' data-value='3'><span>아니요</span></button>" );

		var $txt = msgMngr.stack[ 0 ].txt;
		var $title = msgMngr.stack[ 0 ].title;
		var $btnType = msgMngr.stack[ 0 ].btnType;
		var $mType = msgMngr.stack[ 0 ].mType;
		var $func = msgMngr.stack[ 0 ].func;

		$( "#msg_box .box" ).html("");
		$( "#msg_box .box" ).hide();
		if( $title && $title != "" ) $( "#msg_box .box" ).append( "<h2>" + $title + "</h2>" );
		if( $mType && $mType != 0 ) $( "#msg_box .box" ).append( arrAlertType[ $mType ] );
		if( $txt != "" ){
			if( !$mType || $mType == 0 ) $( "#msg_box .box" ).append( "<div class='txts alone'><span>" + String($txt).replaceAll("\n", "<br>") + "</span></div>" );
			else $( "#msg_box .box" ).append( "<div class='txts'><span>" + $txt + "</span></div>" );
		}
		$( "#msg_box .box" ).append( "<div class='btns'></div>" );
		if( !$btnType ) $btnType = 0;
		switch( $btnType ){
			case 0 :
				$( "#msg_box .box .btns" ).append( arrAlertBtns[ 0 ] );
				break;
			case 1 :
				$( "#msg_box .box .btns" ).append( arrAlertBtns[ 0 ] );
				$( "#msg_box .box .btns" ).append( arrAlertBtns[ 1 ] );
				break;
			case 2 :
				$( "#msg_box .box .btns" ).append( arrAlertBtns[ 2 ] );
				$( "#msg_box .box .btns" ).append( arrAlertBtns[ 3 ] );
				break;
			case 3 :
				$( "#msg_box .box .btns" ).append( arrAlertBtns[ 2 ] );
				$( "#msg_box .box .btns" ).append( arrAlertBtns[ 3 ] );
				$( "#msg_box .box .btns" ).append( arrAlertBtns[ 1 ] );
				break;
		}
		$( "#msg_box .box .btns > *" ).click( function(){
			if( $func ) $func( $( this ).attr( "data-value" ) );
			msgMngr.close();
		});
		$( "#msg_box" ).fadeIn( 200, function(){
			$( "#msg_box .box" ).css( "top", "53%" ).show().animate( { "top" : "50%" }, 200, "easeOutQuad", function(){
				if( msgMngr.stack.length > 0 ) msgMngr.stack.splice( 0, 1 );
				$( "#msg_box .box .btns > *" ).eq( 0 ).focus();
			});
			$( "#msg_box .box" ).css( { "margin-top" : -$( "#msg_box .box" ).outerHeight() / 2, "margin-left" : -$( "#msg_box .box" ).outerWidth() / 2 });
		});
	},
	close : function(){
		$( "#msg_box .box" ).animate( { "top" : "47%" }, 200, "easeInQuad" );
		$( "#msg_box" ).fadeOut( 200, function(){
			$( "#msg_box .box .btns > *" ).unbind( "click" );
			$( "#msg_box .box" ).children().remove();
			
			if( msgMngr.stack.length > 0 ) {
				msgMngr.openMBox();
				return;
			}
		});
	}
};

var popupMngr = {
	open : function( $tg ){
		var $popup = $( "#popup_container" );
		var $tg = $( $tg );
		$popup.fadeIn( 300 );
		$tg.show().css({
			"top" : "50%",
			"left" : "50%",
			"margin-top" : -( $tg.outerHeight() / 2 ) + 50,
			"margin-left" : -$tg.outerWidth() / 2,
		}).animate( {
			"margin-top" : -( $tg.outerHeight() / 2 )
		}, 300, "easeOutQuad" );
	},
	close : function( $tg ){
		var $popup = $( "#popup_container" );
		var $tg = $( $tg );
		$popup.fadeOut( 300 );
		$tg.animate( {
			"margin-top" : -$tg.outerHeight() / 2 - 50
		}, 300, "easeInQuad", function(){
				$tg.hide();
		});
	}
}