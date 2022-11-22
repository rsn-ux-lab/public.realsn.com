/*!
 *
 * @author: GUNI, h2dlhs@realsn.com
 **/
 
 
(function ($) {

	var scrollerClass = function( $el, $options ) {

		
		var scrollWrap;
		var scrollCon;
		var scrollBar;

		var scrollPos = 0;
		var scrollPosTmp = 0;
		var scrollPer = 0;
		var scrollMove = 0;
		

		this.init = function () {
			build();
		}

		// **********		Build		************************************************************************************************ //
		function build(){
			if( !( $el.css( "position" ) == "relative" ) && !( $el.css( "position" ) == "absolute" ) ) $el.css( { "position" : "relative" } );
			scrollWrap = $( "<div class='ui_scroller'></div>" )
			scrollCon = $el.find( "> *" );
			scrollBar = $( "<div class='bar'></div>" );
			scrollWrap.css( "display", "none" );
			scrollWrap.append( scrollBar );
			$el.append( scrollWrap );
			$el.css( { "overflow" : "hidden" } );
			var barHgt = ( parseInt( ( $el.outerHeight() / $el.find( "> *" ).outerHeight() ) * 100 ) > 100 ? 100 : parseInt( ( $el.outerHeight() / $el.find( "> *" ).outerHeight() ) * 100 ) ) + "%";
			scrollBar.css( "height", barHgt );

			if( barHgt != "100%" ) {
				scrollWrap.fadeIn();
				$el.bind( "mousewheel", evt_wheel );

				scrollBar.draggable({ 
					axis: "y", 
					containment: "parent",
					start: hndl_scrollMove,
					drag: hndl_scrollMove,
					stop: hndl_scrollMove
				});
			}
		}




		// **********		Hndler		************************************************************************************************ //
		function hndl_scrollWheel( $type ){
			if( $type == "up" ) scrollPos += 100;
			else scrollPos -= 100;
			if( scrollPos > 0 ) scrollPos = 0; 
			if( scrollPos < -( $el.find( "> *" ).outerHeight() - $el.outerHeight() ) ) scrollPos = -( $el.find( "> *" ).outerHeight() - $el.outerHeight() );
			scrollPer = Math.abs( scrollPos * ( scrollWrap.outerHeight() - scrollBar.outerHeight() ) / ( $el.find( "> *" ).outerHeight() - $el.outerHeight() ) );
			if( scrollPosTmp != scrollPos ) {
				scrollCon.stop().animate( { "margin-top" : scrollPos }, 200, "easeInOutQuad" );
				scrollBar.stop().animate( { "top" : scrollPer }, 200, "easeInOutQuad" );
			}
			scrollPosTmp = scrollPos;
		}
		function hndl_scrollMove(){
			scrollMove = -parseInt( scrollBar.css( "top" ) ) * ( $el.find( "> *" ).outerHeight() - $el.outerHeight() ) / ( scrollWrap.outerHeight() - scrollBar.outerHeight() );
			scrollPos = scrollMove;
			scrollCon.css( { "margin-top" : scrollMove } );
		}




		// **********		Event		************************************************************************************************ //
		function evt_wheel( $e ){
			if( $e.originalEvent.wheelDelta / 120 > 0 ) {
				hndl_scrollWheel( "up" );
				if( parseInt( scrollBar.css( "top" ) ) > 0 ) return false;
			} else {
				hndl_scrollWheel( "down" );
				if( parseInt( scrollBar.css( "top" ) ) < ( scrollWrap.outerHeight() - scrollBar.outerHeight() )  ) return false;
			}
		}





		// **********		Out Method		************************************************************************************************ //
		/*this.reLoad = function( $value ){
			$options.jsonDataUrl = $value;
			dataLoad();
		}*/



	};

	$.fn.scroller = function ( $options ) {
		return this.each(function() {
			var scroller = new scrollerClass( $( this ), $options );
			$.data( this, 'scroller', scroller );
			$( document ).ready( scroller.init );
		});
	}
})(jQuery);
