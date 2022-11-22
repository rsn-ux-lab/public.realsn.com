var comp_bubble_lnk = {
	template:"\
		<div>\
			<a :href='href' target='_blank' class='ui_lnk' :data-bubble-id='\"bubble_\" + id'><span v-html='title'></span></a>\
			<div class='ui_bubble_box' :data-bubble-for='\"bubble_\" + id' :data-pos='pos' :data-fixed='fixed == \"true\" ? \"true\" : \"false\"' :style='bb_style'>\
				<span class='arrow'>-</span>\
				<div class='brd_info'>\
					<strong v-if='title' class='title' v-html='strToHlStr( title, keyword )'></strong>\
					<span class='txt' v-if='txt' v-html='strToHlStr( txt, keyword )'></span>\
				</div>\
			</div>\
		</div>\
	",
	data: function(){
		return {
			activeChk: false,
			bubbleBox: null,
			code: null,
			btn: null
		};
	},
	props: [ "id", "title", "txt", "action", "pos", "bb_style", "fixed", "keyword", "href" ],
	computed: {
	},
	mounted: function (){
		var _this = this;
		_this.bubbleBox = $( _this.$el ).find( ".ui_bubble_box" );
		_this.code = _this.bubbleBox.attr( "data-bubble-for" );
		_this.btn = $( _this.$el ).find( "*[data-bubble-id]" );

		if( _this.action == "click" ){
			_this.btn.click( function(){
				_this.activeChk = !_this.activeChk;
				_this.hndl_bubbleBox();
			});
		} else {
			_this.btn.hover( function( $e ){
				if( $e.type == "mouseenter" ) _this.activeChk = true;
				else _this.activeChk = false;
				_this.hndl_bubbleBox();
			});
		}

		if( this.fixed == "true" ) {
			$( window, "*" ).unbind( "scroll", this.hndl_bubbleBox ).scroll( this.hndl_bubbleBox );
			$( window ).unbind( "resize", this.hndl_bubbleBox ).resize( this.hndl_bubbleBox );
		}
	},
	watch: {
	},
	methods: {
		hndl_bubbleBox: function(){
			if( this.activeChk ){
				var pos = this.getPos();
				this.bubbleBox.css( { "top" : pos.top, "left" : pos.left } ).stop().fadeIn( 120 );
				this.btn.addClass( "active" );
			} else {
				this.bubbleBox.stop().fadeOut( 120 );
				this.btn.removeClass( "active" );
			}
		},
		getPos: function(){
			var result = {};
			var space = 11;

			if( this.fixed == "true" ) {
				if( this.pos.indexOf( "T" ) >= 0 ) {
					result.top = this.btn[ 0 ].getBoundingClientRect().top - this.bubbleBox.outerHeight() - space;
				} else if( this.pos.indexOf( "B" ) >= 0 ) {
					result.top =  this.btn[ 0 ].getBoundingClientRect().top +  this.btn.outerHeight() + space;
				}
				if( this.pos.indexOf( "L" ) >= 0 ) {
					result.left =  this.btn[ 0 ].getBoundingClientRect().left;
					if(  this.bubbleBox.attr( "data-arrowcenter" ) == "true" ) {
						var posX = result.left -  this.btn[ 0 ].getBoundingClientRect().left + (  this.btn.outerWidth() / 2 ) - (  this.bubbleBox.find( ".arrow" ).outerWidth() / 2 );
						 this.bubbleBox.find( ".arrow" ).css( "left", posX );
					}
				} else if( this.pos.indexOf( "R" ) >= 0 ) {
					result.left =  this.btn[ 0 ].getBoundingClientRect().left +  this.btn.outerWidth() -  this.bubbleBox.outerWidth();
					if(  this.bubbleBox.attr( "data-arrowcenter" ) == "true" ) {
						var posX =  this.btn[ 0 ].getBoundingClientRect().left - result.left + (  this.btn.outerWidth() / 2 ) - (  this.bubbleBox.find( ".arrow" ).outerWidth() / 2 );
						 this.bubbleBox.find( ".arrow" ).css( "left", posX );
					}
				} else if( this.pos.indexOf( "C" ) >= 0 ) {
					result.left = (  this.btn[ 0 ].getBoundingClientRect().left + (  this.btn.outerWidth() / 2 ) ) - (  this.bubbleBox.outerWidth() / 2 );
				}
			} else {
				if( this.pos.indexOf( "T" ) >= 0 ) {
					result.top = this.btn.position().top - this.bubbleBox.outerHeight() - space;
				} else if( this.pos.indexOf( "B" ) >= 0 ) {
					result.top = this.btn.position().top + this.btn.outerHeight() + space;
				}
				if( this.pos.indexOf( "L" ) >= 0 ) {
					result.left = this.btn.position().left;
					if( this.bubbleBox.attr( "data-arrowcenter" ) == "true" ) {
						var posX = result.left - this.btn.position().left + ( this.btn.outerWidth() / 2 ) - ( this.bubbleBox.find( ".arrow" ).outerWidth() / 2 );
						this.bubbleBox.find( ".arrow" ).css( "left", posX );
					}
				} else if( this.pos.indexOf( "R" ) >= 0 ) {
					result.left = this.btn.position().left + this.btn.outerWidth() - this.bubbleBox.outerWidth();
					if( this.bubbleBox.attr( "data-arrowcenter" ) == "true" ) {
						var posX = this.btn.position().left - result.left + ( this.btn.outerWidth() / 2 ) - ( this.bubbleBox.find( ".arrow" ).outerWidth() / 2 );
						this.bubbleBox.find( ".arrow" ).css( "left", posX );
					}
				} else if( this.pos.indexOf( "C" ) >= 0 ) {
					result.left = ( this.btn.position().left + ( this.btn.outerWidth() / 2 ) ) - ( this.bubbleBox.outerWidth() / 2 );
				}
			}
			return result;
		},
		strToHlStr: function( $val, $txt ){
			var result = $val;
			if( Array.isArray( $txt ) ) {
				for( var Loop1 = 0 ; Loop1 < $txt.length ; ++Loop1 ){
					var reg = new RegExp( $txt[ Loop1 ], "gi" );
					result = result.replace( reg, function( $txt ){
						if( $txt.length > 0 ) return "<span class=\"hl\">" + $txt + "</span>"
						return $txt;
					});
				}
				return result;
			} else {
				return $val.replace( $txt, "<span class=\"hl\">" + $txt + "</span>" );
			}
		}
	}
};