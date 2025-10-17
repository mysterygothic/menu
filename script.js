const WORKER_URL = 'https://lively-river-cdc1.zlmsn3mk.workers.dev/';

async function sendToTelegram(data) {
    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        return null;
    }
}

function getVisitorInfo() {
    const now = new Date();
    const dateStr = now.toLocaleString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    return {
        timestamp: dateStr,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen: `${screen.width}x${screen.height}`,
        referrer: document.referrer || 'Direct',
        platform: navigator.platform
    };
}

function trackAction(action) {
    const info = getVisitorInfo();
    const message = `
🔔 <b>Customer Action: ${action}</b>

📅 Time: ${info.timestamp}
🌐 Language: ${info.language}
📱 Platform: ${info.platform}
🖥️ Screen: ${info.screen}
🔗 Referrer: ${info.referrer}
👤 User Agent: ${info.userAgent}
    `.trim();
    
    sendToTelegram({ type: 'action', message });
}

function showSection(sectionId) {
    // This function is for the main index page navigation
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const sectionNames = {
        'menu': 'Menu',
        'order': 'Order Now',
        'location': 'Location',
        'review': 'Review Us'
    };
    
    trackAction(`Viewed ${sectionNames[sectionId]} Section`);
}

// Initialize page load tracking
window.addEventListener('load', async () => {
    const info = getVisitorInfo();
    const message = `
🎉 <b>New Visitor on Restaurant Website!</b>

📅 Time: ${info.timestamp}
🌐 Language: ${info.language}
📱 Platform: ${info.platform}
🖥️ Screen: ${info.screen}
🔗 Referrer: ${info.referrer}
👤 User Agent: ${info.userAgent}
    `.trim();
    
    await sendToTelegram({ type: 'visit', message });

    // Animate navigation buttons if they exist
    document.querySelectorAll('.nav-btn').forEach((btn, index) => {
        setTimeout(() => {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(20px)';
            btn.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
});
