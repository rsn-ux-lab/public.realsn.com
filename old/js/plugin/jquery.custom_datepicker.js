/*!
 *
 * @author: GUNI, h2dlhs@realsn.com
 **/
 
 
(function ($) {

	var dpClass = function( $el, $options ) {

		var cal;
		var calWrap;
		var calWrap_datewrap;
		var calWrap_calwrap;
		var calWrap_timewrap;
		var calWrap_timewrap_time_00;
		var calWrap_timewrap_time_01;
		var calWrap_year;
		var calWrap_month;
		var calWrap_date;
		var calWrap_day;

		var btnsGrp;
		var btnsGrp_prv_y;
		var btnsGrp_prv_m;
		var btnsGrp_nxt_m;
		var btnsGrp_nxt_y;

		var calDate;
		var time;
		var arrMonths = [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ];
		var arrDays = [ "일", "월", "화", "수", "목", "금", "토" ];


		this.init = function () {
			time = ( $el.data( "time" ) ) ? $el.data( "time" ) : null;

			buildCalendar();

			$( window, "*" ).scroll( hndl_pos );
			$( window ).resize( hndl_pos );
		}

		// **********		Build		************************************************************************************************ //
		function buildCalendar(){
			cal = $( "<div class='ui_calendar'></div>" );
			calWrap_datewrap = $( "<div class='date_wrap'></div>" );
			calWrap_calwrap = $( "<div class='calendar_wrap'></div>" );
			calWrap_day = $( "<div class='day'></div>" );
			calWrap_month = $( "<div class='month'></div>" );
			calWrap_date = $( "<div class='date'></div>" );
			calWrap_year = $( "<div class='year'></div>" );

			cal.append( calWrap_day );
			cal.append( calWrap_datewrap );
			cal.append( calWrap_calwrap );
			calWrap_datewrap.append( calWrap_month );
			calWrap_datewrap.append( calWrap_date );
			calWrap_datewrap.append( calWrap_year );

			// Time 옵션이 있을경우에 Time 활성화
			if( time ){
				calWrap_timewrap = $( "<div class='time_wrap'><strong>시간</strong><div class='wrap'></div></div>" );
				calWrap_timewrap_time_00 = build_time( "hour" );
				calWrap_timewrap_time_01 = build_time( "min" );
				calWrap_timewrap_time_00.find( "select" ).change( evt_timeChange );
				calWrap_timewrap_time_01.find( "select" ).change( evt_timeChange );
				cal.append( calWrap_timewrap );
				calWrap_timewrap.find( ".wrap" ).append( calWrap_timewrap_time_00 );
				calWrap_timewrap.find( ".wrap" ).append( calWrap_timewrap_time_01 );
				calWrap_timewrap_time_00.find( "select" ).val( parseInt( time.split( ":" )[ 0 ] ) );
				calWrap_timewrap_time_01.find( "select" ).val( parseInt( time.split( ":" )[ 1 ] ) );
			}

			btnsGrp = $( "<div class='btns_grp'></div>" );
			btnsGrp_prv_y = $( "<button class='btn_prv_y' title='이전년도'><span class='icon'>이전년도</span></button>" );
			btnsGrp_prv_m = $( "<button class='btn_prv_m' title='이전달'><span class='icon'>이전월</span></button>" );
			btnsGrp_nxt_m = $( "<button class='btn_nxt_m' title='다음달'><span class='icon'>다음월</span></button>" );
			btnsGrp_nxt_y = $( "<button class='btn_nxt_y' title='다음년도'><span class='icon'>다음년도</span></button>" );
			btnsGrp.append( btnsGrp_prv_y );
			btnsGrp.append( btnsGrp_prv_m );
			btnsGrp.append( btnsGrp_nxt_m );
			btnsGrp.append( btnsGrp_nxt_y );
			cal.append( btnsGrp );

			btnsGrp_prv_y.click( evt_prv_y );
			btnsGrp_prv_m.click( evt_prv_m );
			btnsGrp_nxt_m.click( evt_nxt_m );
			btnsGrp_nxt_y.click( evt_nxt_y );

			//$( "body" ).append( cal );
			$el.append( cal );
			$el.bind( "update", evt_update );
			calWrap = cal.find( ".calendar_wrap" );
			calWrap.datepicker({
				dateFormat: "yy-mm-dd",
				monthNames: arrMonths,
				dayNamesMin: arrDays,
				onChangeMonthYear: hndl_renderCal,
				onSelect: evt_onSelect
			});

			hndl_renderCal();
			hndl_pos();

			ui_reset( $el );
		}

		function build_time( $type ){
			var len = 23;
			var typeStr = "시";
			if( $type == "min" ){
				len = 59;
				typeStr = "분";
			}
			var idx = "time_" + ( Math.random() * 10000000 );
			var result = $( "<div class='dcp'></div>" );
			var sel = $( "<select id='" + idx + "' class='ui_select'></select>" );
			var label = $( "<label for=" + idx + "></label>" );
			
			for( var Loop1 = 0 ; Loop1 <= len ; ++Loop1 ){
				var item = $( "<option value=" + Loop1 + ">" + Loop1.numToStr_addZero() + typeStr + "</option>" );
				sel.append( item );
			}

			result.append( sel );
			result.append( label );
			return result;
		}



		// **********		Hndler		************************************************************************************************ //
		function hndl_renderCal(){
			calDate = calWrap.datepicker( "getDate" );

			calWrap_day.html( arrDays[ calDate.getDay() ] + "요일" );
			calWrap_month.html( arrMonths[ calDate.getMonth() ] );
			calWrap_date.html( calDate.getDate() );
			calWrap_year.html( calDate.getFullYear() );

			calWrap.find( "td" ).each(function() {
				var $this = $(this);
				$this.html( $this.html().replace(/&nbsp;/g, '') );
			});

			//evt_timeChange();
		}

		function hndl_pos(){
			if( !cal.is( ":visible" ) ) return;
			if( cal.css( "position" ) == "fixed" ) {
				var pos = {};
				$el[ 0 ].getBoundingClientRect()
				pos.top = $el[ 0 ].getBoundingClientRect().top + $el.find( ".ui_datepicker_input" ).outerHeight();
				pos.left = $el[ 0 ].getBoundingClientRect().left;
				cal.css( { top : pos.top, left : pos.left } );
			} else {
				var pos = {};
				$el.position()
				pos.top = $el.position().top + $el.find( ".ui_datepicker_input" ).outerHeight();
				pos.left = $el.position().left;
				cal.css( { top : pos.top, left : pos.left } );
			}
		}





		// **********		Event		************************************************************************************************ //
		function evt_prv_y(){
			$.datepicker._adjustDate( calWrap, -1, 'Y' );
			return false;
		}
		function evt_prv_m(){
			$.datepicker._adjustDate( calWrap, -1, 'M' );
			return false;
		}
		function evt_nxt_m(){
			$.datepicker._adjustDate( calWrap, +1, 'M' );
			return false;
		}
		function evt_nxt_y(){
			$.datepicker._adjustDate( calWrap, +1, 'Y' );
			return false;
		}

		function evt_onSelect(){
			hndl_renderCal();
			if( $options && $options.dateChange ) $options.dateChange( $el );
		}

		function evt_timeChange(){
			if( time ) {
				$el.attr( "data-date", calWrap.datepicker().val() + " " + calWrap_timewrap_time_00.find( "select" ).val() + ":" + calWrap_timewrap_time_01.find( "select" ).val() );
				if( $options && $options.dateChange ) {
					$options.dateChange( $el );
				}
				hndl_renderCal();
			}
		}

		function evt_update( $e, $date ){
			if( time ){
				calWrap.datepicker( "setDate", $date.split( " " )[ 0 ] );
				calWrap_timewrap_time_00.find( "select" ).val( $date.split( " " )[ 1 ].split( ":" )[ 0 ] );
				calWrap_timewrap_time_01.find( "select" ).val( $date.split( " " )[ 1 ].split( ":" )[ 1 ] );
				calWrap_timewrap_time_00.find( "select" ).trigger( "change" );
				calWrap_timewrap_time_01.find( "select" ).trigger( "change" );
			} else {
				calWrap.datepicker( "setDate", $date );
			}

			hndl_renderCal();
			evt_onSelect();
			if( $options && $options.dateChange ) $options.dateChange( $el );
		}





		// **********		Out Method		************************************************************************************************ //

		// Get Date ( return : YYYY-MM-DD )
		this.getDate = function(){
			var result = calWrap.datepicker().val();
			//if( time ) result = result + " " + parseInt( calWrap_timewrap_time_00.find( "select" ).val() ).numToStr_addZero() + ":" + parseInt( calWrap_timewrap_time_01.find( "select" ).val() ).numToStr_addZero(); 
			return result;
		}

		// Set Date ( YYYY-MM-DD )
		this.setDate = function( $date ){
			calWrap.datepicker( "setDate", $date );
			hndl_renderCal();
			if( $options && $options.dateChange ) $options.dateChange( $el );
		}

		// Get Time ( 00:00 );
		this.getTime = function(){
			var result = parseInt( calWrap_timewrap_time_00.find( "select" ).val() ).numToStr_addZero() + ":" + parseInt( calWrap_timewrap_time_01.find( "select" ).val() ).numToStr_addZero()
			//if( time ) result = result + " " + parseInt( calWrap_timewrap_time_00.find( "select" ).val() ).numToStr_addZero() + ":" + parseInt( calWrap_timewrap_time_01.find( "select" ).val() ).numToStr_addZero(); 
			return result;
		}

		// Set MinDate ( Value )
		this.setMinDate = function( $value ){
			calWrap.datepicker( "option", "minDate", $value );
			hndl_renderCal();
		}
		// Set MaxDate ( Value )
		this.setMaxDate = function( $value ){
			calWrap.datepicker( "option", "maxDate", $value );
			hndl_renderCal();
		}

		// Option Setting ( Attribute, Value )
		this.option = function( $attr, $value ){
			calWrap.datepicker( "option", $attr, $value );
			hndl_renderCal();
		}

		// Datepicker On
		this.show = function( $value ){
			cal.fadeIn( 120 );
			hndl_renderCal();
			hndl_pos();
		}

		// Datepicker Off
		this.hide = function( $value ){
			hndl_renderCal();
			cal.fadeOut( 120 );
		}
	};

	$.fn.c_datepicker = function ( $options ) {
		return this.each(function() {
			var dp = new dpClass( $( this ), $options );
			$.data( this, 'c_datepicker', dp );
			$( document ).ready( dp.init );
		});
	}
})(jQuery);
