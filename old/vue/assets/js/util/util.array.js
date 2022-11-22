/*!
 *
 * @author: RSN R&D Team LHS(GUNI)
 *			h2dlhs@realsn.com
 *
 *
 **/




// Shuffle
Array.prototype.shuffle = function() {
	var curIdx = this.length, tempVal, rndIdx;
	while( 0 !== curIdx ) {
		rndIdx = Math.floor(Math.random() * curIdx);
		curIdx -= 1;
		tempVal = this[curIdx];
		this[curIdx] = this[rndIdx];
		this[rndIdx] = tempVal;
	}
}


// Array to String
Array.prototype.arrToParam = function( $sep ) {
	var arr = this;
	if( !$sep ) $sep = ",";
	var result = "";
	$.each( arr, function( $idx ){
		result += this;
		if( $idx < arr.length - 1 ) result += ",";
	});
	return result;
}