
(function(){
    var template = ''
    +   '<div class="excel_prc_container">'
	+       '<iframe ref="processFrm" name="processFrm" width="0" height="0" title="excel data frame"></iframe>'
	+   '</div>'
    
    Vue.component( "comp-excel-mngr", {
        template : template,
        data: function(){
			return {
			}
		},
		created: function(){
			this.$store.EventBus.$on( "Excel_Download", this.excelDownload );
		},
		methods: {
			excelDownload: function( $url, $param, $tg ){
				var _this = this;
				if( $( $tg ).hasClass( "is-loading" ) ) return false;
                $( $tg ).addClass( "is-loading" );
                $( $tg ).attr( "disabled", true );
                $param.excelDown = true;
                
				$.ajax({
					type : "POST",
					dataType : "json",
					url : $url,
					data : $param,
					timeout : 600000,
					cache : false,
					success : function( $result ){
                        var path = $result.path;
						$( _this.$refs.processFrm ).attr( "src", path );
					},
					complete: function(){
                        $( $tg ).removeClass( "is-loading" );
                        $( $tg ).attr( "disabled", false );
					},
					error : function( $err ){
                        if( $err.status != 0 ) {
                            this.$store.EventBus.$emit( "msgMngr", $err.status + "<br>" + ajaxData.url, "Ajax Error", "error", 0 );
                        }
					}
                })
			}
		}
    })
}())