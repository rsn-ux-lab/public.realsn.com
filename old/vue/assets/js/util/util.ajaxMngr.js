var ajaxMngr = {
    store: null,
    loadChk: false,
    stack: [],
    load: function( $url, $param, $successFunc, $errorFunc ){
        var xhr = $.ajax({
            type: "POST",
            url: $url,
            data: $param,
            timeout: 30000,
            cache : false,
            success: function( $result ){
                if( $successFunc ) $successFunc( JSON.parse( $result ).result );
            },
            error: function( $err ){
                store.EventBus.$emit( "msgMngr", $err.status + "<br>" + $url, "Ajax Error", "error", 0, function(){
                    if( $errorFunc ) $errorFunc();
                } );
            }
        });
    },
    add: function( $url, $param, $successFunc, $errorFunc ){
        var _this = this;
        var seq = "ajaxMngr_" + new Date().getTime() + "_" + Math.round( Math.random() * 100000000 );
        var loadObj = {
            seq: seq,
            url: $url,
            param: $param,
            successFunc: $successFunc,
            errorFunc: $errorFunc,
        };

        this.stack.filter( function( $xhr ){
            if( $xhr.url == $url ) {
                if( $xhr.xhr ) $xhr.xhr.abort();
            }
        })

        this.stack.push( loadObj );
        this.loadingChk();
        return loadObj;
    },
    loadingChk: function(){
        if( this.loadChk ) return false;
        if( this.stack.length > 0 ){
            this.loadChk = true;
            this.loadStart();
        }
    },
    loadStart: function(){
        var _this = this;
        var ajaxData = this.stack[ 0 ];
        ajaxData.xhr = $.ajax({
            type: "POST",
            url: ajaxData.url,
            data: ajaxData.param,
            timeout: 30000,
            cache : false,
            success: function( $result ){
                if( ajaxData.successFunc ) ajaxData.successFunc( JSON.parse( $result ).result );
                _this.remove( ajaxData.seq );
            },
            error: function( $err ){
                if( $err.status != 0 ) {
                    store.EventBus.$emit( "msgMngr", $err.status + "<br>" + ajaxData.url, "Ajax Error", "error", 0, function(){
                        if( ajaxData.errorFunc ) ajaxData.errorFunc();
                    } );
                }
                _this.remove( ajaxData.seq );
            }
        });
    },
    remove: function( $seq ){
        var removeIdx;
        this.stack.filter( function( a, b ){
            if( a.seq == $seq ) {
                if( a.cancel ) a.cancel();
                removeIdx = b;
            }
        });
        if( removeIdx >= 0 ){
            this.stack.splice( removeIdx, 1 );
        }

        this.loadChk = false;
        this.loadingChk();
    },
    destroy: function(){
        this.stack.filter( function( $xhr ){
            if( $xhr.xhr ) $xhr.xhr.abort();
        });
        this.loadChk = false;
        this.stack = [];
    }
}