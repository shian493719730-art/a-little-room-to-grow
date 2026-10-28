/* Community membership only. No person is assigned credit for the depicted support. */
const SupportCards = (() => {
  const source = 'https://www.cambridge-pledge.org/';
  // Names and affiliations are reproduced exactly as supplied by the user.
  const pledgers = Object.freeze([
    Object.freeze({name:'Clare Sutcliffe MBE', affiliation:'Co-founder, Code Club'}),
    Object.freeze({name:'Marcel Gehrung', affiliation:'CEO, Cyted Health'}),
    Object.freeze({name:'Edward Benthall', affiliation:'Jesus College, Cambridge'}),
    Object.freeze({name:'Kathryn Chapman', affiliation:'Innovate Cambridge'})
  ]);
  const kinds = Object.freeze(['food','cash','volunteer']);
  const deck = Object.freeze(kinds.flatMap((kind,k) => pledgers.map((person,p) => Object.freeze({
    id:`${kind}-${p}`, index:k*pledgers.length+p, kind, person:p,
    line:`${person.name} (${person.affiliation}) is also a Pledger.`
  }))));
  const hasDeck=s=>Array.isArray(s.supportDeck)&&s.supportDeck.length===12&&new Set(s.supportDeck).size===12&&s.supportDeck.every(id=>deck.some(c=>c.id===id));
  const canChoose=s=>s.phase==='ended'&&s.round===1&&s.supportRoll===null;
  function get(state){
    const kind=state.supportRoll||state.support;
    if(!kinds.includes(kind))return null;
    return deck.find(c=>c.id===state.supportCard&&c.kind===kind)||deck.find(c=>c.kind===kind);
  }
  function normalize(state){
    const card=get(state);
    // Old saves retain their already revealed support and receive a deterministic face.
    return card&&state.supportCard!==card.id?{...state,supportCard:card.id}:state;
  }
  function prepare(state,entropy){
    if(!canChoose(state)||hasDeck(state))return state;
    // Shuffle once, persist before showing the table. Card clicks never call randomness.
    const words=Array.isArray(entropy)||ArrayBuffer.isView(entropy)?Array.from(entropy):[];
    if(words.length<11||words.some(n=>!Number.isInteger(n)||n<0||n>4294967295))return state;
    const ids=deck.map(c=>c.id);
    for(let i=ids.length-1;i>0;i--){const j=Math.floor(words[11-i]/4294967296*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}
    return {...state,supportDeck:ids};
  }
  function table(state){return hasDeck(state)?state.supportDeck.map(id=>deck.find(c=>c.id===id)):state.supportRoll||state.support?deck.slice():[];}
  function choose(state,slot){
    if(!canChoose(state)||!hasDeck(state)||!Number.isInteger(slot)||slot<0||slot>=12)return state;
    const card=table(state)[slot],next=Game.reveal(state,kinds.indexOf(card.kind));
    return next===state?state:{...next,supportCard:card.id,chosenSlot:slot};
  }
  function start(state){
    const next=Game.startSupport(state),card=get(state);
    return next===state?state:{...next,supportCard:card.id};
  }
  function retry(state){
    if(state.phase!=='ended'||state.round!==2)return state;
    return {...Game.initial(state.support,2),supportCard:get(state).id};
  }
  return Object.freeze({deck,pledgers,source,get,normalize,hasDeck,prepare,table,choose,start,retry});
})();
