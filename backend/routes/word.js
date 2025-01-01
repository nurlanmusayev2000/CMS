const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const db = new sqlite3.Database('./cms.db');

// Fetch Paginated Words
router.get('/paginate', (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    db.all(`SELECT * FROM words LIMIT ? OFFSET ?`, [limit, offset], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get Total Count
router.get('/count', (req, res) => {
    db.get(`SELECT COUNT(*) AS count FROM words`, (err, row) => {
        if (err) res.status(500).json({ error: err.message });
        res.json({ count: row.count });
    });
});

// Update a Word
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { wordFirstLang, sentenceFirstLang, wordSecondLang, sentenceSecondLang } = req.body;

    db.run(
        `UPDATE words SET wordFirstLang = ?, sentenceFirstLang = ?, wordSecondLang = ?, sentenceSecondLang = ? WHERE id = ?`,
        [wordFirstLang, sentenceFirstLang, wordSecondLang, sentenceSecondLang, id],
        function(err) {
            if (err) res.status(500).json({ error: err.message });
            res.json({ message: 'Word updated successfully' });
        }
    );
});

module.exports = router;
