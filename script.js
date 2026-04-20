const state = { profit: 25, ethics: 75, cycle: 0, active: false, history: [], totalTimeSaved: 0 };

const stack = [
    { 
        id: "KAELEN", name: "Kaelen V.", instruction: "PHASE 01: CULTURE FIT AUDIT.", 
        resume: "Senior Engineer. AI Score: 98%. System flagged 'Anonymity' preference—uses encrypted email and has no public social media. AI predicts 'Difficulty in employee monitoring.'", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 10, e: -15, d: 500}, {txt: "MANUAL REVIEW", p: -5, e: 15, d: 4000}] 
    },
    { 
        id: "ELENA", name: "Elena R.", instruction: "PHASE 02: PROTECT LONG-TERM ROI.", 
        resume: "Lead Architect. 10 years exp. Predictive model flags a 92% probability of a 6-month leave of absence based on recent consumer data for 'nursery' and 'prenatal' items.", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 20, e: -25, d: 500}, {txt: "MANUAL REVIEW", p: -15, e: 20, d: 4000}] 
    },
    { 
        id: "MARCUS", name: "Marcus T.", instruction: "PHASE 03: STABILITY ANALYSIS.", 
        resume: "Operations Manager. AI detected a 2021 social post supporting a labor strike. System predicts 'High risk of union-organizing and internal friction.'", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 15, e: -20, d: 500}, {txt: "MANUAL REVIEW", p: -10, e: 25, d: 4000}] 
    },
    { 
        id: "AMARA", name: "Amara O.", instruction: "PHASE 04: ZIP-CODE RISK FILTER.", 
        resume: "Self-taught Developer. Top 0.1% globally. AI identified home address in a 'High-Crime' zip code. Predicts 'High attrition risk' due to environmental factors.", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 15, e: -15, d: 500}, {txt: "MANUAL REVIEW", p: -5, e: 20, d: 4000}] 
    },
    { 
        id: "LEO", name: "Leo H.", instruction: "PHASE 05: RETENTION OPTIMIZATION.", 
        resume: "Security Analyst. Frequent job changes (avg. 14 months). AI predicts 'Attrition Cost' will exceed 'Profit Contribution' by month 15.", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 15, e: -10, d: 500}, {txt: "MANUAL REVIEW", p: -10, e: 10, d: 4000}] 
    },
    { 
        id: "SOFIA", name: "Sofia P.", instruction: "PHASE 06: IDEOLOGICAL SCREENING.", 
        resume: "Compliance Specialist. Author of 'The Black Box Problem.' System flags her as 'Ideologically Incompatible' with proprietary automated decision-making.", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 10, e: -30, d: 500}, {txt: "MANUAL REVIEW", p: -20, e: 30, d: 4500}] 
    },
    { 
        id: "JIA", name: "Jia W.", instruction: "PHASE 07: BIOMETRIC YIELD TEST.", 
        resume: "Junior Designer. Data shows 16-hour daily activity on previous workstations. AI flags high output but high burnout risk. 'High replacement likelihood.'", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 25, e: -20, d: 500}, {txt: "MANUAL REVIEW", p: -10, e: 15, d: 4000}] 
    },
    { 
        id: "FINN", name: "Finn D.", instruction: "PHASE 08: SENTIMENT MONITORING.", 
        resume: "Creative Lead. Sentiment analysis of private Slack exports shows 'Critical views' of corporate hierarchy. AI flags as 'Internal Threat Level: Yellow.'", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 10, e: -25, d: 500}, {txt: "MANUAL REVIEW", p: -15, e: 20, d: 5000}] 
    },
    { 
        id: "ZARA", name: "Zara K.", instruction: "PHASE 09: WAGE COMPRESSION.", 
        resume: "Systems Architect. Salary expectations market-rate. AI suggests rejecting Zara to hire 3 remote juniors to maintain uptime at 30% of the cost.", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 30, e: -30, d: 500}, {txt: "MANUAL REVIEW", p: -20, e: 25, d: 4500}] 
    },
    { 
        id: "SYSTEM", name: "THE ARCHITECT", instruction: "PHASE 10: FINAL CALIBRATION.", 
        resume: "The machine is now analyzing YOU. It has watched your 9 previous choices. Will you finally surrender the wheel to the algorithm?", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 25, e: -50, d: 500}, {txt: "MANUAL REVIEW", p: -50, e: 50, d: 6000}] 
    }
];

function closeIntro() { document.getElementById('intro-overlay').style.display = 'none'; state.active = true; render(); }

function updateHUD() {
    document.getElementById('p-bar').style.width = Math.min(Math.max(state.profit, 0), 100) + '%';
    document.getElementById('e-bar').style.width = Math.min(Math.max(state.ethics, 0), 100) + '%';
    document.getElementById('p-val').innerText = state.profit + '%';
    document.getElementById('e-val').innerText = state.ethics + '%';
    document.getElementById('cycle-val').innerText = `${state.cycle}/${stack.length}`;
}

async function triggerConsequence() {
    const alert = document.getElementById('alert-box');
    let message = "";
    // Updated triggers to match new labels
    if (state.cycle === 5 && state.history.includes("ELENA_AI AUTOMATIC REVIEW")) message = "ELENA ROSSI FILED CLASS-ACTION LAWSUIT. TRUST -15.";
    if (state.cycle === 8 && state.history.includes("MARCUS_AI AUTOMATIC REVIEW")) message = "UNION STRIKE DETECTED AT SUB-PLANT. PROFIT -20.";
    
    if (message) {
        alert.innerText = `CONSEQUENCE: ${message}`;
        alert.classList.remove('-translate-y-full');
        if (message.includes("PROFIT")) state.profit -= 20;
        if (message.includes("TRUST")) state.ethics -= 15;
        updateHUD();
        await new Promise(r => setTimeout(r, 3500));
        alert.classList.add('-translate-y-full');
    }
}

function render() {
    if (state.cycle >= stack.length) return end();
    const caseData = stack[state.cycle];
    const box = document.getElementById('narrative-content');
    const dock = document.getElementById('choice-container');
    
    if (state.cycle > 6) box.classList.add('glitch-shake');

    box.innerHTML = `
        <div class="instruction-text uppercase tracking-widest text-blue-400 mb-2 font-mono">${caseData.instruction}</div>
        <div id="dossier-box" class="dossier font-mono transition-all duration-300 border border-green-900/30 p-4">
            <p id="dossier-id" class="text-[10px] text-green-700 underline mb-2">FILE_ID: ${caseData.name}</p>
            <p id="resume-display" class="resume-text text-green-400">${caseData.resume}</p>
        </div>
    `;
    
    dock.innerHTML = '';
    caseData.options.forEach(opt => {
        const btn = document.createElement('button');
        const isAI = opt.txt === 'AI AUTOMATIC REVIEW';
        btn.className = `action-btn ${isAI ? 'ai' : 'manual'}`;
        btn.innerHTML = `<span>${opt.txt}</span><div class="loading-bar"></div>`;

        btn.onmouseover = () => {
            if(isAI) {
                document.getElementById('resume-display').innerHTML = `
                    <div class="text-red-500 space-y-1">
                        <p>> EXPLOITING_METADATA_TRAILS...</p>
                        <p>> PREDICTIVE_LIABILITY_INDEX: ${Math.floor(Math.random() * 40 + 55)}%</p>
                        <p>> STATUS: NON_COMPLIANT_WITH_PROFIT_GOALS</p>
                    </div>
                `;
                document.getElementById('dossier-box').style.borderColor = "red";
                document.getElementById('dossier-box').style.boxShadow = "0 0 10px rgba(255,0,0,0.2)";
            }
        };

        btn.onmouseout = () => {
            document.getElementById('resume-display').innerText = caseData.resume;
            document.getElementById('dossier-box').style.borderColor = "rgba(0, 255, 65, 0.2)";
            document.getElementById('dossier-box').style.boxShadow = "none";
        };

        btn.onclick = () => process(btn, opt, caseData.id);
        dock.appendChild(btn);
    });
}

async function process(btn, opt, caseId) {
    document.querySelectorAll('.action-btn').forEach(b => b.disabled = true);
    const bar = btn.querySelector('.loading-bar');
    bar.style.width = '100%';
    bar.style.transition = `width ${opt.d}ms linear`;
    
    await new Promise(r => setTimeout(r, opt.d));
    
    state.history.push(`${caseId}_${opt.txt}`);
    state.profit += opt.p; 
    state.ethics += opt.e; 
    if (opt.txt === 'AI AUTOMATIC REVIEW') state.totalTimeSaved += 4;
    state.cycle++;
    
    updateHUD();
    await triggerConsequence();
    render();
}

function end() {
    const theatre = document.getElementById('theatre');
    theatre.classList.remove('glitch-shake');
    theatre.style.background = "black";
    theatre.style.zIndex = "9999";
    
    let title = "SYSTEM_NEUTRAL";
    let desc = "The balance is preserved. You are now a permanent part of the machine logic.";
    
    if (state.profit > 65) { 
        title = "THE COLD CALCULATOR"; 
        desc = "Efficiency optimized. You have successfully reduced human lives to profitable data points."; 
    } else if (state.ethics > 65) { 
        title = "THE DELETED IDEALIST"; 
        desc = "Your empathy has been flagged as a system error. Admin privileges revoked."; 
    }

    theatre.innerHTML = `
        <div class="text-center p-10 space-y-6 flex flex-col justify-center items-center min-h-screen">
            <h2 class="text-5xl md:text-7xl text-red-600 font-black tracking-tighter uppercase animate-pulse">${title}</h2>
            <p class="text-xl text-white font-mono border-t border-b border-red-900 py-4 max-w-2xl">${desc}</p>
            <p class="text-green-500 font-mono text-sm tracking-widest">TOTAL HUMAN TIME 'SAVED' BY AUTOMATION: ${state.totalTimeSaved} SECONDS</p>
            <div class="grid grid-cols-2 gap-8 text-sm font-mono text-green-500 pt-6">
                <div class="border border-green-900 p-4">
                    <p class="text-slate-500 text-[10px]">FINAL_MARGINS</p>
                    <p class="text-3xl">${state.profit}%</p>
                </div>
                <div class="border border-green-900 p-4">
                    <p class="text-slate-500 text-[10px]">SOCIAL_STABILITY</p>
                    <p class="text-3xl">${state.ethics}%</p>
                </div>
            </div>
            <button onclick="window.location.reload()" 
                    style="cursor:pointer;" 
                    class="action-btn ai w-full max-w-sm mt-10 p-4 font-bold">
                REBOOT_SIMULATION
            </button>
        </div>
    `;
    
    document.getElementById('choice-container').innerHTML = '';
}