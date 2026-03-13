/**
 * Pau Analytics Chatbot Configuration
 * Page-specific settings for chatbot behavior
 *
 * backendUrl: Railway deployment URL — update this when you deploy a new backend
 */

window.pauChatbotConfig = {
    // Backend URL — all chat and form submissions point here
    backendUrl: 'https://web-chat-lead-manager.railway.app',

    // Trigger settings
    triggerDelay: 10000, // Show widget after 10 seconds (ms)
    scrollTrigger: 300,  // Pixels scrolled before scroll trigger activates

    // Appearance
    position: 'bottom-right',
    primaryColor: '#8B4513',
    secondaryColor: '#D2691E',

    // Behavior
    autoOpen: false,
    persistConversation: true,
    showNotificationBadge: true,

    // Analytics
    trackEvents: true,
    gaEventCategory: 'Chatbot'
};

// Google Analytics event tracking
function trackChatbotEvent(action, label) {
    if (window.pauChatbotConfig.trackEvents && typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': window.pauChatbotConfig.gaEventCategory,
            'event_label': label
        });
    }
}

window.trackChatbotEvent = trackChatbotEvent;
