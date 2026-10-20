import { CellWorld } from './cell-world.js';

const materialIds = ['glucose', 'oxygen', 'carbon', 'water'];
const materials = [
  { key:'glucose', group:'input', number:1, formula:'C₆H₁₂O₆', color:'#d9a451' },
  { key:'oxygen', group:'input', number:2, formula:'O₂', color:'#6ab7cb' },
  { key:'carbon', group:'output', number:1, formula:'CO₂', color:'#b183a8' },
  { key:'water', group:'output', number:2, formula:'H₂O', color:'#7bbed9' }
];
const choices = ['glucose', 'oxygen', 'carbon', 'water', 'sunlight', 'chlorophyll'];
const questions = [
  { key:'where', color:'#d990aa', icon:'✿', correct:2 },
  { key:'time', color:'#a7a5d1', icon:'◷', correct:2 },
  { key:'energy', color:'#e9bf65', icon:'✳', correct:3 }
];
const copy = {
  en: {
    pageTitle:'Respiration', documentTitle:'Cell Lab · Respiration', description:'Explore cellular respiration with a 3D cell. Identify the raw materials and products, then answer three questions.', brand:'CELL LAB', restartLabel:'Restart the game', controls:'Game controls', pause:'Ⅱ Pause', resume:'▶ Resume', languageButton:'🌐 English', switchLanguage:'Switch to Chinese', unlocked:'UNLOCKED', stageLabel:'Rotatable 3D cell model', canvasLabel:'A rotatable animal cell. Molecules enter from the left and leave on the right.', loading:'Building the 3D cell…', fallbackLabel:'Cellular respiration model', resetView:'Reset model view', startAgain:'↻ Start again', gesture:'Drag to rotate · Pinch to zoom', materialTray:'Choose raw materials and products', inputs:'Raw materials', outputs:'Products', selectInput:'Select…', selectOutput:'Select…', selectSlot:'Choose a substance for', slotInput:'Raw material', slotOutput:'Product', materialNames:{glucose:'Glucose',oxygen:'Oxygen',carbon:'Carbon dioxide',water:'Water',sunlight:'Sunlight',chlorophyll:'Chlorophyll'}, materialIntro:'Choose the four substances to reveal the equation.', materialWrong:'Not quite. Try another substance for {slot}.', materialCorrect:'{name} unlocked.', materialAll:'All four substances found. Answer the questions on the right.', equationLabel:'Cellular respiration equation', equationTitle:'Respiration equation', energyReleased:'✳ Energy is released for cells to use.', modelNote:'Simplified animal cell model · Molecules and sizes are illustrative.', questionNumber:'QUESTION {number} / 7', chooseAnswer:'Choose the correct answer', completedLabel:'Completed', correct:'Correct!', unlockedQuestion:'{name} unlocked!', next:'Next question →', finishButton:'See the complete model →', wrong:'Try again: {hint}', answerNote:'The cell model changes colour after a correct answer.', continued:'Unlocked particles keep moving as you continue.', complete:'Cell factory complete!', completeText:'You identified four substances and answered three questions. The equation is complete, and the cell keeps running.', playAgain:'↻ Play again', stageInitial:'Choose four substances beside the model.', stageMaterial:'{name} identified.', stageAll:'All four substances found. Continue with the questions.', energyLabel:'↑ Energy', topic:{where:'WHO',time:'WHEN',energy:'ENERGY'}, questionName:{where:'Who respires?',time:'When does it happen?',energy:'Energy released'}, materialFact:{glucose:'Glucose is a raw material for respiration.',oxygen:'Oxygen is a raw material for aerobic respiration.',carbon:'Carbon dioxide is a product of respiration.',water:'Water is a product of respiration.'}, questions:[
      {title:'Which living things carry out respiration?',prompt:'This model shows an animal cell. What about plants?',options:['Animals only','Plants only','Living cells in both plants and animals','Only organisms with lungs'],hint:'Plant cells also need energy and have mitochondria.',fact:'Living cells in both plants and animals carry out respiration. This model shows an animal cell.',caption:'The cell lights up; plant cells respire too.'},
      {title:'When does respiration happen?',prompt:'Do cells stop working while we sleep or when there is no sunlight?',options:['Only during the day','Only during exercise','All the time, day and night','Only while breathing in'],hint:'Cells need energy even at night.',fact:'Living cells need energy day and night, so respiration happens all the time.',caption:'Day and night pass; respiration continues.'},
      {title:'What happens to the energy in food?',prompt:'Think about why cells need food.',options:['It is trapped in water','It disappears completely','It turns only into sunlight','It is released for life processes'],hint:'Cells use energy to grow, repair and stay active.',fact:'Respiration releases energy from glucose for life processes. Mitochondria take part in aerobic respiration.',caption:'Energy is released from food for the cell to use.'}
    ]
  },
  zh: {
    pageTitle:'呼吸作用', documentTitle:'細胞實驗室 · 呼吸作用', description:'透過 3D 細胞找出呼吸作用的原料和產物，逐格解鎖方程式，再回答三道概念題。', brand:'細胞實驗室', restartLabel:'重新開始遊戲', controls:'遊戲控制', pause:'Ⅱ 暫停', resume:'▶ 繼續', languageButton:'🌐 中文', switchLanguage:'切換至英文', unlocked:'已解鎖', stageLabel:'可旋轉的立體細胞模型', canvasLabel:'可旋轉的動物細胞。物質從左邊進入細胞，從右邊離開。', loading:'正在建立立體細胞…', fallbackLabel:'呼吸作用細胞模型', resetView:'重設模型視角', startAgain:'↻ 再玩一次', gesture:'拖動旋轉 · 雙指縮放', materialTray:'選擇原料與產物', inputs:'原料', outputs:'產物', selectInput:'選擇…', selectOutput:'選擇…', selectSlot:'選擇物質：', slotInput:'原料', slotOutput:'產物', materialNames:{glucose:'葡萄糖',oxygen:'氧氣',carbon:'二氧化碳',water:'水',sunlight:'陽光',chlorophyll:'葉綠素'}, materialIntro:'選出四種物質，逐格解鎖方程式。', materialWrong:'未答對。請為{slot}再選另一種物質。', materialCorrect:'已解鎖{name}。', materialAll:'四種物質已找齊，請回答右側問題。', equationLabel:'細胞呼吸作用方程式', equationTitle:'呼吸作用方程式', energyReleased:'✳ 釋放能量，供細胞使用。', modelNote:'動物細胞簡化模型 · 粒子和尺寸只作示意', questionNumber:'第 {number}／7 題', chooseAnswer:'選出正確答案', completedLabel:'已完成', correct:'答對了！', unlockedQuestion:'已解鎖{name}！', next:'下一題 →', finishButton:'查看完整模型 →', wrong:'再試一次：{hint}', answerNote:'答對後，細胞模型的相關部分會恢復顏色。', continued:'已解鎖的粒子會繼續流動。', complete:'細胞工廠已完成！', completeText:'你已找出四種物質，並答對三道問題。方程式已完成，細胞會繼續運作。', playAgain:'↻ 再玩一次', stageInitial:'在模型旁選出四種物質。', stageMaterial:'已找出{name}。', stageAll:'四種物質已找齊，繼續回答問題。', energyLabel:'↑ 能量', topic:{where:'對象',time:'時間',energy:'能量'}, questionName:{where:'誰會呼吸？',time:'何時發生？',energy:'釋放能量'}, materialFact:{glucose:'葡萄糖是呼吸作用的原料。',oxygen:'氧氣是有氧呼吸作用的原料。',carbon:'二氧化碳是呼吸作用的產物。',water:'水是呼吸作用的產物。'}, questions:[
      {title:'哪些生物會進行呼吸作用？',prompt:'這個模型是動物細胞；植物又如何？',options:['只有動物','只有植物','植物與動物的活細胞','只有有肺的生物'],hint:'植物細胞也需要能量，並有線粒體。',fact:'植物與動物的活細胞都會進行呼吸作用。這個模型以動物細胞作示意。',caption:'細胞亮起；植物細胞也會呼吸。'},
      {title:'呼吸作用在甚麼時候進行？',prompt:'睡覺或沒有陽光時，細胞會停止運作嗎？',options:['只有白天','只有運動時','白天和晚上，一直進行','只有吸氣時'],hint:'夜間的細胞也需要能量。',fact:'活細胞日夜都需要能量，因此呼吸作用一直進行。',caption:'日與夜交替，呼吸作用仍然持續。'},
      {title:'食物中的能量去了哪裏？',prompt:'想想細胞為甚麼需要食物。',options:['被鎖在水中','完全消失了','只變成陽光','釋放出來，供生命活動使用'],hint:'細胞需要能量生長、修復和活動。',fact:'呼吸作用釋放葡萄糖中的能量，供細胞進行生命活動。線粒體參與有氧呼吸作用。',caption:'能量從食物釋放，供細胞使用。'}
    ]
  }
};
const $ = id => document.getElementById(id);
const world = new CellWorld($('world'));
const unlocked = new Set();
let language='en', phase='materials', questionIndex=0, paused=false, materialFeedback={kind:'intro'}, wrongChoice=null;
$('loading').hidden=true;
if(!world.available){$('world').hidden=true;$('fallback').hidden=false;}
function t(){return copy[language];}
function fill(template,values){return template.replace(/\{(\w+)\}/g,(_,key)=>String(values[key]??''));}
function materialName(key){return t().materialNames[key];}
function slotName(m){return `${m.group==='input'?t().slotInput:t().slotOutput} ${m.number}`;}
function setText(id,value){$(id).textContent=value;}
function renderStatic(){
  const c=t(); document.documentElement.lang=language==='en'?'en':'zh-Hant-HK';document.title=c.documentTitle;
  document.querySelector('meta[name="description"]').content=c.description;
  setText('brandName',c.brand);$('home').setAttribute('aria-label',c.restartLabel);
  document.querySelector('.settings').setAttribute('aria-label',c.controls);
  setText('pauseButton',paused?c.resume:c.pause);setText('languageButton',c.languageButton);$('languageButton').setAttribute('aria-label',c.switchLanguage);
  setText('pageTitle',c.pageTitle);setText('progressLabel',c.unlocked);$('stage').setAttribute('aria-label',c.stageLabel);$('world').setAttribute('aria-label',c.canvasLabel);
  setText('loading',c.loading);document.querySelector('#fallback svg').setAttribute('aria-label',c.fallbackLabel);$('resetView').setAttribute('aria-label',c.resetView);
  setText('replayScene',c.startAgain);setText('gesture',c.gesture);$('inputRail').setAttribute('aria-label',c.inputs);$('outputRail').setAttribute('aria-label',c.outputs);
  $('inputsHeading').firstChild.textContent=`${c.inputs} `;$('outputsHeading').firstChild.textContent=`${c.outputs} `;
  $('equationBoard').setAttribute('aria-label',c.equationLabel);setText('equationTitle',c.equationTitle);setText('energyRelease',c.energyReleased);setText('energyLabel',c.energyLabel);setText('modelNote',c.modelNote);
}
function renderSlots(){
  const c=t();
  for(const m of materials){
    const slot=$(`slot-${m.key}`);slot.replaceChildren();slot.dataset.unlocked=String(unlocked.has(m.key));
    if(unlocked.has(m.key)){
      const label=document.createElement('span');label.className='slot-label';label.textContent=slotName(m);
      const name=document.createElement('strong');name.textContent=materialName(m.key);
      const formula=document.createElement('small');formula.textContent=m.formula;
      slot.append(label,name,formula);
    }else{
      const label=document.createElement('label');label.className='slot-label';label.textContent=slotName(m);label.htmlFor=`select-${m.key}`;
      const select=document.createElement('select');select.id=`select-${m.key}`;select.setAttribute('aria-label',`${c.selectSlot} ${slotName(m)}`);
      const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent=m.group==='input'?c.selectInput:c.selectOutput;select.append(placeholder);
      for(const key of choices){const option=document.createElement('option');option.value=key;option.textContent=materialName(key);select.append(option);}
      select.value='';select.addEventListener('change',()=>chooseMaterial(m,select));slot.append(label,select);
    }
  }
}
function renderMaterialFeedback(){
  const c=t();let message=c.materialIntro;
  if(materialFeedback.kind==='wrong')message=fill(c.materialWrong,{slot:slotName(materialFeedback.material)});
  if(materialFeedback.kind==='correct')message=fill(c.materialCorrect,{name:materialName(materialFeedback.key)});
  if(materialFeedback.kind==='all')message=c.materialAll;
  setText('materialFeedback',message);
}
function renderEquation(){
  const terms=[['glucose'],['symbol','+'],['oxygen'],['symbol','→'],['carbon'],['symbol','+'],['water']];
  $('equationTerms').replaceChildren(...terms.map(([key,symbol])=>{
    const node=document.createElement('span');
    if(key==='symbol'){node.className='equation-symbol';node.textContent=symbol;}
    else{node.className=`equation-term ${unlocked.has(key)?'is-revealed':'is-locked'}`;node.dataset.term=key;node.textContent=unlocked.has(key)?materialName(key):'?';}
    return node;
  }));
  $('energyRelease').hidden=!unlocked.has('energy');$('energyLabel').hidden=!unlocked.has('energy');
}
function renderPanel(){
  const panel=$('panel'),layout=$('gameLayout'),c=t();
  const visible=phase!=='materials';panel.hidden=!visible;layout.classList.toggle('has-panel',visible);
  $('inputRail').hidden=visible;$('outputRail').hidden=visible;$('materialFeedback').hidden=visible;$('stage').classList.toggle('has-choices',!visible);
  if(!visible)return;
  if(phase==='finish'){
    panel.innerHTML=`<div class="panel-head"><span>${c.completedLabel}</span><span>7 / 7</span></div><div class="finish-icon" aria-hidden="true">✳</div><h2>${c.complete}</h2><p class="panel-description">${c.completeText}</p><div class="panel-footer"><button id="playAgain" class="primary" type="button">${c.playAgain}</button></div>`;
    $('playAgain').addEventListener('click',reset);return;
  }
  const q=questions[questionIndex],qText=c.questions[questionIndex],num=questionIndex+5;
  panel.style.setProperty('--topic',q.color);
  if(phase==='result'){
    panel.innerHTML=`<div class="panel-head"><span>${fill(c.questionNumber,{number:num})}</span><span>✓</span></div><div class="success-mark" aria-hidden="true">✓</div><p class="category">${c.topic[q.key]}</p><h2>${fill(c.unlockedQuestion,{name:c.questionName[q.key]})}</h2><p class="fact">${qText.fact}</p><p class="path-fact">${c.continued}</p><div class="panel-footer"><button id="nextButton" class="primary" type="button">${questionIndex===questions.length-1?c.finishButton:c.next}</button></div>`;
    $('nextButton').addEventListener('click',()=>{questionIndex++;phase=questionIndex===questions.length?'finish':'question';wrongChoice=null;renderPanel();sync();});return;
  }
  panel.innerHTML=`<div class="panel-head"><span>${fill(c.questionNumber,{number:num})}</span><span>${c.chooseAnswer}</span></div><div class="question-icon" aria-hidden="true">${q.icon}</div><p class="category">${c.topic[q.key]}</p><h2>${qText.title}</h2><p class="panel-description">${qText.prompt}</p><div id="options" class="options"></div><p id="questionFeedback" class="feedback" role="status" aria-live="polite"></p><div class="panel-footer"><p class="small-note">${c.answerNote}</p></div>`;
  qText.options.forEach((option,i)=>{const button=document.createElement('button');button.type='button';button.className=`answer ${i===wrongChoice?'wrong':''}`;button.innerHTML=`<span class="letter">${String.fromCharCode(65+i)}</span><span>${option}</span>`;button.addEventListener('click',()=>chooseAnswer(i));$('options').append(button);});
  if(wrongChoice!==null)setText('questionFeedback',fill(c.wrong,{hint:qText.hint}));
}
function sync(){
  renderStatic();setText('count',String(unlocked.size));$('count').append(Object.assign(document.createElement('small'),{textContent:' / 7'}));
  $('progressFill').style.width=`${unlocked.size/7*100}%`;
  $('stage').dataset.lit=String(unlocked.size);
  for(const key of [...materialIds,'where','time','energy']){$('stage').dataset[key]=String(unlocked.has(key));$('fallback').dataset[key]=String(unlocked.has(key));}
  world.setState(Object.fromEntries([...materialIds,'where','time','energy'].map(key=>[key,unlocked.has(key)])));
  renderSlots();renderMaterialFeedback();renderEquation();renderPanel();
}
function chooseMaterial(m,select){
  if(!select.value||unlocked.has(m.key))return;
  if(select.value!==m.key){select.value='';select.classList.add('is-wrong');materialFeedback={kind:'wrong',material:m};renderMaterialFeedback();setText('announce',$('materialFeedback').textContent);return;}
  unlocked.add(m.key);materialFeedback={kind:'correct',key:m.key};
  setText('announce',fill(t().materialCorrect,{name:materialName(m.key)}));
  if(materialIds.every(key=>unlocked.has(key))){phase='question';questionIndex=0;materialFeedback={kind:'all'};}
  sync();celebrate();
}
function chooseAnswer(choice){
  const q=questions[questionIndex],qText=t().questions[questionIndex];
  if(choice!==q.correct){wrongChoice=choice;renderPanel();setText('announce',fill(t().wrong,{hint:qText.hint}));return;}
  unlocked.add(q.key);phase='result';wrongChoice=null;setText('announce',qText.fact);sync();celebrate();
}
function celebrate(){const box=$('celebration');box.replaceChildren();const colors=['#eeb8cb','#efc36e','#9dc5dc','#a6b98c'];for(let i=0;i<14;i++){const bit=document.createElement('i');bit.style.setProperty('--x',`${7+(i*41)%86}%`);bit.style.setProperty('--d',`${(i%7)*.07}s`);bit.style.setProperty('--c',colors[i%colors.length]);box.append(bit);}setTimeout(()=>box.replaceChildren(),2300);}
function reset(){phase='materials';questionIndex=0;wrongChoice=null;unlocked.clear();materialFeedback={kind:'intro'};paused=false;$('pauseButton').setAttribute('aria-pressed','false');setText('announce','');world.setPaused(false);world.resetCamera();sync();}
$('home').addEventListener('click',reset);$('replayScene').addEventListener('click',reset);$('resetView').addEventListener('click',()=>world.resetCamera());
$('pauseButton').addEventListener('click',()=>{paused=!paused;world.setPaused(paused);$('pauseButton').setAttribute('aria-pressed',String(paused));renderStatic();});
$('languageButton').addEventListener('click',()=>{language=language==='en'?'zh':'en';setText('announce','');sync();});
reset();
