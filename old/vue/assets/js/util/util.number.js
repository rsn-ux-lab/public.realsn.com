/*!
 *
 * @author: RSN R&D Team LHS(GUNI)
 *			h2dlhs@realsn.com
 *
 *
 **/


// 오버되는 자릿수 K/M으로 대체 및 3자리마다 콤마(,) 추가
Number.prototype.lengthLimitComma = function( $limit ) {				// $limit : 오버되는 자릿수
	var result = 0;
	var arrLimit = [ "", "k", "M", "G", "T", "P", "E", "Z", "Y" ];
	var strNum = String( this );
	var spelIdx = Math.ceil( ( strNum.length - $limit ) / 3 );
	strNum = strNum.addComma();
	if( this > 0 && strNum.length > 4 ) result = strNum.substr( 0, strNum.length - ( 4 * spelIdx ) ) + arrLimit[ spelIdx ];
	else result = this;
	return result;
}

// 오버되는 자릿수 제한
Number.prototype.lengthLimit = function( $limit ) {							
	var txtNum = '' + this;
	var result = txtNum;
	if( txtNum.length > $limit ){
		result = txtNum.substr( 0, txtNum.length - $limit );
	}
	return parseInt( result );
}

// ,추가(3자리 기준)
String.prototype.addComma = function() {
    var txtNumber = '' + this;
    if (isNaN(txtNumber) || txtNumber == "") {
        //alert("숫자만 입력 하세요");
        return;
    }
    else {
        var rxSplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
        var arrNumber = txtNumber.split('.');
        arrNumber[0] += '.';
        do {
            arrNumber[0] = arrNumber[0].replace(rxSplit, '$1,$2');
        } while (rxSplit.test(arrNumber[0]));
 
        if (arrNumber.length > 1) {
            return arrNumber.join('');
        }
        else {
            return arrNumber[0].split('.')[0];
        }
    }
}

// 자리수 $len 이하 0붙임
Number.prototype.numToStr_addZero  = function( $len ){
	if( !$len ) $len = 2;
	var result = String( this );

	if( result.length < $len ) {
		var len = $len - result.length;
		for( var Loop1 = 0 ; Loop1 < len ; ++Loop1 ){
			result = "0" + result;
		}
	}


	return result;
}


// 숫자에 0 더하기
Number.prototype.numAddZero = function( $len ){
	if( !$len ) $len = 10;
	var len = String( $len ).length;
	var result = "";

	for( var Loop1 = 0 ; Loop1 < ( len - String( this ).length ) ; ++Loop1 ){
		result += "0";
	}
	result += this;
	return result;
};