cc.Class({
    extends: cc.Component,

    properties: {
        imgPrefab:{
            default:null,
            type:cc.Prefab
        },
        imageList:[],
        vis:[],
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
        e:{
            default:null,
            type:cc.SpriteFrame
        },
        ErrorAudio:{
            default:null,
            url:cc.AudioClip
        },
        SuccessAudio:{
            default:null,
            url:cc.AudioClip
        },
        display:{
            default:null,
            type:cc.Label
        },
        displaytime:{
            default:null,
            type:cc.Label
        },
        num:100,
        mcount:100,
        pointX:100,
        pointY:100,
        row:3,
        col:3,
        length:12,
        duration:20,
        count:1,
        daojishi:1,
    },

    initIMG:function(){
        var length=this.length;
        for(var i=0;i<length;i++){
		    this.imageList[i].getComponent('pic').num=parseInt(Math.random() * 10) % 4;
		    var num=this.imageList[i].getComponent('pic').num;
		    switch(num){
		        case 0:this.imageList[i].getComponent(cc.Sprite).spriteFrame=this.a;break;
		        case 1:this.imageList[i].getComponent(cc.Sprite).spriteFrame=this.b;break;
		        case 2:this.imageList[i].getComponent(cc.Sprite).spriteFrame=this.c;break;
		        case 3:this.imageList[i].getComponent(cc.Sprite).spriteFrame=this.d;break;
		    }
		    cc.log("i:"+i+", initnum:"+num);
		}
// 		this.imageList[0].getComponent('pic').num=0;
// 		this.imageList[0].getComponent(cc.Sprite).spriteFrame=this.a;
// 		this.imageList[1].getComponent('pic').num=0;
// 		this.imageList[1].getComponent(cc.Sprite).spriteFrame=this.a;
// 		this.imageList[2].getComponent('pic').num=0;
// 		this.imageList[2].getComponent(cc.Sprite).spriteFrame=this.a;
		
// 		this.imageList[3].getComponent('pic').num=1;
// 		this.imageList[3].getComponent(cc.Sprite).spriteFrame=this.b;
// 		this.imageList[4].getComponent('pic').num=2;
// 		this.imageList[4].getComponent(cc.Sprite).spriteFrame=this.c;
// 		this.imageList[5].getComponent('pic').num=2;
// 		this.imageList[5].getComponent(cc.Sprite).spriteFrame=this.c;
		
// 		this.imageList[6].getComponent('pic').num=2;
// 		this.imageList[6].getComponent(cc.Sprite).spriteFrame=this.c;
// 		this.imageList[7].getComponent('pic').num=0;
// 		this.imageList[7].getComponent(cc.Sprite).spriteFrame=this.a;
// 		this.imageList[8].getComponent('pic').num=0;
// 		this.imageList[8].getComponent(cc.Sprite).spriteFrame=this.a;


		this.scanallimgs();
    },
    initMAP:function(){
        var row=this.row;
        var col=this.col;
        var newNode;
        var self=this;
        for(var y=0;y<row;y++){
            for(var x=0;x<col;x++){
                newNode=cc.instantiate(this.imgPrefab);
                this.node.addChild(newNode);
                newNode.setPosition(cc.p(68*x-68*3,68*y-68*3-60));
                newNode.getComponent('pic').mcount=x+col*y;
                newNode.getComponent('pic').pointX=x;
                newNode.getComponent('pic').pointY=y;
                newNode.getComponent('pic').isempty=false;
                this.imageList.push(newNode);
                newNode.on(cc.Node.EventType.TOUCH_END,function(event){
                    if(self.num==100&&self.mcount==100){
                        self.num=this.getComponent('pic').num;
                        self.mcount=this.getComponent('pic').mcount;
                        cc.log('第一次');
                    }else if(self.mcount==this.getComponent('pic').mcount){
                        cc.log('点自己');
                        self.mcount=100;
                        self.num=100;
                        cc.audioEngine.playEffect(self.ErrorAudio,false);
                    }else if(self.around(self.mcount,this.getComponent('pic').mcount,col)){
                        cc.log('在周围');
                        self.change(this.getComponent('pic').mcount);
                        var p1=self.scan(this.getComponent('pic').mcount);
                        var p2=self.scan(self.mcount)
                        if(p1||p2){
                            cc.log('move');
                            setTimeout(self.removeImg(), 5000);
                           // self.removeImg();
                            self.addImg();
                            self.scanallimgs();
                            cc.audioEngine.playEffect(self.SuccessAudio,false);
                            self.mcount=100;
                            self.num=100;
                            
                        }else{
                            cc.log('没有可消的');
                            self.change(this.getComponent('pic').mcount);
                            self.mcount=100;
                            self.num=100;
                            cc.audioEngine.playEffect(self.ErrorAudio,false);
                        }
                       
                    }else{
                        cc.log('不在周围');
                        self.mcount=100;
                        self.num=100;
                        cc.audioEngine.playEffect(self.ErrorAudio,false);
                    }
                });
                
            }
        }
        this.initIMG();
    },
    pCount:function(x,y){
      if(x){return true;}
      else if(y){return true;}
      else if(x&&y){return true}
      else{return false;}
    },
    around:function(a,b,y){
        cc.log(a,b,y);
        if(a==b+1){
            return true;
        }else if(a==b-1){
            return true;
        }else if(a==b+y){
            return true;
        }else if(a==b-y){
            return true;
        }else{
            return false;
        }
    },
    change:function(seccount){
        var n3,m3,x3,y3,s3;
        n3=this.imageList[this.mcount].getComponent('pic').num;
        this.imageList[this.mcount].getComponent('pic').num=this.imageList[seccount].getComponent('pic').num;
        this.imageList[seccount].getComponent('pic').num=n3;
         
        s3=this.imageList[this.mcount].getComponent(cc.Sprite).spriteFrame;
        this.imageList[this.mcount].getComponent(cc.Sprite).spriteFrame=this.imageList[seccount].getComponent(cc.Sprite).spriteFrame;
        this.imageList[seccount].getComponent(cc.Sprite).spriteFrame=s3;

    },
    scan:function(seccount){
        var col=this.col;
        var row=this.row;
        var length=this.length;
        var scan_lr=1,scan_ud=1;
        var l_rnum=0,u_dnum=0;
        var n2=this.imageList[seccount].getComponent('pic').num;
        var x2=this.imageList[seccount].getComponent('pic').pointX;
        var y2=this.imageList[seccount].getComponent('pic').pointY;
        var left_x=x2,left_y=y2;
        var up_x=x2,up_y=y2;
        if(scan_lr===1){
            for(var a=0;;a++){
                if(x2-a<0||this.imageList[seccount-a].getComponent('pic').num!==n2){
                    break;
                }else if(this.imageList[seccount-a].getComponent('pic').num===n2){//向左扫描
                    this.vis[x2-a][y2]++;
                    l_rnum++;
                    if(a!==0){
                        left_x--;
                    }
                }
            }
            for(var a=1;;a++){
                if(x2+a>col-1||this.imageList[seccount+a].getComponent('pic').num!==n2){
                    break;
                }else if(this.imageList[seccount+a].getComponent('pic').num===n2){//向右扫描
                   this.vis[x2+a][y2]++;
                    l_rnum++;   
                }
            }
            if(l_rnum<3){
                for(var i=0;i<l_rnum;i++){
                    this.vis[left_x+i][left_y]--;
                }
                l_rnum=0;
            }
        }
        if(scan_lr===1){
            for(var a=0;;a++){
                if(y2+a>row-1||this.imageList[seccount+col*a].getComponent('pic').num!==n2){
                    break;
                }else if(this.imageList[seccount+col*a].getComponent('pic').num===n2){//向上扫描
                   this.vis[x2][y2+a]++;
                    u_dnum++;
                    if(a!==0){
                         up_y++;
                    }
                }
            }
            for(var a=1;;a++){
                if(y2-a<0||this.imageList[seccount-col*a].getComponent('pic').num!==n2){
                    break;
                }else if(this.imageList[seccount-col*a].getComponent('pic').num===n2){//向下扫描
                    this.vis[x2][y2-a]++;
                    u_dnum++;
                }
            }
            if(u_dnum<3){
                for(var i=0;i<u_dnum;i++){
                   this.vis[up_x][up_y-i]--;
                }
                u_dnum=0;
            }
        }
        if(l_rnum>=3||u_dnum>=3){
            u_dnum=0;
            l_rnum=0;
            return 1;
        }else{
            l_rnum=0;
            u_dnum=0;
            return 0;
        }
    },
    removeImg:function(){
        var row=this.row;
        var col=this.col;
        var flag=0 ;
        for(var j=0;j<row;j++){
            for(var i=0;i<col;i++){
                // cc.log("remove vis数组:"+i,j,this.vis[i][j]);
              if(this.vis[i][j]>0){
                  this.count++;
                  
                   this.vis[i][j]=0;
                    this.imageList[i+j*col].getComponent(cc.Sprite).spriteFrame=null;
                    this.imageList[i+j*col].getComponent('pic').isempty=true;
                    flag = 1; 
                }
                //cc.log("count"+this.count);
            }
        }
        return flag;
    },
    addImg:function(){
        var length=this.length;
        var num;
      for(var i=0;i<length;i++){
          if(this.imageList[i].getComponent('pic').isempty){
            this.imageList[i].getComponent('pic').isempty=false;
            this.imageList[i].getComponent('pic').num=parseInt(Math.random() * 10) % 5;
		    num=this.imageList[i].getComponent('pic').num;
		    switch(num){
		        case 0:this.imageList[i].getComponent(cc.Sprite).spriteFrame=this.a;break;
		        case 1:this.imageList[i].getComponent(cc.Sprite).spriteFrame=this.b;break;
		        case 2:this.imageList[i].getComponent(cc.Sprite).spriteFrame=this.c;break;
		        case 3:this.imageList[i].getComponent(cc.Sprite).spriteFrame=this.d;break;
		        case 4:this.imageList[i].getComponent(cc.Sprite).spriteFrame=this.e;break;
		    }
		    cc.log("i:"+i+", add num:"+num);
		  }
		  
		}  
    },
    scanallimgs:function(){
        var length=this.length;
        var s=1;
        while(s!=0){
            for(var i=0;i<length;i++){
                this.scan(i);
            }
            
            s=this.removeImg(); 
            this.addImg();
        }
    },
    initVis:function(){
        var row=this.row;
        var col=this.col;
        for (var i=0 ; i < col; i++) {
            this.vis[i]=[];
            for(var j=0;j<row;j++){
                this.vis[i][j]=0;
                //cc.log(i,j,this.vis[i][j]);
            }
        }
    },
    onLoad: function () {
       this.count=0;
        this.daojishi=1;
        this.timer=0;
        cc.log(this.display.string);
        this.initVis();
        this.initMAP();
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
        if(this.timer>this.daojishi){
            this.displaytime.string=this.duration-this.daojishi;
            this.daojishi+=1;
         }
        this.display.string=this.count;
        if(this.count>50){
            this.gamePass();
        }    
         
    },
});
