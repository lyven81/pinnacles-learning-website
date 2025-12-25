/**
 * Pau Analytics Chatbot Configuration
 * Page-specific settings for chatbot behavior
 */

// Configuration object that can be overridden per page
window.pauChatbotConfig = {
    // Trigger settings
    triggerDelay: 10000, // Show widget after 10 seconds (10000ms)
    scrollTrigger: 300, // Pixels scrolled before considering auto-open

    // Appearance
    position: 'bottom-right', // Position of the widget
    primaryColor: '#8B4513', // Brown theme
    secondaryColor: '#D2691E', // Peru/tan

    // Behavior
    autoOpen: false, // Don't auto-open chat window
    persistConversation: true, // Remember conversation across page loads
    showNotificationBadge: true, // Show "1" badge on first load

    // Page-specific overrides (set via window.pauChatbotConfig before widget loads)
    page: 'homepage', // Will be auto-detected: 'homepage', 'dataAnalytics', 'pricing'

    // Analytics (optional)
    trackEvents: true, // Track chatbot interactions in Google Analytics
    gaEventCategory: 'Chatbot',

    // Lead capture
    requireEmail: false, // Don't force email before chatting
    emailPromptAfter: 5, // Ask for email after 5 messages exchanged

    // Demo mode settings
    demoMode: true, // Set to false when connected to Dify.AI
    showDemoWarning: false // Show warning that this is demo mode
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

// Export for use in widget
window.trackChatbotEvent = trackChatbotEvent;
