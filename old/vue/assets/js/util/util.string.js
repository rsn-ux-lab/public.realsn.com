/*!
 *
 * @author: RSN R&D Team LHS(GUNI)
 *			h2dlhs@realsn.com
 *
 *
 **/



// Replace
String.prototype.replaceAll = function( $rgExp, $replaceText ){
	var oStr = this;
	while (oStr.indexOf($rgExp) > -1)
	oStr = oStr.replace($rgExp, $replaceText);
	return oStr;
}

// 말줄임
String.prototype.lengthLimit = function( $limit ) {
	var result = this;
	if( result.length > $limit ) result = result.substr( 0, $limit ) + "...";
    return result;
}

// Parameter형태를 Json형태로 변환
String.prototype.paramToJson = function() {
	var param = this;
    var hash;
    var result = {};
    var hashes = param.slice( param.indexOf( "?" ) + 1 ).split( "&" );
    for( var Loop1 = 0 ; Loop1 < hashes.length ; ++Loop1 ) {
        hash = hashes[ Loop1 ].split('=');
        result[ hash[ 0 ] ] = hash[ 1 ];
    }
    return result;
}

// 날짜 계산
String.prototype.dateCalculator = function( $gap ){
	$gap = String( $gap );
	var tmpDate = new Date( this );
	var gap;
	if( $gap.toUpperCase().indexOf( "Y" ) >= 0 ) {
		gap = parseInt( $gap.toUpperCase().split( "Y" )[ 0 ] );
		tmpDate.setFullYear( tmpDate.getMonth() + gap );
	} else if( $gap.toUpperCase().indexOf( "M" ) >= 0 ) {
		gap = parseInt( $gap.toUpperCase().split( "M" )[ 0 ] );
		tmpDate.setMonth( tmpDate.getMonth() + gap );
	} else {
		gap = parseInt( $gap );
		if( gap < 0 ) gap += 1;
		else gap -= 1;
		tmpDate.setDate( tmpDate.getDate() + gap );
	}
	return tmpDate.getFullYear() + "-" + ( tmpDate.getMonth() + 1 ).numToStr_addZero() + "-" + tmpDate.getDate().numToStr_addZero();
}
