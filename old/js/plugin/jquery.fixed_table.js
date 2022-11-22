/*!
 *
 * @author: GUNI, h2dlhs@realsn.com
 **/
 
 
(function ($) {

	var fixedTableClass = function( $el, $options ) {

		
		var $fixedItems;
		var $container;
		var elm_footer;


		this.init = function () {
			$el.css( { "position" : "relative" } );

			new MutationObserver( function( $e ) {
				reset();
			}).observe( $el.find( "table" )[ 0 ], { childList: true, characterData: true, subtree: true });

			reset();
		}

		function reset(){
			$el.find( ".fixed_table_items" ).remove();
			$container = $( "<div class='fixed_table_items' />" );
			$container.css({
				"position" : "absolute",
				"float" : "left",
				"top" : 0,
				"left" : 0,
				"height" : 0,
				"pointer-events" : "none"
			});
			$el.find( "> .wrap" ).append( $container );

			$fixedItems = $el.find( ".fixed" );
			$fixedItems.each( function(){
				var dummy = $( this.copyElement() );
				dummy.css({
					"position" : "absolute",
					"top" : Math.floor( $( this ).position().top ) < 0 ? Math.floor( $( this ).position().top ) + Math.abs( Math.floor( $el.find( "table" ).position().top ) ) + 1 : Math.floor( $( this ).position().top ),
					"left" : Math.floor( $( this ).position().left ) + Math.abs( Math.floor( $el.find( "table" ).position().left ) ),
					"width" : $( this ).outerWidth() + "px",
					"height" : $( this ).outerHeight() + "px",
					"box-sizing" : "border-box",
					"line-height" : $( this ).outerHeight() - parseInt( $( this ).css( "padding-top" ) ) - parseInt( $( this ).css( "padding-bottom" ) ) + "px"
				});
				switch( $( this ).attr( "data-fixed-pos" ) ){
					case "bottom" :
						dummy.css({ "top" : $el.find( ".wrap" ).outerHeight() - $( this ).outerHeight() - 1 });
						break;
					case "right" :
						dummy.css({ "left" : $el.find( ".wrap" ).outerWidth() - $( this ).outerWidth() - 1 });
						if( $( this ).attr( "data-left-bd" ) == "on" ) {
							dummy.addClass( "on_left_bd" );
							dummy.css( "width", Math.floor( $( this ).outerWidth() ) + 1 );
						}
						break;
				}
				$container.append( dummy );
			});
		}
		// **********		Build		************************************************************************************************ //




		// **********		Hndler		************************************************************************************************ //





		// **********		Event		************************************************************************************************ //





		// **********		Out Method		************************************************************************************************ //
		this.update = function( $value ){
			reset();
		}



	};

	$.fn.fixed_table = function ( $options ) {
		return this.each(function() {
			var ft = new fixedTableClass( $( this ), $options );
			$.data( this, 'fixed_table', ft );
			$( document ).ready( ft.init );
		});
	}
})(jQuery);
