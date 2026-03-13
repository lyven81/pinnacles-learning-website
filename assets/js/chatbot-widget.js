/**
 * Pau Analytics AI Chatbot Widget
 * Jason - Data Insights Consultant
 *
 * Backend: Web Chat Lead Manager (FastAPI on Railway)
 * Lead capture state machine: waiting_name → waiting_challenge → chatting
 */

// ===== BACKEND CONFIG =====
// backendUrl is set in chatbot-config.js → window.pauChatbotConfig.backendUrl
const BACKEND_CONFIG = {
    get baseUrl() {
        return (window.pauChatbotConfig && window.pauChatbotConfig.backendUrl)
            ? window.pauChatbotConfig.backendUrl.replace(/\/$/, '')
            : null;
    }
};

// Page-specific greetings
const PAGE_GREETINGS = {
    homepage: "Hi! I'm Jason 👋 I help Malaysian businesses make sense of their numbers. What's your name?",
    dataAnalytics: "Hey! I'm Jason. Looking through our case studies? I can help you find a relevant one. What's your name?",
    pricing: "Hi! I'm Jason. Trying to figure out the right fit for your business? Let's start — what's your name?"
};

// Demo conversation flows (fallback when backend is not connected)
const DEMO_RESPONSES = {
    greetings: [
        "I run a retail shop",
        "I have a gym",
        "I'm in F&B business",
        "Just browsing"
    ],

    retail: {
        message: "Ah, retail! Many retail owners I talk to struggle with inventory or understanding which customers are most valuable. Is that something you're dealing with too?",
        caseStudy: {
            title: "Where Revenue Comes From",
            industry: "Retail",
            problem: "Uncertain which products drive revenue",
            solution: "Revenue driver analysis",
            result: "Identified top 20% products driving 80% revenue",
            caseUrl: "/case-study/where-revenue-comes-from.html",
            dashboardUrl: "/dashboard/where-revenue-comes-from.html"
        }
    },

    gym: {
        message: "Fitness business can be tough. Many gym owners I've worked with struggle with member retention — people sign up but stop showing up. Sound familiar?",
        caseStudy: {
            title: "Predicting Gym Member Dropout",
            industry: "Fitness",
            problem: "15% monthly churn without early warning",
            solution: "Visit pattern analysis",
            result: "Reduced churn to 8% with early intervention",
            caseUrl: "/case-study/predicting-gym-member-dropout.html",
            dashboardUrl: "/dashboard/predicting-gym-member-dropout.html"
        }
    },

    fnb: {
        message: "F&B is a tough industry. Many restaurant owners I talk to struggle with menu mix or marketing spend. Is that on your mind too?",
        caseStudy: {
            title: "Finding Which Campaigns Work",
            industry: "Food & Beverage",
            problem: "Marketing budget wasted on ineffective campaigns",
            solution: "Campaign ROI analysis",
            result: "Identified top 3 channels with 5x better ROI",
            caseUrl: "/case-study/finding-which-campaign-work.html",
            dashboardUrl: "/agentic_workflow/finding_which_campaign_work.html"
        }
    }
};

// ===== CHATBOT CLASS =====
class PauChatbot {
    constructor(config) {
        this.config = config;
        this.isOpen = false;

        // Lead capture state
        this.chatState = null; // null | 'waiting_name' | 'waiting_challenge' | 'chatting'
        this.leadId = null;
        this.visitorName = null;

        // Page context
        this.currentPage = this.detectPage();
        this.pageSlug = this.detectSlug();

        this.init();
    }

    detectPage() {
        const path = window.location.pathname;
        if (path.includes('data-analytics')) return 'dataAnalytics';
        if (path.includes('pricing')) return 'pricing';
        return 'homepage';
    }

    detectSlug() {
        const path = window.location.pathname;
        const match = path.match(/\/blog\/([^/]+)\.html$/);
        return match ? match[1] : '';
    }

    detectSource() {
        const path = window.location.pathname;
        if (path.includes('landing-page') || path.includes('english-landing') || path.includes('mandarin-landing')) return 'CH-A';
        if (path.includes('/blog/')) return 'CH-B';
        return 'CH-W';
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
        setTimeout(() => this.showWidget(), this.config.triggerDelay || 10000);
        this.setupScrollTrigger();
    }

    createWidget() {
        const widgetHTML = `
            <div id="pau-chatbot-widget">
                <!-- Minimized Button -->
                <button class="pau-chatbot-button" id="pau-chatbot-toggle">
                    <svg viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                    </svg>
                    <span class="pau-chatbot-badge">1</span>
                </button>

                <!-- Chat Window -->
                <div class="pau-chatbot-window" id="pau-chatbot-window">
                    <!-- Header -->
                    <div class="pau-chatbot-header">
                        <div class="pau-chatbot-header-info">
                            <div class="pau-chatbot-avatar">👋</div>
                            <div class="pau-chatbot-header-text">
                                <h3>Jason - Your helpful assistant</h3>
                            </div>
                        </div>
                        <button class="pau-chatbot-close" id="pau-chatbot-close" title="Close chat">×</button>
                    </div>

                    <!-- Messages Area -->
                    <div class="pau-chatbot-messages" id="pau-chatbot-messages">
                    </div>

                    <!-- Input Area -->
                    <div class="pau-chatbot-input-area">
                        <input
                            type="text"
                            class="pau-chatbot-input"
                            id="pau-chatbot-input"
                            placeholder="Type your message..."
                            autocomplete="off"
                        />
                        <button class="pau-chatbot-send" id="pau-chatbot-send">
                            <svg viewBox="0 0 24 24">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Footer -->
                    <div class="pau-chatbot-footer">
                        Powered by <a href="https://pauanalytics.com" target="_blank">Pau Analytics</a>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    attachEventListeners() {
        document.getElementById('pau-chatbot-toggle').addEventListener('click', () => {
            this.toggleChat();
        });

        document.getElementById('pau-chatbot-close').addEventListener('click', () => {
            this.closeChat();
        });

        document.getElementById('pau-chatbot-send').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('pau-chatbot-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    showWidget() {
        const widget = document.getElementById('pau-chatbot-widget');
        if (widget) widget.style.display = 'block';
    }

    setupScrollTrigger() {
        let triggered = false;
        window.addEventListener('scroll', () => {
            if (!triggered && window.scrollY > 300) {
                triggered = true;
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('pau-chatbot-window');
        const button = document.getElementById('pau-chatbot-toggle');
        const badge = document.querySelector('.pau-chatbot-badge');

        if (this.isOpen) {
            chatWindow.classList.add('active');
            button.style.display = 'none';
            if (badge) badge.style.display = 'none';

            if (this.chatState === null) {
                this.sendWelcomeMessage();
            }
        } else {
            chatWindow.classList.remove('active');
            button.style.display = 'flex';
        }
    }

    closeChat() {
        this.isOpen = false;
        document.getElementById('pau-chatbot-window').classList.remove('active');
        document.getElementById('pau-chatbot-toggle').style.display = 'flex';
    }

    sendWelcomeMessage() {
        const greeting = PAGE_GREETINGS[this.currentPage];
        this.addMessage(greeting, 'jason');
        this.chatState = 'waiting_name';
        document.getElementById('pau-chatbot-input').placeholder = 'Your name...';
    }

    addMessage(text, sender, options = {}) {
        const messagesContainer = document.getElementById('pau-chatbot-messages');

        const messageDiv = document.createElement('div');
        messageDiv.className = `pau-chatbot-message ${sender}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'pau-chatbot-message-content';

        if (options.html) {
            contentDiv.innerHTML = text;
        } else {
            contentDiv.textContent = text;
        }

        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addQuickReplies(replies) {
        const messagesContainer = document.getElementById('pau-chatbot-messages');

        const quickRepliesDiv = document.createElement('div');
        quickRepliesDiv.className = 'pau-chatbot-quick-replies';

        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'pau-chatbot-quick-reply';
            button.textContent = reply;
            button.addEventListener('click', () => {
                this.handleQuickReply(reply);
                quickRepliesDiv.remove();
            });
            quickRepliesDiv.appendChild(button);
        });

        messagesContainer.appendChild(quickRepliesDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    handleQuickReply(reply) {
        this.addMessage(reply, 'user');
        this.showTyping();
        setTimeout(() => {
            this.hideTyping();
            this.processMessage(reply);
        }, 1200);
    }

    sendMessage() {
        const input = document.getElementById('pau-chatbot-input');
        const message = input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';

        this.showTyping();
        setTimeout(() => {
            this.hideTyping();
            this.processMessage(message);
        }, 800);
    }

    processMessage(message) {
        if (this.chatState === 'waiting_name') {
            this.visitorName = message;
            this.chatState = 'waiting_challenge';
            const prompt = `Nice to meet you, ${this.visitorName}! What business challenge brought you here today?`;
            this.addMessage(prompt, 'jason');
            document.getElementById('pau-chatbot-input').placeholder = 'Describe your challenge...';
            return;
        }

        if (this.chatState === 'waiting_challenge') {
            if (BACKEND_CONFIG.baseUrl) {
                this.startBackendChat(message);
            } else {
                // Demo fallback
                this.chatState = 'demo';
                this.generateDemoResponse(message);
            }
            return;
        }

        if (this.chatState === 'chatting') {
            this.continueBackendChat(message);
            return;
        }

        // Demo fallback for any other state
        this.generateDemoResponse(message);
    }

    async startBackendChat(challenge) {
        const source = this.detectSource();
        const payload = {
            name: this.visitorName || 'Visitor',
            challenge: challenge,
            source: source,
            slug: this.pageSlug,
            phone: ''
        };

        try {
            const response = await fetch(`${BACKEND_CONFIG.baseUrl}/chat/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            this.leadId = data.lead_id;
            this.chatState = 'chatting';
            document.getElementById('pau-chatbot-input').placeholder = 'Type your message...';
            this.addMessage(data.reply, 'jason');

        } catch (error) {
            console.error('[Jason] /chat/start error:', error);
            this.addMessage(
                "I'm having trouble connecting right now. You can reach us at https://tidycal.com/pauanalytics/discovery or WhatsApp +6014-920 7099.",
                'jason'
            );
        }
    }

    async continueBackendChat(message) {
        try {
            const response = await fetch(`${BACKEND_CONFIG.baseUrl}/chat/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lead_id: this.leadId, message: message })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            this.addMessage(data.reply, 'jason');

        } catch (error) {
            console.error('[Jason] /chat/message error:', error);
            this.addMessage(
                "Sorry, I lost the connection. You can book a call here: https://tidycal.com/pauanalytics/discovery",
                'jason'
            );
        }
    }

    generateDemoResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('retail') || lowerMessage.includes('shop')) {
            this.addMessage(DEMO_RESPONSES.retail.message, 'jason');
            setTimeout(() => this.showCaseStudy(DEMO_RESPONSES.retail.caseStudy), 1000);
        } else if (lowerMessage.includes('gym') || lowerMessage.includes('fitness')) {
            this.addMessage(DEMO_RESPONSES.gym.message, 'jason');
            setTimeout(() => this.showCaseStudy(DEMO_RESPONSES.gym.caseStudy), 1000);
        } else if (lowerMessage.includes('f&b') || lowerMessage.includes('restaurant') || lowerMessage.includes('food')) {
            this.addMessage(DEMO_RESPONSES.fnb.message, 'jason');
            setTimeout(() => this.showCaseStudy(DEMO_RESPONSES.fnb.caseStudy), 1000);
        } else if (lowerMessage.includes('browsing') || lowerMessage.includes('just looking')) {
            this.addMessage("No problem! Feel free to explore. When you're ready, I'm here to help you find solutions for your business. What industry are you in?", 'jason');
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            this.showPackageComparison();
        } else {
            this.addMessage("That's interesting! To help you better, could you tell me what kind of business you run? (e.g. retail, gym, F&B)", 'jason');
        }
    }

    showCaseStudy(caseStudy) {
        const cardHTML = `
            <div class="pau-case-study-card">
                <h4>📊 ${caseStudy.title}</h4>
                <div class="pau-case-info">
                    <p><strong>Industry:</strong> ${caseStudy.industry}</p>
                    <p><strong>Problem:</strong> ${caseStudy.problem}</p>
                    <p><strong>Solution:</strong> ${caseStudy.solution}</p>
                    <p><strong>Result:</strong> ${caseStudy.result}</p>
                </div>
                <div class="pau-case-actions">
                    <a href="${caseStudy.caseUrl}" target="_blank" class="pau-case-btn">Read Case Study →</a>
                    <a href="${caseStudy.dashboardUrl}" target="_blank" class="pau-case-btn">View Dashboard →</a>
                </div>
            </div>
        `;
        this.addMessage(cardHTML, 'jason', { html: true });
        setTimeout(() => {
            this.addMessage("Does your business face similar challenges?", 'jason');
        }, 2000);
    }

    showPackageComparison() {
        const tableHTML = `
            <div class="pau-package-table">
                <table>
                    <thead>
                        <tr><th>Feature</th><th>Insight</th><th>Standard</th><th>Premium</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Report</td><td class="pau-check">✓</td><td class="pau-check">✓</td><td class="pau-check">✓</td></tr>
                        <tr><td>Dashboard</td><td class="pau-cross">✗</td><td class="pau-check">✓</td><td class="pau-check">✓</td></tr>
                        <tr><td>AI Assistant</td><td class="pau-cross">✗</td><td class="pau-cross">✗</td><td class="pau-check">✓</td></tr>
                    </tbody>
                </table>
            </div>
        `;
        this.addMessage("Here's a quick overview of our packages:", 'jason');
        this.addMessage(tableHTML, 'jason', { html: true });
        setTimeout(() => {
            this.addMessage("Which features matter most to you? Happy to help you figure out the right fit.", 'jason');
        }, 1500);
    }

    showTyping() {
        const messagesContainer = document.getElementById('pau-chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'pau-chatbot-typing active';
        typingDiv.id = 'pau-chatbot-typing';
        typingDiv.innerHTML = `
            <span class="pau-chatbot-typing-dot"></span>
            <span class="pau-chatbot-typing-dot"></span>
            <span class="pau-chatbot-typing-dot"></span>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typingDiv = document.getElementById('pau-chatbot-typing');
        if (typingDiv) typingDiv.remove();
    }
}

// ===== INITIALIZE ON PAGE LOAD =====
window.addEventListener('DOMContentLoaded', () => {
    const pageConfig = window.pauChatbotConfig || {};
    const chatbot = new PauChatbot(pageConfig);
    window.pauChatbot = chatbot;
});
