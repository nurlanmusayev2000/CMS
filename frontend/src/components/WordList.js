import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles.css';

function WordList() {
    const [words, setWords] = useState([]); // List of words
    const [search, setSearch] = useState(''); // Search keyword
    const [editingWord, setEditingWord] = useState(null); // Track the word being edited
    const [editForm, setEditForm] = useState({
        wordFirstLang: '',
        sentenceFirstLang: '',
        wordSecondLang: '',
        sentenceSecondLang: '',
    });
    const [page, setPage] = useState(1); // Current page
    const [totalPages, setTotalPages] = useState(1); // Total pages

    const limit = 5; // Words per page

    // Fetch Words with Pagination
    useEffect(() => {
        fetchWords();
        fetchTotalCount();
    }, [page]);

    const fetchWords = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/words/paginate?page=${page}&limit=${limit}`);
            setWords(response.data);
        } catch (error) {
            console.error('❌ Error fetching words:', error);
        }
    };

    const fetchTotalCount = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/words/count');
            setTotalPages(Math.ceil(response.data.count / limit));
        } catch (error) {
            console.error('❌ Error fetching total pages:', error);
        }
    };

    // Handle Search Input
    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearch(keyword);
    };

    const filteredWords = words.filter((word) =>
        word.wordFirstLang.toLowerCase().includes(search) ||
        word.wordSecondLang.toLowerCase().includes(search)
    );

    // Start Editing a Word
    const handleEdit = (word) => {
        setEditingWord(word.id);
        setEditForm({
            wordFirstLang: word.wordFirstLang,
            sentenceFirstLang: word.sentenceFirstLang,
            wordSecondLang: word.wordSecondLang,
            sentenceSecondLang: word.sentenceSecondLang,
        });
    };

    // Handle Form Changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    // Save Edited Word
    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:5000/api/words/${editingWord}`, editForm);
            setEditingWord(null);
            fetchWords();
        } catch (error) {
            console.error('❌ Error saving word:', error);
        }
    };

    // Cancel Editing
    const handleCancel = () => {
        setEditingWord(null);
    };

    return (
        <div className="word-list-container">
            <h1>CMS Admin Interface</h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search words or translations..."
                value={search}
                onChange={handleSearch}
                className="search-bar"
            />

            {/* Word List */}
            <ul className="word-list">
                {filteredWords.map((word) => (
                    <li key={word.id} className="word-item">
                        {editingWord === word.id ? (
                            <div className="edit-form">
                                <input
                                    type="text"
                                    name="wordFirstLang"
                                    value={editForm.wordFirstLang}
                                    onChange={handleFormChange}
                                />
                                <input
                                    type="text"
                                    name="sentenceFirstLang"
                                    value={editForm.sentenceFirstLang}
                                    onChange={handleFormChange}
                                />
                                <input
                                    type="text"
                                    name="wordSecondLang"
                                    value={editForm.wordSecondLang}
                                    onChange={handleFormChange}
                                />
                                <input
                                    type="text"
                                    name="sentenceSecondLang"
                                    value={editForm.sentenceSecondLang}
                                    onChange={handleFormChange}
                                />
                                <div className="edit-buttons">
                                    <button className="save-btn" onClick={handleSave}>Save</button>
                                    <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3>{word.wordFirstLang}</h3>
                                <p><strong>Translation:</strong> {word.wordSecondLang}</p>
                                <p><strong>Example Sentence (Original):</strong> {word.sentenceFirstLang || 'N/A'}</p>
                                <p><strong>Example Sentence (Translation):</strong> {word.sentenceSecondLang || 'N/A'}</p>
                                <button className="edit-btn" onClick={() => handleEdit(word)}>Edit</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            {/* Pagination */}
            <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
            </div>
        </div>
    );
}

export default WordList;
