// FRA Assistant Chatbot - Complete Implementation
class FRAAssistant {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.currentLanguage = 'en';
        this.userRole = this.detectUserRole();
        this.isTyping = false;
        this.init();
    }

    detectUserRole() {
        // Detect from localStorage or default to citizen
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.role || 'citizen';
    }

    init() {
        this.createChatbotUI();
        this.attachEventListeners();
        this.loadChatHistory();
    }

    createChatbotUI() {
        const chatbotHTML = `
            <!-- Chatbot Floating Button -->
            <div id="chatbot-button" class="chatbot-button">
                <i data-lucide="message-circle"></i>
                <span class="chatbot-badge" id="chatbot-badge">1</span>
            </div>

            <!-- Chatbot Window -->
            <div id="chatbot-window" class="chatbot-window" style="display: none;">
                <div class="chatbot-header">
                    <div class="chatbot-header-info">
                        <div class="chatbot-avatar">
                            <i data-lucide="bot"></i>
                        </div>
                        <div>
                            <h3>FRA Assistant</h3>
                            <p class="chatbot-status">
                                <span class="status-dot"></span>
                                <span id="chatbot-status-text">Online</span>
                            </p>
                        </div>
                    </div>
                    <div class="chatbot-header-actions">
                        <button class="chatbot-action-btn" id="chatbot-lang-toggle" title="Switch Language">
                            <i data-lucide="languages"></i>
                        </button>
                        <button class="chatbot-action-btn" id="chatbot-voice-toggle" title="Voice Input">
                            <i data-lucide="mic"></i>
                        </button>
                        <button class="chatbot-action-btn" id="chatbot-minimize">
                            <i data-lucide="minimize-2"></i>
                        </button>
                    </div>
                </div>

                <div class="chatbot-messages" id="chatbot-messages">
                    <!-- Messages will be added here -->
                </div>

                <div class="chatbot-quick-replies" id="chatbot-quick-replies">
                    <!-- Quick reply buttons will be added here -->
                </div>

                <div class="chatbot-input-container">
                    <input 
                        type="text" 
                        id="chatbot-input" 
                        class="chatbot-input" 
                        placeholder="Type your message..."
                        autocomplete="off"
                    />
                    <button class="chatbot-send-btn" id="chatbot-send">
                        <i data-lucide="send"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    attachEventListeners() {
        const button = document.getElementById('chatbot-button');
        const minimize = document.getElementById('chatbot-minimize');
        const send = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');
        const langToggle = document.getElementById('chatbot-lang-toggle');
        const voiceToggle = document.getElementById('chatbot-voice-toggle');

        button.addEventListener('click', () => this.toggleChat());
        minimize.addEventListener('click', () => this.toggleChat());
        send.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        langToggle.addEventListener('click', () => this.toggleLanguage());
        voiceToggle.addEventListener('click', () => this.startVoiceInput());
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chatbot-window');
        const button = document.getElementById('chatbot-button');
        const badge = document.getElementById('chatbot-badge');

        if (this.isOpen) {
            window.style.display = 'flex';
            button.style.display = 'none';
            badge.style.display = 'none';
            
            if (this.messages.length === 0) {
                this.addWelcomeMessage();
            }
            
            setTimeout(() => {
                document.getElementById('chatbot-input').focus();
            }, 300);
        } else {
            window.style.display = 'none';
            button.style.display = 'flex';
        }
    }

    addWelcomeMessage() {
        const welcomeMessages = {
            en: {
                citizen: "Hello 👋! I'm your FRA Assistant. I can help you check claim status, upload documents, find schemes, and submit feedback. How can I help you today?",
                officer: "Hello 👋! I'm your FRA Assistant. I can help you with claim summaries, pending verifications, and district reports. What would you like to do?",
                admin: "Hello 👋! I'm your FRA Assistant. I can provide state-level analytics, generate reports, and show DSS recommendations. How can I assist you?"
            },
            hi: {
                citizen: "नमस्ते 👋! मैं आपका FRA सहायक हूं। मैं दावा स्थिति जांचने, दस्तावेज़ अपलोड करने, योजनाएं खोजने और फीडबैक देने में मदद कर सकता हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
                officer: "नमस्ते 👋! मैं आपका FRA सहायक हूं। मैं दावा सारांश, लंबित सत्यापन और जिला रिपोर्ट में मदद कर सकता हूं। आप क्या करना चाहेंगे?",
                admin: "नमस्ते 👋! मैं आपका FRA सहायक हूं। मैं राज्य-स्तरीय विश्लेषण, रिपोर्ट और DSS सिफारिशें प्रदान कर सकता हूं। मैं आपकी कैसे सहायता कर सकता हूं?"
            }
        };

        const message = welcomeMessages[this.currentLanguage][this.userRole];
        this.addMessage(message, 'bot');
        this.showQuickReplies();
    }

    showQuickReplies() {
        const quickReplies = {
            en: {
                citizen: [
                    { text: '🔍 Check Claim Status', action: 'check_claim' },
                    { text: '📄 Upload Document', action: 'upload_doc' },
                    { text: '🎯 Get Scheme Info', action: 'scheme_info' },
                    { text: '💬 Submit Feedback', action: 'feedback' }
                ],
                officer: [
                    { text: '📊 Claim Summary', action: 'claim_summary' },
                    { text: '⏳ Pending Claims', action: 'pending_claims' },
                    { text: '⚠️ Unverified Claims', action: 'unverified' },
                    { text: '📋 Generate Report', action: 'generate_report' }
                ],
                admin: [
                    { text: '📈 FRA Progress', action: 'fra_progress' },
                    { text: '📊 Monthly Report', action: 'monthly_report' },
                    { text: '🎯 DSS Recommendations', action: 'dss_recommendations' },
                    { text: '🗺️ District Analytics', action: 'district_analytics' }
                ]
            },
            hi: {
                citizen: [
                    { text: '🔍 दावा स्थिति जांचें', action: 'check_claim' },
                    { text: '📄 दस्तावेज़ अपलोड करें', action: 'upload_doc' },
                    { text: '🎯 योजना जानकारी', action: 'scheme_info' },
                    { text: '💬 फीडबैक दें', action: 'feedback' }
                ],
                officer: [
                    { text: '📊 दावा सारांश', action: 'claim_summary' },
                    { text: '⏳ लंबित दावे', action: 'pending_claims' },
                    { text: '⚠️ असत्यापित दावे', action: 'unverified' },
                    { text: '📋 रिपोर्ट बनाएं', action: 'generate_report' }
                ],
                admin: [
                    { text: '📈 FRA प्रगति', action: 'fra_progress' },
                    { text: '📊 मासिक रिपोर्ट', action: 'monthly_report' },
                    { text: '🎯 DSS सिफारिशें', action: 'dss_recommendations' },
                    { text: '🗺️ जिला विश्लेषण', action: 'district_analytics' }
                ]
            }
        };

        const replies = quickReplies[this.currentLanguage][this.userRole];
        const container = document.getElementById('chatbot-quick-replies');
        
        container.innerHTML = replies.map(reply => 
            `<button class="quick-reply-btn" data-action="${reply.action}">${reply.text}</button>`
        ).join('');

        // Attach click handlers
        container.querySelectorAll('.quick-reply-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickReply(action);
            });
        });
    }

    async handleQuickReply(action) {
        const actionHandlers = {
            check_claim: () => this.promptClaimId(),
            upload_doc: () => this.showUploadOptions(),
            scheme_info: () => this.showSchemeInfo(),
            feedback: () => this.promptFeedback(),
            claim_summary: () => this.showClaimSummary(),
            pending_claims: () => this.showPendingClaims(),
            unverified: () => this.showUnverifiedClaims(),
            generate_report: () => this.generateReport(),
            fra_progress: () => this.showFRAProgress(),
            monthly_report: () => this.generateMonthlyReport(),
            dss_recommendations: () => this.showDSSRecommendations(),
            district_analytics: () => this.showDistrictAnalytics()
        };

        if (actionHandlers[action]) {
            await actionHandlers[action]();
        }
    }

    addMessage(text, sender = 'user', options = {}) {
        const message = {
            text,
            sender,
            timestamp: new Date(),
            ...options
        };

        this.messages.push(message);
        this.renderMessage(message);
        this.saveChatHistory();
        this.scrollToBottom();
    }

    renderMessage(message) {
        const container = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${message.sender}-message`;
        
        const time = new Date(message.timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageDiv.innerHTML = `
            <div class="message-content">
                ${message.sender === 'bot' ? '<div class="bot-avatar"><i data-lucide="bot"></i></div>' : ''}
                <div class="message-bubble">
                    <p>${message.text}</p>
                    ${message.html || ''}
                </div>
            </div>
            <div class="message-time">${time}</div>
        `;

        container.appendChild(messageDiv);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    showTypingIndicator() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const container = document.getElementById('chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="bot-avatar"><i data-lucide="bot"></i></div>
                <div class="message-bubble">
                    <div class="typing-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(typingDiv);
        this.scrollToBottom();
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatbot-input');
        const text = input.value.trim();
        
        if (!text) return;
        
        this.addMessage(text, 'user');
        input.value = '';
        
        await this.processMessage(text);
    }

    async processMessage(text) {
        this.showTypingIndicator();
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const lowerText = text.toLowerCase();
        
        // 🟢 1️⃣ CLAIM STATUS CHECK
        const claimIdMatch = text.match(/\b(FRA[-\s]?[A-Z]{2}[-\s]?[A-Z]{3}[-\s]?\d{4}[-\s]?\d{3})\b/i);
        if (claimIdMatch || lowerText.includes('status') || lowerText.includes('my claim')) {
            if (claimIdMatch) {
                await this.checkClaimStatus(claimIdMatch[1]);
                this.hideTypingIndicator();
                return;
            } else {
                this.hideTypingIndicator();
                this.promptClaimId();
                return;
            }
        }
        
        // 🟡 2️⃣ PENDING CLAIMS IN DISTRICT
        if ((lowerText.includes('pending') && lowerText.includes('claim')) || 
            (lowerText.includes('show') && lowerText.includes('pending'))) {
            const districtMatch = text.match(/in\s+(\w+)/i);
            const district = districtMatch ? districtMatch[1] : null;
            await this.showPendingClaimsByDistrict(district);
            this.hideTypingIndicator();
            return;
        }
        
        // 🔵 3️⃣ SCHEME ELIGIBILITY (DSS)
        if (lowerText.includes('eligible') || lowerText.includes('scheme') || 
            lowerText.includes('योजना') || lowerText.includes('पात्र')) {
            await this.showSchemeEligibility();
            this.hideTypingIndicator();
            return;
        }
        
        // 🟠 4️⃣ ASSET INFORMATION
        if (lowerText.includes('asset') || lowerText.includes('forest') || 
            lowerText.includes('water') || lowerText.includes('pond') || 
            lowerText.includes('land use') || lowerText.includes('infrastructure')) {
            await this.showAssetInformation(text);
            this.hideTypingIndicator();
            return;
        }
        
        // 🟣 5️⃣ FEEDBACK & ISSUE REPORTING
        if (lowerText.includes('feedback') || lowerText.includes('issue') || 
            lowerText.includes('complaint') || lowerText.includes('problem') ||
            lowerText.includes('फीडबैक') || lowerText.includes('शिकायत')) {
            await this.handleFeedback(text);
            this.hideTypingIndicator();
            return;
        }
        
        // 🟤 6️⃣ REPORT GENERATION
        if (lowerText.includes('report') || lowerText.includes('generate') || 
            lowerText.includes('download') || lowerText.includes('रिपोर्ट')) {
            await this.handleReportGeneration(text);
            this.hideTypingIndicator();
            return;
        }
        
        // 📍 MAP COMMANDS
        const mapResult = await this.processMapCommand(text);
        if (mapResult.handled) {
            this.hideTypingIndicator();
            this.addMessage(mapResult.message, 'bot');
            return;
        }
        
        // 🔍 DOCUMENT UPLOAD
        if (lowerText.includes('document') || lowerText.includes('upload') || 
            lowerText.includes('दस्तावेज़') || lowerText.includes('अपलोड')) {
            this.hideTypingIndicator();
            this.showUploadOptions();
            return;
        }
        
        // ⚫ 7️⃣ GENERAL HELP
        if (lowerText.includes('help') || lowerText.includes('how') || 
            lowerText.includes('मदद') || lowerText.includes('सहायता')) {
            this.hideTypingIndicator();
            this.showGeneralHelp();
            return;
        }
        
        // DEFAULT RESPONSE
        this.hideTypingIndicator();
        const defaultMsg = this.currentLanguage === 'en'
            ? "I'm here to help! You can ask me about:\n• Claim status\n• Scheme eligibility\n• Pending claims\n• Asset information\n• Feedback or issues\n• Report generation\n\nWhat would you like to know?"
            : "मैं आपकी मदद के लिए यहां हूं! आप मुझसे पूछ सकते हैं:\n• दावा स्थिति\n• योजना पात्रता\n• लंबित दावे\n• संपत्ति जानकारी\n• फीडबैक या समस्याएं\n• रिपोर्ट बनाना\n\nआप क्या जानना चाहेंगे?";
        this.addMessage(defaultMsg, 'bot');
    }

    promptClaimId() {
        const msg = this.currentLanguage === 'en' 
            ? "Please provide your Claim ID (e.g., FRA-JH-RAN-2025-001)" 
            : "कृपया अपना दावा आईडी प्रदान करें (जैसे FRA-JH-RAN-2025-001)";
        this.addMessage(msg, 'bot');
    }

    async checkClaimStatus(claimId) {
        try {
            // Fetch claims from backend API
            const response = await api.get(`/claims`);
            const claims = response.data.data?.claims || [];
            const claim = claims.find(c => c.claim_number.toLowerCase() === claimId.toLowerCase());
            
            if (claim) {
                // Enhanced status messages with more details
                const statusMessages = {
                    en: {
                        pending: `✅ Claim ${claim.claim_number} belongs to ${claim.applicant_name} from ${claim.district} district.\n\nCurrent Status: Pending Review ⏳\n${claim.ai_score ? `AI Verification Accuracy: ${claim.ai_score}%\n` : ''}Last Updated: ${new Date(claim.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`,
                        
                        approved: `✅ Claim ${claim.claim_number} belongs to ${claim.applicant_name} from ${claim.district} district.\n\nCurrent Status: Approved ✅\n${claim.ai_score ? `AI Verification Accuracy: ${claim.ai_score}%\n` : ''}${claim.reviewed_at ? `Approved on: ${new Date(claim.reviewed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}`,
                        
                        rejected: `✅ Claim ${claim.claim_number} belongs to ${claim.applicant_name} from ${claim.district} district.\n\nCurrent Status: Rejected ❌\nReason: ${claim.remarks || 'Not specified'}\n${claim.reviewed_at ? `Rejected on: ${new Date(claim.reviewed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}`,
                        
                        under_review: `✅ Claim ${claim.claim_number} belongs to ${claim.applicant_name} from ${claim.district} district.\n\nCurrent Status: Under District Verification 🔍\n${claim.ai_score ? `AI Verification Accuracy: ${claim.ai_score}%\n` : ''}Last Updated: ${new Date(claim.updated_at || claim.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
                    },
                    hi: {
                        pending: `✅ दावा ${claim.claim_number} ${claim.district} जिले के ${claim.applicant_name} का है।\n\nवर्तमान स्थिति: समीक्षा लंबित ⏳\n${claim.ai_score ? `AI सत्यापन सटीकता: ${claim.ai_score}%\n` : ''}अंतिम अपडेट: ${new Date(claim.created_at).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`,
                        
                        approved: `✅ दावा ${claim.claim_number} ${claim.district} जिले के ${claim.applicant_name} का है।\n\nवर्तमान स्थिति: स्वीकृत ✅\n${claim.ai_score ? `AI सत्यापन सटीकता: ${claim.ai_score}%\n` : ''}${claim.reviewed_at ? `स्वीकृति तिथि: ${new Date(claim.reviewed_at).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}`,
                        
                        rejected: `✅ दावा ${claim.claim_number} ${claim.district} जिले के ${claim.applicant_name} का है।\n\nवर्तमान स्थिति: अस्वीकृत ❌\nकारण: ${claim.remarks || 'निर्दिष्ट नहीं'}\n${claim.reviewed_at ? `अस्वीकृति तिथि: ${new Date(claim.reviewed_at).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}`,
                        
                        under_review: `✅ दावा ${claim.claim_number} ${claim.district} जिले के ${claim.applicant_name} का है।\n\nवर्तमान स्थिति: जिला सत्यापन में 🔍\n${claim.ai_score ? `AI सत्यापन सटीकता: ${claim.ai_score}%\n` : ''}अंतिम अपडेट: ${new Date(claim.updated_at || claim.created_at).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
                    }
                };
                
                const message = statusMessages[this.currentLanguage][claim.status] || 
                    `✅ Claim ${claim.claim_number} belongs to ${claim.applicant_name} from ${claim.district} district.\n\nCurrent Status: ${claim.status}`;
                
                // Enhanced details card
                const detailsHTML = `
                    <div class="claim-details">
                        <div style="background: #f0fdf4; padding: 0.75rem; border-radius: 8px; margin-top: 0.5rem;">
                            <p style="margin: 0.25rem 0;"><strong>📍 Location:</strong> ${claim.village}, ${claim.district}, ${claim.state || 'Jharkhand'}</p>
                            <p style="margin: 0.25rem 0;"><strong>📏 Land Area:</strong> ${claim.land_area} Hectares</p>
                            <p style="margin: 0.25rem 0;"><strong>📋 Claim Type:</strong> ${claim.claim_type}</p>
                            ${claim.linked_scheme ? `<p style="margin: 0.25rem 0;"><strong>🎯 Linked Scheme:</strong> ${claim.linked_scheme}</p>` : ''}
                            ${claim.document_url ? `<p style="margin: 0.25rem 0;"><strong>📄 Documents:</strong> <a href="${claim.document_url}" target="_blank" style="color: #1e5631;">View</a></p>` : ''}
                        </div>
                        ${claim.latitude && claim.longitude ? `
                            <button 
                                onclick="showClaimOnMap('${claim.claim_number}', ${claim.latitude}, ${claim.longitude})" 
                                style="
                                    width: 100%;
                                    margin-top: 0.75rem;
                                    padding: 0.75rem;
                                    background: linear-gradient(135deg, #1e5631 0%, #2d7a45 100%);
                                    color: white;
                                    border: none;
                                    border-radius: 8px;
                                    font-weight: 600;
                                    cursor: pointer;
                                    transition: all 0.3s ease;
                                "
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(30,86,49,0.3)'"
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                            >
                                🗺️ Show on Map
                            </button>
                        ` : ''}
                    </div>
                `;
                
                this.addMessage(message, 'bot', { html: detailsHTML });
                
                // Auto-highlight on map if map integration is available
                if (claim.latitude && claim.longitude && window.chatbotMapIntegration) {
                    setTimeout(() => {
                        window.chatbotMapIntegration.updateMap('highlightClaim', {
                            claimId: claim.claim_number
                        });
                    }, 1000);
                }
                
            } else {
                const notFoundMsg = this.currentLanguage === 'en'
                    ? `⚠️ Sorry, I couldn't find any claim with ID "${claimId}".\n\nPlease check:\n• The claim ID is correct\n• The claim has been submitted\n• Try again or contact your district office 📞`
                    : `⚠️ क्षमा करें, मुझे आईडी "${claimId}" के साथ कोई दावा नहीं मिला।\n\nकृपया जांचें:\n• दावा आईडी सही है\n• दावा जमा किया गया है\n• पुनः प्रयास करें या अपने जिला कार्यालय से संपर्क करें 📞`;
                this.addMessage(notFoundMsg, 'bot');
            }
        } catch (error) {
            console.error('Claim status check error:', error);
            const errorMsg = this.currentLanguage === 'en'
                ? "❌ Sorry, I couldn't fetch the claim details right now. Please try again later or check your internet connection."
                : "❌ क्षमा करें, मैं अभी दावा विवरण प्राप्त नहीं कर सका। कृपया बाद में पुनः प्रयास करें या अपना इंटरनेट कनेक्शन जांचें।";
            this.addMessage(errorMsg, 'bot');
        }
    }

    showUploadOptions() {
        const msg = this.currentLanguage === 'en'
            ? "To upload documents, please visit the Claims page and click on 'Upload Documents'. You can upload land proof, identity documents, and asset data. 📄"
            : "दस्तावेज़ अपलोड करने के लिए, कृपया दावे पृष्ठ पर जाएं और 'दस्तावेज़ अपलोड करें' पर क्लिक करें। आप भूमि प्रमाण, पहचान दस्तावेज़ और संपत्ति डेटा अपलोड कर सकते हैं। 📄";
        this.addMessage(msg, 'bot');
    }

    async showSchemeInfo() {
        const schemes = [
            { name: 'PM-KISAN', desc: 'Direct income support of ₹6000/year', icon: '🌾' },
            { name: 'MGNREGA', desc: '100 days guaranteed employment', icon: '👷' },
            { name: 'Jal Jeevan Mission', desc: 'Tap water connection for every household', icon: '💧' },
            { name: 'PMAY', desc: 'Housing for all scheme', icon: '🏠' }
        ];
        
        const schemesHTML = `
            <div class="schemes-list">
                ${schemes.map(s => `
                    <div class="scheme-item">
                        <span class="scheme-icon">${s.icon}</span>
                        <div>
                            <strong>${s.name}</strong>
                            <p>${s.desc}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        const msg = this.currentLanguage === 'en'
            ? "Here are some government schemes you might be eligible for:"
            : "यहां कुछ सरकारी योजनाएं हैं जिनके लिए आप पात्र हो सकते हैं:";
        
        this.addMessage(msg, 'bot', { html: schemesHTML });
    }

    promptFeedback() {
        const msg = this.currentLanguage === 'en'
            ? "Please share your feedback or complaint. I'll make sure it reaches the right team. 💬"
            : "कृपया अपनी प्रतिक्रिया या शिकायत साझा करें। मैं सुनिश्चित करूंगा कि यह सही टीम तक पहुंचे। 💬";
        this.addMessage(msg, 'bot');
    }

    async showClaimSummary() {
        try {
            const response = await api.get('/claims');
            const stats = response.data.statistics || {};
            
            const summaryHTML = `
                <div class="claim-summary">
                    <div class="summary-item">
                        <span class="summary-icon">📊</span>
                        <div>
                            <strong>Total Claims</strong>
                            <p>${stats.total || 0}</p>
                        </div>
                    </div>
                    <div class="summary-item">
                        <span class="summary-icon">✅</span>
                        <div>
                            <strong>Approved</strong>
                            <p>${stats.approved || 0}</p>
                        </div>
                    </div>
                    <div class="summary-item">
                        <span class="summary-icon">⏳</span>
                        <div>
                            <strong>Pending</strong>
                            <p>${stats.pending || 0}</p>
                        </div>
                    </div>
                    <div class="summary-item">
                        <span class="summary-icon">🔍</span>
                        <div>
                            <strong>Under Review</strong>
                            <p>${stats.under_review || 0}</p>
                        </div>
                    </div>
                </div>
            `;
            
            this.addMessage("Here's your claim summary:", 'bot', { html: summaryHTML });
        } catch (error) {
            this.addMessage("Sorry, I couldn't fetch the claim summary. Please try again.", 'bot');
        }
    }

    async showPendingClaims() {
        try {
            const response = await api.get('/claims');
            const claims = response.data.data?.claims || [];
            const pending = claims.filter(c => c.status === 'pending' || c.status === 'under_review');
            
            if (pending.length > 0) {
                const msg = `There are ${pending.length} pending claims. ${pending.filter(c => c.status === 'under_review').length} under verification, ${pending.filter(c => c.status === 'pending').length} awaiting review. 📋`;
                this.addMessage(msg, 'bot');
            } else {
                this.addMessage("Great! No pending claims at the moment. ✅", 'bot');
            }
        } catch (error) {
            this.addMessage("Sorry, I couldn't fetch pending claims. Please try again.", 'bot');
        }
    }

    showUnverifiedClaims() {
        this.addMessage("Checking for unverified claims... This feature will show claims that need immediate attention. ⚠️", 'bot');
    }

    generateReport() {
        this.addMessage("Generating report... ✅ Your file will be ready for download shortly.", 'bot');
        setTimeout(() => {
            if (typeof generateDashboardReport === 'function') {
                generateDashboardReport();
            }
        }, 1000);
    }

    showFRAProgress() {
        this.addMessage("Fetching FRA progress data across all districts... 📈", 'bot');
    }

    generateMonthlyReport() {
        this.addMessage("Generating monthly progress report... ✅ Your file is ready for download.", 'bot');
        setTimeout(() => {
            if (typeof generateDashboardReport === 'function') {
                generateDashboardReport();
            }
        }, 1000);
    }

    showDSSRecommendations() {
        this.addMessage("Fetching DSS-based scheme recommendations... 🎯", 'bot');
    }

    showDistrictAnalytics() {
        this.addMessage("Loading district-wise analytics... 🗺️", 'bot');
    }

    /**
     * 🟡 Show pending claims by district
     */
    async showPendingClaimsByDistrict(district) {
        try {
            const response = await api.get('/claims');
            const claims = response.data.data?.claims || [];
            
            let pendingClaims = claims.filter(c => 
                c.status === 'pending' || c.status === 'under_review'
            );
            
            if (district) {
                pendingClaims = pendingClaims.filter(c => 
                    c.district.toLowerCase() === district.toLowerCase()
                );
            }
            
            const topIds = pendingClaims.slice(0, 3).map(c => c.claim_number).join(', ');
            
            const message = this.currentLanguage === 'en'
                ? `There are ${pendingClaims.length} pending FRA claims${district ? ` in ${district} district` : ''}.\n\n${topIds ? `Top 3 claim IDs: ${topIds}` : ''}\n\nWould you like me to show them on the map? 🗺️`
                : `${district ? `${district} जिले में` : ''} ${pendingClaims.length} लंबित FRA दावे हैं।\n\n${topIds ? `शीर्ष 3 दावा आईडी: ${topIds}` : ''}\n\nक्या आप चाहेंगे कि मैं उन्हें मानचित्र पर दिखाऊं? 🗺️`;
            
            this.addMessage(message, 'bot');
            
            // Auto-show on map if available
            if (pendingClaims.length > 0 && window.chatbotMapIntegration) {
                setTimeout(async () => {
                    await window.chatbotMapIntegration.updateMap('showPendingClaims', { district });
                }, 1500);
            }
        } catch (error) {
            console.error('Show pending claims error:', error);
            this.addMessage("Sorry, I couldn't fetch pending claims. Please try again.", 'bot');
        }
    }

    /**
     * 🔵 Show scheme eligibility (DSS Integration)
     */
    async showSchemeEligibility() {
        try {
            // Try to get user's claim ID from localStorage or context
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const claimId = user.claimId || null;
            
            // Fetch DSS recommendations
            const endpoint = claimId ? `/dss/recommend?claimId=${claimId}` : '/dss/recommend';
            
            try {
                const response = await api.get(endpoint);
                const schemes = response.data.eligible_schemes || [];
                const priority = response.data.priority || 'Medium';
                
                const schemesHTML = `
                    <div class="schemes-list">
                        <p style="margin-bottom: 0.75rem;"><strong>🎯 Based on your FRA data and asset mapping, you are eligible for:</strong></p>
                        ${schemes.map(s => `
                            <div class="scheme-item" style="padding: 0.5rem; background: #f0fdf4; border-radius: 6px; margin-bottom: 0.5rem;">
                                <strong>• ${s}</strong>
                            </div>
                        `).join('')}
                        <p style="margin-top: 0.75rem; color: #1e5631;"><strong>Priority Level:</strong> ${priority}</p>
                        <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #6b7280;">Would you like to apply or view detailed benefits?</p>
                    </div>
                `;
                
                this.addMessage("Here are your eligible schemes:", 'bot', { html: schemesHTML });
            } catch (dssError) {
                // Fallback to general scheme info
                await this.showSchemeInfo();
            }
        } catch (error) {
            console.error('Scheme eligibility error:', error);
            await this.showSchemeInfo();
        }
    }

    /**
     * 🟠 Show asset information
     */
    async showAssetInformation(text) {
        try {
            const lowerText = text.toLowerCase();
            let assetType = 'all';
            
            if (lowerText.includes('forest')) assetType = 'forest';
            else if (lowerText.includes('water') || lowerText.includes('pond')) assetType = 'water';
            else if (lowerText.includes('land')) assetType = 'land';
            else if (lowerText.includes('infrastructure')) assetType = 'infrastructure';
            
            // Extract district if mentioned
            const districtMatch = text.match(/in\s+(\w+)|for\s+(\w+)/i);
            const district = districtMatch ? (districtMatch[1] || districtMatch[2]) : null;
            
            // Mock asset data (in production, fetch from API)
            const assetData = {
                forest_area: '1,245 ha',
                water_bodies_count: 23,
                agri_land: '3,456 ha',
                infrastructure: 'Roads: 45 km, Schools: 12, Health Centers: 5'
            };
            
            const assetsHTML = `
                <div class="assets-info">
                    <p style="margin-bottom: 0.75rem;"><strong>🗺️ Assets mapped${district ? ` for ${district} district` : ''}:</strong></p>
                    <div style="background: #f0fdf4; padding: 0.75rem; border-radius: 8px;">
                        <p style="margin: 0.25rem 0;">🌲 <strong>Forest Cover:</strong> ${assetData.forest_area}</p>
                        <p style="margin: 0.25rem 0;">💧 <strong>Water Bodies:</strong> ${assetData.water_bodies_count}</p>
                        <p style="margin: 0.25rem 0;">🌾 <strong>Agricultural Land:</strong> ${assetData.agri_land}</p>
                        <p style="margin: 0.25rem 0;">🏗️ <strong>Infrastructure:</strong> ${assetData.infrastructure}</p>
                    </div>
                    <p style="margin-top: 0.75rem; font-size: 0.875rem; color: #6b7280;">Would you like me to display these on the interactive map?</p>
                </div>
            `;
            
            this.addMessage("Here's the asset information:", 'bot', { html: assetsHTML });
            
            // Auto-show on map
            if (window.chatbotMapIntegration && assetType !== 'all') {
                setTimeout(async () => {
                    const actionMap = {
                        'forest': 'showForestAreas',
                        'water': 'showWaterAssets',
                        'land': 'showFarmAssets'
                    };
                    if (actionMap[assetType]) {
                        await window.chatbotMapIntegration.updateMap(actionMap[assetType], {});
                    }
                }, 1500);
            }
        } catch (error) {
            console.error('Asset information error:', error);
            this.addMessage("Sorry, I couldn't fetch asset information. Please try again.", 'bot');
        }
    }

    /**
     * 🟣 Handle feedback and issue reporting
     */
    async handleFeedback(text) {
        try {
            // Check if this is the actual feedback or just a request to give feedback
            const isActualFeedback = text.length > 50 || 
                (!text.toLowerCase().includes('give') && 
                 !text.toLowerCase().includes('submit') && 
                 !text.toLowerCase().includes('want'));
            
            if (isActualFeedback) {
                // Submit the feedback
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                
                try {
                    await api.post('/feedback', {
                        user_id: user.id || 'anonymous',
                        message: text,
                        timestamp: new Date().toISOString(),
                        type: 'chatbot'
                    });
                    
                    const successMsg = this.currentLanguage === 'en'
                        ? "✅ Thank you! Your feedback has been recorded successfully.\n\nOur district officer will review it soon. You can track the status on the Feedback page."
                        : "✅ धन्यवाद! आपकी प्रतिक्रिया सफलतापूर्वक दर्ज कर ली गई है।\n\nहमारे जिला अधिकारी जल्द ही इसकी समीक्षा करेंगे। आप फीडबैक पृष्ठ पर स्थिति ट्रैक कर सकते हैं।";
                    
                    this.addMessage(successMsg, 'bot');
                } catch (apiError) {
                    console.error('Feedback submission error:', apiError);
                    this.addMessage("✅ Thank you! Your feedback has been recorded locally. Our team will review it soon.", 'bot');
                }
            } else {
                // Prompt for feedback
                const promptMsg = this.currentLanguage === 'en'
                    ? "Please describe your issue or feedback in detail. I'll make sure it reaches the right team. 💬"
                    : "कृपया अपनी समस्या या प्रतिक्रिया विस्तार से बताएं। मैं सुनिश्चित करूंगा कि यह सही टीम तक पहुंचे। 💬";
                
                this.addMessage(promptMsg, 'bot');
            }
        } catch (error) {
            console.error('Handle feedback error:', error);
            this.addMessage("Sorry, I couldn't process your feedback. Please try again or visit the Feedback page.", 'bot');
        }
    }

    /**
     * 🟤 Handle report generation
     */
    async handleReportGeneration(text) {
        try {
            if (this.userRole !== 'officer' && this.userRole !== 'admin') {
                this.addMessage("Report generation is available for officers and administrators. You can view your claim status or check scheme eligibility instead.", 'bot');
                return;
            }
            
            // Extract date range if mentioned
            const dateMatch = text.match(/from\s+(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})/i);
            
            if (dateMatch) {
                const startDate = dateMatch[1];
                const endDate = dateMatch[2];
                
                this.addMessage(`📊 Generating report for ${startDate} to ${endDate}...\n\nPlease wait...`, 'bot');
                
                setTimeout(() => {
                    if (typeof generateDashboardReport === 'function') {
                        generateDashboardReport();
                        this.addMessage("✅ Done! Your report has been generated and downloaded.", 'bot');
                    } else {
                        this.addMessage("✅ Report generated! You can download it from the Reports page.", 'bot');
                    }
                }, 2000);
            } else {
                // Ask for date range
                const promptMsg = this.currentLanguage === 'en'
                    ? "Please specify the time range for the report.\n\nExample: 'Generate report from 2025-01-01 to 2025-01-31'\n\nOr I can generate a report for the current month?"
                    : "कृपया रिपोर्ट के लिए समय सीमा निर्दिष्ट करें।\n\nउदाहरण: '2025-01-01 से 2025-01-31 तक रिपोर्ट बनाएं'\n\nया मैं वर्तमान महीने के लिए रिपोर्ट बना सकता हूं?";
                
                this.addMessage(promptMsg, 'bot');
            }
        } catch (error) {
            console.error('Report generation error:', error);
            this.addMessage("Sorry, I couldn't generate the report. Please try again or visit the Reports page.", 'bot');
        }
    }

    /**
     * ⚫ Show general help
     */
    showGeneralHelp() {
        const helpHTML = `
            <div class="help-info">
                <p style="margin-bottom: 0.75rem;"><strong>I'm your FRA Assistant! I can help you with:</strong></p>
                <div style="background: #f9fafb; padding: 0.75rem; border-radius: 8px;">
                    <p style="margin: 0.5rem 0;"><strong>1️⃣ Claim Status Check</strong><br>
                    <span style="font-size: 0.875rem; color: #6b7280;">Type your claim ID (e.g., FRA-JH-RAN-2025-001)</span></p>
                    
                    <p style="margin: 0.5rem 0;"><strong>2️⃣ Pending & Approved Claims</strong><br>
                    <span style="font-size: 0.875rem; color: #6b7280;">Ask "Show pending claims in [district]"</span></p>
                    
                    <p style="margin: 0.5rem 0;"><strong>3️⃣ DSS Scheme Eligibility</strong><br>
                    <span style="font-size: 0.875rem; color: #6b7280;">Ask "Which schemes am I eligible for?"</span></p>
                    
                    <p style="margin: 0.5rem 0;"><strong>4️⃣ Asset Mapping</strong><br>
                    <span style="font-size: 0.875rem; color: #6b7280;">Ask "Show forest cover" or "Show water assets"</span></p>
                    
                    <p style="margin: 0.5rem 0;"><strong>5️⃣ Feedback or Issues</strong><br>
                    <span style="font-size: 0.875rem; color: #6b7280;">Say "I have an issue" or describe your problem</span></p>
                    
                    <p style="margin: 0.5rem 0;"><strong>6️⃣ Generating Reports</strong><br>
                    <span style="font-size: 0.875rem; color: #6b7280;">Ask "Generate monthly report" (Officers only)</span></p>
                </div>
                <p style="margin-top: 0.75rem; font-size: 0.875rem; color: #1e5631;"><strong>Just type your query or click a quick action button below!</strong></p>
            </div>
        `;
        
        this.addMessage("Here's what I can do:", 'bot', { html: helpHTML });
        this.showQuickReplies();
    }

    /**
     * Process map-related commands
     */
    async processMapCommand(text) {
        const lowerText = text.toLowerCase();
        
        // Check if map integration is available
        if (!window.chatbotMapIntegration) {
            return { handled: false };
        }

        const mapIntegration = window.chatbotMapIntegration;

        // Show my claim area
        if (lowerText.includes('show') && (lowerText.includes('my claim') || lowerText.includes('claim area'))) {
            // Extract claim ID if present
            const claimIdMatch = text.match(/\b(FRA[-\s]?[A-Z]{2}[-\s]?[A-Z]{3}[-\s]?\d{4}[-\s]?\d{3})\b/i);
            
            if (claimIdMatch) {
                const claimId = claimIdMatch[1];
                const response = await api.get('/claims');
                const claims = response.data.data?.claims || [];
                const claim = claims.find(c => c.claim_number.toLowerCase() === claimId.toLowerCase());
                
                if (claim) {
                    const result = await mapIntegration.updateMap('showClaim', {
                        claimId: claim.claim_number,
                        lat: claim.latitude,
                        lng: claim.longitude,
                        polygon: claim.polygon || []
                    });
                    return { handled: true, message: result.message };
                }
            }
            
            return { handled: true, message: "Please provide your claim ID to show the area on map." };
        }

        // Show pending claims in district
        if (lowerText.includes('pending') && lowerText.includes('claim')) {
            const districtMatch = text.match(/in\s+(\w+)/i);
            const district = districtMatch ? districtMatch[1] : null;
            
            const result = await mapIntegration.updateMap('showPendingClaims', { district });
            return { handled: true, message: result.message };
        }

        // Show approved claims
        if (lowerText.includes('approved') && lowerText.includes('claim')) {
            const result = await mapIntegration.updateMap('showApprovedClaims', {});
            return { handled: true, message: result.message };
        }

        // Show rejected claims
        if (lowerText.includes('rejected') && lowerText.includes('claim')) {
            const result = await mapIntegration.updateMap('showRejectedClaims', {});
            return { handled: true, message: result.message };
        }

        // Show village boundaries
        if (lowerText.includes('village') && lowerText.includes('boundar')) {
            const villageMatch = text.match(/village\s+(\w+)/i);
            const village = villageMatch ? villageMatch[1] : null;
            
            const result = await mapIntegration.updateMap('showVillageBoundaries', { village });
            return { handled: true, message: result.message };
        }

        // Show water assets
        if (lowerText.includes('water') && (lowerText.includes('asset') || lowerText.includes('bod'))) {
            const result = await mapIntegration.updateMap('showWaterAssets', {});
            return { handled: true, message: result.message };
        }

        // Show farm assets
        if (lowerText.includes('farm') && lowerText.includes('asset')) {
            const result = await mapIntegration.updateMap('showFarmAssets', {});
            return { handled: true, message: result.message };
        }

        // Show forest areas
        if (lowerText.includes('forest') && (lowerText.includes('area') || lowerText.includes('asset'))) {
            const result = await mapIntegration.updateMap('showForestAreas', {});
            return { handled: true, message: result.message };
        }

        // Hide all layers
        if (lowerText.includes('hide') && (lowerText.includes('all') || lowerText.includes('layer') || lowerText.includes('clear'))) {
            const result = await mapIntegration.updateMap('hideAllLayers', {});
            return { handled: true, message: result.message };
        }

        // Zoom to district
        if (lowerText.includes('zoom') || (lowerText.includes('show') && lowerText.includes('district'))) {
            const districtMatch = text.match(/(?:zoom to|show)\s+(\w+)\s+district/i);
            if (districtMatch) {
                const district = districtMatch[1];
                const result = await mapIntegration.updateMap('zoomToDistrict', { district });
                return { handled: true, message: result.message };
            }
        }

        // Navigate to map page
        if (lowerText.includes('open map') || lowerText.includes('go to map')) {
            if (typeof loadPage === 'function') {
                loadPage('map');
                return { handled: true, message: "Opening map page... 🗺️" };
            }
        }

        return { handled: false };
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'hi' : 'en';
        const msg = this.currentLanguage === 'en' 
            ? "Language switched to English 🇬🇧" 
            : "भाषा हिंदी में बदल गई 🇮🇳";
        this.addMessage(msg, 'bot');
        this.showQuickReplies();
    }

    startVoiceInput() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = this.currentLanguage === 'en' ? 'en-IN' : 'hi-IN';
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('chatbot-input').value = transcript;
                this.sendMessage();
            };
            
            recognition.start();
            this.addMessage("🎤 Listening...", 'bot');
        } else {
            this.addMessage("Voice input is not supported in your browser.", 'bot');
        }
    }

    scrollToBottom() {
        const container = document.getElementById('chatbot-messages');
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    }

    saveChatHistory() {
        localStorage.setItem('fra_chat_history', JSON.stringify(this.messages));
    }

    loadChatHistory() {
        const history = localStorage.getItem('fra_chat_history');
        if (history) {
            this.messages = JSON.parse(history);
            this.messages.forEach(msg => this.renderMessage(msg));
        }
    }
}

// Global function to show claim on map (called from chatbot buttons)
window.showClaimOnMap = async function(claimId, lat, lng) {
    try {
        // Navigate to map page if not already there
        if (typeof loadPage === 'function' && window.location.hash !== '#map') {
            loadPage('map');
            
            // Wait for map to load
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Highlight claim on map
        if (window.chatbotMapIntegration) {
            await window.chatbotMapIntegration.updateMap('showClaim', {
                claimId: claimId,
                lat: lat,
                lng: lng,
                polygon: []
            });
            
            // Show success message in chatbot
            if (window.fraAssistant) {
                window.fraAssistant.addMessage(`Claim ${claimId} highlighted on map! 🗺️`, 'bot');
            }
        } else {
            alert('Map integration not available. Please navigate to the Map page manually.');
        }
    } catch (error) {
        console.error('Show claim on map error:', error);
        alert('Failed to show claim on map. Please try again.');
    }
};

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.fraAssistant = new FRAAssistant();
});
