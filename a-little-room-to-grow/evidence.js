
const evidenceLinks=ids=>ids.map(id=>`<a href="${EVIDENCE[id].url}" target="_blank" rel="noopener">${EVIDENCE[id].by} · ${EVIDENCE[id].year} ↗</a>`).join('<br>');
const actionEvidence={
shift:{ids:['hospitality'],text:'为何选择餐厅服务工作？研究记录了餐旅业低薪与工时不稳定带来的生活压力。',model:'餐厅服务员是本作具体化的虚构岗位；£70、3 点体力、次数与缺班惩罚均为设计参数。'},
delivery:{ids:['gig','wellbeing'],text:'为何加入配送？英国研究覆盖了本地平台配送；另一项研究中，约 34% 的零工子样本同时有常规工作。',model:'使用“平台外卖配送”，不限定 Uber。£35 和 2 点体力不是真实报酬或体力测量。'},
water:{ids:['participation','parenting'],text:'花代表值得被照顾的生活：爱好、关系，以及照护需要。低收入不等于缺乏关爱。',model:'养花与儿童之间是创作隐喻，不是研究中的等价关系；+35、−30 与死亡阈值是游戏机制。'},
rest:{ids:['time','hospitality'],text:'研究中的时间贫困与疲劳，支持把休息纳入资源取舍。',model:'每周一次、恢复 2 点是叙事简化，不是医学恢复公式。'},
overtime:{ids:['hospitality','time'],text:'餐旅业访谈中，额外工作与人手不足伴随疲劳、压力和较差的工作生活平衡。',model:'“本周 +2、下周 −3”是后果可见的游戏设计，不是测得的因果剂量。'},
search:{ids:['jobloss'],text:'失去收入来源会加剧支付压力；FCA 研究关注失业与信用逾期。',model:'求职花 3 点且立即成功、两周缺班导致岗位关闭均为虚构规则，不是英国劳动制度。'}
};
function evidenceNote(item){return `<details class="evidence-note"><summary>研究依据 · ${item.text}</summary><p>${evidenceLinks(item.ids)}</p><p><b>游戏抽象：</b>${item.model}</p>${item.ids.map(id=>`<p class="scope">${EVIDENCE[id].scope}</p>`).join('')}</details>`;}
function renderActionEvidence(){document.querySelectorAll('[data-action]').forEach(button=>{const item=actionEvidence[button.dataset.action];if(item)button.insertAdjacentHTML('afterend',evidenceNote(item));});}
function reflectionHTML(){const cards=[
['60%','生活必需品也可能不够','2025 年调查中，英国收入最低 40% 的家庭有 60% 在过去六个月缺少必需品。','essentials'],
['约 34%','一份工作之外，还要再接工作','2022 年发表的英国疫情样本研究中，429 名零工工作者的子样本分析显示，约 34% 同时有常规工作。不是贫困家庭总体比例。','wellbeing'],
['10 小时','投入时间，不一定都有报酬','2022 年英国平台工作非概率样本中，本地工作者每周等待或寻找工作的时间中位数为 10 小时。涵盖配送、载客等。','gig'],
['时间也会短缺','疲劳会挤压生活空间','时间贫困研究将时间不足与较低幸福感和身体健康联系起来；它不是“努力不够”。','time'],
['不只是生存','社交和爱好也属于生活','英国研究发现低收入与较少社会参与相关，但并非所有人都失去社交。许多人仍努力维系关系。','participation'],
['照护也需要资源','家庭安排受到挤压','苏格兰餐旅业研究记录了昂贵托育与工作安排之间的冲突；部分受访者难以增加工时，也难以负担儿童活动。','hospitality'],
['关爱，不该被误读','小花也指向照护的余地','英国母亲研究不支持“低收入父母普遍养育更差”。本作的花象征需要时间与资源的照料，不用来衡量父母是否爱孩子。','parenting'],
['136 项研究','经济压力与心理健康相连','系统综述发现收入下降与心理健康恶化相关；研究效应与证据强度不一，不能说每个人都会如此。','income']
];return `<section class="reflection" aria-label="游戏之外的研究"><div class="pixel-divider" aria-hidden="true">▪ ▪ ▪ ▪ ▪</div><div class="eyebrow">BEYOND THE GAME</div><h3>一盆花之外，是生活的余地。</h3><p class="reflection-lead">你刚刚经历的是一个刻意压缩资源的虚构情境。真实家庭的经历各不相同，但研究记录了类似的取舍：工作、必需开支、休息、关系和照护争用有限的资源。</p><div class="research-cards">${cards.map(([value,title,body,id])=>`<article><span class="research-value">${value}</span><h4>${title}</h4><p>${body}</p><a href="${EVIDENCE[id].url}" target="_blank" rel="noopener">${EVIDENCE[id].by} · ${EVIDENCE[id].year} ↗</a></article>`).join('')}</div><p class="reflection-lead">支持的意义，是让人拥有更多照顾自己与所爱之人的空间。</p><button class="secondary" onclick="showEvidenceLibrary(true)">查看全部文献与机制对应</button></section>`;}
function supportEvidence(id){const config={food:{ids:['essentials'],text:'食物不足有调查依据；游戏中把食物支持转译成可用体力。',model:'每周 +2 体力是创作设定，未经过干预效果验证。'},cash:{ids:['income','essentials'],text:'收入与必需品压力、心理健康有关；经济援助用于演示预算余地。',model:'£120 是游戏参数，不是研究估计的最佳捐助额或效果。'},volunteer:{ids:['time'],text:'时间不足是研究议题；代做一项任务用于演示分担照料。',model:'志愿者代为浇花的具体效果没有直接研究验证，也不是 Cambridge Pledge 的服务承诺。'}};return evidenceNote(config[id]);}
function showEvidenceLibrary(fromResult=false){const el=document.getElementById('evidenceModal');el.innerHTML=`<div class="eyebrow">SOURCES & DESIGN</div><h2>研究支持议题，规则表达取舍。</h2><p>核查日期：2026-10-22。以下资料主要来自英国，也包括苏格兰研究和跨国综述；它们不是剑桥家庭的精确模拟参数。</p><div class="model-boundary"><b>明确属于游戏设计的设定</b><p>四周周期、£40 起点、£700 账单、体力 9−2、收入与次数限制、休息与透支扣点、两周缺班关闭岗位、求职即成功、花的生死阈值、第一轮不可兼得、随机支持及其数值，均没有直接实证标定。它们不用于预测真实家庭、雇佣关系或植物生长。</p></div>${Object.entries(actionEvidence).map(([id,a])=>`<section class="library-entry"><h3>${({shift:'餐厅服务班次',delivery:'平台外卖配送',water:'花／照护与爱好',rest:'休息',overtime:'透支与疲劳',search:'失业与求职'})[id]}</h3>${evidenceNote(a)}</section>`).join('')}<h3>支持卡与生活账单</h3>${['food','cash','volunteer'].map(supportEvidence).join('')}<p>£700 仅为“必要生活开支缺口”的剧情目标，不代表剑桥月租、家庭全部预算或最低生活标准。住房、能源、饮食等开支压力参见 JRF 调查。</p><h3>完整来源</h3>${Object.entries(EVIDENCE).map(([id,e])=>`<article class="library-entry" id="source-${id}"><span class="eyebrow">${e.kind} · ${e.year}</span><h4><a href="${e.url}" target="_blank" rel="noopener">${e.title} ↗</a></h4><p>${e.by}</p><p>${e.finding}</p><p class="scope">${e.scope}</p><p class="scope"><b>适用边界：</b>${e.limit}</p></article>`).join('')}<button class="primary" onclick="document.getElementById('evidenceModal').close()">返回${fromResult?'结局':'游戏'} →</button>`;el.showModal();}
