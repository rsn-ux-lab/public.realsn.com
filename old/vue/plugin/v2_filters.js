// 사용자 권한 체크
Vue.filter( "userDisAuthCheck", function( $val ){
    var authLevel = store.state.session.level;

    if( $val ) {
        if( typeof( $val ) == "string" ) {
            if( $val == authLevel ) return true;
        } else {
            for( var Loop1 = 0 ; Loop1 < $val.length ; ++Loop1 ){
                if( $val[ Loop1 ] == authLevel ) return true;
            }
        }
        return false;
    } else {
        return false;
    }

});

// 텍스트 변환
Vue.filter( "replaceAll", function( $val, $rgExp, $replaceText ){
    var rgExp = new RegExp( $rgExp, 'gi' );
    return $val.replace( rgExp, $replaceText);
});

// 자릿수 제한
Vue.filter( "lengthLimit", function( $val, $limit ){
    return $val.slice( 0, $limit ? $limit : $val.length ) + ( $limit < $val.length ? "..." : "");
});

// 숫자에 0 더하기
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

// 숫자에 콤마
Vue.filter( "addComma", function( $val, $digits ){
    var txtNumber = '' + $val;
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
});

// 숫자에 콤마(,) 및 소수점 자리수
Vue.filter( "lengthLimitComma", function( $val, $digits ){
    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if ($val >= si[i].value) {
            break;
        }
    }
    return ($val / si[i].value).toFixed($digits).replace(rx, "$1") + si[i].symbol;
});

// 파라미터 > Object
Vue.filter( "paramToObj", function( $val ){
    var result ={};
    $val.split( "&" ).filter( function( item ){
        console.log( item );
    });

    return result;
});
// 파라미터 가져오기
Vue.filter( "getParameter", function( $val ){
    var params = location.href.split( "?" ).length > 1 ? location.href.split( "?" )[ 1 ].split( "&" ) : [];
    var result;
    if( params ) {
        params.filter( function( a ){
            if( a.split( "=" )[ 0 ] == $val ) result = a.split( "=" )[ 1 ];
        });
    }

    return result;
});

// 날짜 > 텍스트 변환
Vue.filter( "dateToStr", function( $val, $format, $sep ){
    if( $val == "" || !$val ) return $val;

    var result = "";
    if( !$sep ) $sep = "-";
    if( !$format ) $format = "YYYY-MM-DD";

    var year, month, date, hour, min, sec;
    if( typeof( $val ) == "string" ) {
        year = $val.split( " " ).length > 1 ? $val.split( " " )[ 0 ].split( "-" )[ 0 ] : $val.split( "-" )[ 0 ]; 
        month = ( $val.split( " " ).length > 1 ? $val.split( " " )[ 0 ].split( "-" )[ 1 ] : $val.split( "-" )[ 1 ] ) - 1;
        date = $val.split( " " ).length > 1 ? $val.split( " " )[ 0 ].split( "-" )[ 2 ] : $val.split( "-" )[ 2 ]; 
        hour = $val.split( " " ).length > 1 ? $val.split( " " )[ 1 ].split( ":" )[ 0 ] : "00";                   
        min = $val.split( " " ).length > 1 ? $val.split( " " )[ 1 ].split( ":" )[ 1 ] : "00";                    
        sec = $val.split( " " ).length > 1 ? $val.split( " " )[ 1 ].split( ":" )[ 2 ] : "00";                    
    } else {
        year = $val.getFullYear();
        month = $val.getMonth();
        date = $val.getDate();
        hour = $val.getHours();
        min = $val.getMinutes();
        sec = $val.getSeconds();
    }
    var date = new Date( year, month, date, hour, min, sec );
    //var date = new Date( $val );

    if( $format.indexOf( "YYYY" ) >= 0 ) result += date.getFullYear();
    else if( $format.indexOf( "YY" ) >= 0 ) result += date.getFullYear().substr( 2,2 );

    if( $format.indexOf( "MM" ) >= 0 ) {
        if( result != "" ) result += $sep;
        result += ( date.getMonth() + 1 ).numToStr_addZero();
    }

    if( $format.indexOf( "DD" ) >= 0 ) {
        if( result != "" ) result += $sep;
        result += date.getDate().numToStr_addZero();
    }

    if( $format.indexOf( "hh" ) >= 0 ) {
        if( result != "" ) result += " ";
        result += date.getHours().numToStr_addZero();
    }

    if( $format.indexOf( "mm" ) >= 0 ) {
        if( result != "" ) result += ":";
        result += date.getMinutes().numToStr_addZero();
    }

    if( $format.indexOf( "ss" ) >= 0 ) {
        if( result != "" ) result += ":";
        result += date.getSeconds().numToStr_addZero();
    }

    return result;
});
// 텍스트 > 날짜 변환
Vue.filter( "strToDate", function( $val ){
    var arr = $val.split( "-" );
    var year, month, date;
    year = arr[ 0 ] ? arr[ 0 ] : "";
    month = arr[ 1 ] ? arr[ 1 ] : "";
    date = arr[ 2 ] ? arr[ 2 ] : "";

    return new Date( year, month - 1, date );
});
// 주차
Vue.filter( "getWeek", function( $val, $dowOffset ){
    $dowOffset = typeof($dowOffset) == 'number' ? $dowOffset : 0; //default $dowOffset to zero
    var newYear = new Date($val.getFullYear(),0,1);
    var day = newYear.getDay() - $dowOffset; //the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
    var daynum = Math.floor(($val.getTime() - newYear.getTime() -
    ($val.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
    var weeknum;
    //if the year starts before the middle of a week
    if(day < 4) {
    weeknum = Math.floor((daynum+day-1)/7) + 1;
    if(weeknum > 52) {
        let nYear = new Date($val.getFullYear() + 1,0,1);
        let nday = nYear.getDay() - $dowOffset;
        nday = nday >= 0 ? nday : nday + 7;
        /*if the next year starts before the middle of
        the week, it is week #1 of that year*/
        weeknum = nday < 4 ? 1 : 53;
    }
    }
    else {
    weeknum = Math.floor((daynum+day-1)/7);
    }
    return weeknum;
});

// 선택 날짜의 시작 월요일 계산
Vue.filter( "dateToWeekStart", function( $val, $sday ){
    var arrDays = [ "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN" ];
    var date = new Date( $val );
    var day = date.getDay();
    var diff = date.getDate() - day + (day == 0 ? -6 : 1 );
    if( $sday ) {
        diff += $sday.toUpperCase() != "SUN" ? arrDays.indexOf( $sday.toUpperCase() ) : -1;
    }
    return new Date( date.setDate( diff ) );
});
// 감성 코드 > 텍스트
Vue.filter( "sentiCodeToStr", function( $val ){
    var result = "";
    store.state.Opts.Sentis.filter( function( a ){
        if( a.code == $val ) result = a.name;
    });
    return result;
});
// 감성 코드 > 클래스
Vue.filter( "sentiCodeToClass", function( $val ){
    var result = "";
    store.state.Opts.Sentis.filter( function( a ){
        if( $val == a.code ) {
            if( a.name == "긍정" ) result = "ui_fc_positive";
            else if( a.name == "부정" ) result = "ui_fc_negative";
            else if( a.name == "중립" ) result = "ui_fc_neutral";
        }
    });
    return result;
});
// 감성 코드 > 아이콘 클래스
Vue.filter( "sentiCodeToIconClass", function( $val ){
    var result = "";
    store.state.Opts.Sentis.filter( function( a ){
        if( $val == a.code ) {
            if( a.name == "긍정" ) result = "is-positive";
            else if( a.name == "부정" ) result = "is-negative";
            else if( a.name == "중립" ) result = "is-neutral";
        }
    });
    return result;
});
// 감성 텍스트 > 코드
Vue.filter( "sentiStrToCode", function( $val ){
    var result = "";
    store.state.Opts.Sentis.filter( function( a ){
        if( a.name == $val ) result = a.code;
    });
    return result;
});

// 검색 키워드 하이라이트 코드로 변환
Vue.filter( "strToHlStr", function( $val, $txt ){
    var regx = new RegExp( $txt, "gi" );
    return $val.replace( regx, "<strong>" + "$&" + "</strong>" );
});

// Buzms 링크
Vue.filter( "buzmsLink", function( $link ){
    //window.open( "http://hub.buzzms.co.kr?url=" + encodeURIComponent( $link ) );
    return "http://hub.buzzms.co.kr?url=" + encodeURIComponent( $link );
});

// URL Validate
Vue.filter( "urlValidate", function( $link ){
    if( $link.indexOf( "http" ) < 0 ) return "http://" + $link;
    return $link;
});

// Array to String
Vue.filter( "arrToParam", function( $val, $sep, $code ){
    var arr = $val;
    if( !$sep ) $sep = ",";
    var result = "";
    arr.filter( function( $item, $idx ){
        if( $idx > 0 ) result += $sep;
        if( $code ) result += $item[ $code ];
        else result += $item;
    });
    return result;
});

// String to Array
Vue.filter( "paramToArr", function( $val, $sep, $code ){
    var result = [];
    if( !$sep ) $sep = ",";
    result = $val ? $val.split( $sep ) : [];
    return result;
});

// Array Merge
Vue.filter( "arrMerge", function(){			// $arr1, $arr2, $prop
    var args = $.map( arguments, function(value, index) {
        return [value];
    });
    var result = [];
    args.filter( function( $arr, $idx ){
        if( $idx == 0 ) return;
        $arr.filter( function( $arrSub ){
            var chk = result.findIndex( function( $item ){
                return $item[ args[ 0 ] ] == $arrSub[ args[ 0 ] ] ? true : false;
            }) >= 0 ? true : false;

            if( !chk ) {
                var tmp = {};
                tmp[ args[ 0 ] ] = $arrSub[ args[ 0 ] ];
                result.push( tmp );
            }
        });
    });

    result.filter( function( $result ){
        args.filter( function( $arr, $idx ){
            if( $idx == 0 ) return;
            $arr.filter( function( $arrSub ){
                if( $result[ args[ 0 ] ] == $arrSub[ args[ 0 ] ] ){
                    for( var item in $arrSub ){
                        if( item != args[ 0 ] ){
                            $result[ item ] = $arrSub[ item ];
                        }
                    }
                }
            });
        });
    });

    return result;
});

// Array 차집합
Vue.filter( "arrDifference", function( $val1, $val2 ){			// $arr1, $arr2, $prop
    var result = $val1.filter(function( a ){ return $val2.indexOf( a ) < 0 });
    return result;
});

// Array 교집합
Vue.filter( "arrIntersection", function( $val1, $val2 ){			// $arr1, $arr2, $prop
    var result = $val1.filter(function( a ){ return $val2.indexOf( a ) >= 0 });
    return result;
});

// 등락 클래스
Vue.filter( "getFlucClass", function( $val ){
    if( $val > 0 ) return "up";
    else if( $val < 0 ) return "dn";
    else return "none";
});

// 문자열 데이터가 날짜 데이터인지 체크
Vue.filter( "isDate", function( $val ){
    var re = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
    return re.test( $val );
});

// 12시간 표기법 to 24시간 표기법 변환
Vue.filter( "time12to24", function( $val ){
	var result = "";
	var tmp = $val.split( " " )[ 0 ]
	var hour = parseInt( tmp.split( ":" )[ 0 ] );
	var min = tmp.split( ":" ).length > 1 ? parseInt( tmp.split( ":" )[ 1 ] ) : null;
	var sec = tmp.split( ":" ).length > 2 ? parseInt( tmp.split( ":" )[ 2 ] ) : null;
	var ampm = $val.split( " " )[ 1 ];

	if( ampm == "AM" && hour == 12 ) hour = 0;
	if( ampm == "PM" && hour != 12 ) hour += 12;

	result = getZero( hour );
	if( min != null ) result += ":" + getZero( min );
	if( sec != null ) result += ":" + getZero( sec );

    return result;
    
    function getZero( $val ){
        return $val < 10 ? "0" + $val : $val;
    }
});

// 24시간 표기법 to 12시간 표기법 변환
Vue.filter( "time24to12", function( $val ){
	var result = "";
	var hour = parseInt( $val.split( ":" )[ 0 ] );
	var min = $val.split( ":" ).length > 1 ? parseInt( $val.split( ":" )[ 1 ] ) : null;
	var sec = $val.split( ":" ).length > 2 ? parseInt( $val.split( ":" )[ 2 ] ) : null;
	var ampm = hour >= 12 ? "PM" : "AM";

	if( hour > 12 ) hour -= 12;
	if( hour == 0 ) hour = 12;

	result = getZero( hour );
	if( min != null ) result += ":" + getZero( min );
	if( sec != null ) result += ":" + getZero( sec );
	result += " " + ampm;

    return result;
    
    function getZero( $val ){
        return $val < 10 ? "0" + $val : $val;
    }
});

// 넘겨진 옵션에서 코드로 데이터 가져오기
Vue.filter( "optsGetData", function( $val, $valCode ){
    var data = null;
    $val.filter( function( $item ){
        if( $item.value == $valCode ) data = $item;
    });
    return data;
});

// 옵션 이름 to Object
Vue.filter( "nameToOptsData", function( $val ){
    var result;
    for( $item in store.state.Opts ) {
        if( result ) break;
        store.state.Opts[ $item ].filter( function( $item2 ){
            if( $item2.name == $val ) {
                result = $item2;
                return false;
            }
        })[ 0 ];
    }
    return result;
});

// 데이터에서 조건으로 파싱
Vue.filter( "getParseDatas", function( $val, $key, $returnNullCheck ){
    var result = [];
    $val.filter( function( $item ){
        var keyCnt = 0;
        var sameKeyCnt = 0;
        for( key in $key ) {
            key = String(key).trim();
            if( $key[ key ] ) {
                if( typeof( $key[ key ] ) == "string" ){
                    var tmp = $key[ key ].split( "," );
                    tmp.filter( function( $item2 ){
                        if( $item[ key ] == $item2 ) sameKeyCnt++;
                    })
                } else {
                    if( $item[ key ] == $key[ key ] ) sameKeyCnt++;
                }
                keyCnt++;
            }
            // if( $item[ key ] == $key[ key ] ) sameKeyCnt++;
            // keyCnt++;
        }
        if( keyCnt != 0 && keyCnt == sameKeyCnt ) {
            result.push( $item );
        }
    });
    if( !$returnNullCheck ) return result;
    else return result.length > 0 ? result : null;
});

////	프로젝트 전용		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////