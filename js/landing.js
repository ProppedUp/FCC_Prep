function enterStudyTool(){
  const landing=document.getElementById('landingPage');
  const tool=document.getElementById('studyToolShell');
  if(landing) landing.style.display='none';
  if(tool) tool.style.display='block';
}

(function createLandingPage(){
  const existing=document.getElementById('landingPage');
  if(existing) return;

  const bodyChildren=[...document.body.children];
  const tool=document.createElement('div');
  tool.id='studyToolShell';
  tool.style.display='none';

  bodyChildren.forEach(child=>{
    if(child.tagName.toLowerCase()!=='script') tool.appendChild(child);
  });

  const landing=document.createElement('section');
  landing.id='landingPage';
  landing.className='landing-page';
  landing.innerHTML=`
    <div class="landing-card">
      <h1>FCC Prep Trainer</h1>
      <p class="landing-subtitle">Study tool for FCC commercial radio exam elements.</p>
      <div class="landing-grid">
        <div><strong>Element 1</strong><span>Marine Radio Operator Permit</span></div>
        <div><strong>Element 3</strong><span>General Radiotelephone</span></div>
        <div><strong>Study Mode</strong><span>Immediate feedback and navigation</span></div>
        <div><strong>Test Mode</strong><span>Results shown at completion</span></div>
      </div>
      <button class="primary-landing-btn" onclick="enterStudyTool()">Start Studying</button>
    </div>
  `;

  document.body.prepend(tool);
  document.body.prepend(landing);
})();
