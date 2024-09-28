const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to the JSON file
const USERS_FILE = 'users.json';

// Load users from JSON file
function loadUsers() {
    if (fs.existsSync(USERS_FILE)) {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    }
    return [];
}

// Save users to JSON file
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Get all users
app.get('/users', (req, res) => {
    const users = loadUsers();
    res.json(users);
});

// Save a new user
app.post('/users', (req, res) => {
    const newUser = req.body;
    const users = loadUsers();

    // Check for unique phone and email
    const isPhoneExists = users.some(user => user.phone === newUser.phone);
    const isEmailExists = users.some(user => user.email === newUser.email);

    if (isPhoneExists) {
        return res.status(400).json({ error: 'Phone number already exists.' });
    }
    if (isEmailExists) {
        return res.status(400).json({ error: 'Email already exists.' });
    }

    // Save the new user
    users.push(newUser);
    saveUsers(users);
    res.status(201).json(newUser);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
