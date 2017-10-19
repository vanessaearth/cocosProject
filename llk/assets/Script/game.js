cc.Class({
    extends: cc.Component,

    properties: {
        imagePrefab:{
            default:null,
            type:cc.Prefab
        },
        imageList:{
            default:[],
            type:[cc.node]
        },
        a:{
            default:null,
            type:cc.SpriteFrame
        },
        b:{
            default:null,
            type:cc.SpriteFrame
        },
        c:{
            default:null,
            type:cc.SpriteFrame
        },
        d:{
            default:null,
            type:cc.SpriteFrame
        },
        display:{
            default:null,
            type:cc.Label
        },
        ErrorAudio:{
            default:null,
            url:cc.AudioClip
        },
        SuccessAudio:{
            default:null,
            url:cc.AudioClip
        },
        state:11,
        mcount:100,
        isempty:false,
        line:4, 
        row:4,  
        total:8,
        duration:10,
        count:1,
       
    },
    initimageList:function(){
        this.imageList[0].getComponent(cc.Sprite).spriteFrame=this.a;
        this.imageList[0].getComponent('pic').num=0;
        this.imageList[1].getComponent(cc.Sprite).spriteFrame=this.b;
        this.imageList[1].getComponent('pic').num=1;
        this.imageList[2].getComponent(cc.Sprite).spriteFrame=this.c;
        this.imageList[2].getComponent('pic').num=2;
        this.imageList[3].getComponent(cc.Sprite).spriteFrame=this.d;
        this.imageList[3].getComponent('pic').num=3;
        
        this.imageList[4].getComponent(cc.Sprite).spriteFrame=this.b;
        this.imageList[4].getComponent('pic').num=1;
        this.imageList[5].getComponent(cc.Sprite).spriteFrame=this.d;
        this.imageList[5].getComponent('pic').num=3;
        this.imageList[6].getComponent(cc.Sprite).spriteFrame=this.a;
        this.imageList[6].getComponent('pic').num=0;
        this.imageList[7].getComponent(cc.Sprite).spriteFrame=this.c;
        this.imageList[7].getComponent('pic').num=2;
        
        this.imageList[8].getComponent(cc.Sprite).spriteFrame=this.a;
        this.imageList[8].getComponent('pic').num=0;
        this.imageList[9].getComponent(cc.Sprite).spriteFrame=this.d;
        this.imageList[9].getComponent('pic').num=3;
        this.imageList[10].getComponent(cc.Sprite).spriteFrame=this.c;
        this.imageList[10].getComponent('pic').num=2;
        this.imageList[11].getComponent(cc.Sprite).spriteFrame=this.d;
        this.imageList[11].getComponent('pic').num=3;
        
        this.imageList[12].getComponent(cc.Sprite).spriteFrame=this.c;
        this.imageList[12].getComponent('pic').num=2;
        this.imageList[13].getComponent(cc.Sprite).spriteFrame=this.b;
        this.imageList[13].getComponent('pic').num=1;
        this.imageList[14].getComponent(cc.Sprite).spriteFrame=this.a;
        this.imageList[14].getComponent('pic').num=0;
        this.imageList[15].getComponent(cc.Sprite).spriteFrame=this.b;
        this.imageList[15].getComponent('pic').num=1;
        
    },
    initMap:function(){
        var self=this;
         for(var y = 0;y<4;y++){
            for(var x = 0;x < 4;x++){
                var newNode=cc.instantiate(this.imagePrefab);
                this.node.addChild(newNode);
                newNode.setPosition(cc.p(58*x-58*3/2,52*y-52*3/2));
                newNode.getComponent('pic').mcount=x+4*y;
                newNode.getComponent('pic').pointX=x;
                newNode.getComponent('pic').pointY=y;
                newNode.getComponent('pic').isempty=false;
                this.imageList.push(newNode);
                newNode.on(cc.Node.EventType.TOUCH_END,function(event){
                   if(self.state==11&&self.mcount==100){     //如果图片和位置都是初始值，则是第一个
                        self.state=this.getComponent('pic').num;
                        self.mcount=this.getComponent('pic').mcount;
                    }else if(self.mcount==this.getComponent('pic').mcount){    //如果位置相等，则是点自己
                        self.mcount=100;
                        self.state=11;
                        cc.audioEngine.playEffect(self.ErrorAudio,false);
                    }else if(self.state==this.getComponent('pic').num){
                        if(self.isLinked(this.getComponent('pic').mcount)){
                            this.getComponent(cc.Sprite).spriteFrame=null;
                            self.imageList[self.mcount].getComponent(cc.Sprite).spriteFrame=null;
                            this.getComponent('pic').isempty=true;
                            self.imageList[self.mcount].getComponent('pic').isempty=true;
                            cc.audioEngine.playEffect(self.SuccessAudio,false);
                            self.mcount=100;
                            self.state=11;
                            self.total-=1;
                            self.count--;
                            if(self.total===0){
                                self.gamePass();
                            }
                        }else{
                            //错误提示 不是同一张图片
                            cc.audioEngine.playEffect(self.ErrorAudio,false);
                            self.state=11;
                            self.mcount=100;
                        }
                    }else {
                        //错误提示 不是同一张图片
                        cc.audioEngine.playEffect(self.ErrorAudio,false);
                        self.state=11;
                        self.mcount=100;
                    }
                    cc.log('mcount点后值:'+self.mcount+'state点后值:'+self.state);
                   
                });
            }
            
         }
         this.initimageList();
    },
    isLinked:function(seccount){
        var x1=this.imageList[this.mcount].getComponent('pic').pointX;
        var y1=this.imageList[this.mcount].getComponent('pic').pointY;
        var x2=this.imageList[seccount].getComponent('pic').pointX;
        var y2=this.imageList[seccount].getComponent('pic').pointY;
        cc.log("x1="+x1+",x2="+x2+",y1="+y1+",y2="+y2);
        if(this.broken(x1,x2,y1,y2)){
            return true;
        }else if(this.brokenOne(x1,x2,y1,y2)){
            return true;
        }else if(this.brokenTwo(x1,x2,y1,y2)){
            return true;
        }else{
            return false;
        }
    },
    broken:function(x1,x2,y1,y2){
        var self=this;
        if(x1!==x2&&y1!==y2){return false;}
        if(x1===0&&x2===0||x1===3&&x2===3||y1===0&&y2===0||y1===3&&y2===3){
            return true;
        }
        if(x1===x2){
            var Ymin=Math.min(y1,y2);
            var Ymax=Math.max(y1,y2);
            for(Ymin++;Ymin<Ymax;Ymin++){
                cc.log(self.imageList[Ymin*4+x1].getComponent('pic').isempty);
                if(!self.imageList[Ymin*4+x1].getComponent('pic').isempty){
                    return false;
                }
            }
        }
        if(y1===y2){
            var Xmin=Math.min(x1,x2);
            var Xmax=Math.max(x1,x2);
            for(Xmin++;Xmin<Xmax;Xmin++){
                if(!self.imageList[y1*4+Xmin].getComponent('pic').isempty){
                    return false;
                }
            }
        }
        return true;
    },
    brokenOne:function(x1,x2,y1,y2){
        var self=this;
        if(x1===x2||y1===y2){return false;}
        var Xmin=Math.min(x1,x2);
        var Xmax=Math.max(x1,x2);
        var Ymin=Math.min(y1,y2);
        var Ymax=Math.max(y1,y2);
        if(self.imageList[Ymax*4+Xmin].getComponent('pic').isempty){
            if(self.broken(x1,Xmin,y1,Ymax)&&self.broken(x2,Xmin,y2,Ymax)){
                return true;
            }
        }
        if(self.imageList[Ymin*4+Xmax].getComponent('pic').isempty){
            if(self.broken(x1,Xmax,y1,Ymin)&&self.broken(x2,Xmax,y2,Ymin)){
                return true;
            }
        }
        if(self.imageList[Ymax*4+Xmax].getComponent('pic').isempty){
            if(self.broken(x1,Xmax,y1,Ymax)&&self.broken(x2,Xmax,y2,Ymax)){
                return true;
            }
        }
        if(self.imageList[Ymin*4+Xmin].getComponent('pic').isempty){
            if(self.broken(x1,Xmin,y1,Ymin)&&self.broken(x2,Xmin,y2,Ymin)){
                return true;
            }
        }
        return false;
    },
    brokenTwo:function(x1,x2,y1,y2){
        var self=this;
        var Xmin=Math.min(x1,x2);
        var Xmax=Math.max(x1,x2);
        var Ymin=Math.min(y1,y2);
        var Ymax=Math.max(y1,y2);
        var i;
        for(i=1;i<4;i++){
            if(self.imageList[(y1+i)*4+x1].getComponent('pic').isempty){
                if(self.brokenOne(x1,x2,y1+i,y2)){
                    return true;
                }
            }
            if(self.imageList[(y1-i)*4+x1].getComponent('pic').isempty){
                if(self.brokenOne(x1,x2,y1-i,y2)){
                    return true;
                }
            }
            if(self.imageList[y1*4+x1-i].getComponent('pic').isempty){
                if(self.brokenOne(x1-i,x2,y1,y2)){
                    return true;
                }
            }
            if(self.imageList[y1*4+x1+i].getComponent('pic').isempty){
                if(self.brokenOne(x1+i,x2,y1,y2)){
                    return true;
                }
            }
        }
        return false;
        
    },
    onLoad: function () {
        this.count=1;
        this.timer=0;
        this.initMap();
        cc.log('totle:'+this.total);
    },
    gameOver:function(){
        cc.director.loadScene('gameover');
    },
    gamePass:function(){
        cc.director.loadScene('gamepass');
    },
    update: function (dt) {
        this.timer+=dt;
         if(this.timer>this.duration){
            this.gameOver();
        }
        if(this.timer>this.count){
            this.display.string=this.duration-this.count;
            this.count+=1;
         }
    },
});
