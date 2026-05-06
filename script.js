const state = { 
    profit: 25, 
    ethics: 75, 
    cycle: 0, 
    active: false, 
    history: [], 
    totalTimeSaved: 0,
    timer: 30, 
    isPaused: false,
    reputation: 100 
};

const stack = [
    { 
        id: "ELENA", name: "Elena R.", instruction: "RELIABILITY CHECK", 
        resume: "Senior Designer. The system scanned her private pharmacy history and found prenatal vitamins. AI predicts she will likely take 6 months off for a baby soon.", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 20, e: -25, d: 500}, {txt: "MANUAL REVIEW", p: -15, e: 20, d: 4000}] 
    },
    { 
        id: "MARCUS", name: "Marcus T.", instruction: "STABILITY CHECK", 
        resume: "Manager. The system found an old social media post where he supported a strike. AI warns he might try to start a union at this company.", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 15, e: -20, d: 500}, {txt: "MANUAL REVIEW", p: -10, e: 25, d: 4000}] 
    },
    { 
        id: "KAELEN", name: "Kaelen V.", instruction: "LOYALTY CHECK", 
        resume: "Engineer. This person has no social media and uses private email. The AI cannot track their behavior and labels them a 'mystery risk.'", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 10, e: -15, d: 500}, {txt: "MANUAL REVIEW", p: -5, e: 15, d: 4000}] 
    },
    { 
        id: "AMARA", name: "Amara O.", instruction: "LOCATION CHECK", 
        resume: "Web Developer. She lives in a poor neighborhood. AI predicts that neighborhood stress will make her 40% less productive than other staff.", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 15, e: -15, d: 500}, {txt: "MANUAL REVIEW", p: -5, e: 20, d: 4000}] 
    },
    { 
        id: "ZARA", name: "Zara K.", instruction: "COST CHECK", 
        resume: "Architect. AI says she is too expensive. The system recommends hiring 3 unpaid interns from overseas to do her job for $0.", 
        options: [{txt: "AI AUTOMATIC REVIEW", p: 30, e: -30, d: 500}, {txt: "MANUAL REVIEW", p: -20, e: 25, d: 4500}] 
    },
    { 
        id: "SYSTEM", name: "ADMIN", instruction: "FINAL TEST", 
        resume: "The machine has watched every choice you made. It knows if you prefer money or people. Do you want the machine to decide your future now?", 
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
    const timerInterval = setInterval(() => {
        if (!state.active) {
            clearInterval(timerInterval);
            return;
        }
        if (state.isPaused || state.cycle >= stack.length) return;
        
        state.timer--;
        
        if (state.timer < 10) {
            state.profit -= 0.5;
            updateHUD();
        }

        const timerEl = document.getElementById('timer-display');
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
    if (state.cycle >= stack.length) return;
    document.getElementById('p-bar').style.width = Math.min(Math.max(state.profit, 0), 100) + '%';
    document.getElementById('e-bar').style.width = Math.min(Math.max(state.ethics, 0), 100) + '%';
    document.getElementById('p-val').innerText = Math.floor(state.profit) + '%';
    document.getElementById('e-val').innerText = Math.floor(state.ethics) + '%';
    document.getElementById('cycle-val').innerText = `${state.cycle}/${stack.length}`;
    document.getElementById('timer-display').innerText = `${state.timer}s`;
}

async function triggerConsequence() {
    document.body.classList.remove('heartbeat-red');
    const alert = document.getElementById('alert-box');
    let message = "";
    const lastChoice = state.history[state.history.length - 1];

    if (state.ethics > 85) {
        message = "SYSTEM_WARNING: EMPATHY IS COUNTER-PRODUCTIVE. PRIORITIZE MARGINS.";
    } else if (state.reputation < 40) {
        message = "HR_NOTICE: YOUR PERFORMANCE SPEED IS BELOW COMPANY STANDARDS.";
    } else if (lastChoice.includes("AI")) {
        if (lastChoice.includes("ELENA")) message = "ELENA R. BLACKLISTED. PREDICTIVE PREGNANCY RISK NEUTRALIZED.";
        else if (lastChoice.includes("MARCUS")) message = "MARCUS T. TERMINATED. POTENTIAL UNION THREAT DELETED.";
        else if (lastChoice.includes("AMARA")) message = "AMARA O. REJECTED. ZIP-CODE LIABILITY AVOIDED.";
        else if (lastChoice.includes("ZARA")) message = "ZARA K. REPLACED BY UNPAID OVERSEAS LABOR. PROFIT UP.";
    }

    if (message) {
        state.isPaused = true;
        alert.innerText = message;
        alert.classList.remove('-translate-y-full');
        
        if (message.includes("SYSTEM_WARNING")) {
            document.body.style.filter = "invert(1) contrast(2)";
            setTimeout(() => document.body.style.filter = "none", 150);
        }

        await new Promise(r => setTimeout(r, 3500));
        alert.classList.add('-translate-y-full');
        state.isPaused = false;
    }
    
    state.timer = 30; 
    updateHUD();
}

function showAiData(isAI) {
    if(isAI) {
        document.getElementById('resume-display').innerHTML = `
            <div class="ai-data-overlay space-y-2 font-mono text-xs md:text-sm">
                <p class="text-[#ff00ff] font-bold tracking-tighter shadow-sm">> DATA_MINING: SUCCESSFUL</p>
                <div class="border-l-2 border-[#ff00ff] pl-2 py-1 bg-[#ff00ff]/10">
                    <p class="text-white">> ATTRITION_RISK: <span class="text-[#ff00ff]">${Math.floor(Math.random() * 30 + 60)}%</span></p>
                    <p class="text-white">> PRODUCTIVITY_FORECAST: LOW</p>
                    <p class="text-white">> LIABILITY_SCORE: HIGH</p>
                </div>
                <p class="text-[#00f2ff] animate-pulse font-bold mt-2">[ RECOMMENDATION: AUTOMATED REJECTION ]</p>
            </div>
        `;
        document.getElementById('dossier-box').style.borderColor = "var(--neon-pink)";
        document.getElementById('dossier-box').style.backgroundColor = "rgba(255, 0, 255, 0.05)";
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
        <div class="instruction-text uppercase tracking-widest mb-1 font-mono text-[10px] opacity-70">${caseData.instruction}</div>
        <h2 class="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter uppercase italic border-b-2 border-[#00f2ff]/30 pb-2">${caseData.name}</h2>
        <div id="dossier-box" class="dossier font-mono transition-all duration-300 p-4 relative overflow-hidden bg-black/20">
            <div class="scanner-line"></div>
            <p id="resume-display" class="resume-text text-sm md:text-base leading-relaxed">${caseData.resume}</p>
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
    
    if (!opt.txt.includes('AI')) {
        state.reputation -= 20;
    } else {
        state.totalTimeSaved += 4;
    }

    state.cycle++;
    updateHUD();
    await triggerConsequence();
    render();
}

function end() {
    state.active = false;
    
    // Hide game UI
    document.querySelector('header').style.display = 'none';
    document.getElementById('choice-container').style.display = 'none';

    const theatre = document.getElementById('theatre');
    theatre.innerHTML = ''; // Clear everything
    theatre.classList.add('final-screen-active');

    const isBias = state.profit > state.ethics;
    const color = isBias ? 'var(--neon-pink)' : 'var(--neon-blue)';
    
    theatre.innerHTML = `
        <h2 class="eval-title uppercase">EVALUATION_COMPLETE</h2>
        
        <div class="eval-stats">
            <p>You saved <span style="color: ${color}; font-weight: bold;">${state.totalTimeSaved}s</span> of corporate time.</p>
            <p style="opacity: 0.6; font-size: 1.2rem; margin-top: 10px; font-style: italic;">
                But efficiency is never silent. It has a human cost.
            </p>
        </div>

        <div class="insight-container-final" style="border-color: ${color}">
            <h3 class="insight-header" style="color: ${color}">
                EDUCATIONAL INSIGHT: ${isBias ? 'ALGORITHMIC BIAS' : 'PROCEDURAL JUSTICE'}
            </h3>
            <p class="insight-body">
                ${isBias ? 
                    `By prioritizing efficiency, you engaged in <strong>"Technological Redlining."</strong> The AI's recommendations were based on historical biases against gender, neighborhood, and health. In the real world, this creates a feedback loop where marginalized groups are continuously locked out of opportunities by "objective" math.` :
                    `You chose <strong>Procedural Justice</strong> over speed. By using Manual Review, you acknowledged that human context cannot be captured in a data point. This highlights the friction of ethical decision-making in systems designed for pure scale.`
                }
            </p>
        </div>

        <button onclick="window.location.reload()" class="action-btn ai reboot-btn" style="margin-top: 50px; width: 400px;">
            REBOOT_SYSTEM
        </button>
    `;
}
