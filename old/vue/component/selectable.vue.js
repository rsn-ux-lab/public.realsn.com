(function(){
    var template = ''
    +'  <div class="ui_selectable" :id="id" :class="[ { \'disabled\' : disabled }, { \'is-nodata\': list.length == 0 } ]" :style="getRowHgt">'
    +'      <ul ref="selectable">'
    +'          <li v-for="( $item, $idx ) in list" :data-val="$item.code" :class="[ { \'disabled\' : $item.disabled }, { \'ui-selected\': selected.indexOf( $item.code ) >= 0 } ]">{{ $item.name }}</li>'
    +'      </ul>'
    +'  </div>'

    Vue.component( "comp-selectable", {
        template : template,
        data: function(){
            return {
                st: null
            }
        },
        props : [ "id", "list", "rows", "selected", "disabled" ],
        computed: {
            getRowHgt: function(){
                if( this.rows ) {
                    return "height: " + ( 11 + ( 23 * parseInt( this.rows ) ) ) + "px";
                }
                return "";
            }
        },
        mounted: function() {
            var _this = this;
            this.st = $( this.$refs.selectable );
            this.st.selectable({
                filter : "li:not('.disabled')",
                stop: function( $e ){
                    var selectedItems = [];
                    _this.st.find( ".ui-selected" ).each( function( $item ){
                        selectedItems.push( $( this ).attr( "data-val" ) );
                    });
                    _this.$emit("update:selected", _this.$options.filters.arrToParam( selectedItems ) );
                }
            })
        },
        watch :{
            list: function( $val ){
                if( this.st ) this.st.selectable( "refresh" );
            }
        },
        beforeDestroyed: function() {
            if( this.st ) this.st.selectable( "destroy" );
        }
    })
}())