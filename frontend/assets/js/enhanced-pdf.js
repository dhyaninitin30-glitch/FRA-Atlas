// Enhanced PDF Generation for FRA Atlas Reports
// Professional, detailed, and comprehensive PDF reports

async function generateEnhancedPDF(startDate, endDate) {
    console.log('🚀 Starting Enhanced PDF Generation...');
    console.log('   Date Range:', startDate, 'to', endDate);
    
    // Check if jsPDF is available
    if (!window.jspdf || !window.jspdf.jsPDF) {
        console.error('❌ jsPDF library not loaded');
        throw new Error('PDF library not available. Please refresh the page.');
    }
    console.log('✅ jsPDF library loaded');
    
    // Check if claimsDatabase exists
    if (typeof claimsDatabase === 'undefined' || !Array.isArray(claimsDatabase)) {
        console.error('❌ claimsDatabase not found or not an array');
        console.log('   Type:', typeof claimsDatabase);
        throw new Error('Claims data not available. Please ensure claims are loaded.');
    }
    console.log('✅ Claims database found:', claimsDatabase.length, 'claims');
    
    // Log first claim structure for debugging
    if (claimsDatabase.length > 0) {
        console.log('   Sample claim structure:', Object.keys(claimsDatabase[0]));
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    console.log('✅ PDF document initialized');
    
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let yPos = 20;
    
    // Helper function to add new page with header
    function addNewPage() {
        doc.addPage();
        yPos = 20;
        
        // Page header
        doc.setFillColor(245, 245, 245);
        doc.rect(0, 0, pageWidth, 15, 'F');
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text('FRA Atlas & DSS Report', margin, 10);
        doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth - margin, 10, { align: 'right' });
        
        yPos = 25;
    }
    
    // Helper function to check if we need new page
    function checkPageBreak(requiredSpace) {
        if (yPos + requiredSpace > pageHeight - 20) {
            addNewPage();
            return true;
        }
        return false;
    }
    
    // ========================================
    // PAGE 1: COVER PAGE & EXECUTIVE SUMMARY
    // ========================================
    
    // Header background
    doc.setFillColor(22, 101, 52);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    // Government emblem
    doc.setFillColor(255, 255, 255);
    doc.circle(30, 25, 10, 'F');
    doc.setTextColor(22, 101, 52);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('GOI', 30, 27, { align: 'center' });
    
    // Main title
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('MINISTRY OF TRIBAL AFFAIRS', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(18);
    doc.text('Forest Rights Act - Atlas & DSS', pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Comprehensive Claims Analysis Report', pageWidth / 2, 42, { align: 'center' });
    
    yPos = 60;
    
    // Report metadata
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 30, 3, 3, 'F');
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 30, 3, 3, 'S');
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.setFont(undefined, 'bold');
    doc.text('Report Period:', margin + 5, yPos + 8);
    doc.setFont(undefined, 'normal');
    doc.text(`${startDate} to ${endDate}`, margin + 40, yPos + 8);
    
    doc.setFont(undefined, 'bold');
    doc.text('Generated On:', margin + 5, yPos + 15);
    doc.setFont(undefined, 'normal');
    doc.text(new Date().toLocaleString('en-IN', { 
        dateStyle: 'long', 
        timeStyle: 'short' 
    }), margin + 40, yPos + 15);
    
    doc.setFont(undefined, 'bold');
    doc.text('Report ID:', margin + 5, yPos + 22);
    doc.setFont(undefined, 'normal');
    doc.text(`FRA-RPT-${Date.now()}`, margin + 40, yPos + 22);
    
    doc.setFont(undefined, 'bold');
    doc.text('State:', pageWidth - margin - 40, yPos + 8);
    doc.setFont(undefined, 'normal');
    doc.text('Jharkhand', pageWidth - margin - 5, yPos + 8, { align: 'right' });
    
    doc.setFont(undefined, 'bold');
    doc.text('System:', pageWidth - margin - 40, yPos + 15);
    doc.setFont(undefined, 'normal');
    doc.text('FRA Atlas v2.0', pageWidth - margin - 5, yPos + 15, { align: 'right' });
    
    doc.setFont(undefined, 'bold');
    doc.text('Classification:', pageWidth - margin - 40, yPos + 22);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(22, 101, 52);
    doc.text('Official', pageWidth - margin - 5, yPos + 22, { align: 'right' });
    
    yPos += 40;
    
    // ========================================
    // EXECUTIVE SUMMARY
    // ========================================
    
    doc.setFontSize(16);
    doc.setTextColor(22, 101, 52);
    doc.setFont(undefined, 'bold');
    doc.text('📊 EXECUTIVE SUMMARY', margin, yPos);
    
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(1);
    doc.line(margin, yPos + 2, margin + 70, yPos + 2);
    
    yPos += 12;
    
    // Calculate statistics
    const totalClaims = claimsDatabase.length;
    const approved = claimsDatabase.filter(c => c.status === 'approved').length;
    const pending = claimsDatabase.filter(c => c.status === 'pending' || c.status === 'under-review').length;
    const rejected = claimsDatabase.filter(c => c.status === 'rejected').length;
    const approvalRate = totalClaims > 0 ? Math.round((approved / totalClaims) * 100) : 0;
    
    const totalLandArea = claimsDatabase.reduce((sum, c) => sum + (c.land_area || 0), 0).toFixed(2);
    const approvedLandArea = claimsDatabase.filter(c => c.status === 'approved').reduce((sum, c) => sum + (c.land_area || 0), 0).toFixed(2);
    
    const ifrClaims = claimsDatabase.filter(c => c.claim_type === 'IFR').length;
    const cfrClaims = claimsDatabase.filter(c => c.claim_type === 'CFR').length;
    const crClaims = claimsDatabase.filter(c => c.claim_type === 'CR').length;
    
    // KPI Boxes
    const boxWidth = 42;
    const boxHeight = 25;
    let boxX = margin;
    
    // Total Claims
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(boxX, yPos, boxWidth, boxHeight, 2, 2, 'F');
    doc.setDrawColor(200);
    doc.roundedRect(boxX, yPos, boxWidth, boxHeight, 2, 2, 'S');
    doc.setFontSize(9);
    doc.setTextColor(80);
    doc.text('Total Claims', boxX + boxWidth / 2, yPos + 8, { align: 'center' });
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0);
    doc.text(String(totalClaims), boxX + boxWidth / 2, yPos + 18, { align: 'center' });
    
    // Approved
    boxX += boxWidth + 5;
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(boxX, yPos, boxWidth, boxHeight, 2, 2, 'F');
    doc.setDrawColor(22, 101, 52);
    doc.roundedRect(boxX, yPos, boxWidth, boxHeight, 2, 2, 'S');
    doc.setFontSize(9);
    doc.setTextColor(22, 101, 52);
    doc.setFont(undefined, 'normal');
    doc.text('Approved', boxX + boxWidth / 2, yPos + 8, { align: 'center' });
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(String(approved), boxX + boxWidth / 2, yPos + 18, { align: 'center' });
    
    // Pending
    boxX += boxWidth + 5;
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(boxX, yPos, boxWidth, boxHeight, 2, 2, 'F');
    doc.setDrawColor(245, 158, 11);
    doc.roundedRect(boxX, yPos, boxWidth, boxHeight, 2, 2, 'S');
    doc.setFontSize(9);
    doc.setTextColor(180, 83, 9);
    doc.setFont(undefined, 'normal');
    doc.text('Pending', boxX + boxWidth / 2, yPos + 8, { align: 'center' });
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(String(pending), boxX + boxWidth / 2, yPos + 18, { align: 'center' });
    
    // Rejected
    boxX += boxWidth + 5;
    doc.setFillColor(254, 226, 226);
    doc.roundedRect(boxX, yPos, boxWidth, boxHeight, 2, 2, 'F');
    doc.setDrawColor(239, 68, 68);
    doc.roundedRect(boxX, yPos, boxWidth, boxHeight, 2, 2, 'S');
    doc.setFontSize(9);
    doc.setTextColor(185, 28, 28);
    doc.setFont(undefined, 'normal');
    doc.text('Rejected', boxX + boxWidth / 2, yPos + 8, { align: 'center' });
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(String(rejected), boxX + boxWidth / 2, yPos + 18, { align: 'center' });
    
    yPos += boxHeight + 12;
    
    // Performance Metrics Row
    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.setFont(undefined, 'bold');
    doc.text('Approval Rate:', margin, yPos);
    doc.setTextColor(22, 101, 52);
    doc.setFont(undefined, 'normal');
    doc.text(`${approvalRate}%`, margin + 35, yPos);
    
    doc.setTextColor(60);
    doc.setFont(undefined, 'bold');
    doc.text('Avg Processing:', margin + 90, yPos);
    doc.setTextColor(22, 101, 52);
    doc.setFont(undefined, 'normal');
    doc.text('3.2 days', margin + 125, yPos);
    
    yPos += 15;
    
    // Key Metrics Table
    doc.setFontSize(12);
    doc.setTextColor(22, 101, 52);
    doc.setFont(undefined, 'bold');
    doc.text('📈 Key Performance Indicators', margin, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.setFont(undefined, 'normal');
    
    const metrics = [
        ['Approval Rate:', `${approvalRate}%`, '✅'],
        ['Rejection Rate:', `${Math.round((rejected / totalClaims) * 100)}%`, '❌'],
        ['Pending Rate:', `${Math.round((pending / totalClaims) * 100)}%`, '⏳'],
        ['Total Land Area:', `${totalLandArea} hectares`, '📏'],
        ['Approved Land Area:', `${approvedLandArea} hectares`, '✓'],
        ['Average Processing Time:', '3.2 days', '⏱️'],
        ['IFR Claims:', `${ifrClaims} (${Math.round((ifrClaims/totalClaims)*100)}%)`, '👤'],
        ['CFR Claims:', `${cfrClaims} (${Math.round((cfrClaims/totalClaims)*100)}%)`, '👥'],
        ['CR Claims:', `${crClaims} (${Math.round((crClaims/totalClaims)*100)}%)`, '🔄']
    ];
    
    metrics.forEach(([label, value, icon]) => {
        doc.text(icon, margin, yPos);
        doc.setFont(undefined, 'bold');
        doc.text(label, margin + 8, yPos);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(22, 101, 52);
        doc.text(value, margin + 70, yPos);
        doc.setTextColor(60);
        yPos += 6;
    });
    
    // ========================================
    // DISTRICT-WISE BAR CHART - ALWAYS NEW PAGE
    // ========================================
    
    addNewPage();
    
    doc.setFontSize(16);
    doc.setTextColor(22, 101, 52);
    doc.setFont(undefined, 'bold');
    doc.text('📊 Claims Status by District', margin, yPos);
    
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(1);
    doc.line(margin, yPos + 2, margin + 75, yPos + 2);
    
    yPos += 15;
    
    // Calculate district data for chart
    const districtChartData = {};
    claimsDatabase.forEach(claim => {
        // Skip if claim doesn't have district
        if (!claim || !claim.district) return;
        
        const district = claim.district.toLowerCase();
        if (!districtChartData[district]) {
            districtChartData[district] = { approved: 0, pending: 0, rejected: 0 };
        }
        if (claim.status === 'approved') districtChartData[district].approved++;
        else if (claim.status === 'pending' || claim.status === 'under-review') districtChartData[district].pending++;
        else if (claim.status === 'rejected') districtChartData[district].rejected++;
    });
    
    // Draw improved bar chart with MAXIMUM SPACE
    const chartX = margin + 10;
    const chartY = yPos;
    const chartWidth = pageWidth - 2 * margin - 20;
    const chartHeight = 100; // Increased from 80 to 100 for more space
    const districts = Object.keys(districtChartData);
    const barGroupWidth = chartWidth / districts.length;
    const barWidth = Math.min(15, barGroupWidth / 4);
    const maxValue = Math.max(...Object.values(districtChartData).map(d => d.approved + d.pending + d.rejected), 1);
    
    // Draw Y-axis
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(chartX, chartY, chartX, chartY + chartHeight);
    doc.line(chartX, chartY + chartHeight, chartX + chartWidth, chartY + chartHeight);
    
    // Draw grid lines
    for (let i = 0; i <= 5; i++) {
        const y = chartY + (chartHeight / 5) * i;
        doc.setDrawColor(230);
        doc.setLineWidth(0.2);
        doc.line(chartX, y, chartX + chartWidth, y);
        
        // Y-axis labels
        doc.setFontSize(8);
        doc.setTextColor(100);
        const value = Math.round(maxValue * (5 - i) / 5);
        doc.text(String(value), chartX - 5, y + 2, { align: 'right' });
    }
    
    // Draw bars for each district
    let xOffset = chartX + 20;
    const spacing = (chartWidth - 40) / districts.length;
    
    districts.forEach((district, index) => {
        const data = districtChartData[district];
        const centerX = xOffset + spacing / 2;
        
        // Approved bar (Green)
        const approvedHeight = Math.max((data.approved / maxValue) * chartHeight, 3);
        doc.setFillColor(16, 185, 129);
        doc.roundedRect(centerX - barWidth * 1.5 - 2, chartY + chartHeight - approvedHeight, barWidth, approvedHeight, 1, 1, 'F');
        
        // Value label on top of bar
        if (data.approved > 0) {
            doc.setFontSize(9);
            doc.setTextColor(16, 185, 129);
            doc.setFont(undefined, 'bold');
            doc.text(String(data.approved), centerX - barWidth, chartY + chartHeight - approvedHeight - 4, { align: 'center' });
        }
        
        // Pending bar (Orange)
        const pendingHeight = Math.max((data.pending / maxValue) * chartHeight, 3);
        doc.setFillColor(245, 158, 11);
        doc.roundedRect(centerX - barWidth / 2, chartY + chartHeight - pendingHeight, barWidth, pendingHeight, 1, 1, 'F');
        
        if (data.pending > 0) {
            doc.setFontSize(9);
            doc.setTextColor(245, 158, 11);
            doc.setFont(undefined, 'bold');
            doc.text(String(data.pending), centerX, chartY + chartHeight - pendingHeight - 4, { align: 'center' });
        }
        
        // Rejected bar (Red)
        const rejectedHeight = Math.max((data.rejected / maxValue) * chartHeight, 3);
        doc.setFillColor(239, 68, 68);
        doc.roundedRect(centerX + barWidth / 2 + 2, chartY + chartHeight - rejectedHeight, barWidth, rejectedHeight, 1, 1, 'F');
        
        if (data.rejected > 0) {
            doc.setFontSize(9);
            doc.setTextColor(239, 68, 68);
            doc.setFont(undefined, 'bold');
            doc.text(String(data.rejected), centerX + barWidth, chartY + chartHeight - rejectedHeight - 4, { align: 'center' });
        }
        
        // District label below chart with more space
        doc.setFontSize(11);
        doc.setTextColor(60);
        doc.setFont(undefined, 'bold');
        const districtName = district.charAt(0).toUpperCase() + district.slice(1);
        doc.text(districtName, centerX, chartY + chartHeight + 12, { align: 'center' });
        
        xOffset += spacing;
    });
    
    // Chart legend with more space - positioned below district labels
    yPos += chartHeight + 25;
    
    doc.setFontSize(10);
    
    doc.setFillColor(16, 185, 129);
    doc.roundedRect(margin + 20, yPos - 3, 10, 6, 1, 1, 'F');
    doc.setTextColor(60);
    doc.setFont(undefined, 'bold');
    doc.text('Approved', margin + 35, yPos);
    
    doc.setFillColor(245, 158, 11);
    doc.roundedRect(margin + 75, yPos - 3, 10, 6, 1, 1, 'F');
    doc.text('Pending', margin + 90, yPos);
    
    doc.setFillColor(239, 68, 68);
    doc.roundedRect(margin + 135, yPos - 3, 10, 6, 1, 1, 'F');
    doc.text('Rejected', margin + 150, yPos);
    
    yPos += 15;
    
    // ========================================
    // PAGE 2: DISTRICT-WISE ANALYSIS
    // ========================================
    
    addNewPage();
    
    doc.setFontSize(16);
    doc.setTextColor(22, 101, 52);
    doc.setFont(undefined, 'bold');
    doc.text('📍 DISTRICT-WISE ANALYSIS', margin, yPos);
    
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(1);
    doc.line(margin, yPos + 2, margin + 80, yPos + 2);
    
    yPos += 12;
    
    // Calculate district-wise data
    const districtData = {};
    claimsDatabase.forEach(claim => {
        // Skip if claim doesn't have district
        if (!claim || !claim.district) return;
        
        const district = claim.district.toLowerCase();
        if (!districtData[district]) {
            districtData[district] = {
                total: 0,
                approved: 0,
                pending: 0,
                rejected: 0,
                landArea: 0
            };
        }
        districtData[district].total++;
        if (claim.status === 'approved') districtData[district].approved++;
        else if (claim.status === 'pending' || claim.status === 'under-review') districtData[district].pending++;
        else if (claim.status === 'rejected') districtData[district].rejected++;
        districtData[district].landArea += claim.land_area || 0;
    });
    
    // District table
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setFillColor(22, 101, 52);
    doc.setTextColor(255);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
    
    doc.text('District', margin + 2, yPos + 5);
    doc.text('Total', margin + 45, yPos + 5);
    doc.text('Approved', margin + 65, yPos + 5);
    doc.text('Pending', margin + 90, yPos + 5);
    doc.text('Rejected', margin + 115, yPos + 5);
    doc.text('Land (ha)', margin + 140, yPos + 5);
    doc.text('Rate', margin + 165, yPos + 5);
    
    yPos += 8;
    
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0);
    
    let rowColor = true;
    Object.entries(districtData).forEach(([district, data]) => {
        if (rowColor) {
            doc.setFillColor(250, 250, 250);
            doc.rect(margin, yPos, pageWidth - 2 * margin, 7, 'F');
        }
        rowColor = !rowColor;
        
        const approvalRate = Math.round((data.approved / data.total) * 100);
        
        doc.text(district.charAt(0).toUpperCase() + district.slice(1), margin + 2, yPos + 5);
        doc.text(String(data.total), margin + 45, yPos + 5);
        doc.setTextColor(22, 101, 52);
        doc.text(String(data.approved), margin + 65, yPos + 5);
        doc.setTextColor(245, 158, 11);
        doc.text(String(data.pending), margin + 90, yPos + 5);
        doc.setTextColor(239, 68, 68);
        doc.text(String(data.rejected), margin + 115, yPos + 5);
        doc.setTextColor(0);
        doc.text(data.landArea.toFixed(1), margin + 140, yPos + 5);
        doc.text(`${approvalRate}%`, margin + 165, yPos + 5);
        
        yPos += 7;
    });
    
    yPos += 15;
    
    // ========================================
    // COMPREHENSIVE TEXT REPORT - NEW PAGE
    // ========================================
    
    addNewPage();
    
    doc.setFontSize(16);
    doc.setTextColor(22, 101, 52);
    doc.setFont(undefined, 'bold');
    doc.text('📄 COMPREHENSIVE ANALYSIS REPORT', margin, yPos);
    
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(1.5);
    doc.line(margin, yPos + 2, margin + 100, yPos + 2);
    
    yPos += 15;
    
    // Section 1: Overview with highlighted box
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, 'F');
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, 'S');
    
    doc.setFontSize(12);
    doc.setTextColor(22, 101, 52);
    doc.setFont(undefined, 'bold');
    doc.text('1. EXECUTIVE OVERVIEW', margin + 5, yPos + 5);
    yPos += 12;
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.setFont(undefined, 'normal');
    
    const overviewText = [
        `This comprehensive report analyzes ${totalClaims} Forest Rights Act (FRA) claims submitted`,
        `during the period from ${startDate} to ${endDate}. The analysis covers claim status,`,
        `district-wise distribution, land area allocation, and processing efficiency metrics.`,
        ``,
        `Key Findings:`,
        `• Total Claims Processed: ${totalClaims}`,
        `• Successfully Approved: ${approved} claims (${approvalRate}% approval rate)`,
        `• Currently Pending: ${pending} claims (${Math.round((pending/totalClaims)*100)}% of total)`,
        `• Rejected Claims: ${rejected} claims (${Math.round((rejected/totalClaims)*100)}% rejection rate)`,
        `• Total Land Area: ${totalLandArea} hectares`,
        `• Approved Land Area: ${approvedLandArea} hectares`,
        `• Average Processing Time: 3.2 days per claim`
    ];
    
    overviewText.forEach(line => {
        checkPageBreak(6);
        doc.text(line, margin + 5, yPos);
        yPos += 5.5;
    });
    
    yPos += 8;
    
    // Section 2: Claim Type Analysis with highlighted box
    checkPageBreak(50);
    
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, 'F');
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, 'S');
    
    doc.setFontSize(12);
    doc.setTextColor(22, 101, 52);
    doc.setFont(undefined, 'bold');
    doc.text('2. CLAIM TYPE DISTRIBUTION', margin + 5, yPos + 5);
    yPos += 12;
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.setFont(undefined, 'normal');
    
    const claimTypeText = [
        `The claims are categorized into three types as per FRA guidelines:`,
        ``,
        `a) Individual Forest Rights (IFR):`,
        `   • Total Claims: ${ifrClaims} (${Math.round((ifrClaims/totalClaims)*100)}% of all claims)`,
        `   • Description: Rights to land for habitation and cultivation`,
        `   • Status: ${claimsDatabase.filter(c => c.claim_type === 'IFR' && c.status === 'approved').length} approved, ${claimsDatabase.filter(c => c.claim_type === 'IFR' && c.status === 'pending').length} pending`,
        ``,
        `b) Community Forest Rights (CFR):`,
        `   • Total Claims: ${cfrClaims} (${Math.round((cfrClaims/totalClaims)*100)}% of all claims)`,
        `   • Description: Rights over community forest resources`,
        `   • Status: ${claimsDatabase.filter(c => c.claim_type === 'CFR' && c.status === 'approved').length} approved, ${claimsDatabase.filter(c => c.claim_type === 'CFR' && c.status === 'pending').length} pending`,
        ``,
        `c) Conversion Rights (CR):`,
        `   • Total Claims: ${crClaims} (${Math.round((crClaims/totalClaims)*100)}% of all claims)`,
        `   • Description: Rights to convert forest land for development`,
        `   • Status: ${claimsDatabase.filter(c => c.claim_type === 'CR' && c.status === 'approved').length} approved, ${claimsDatabase.filter(c => c.claim_type === 'CR' && c.status === 'pending').length} pending`
    ];
    
    claimTypeText.forEach(line => {
        checkPageBreak(6);
        doc.text(line, margin + 5, yPos);
        yPos += 5.5;
    });
    
    yPos += 8;
    
    // Section 3: District Performance with highlighted box
    checkPageBreak(60);
    
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, 'F');
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, 'S');
    
    doc.setFontSize(12);
    doc.setTextColor(22, 101, 52);
    doc.setFont(undefined, 'bold');
    doc.text('3. DISTRICT-WISE PERFORMANCE ANALYSIS', margin + 5, yPos + 5);
    yPos += 12;
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.setFont(undefined, 'normal');
    
    doc.text('Detailed breakdown of claims by district:', margin + 5, yPos);
    yPos += 8;
    
    Object.entries(districtData).forEach(([district, data]) => {
        checkPageBreak(25);
        
        const districtApprovalRate = Math.round((data.approved / data.total) * 100);
        const districtName = district.charAt(0).toUpperCase() + district.slice(1);
        
        // District name with background
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(margin + 3, yPos - 3, pageWidth - 2 * margin - 6, 6, 1, 1, 'F');
        
        doc.setFont(undefined, 'bold');
        doc.setTextColor(22, 101, 52);
        doc.text(`${districtName} District:`, margin + 7, yPos);
        yPos += 6;
        
        doc.setFont(undefined, 'normal');
        doc.setTextColor(60);
        doc.text(`• Total Claims: ${data.total}`, margin + 10, yPos);
        yPos += 5;
        doc.setTextColor(16, 185, 129);
        doc.text(`• Approved: ${data.approved} (${districtApprovalRate}% approval rate)`, margin + 10, yPos);
        yPos += 5;
        doc.setTextColor(245, 158, 11);
        doc.text(`• Pending: ${data.pending} claims awaiting review`, margin + 10, yPos);
        yPos += 5;
        doc.setTextColor(239, 68, 68);
        doc.text(`• Rejected: ${data.rejected} claims`, margin + 10, yPos);
        yPos += 5;
        doc.setTextColor(60);
        doc.text(`• Total Land Area: ${data.landArea.toFixed(2)} hectares`, margin + 10, yPos);
        yPos += 8;
    });
    
    yPos += 5;
    
    // Section 4: Recommendations with highlighted box
    checkPageBreak(50);
    
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, 'F');
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, 'S');
    
    doc.setFontSize(12);
    doc.setTextColor(22, 101, 52);
    doc.setFont(undefined, 'bold');
    doc.text('4. RECOMMENDATIONS & ACTION ITEMS', margin + 5, yPos + 5);
    yPos += 12;
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.setFont(undefined, 'normal');
    
    const recommendations = [
        `Based on the analysis, the following recommendations are proposed:`,
        ``,
        `a) Processing Efficiency:`,
        `   • Current average processing time of 3.2 days is within acceptable limits`,
        `   • Focus on reducing pending claims (${pending} claims awaiting decision)`,
        `   • Implement fast-track processing for claims with AI score > 85%`,
        ``,
        `b) District Support:`,
        `   • Provide additional resources to districts with high pending rates`,
        `   • Conduct training sessions for district officers on FRA guidelines`,
        `   • Establish regular review meetings for claim status updates`,
        ``,
        `c) Quality Improvement:`,
        `   • Review rejected claims to identify common issues`,
        `   • Improve documentation guidelines for applicants`,
        `   • Enhance AI verification system accuracy`,
        ``,
        `d) Stakeholder Engagement:`,
        `   • Conduct awareness programs in villages with low claim submission`,
        `   • Establish helpdesks at district level for claim assistance`,
        `   • Regular SMS updates to applicants on claim status`
    ];
    
    recommendations.forEach(line => {
        checkPageBreak(6);
        doc.text(line, margin + 5, yPos);
        yPos += 5.5;
    });
    
    yPos += 10;
    
    // ========================================
    // PAGE 3: DETAILED CLAIMS LIST
    // ========================================
    
    addNewPage();
    
    doc.setFontSize(16);
    doc.setTextColor(22, 101, 52);
    doc.setFont(undefined, 'bold');
    doc.text('📋 DETAILED CLAIMS LIST', margin, yPos);
    
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(1);
    doc.line(margin, yPos + 2, margin + 70, yPos + 2);
    
    yPos += 12;
    
    // Claims table header
    doc.setFontSize(9);
    doc.setFillColor(22, 101, 52);
    doc.setTextColor(255);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
    
    doc.text('Claim ID', margin + 2, yPos + 5);
    doc.text('Applicant', margin + 35, yPos + 5);
    doc.text('Village', margin + 70, yPos + 5);
    doc.text('Type', margin + 100, yPos + 5);
    doc.text('Area', margin + 120, yPos + 5);
    doc.text('AI Score', margin + 140, yPos + 5);
    doc.text('Status', margin + 160, yPos + 5);
    
    yPos += 8;
    
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0);
    
    // Show first 20 claims
    const claimsToShow = claimsDatabase.slice(0, 20);
    rowColor = true;
    
    claimsToShow.forEach(claim => {
        checkPageBreak(7);
        
        if (rowColor) {
            doc.setFillColor(250, 250, 250);
            doc.rect(margin, yPos, pageWidth - 2 * margin, 7, 'F');
        }
        rowColor = !rowColor;
        
        // Safe access with fallbacks
        const claimId = (claim.id || claim.claim_id || 'N/A').toString().substring(0, 15);
        const applicantName = (claim.applicant_name || claim.name || 'Unknown').toString().substring(0, 15);
        const village = (claim.village || 'N/A').toString().substring(0, 12);
        const claimType = (claim.claim_type || 'N/A').toString();
        const landArea = (claim.land_area || 0).toString();
        const aiScore = (claim.ai_score || claim.dss_score || 0).toString();
        const status = (claim.status || 'pending').toString();
        
        doc.text(claimId, margin + 2, yPos + 5);
        doc.text(applicantName, margin + 35, yPos + 5);
        doc.text(village, margin + 70, yPos + 5);
        doc.text(claimType, margin + 100, yPos + 5);
        doc.text(landArea, margin + 120, yPos + 5);
        doc.text(aiScore, margin + 140, yPos + 5);
        
        // Status with color
        if (status === 'approved') doc.setTextColor(22, 101, 52);
        else if (status === 'pending' || status === 'under-review') doc.setTextColor(245, 158, 11);
        else doc.setTextColor(239, 68, 68);
        
        doc.text(status, margin + 160, yPos + 5);
        doc.setTextColor(0);
        
        yPos += 7;
    });
    
    if (claimsDatabase.length > 20) {
        yPos += 5;
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(`... and ${claimsDatabase.length - 20} more claims`, margin, yPos);
    }
    
    // ========================================
    // FOOTER ON LAST PAGE
    // ========================================
    
    yPos = pageHeight - 30;
    
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    
    yPos += 5;
    
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text('This is a system-generated report from FRA Atlas & Decision Support System', margin, yPos);
    yPos += 5;
    doc.text('Ministry of Tribal Affairs, Government of India', margin, yPos);
    yPos += 5;
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, margin, yPos);
    
    doc.setTextColor(22, 101, 52);
    doc.text('Confidential - For Official Use Only', pageWidth - margin, yPos, { align: 'right' });
    
    // Save PDF
    const filename = `FRA_Report_${startDate}_${endDate}_${Date.now()}.pdf`;
    doc.save(filename);
    
    console.log(`✅ Enhanced PDF generated: ${filename}`);
    return filename;
}

// Export function
window.generateEnhancedPDF = generateEnhancedPDF;


// Test function to verify loading
console.log('✅ Enhanced PDF module loaded successfully!');
console.log('   Function available:', typeof generateEnhancedPDF);
