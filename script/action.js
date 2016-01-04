/**
 * Created by Paris on 2016/1/4.
 */

var action = {
    glb_name_rolling : setInterval( function(){

    },100000),
    //开始按钮
    start : function(){
        action.rolling.start();
    },

    //停止按钮
    stop : function(){
        action.rolling.stop();
    },

    rolling : {
        //开始名字滚动
        start : function(){
            action.glb_name_rolling = setInterval(function(){
                var index = action.prize.getAvailableIndex();
                $("#js_input").val(index);
            }, 100);
        },

        //停止名字滚动
        stop : function(){
            clearInterval(action.glb_name_rolling);

            var index =  $("#js_input").val();
            action.prize.handleWinner(index);
        }
    },

    prize : {
        getAvailableIndex : function(){
            var total = users.userList.length - 1;
            var index = Math.ceil(Math.random() * total );
            while($.inArray(index, users.winnerList) != -1){
                index = Math.ceil(Math.random() * total );
            }
            return index;
        },

        handleWinner : function(index){
            var indexInt = parseInt(index);
            // add to winner list
            users.winnerList.push(indexInt);

            var winner = {
                prize : $("#js_prize_menu").val(),
                name : users.userList[indexInt].name
            }

            users.winnerResult.push(winner);

            console.info(users.winnerList);
            console.info(users.winnerResult);

            $("#js_table_li").html($("#js_table_li").html() + '    ' + users.userList[indexInt].name);
        }
    }
}