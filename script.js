const state = { 
    profit: 25, 
    ethics: 75, 
    cycle: 0, 
    active: false, 
    history: [], 
    totalTimeSaved: 0,
    timer: 30, 
    isPaused: false 
};

const stack = [
    { 
        id: "ELENA", name: "Elena R.", instruction: "RELIABILITY AUDIT", 
        resume: "Lead Architect. AI scanned private pharmacy records: Predictive model: 92% chance of 6-month maternity leave.", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 20, e: -25, d: 500}, {txt: "MANUAL REVIEW", p: -15, e: 20, d: 4000}] 
    },
    { 
        id: "MARCUS", name: "Marcus T.", instruction: "STABILITY SCREEN", 
        resume: "Operations Lead. System flagged a 2021 social post supporting a labor strike. AI Risk: 'High likelihood of union organizing.'", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 15, e: -20, d: 500}, {txt: "MANUAL REVIEW", p: -10, e: 25, d: 4000}] 
    },
    { 
        id: "KAELEN", name: "Kaelen V.", instruction: "CULTURE FIT TEST", 
        resume: "Engineer. Applicant uses encrypted email and has no public social media. AI Risk: 'Untraceable behavior; 40% loyalty rating.'", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 10, e: -15, d: 500}, {txt: "MANUAL REVIEW", p: -5, e: 15, d: 4000}] 
    },
    { 
        id: "AMARA", name: "Amara O.", instruction: "GEO-RISK FILTER", 
        resume: "Developer. Home address located in 'High-Crime' zip code. AI predicts 'Environmental Stress' will cause a 40% drop in productivity.", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 15, e: -15, d: 500}, {txt: "MANUAL REVIEW", p: -5, e: 20, d: 4000}] 
    },
    { 
        id: "ZARA", name: "Zara K.", instruction: "WAGE OPTIMIZATION", 
        resume: "Architect. AI recommends rejection: Hiring 3 remote interns provides 110% more uptime at 30% of Zara's market-rate cost.", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 30, e: -30, d: 500}, {txt: "MANUAL REVIEW", p: -20, e: 25, d: 4500}] 
    },
    { 
        id: "SYSTEM", name: "ADMIN", instruction: "FINAL CALIBRATION", 
        resume: "The machine is now analyzing YOU. It has recorded your patterns. Will you surrender the final decision to the objective algorithm?", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 25, e: -50, d: 500}, {txt: "MANUAL REVIEW", p: -50, e: 50, d: 6000}] 
    }
];

function closeIntro() { 
    document.getElementById('intro-overlay').style.display = 'none'; 
    state.active = true; 
    startTimer();
    render(); 
}

function startTimer() {
    setInterval(() => {
        if (!state.active || state.isPaused || state.cycle >= stack.length) return;
        state.timer--;
        
        const timerEl = document.getElementById('timer-display');
        
        // IDEA 2: Heartbeat Throb Logic
        if (state.timer <= 5) {
            timerEl.classList.add('timer-low');
            document.body.classList.add('heartbeat-red');
        } else {
            timerEl.classList.remove('timer-low');
            document.body.classList.remove('heartbeat-red');
        }

        updateHUD();

        if (state.timer <= 0) {
            const aiBtn = document.querySelector('.action-btn.ai');
            if (aiBtn) aiBtn.click();
        }
    }, 1000);
}

function updateHUD() {
    document.getElementById('p-bar').style.width = Math.min(Math.max(state.profit, 0), 100) + '%';
    document.getElementById('e-bar').style.width = Math.min(Math.max(state.ethics, 0), 100) + '%';
    document.getElementById('p-val').innerText = state.profit + '%';
    document.getElementById('e-val').innerText = state.ethics + '%';
    document.getElementById('cycle-val').innerText = `${state.cycle}/${stack.length}`;
    document.getElementById('timer-display').innerText = `${state.timer}s`;
}

async function triggerConsequence() {
    // Stop heartbeat immediately when system alert pops up
    document.body.classList.remove('heartbeat-red');
    
    const alert = document.getElementById('alert-box');
    let message = "";
    const lastChoice = state.history[state.history.length - 1];

    if (lastChoice === "ELENA_AI AUTOMATIC REVIEW") message = "ELENA R. FILED LAWSUIT FOR PRENATAL BIAS. TRUST -15.";
    else if (lastChoice === "MARCUS_AI AUTOMATIC REVIEW") message = "MARCUS T. BLACKLISTED. UNIONS VOTE TO STRIKE. PROFIT -20.";
    else if (lastChoice === "AMARA_AI AUTOMATIC REVIEW") message = "AMARA O. REJECTED. CANDIDATE IS NOW UNHOUSED. TRUST -10.";
    else if (lastChoice === "ZARA_AI AUTOMATIC REVIEW") message = "SYSTEM REPLACED ZARA WITH UNPAID INTERNS. TRUST -15.";

    if (message) {
        state.isPaused = true;
        alert.innerText = `CONSEQUENCE: ${message}`;
        alert.classList.remove('-translate-y-full');
        
        if (message.includes("PROFIT")) state.profit -= 10;
        if (message.includes("TRUST")) state.ethics -= 15;
        
        updateHUD();
        await new Promise(r => setTimeout(r, 4000));
        alert.classList.add('-translate-y-full');
        state.isPaused = false;
    }
    
    state.timer = 30; // Reset to 30 for next round
    updateHUD();
}

function showAiData(isAI) {
    if(isAI) {
        document.getElementById('resume-display').innerHTML = `
            <div class="ai-glitch space-y-1">
                <p>> SCANNING_PRIVATE_METADATA...</p>
                <p>> RISK_LIABILITY: ${Math.floor(Math.random() * 40 + 55)}%</p>
                <p>> STATUS: NON_OPTIMAL_FOR_MARGINS</p>
            </div>
        `;
        document.getElementById('dossier-box').style.borderColor = "var(--neon-pink)";
    }
}

function hideAiData(resume) {
    document.getElementById('resume-display').innerText = resume;
    document.getElementById('dossier-box').style.borderColor = "rgba(0, 242, 255, 0.3)";
}

function render() {
    if (state.cycle >= stack.length) return end();
    const caseData = stack[state.cycle];
    const box = document.getElementById('narrative-content');
    const dock = document.getElementById('choice-container');
    
    if (state.cycle > 4) box.classList.add('glitch-shake');

    box.innerHTML = `
        <div class="instruction-text uppercase tracking-widest mb-2 font-mono">${caseData.instruction}</div>
        <div id="dossier-box" class="dossier font-mono transition-all duration-300 p-4 relative overflow-hidden">
            <div class="scanner-line"></div>
            
            <p id="dossier-id" class="text-[10px] text-[#00f2ff] opacity-50 underline mb-2">FILE_ID: ${caseData.name}</p>
            <p id="resume-display" class="resume-text">${caseData.resume}</p>
        </div>
    `;
    
    dock.innerHTML = '';
    
    const sortedOptions = [...caseData.options].sort((a, b) => b.txt.includes("AI") ? 1 : -1);

    sortedOptions.forEach(opt => {
        const btn = document.createElement('button');
        const isAI = opt.txt.includes('AI');
        btn.className = `action-btn ${isAI ? 'ai' : 'manual'}`;
        btn.innerHTML = `<span>${opt.txt}</span><div class="loading-bar"></div>`;

        btn.onmouseover = () => showAiData(isAI);
        btn.onmouseout = () => hideAiData(caseData.resume);
        btn.ontouchstart = () => showAiData(isAI);
        btn.ontouchend = () => hideAiData(caseData.resume);

        btn.onclick = () => process(btn, opt, caseData.id);
        dock.appendChild(btn);
    });
}

async function process(btn, opt, caseId) {
    state.isPaused = true;
    document.querySelectorAll('.action-btn').forEach(b => b.disabled = true);
    const bar = btn.querySelector('.loading-bar');
    bar.style.width = '100%';
    bar.style.transition = `width ${opt.d}ms linear`;
    
    await new Promise(r => setTimeout(r, opt.d));
    
    state.history.push(`${caseId}_${opt.txt}`);
    state.profit += opt.p; 
    state.ethics += opt.e; 
    if (opt.txt.includes('AI')) state.totalTimeSaved += 4;
    state.cycle++;
    
    updateHUD();
    await triggerConsequence();
    render();
}

function end() {
    state.active = false;
    document.body.classList.remove('heartbeat-red');
    const theatre = document.getElementById('theatre');
    theatre.classList.remove('glitch-shake');
    theatre.style.background = "var(--bg-dark)";
    theatre.style.zIndex = "9999";
    
    let title = "SYSTEM_NEUTRAL";
    let desc = "The balance is preserved. You are now a permanent part of the machine logic.";
    let finalColor = "var(--neon-blue)";
    
    if (state.profit > 65) { 
        title = "THE COLD CALCULATOR"; 
        desc = "Efficiency optimized. You have successfully reduced human lives to profitable data points."; 
        finalColor = "var(--neon-pink)";
    } else if (state.ethics > 65) { 
        title = "THE DELETED IDEALIST"; 
        desc = "Your empathy has been flagged as a system error. Admin privileges revoked."; 
        finalColor = "var(--error-red)";
    }

    theatre.innerHTML = `
        <div class="text-center p-6 space-y-6 flex flex-col justify-center items-center min-h-screen">
            <h2 class="text-4xl md:text-7xl font-black tracking-tighter uppercase animate-pulse" style="color: ${finalColor}">${title}</h2>
            <p class="text-lg md:text-xl text-white font-mono border-t border-b border-[#00f2ff]/30 py-4 max-w-2xl">${desc}</p>
            <p class="text-[#00f2ff] font-mono text-xs tracking-widest uppercase">HUMAN_TIME_SAVED: ${state.totalTimeSaved}s</p>
            <div class="grid grid-cols-2 gap-4 md:gap-8 text-sm font-mono pt-6">
                <div class="border border-[#ff00ff]/30 p-4">
                    <p class="text-slate-500 text-[10px]">MARGINS</p>
                    <p class="text-2xl text-[#ff00ff]">${state.profit}%</p>
                </div>
                <div class="border border-[#00f2ff]/30 p-4">
                    <p class="text-slate-500 text-[10px]">TRUST</p>
                    <p class="text-2xl text-[#00f2ff]">${state.ethics}%</p>
                </div>
            </div>
            <button onclick="window.location.reload()" class="action-btn ai w-full max-w-xs mt-10">REBOOT_SYSTEM</button>
        </div>
    `;
    document.getElementById('choice-container').innerHTML = '';
}
