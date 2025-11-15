/**
 * SMS Approval Feature
 * Handles SMS notifications for claim approvals/rejections
 */

// Global state
let currentSMSAction = null;
let currentSMSClaimId = null;

/**
 * Get current user role from role selector or review view
 * @returns {string} Current user role
 */
function getCurrentUserRole() {
    // First check if we're on review page with currentReviewView
    if (typeof currentReviewView !== 'undefined') {
        console.log('📍 Using currentReviewView:', currentReviewView);
        return currentReviewView; // 'district' or 'state'
    }
    
    // Fallback to roleSelector if available
    const roleSelector = document.getElementById('roleSelector');
    if (roleSelector) {
        return roleSelector.value || 'district';
    }
    
    // Default to district
    return 'district';
}

/**
 * Show SMS approval modal
 * @param {string} claimId - Claim ID
 * @param {string} action - Action type ('approve' or 'reject')
 * @param {string} defaultPhone - Default phone number
 */
function showSMSApprovalModal(claimId, action, defaultPhone = '9981486115') {
    currentSMSAction = action;
    currentSMSClaimId = claimId;
    
    // Get claim data
    const claim = reviewDatabase.find(c => c.id === claimId) || claimsDatabase.find(c => c.id === claimId);
    const phoneNumber = claim?.mobileNumber || defaultPhone;
    
    // Get user role
    const role = getCurrentUserRole();
    const roleText = role === 'state' ? 'State' : 'District';
    
    // Generate SMS preview
    let smsPreview = '';
    if (action === 'approve') {
        smsPreview = `${roleText} approval successful for Claim ${claimId}. Your FRA claim has been approved. Ministry of Tribal Affairs.`;
    } else {
        smsPreview = `${roleText} review: Claim ${claimId} requires revision. [REASON]. Ministry of Tribal Affairs.`;
    }
    
    // Create modal HTML
    const modalHTML = `
        <div class="sms-modal-overlay" id="smsModalOverlay" onclick="closeSMSApprovalModal()">
            <div class="sms-modal-content" onclick="event.stopPropagation()">
                <div class="sms-modal-header">
                    <h3>
                        <i data-lucide="${action === 'approve' ? 'check-circle' : 'x-circle'}"></i>
                        ${action === 'approve' ? 'Approve Claim with SMS' : 'Reject Claim with SMS'}
                    </h3>
                    <button class="sms-modal-close" onclick="closeSMSApprovalModal()">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                
                <div class="sms-modal-body">
                    <div class="sms-claim-info">
                        <div class="sms-info-item">
                            <span class="sms-info-label">Claim ID:</span>
                            <span class="sms-info-value">${claimId}</span>
                        </div>
                        <div class="sms-info-item">
                            <span class="sms-info-label">Action:</span>
                            <span class="sms-info-value ${action === 'approve' ? 'success' : 'error'}">
                                ${action === 'approve' ? 'Approve' : 'Reject'}
                            </span>
                        </div>
                        <div class="sms-info-item">
                            <span class="sms-info-label">Role:</span>
                            <span class="sms-info-value">${roleText} Officer</span>
                        </div>
                    </div>
                    
                    <div class="sms-form-group">
                        <label for="smsPhoneNumber">
                            <i data-lucide="phone"></i>
                            Mobile Number
                        </label>
                        <input 
                            type="tel" 
                            id="smsPhoneNumber" 
                            value="${phoneNumber}"
                            placeholder="Enter 10-digit mobile number"
                            maxlength="10"
                            pattern="[0-9]{10}"
                        >
                        <span class="sms-input-hint">SMS will be sent to this number</span>
                    </div>
                    
                    ${action === 'reject' ? `
                    <div class="sms-form-group">
                        <label for="smsRejectionReason">
                            <i data-lucide="message-square"></i>
                            Rejection Reason
                        </label>
                        <textarea 
                            id="smsRejectionReason" 
                            rows="3"
                            placeholder="Enter reason for rejection..."
                            required
                        ></textarea>
                        <span class="sms-input-hint">This will be included in the SMS</span>
                    </div>
                    ` : ''}
                    
                    <div class="sms-preview-box">
                        <div class="sms-preview-header">
                            <i data-lucide="message-circle"></i>
                            SMS Preview
                        </div>
                        <div class="sms-preview-content" id="smsPreviewContent">
                            ${smsPreview}
                        </div>
                    </div>
                    
                    <div id="smsStatusMessage" class="sms-status-message" style="display: none;"></div>
                </div>
                
                <div class="sms-modal-footer">
                    <button class="btn-sms-cancel" onclick="closeSMSApprovalModal()">
                        <i data-lucide="x"></i>
                        Cancel
                    </button>
                    <button class="btn-sms-send" id="btnSendSMS" onclick="sendApprovalSMS(event, '${claimId}', '${action}')">
                        <i data-lucide="send"></i>
                        Send SMS & ${action === 'approve' ? 'Approve' : 'Reject'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    const existingModal = document.getElementById('smsModalOverlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Update SMS preview when rejection reason changes
    if (action === 'reject') {
        const reasonTextarea = document.getElementById('smsRejectionReason');
        if (reasonTextarea) {
            reasonTextarea.addEventListener('input', function() {
                const reason = this.value || '[REASON]';
                const preview = `${roleText} review: Claim ${claimId} requires revision. ${reason}. Ministry of Tribal Affairs.`;
                document.getElementById('smsPreviewContent').textContent = preview;
            });
        }
    }
    
    console.log(`📱 SMS modal opened for ${action} action on claim ${claimId}`);
}

/**
 * Close SMS approval modal
 */
function closeSMSApprovalModal() {
    const modal = document.getElementById('smsModalOverlay');
    if (modal) {
        modal.remove();
    }
    currentSMSAction = null;
    currentSMSClaimId = null;
    console.log('📱 SMS modal closed');
}

/**
 * Send approval SMS
 * @param {Event} event - Click event
 * @param {string} claimId - Claim ID
 * @param {string} action - Action type
 */
async function sendApprovalSMS(event, claimId, action) {
    event.preventDefault();
    
    const phoneInput = document.getElementById('smsPhoneNumber');
    const sendBtn = document.getElementById('btnSendSMS');
    const statusDiv = document.getElementById('smsStatusMessage');
    
    // Get phone number
    const phoneNumber = phoneInput.value.trim();
    
    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 10) {
        showSMSStatus('Please enter a valid phone number (minimum 10 digits)', 'error');
        return;
    }
    
    // Get rejection reason if rejecting
    let reason = 'requires revision';
    if (action === 'reject') {
        const reasonTextarea = document.getElementById('smsRejectionReason');
        reason = reasonTextarea?.value.trim() || 'requires revision';
        
        if (!reasonTextarea?.value.trim()) {
            showSMSStatus('Please enter a rejection reason', 'error');
            return;
        }
    }
    
    // Disable button and show loading
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i data-lucide="loader" class="spinning"></i> Sending SMS...';
    
    try {
        // Get user role
        const role = getCurrentUserRole();
        
        // Prepare API endpoint and data
        const endpoint = action === 'approve' ? '/api/sms/approval' : '/api/sms/rejection';
        const data = {
            phoneNumber: phoneNumber,
            claimId: claimId,
            role: role
        };
        
        if (action === 'reject') {
            data.reason = reason;
        }
        
        console.log(`📤 Sending ${action} SMS:`, data);
        
        // Send SMS via API
        const response = await fetch(`http://localhost:5001${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success message
            showSMSStatus(`✅ Claim ${action}d and SMS sent successfully!`, 'success');
            
            // Update claim status in UI based on role and action
            const newStatus = action === 'approve' 
                ? (role === 'district' ? 'state-review' : 'approved')
                : 'rejected';
            updateClaimStatusInUI(claimId, newStatus, role, action);
            
            // 🎯 If State Officer approved, show asset creation message
            if (action === 'approve' && role === 'state') {
                console.log('🎉 State approval complete! Asset should be created.');
                
                // Show immediate notification
                showSMSStatus(`✅ Claim approved! Creating asset...`, 'success');
                
                // Show asset created notification after 1 second
                setTimeout(() => {
                    if (typeof showToast === 'function') {
                        showToast(`🏗️ Asset created from approved claim ${claimId}!`, 'success');
                    }
                    // Also show in SMS modal
                    showSMSStatus(`✅ Claim approved and Asset created successfully!`, 'success');
                }, 1000);
            }
            
            // Close modal after 2 seconds
            setTimeout(() => {
                closeSMSApprovalModal();
                
                // Refresh review table if on review page
                if (typeof populateReviewTable === 'function') {
                    console.log('🔄 Refreshing review table after approval...');
                    // Pass null to force refresh from reviewDatabase
                    populateReviewTable(null);
                    console.log('✅ Review table refreshed');
                }
                
                // Also refresh analytics
                if (typeof updateReviewAnalytics === 'function') {
                    updateReviewAnalytics();
                }
                
                // Refresh assets table if on assets page
                if (typeof populateAssetsTable === 'function' && action === 'approve' && role === 'state') {
                    console.log('🔄 Refreshing assets table...');
                    populateAssetsTable();
                }
                
                // Show toast notification
                if (typeof showToast === 'function') {
                    showToast(`Claim ${claimId} ${action}d successfully!`, 'success');
                    
                    // Show asset creation notification for state approval
                    if (action === 'approve' && role === 'state') {
                        setTimeout(() => {
                            showToast(`🏗️ Asset created and added to Assets Inventory!`, 'success');
                        }, 1500);
                    }
                }
                
                // Also show browser alert for state approval
                if (action === 'approve' && role === 'state') {
                    setTimeout(() => {
                        alert('✅ Claim Approved!\n🏗️ Asset Created Successfully!\n📦 Check Assets Inventory section');
                    }, 2500);
                }
            }, 2000);
            
            console.log('✅ SMS sent successfully:', result);
            
        } else {
            throw new Error(result.error || 'Failed to send SMS');
        }
        
    } catch (error) {
        console.error('❌ SMS sending failed:', error);
        showSMSStatus(`Failed to send SMS: ${error.message}`, 'error');
        
        // Re-enable button
        sendBtn.disabled = false;
        sendBtn.innerHTML = `<i data-lucide="send"></i> Send SMS & ${action === 'approve' ? 'Approve' : 'Reject'}`;
        
        // Refresh icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

/**
 * Show SMS status message
 * @param {string} message - Status message
 * @param {string} type - Message type ('success' or 'error')
 */
function showSMSStatus(message, type) {
    const statusDiv = document.getElementById('smsStatusMessage');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = `sms-status-message ${type}`;
        statusDiv.style.display = 'block';
    }
}

/**
 * Update claim status in UI
 * @param {string} claimId - Claim ID
 * @param {string} newStatus - New status
 * @param {string} role - User role
 * @param {string} action - Action performed
 */
function updateClaimStatusInUI(claimId, newStatus, role, action) {
    const currentDate = new Date().toISOString().split('T')[0];
    const currentUser = role === 'district' ? 'District Officer' : 'State Officer';
    
    // Update in reviewDatabase
    const reviewClaim = reviewDatabase.find(c => c.id === claimId);
    if (reviewClaim) {
        console.log(`📝 Updating claim ${claimId} status from "${reviewClaim.status}" to "${newStatus}"`);
        reviewClaim.status = newStatus;
        
        // Update timeline
        if (action === 'approve') {
            if (role === 'district') {
                // District approval - move to state review
                if (!reviewClaim.timeline.includes('district-review')) {
                    reviewClaim.timeline.push('district-review');
                }
                if (!reviewClaim.timeline.includes('state-review')) {
                    reviewClaim.timeline.push('state-review');
                }
            } else {
                // State approval - final approval
                if (!reviewClaim.timeline.includes('approved')) {
                    reviewClaim.timeline.push('approved');
                }
                
                // 🎯 CREATE ASSET FROM APPROVED CLAIM (State Level Only)
                console.log('🏗️ Creating asset from state-approved claim:', claimId);
                if (typeof createAssetFromClaim === 'function') {
                    const createdAsset = createAssetFromClaim(reviewClaim);
                    console.log('✅ Asset created successfully from claim:', claimId);
                    
                    // Show visual notification
                    if (typeof showAssetCreatedNotification === 'function' && createdAsset) {
                        setTimeout(() => {
                            showAssetCreatedNotification(claimId, createdAsset.id || 'AST-NEW');
                        }, 2500);
                    }
                } else {
                    console.warn('⚠️ createAssetFromClaim function not found');
                }
            }
        } else if (action === 'reject') {
            if (!reviewClaim.timeline.includes('rejected')) {
                reviewClaim.timeline.push('rejected');
            }
        }
        
        // Add to review history
        if (!reviewClaim.reviewHistory) {
            reviewClaim.reviewHistory = [];
        }
        reviewClaim.reviewHistory.push({
            action: action,
            by: currentUser,
            date: currentDate,
            notes: `${action === 'approve' ? 'Approved' : 'Rejected'} via SMS notification`
        });
    }
    
    // Update in claimsDatabase
    const claim = claimsDatabase.find(c => c.id === claimId);
    if (claim) {
        claim.status = newStatus;
        
        // Update timeline
        if (action === 'approve') {
            if (role === 'district') {
                if (!claim.timeline.includes('district-review')) {
                    claim.timeline.push('district-review');
                }
                if (!claim.timeline.includes('state-review')) {
                    claim.timeline.push('state-review');
                }
            } else {
                if (!claim.timeline.includes('approved')) {
                    claim.timeline.push('approved');
                }
                
                // 🎯 CREATE ASSET FROM APPROVED CLAIM (State Level Only)
                console.log('🏗️ Creating asset from state-approved claim (claimsDatabase):', claimId);
                if (typeof createAssetFromClaim === 'function') {
                    createAssetFromClaim(claim);
                    console.log('✅ Asset created successfully from claim:', claimId);
                }
            }
        } else if (action === 'reject') {
            if (!claim.timeline.includes('rejected')) {
                claim.timeline.push('rejected');
            }
        }
    }
    
    console.log(`✅ Claim ${claimId} status updated to: ${newStatus} by ${currentUser}`);
}

/**
 * Wrapper function for approve with SMS
 * @param {string} claimId - Claim ID
 * @param {string} defaultPhone - Default phone number
 */
function approveClaimWithSMS(claimId, defaultPhone) {
    showSMSApprovalModal(claimId, 'approve', defaultPhone);
}

/**
 * Wrapper function for reject with SMS
 * @param {string} claimId - Claim ID
 * @param {string} defaultPhone - Default phone number
 */
function rejectClaimWithSMS(claimId, defaultPhone) {
    showSMSApprovalModal(claimId, 'reject', defaultPhone);
}

console.log('📱 SMS Approval module loaded');
