const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Connect to SQLite database
const db = new sqlite3.Database('./cms.db', (err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

// Read JSON file
const jsonFilePath = path.join(__dirname, '../data/data.json');

function loadData() {
    try {
        console.log('📄 Reading data from local JSON file...');
        const rawData = fs.readFileSync(jsonFilePath, 'utf-8');
        const data = JSON.parse(rawData);

        db.serialize(() => {
            const insertStmt = db.prepare(`
                INSERT INTO words (wordFirstLang, sentenceFirstLang, wordSecondLang, sentenceSecondLang)
                VALUES (?, ?, ?, ?)
            `);

            data.forEach(item => {
                if (
                    item.wordFirstLang !== undefined &&
                    item.sentenceFirstLang !== undefined &&
                    item.wordSecondLang !== undefined &&
                    item.sentenceSecondLang !== undefined
                ) {
                    insertStmt.run(
                        item.wordFirstLang || 'N/A',
                        item.sentenceFirstLang || 'N/A',
                        item.wordSecondLang || 'N/A',
                        item.sentenceSecondLang || 'N/A'
                    );
                } else {
                    console.warn('⚠️ Skipping invalid JSON entry:', item);
                }
            });

            insertStmt.finalize((err) => {
                if (err) {
                    console.error('❌ Finalization Error:', err.message);
                } else {
                    console.log('✅ Data inserted successfully.');
                }
            });
        });
    } catch (error) {
        console.error('❌ Error loading JSON data:', error.message);
    } finally {
        db.close((err) => {
            if (err) {
                console.error('❌ Error closing the database:', err.message);
            } else {
                console.log('✅ Database connection closed');
            }
        });
    }
}

// Execute the function
loadData();
