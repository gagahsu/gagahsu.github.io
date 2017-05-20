"use strict";

var currStep = 0;
var gameOver = true;
var currState = [];
var symbols = ['&times;', '&#9675;'];

var winCondiction = {
   combo0: [0, 1, 2],
   combo1: [3, 4, 5],
   combo2: [6, 7, 8],
   combo3: [0, 3, 6],
   combo4: [1, 4, 7],
   combo5: [2, 5, 8],
   combo6: [0, 4, 8],
   combo7: [2, 4, 6]
};

var potentialCombos = {
  0: ['combo0', 'combo3', 'combo6'],
	1: ['combo0', 'combo4'],
	2: ['combo0', 'combo5', 'combo7'],
	3: ['combo1', 'combo3'],
	4: ['combo1', 'combo4', 'combo6', 'combo7'],
	5: ['combo1', 'combo5'],
	6: ['combo2', 'combo3', 'combo7'],
	7: ['combo0', 'combo4'],
	8: ['combo2', 'combo5', 'combo6']
};

var winResizeHandler = function(){
	var w = $('.cell').width();
	$('.cell').height(w).css({
		'font-size': w + 'px',
		'line-height': w * 0.92 + 'px'
	});
};

winResizeHandler();

$(window).resize(winResizeHandler).keydown(function(e){
	e.preventDefault();
	initGame();
});

var showArrow = function(p){
   if(p % 2 === 0){
      $('.player1 > .arrow').removeClass('inv');
      $('.player2 > .arrow').addClass('inv');
   }else{   	  
      $('.player1 > .arrow').addClass('inv');
      $('.player2 > .arrow').removeClass('inv');
   }
};

var initGame = function(){
	if(gameOver){
		$('.cell').empty().removeClass('win');
		gameOver = false;
		for(var i = 0; i<9;i++){
			currState[i] = null;
		}
		currStep = 0;
		showArrow(currStep);
		$('.ss').text('');
	}
}

var chkCombo = function(a){
    var a0 = currState[a[0]],
        a1 = currState[a[1]],
        a2 = currState[a[2]];
    var w = (a0 === a1 && a1 === a2);
    if(w){
    	$('.cell[data-i="' + a[0] +'"]').addClass('win');
    	$('.cell[data-i="' + a[1] +'"]').addClass('win');
    	$('.cell[data-i="' + a[2] +'"]').addClass('win');
    }
    return w;
};

$('.cell').click(function(){
	var $this = $(this);
   if(!gameOver){
      var i = $this.data("i");
      if(currState[i] === null){
      	var s = symbols[currStep++ % 2];
        currState[i] = s;
        $this.html(s);
        for(var j=0, len=potentialCombos[i].length; j<len; j++){
            var ww = winCondiction[potentialCombos[i][j]];
        	if(chkCombo(ww)){
        		gameOver = true;
        		$('.ss').text('按下任意鍵開始遊戲.');
        		return;
        	}
        }
        if(currStep === 9){
            gameOver = true;
            $('.ss').text('平手!按下任意鍵開始遊戲.');
        	return;
        }
        showArrow(currStep);
      }
   }
});