var comp_test = {
	template:"\
		<div>\
			<div><input type='text' :value='$store.state.testVal'></div>\
			<div v-text='$store.state.top_search_data.sDate'></div>\
		</div>\
	",
	data: function(){
		return {
		};
	},
	props: {
	},
	computed: {
		tmpData: function(){
			return this.$store.state.testVal;
		},
		tmpData2: function(){
			return this.$store.state.top_search_data.sDate;
		}
	},
	components: {
	},
	created: function(){
	},
	mounted: function (){
		var _this = this;
		setTimeout( function(){
			//_this.$store.state.sDate = "test";
			//console.log( _this.$store.state.top_search_data.sDate );
			_this.$store.commit( 'testFunc', 'test' );
		}, 1000 );
	},
	watch: {
	},
	methods: {


	}
};
