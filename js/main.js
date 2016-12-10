window.requestAnimationFrame = window.requestAnimationFrame||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback) {
    window.setTimeout(callback, 1000 / 60);
};

//canvas背景动画
-function(){
    var canvas,ctx,width,height,size,lines,tick;

    function line(){
        this.path = [];
        this.speed = rand(10,20);
        this.count = randInt(10,30);
        this.x = width / 2,
        +1;
        this.y = height / 2 + 1;
        this.target = {
            x: width / 2,
            y: height / 2
        };
        this.dist = 0;
        this.angle = 0;
        this.hue = tick / 5;
        this.life = 1;
        this.updateAngle();
        this.updateDist();
    }

    line.prototype.step = function(i) {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        this.updateDist();

        if (this.dist < this.speed) {
            this.x = this.target.x;
            this.y = this.target.y;
            this.changeTarget();
        }

        this.path.push({
            x: this.x,
            y: this.y
        });
        if (this.path.length > this.count) {
            this.path.shift();
        }

        this.life -= 0.001;

        if (this.life <= 0) {
            this.path = null;
            lines.splice(i,1);
        }
    };

    line.prototype.updateDist = function(){
        var dx = this.target.x - this.x,
        dy = this.target.y - this.y;
        this.dist = Math.sqrt(dx * dx + dy * dy);
    }

    line.prototype.updateAngle = function(){
        var dx = this.target.x - this.x,
        dy = this.target.y - this.y;
        this.angle = Math.atan2(dy,dx);
    }

    line.prototype.changeTarget = function(){
        var randStart = randInt(0,3);
        switch (randStart) {
        case 0:
            // up
            this.target.y = this.y - size;
            break;
        case 1:
            // right
            this.target.x = this.x + size;
            break;
        case 2:
            // down
            this.target.y = this.y + size;
            break;
        case 3:
            // left
            this.target.x = this.x - size;
        }
        this.updateAngle();
    };

    line.prototype.draw = function(i) {
        ctx.beginPath();
        var rando = rand(0,10);
        for (var j = 0,
        length = this.path.length; j < length; j++) {
            ctx[(j === 0) ? 'moveTo': 'lineTo'](this.path[j].x + rand( - rando,rando),this.path[j].y + rand( - rando,rando));
        }
        ctx.strokeStyle = 'hsla(' + rand(this.hue,this.hue + 30) + ',80%,55%,' + (this.life / 3) + ')';
        ctx.lineWidth = rand(0.1,2);
        ctx.stroke();
    };

    function rand(min,max) {
        return Math.random() * (max - min) + min;
    }

    function randInt(min,max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    };

    function init(){
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        size = 30;
        lines = [];
        reset();
        loop();
    }

    function reset(){
        width = Math.ceil(window.innerWidth / 2) * 2;
        height = Math.ceil(window.innerHeight / 2) * 2;
        tick = 0;

        lines.length = 0;
        canvas.width = width;
        canvas.height = height;
    }

    function create(){
        if (tick % 10 === 0) {
            lines.push(new line());
        }
    }

    function step(){
        var i = lines.length;
        while (i--) {
            lines[i].step(i);
        }
    }

    function clear(){
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'hsla(0,0%,0%,0.1';
        ctx.fillRect(0,0,width,height);
        ctx.globalCompositeOperation = 'lighter';
    }

    function draw(){
        ctx.save();
        ctx.translate(width / 2,height / 2);
        ctx.rotate(tick * 0.001);
        var scale = 0.8 + Math.cos(tick * 0.02) * 0.2;
        ctx.scale(scale,scale);
        ctx.translate( - width / 2,-height / 2);
        var i = lines.length;
        while (i--) {
            lines[i].draw(i);
        }
        ctx.restore();
    }

    function loop(){
        requestAnimationFrame(loop);
        create();
        step();
        clear();
        draw();
        tick++;
    }

    window.addEventListener('resize',reset);
    init();
}();

var fullpage = $('#fullpage');

//第1屏动画
-function(){
    var head = fullpage.find('.header'),
        bar = head.prev(),
        hcontent = head.next();
    window.in1 = function(){
        head.addClass('bounceIn animated').css({opacity:1});

        setTimeout(function(){
            head.removeClass('bounceIn animated');

            //向上移动
            setTimeout(function(){
                head.addClass('moveUp');

                //显示文字
                setTimeout(function(){
                    bar.animate({opacity:1},function(){
                        hcontent.addClass('fadeInUp animated').css({opacity:1});
                    });
                },150);
            },50);
        },400);
    }
    window.out1 = function(){
        setTimeout(function(){
            bar.css({opacity:0});
            head.removeClass('moveUp').css({opacity:0});
            hcontent.removeClass('fadeInUp animated').css({opacity:0});
        },400);
    }
}();

//第2屏动画
-function(){
    var page2 = $('.page2'),
        shua = page2.find('.shua2'),
        dl = page2.find('dl'),
        h2 = page2.find('h2');
    window.in2 = function(){
        shua.addClass('toright');
        setTimeout(function(){
            h2.addClass('fadeInDown animated').css({opacity:1});
            dl.addClass('fadeInUp animated').css({opacity:1});
        },500);
    };
    window.out2 = function(){
        shua.hide();
        shua.removeClass('toright');
        setTimeout(function(){
            shua.show();
            h2.removeClass('fadeInDown animated').css({opacity:0});
            dl.removeClass('fadeInUp animated').css({opacity:0});
        },400);
    }
}();

//第3屏动画
-function(){
    var page3 = $('.page3'),
        shua = page3.find('.shua3'),
        lis = page3.find('li'),
        h2 = page3.find('h2');
    window.in3 = function(){
        shua.addClass('toleft');
        setTimeout(function(){
            h2.addClass('fadeInDown animated').css({opacity:1});
            lis.addClass('fadeInUp animated').css({opacity:1});
        },500);
    };
    window.out3 = function(){
        shua.hide();
        shua.removeClass('toleft');
        setTimeout(function(){
            shua.show();
            h2.removeClass('fadeInDown animated').css({opacity:0});
            lis.removeClass('fadeInUp animated').css({opacity:0});
        },400);
    }
}();

//第4屏动画
// -function(){
//     var page4 = $('.page4');
//     var shua = page4.find('.shua4');
//     var hcontent = page4.find('.hcontent');
//     var h2 = page4.find('h2');
//     window.in4 = function(){
//         shua.addClass('toright');
//         setTimeout(function(){
//             h2.addClass('fadeInDown animated').css({opacity:1});
//             hcontent.addClass('fadeInUp animated').css({opacity:1});
//         });
//     };
//     window.out4 = function(){
//         shua.hide();
//         shua.removeClass('toright');
//         setTimeout(function(){
//             shua.show();
//             h2.removeClass('fadeInDown animated').css({opacity:0});
//             hcontent.removeClass('fadeInUp animated').css({opacity:0});
//         });
//     }
// }();

//第5屏动画
// -function(){
//     var shua = $('.shua5');
//     window.in5 = function(){
//         shua.addClass('toleft');
//     };
//     window.out5 = function(){
//         shua.hide();
//         shua.removeClass('toleft');
//         setTimeout(function(){
//             shua.show();
//         });
//     }
// }();


//fullpage
-function(){
    var onLeave = (function(){
        var shua = fullpage.find('.section').length;
        var fn = '(function(index,nextIndex){switch(index){';
        for(var i=1;i<=shua;i++){
            fn+='case '+i+':out'+i+'();break;'
        }
        fn+='}setTimeout(function(){switch (nextIndex){';
        for(var i=1;i<=shua;i++){
            fn+='case '+i+':in'+i+'();break;'
        }
        fn+='}},300);})';
        return eval(fn);
    })();
    //console.log(onLeave);
    // function onLeave(index,nextIndex,direction){
    //     switch(index){
    //         case 1:out1();break;
    //     }
    //     setTimeout(function(){
    //         switch (nextIndex) {
    //             case 1:in1();break;
    //         }
    //     },300);
    // }
    window.showfullpage = function(){
        fullpage.fullpage({
            anchors: ['page1','page2','page3','page4'],//url里显示的，如：#page1
            navigation: true,
            navigationPosition: 'right',
            navigationTooltips: ['第1屏','第2屏','第3屏','第4屏'],
            afterRender: function(){
                fullpage.css({opacity:1});
                in1();
            },
            onLeave: onLeave
        });
    }
}();

//隐藏等待，显示内容
-function(){
    var waiting = $('#waiting');
    waiting.addClass('head').find('.txt').text('欢迎光临').css({
        fontSize: '32px',
        lineHeight: '250px',
        fontFamily: '微软雅黑'
    });
    var headBorder = waiting.prop("outerHTML");
    $('#canvas').css({opacity:1}).animate({opacity:0.5},5000);
    setTimeout(function(){
        waiting.animate({transform: 'scale(1.2)'},function(){
            var that = $(this);
            that.addClass('bounceOut animated');
            setTimeout(function(){
                that.css({transform:'scale(1)'});
                showfullpage();
                document.body.removeChild(waiting[0]);//删了它
            },400);
        });
    },0);
}();

//获取评论列表
// setTimeout(function(){
//     var i = document.querySelector('iframe');
// },2000);
