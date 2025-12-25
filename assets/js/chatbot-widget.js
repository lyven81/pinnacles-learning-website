/**
 * Pau Analytics AI Chatbot Widget
 * Jason - Data Insights Consultant
 *
 * This is a demo/placeholder version. To connect to Dify.AI:
 * 1. Set up your Dify.AI account and create Jason's agent
 * 2. Get your Dify chatbot URL or API endpoint
 * 3. Update DIFY_CONFIG with your credentials
 * 4. The widget will automatically connect to your live agent
 */

// ===== CONFIGURATION =====
const DIFY_CONFIG = {
    // TODO: Replace with your actual Dify.AI chatbot URL after setup
    enabled: false, // Set to true when Dify.AI is configured
    apiUrl: 'https://api.dify.ai/v1/chat-messages',
    apiKey: 'app-djPWQ9KsNb18La3HlYaLvjFs',
    conversationId: null
};

// Page-specific greetings
const PAGE_GREETINGS = {
    homepage: "Hi there! I'm Jason 👋 I help Malaysian businesses spot opportunities hiding in their data. What brings you here today?",
    dataAnalytics: "Hey! Looking through our case studies? I can help you find one that matches your industry or challenge. What kind of business do you run?",
    pricing: "Hi! I'm Jason. Trying to figure out which package fits your needs? Tell me a bit about your business, and I can point you in the right direction."
};

// Demo conversation flows (used when Dify is not connected)
const DEMO_RESPONSES = {
    greetings: [
        "I run a retail shop",
        "I have a gym",
        "I'm in F&B business",
        "Just browsing"
    ],

    retail: {
        message: "Ah, retail! Many retail owners I talk to struggle with inventory management or understanding which customers are most valuable. Is that something you're dealing with too?",
        caseStudy: {
            title: "Where Revenue Comes From",
            industry: "Retail",
            problem: "Uncertain which products drive revenue",
            solution: "Revenue driver analysis",
            result: "Identified top 20% products driving 80% revenue",
            caseUrl: "/pinnacles-learning-website/case-study/where-revenue-comes-from.html",
            dashboardUrl: "/pinnacles-learning-website/dashboard/where-revenue-comes-from.html"
        }
    },

    gym: {
        message: "Great! Fitness business can be challenging. Many gym owners I've worked with struggle with member retention - people sign up but stop showing up. Sound familiar?",
        caseStudy: {
            title: "Predicting Gym Member Dropout",
            industry: "Fitness",
            problem: "15% monthly churn without early warning",
            solution: "Visit pattern analysis",
            result: "Reduced churn to 8% with early intervention",
            caseUrl: "/pinnacles-learning-website/case-study/predicting-gym-member-dropout.html",
            dashboardUrl: "/pinnacles-learning-website/dashboard/predicting-gym-member-dropout.html"
        }
    },

    fnb: {
        message: "F&B business! That's a tough industry. Many restaurant owners I talk to struggle with menu optimization or understanding customer preferences. Is that on your mind too?",
        caseStudy: {
            title: "Finding Which Campaigns Work",
            industry: "Food & Beverage",
            problem: "Marketing budget wasted on ineffective campaigns",
            solution: "Campaign ROI analysis",
            result: "Identified top 3 channels with 5x better ROI",
            caseUrl: "/pinnacles-learning-website/case-study/finding-which-campaign-work.html",
            dashboardUrl: "/pinnacles-learning-website/agentic_workflow/finding_which_campaign_work.html"
        }
    }
};

// ===== CHATBOT CLASS =====
class PauChatbot {
    constructor(config) {
        this.config = config;
        this.isOpen = false;
        this.conversationHistory = [];
        this.currentPage = this.detectPage();

        this.init();
    }

    detectPage() {
        const path = window.location.pathname;
        if (path.includes('data-analytics')) return 'dataAnalytics';
        if (path.includes('pricing')) return 'pricing';
        return 'homepage';
    }

    init() {
        // Create widget HTML
        this.createWidget();

        // Attach event listeners
        this.attachEventListeners();

        // Show widget after delay
        setTimeout(() => this.showWidget(), this.config.triggerDelay || 10000);

        // Check if should auto-open (scroll trigger)
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
                        <!-- Messages will be added here -->
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
        // Toggle button
        document.getElementById('pau-chatbot-toggle').addEventListener('click', () => {
            this.toggleChat();
        });

        // Close button
        document.getElementById('pau-chatbot-close').addEventListener('click', () => {
            this.closeChat();
        });

        // Send button
        document.getElementById('pau-chatbot-send').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key to send
        document.getElementById('pau-chatbot-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    showWidget() {
        const widget = document.getElementById('pau-chatbot-widget');
        if (widget) {
            widget.style.display = 'block';
        }
    }

    setupScrollTrigger() {
        let triggered = false;
        window.addEventListener('scroll', () => {
            if (!triggered && window.scrollY > 300) {
                triggered = true;
                // Could auto-open here if desired
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('pau-chatbot-window');
        const button = document.getElementById('pau-chatbot-toggle');
        const badge = document.querySelector('.pau-chatbot-badge');

        if (this.isOpen) {
            window.classList.add('active');
            button.style.display = 'none';

            // Hide badge
            if (badge) badge.style.display = 'none';

            // Send welcome message if first time
            if (this.conversationHistory.length === 0) {
                this.sendWelcomeMessage();
            }
        } else {
            window.classList.remove('active');
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

        // Add quick replies
        this.addQuickReplies(DEMO_RESPONSES.greetings);
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

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Store in history
        this.conversationHistory.push({ text, sender, timestamp: Date.now() });
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
        // Add user message
        this.addMessage(reply, 'user');

        // Show typing indicator
        this.showTyping();

        // Simulate response delay
        setTimeout(() => {
            this.hideTyping();
            this.generateDemoResponse(reply);
        }, 1500);
    }

    sendMessage() {
        const input = document.getElementById('pau-chatbot-input');
        const message = input.value.trim();

        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Check if Dify is enabled
        if (DIFY_CONFIG.enabled) {
            this.sendToDify(message);
        } else {
            // Demo mode
            this.showTyping();
            setTimeout(() => {
                this.hideTyping();
                this.generateDemoResponse(message);
            }, 1500);
        }
    }

    async sendToDify(message) {
        // TODO: Implement actual Dify.AI API call
        // This is a placeholder for when Dify is configured

        try {
            const response = await fetch(DIFY_CONFIG.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DIFY_CONFIG.apiKey}`
                },
                body: JSON.stringify({
                    query: message,
                    conversation_id: DIFY_CONFIG.conversationId,
                    user: 'web-visitor'
                })
            });

            const data = await response.json();

            // Update conversation ID
            if (data.conversation_id) {
                DIFY_CONFIG.conversationId = data.conversation_id;
            }

            // Add Jason's response
            this.addMessage(data.answer, 'jason');

        } catch (error) {
            console.error('Dify API error:', error);
            this.addMessage("Sorry, I'm having trouble connecting right now. Please try again or contact us at admin@pauanalytics.com", 'jason');
        }
    }

    generateDemoResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        // Detect industry
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
            this.addMessage("No problem! Feel free to explore our case studies. When you're ready, I'm here to help you find solutions relevant to your business. What industry are you in?", 'jason');
        } else if (lowerMessage.includes('price') || lowerMessage.includes('package') || lowerMessage.includes('cost')) {
            this.showPackageComparison();
        } else {
            // Generic response
            this.addMessage("That's interesting! To help you better, could you tell me what kind of business you run? (e.g., retail, gym, F&B, banking, etc.)", 'jason');
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
            this.addMessage("What stood out to you from that case study? Does your business face similar challenges?", 'jason');
        }, 2000);
    }

    showPackageComparison() {
        const tableHTML = `
            <div class="pau-package-table">
                <table>
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Insight</th>
                            <th>Standard</th>
                            <th>Premium</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Report</td>
                            <td class="pau-check">✓</td>
                            <td class="pau-check">✓</td>
                            <td class="pau-check">✓</td>
                        </tr>
                        <tr>
                            <td>Dashboard</td>
                            <td class="pau-cross">✗</td>
                            <td class="pau-check">✓</td>
                            <td class="pau-check">✓</td>
                        </tr>
                        <tr>
                            <td>AI Assistant</td>
                            <td class="pau-cross">✗</td>
                            <td class="pau-cross">✗</td>
                            <td class="pau-check">✓</td>
                        </tr>
                        <tr>
                            <td><strong>Price/month</strong></td>
                            <td>RM750</td>
                            <td class="pau-popular">RM1,500 ⭐</td>
                            <td>RM2,250</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        this.addMessage("Here's a quick comparison of our packages:", 'jason');
        this.addMessage(tableHTML, 'jason', { html: true });

        setTimeout(() => {
            this.addMessage("Which features matter most to you? Or would you like me to recommend a package based on your needs?", 'jason');
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
        if (typingDiv) {
            typingDiv.remove();
        }
    }
}

// ===== INITIALIZE ON PAGE LOAD =====
window.addEventListener('DOMContentLoaded', () => {
    // Get page-specific config
    const pageConfig = window.pauChatbotConfig || {};

    // Initialize chatbot
    const chatbot = new PauChatbot(pageConfig);

    // Make chatbot accessible globally for debugging
    window.pauChatbot = chatbot;

    console.log('Pau Analytics Chatbot initialized');
    console.log('Current page:', chatbot.currentPage);
    console.log('Dify enabled:', DIFY_CONFIG.enabled);
});
