/* Source of the engine embedded into index.html by tests/build.mjs. No DOM or random calls. */
const Game = (() => {
  const COST = {restaurant:3, delivery:2, care:2, job:3};
  const LABEL = {restaurant:'餐厅班次',delivery:'配送工作',care:'照料花',rest:'休息',borrow:'透支',job:'寻找餐厅岗位'};
  const SUPPORT = {food:{name:'食物支持',effect:'每周初始可用体力 +2',icon:'▤'},cash:{name:'经济支持',effect:'初始准备金 +£120',icon:'£'},volunteer:{name:'志愿协助',effect:'每周末自动照料 +35，在自然衰减之前',icon:'✿'}};
  const freshCounts = () => ({restaurant:0,delivery:0,care:0,rest:0,borrow:0,job:0});
  function initial(support=null,round=1){
    return {week:1,round,support,money:40+(support==='cash'?120:0),flower:60,energy:support==='food'?9:7,capacity:support==='food'?9:7,debt:0,job:'employed',misses:0,exempt:false,counts:freshCounts(),income:0,startFlower:60,phase:'playing',revision:0,summary:null,history:[],supportRoll:null};
  }
  function reason(s,a){
    if(s.phase!=='playing')return '请先完成当前结算或结局';
    const c=s.counts;
    if(a==='restaurant'&&s.job==='unemployed')return '已失业：先寻找餐厅岗位';
    if(a==='job'&&s.job!=='unemployed')return '目前在职，失业后可用';
    if(a==='restaurant'&&c.restaurant>=2)return '本周已完成上限 2 次';
    if(a==='delivery'&&c.delivery>=3)return '本周已完成上限 3 次';
    if(a==='care'&&s.flower===0)return '花已死亡，无法复活';
    if(a==='care'&&c.care)return '本周已经照料过一次';
    if(a==='rest'&&c.rest)return '本周已经休息过一次';
    if(a==='rest'&&s.energy>=s.capacity)return '当前体力已达本周恢复上限';
    if(a==='borrow'&&s.week===4)return '最后一周不可透支';
    if(a==='borrow'&&c.borrow)return '本周已经透支过一次';
    if(COST[a]&&s.energy<COST[a])return `体力不足：需要 ${COST[a]}，当前 ${s.energy}`;
    if(!Object.hasOwn(LABEL,a))return '未知行动';
    return '';
  }
  function act(s,a,revision=s.revision){
    if(revision!==s.revision||reason(s,a))return s;
    const n={...s,counts:{...s.counts},revision:s.revision+1};
    n.counts[a]++;
    if(COST[a])n.energy-=COST[a];
    if(a==='restaurant'){n.money+=70;n.income+=70;n.job='employed';n.misses=0;}
    if(a==='delivery'){n.money+=35;n.income+=35;}
    if(a==='care')n.flower=Math.min(100,n.flower+35);
    if(a==='rest')n.energy=Math.min(n.capacity,n.energy+2);
    if(a==='borrow')n.energy+=2;
    if(a==='job'){n.job='reemployed';n.misses=0;n.exempt=true;}
    return n;
  }
  function end(s,revision=s.revision){
    if(s.phase!=='playing'||revision!==s.revision)return s;
    const n={...s,phase:'settlement',revision:s.revision+1};
    const before=s.flower;
    const care=s.support==='volunteer'&&before>0?Math.min(35,100-before):0;
    n.flower=before>0?Math.max(0,before+care-30):0;
    let jobEvent='';
    if(s.job!=='unemployed'&&!s.exempt&&s.counts.restaurant===0){
      n.misses=s.misses+1;
      if(n.misses>=2){n.job='unemployed';jobEvent='fired';}
      else {n.job='warning';jobEvent='warning';}
    }else if(s.job!=='unemployed'){n.misses=0;n.job=s.exempt?'reemployed':'employed';}
    const nextDebt=s.counts.borrow?3:0;
    const nextCapacity=7+(s.support==='food'?2:0)-nextDebt;
    n.summary={week:s.week,income:s.income,money:s.money,gap:Math.max(0,700-s.money),energy:s.energy,startFlower:s.startFlower,beforeFlower:before,supportCare:care,decay:before>0?Math.min(30,before+care):0,flower:n.flower,jobEvent,nextDebt,nextCapacity,final:s.week===4};
    return n;
  }
  function confirm(s,revision=s.revision){
    if(s.phase!=='settlement'||s.revision!==revision)return s;
    const history=[...s.history,s.summary];
    if(s.week===4)return {...s,phase:'ended',history,revision:s.revision+1};
    return {...s,week:s.week+1,energy:s.summary.nextCapacity,capacity:s.summary.nextCapacity,debt:s.summary.nextDebt,counts:freshCounts(),income:0,startFlower:s.flower,exempt:false,phase:'playing',history,summary:null,revision:s.revision+1};
  }
  function reveal(s,index){
    if(s.phase!=='ended'||s.round!==1||s.supportRoll!==null)return s;
    return {...s,supportRoll:['food','cash','volunteer'][Math.min(2,Math.max(0,index|0))],phase:'revealed',revision:s.revision+1};
  }
  function startSupport(s){
    if(s.phase!=='revealed'||!s.supportRoll)return s;
    return initial(s.supportRoll,2);
  }
  function outcome(s){return {bill:s.money>=700,flower:s.flower>0};}
  return {initial,reason,act,end,confirm,reveal,startSupport,outcome,LABEL,SUPPORT};
})();
if(typeof module!=='undefined')module.exports=Game;
