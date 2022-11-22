/*!
 *
 * @author: RSN R&D Team LHS(GUNI)
 *			h2dlhs@realsn.com
 *
 *
 **/

var gnbIDX = "";

$( document ).ready( function() {
	designScripts();
});

function designScripts(){
	// 페이지 전체 UI재설정(디자인 요소)
	ui_reset();

	// Message Box 컨텐이너
	var msgBoxContainer = $( "<section id=\"msg_box\"><div class=\"bg\"></div><div class=\"box ui_shadow_00\"><h2 class=\"invisible\">팝업 메시지</h2></div></section>" );
	$( "body" ).prepend( msgBoxContainer );

	// GNB / LNB
	var curUrl = getUrlPath( location.href );
	init_gnb();
	function init_gnb(){
		$( "aside nav" ).each( function(){
			$( this ).find( "> ul > li > a" ).each( function(){
				var thisUrl = $( this ).attr( "href" ) == "#" ? "" : getUrlPath( this.href );
				if( $( this ).hasClass( "has_sub" ) ){
					$( this ).click( function(){
						if( !$( this ).hasClass( "expanded" ) ) $( this ).addClass( "expanded" );
						else $( this ).removeClass( "expanded" );
						toggle_gnb( this );
						return false;
					});
				}

				$( this ).parent().find( "a" ).each( function(){
					var thisUrl = $( this ).attr( "href" ) == "#" ? "" : getUrlPath( this.href );
					if( thisUrl == curUrl ) {
						$( this ).addClass( "active" );
						$( this ).parent().parent().parent().parent().find( "> a" ).addClass( "expanded active" );
						toggle_gnb( $( this ).parent().parent().parent().parent().find( "> a" ) );
						MODEL.setPageName( $( this ).parent().parent().parent().parent().find( "> a > span" ).text() + " > " + $( this ).find( "> span" ).text() );
					}
				});
			});
		});
	}
	function getUrlPath( $url ){
		var tmpUrl = $url.split( "/view/" )[ 1 ].split( "/" );
		var result = "/";
		for( var Loop1 = 0 ; Loop1 < tmpUrl.length - 1 ; ++Loop1 ){
			result += tmpUrl[ Loop1 ] + "/";
		}
		return result;
	}
	function toggle_gnb( $tg ){
		var tg = $( $tg ).parent().find( "> .sub" );
		var ptg = $( $tg ).parents( ".sub" );
		if( $( $tg ).hasClass( "expanded" ) ) tg.stop().animate( { height : tg.find( "> ul" ).outerHeight() }, 400, "easeInOutExpo" );
		else tg.stop().animate( { height : 0 }, 400, "easeInOutExpo" );
		if( ptg ){
			if( $( $tg ).hasClass( "expanded" ) ) ptg.stop().animate( { height : ptg.find( "> ul" ).outerHeight() + tg.find( "> ul" ).outerHeight() }, 400, "easeInOutExpo" );
			else ptg.stop().animate( { height : ptg.find( "> ul" ).outerHeight() - tg.find( "> ul" ).outerHeight() }, 400, "easeInOutExpo" );
		}
	}

	// Locator & Page Title
	$( "#locator" ).each( function(){
		var siteTitle = MODEL.getSiteName() + " - ";
		var nav_1dp = $( "#aside > nav > ul > li > a" );
		var loc_1d = $( "<li class='item'><button type='button'><span>" + $( "#aside > nav > ul > li > a.active" ).text() + "</span></button><div class='sub'><div class='wrap'><ul></ul></div></div></li>" );
		$( this ).find( "> ul" ).append( loc_1d );
		$.each( nav_1dp, function( $id, $item ){
			if( $( $item ).hasClass( "active" ) ) siteTitle += $( $item ).text();
			addItem( $id, $item, loc_1d.find( ".sub ul" ) );
		});

		var nav_2dp = $( "#aside > nav > ul > li > a.active + .sub > ul > li > a" );
		if( nav_2dp.length > 0 ) {
			var loc_2d = $( "<li class='item'><button type='button'><span>" + $( "#aside > nav > ul > li > a.active + .sub > ul > li > a.active" ).text() + "</span></button><div class='sub'><div class='wrap'><ul></ul></div></div></li>" );
			$( this ).find( "> ul" ).append( loc_2d );
			$.each( nav_2dp, function( $id, $item ){
				if( $( $item ).hasClass( "active" ) ) siteTitle += " > " + $( $item ).text();
				addItem( $id, $item, loc_2d.find( ".sub ul" ) );
			});
		}

		$( this ).find( ".sub .wrap" ).scroller({});

		function addItem( $id, $item, $tg ){
			$tg.append( "<li><a class='" + ( $( $item ).hasClass( "active" ) ? "active" : "" ) + "'href='" + $( $item ).attr( "href" ) + "' onclick='gotoPage( this.href );return false;'><span>" + $( $item ).text() + "</span></a></li>" );
		};

		setPageTitle( siteTitle );
	});

	// Page Title
	$( "#page_title" ).each( function(){
		$( this ).text( $( "#aside > nav > ul > li > a.active" ).text() );
		if( $( "#aside > nav > ul > li > a.active + .sub > ul > li > a.active" ).length > 0 ) $( this ).text( $( "#aside > nav > ul > li > a.active + .sub > ul > li > a.active" ).text() );
	});

	// 팝업 백그라운드 클릭
	$( "#popup_container > .bg" ).click( function(){
		$( "#popup_container" ).find( ".popup_item:visible" ).each( function(){
			popupMngr.close( $( this ) );
		});
	});
	$( "#inPopup_container > .bg" ).click( function(){
		$( "#inPopup_container" ).find( ".inPopup_item:visible" ).each( function(){
			inPopupMngr.close( $( this ) );
		});
	});

	$( window ).resize( function(){
		$( ".popup_item" ).each( function(){
			//popupMngr.update( $( this ) );
		});
	});

	$( window ).scroll( hndl_scroll_aside );
	function hndl_scroll_aside(){
		$( ".aside_content" ).css( { "margin-left" : -$( window ).scrollLeft()  } );
	}
}