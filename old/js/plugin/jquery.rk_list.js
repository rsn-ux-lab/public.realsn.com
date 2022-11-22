/*!
 *
 * @author: GUNI, h2dlhs@realsn.com
 **/
 
 
(function ($) {

	var rlClass = function( $el, $options ) {

		
		var _data;

		var containerW;
		var containerH;
		var $items;


		this.init = function () {
			reset();
		}

		function reset(){
			containerW = $el.find( "> ul" ).outerWidth();
			containerH = $el.find( "> ul" ).outerHeight();
			$items = [];
			$el.find( "> ul > *" ).remove();

			if( _data ) build();
		}

		// **********		Build		************************************************************************************************ //
		function build(){
			$.each( _data, function(){
				var item = buildItem( this );
				$el.find( "> ul" ).append( item );
				setItem( item.find( ".item" ) );
				$items.push( item );
				item.find( ".item" ).animate( { opacity : 1 }, 200 );
			});
		}

		function buildItem( $data ){
			var item = $( "<li><a href='#' class='item' title='" + $data.title + "'><span class='txt'>" + $data.title + "</span>(<span class='ui_numeric'>" + $data.volume + "</span>)</a></li>" );
			var tag_a = item.find( "> a" );
			// data attribute
			var data_attribute_keys = [];
			for( var Loop1 = 0 ; Loop1 < Object.keys( $data ).length ; ++Loop1 ){
				if( Object.keys( $data )[ Loop1 ].indexOf( "data" ) > -1 ) data_attribute_keys.push( Object.keys( $data )[ Loop1 ] );
			}
			for( var Loop1 = 0 ; Loop1 < data_attribute_keys.length ; ++Loop1 ){
				tag_a.attr( data_attribute_keys[ Loop1 ], $data[ data_attribute_keys[ Loop1 ] ] );
			}

			// click Event
			if( $data.click ) tag_a.click( $data.click );
			return item;
		}

		function setItem( $tg ){
			var item = $( $tg );
			if( item.outerWidth() > containerW ){
				item.css( "width", containerW );
				item.find( ".txt" ).css( "width", containerW - item.find( ".ui_numeric" ).outerWidth() - 35 );
			} else {
				var posX = Math.random() * 50;
				if( posX + item.outerWidth() > containerW ){
					posX = containerW - item.outerWidth();
				}
				item.css( "margin-left", posX );
			}
		}




		// **********		Hndler		************************************************************************************************ //





		// **********		Event		************************************************************************************************ //





		// **********		Out Method		************************************************************************************************ //
		this.update = function( $value ){
			_data = $value;
			reset();
		}



	};

	$.fn.rk_list = function ( $options ) {
		return this.each(function() {
			var rk_list = new rlClass( $( this ), $options );
			$.data( this, 'rk_list', rk_list );
			$( document ).ready( rk_list.init );
		});
	}
})(jQuery);
