/**
 * 动画效果
 * 线行圆体 - 使用方法：
 * var ca = new canvas_animate();
	ca.start({
		ele_boxId : 'd-particles',
		ele_canvasId : 'cv-particles',
		ele_width : $(window).width(),
		ele_height : $(window).height()
	});
 * @return {[type]} [description]
 */

//模块对外接口
var canvas_animate = function(){
	var _this = this;
	var _params = {
		ele_boxId : null,				//容器
		ele_canvasId : null,			//画布（画布的宽高=容器的宽高）
		ele_width : null,			//容器的宽度
		ele_height : null			//容器的高度
	};
	var _ele_box = null;
	var _ele_canvas = null;
	var _canvas = null; 			//画布对象
	var _canvas_tx = null;			//2d
	var _round_maxBj = 30;			//最大半径
	var _round_minBj = 5;			//最小半径
	var _round_count = 20;			//圆的个数
	var _round_color = '#008097';		//圆的颜色
	var _round_globalAlpha = 0.3;		//圆的透明度
	var _round_arr = [];

	var _line_color = '#fff';		//线的颜色
	var _line_globalAlpha = 0.03;	//线的透明度
	var _mar = null;


	/**
	 * 创建canvas对象
	 * @return {[type]} [description]
	 */
	var _create_canvas = function(){
		if(!document.getElementById(_params.ele_canvasId).getContext){
			return false;
		}
		_canvas = document.getElementById(_params.ele_canvasId);
		_canvas_tx = _canvas.getContext("2d");
		return true;
	};
	/**
	 * 画圆形-准备
	 * @return {[type]} [description]
	 */
	var _create_round = function(){
		//先创建_round_count个参数
		for(var i = 0;i<_round_count;i++){
			//圆的半径
			var bj = _get_round_bj();
			//根据圆的半径获取随机位置（即在容器宽高范围之内且大于当前半径）
			var left = _get_round_left(bj);
			var top = _get_round_top(bj);
			//圆的移动方式
			var moveFunc = _get_round_moveFunc();
			_round_arr[i] = {
				left : left,		
				top : top,
				bj : bj,
				moveFunc : moveFunc
			};
		}
		
		_mar = setInterval(function(){
			_this.clear();
			_create_round_start();
		},50);
		

		
	};
	/**
	 * 圆形-动态绘入
	 * @return {[type]} [description]
	 */
	var _create_round_start = function(){
		for(var i = 0;i<_round_count;i++){
			var left = _round_arr[i].left + _round_arr[i].moveFunc.left;
			var top = _round_arr[i].top + _round_arr[i].moveFunc.top;
			//超频处理
			if(left < 0 || left > _params.ele_width){
				_round_arr[i].moveFunc.left = _round_arr[i].moveFunc.left * -1;
			}
			if(top < 0 || top > _params.ele_height){
				_round_arr[i].moveFunc.top = _round_arr[i].moveFunc.top * -1;	
			}
			_round_arr[i].left = left;
			_round_arr[i].top = top;
			//画圆
			_canvas_tx.beginPath();
			_canvas_tx.arc(left , top , _round_arr[i].bj , 0 , 2*Math.PI);
			_canvas_tx.globalAlpha = _round_globalAlpha;
			_canvas_tx.fillStyle = _round_color;
			_canvas_tx.fill();
			_canvas_tx.closePath();
			//连线
			if(i > 0){
				for(var j = 0;j< _round_count; j++){
					_canvas_tx.beginPath();
					_canvas_tx.moveTo( left , top );
					_canvas_tx.lineTo( _round_arr[j].left , _round_arr[j].top);
					_canvas_tx.globalAlpha = _line_globalAlpha;
					_canvas_tx.strokeStyle = _line_color;
					_canvas_tx.stroke();	
				}
			}
		}
		
	};
	/**
	 * 圆的移动方式-初始
	 * @return {[type]} [description]
	 */
	var _get_round_moveFunc = function(){
		var arr = [
			{left : 0.1 , top : -0.5},
			{left : 0.1 , top : -0.1},
			{left : 0.1 , top : 0.1},
			{left : 0.1 , top : 0.5},

			{left : 0.5 , top : -0.5},
			{left : 0.5 , top : -0.1},
			{left : 0.5 , top : 0.1},
			{left : 0.5 , top : 0.5},

			{left : -0.5 , top : -0.5},
			{left : -0.5 , top : -0.1},
			{left : -0.5 , top : 0.1},
			{left : -0.5 , top : 0.5},

			{left : -0.1 , top : -0.5},
			{left : -0.1 , top : -0.1},
			{left : -0.1 , top : 0.1},
			{left : -0.1 , top : 0.5}
		];
		return arr[parseInt(Math.random()*arr.length)];
	};

	
	
	/**
	 * 获取圆的半径
	 * @return {[type]} [description]
	 */
	var _get_round_bj = function(){
		var bj = parseInt(Math.random()*_round_maxBj);
		if(bj < _round_minBj){
			bj = _get_round_bj();
		}
		return bj;
	};
	/**
	 * 获取圆的left-随机数（即在容器宽高范围之内且大于当前半径）
	 * @return {[type]} [description]
	 */
	var _get_round_left = function(bj){
		var left = parseInt(Math.random() * _params.ele_width);
		if(left < bj){
			left = _get_round_left(bj);
		}
		return left;
	};
	/**
	 * 获取圆的top-随机数（即在容器宽高范围之内且大于当前半径）
	 * @return {[type]} [description]
	 */
	var _get_round_top = function(bj){
		var top = parseInt(Math.random() * _params.ele_height);
		if(top < bj){
			top = _get_round_top(bj);
		}
		return top;
	};
	/**
	 * 初始化宽高
	 * @return {[type]} [description]
	 */
	var _window_init = function(){
		$(_ele_box).css({'width' : _params.ele_width , 'height' : _params.ele_height});
		$(_ele_canvas).css('display' , 'block');
		$(_ele_canvas).attr('width' , _params.ele_width).attr('height' , _params.ele_height);
		return true;
	};

	/**
	 * 清空
	 * @return {[type]} [description]
	 */
	this.clear = function(){
		_canvas_tx.fillStyle = '#000';
		_canvas_tx.fillRect(0,0,_params.ele_width,_params.ele_height);
		_canvas_tx.clearRect(0,0,_params.ele_width,_params.ele_height);

		
	};
	/**
	 * 清楚定时器
	 * @return {[type]} [description]
	 */
	this.clearMar = function(){
		clearInterval(_mar);
		_mar = null;
	};
	/**
	 * 开始
	 * @return {[type]} [description]
	 */
	this.start = function(params){
		_params = params;
		if(!_params.ele_boxId){
			console.log('canvas_animate: ele_boxId is not found!');
			return;
		}
		if(!_params.ele_canvasId){
			console.log('canvas_animate: ele_canvasId is not found!');
			return;
		}
		if(!_params.ele_width){
			console.log('canvas_animate: ele_width is not found!');
			return;
		}
		if(!_params.ele_height){
			console.log('canvas_animate: ele_height is not found!');
			return;
		}
		_ele_box = document.getElementById(_params.ele_boxId);
		_ele_canvas = document.getElementById(_params.ele_canvasId);

		if(_create_canvas() && _window_init()){
			_create_round();
		}
	};
}

// $(window).bind('load' , function(){
// 	var ca = new canvas_animate();
// 	ca.start({
// 		ele_boxId : 'd-particles',
// 		ele_canvasId : 'cv-particles',
// 		ele_width : $(window).width(),
// 		ele_height : $(window).height()
// 	});

// 	$(window).bind('resize' , function(){
// 		ca.clear();
// 		ca.clearMar();
// 		ca.start({
// 			ele_boxId : 'd-particles',
// 			ele_canvasId : 'cv-particles',
// 			ele_width : $(window).width(),
// 			ele_height : $(window).height()
// 		});
// 	});
// });

