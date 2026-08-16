(()=>{const P=window.PB={saveKey:'prismbound16',cap:10};
P.pal=[['#ffd75a','#ff7845','#fff3a0'],['#67dfff','#4679ff','#b7f4ff'],['#8ee06d','#3e9f55','#d1f28b'],['#c69aff','#6755c9','#f0d7ff'],['#fff26b','#a35cff','#d8f8ff'],['#ff8a4c','#d94141','#ffd06a']];
P.need=l=>l*50;P.mn=['GLEAM','HALO','SOOTHE RAY','SUNSTEP','RIPPLE','MIST VEIL','LULL CURRENT','UNDERTOW','LEAFLIGHT','ROOT WARD','POLLEN PULSE','BLOOM BURST','MOONBITE','VEIL','DREAM LULL','NIGHTFALL','SPARK','STATIC COAT','HUSH FLASH','BOLT DIVE','CINDER','ASH WARD','COOL EMBER','BLAZE RUSH','SOLAR FANG','TIDAL CRASH','THORN CROWN','LUNAR HORN','STORM LANCE','INFERNO RUSH'];
P.mv=[[5,3,0,0],[0,0,1,1],[1,8,1,0],[9,3,2,0],[11,4,2,0],[8,9,2,0],[7,6,1,0],[6,11,2,0],[13,2,2,0],[15,1,3,0]];P.m=i=>P.mv[i>23?i-20:i&3];P.ma=i=>i>23?i-24:i>>2;P.kit=a=>[a*4,a*4+1,a*4+2,a*4+3];P.bc=n=>{let c=0;for(;n;n>>=1)c+=n&1;return c};P.o=(f,d=.08,v=.04,w=0,r=1)=>{if(P.mute)return;try{let a=P.a||(P.a=new AudioContext),o=a.createOscillator(),g=a.createGain(),t=a.currentTime;a.resume();o.type=w?'triangle':'square';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f*r),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(a.destination);o.start();o.stop(t+d)}catch(e){}};P.s=(f,d=.08,r=1,w=0)=>P.o(f,d,.045,w,r);P.mu=[['HKONKOHKQTONKO..','<...C...?...C...'],['HKOTVTOHKQOTXTOQ','<C?C<C?C@C?C<C?C']];P.audio=()=>{try{P.a||(P.a=new AudioContext);P.a.resume();if(P.mt)return;P.mi=0;P.mt=setInterval(()=>{if(!P.a||P.scene==='guide'||P.scene==='ending')return;let b=P.scene==='battle',q=P.mu[b?1:0],i=P.mi++,k=i&15,z=(b&&P.B?.boss?(P.B.final?-7:-4):0)+(i&16&&!b?2:0);for(let j=0;j<2;j++){let n=q[j].charCodeAt(k)-48;if(n>0&&!(j&&i&16&&k%4===2))P.o(55*2**((n+z)/12),.13,j?.009:.014,j)}if(b&&!(k&3))P.o(k&4?65:85,.05,.006,0,.55)},150)}catch(e){}};
/* Six elemental lineages: even IDs are simple wild emotes; each reaches LV10 and evolves into the following unicorn form. */
P.spec=[
['GLOWLET',0,0,0,27,7,4,7,10,1,[]],['SOLARIS',0,0,0,39,12,7,9,0,-1,[10,24]],
['DEWISP',1,0,0,27,6,6,6,10,3,[]],['RIPPLEHORN',1,0,0,38,10,8,8,0,-1,[10,25]],
['BUDLING',2,0,0,29,4,6,8,10,5,[]],['BLOOMHART',2,0,0,40,9,10,7,0,-1,[10,26]],
['MOONLET',3,0,0,26,7,5,9,10,7,[]],['MOONHART',3,0,0,37,10,7,10,0,-1,[10,27]],
['ZAPPIT',4,0,0,23,8,4,9,10,9,[]],['VOLTMARE',4,0,0,34,11,6,11,0,-1,[10,28]],
['CINDLET',5,0,0,27,9,4,8,10,11,[]],['EMBERHORN',5,0,0,39,12,7,9,0,-1,[10,29]]
];
P.learn=(s,l)=>{let a=P.spec[s][10];for(let i=0;i<a.length;i+=2)if(a[i]===l)return a[i+1];return-1};
P.make=(species,level,moves,xp=0,seed)=>{let s=P.spec[species],d=!moves;moves=moves||P.kit(s[1]);if(d&&species&1)moves[3]=24+s[1];let z=seed??(species*31+level*17+11)%97;return{species,level,xp,moves:[...moves],hpMax:s[4]+level*2,hp:s[4]+level*2,pwr:s[5]+level,grd:s[6]+(level>>1),spd:s[7]+(level>>1),cd:[0,0,0,0],shield:0,seed:z}};
P.initial=()=>({party:[P.make(0,6,P.kit(0),0,11)],reserve:[],seen:1,master:0,map:0,pos:[112,92],done:0,echoes:0});
P.pack=d=>[d.party.map(c=>[c.species,c.level,c.xp,c.moves,c.seed,c.hp]),d.reserve.map(c=>[c.species,c.level,c.xp,c.moves,c.seed,c.hp]),d.seen||0,d.master||0,d.map||0,d.pos||[112,92],d.done||0,d.echoes||0];
P.unpack=d=>{let f=a=>{let c=P.make(a[0],a[1],a[3],a[2],a[4]);c.hp=Math.max(0,Math.min(c.hpMax,a[5]??c.hpMax));return c};return{party:d[0].map(f),reserve:(d[1]||[]).map(f),seen:d[2]||0,master:d[3]||0,map:d[4]||0,pos:d[5]||[112,92],done:d[6]||0,echoes:d[7]||0}};
P.load=()=>{try{let d=JSON.parse(localStorage.getItem(P.saveKey));if(d&&Array.isArray(d[0]))return P.unpack(d)}catch(e){}if(P.mem)return P.unpack(P.mem);return P.initial()};P.save=d=>{let p=P.pack(d);P.mem=p;try{localStorage.setItem(P.saveKey,JSON.stringify(p))}catch(e){}};P.reset=()=>{P.mem=null;try{localStorage.removeItem(P.saveKey)}catch(e){}};
})();
