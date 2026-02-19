const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

let requests = [
    { id: 101, title: 'Wi-Fi completely down in Wing A', category: 'IT', description: 'Nobody can connect to the network.', priority: 'High', requester: 'alice@portal.com', status: 'Open', date: new Date().toISOString() },
    { id: 102, title: 'Projector bulb replaced', category: 'Facilities', description: 'Room 404 projector needs a new bulb.', priority: 'Medium', requester: 'bob@portal.com', status: 'In Progress', date: new Date().toISOString() }
];

const checkAuth = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    try {
        const response = await axios.post('http://localhost:3001/validate', { token });
        if (response.data.valid) {
            req.user = response.data;
            next();
        } else {
            res.status(403).json({ error: 'Invalid Token' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Auth service unreachable' });
    }
};

app.post('/', checkAuth, (req, res) => {
    const { title, description, requester } = req.body;
    let { category, priority } = req.body;
    const combinedText = (title + " " + description).toLowerCase();

    if (!category) {
        if (combinedText.match(/wifi|network|software|login|laptop|screen/)) category = 'IT';
        else if (combinedText.match(/ac|cleaning|desk|chair|water|leak|bulb/)) category = 'Facilities';
        else category = 'Admin';
    }

    if (!priority) {
        priority = combinedText.match(/urgent|critical|emergency|immediately|completely down/) ? 'High' : 'Low';
    }

    const newReq = { id: Date.now(), title, category, description, priority, requester, status: 'Open', date: new Date().toISOString() };
    requests.push(newReq);
    res.status(201).json(newReq);
});

app.get('/', checkAuth, (req, res) => {
    let filtered = requests;
    if (req.query.category) filtered = filtered.filter(r => r.category === req.query.category);
    if (req.query.status) filtered = filtered.filter(r => r.status === req.query.status);
    if (req.query.priority) filtered = filtered.filter(r => r.priority === req.query.priority);
    res.json(filtered.sort((a, b) => b.id - a.id));
});

app.put('/:id/status', checkAuth, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only admins can update status' });
    }

    const { status } = req.body;
    const request = requests.find(r => r.id == req.params.id);
    if (request && ['Open', 'In Progress', 'Resolved'].includes(status)) {
        request.status = status;
        res.json(request);
    } else {
        res.status(404).json({ error: 'Request not found or invalid status' });
    }
});

// NEW ENDPOINT: Update Priority
app.put('/:id/priority', checkAuth, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only admins can update priority' });
    }

    const { priority } = req.body;
    const request = requests.find(r => r.id == req.params.id);
    if (request && ['Low', 'Medium', 'High'].includes(priority)) {
        request.priority = priority;
        res.json(request);
    } else {
        res.status(404).json({ error: 'Request not found or invalid priority' });
    }
});

app.listen(3002, () => console.log('Request Service running on port 3002'));