/*!
 *
 * @author: RSN R&D Team LHS(GUNI)
 *			h2dlhs@realsn.com
 *
 *
 **/



// 날짜 > 텍스트 변환
Date.prototype.dateToStr = function( $sep ){
	if( !$sep ) $sep = "-";
	var date = new Date( this );
	return date.getFullYear() + $sep + ( date.getMonth() + 1 ).numAddZero() + $sep + ( date.getDate() ).numAddZero();
};

// 날짜/시간 > 날짜만
String.prototype.dateToOnlyDate = function(){
	return this ? this.split( " " )[ 0 ] : "";
};