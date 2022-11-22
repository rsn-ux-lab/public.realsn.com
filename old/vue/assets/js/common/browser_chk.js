var ua = navigator.userAgent, tem, M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
// IE 브라우저 인 경우
if( browserCheck().indexOf( "IE" ) >= 0 ) {
    if( browserCheck().indexOf( "9" ) >= 0 || browserCheck().indexOf( "8" ) >= 0 || browserCheck().indexOf( "7" ) >= 0 || browserCheck().indexOf( "6" ) >= 0 ) location.href = "../error/browser.jsp";
// IE 브라우저 아닌 경우
} else {
    // am4core.useTheme( am4themes_animated );
}

function browserCheck(){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
}