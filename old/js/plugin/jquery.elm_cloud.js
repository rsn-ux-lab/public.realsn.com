/*!
 *
 * @author: GUNI, h2dlhs@realsn.com
 **/
 
 
(function ($) {

	var cloudClass = function( $el, $options ) {

		
		var startDistance;
		var containerW;
		var containerH;
		var positions;
		var keepCnt;
		var $items;
		var $lineArea;

		var bla;


		this.init = function () {
			$el.width( $el.parent().width() );
			$el.height( $el.parent().height() );
			containerW = $el.outerWidth();
			containerH = $el.outerHeight();

			$lineArea = $el.find( ".line_area" );
			$lineArea.width( containerW );
			$lineArea.height( containerH );

			reset();
		}

		function reset(){
			$items = [];
			$el.find( "> .item" ).not( ".all, .line_area" ).each( function(){
				$items.push( this );
			});

			if( $options.shuffle ) $items.shuffle();

			build();
			buildLines();
			$el.find( "> *" ).fadeIn(600);
			$el.find( "> *" ).animate({opacity:1}, 600);
		}

		// **********		Build		************************************************************************************************ //
		function build(){
			var coords_1st = {
				x : ( containerW - $el.find( "> .all" ).outerWidth(true) ) / 2,
				y : ( containerH - $el.find( "> .all" ).outerHeight(true) ) / 2,
				w : $el.find( "> .all" ).outerWidth(true),
				h : $el.find( "> .all" ).outerHeight(true)
			};
			$el.find( "> .all" ).css( { top : coords_1st.y, left : coords_1st.x } );
			keepCnt = 0;
			positions = [];
			positions[ 0 ] = coords_1st;

			$.each( $items, function($idx){
				var coords = {
					w: $(this).outerWidth(true),
					h: $(this).outerHeight(true)
				};
				var success = false;
				var timeOutCnt = 0;
				var bulidCnt = 0;
				while (!success) {

					var angle = Math.random() * Math.PI * 2;
					var distance = $options.startDistance;

					if( timeOutCnt < 200 ) {
						if( $options.startDistance ) {
							distance = $options.startDistance;
						} else {
							distance = bulidCnt * 0.015;
						}
					} else if( timeOutCnt < 400 ) {
						if( $options.startDistance ) {
							distance = $options.startDistance - 0.4;
						} else {
							distance = ( bulidCnt * 0.015 ) - 0.4;
						}
					} else {
						if( $options.startDistance ) {
							distance = $options.startDistance + 0.4;
						} else {
							distance = ( bulidCnt * 0.015 ) + 0.4;
						}
					}

					coords.x = ( Math.cos(angle) * ( $el.outerWidth() * distance ) / 2 ) + ( coords_1st.x + ( coords_1st.w / 2 ) ) - ( coords.w / 2 ) ;
					coords.y = ( Math.sin(angle) * ( $el.outerHeight() * distance ) / 2 ) + ( coords_1st.y + ( coords_1st.h / 2 ) ) - ( coords.h / 2 );

					var success = true;
					$.each(positions, function(){
						if (
							coords.x <= (this.x + this.w) &&
							(coords.x + coords.w) >= this.x &&
							coords.y <= (this.y + this.h) &&
							(coords.y + coords.h) >= this.y
						) {
							success = false;
						}
					});


					timeOutCnt++;
					if( timeOutCnt > 240 ) {
						if( keepCnt == 0 ) {
							coords.x = containerW - coords.w;
							coords.y = -12;
						} else if( keepCnt == 1 ) {
							coords.x = containerW - coords.w;
							coords.y =  containerH - coords.h + 12;
						} else if( keepCnt == 2 ) {
							coords.x = 0;
							coords.y =  containerH - coords.h + 12;
						} else {
							coords.x = 0;
							coords.y = -12;
						}
						keepCnt++;
						success = false;
						break;
					}

					bulidCnt++;

				}

				if( coords.x < 0 ) coords.x = 0;
				if( ( coords.x + coords.w ) > containerW ) coords.x = containerW - coords.w;
				if( coords.y < 0 ) coords.y = 0;
				if( ( coords.y + coords.h ) > containerH ) coords.y = containerH - coords.h;

				positions.push(coords);
				$(this).css({
					top: coords.y + 'px',
					left: coords.x + 'px'
				});
			});
		}

		function buildLines() {
			var line;
			$lineArea.find( "*" ).remove();
			$lineArea.each( function(){
				$.each( $items, function($idx){
					var cx = containerW / 2;
					var cy = containerH / 2;
					var tx = parseInt( $( this ).css( "left" ) ) + parseInt( $( this ).outerWidth() / 2 );
					var ty = parseInt( $( this ).css( "top" ) ) + parseInt( $( this ).outerHeight() / 2 );
					var lineObj = $( "<div />" );
					$lineArea.append( lineObj );
					$.line({ x : cx, y : cy }, { x : tx, y : ty }, { elem : lineObj });
				});
			});
		}




		// **********		Hndler		************************************************************************************************ //





		// **********		Event		************************************************************************************************ //





		// **********		Out Method		************************************************************************************************ //
		this.update = function( $value ){
			reset();
		}



	};

	$.fn.elm_cloud = function ( $options ) {
		return this.each(function() {
			var cloud = new cloudClass( $( this ), $options );
			$.data( this, 'elm_cloud', cloud );
			$( document ).ready( cloud.init );
		});
	}
})(jQuery);
