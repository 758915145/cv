window.requestAnimationFrame = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback) {
    window.setTimeout(callback, 1000 / 60);
};

window.onload = new APP();

//梦幻背景
var v2 = Vector2;//插件
var NUM = 20,//圈圈数量
    NUM2 = NUM/2,
    NUM3 = 5*NUM/6;
var PI = Math.PI,
    TAU = PI*2;
var i;

var APP_DEFAULTS = {
    particleCount: NUM,
    particleColor: 'rgba(200,200,230,0.5)'
};

function Particle(size, speed, context, bounds){
    this.size = size;
    this.ctx = context;
    this.bounds = bounds;
    this.position = new v2();
    this.position.randomize(bounds);
    this.velocity = new v2(0, speed);
    this.velocity.y -= Math.random();
}
Particle.prototype.reset = function () {
    this.position.y = this.bounds.y + this.size;
    this.position.x = Math.random() * this.bounds.x;
};
Particle.prototype.update = function () {
    this.position.add(this.velocity);
    if(this.position.y < -this.size){
        this.reset();
    }
};

function APP(){
    var that = this;
    setTimeout(function(){
        that.setup();
        that.getCanvas();
        that.resize();
        that.populate();
        that.render();
    });
}
APP.prototype.setup = function () {
    var self = this;
    self.props = APP_DEFAULTS;
    self.dimensions = new v2();
    window.onresize = () => {
        self.resize();
    };
};
APP.prototype.getCanvas = function () {
    this.canvas = {
        back: document.querySelector('.back'),
        mid: document.querySelector('.mid'),
        front: document.querySelector('.front')
    };

    this.ctx = {
        back: this.canvas.back.getContext('2d'),
        mid: this.canvas.mid.getContext('2d'),
        front: this.canvas.front.getContext('2d')
    };
};
APP.prototype.resize = function () {
    for(var c in this.canvas){
        this.canvas[c].width = this.dimensions.x = window.innerWidth;
        this.canvas[c].height = this.dimensions.y = window.innerHeight;
    }
};
APP.prototype.populate = function () {
    this.particles = [];
    for(i = 0; i < this.props.particleCount; i++){
        var isNUM2 = i < NUM2;
        var pCtx = isNUM2 ? this.ctx.back : i < NUM3 ? this.ctx.mid : this.ctx.front,
            size = isNUM2 ? 5 : i < NUM3 ? 8 : 12,
            speed = isNUM2 ? -0.5 : i < NUM3 ? -1 : -2,
            particle = new Particle(size, speed, pCtx, this.dimensions);
        this.particles.push(particle);
    }
};
APP.prototype.render = function () {
    var self = this;
    self.draw();
    window.requestAnimationFrame(self.render.bind(self));
};
APP.prototype.draw = function () {
    for(i in this.ctx){
        this.ctx[i].clearRect(0,0,this.dimensions.x, this.dimensions.y);
    }
    for(i = 0, len = this.particles.length; i < len; i++){
        var p = this.particles[i];
        p.update();
        p.ctx.beginPath();
        p.ctx.fillStyle = this.props.particleColor;
        p.ctx.arc(p.position.x, p.position.y, p.size, 0, TAU);
        p.ctx.fill();
        p.ctx.closePath();
    }
};
