// http://astronautz.com/wordpress/creating-realistic-particle-effect-with-html5-canvas/

function isMobile() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function ParticleEmitter()
{
  this.m_x;
  this.m_y;
  this.m_dieRate;
  this.m_image;
  this.m_speed = 0.02;
  this.m_alpha = 1.0;
 
  this.m_listParticle = [];
 
  // ParticleEmitter().init function
  // xScale = number between 0  and 1. 0 = on left side 1 = on top
  // yScale = number between 0  and 1. 0 = on top 1 = on bottom
  // particles = number of particles
  // image = smoke graphic for each particle
  this.init = function(xScale, yScale, particles, image)
  {
    // the effect is positioned relative to the width and height of the canvas
    this.m_x = CANVAS_WIDTH*xScale;
    this.m_y = CANVAS_HEIGHT*yScale;
    this.m_image = image;
    this.m_dieRate = 0.95;
    // start with smoke already in place
    for (var n = 0; n < particles; n++)
    {
      this.m_listParticle.push(new Particle());
      this.m_listParticle[n].init(this, n*50000*this.m_speed);
    }
  }
 
  this.update = function(timeElapsed)
  {
    for (var n = 0; n < this.m_listParticle.length; n++)
    {
      this.m_listParticle[n].update(timeElapsed);
    }
  }
 
  this.render = function(context)
  {
    for (var n = 0; n < this.m_listParticle.length; n++)
    {
      this.m_listParticle[n].render(context);
    }
  }
};
 
function Particle()
{
  this.m_x;
  this.m_y;
  this.m_age;
  this.m_xVector;
  this.m_yVector;
  this.m_scale;
  this.m_alpha;
  this.m_canRegen;
  this.m_timeDie;
  this.m_emitter;
   
  this.init = function(emitter, age)
  {
    this.m_age = age;
    this.m_emitter = emitter;
    this.m_canRegen = true;
    this.startRand();
  }
 
  this.isAlive = function () 
  {
    return this.m_age < this.m_timeDie;
  }
 
  this.startRand = function()
  {
    // smoke rises and spreads
    this.m_xVector = Math.random()*0.5 - 0.25;
    this.m_yVector = -1.5 - Math.random();
    this.m_timeDie = 20000 + Math.floor(Math.random()*12000);
 
    var invDist = 1.0/Math.sqrt(this.m_xVector*this.m_xVector 
      + this.m_yVector*this.m_yVector);
    // normalise speed
    this.m_xVector = this.m_xVector*invDist*this.m_emitter.m_speed;
    this.m_yVector = this.m_yVector*invDist*this.m_emitter.m_speed;
    // starting position within a 20 pixel area 
    this.m_x = (this.m_emitter.m_x + Math.floor(Math.random()*20)-10);
    this.m_y = (this.m_emitter.m_y + Math.floor(Math.random()*20)-10);
    // the initial age may be > 0. This is so there is already a smoke trail in 
    // place at the start
    this.m_x += (this.m_xVector+windVelocity)*this.m_age;
    this.m_y += this.m_yVector*this.m_age;
    this.m_scale = 0.01;  
    this.m_alpha = 0.0;
  }
 
  this.update = function(timeElapsed)
  {
    this.m_age += timeElapsed;
    if (!this.isAlive()) 
    {
      // smoke eventually dies
      if (Math.random() > this.m_emitter.m_dieRate)
      {
        this.m_canRegen = false;
      }
      if (!this.m_canRegen)
      {
        return;
      }
      // regenerate
      this.m_age = 0;
      this.startRand();
      return;
    }
    // At start the particle fades in and expands rapidly (like in real life)
    var fadeIn = this.m_timeDie * 0.05;
    var startScale;
    var maxStartScale = 0.3;
    if (this.m_age < fadeIn)
    {
      this.m_alpha = this.m_age/fadeIn;
      startScale = this.m_alpha*maxStartScale; 
      // y increases quicker because particle is expanding quicker
      this.m_y += this.m_yVector*2.0*timeElapsed;
    }
    else
    {
      this.m_alpha = 1.0 - (this.m_age-fadeIn)/(this.m_timeDie-fadeIn);
      startScale = maxStartScale;
      this.m_y += this.m_yVector*timeElapsed;
    }
    // the x direction is influenced by wind velocity
    this.m_x += (this.m_xVector+windVelocity)*timeElapsed;
    this.m_alpha *= this.m_emitter.m_alpha;
    this.m_scale = 0.001 + startScale + this.m_age/4000.0;
  }
 
  this.render = function(ctx)
  {
    if (!this.isAlive()) return;
    ctx.globalAlpha = this.m_alpha;
    var height = this.m_emitter.m_image.height*this.m_scale;
    var width = this.m_emitter.m_image.width*this.m_scale;
    // round it to a integer to prevent subpixel positioning
    var x = Math.round(this.m_x-width/2);
    var y = Math.round(this.m_y+height/2);
    ctx.drawImage(this.m_emitter.m_image, x, y, width, height);  
    if (x < dirtyLeft)
    {
      dirtyLeft = x;
    }
    if (x+width > dirtyRight)
    {
      dirtyRight = x+width;
    }
    if (y < dirtyTop)
    {
      dirtyTop = y;
    }
    if (y+height > dirtyBottom)
    {
      dirtyBottom = y+height;
    }
  }
};
 
var lastRender = new Date().getTime();
var context;
var smokeRight = new ParticleEmitter();
var smokeLeft = new ParticleEmitter();
var CANVAS_WIDTH = 960;
var CANVAS_HEIGHT = 640;
// only redraw minimimum rectangle
var dirtyLeft = 0;
var dirtyTop = 0;
var dirtyRight = CANVAS_WIDTH;
var dirtyBottom = CANVAS_HEIGHT;
var windVelocity = 0.01;
var count = 0;
 
function init()
{
  var canvas = document.getElementById('smoke');
  if (canvas.getContext)
  {
    context = canvas.getContext('2d');
  }
  else
  {
    return;
  }
  var imgBack = document.getElementById('smoke-background');
  console.log(navigator.userAgent)
  console.log(isMobile())
  if (isMobile()){
    console.log('in here now')
    imgBack.style.display = 'none'
    return;
  }
  // make canvas same size as background image
  /* 
  CANVAS_WIDTH = imgBack.width;
  CANVAS_HEIGHT = imgBack.height;
  canvas.width = imgBack.width;
  canvas.height = imgBack.height;
  */
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  // get absolute position of background image
  var xImage = imgBack.offsetLeft;
  var yImage = imgBack.offsetTop;
  var elem = imgBack.offsetParent;
  while (elem)
  {
    xImage += elem.offsetLeft;
    yImage += elem.offsetTop;
    elem = elem.offsetParent;
  }
  // position canvas on top of background
  canvas.style.position = 'absolute';
  canvas.style.left = xImage + "px";
  canvas.style.top = yImage + "px";
  var imgSmoke = new Image();  
  imgSmoke.src = '/images/puffBlack.png';
  imgSmoke.onload = function()
  { 
    smokeRight.init(.9, .531, 20, imgSmoke);
    smokeLeft.m_alpha = 0.3;
    smokeLeft.init(.1369, .62, 30, imgSmoke);
    requestAnimFrame(render);
  };  
}
 
// shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 17);
              };
    })();
 
   
function render() 
{  
  // time in milliseconds
  var timeElapsed = new Date().getTime() - lastRender;
  lastRender = new Date().getTime();
  context.clearRect(dirtyLeft, dirtyTop, dirtyRight-dirtyLeft, dirtyBottom-dirtyTop);
  dirtyLeft = 1000;
  dirtyTop = 1000;
  dirtyRight = 0;
  dirtyBottom = 0;
  // smokeRight.update(timeElapsed);
  // smokeRight.render(context);
  smokeLeft.update(timeElapsed);
  smokeLeft.render(context);
  windVelocity += (Math.random()-0.5)*0.002;
  if (windVelocity > 0.015)
  {
    windVelocity = 0.015;
  }
  if (windVelocity < 0.0)
  {
    windVelocity = 0.0;
  }
  if (true){
    requestAnimFrame(render);    
  }
  
}  

