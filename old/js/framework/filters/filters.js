// 숫자에 콤마(,) 및 자리수
Vue.filter( "lengthLimitComma", function( $val, $limit ){
	var strNum = String( $val );
	if( $limit == null || $limit == undefined || $limit == "undefined" ) {
		strNum = strNum.addComma();
		return strNum;
	} else {
		var result = 0;
		var arrLimit = [ "", "k", "M", "G", "T", "P", "E", "Z", "Y" ];
		var spelIdx = Math.ceil( ( strNum.length - $limit ) / 3 );
		strNum = strNum.addComma();
		if( $val > 0 && strNum.length > 4 ) result = strNum.substr( 0, strNum.length - ( 4 * spelIdx ) ) + ( spelIdx >= 0 ? arrLimit[ spelIdx ] : "" );
		else result = $val;
		return result;
	}
});

Vue.filter( "dateToStr", function( $val, $sep ){
	if( !$sep ) $sep = "-";
	var date = new Date( $val );
	return date.getFullYear() + $sep + this.numAddZero( date.getMonth() + 1 ) + $sep + this.numAddZero( date.getDate() );
});

Vue.filter( "numAddZero", function( $val, $len ){
	if( !$len ) $len = 10;
	var len = String( $len ).length;
	var result = "";

	for( var Loop1 = 0 ; Loop1 < ( len - String( $val ).length ) ; ++Loop1 ){
		result += "0";
	}
	result += $val;
	return result;
});

Vue.filter( "sentiToHtml", function( $val ){
	if( $val == 1 ) return "<span class='fc_postive'>긍정</span>";
	else if( $val == 2 ) return "<span class='fc_negative'>부정</span>";
	else return "<span class='fc_neutral'>중립</span>";
});

