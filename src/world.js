(()=>{const P=PB,W=P.W={};
/* map = [name, theme, obstacles, grass table rate/level/weighted species, exits side/dest/x/y/require, guardian species/level/x/y]. */
W.maps=[
['STARTER SHRINE',0,[8,55,30,73,126,25,28,29,126,128,28,38],[],[1,1,14,92,0],[]],
['MEADOW PATH',1,[205,28,77,48,58,126,48,34],[4,4,4,4,2],[0,0,306,92,0,1,2,14,92,0,2,3,160,150,0],[3,8,245,80]],
['FLOWER GROVE',2,[192,32,54,40,88,116,34,41],[5,5,0,0,8],[0,1,306,92,0,1,4,14,92,0],[5,9,70,72]],
['MOONGLADE',3,[36,30,66,36,214,112,65,34],[5,5,6,6,2],[3,1,160,32,0,1,2,14,92,0],[7,10,86,120]],
['CINDER PASS',4,[86,30,38,45,218,108,52,42],[4,6,10,10,8],[0,2,306,92,0,1,5,14,92,0],[11,10,245,55]],
['AURORA REACH',5,[188,28,78,42,48,118,55,36],[4,6,4,6,10],[0,4,306,92,0,1,6,14,92,13],[9,11,118,80]],
['PRISM SUMMIT',6,[74,34,34,42,74,106,34,40],[],[0,5,306,92,0],[1,12,226,92]]
];
W.keys={};W.msg='';W.msgT=0;W.shr=[58,92];W.map=0;W.fade=W.cool=0;W.sel=0;W.r=17;W.tile=-1;W.face=0;
W.path=(t,x,y)=>t===0?(Math.abs(y-92)<16&&x>55)||Math.hypot(x-62,y-92)<44:t===3?Math.abs(x-160)<16||Math.abs(y-92)<15&&x>145:t===6?Math.abs(y-92)<15||Math.hypot(x-235,y-92)<42:Math.abs(y-92+Math.sin(x/(35+t*3))*(t===4?5:8))<15;
W.near=()=>W.map===0&&Math.hypot(W.x-W.shr[0],W.y-W.shr[1])<20;W.guard=()=>{let G=W.maps[W.map][5];return G.length&&!(W.map===6&&P.data.done)&&Math.hypot(W.x-G[2],W.y-G[3])<17?G:0};
W.start=()=>{W.map=P.data.map||0;let p=P.data.pos||[72,92];if(!W.maps[W.map]){W.map=0;p=[72,92]}W.x=p[0];W.y=p[1];W.tile=(W.x>>3)*32+(W.y>>3);P.scene=W.map===0&&P.data.seen===1&&!P.data.reserve.length?'guide':'world'};
W.gate=(s,x,y)=>s<2?y>68&&y<116:x>120&&x<200;W.ex=s=>{let a=W.maps[W.map][4];for(let i=0;i<a.length;i+=5)if(a[i]===s)return i;return-1};W.full=()=>((P.data.master||0)&4095)===4095;W.ok=r=>r!==13||W.full();
W.side=(x,y)=>x<4?0:x>316?1:y<25?2:y>166?3:-1;
W.block=(x,y)=>{let s=W.side(x,y);if(s>=0){let j=W.ex(s),a=W.maps[W.map][4];return j<0||!W.gate(s,x,y)||!W.ok(a[j+4])}let a=W.maps[W.map][2];for(let i=0;i<a.length;i+=4)if(x>a[i]&&x<a[i]+a[i+2]&&y>a[i+1]&&y<a[i+1]+a[i+3])return 1;return 0};
W.travel=j=>{let e=W.maps[W.map][4];W.map=e[j+1];W.x=e[j+2];W.y=e[j+3];W.tile=(W.x>>3)*32+(W.y>>3);W.fade=160;P.data.map=W.map;P.data.pos=[W.x,W.y];P.save(P.data);W.note(W.maps[W.map][0])};
W.wild=()=>{let M=W.maps[W.map],A=M[3];if(!A.length||W.cool>0||W.path(M[1],W.x,W.y))return;W.r=(W.r*17+11)%251;if(W.r%A[0])return;W.r=(W.r*17+11)%251;let sid=A[2+W.r%(A.length-2)];P.data.map=W.map;P.data.pos=[W.x,W.y];P.save(P.data);P.s(260,.12,.55);P.B.new(0,sid,A[1],(W.r+sid*11+W.map*37)%97)};
W.tick=dt=>{let om=W.map,k=W.keys,dx=(k.ArrowRight||k.d?1:0)-(k.ArrowLeft||k.a?1:0),dy=(k.ArrowDown||k.s?1:0)-(k.ArrowUp||k.w?1:0);if(dx)W.face=dx<0;let l=Math.hypot(dx,dy)||1,nx=W.x+dx/l*dt*.075,ny=W.y+dy/l*dt*.075,s=W.side(nx,ny);if(s>=0&&W.gate(s,nx,ny)){let j=W.ex(s),e=W.maps[W.map][4];if(j>=0){if(W.ok(e[j+4]))W.travel(j);else W.note(`PRISM SEAL — ${12-P.bc(P.data.master)} FORMS REMAIN`)}}if(W.map===om){if(!W.block(nx,W.y))W.x=nx;if(!W.block(W.x,ny))W.y=ny}if(W.msgT>0)W.msgT-=dt;if(W.fade>0)W.fade-=dt;if(W.cool>0)W.cool-=dt;if(W.burst&&(W.burst[3]-=dt)<0)W.burst=0;if(W.near()){let hurt=P.data.party.some(c=>c.hp<c.hpMax);if(hurt){P.data.party.forEach(c=>c.hp=c.hpMax);W.note('PRISM SHRINE RESTORES YOUR TEAM');P.save(P.data)}}let tile=(W.x>>3)*32+(W.y>>3);if(tile!==W.tile){W.tile=tile;W.wild();if(P.scene==='battle')return}P.data.map=W.map;P.data.pos=[W.x,W.y]};W.challenge=()=>{let G=W.guard();if(!G||W.cool>0)return;P.data.map=W.map;P.data.pos=[W.x,W.y];P.save(P.data);P.s(W.map===6?90:150,.28,.5);P.B.new(-1,G[0],G[1],(W.map*37+G[0]*11+31)%97)};
W.open=()=>{if(!W.near())return;W.keys={};W.sel=0;P.scene='sanctuary'};W.close=()=>{P.scene='world';W.keys={}};W.swap=i=>{let r=P.data.reserve,a=P.data.party;if(i<0||i>=r.length)return;if(W.sel>=a.length){if(a.length>=3)return;a.push(r.splice(i,1)[0])}else{let q=a[W.sel];a[W.sel]=r[i];r[i]=q}P.save(P.data)};
W.note=s=>{W.msg=s;W.msgT=1400};W.return=(id,wiped,win)=>{if(!wiped&&id<0&&W.map===6&&win===3)P.data.done=1;if(wiped){W.map=0;W.x=W.shr[0]+20;W.y=W.shr[1];P.data.party.forEach(c=>c.hp=c.hpMax)}W.cool=900;W.tile=(W.x>>3)*32+(W.y>>3);P.data.map=W.map;P.data.pos=[W.x,W.y];P.save(P.data);P.scene=!wiped&&id<0&&W.map===6&&win===3?'ending':'world';W.note(wiped?'YOUR TEAM REFORMS AT THE SHRINE':win===1?'SPIRIT HARMONIZED':id<0?'GUARDIAN YIELDS TRAINING LIGHT':'THE SPIRIT RETURNS TO THE GRASS');if(P.scene==='ending')P.s(440,.55,2,1)};
W.end=()=>{P.saved=1;P.goMenu(0)};
/* Six optional Prism Echoes, one per affinity, hidden at thematic landmarks across the
existing maps. Deliberate Enter interaction collects one (burst + cue + conservative party
XP) or, once collected, replays a short environmental line. Tracked in a 6-bit echoes mask. */
W.ech=[[0,100,50],[1,200,70],[2,140,50],[3,110,50],[5,150,60],[4,144,60]];
W.echMsg=['THE SHRINE LIGHT WARMS YOU.','THE WATER HUMS WITH TIDE.','PETALS DRIFT ON A GROVE BREEZE.','MOONGLADE DREAMS IN SILVER.','THE CRYSTALS ANSWER VOLT.','AN OLD EMBER STILL BURNS.'];
W.echAt=()=>{for(let i=0;i<6;i++){let e=W.ech[i];if(e[0]===W.map&&Math.hypot(W.x-e[1],W.y-e[2])<15)return i}return-1};
W.interact=()=>{let i=W.echAt();if(i<0)return 0;if(P.data.echoes>>i&1){W.note(W.echMsg[i]);return 1}P.data.echoes|=1<<i;W.burst=[W.x,W.y,i,600];P.B.progress=[];P.data.party.forEach(c=>P.B.gain(c,60));let full=P.bc(P.data.echoes)===6;P.s(430,.12,1.6,1);P.s(590,.18,2,1);if(full)P.s(760,.32,2.4,1);W.note(full?'THE SIX ECHOES RESONATE • +60 TEAM XP':`${['SOLAR','TIDE','GROVE','MOON','VOLT','EMBER'][i]} PRISM ECHO • +60 TEAM XP`);P.save(P.data);if(P.B.progress.length){W.keys={};P.B.field=1+!!(full&&P.data.done);P.scene='battle';P.B.nextProgress()}else if(full&&P.data.done)P.scene='ending';return 1};
})();
