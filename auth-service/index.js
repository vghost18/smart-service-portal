const express = require('express');
const app = express();
app.use(express.json());

const users = {
    'admin': { password: 'admin', role: 'admin', name: 'Support Team' },
    'user': { password: 'user', role: 'user', name: 'Student/Employee' }
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users[username];
    
    if (user && user.password === password) {
        const token = Buffer.from(JSON.stringify({ username, role: user.role })).toString('base64');
        res.json({ token, role: user.role, name: user.name });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.post('/validate', (req, res) => {
    const { token } = req.body;
    try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
        if (users[decoded.username]) {
            res.json({ valid: true, role: decoded.role, username: decoded.username });
        } else {
            res.status(401).json({ valid: false });
        }
    } catch (e) {
        res.status(401).json({ valid: false });
    }
});

app.listen(3001, () => console.log('Auth Service running on port 3001'));