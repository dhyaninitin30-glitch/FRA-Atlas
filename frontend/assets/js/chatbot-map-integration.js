// Chatbot ↔ Leaflet Map Integration
class ChatbotMapIntegration {
    constructor() {
        this.map = null;
        this.claimsLayer = null;
        this.markersLayer = null;
        this.polygonsLayer = null;
        this.assetsLayer = null;
        this.init();
    }

    init() {
        // Wait for map to be initialized
        const checkMap = setInterval(() => {
            if (window.map) {
                this.map = window.map;
                this.setupLayers();
                clearInterval(checkMap);
                console.log('✅ Chatbot-Map integration initialized');
            }
        }, 500);
    }

    setupLayers() {
        // Create dedicated layers for chatbot-controlled elements
        this.markersLayer = L.layerGroup().addTo(this.map);
        this.polygonsLayer = L.layerGroup().addTo(this.map);
        this.assetsLayer = L.layerGroup().addTo(this.map);
    }

    /**
     * Main update function called by chatbot
     * @param {string} action - The action to perform
     * @param {object} data - Data for the action
     */
    async updateMap(action, data) {
        if (!this.map) {
            console.error('Map not initialized');
            return { success: false, message: 'Map not ready' };
        }

        const actions = {
            'showClaim': () => this.showClaimArea(data),
            'showPendingClaims': () => this.showPendingClaims(data),
            'showApprovedClaims': () => this.showApprovedClaims(),
            'showRejectedClaims': () => this.showRejectedClaims(),
            'showVillageBoundaries': () => this.showVillageBoundaries(data),
            'showWaterAssets': () => this.showAssets('water'),
            'showFarmAssets': () => this.showAssets('farm'),
            'showForestAreas': () => this.showAssets('forest'),
            'hideAllLayers': () => this.hideAllLayers(),
            'zoomToDistrict': () => this.zoomToDistrict(data),
            'highlightClaim': () => this.highlightClaim(data)
        };

        if (actions[action]) {
            return await actions[action]();
        } else {
            return { success: false, message: 'Unknown action' };
        }
    }

    /**
     * Show specific claim area on map
     */
    async showClaimArea(data) {
        try {
            const { claimId, lat, lng, polygon } = data;
            
            // Clear previous layers
            this.markersLayer.clearLayers();
            this.polygonsLayer.clearLayers();

            if (polygon && polygon.length > 0) {
                // Draw polygon
                const poly = L.polygon(polygon, {
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.3,
                    weight: 3
                }).addTo(this.polygonsLayer);

                // Add popup
                poly.bindPopup(`
                    <div style="padding: 0.5rem;">
                        <strong>Claim: ${claimId}</strong><br>
                        <span style="color: #3b82f6;">● Your Claim Area</span>
                    </div>
                `);

                // Zoom to polygon
                this.map.fitBounds(poly.getBounds(), { padding: [50, 50] });
            } else if (lat && lng) {
                // Add marker
                const marker = L.marker([lat, lng], {
                    icon: L.divIcon({
                        className: 'custom-claim-marker',
                        html: '<div style="background: #3b82f6; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
                        iconSize: [30, 30]
                    })
                }).addTo(this.markersLayer);

                marker.bindPopup(`
                    <div style="padding: 0.5rem;">
                        <strong>Claim: ${claimId}</strong><br>
                        <span style="color: #3b82f6;">● Your Claim Location</span>
                    </div>
                `).openPopup();

                // Zoom to marker
                this.map.setView([lat, lng], 14);
            }

            return { 
                success: true, 
                message: `Claim area highlighted on map 🗺️` 
            };
        } catch (error) {
            console.error('Show claim area error:', error);
            return { success: false, message: 'Failed to show claim area' };
        }
    }

    /**
     * Show pending claims for a district
     */
    async showPendingClaims(data) {
        try {
            const { district } = data;
            
            // Fetch claims from API
            const response = await api.get('/claims');
            const claims = response.data.data?.claims || [];
            
            // Filter pending claims
            let pendingClaims = claims.filter(c => 
                c.status === 'pending' || c.status === 'under_review'
            );
            
            // Filter by district if specified
            if (district) {
                pendingClaims = pendingClaims.filter(c => 
                    c.district.toLowerCase() === district.toLowerCase()
                );
            }

            // Clear previous markers
            this.markersLayer.clearLayers();

            // Add markers for each pending claim
            pendingClaims.forEach(claim => {
                if (claim.latitude && claim.longitude) {
                    const marker = L.circleMarker([claim.latitude, claim.longitude], {
                        radius: 8,
                        fillColor: '#f59e0b',
                        color: '#ffffff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(this.markersLayer);

                    marker.bindPopup(`
                        <div style="padding: 0.5rem;">
                            <strong>${claim.claim_number}</strong><br>
                            <strong>Applicant:</strong> ${claim.applicant_name}<br>
                            <strong>Village:</strong> ${claim.village}<br>
                            <strong>Status:</strong> <span style="color: #f59e0b;">⏳ ${claim.status}</span>
                        </div>
                    `);
                }
            });

            // Zoom to show all markers
            if (pendingClaims.length > 0) {
                const group = new L.featureGroup(this.markersLayer.getLayers());
                this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
            }

            return { 
                success: true, 
                message: `Displaying ${pendingClaims.length} pending claims${district ? ` in ${district} district` : ''} on the map 🗺️`,
                count: pendingClaims.length
            };
        } catch (error) {
            console.error('Show pending claims error:', error);
            return { success: false, message: 'Failed to fetch pending claims' };
        }
    }

    /**
     * Show approved claims
     */
    async showApprovedClaims() {
        try {
            const response = await api.get('/claims');
            const claims = response.data.data?.claims || [];
            const approvedClaims = claims.filter(c => c.status === 'approved');

            this.polygonsLayer.clearLayers();

            approvedClaims.forEach(claim => {
                if (claim.latitude && claim.longitude) {
                    // Create green polygon/circle for approved claims
                    const circle = L.circle([claim.latitude, claim.longitude], {
                        radius: 200,
                        color: '#10b981',
                        fillColor: '#10b981',
                        fillOpacity: 0.3,
                        weight: 2
                    }).addTo(this.polygonsLayer);

                    circle.bindPopup(`
                        <div style="padding: 0.5rem;">
                            <strong>${claim.claim_number}</strong><br>
                            <strong>Applicant:</strong> ${claim.applicant_name}<br>
                            <strong>Village:</strong> ${claim.village}<br>
                            <strong>Status:</strong> <span style="color: #10b981;">✅ Approved</span>
                        </div>
                    `);
                }
            });

            if (approvedClaims.length > 0) {
                const group = new L.featureGroup(this.polygonsLayer.getLayers());
                this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
            }

            return { 
                success: true, 
                message: `Showing ${approvedClaims.length} approved claims in green 🟢`,
                count: approvedClaims.length
            };
        } catch (error) {
            console.error('Show approved claims error:', error);
            return { success: false, message: 'Failed to fetch approved claims' };
        }
    }

    /**
     * Show rejected claims
     */
    async showRejectedClaims() {
        try {
            const response = await api.get('/claims');
            const claims = response.data.data?.claims || [];
            const rejectedClaims = claims.filter(c => c.status === 'rejected');

            this.polygonsLayer.clearLayers();

            rejectedClaims.forEach(claim => {
                if (claim.latitude && claim.longitude) {
                    const circle = L.circle([claim.latitude, claim.longitude], {
                        radius: 200,
                        color: '#ef4444',
                        fillColor: '#ef4444',
                        fillOpacity: 0.3,
                        weight: 2
                    }).addTo(this.polygonsLayer);

                    circle.bindPopup(`
                        <div style="padding: 0.5rem;">
                            <strong>${claim.claim_number}</strong><br>
                            <strong>Applicant:</strong> ${claim.applicant_name}<br>
                            <strong>Village:</strong> ${claim.village}<br>
                            <strong>Status:</strong> <span style="color: #ef4444;">❌ Rejected</span><br>
                            <strong>Reason:</strong> ${claim.remarks || 'Not specified'}
                        </div>
                    `);
                }
            });

            if (rejectedClaims.length > 0) {
                const group = new L.featureGroup(this.polygonsLayer.getLayers());
                this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
            }

            return { 
                success: true, 
                message: `Showing ${rejectedClaims.length} rejected claims in red 🔴`,
                count: rejectedClaims.length
            };
        } catch (error) {
            console.error('Show rejected claims error:', error);
            return { success: false, message: 'Failed to fetch rejected claims' };
        }
    }

    /**
     * Show village boundaries
     */
    async showVillageBoundaries(data) {
        try {
            const { village } = data;
            
            // Mock village boundary (in production, fetch from API)
            const villageBoundary = [
                [23.5, 85.3],
                [23.5, 85.4],
                [23.6, 85.4],
                [23.6, 85.3]
            ];

            this.polygonsLayer.clearLayers();

            const boundary = L.polygon(villageBoundary, {
                color: '#6366f1',
                fillColor: '#6366f1',
                fillOpacity: 0.1,
                weight: 3,
                dashArray: '10, 10'
            }).addTo(this.polygonsLayer);

            boundary.bindPopup(`
                <div style="padding: 0.5rem;">
                    <strong>Village Boundary</strong><br>
                    ${village || 'Selected Village'}
                </div>
            `);

            this.map.fitBounds(boundary.getBounds(), { padding: [50, 50] });

            return { 
                success: true, 
                message: `Village boundary displayed 🗺️` 
            };
        } catch (error) {
            console.error('Show village boundaries error:', error);
            return { success: false, message: 'Failed to show village boundaries' };
        }
    }

    /**
     * Show assets (water, farm, forest)
     */
    async showAssets(type) {
        try {
            this.assetsLayer.clearLayers();

            const assetIcons = {
                water: { icon: '💧', color: '#3b82f6', label: 'Water Body' },
                farm: { icon: '🌾', color: '#f59e0b', label: 'Farm Land' },
                forest: { icon: '🌲', color: '#10b981', label: 'Forest Area' }
            };

            const asset = assetIcons[type];
            
            // Mock asset locations (in production, fetch from API)
            const mockAssets = [
                { lat: 23.5, lng: 85.3, name: `${asset.label} 1` },
                { lat: 23.6, lng: 85.4, name: `${asset.label} 2` },
                { lat: 23.7, lng: 85.5, name: `${asset.label} 3` }
            ];

            mockAssets.forEach(assetData => {
                const marker = L.marker([assetData.lat, assetData.lng], {
                    icon: L.divIcon({
                        className: 'custom-asset-marker',
                        html: `<div style="font-size: 24px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${asset.icon}</div>`,
                        iconSize: [30, 30]
                    })
                }).addTo(this.assetsLayer);

                marker.bindPopup(`
                    <div style="padding: 0.5rem;">
                        <strong>${assetData.name}</strong><br>
                        <span style="color: ${asset.color};">${asset.icon} ${asset.label}</span>
                    </div>
                `);
            });

            return { 
                success: true, 
                message: `Showing ${type} assets on map ${asset.icon}`,
                count: mockAssets.length
            };
        } catch (error) {
            console.error('Show assets error:', error);
            return { success: false, message: 'Failed to show assets' };
        }
    }

    /**
     * Hide all chatbot-controlled layers
     */
    hideAllLayers() {
        this.markersLayer.clearLayers();
        this.polygonsLayer.clearLayers();
        this.assetsLayer.clearLayers();
        
        // Reset map view
        this.map.setView([23.6345, 85.3803], 7);

        return { 
            success: true, 
            message: 'Map cleared. All layers hidden.' 
        };
    }

    /**
     * Zoom to specific district
     */
    async zoomToDistrict(data) {
        try {
            const { district } = data;
            
            // District coordinates (mock data)
            const districtCoords = {
                'ranchi': [23.3441, 85.3096],
                'dhanbad': [23.7644, 86.4304],
                'mandla': [22.5991, 80.3714],
                'bhopal': [23.2599, 77.4126]
            };

            const coords = districtCoords[district.toLowerCase()];
            
            if (coords) {
                this.map.flyTo(coords, 10, {
                    duration: 1.5
                });

                return { 
                    success: true, 
                    message: `Zooming to ${district} district 🎯` 
                };
            } else {
                return { 
                    success: false, 
                    message: `District "${district}" not found` 
                };
            }
        } catch (error) {
            console.error('Zoom to district error:', error);
            return { success: false, message: 'Failed to zoom to district' };
        }
    }

    /**
     * Highlight specific claim with animation
     */
    async highlightClaim(data) {
        try {
            const { claimId } = data;
            
            // Fetch claim details
            const response = await api.get('/claims');
            const claims = response.data.data?.claims || [];
            const claim = claims.find(c => c.claim_number === claimId);

            if (!claim || !claim.latitude || !claim.longitude) {
                return { 
                    success: false, 
                    message: 'Claim location not found' 
                };
            }

            // Clear and add pulsing marker
            this.markersLayer.clearLayers();

            const marker = L.marker([claim.latitude, claim.longitude], {
                icon: L.divIcon({
                    className: 'pulsing-marker',
                    html: `
                        <div style="
                            width: 40px; 
                            height: 40px; 
                            background: ${getStatusColor(claim.status)}; 
                            border-radius: 50%; 
                            border: 4px solid white;
                            box-shadow: 0 0 0 0 rgba(59, 130, 246, 1);
                            animation: pulse 2s infinite;
                        "></div>
                        <style>
                            @keyframes pulse {
                                0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
                                70% { box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
                                100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                            }
                        </style>
                    `,
                    iconSize: [40, 40]
                })
            }).addTo(this.markersLayer);

            marker.bindPopup(`
                <div style="padding: 0.5rem;">
                    <strong>${claim.claim_number}</strong><br>
                    <strong>Applicant:</strong> ${claim.applicant_name}<br>
                    <strong>Village:</strong> ${claim.village}<br>
                    <strong>Status:</strong> ${claim.status}
                </div>
            `).openPopup();

            this.map.flyTo([claim.latitude, claim.longitude], 14, {
                duration: 1.5
            });

            return { 
                success: true, 
                message: `Claim ${claimId} highlighted on map 📍` 
            };
        } catch (error) {
            console.error('Highlight claim error:', error);
            return { success: false, message: 'Failed to highlight claim' };
        }
    }
}

// Helper function to get status color
function getStatusColor(status) {
    const colors = {
        'pending': '#f59e0b',
        'approved': '#10b981',
        'rejected': '#ef4444',
        'under_review': '#3b82f6'
    };
    return colors[status] || '#6b7280';
}

// Initialize map integration
let chatbotMapIntegration;
document.addEventListener('DOMContentLoaded', () => {
    chatbotMapIntegration = new ChatbotMapIntegration();
    window.chatbotMapIntegration = chatbotMapIntegration;
});
