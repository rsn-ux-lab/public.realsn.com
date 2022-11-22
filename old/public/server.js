



/*  cache */

let cache;
cache = '?v='+(new Date).getTime();



/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/



/* SERVER */

const SERVER = {
  public: '//design.realsn.com/design_asset/public',
  fonts: '//design.realsn.com/design_asset/fonts',
  images: '//design.realsn.com/design_asset/images',  
}




/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/



/*

  CSS, JS 동적 로드

  [script 작성 예]
    FILES([
      'script1.js',
      'script2.js',
    ], function(){
      // callback
    });

*/

let FILES_CSS, FILES_JS;
const FILES = function(fileList, callback){
  let result;

  function isOverlap (list, filePath){
    let value;

    for (let i=0; i<list.length; i++){
      if (list[i]==filePath) {
        value = true;
        break;
      }
    }
    return Boolean(value);
  }

  function afterJqLoad(){
    let _result;
    let CSS = [];
    let JS = [];

    if (Array.isArray(fileList)) {
      fileList.forEach(function(v,i,a){
        let isJS = /\.js/.test(v);

        isJS?JS.push(v):CSS.push(v);
      });
    } else {
      let isJS = /\.js/.test(fileList);

      isJS?JS.push(fileList):CSS.push(fileList);
    }

    CSS.forEach(function(v,i,a){
      if(!FILES_CSS) FILES_CSS = [];

      let filePath = CSS[i];

      if (!isOverlap(FILES_CSS, filePath)){
        let head  = document.getElementsByTagName('head')[0];
        let tag  = document.createElement('link');

        tag.rel = 'stylesheet';
        tag.type = 'text/css';
        tag.href = filePath+cache;
        head.appendChild(tag);
        FILES_CSS.push(filePath);
      }
      if (callback && (CSS.length-1==i) && !JS.length) _result = callback();
    });

    if (JS.length){
      (function getJS(i){
        if(!FILES_JS) FILES_JS = [];

        let filePath = JS[i];

        if (!isOverlap(FILES_JS, filePath)){
          let _cache = /\?/.test(filePath) ? '' : cache;

          $.getScript(filePath+_cache).done(function(){
            FILES_JS.push(filePath);

            if (i!=JS.length-1) {
              getJS(++i);
            } else {
              if (callback) _result = callback();
            }
          }).fail(function(){
            console.log('error : '+filePath);

            if (i!=JS.length-1) {
              getJS(++i);
            } else {
              if (callback) _result = callback();
            }
          });
        } else {
          console.log('overlab : '+filePath);

          if (i!=JS.length-1) {
            getJS(++i);
          } else {
            if(callback) _result = callback();
          }
        }
      })(0);
    }
    return _result;
  }

  if (/undefined/i.test(typeof jQuery)){
    let xml = new XMLHttpRequest();

    xml.onreadystatechange = function(){
      if (this.readyState==4&&this.status==200) {
        eval(xml.responseText);
        $.ajaxSetup({cache: true});
        result = afterJqLoad();
      }
    }
    xml.open("GET", SERVER.public+"/lib/jquery/jquery@3.4.1.js"+cache, false);
    xml.send();
  } else {
    result = afterJqLoad();
  }
  return result;
}



/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/