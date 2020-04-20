$ = $ || {};

$['draw'] = function(param){
    if(!param || !param.eleBox || !param.imgs){
        return;
    }
    var that = this;
    var count = 5; //层数
    var s_wh = 30; //开始宽 高
    var s_opacity = 0.8; //开始透明度

    var eleBox = param.eleBox;
    var eleWidth = eleBox.width();
    var eleHeight = eleBox.height();
    //随机位置
    var randomxy = function(){
        //减去开始值，避免img出现在box以外
        return {
            x : Math.round(Math.random() * (eleWidth - s_wh) ),
            y : Math.round(Math.random() * (eleHeight - s_wh))
        }
    }
    
    


    var imgs = param.imgs;
    var layerArr = [];
    //10层 imgs平均在10层里
    imgs.map(function(item,index){
        var img = document.createElement("img");
        img.src = item.pic;
        img.setAttribute('_id' , item.id);
        img.setAttribute('_title' , item.title);

        //parseInt(Math.random()*(max-min+1)+min,10); 随机层 越大则 越大
        var z_index = parseInt(Math.random()*(count-1+1)+1,10);
        
        var _a = count - z_index <= 0 ? 0.7 : count - z_index;
        //随机层对应宽高
        var _wh = s_wh / _a;
        var _opacity = s_opacity / _a;

        //记录
        layerArr[layerArr.length] = {
            z_index : z_index,
            z_wh : _wh,
            z_opacity : _opacity
        };
        //排序
        function sortId(a,b){
            return a.z_index - b.z_index;
        }
        layerArr.sort(sortId);
        //去重
        var temp = {};
        var new_layerArr = [];
        layerArr.map(function (item, index) {
            if(!temp[item.z_index]){
                new_layerArr.push(item);
                temp[item.z_index] = true;
            }
        });
        layerArr = new_layerArr;
        
        //创建img对象
        $(img).css({
            'display' : 'block',
            'width' : _wh,
            'height' : _wh,
            'opacity' : _opacity,
            'transition' : 'all 0.3s ease',
            'position' : 'relative',
            'z-index' : 1
        });
        // $(img).attr('isShowDialog' , 'isShowDialog');
        var img_box = $('<div>');
        img_box.css({
            'position' : 'absolute',
            'left' : randomxy().x,
            'top' : randomxy().y,
            'z-index' : z_index,
            'width' : 0,
            'height' :0,
            'transition' : 'all 0.3s ease',
            'border-radius' : '100%',
            'overflow' : 'hidden',
            'opacity' : 0
        });
        img_box.attr('_zindex' , z_index);
        img_box.attr('_data' , JSON.stringify(item));
        var img_success = $('<i>');
        img_success.css({
            'position' : 'absolute',
            'z-index' : 4,
            'display' : 'none',
            'left' : -20,
            'top' : -10,
            'bottom' : -10,
            'opacity' : 0,
            'width' : '20px',
            'border-radius' : '100%',
            'background' : ' linear-gradient(to right,rgba(255,255,255,0) 0% , rgba(255,255,255,0.7) 100%)',
            'box-shadow' : ' 0 0 5px rgba(255,255,255,0.3)',
            'transition' : 'all 0.3s ease',
            'transform' : 'rotate(25deg)'
        }); 
        img_success.attr('_freshTime' , parseInt(Math.random()*(5000-2000+1)+2000,10));
        img.onload = function(){
            new $.draw.imgSuccessShow(this);
        }
        img_box.append(img);
        img_box.append(img_success);
        img_box.appendTo(eleBox);

        var t = parseInt(Math.random()*(2000-200+1)+200,10);
        setTimeout(function(){
            img_box.css({
                'opacity' : 1,
                'width' : _wh,
                'height' : _wh
            });

        },t);
    });
    var isScroll = true;
    var scrollFunc = function(e){
        //防止连续
        if(!isScroll) return;
        isScroll = false;

        e = e || window.event;
        var wheel = e.wheelDelta ? e.wheelDelta : e.detail;

        eleBox.find('div').map(function(index,item){
            var div = $(item);
            var z_index = div.css('z-index');
            //拿到层级 ， + 层级；到头了 层级从头开始
            var layerArr_now = null;
            var wheelOver = false; //是否拉过头了
            layerArr.map(function(data,i){
                if(data.z_index == z_index){
                    //往前滑，拉近
                    if(wheel > 0){
                        //拉过头了
                        if(typeof(layerArr[i + 1]) == 'undefined'){
                            wheelOver = true;
                        }
                        layerArr_now = typeof(layerArr[i + 1]) == 'undefined' ? layerArr[0] : layerArr[i + 1];    
                    }else{
                        //往后滑，拉远
                        layerArr_now = typeof(layerArr[i - 1]) == 'undefined' ? layerArr[layerArr.length-1] : layerArr[i - 1];
                    }
                    
                }
            });
            z_index = layerArr_now.z_index;
            var _a = count - z_index <= 0 ? 0.7 : count - z_index;
            //随机层对应宽高
            var _wh = s_wh / _a;
            var _opacity = s_opacity / _a;
            //left top 偏移值
            var _left = parseFloat(div.css('width').split('px')[0]);
            _left = parseFloat(div.css('left').split('px')[0]) - (_wh - _left)/2;
            var _top = parseFloat(div.css('height').split('px')[0]);
            _top = parseFloat(div.css('top').split('px')[0]) - (_wh - _top)/2;

            div.css({
                'width' : _wh,
                'height' : _wh,
                'left' : _left,
                'top' : _top,
                'z-index' : z_index
            });
            div.attr('_zindex' , z_index);
            div.find('img').css({
                'width' : _wh,
                'height' : _wh,
                'opacity' : _opacity
            });
        });  
        //可以继续
        setTimeout(function(){isScroll = true;},500);
    }
    var onMouseOver = function (e){
        e = e || window.event;
        var target = e.target || e.srcElement;
        if(target.tagName != 'IMG' && target.tagName != 'I')return;
        var img = target.tagName == 'IMG' ? $(target) : $(target).siblings('img');
        var div = img.closest('div');

        var z_index = count;
        //over的时候要比最大的还大一点
        var _a = count - z_index <= 0 ? 0.7 : count - z_index;
        //随机层对应宽高
        var _wh = s_wh / _a;
        var _opacity = s_opacity / _a;
        //left top 偏移值
        var _left = parseFloat(div.css('width').split('px')[0]);
        _left = parseFloat(div.css('left').split('px')[0]) - (_wh - _left)/2;
        var _top = parseFloat(div.css('height').split('px')[0]);
        _top = parseFloat(div.css('top').split('px')[0]) - (_wh - _top)/2;
        div.css({
            'width' : _wh,
            'height' : _wh,
            'left' : _left,
            'top' : _top,
            'z-index' : z_index,
            'box-shadow' : '1px 1px 3px rgba(0,0,0,0.8)'
        });
        img.css({
            'width' : _wh,
            'height' : _wh,
            'opacity' : _opacity
        });
    }
    var onMouseOut = function (e){
        e = e || window.event;
        var target = e.target || e.srcElement;
        if(target.tagName != 'IMG' && target.tagName != 'I')return;
        var img = target.tagName == 'IMG' ? $(target) : $(target).siblings('img');
        var div = img.closest('div');

        var z_index = div.attr('_zindex');
        var _a = count - z_index <= 0 ? 0.7 : count - z_index;
        //随机层对应宽高
        var _wh = s_wh / _a;
        var _opacity = s_opacity / _a;
        //left top 偏移值
        var _left = parseFloat(div.css('width').split('px')[0]);
        _left = parseFloat(div.css('left').split('px')[0]) - (_wh - _left)/2;
        var _top = parseFloat(div.css('height').split('px')[0]);
        _top = parseFloat(div.css('top').split('px')[0]) - (_wh - _top)/2;
        div.css({
            'width' : _wh,
            'height' : _wh,
            'left' : _left,
            'top' : _top,
            'z-index' : z_index,
            'box-shadow' : 'none'
        });
        img.css({
            'width' : _wh,
            'height' : _wh,
            'opacity' : _opacity
        });
    }
    
    //事件
    if(document.addEventListener){
        document.addEventListener('DOMMouseScroll', scrollFunc, false);      
    }
    window.onmousewheel = document.onmousewheel = scrollFunc;  
    eleBox.bind('mouseover' , onMouseOver);
    eleBox.bind('mouseout' , onMouseOut);


}
$['draw']['imgSuccessShow'] = function (ele) {
    var box = $(ele).closest('div');
    var i = box.find('i');
    var i_freshTime = i.attr('_freshTime');

    i.show();
    i.animate({'opacity' : 1 ,'left' : box.outerWidth() * 1.1} , 'fast' , function(){});
    setTimeout(function(){
        i.hide();
        i.css({
            'opacity' : 0,
            'left' : -20
        });
    },1000);
    setTimeout(function(){
        new $.draw.imgSuccessShow(ele);
    },i_freshTime);
}