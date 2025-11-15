/**
 * Asset Creation Notification System
 * Shows prominent notification when asset is created
 */

/**
 * Show asset creation notification
 * @param {string} claimId - Claim ID
 * @param {string} assetId - Asset ID
 */
function showAssetCreatedNotification(claimId, assetId) {
    // Create notification HTML
    const notificationHTML = `
        <div class="asset-notification-overlay" id="assetNotificationOverlay">
            <div class="asset-notification-card">
                <div class="asset-notification-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                <h2 class="asset-notification-title">✅ Claim Approved!</h2>
                <p class="asset-notification-message">
                    🏗️ Asset Created Successfully
                </p>
                <div class="asset-notification-details">
                    <div class="asset-detail-item">
                        <span class="asset-detail-label">Claim ID:</span>
                        <span class="asset-detail-value">${claimId}</span>
                    </div>
                    <div class="asset-detail-item">
                        <span class="asset-detail-label">Asset ID:</span>
                        <span class="asset-detail-value">${assetId}</span>
                    </div>
                </div>
                <p class="asset-notification-info">
                    📦 Asset has been added to Assets Inventory
                </p>
                <button class="asset-notification-btn" onclick="closeAssetNotification()">
                    Got it!
                </button>
            </div>
        </div>
    `;

    // Add to page
    const existingNotification = document.getElementById('assetNotificationOverlay');
    if (existingNotification) {
        existingNotification.remove();
    }

    document.body.insertAdjacentHTML('beforeend', notificationHTML);

    // Add styles if not already added
    if (!document.getElementById('assetNotificationStyles')) {
        const styles = `
            <style id="assetNotificationStyles">
                .asset-notification-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease-in-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .asset-notification-card {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    max-width: 500px;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.4s ease-out;
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .asset-notification-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 20px;
                    color: #10b981;
                    animation: checkmark 0.6s ease-in-out;
                }

                @keyframes checkmark {
                    0% {
                        transform: scale(0);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.2);
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                .asset-notification-title {
                    font-size: 28px;
                    color: #1f2937;
                    margin-bottom: 10px;
                    font-weight: 700;
                }

                .asset-notification-message {
                    font-size: 20px;
                    color: #10b981;
                    margin-bottom: 25px;
                    font-weight: 600;
                }

                .asset-notification-details {
                    background: #f3f4f6;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                }

                .asset-detail-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #e5e7eb;
                }

                .asset-detail-item:last-child {
                    border-bottom: none;
                }

                .asset-detail-label {
                    font-weight: 600;
                    color: #6b7280;
                }

                .asset-detail-value {
                    font-weight: 700;
                    color: #1f2937;
                    font-family: 'Courier New', monospace;
                }

                .asset-notification-info {
                    font-size: 16px;
                    color: #6b7280;
                    margin-bottom: 25px;
                }

                .asset-notification-btn {
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 15px 40px;
                    border-radius: 10px;
                    font-size: 18px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .asset-notification-btn:hover {
                    background: #059669;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    console.log('🎉 Asset creation notification shown');
}

/**
 * Close asset notification
 */
function closeAssetNotification() {
    const notification = document.getElementById('assetNotificationOverlay');
    if (notification) {
        notification.style.animation = 'fadeOut 0.3s ease-in-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

// Add fadeOut animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(fadeOutStyle);

console.log('📦 Asset notification system loaded');
