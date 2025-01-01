const express = require('express');
const cors = require('cors');
const bodyParser = require( 'body-parser' );
const wordsRouter=require('./routes/word')

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basic Route
app.use( '/api/words', wordsRouter );

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
