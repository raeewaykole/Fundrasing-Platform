document.addEventListener('DOMContentLoaded', function() {
    // API URL (change this to your actual backend URL)
    const API_URL = 'http://localhost:3000/api';
    
    // Fetch dashboard data
    async function fetchDashboardData() {
        try {
            // Fetch total funding
            const totalFundingResponse = await fetch(`${API_URL}/stats/total-funding`);
            if (!totalFundingResponse.ok) {
                throw new Error('Failed to fetch total funding');
            }
            const totalFundingData = await totalFundingResponse.json();
            
            // Update total funding stat
            document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = 
                '$' + (totalFundingData.total || 0).toLocaleString();
            
            // Fetch sector distribution
            const sectorDistResponse = await fetch(`${API_URL}/stats/sector-distribution`);
            if (!sectorDistResponse.ok) {
                throw new Error('Failed to fetch sector distribution');
            }
            const sectorDistData = await sectorDistResponse.json();
            
            // Update sector distribution chart
            updateSectorDistributionChart(sectorDistData);
            
            // Fetch funding trends
            const trendResponse = await fetch(`${API_URL}/stats/funding-trends`);
            if (!trendResponse.ok) {
                throw new Error('Failed to fetch funding trends');
            }
            const trendData = await trendResponse.json();
            
            // Update funding trend chart
            updateFundingTrendChart(trendData);
            
            // Fetch top startups
            const topStartupsResponse = await fetch(`${API_URL}/stats/top-startups`);
            if (!topStartupsResponse.ok) {
                throw new Error('Failed to fetch top startups');
            }
            const topStartupsData = await topStartupsResponse.json();
            
            // Update top startups table
            updateTopStartupsTable(topStartupsData);
            
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            alert('Error loading dashboard data. Please try again later.');
        }
    }
    
    // Update sector distribution chart
    function updateSectorDistributionChart(data) {
        const labels = data.map(item => item.sector);
        const values = data.map(item => item.total);
        
        const sectorDistributionCtx = document.getElementById('sectorDistributionChart').getContext('2d');
        const sectorDistributionChart = new Chart(sectorDistributionCtx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        '#4361ee',
                        '#3a0ca3',
                        '#7209b7',
                        '#f72585',
                        '#4cc9f0'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return context.label + ': $' + value.toLocaleString() + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Update funding trend chart
    function updateFundingTrendChart(data) {
        const labels = data.map(item => item.month);
        const values = data.map(item => item.total / 1000000); // Convert to millions
        
        const fundingTrendCtx = document.getElementById('fundingTrendChart').getContext('2d');
        const fundingTrendChart = new Chart(fundingTrendCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Funding Amount (in millions $)',
                    data: values,
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value + 'M';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Update top startups table
    function updateTopStartupsTable(data) {
        const tableBody = document.querySelector('#topStartupsTable tbody');
        tableBody.innerHTML = '';
        
        data.forEach(startup => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${startup.name}</td>
                <td>${startup.sector}</td>
                <td>$${startup.funding_amount.toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    // Fetch initial data
    fetchDashboardData();
    
    // Refresh data every 5 minutes
    setInterval(fetchDashboardData, 5 * 60 * 1000);
});