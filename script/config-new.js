var config = {
	//初始化配置
	init : function(){
		$("#js_input").val('');
		$("#js_input_index").val('');

		//初始化奖品列表
		for(var i in prizes.prizeSettings){
			var prize = prizes.prizeSettings[i];
			var html = '<option value=' + prize.name + '>' + prize.name + '</option>';
			$("#js_prize_menu").append(html);
		}
	},
	//菜单选择
	prizeMenuSelected : function(){
		var prizeName = $("#js_prize_menu").val();
		for(var i in prizes.prizeSettings) {
			var prize = prizes.prizeSettings[i];
			if(prize.name == prizeName){
				var amount = prize.amount;
				var style = prize.style;

				$("#js_input").html(config.generateWinnerScrollInput(style));
			}
		}
	},

	generateWinnerScrollInput : function(style, clickFn){
		var html = '<input type="text" readonly="readonly" title="双击重抽" ondblclick="clickFn" class="' + style + '" value="">';
	}
}

$(function(){
	//加载初始化配置
	config.init();
});
