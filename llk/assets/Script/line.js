
cc.Class({
    extends: cc.Component,

    properties: {
      
       x: 0,
       y: 0,
    },
   
   onLoad: function () {
     
    },
    
   update: function (dt) {
       
   },
  setXY:function(a,b){
        var ctx = this.node.getComponent(cc.Graphics);
        ctx.clear();
        ctx.lineWidth=8;
        ctx.strokeColor = cc.hexToColor('#f50000');
        ctx.moveTo(a,b);
  },
   draw:function(x,y){
        var ctx = this.node.getComponent(cc.Graphics);
        ctx.lineWidth=8;
        ctx.strokeColor = cc.hexToColor('#f50000');
        ctx.lineTo(x,y);
        ctx.stroke();
        
   }
});
