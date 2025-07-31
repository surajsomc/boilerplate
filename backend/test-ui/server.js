const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.TEST_UI_PORT || 3002;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'Test UI Server',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// Start the server
app.listen(PORT, () => {
    console.log('🎨 Test UI Server running!');
    console.log(`📱 Open your browser and go to: http://localhost:${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`📊 Make sure your backend API is running on port 3001`);
    console.log('');
    console.log('💡 Tips:');
    console.log('   - The test UI will automatically connect to your backend API');
    console.log('   - Check the server status indicator at the top of the page');
    console.log('   - All API responses will be logged in the Response section');
    console.log('');
    console.log('🚀 Happy testing!');
});

module.exports = app; 