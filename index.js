const express = require('express');
const fs = require('fs');
const users = require('./MOCK_DATA (1).json');

const app = express();
const PORT = 8000;

//Middleware - Plugin
app.use(express.urlencoded({extended: false}))

//Routes
app.get('/users', (req, res) => {
    const html = `
    <ul>
        ${users.map((user) => `<li>${user.Quotes}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});

//REST API
app.get('/api/users', (req, res) => {
    return res.json(users);
});

app
    .route('/api/users/:id')
    .get((req, res) =>{
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        if(!user){
            return res.json({status: 'error', message: 'User not found'});
        }
        return res.json(user);
    })
    .patch((req, res) => {
        const id = Number(req.params.id);
        const userIndex = users.findIndex((user) => user.id === id);
        users[userIndex] = { ...users[userIndex], ...req.body };
        fs.writeFile('./MOCK_DATA (1).json', JSON.stringify(users), (err, data) => {
            return res.json({user: users[userIndex]});
        });
    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        users.splice(user, 1);
        fs.writeFile('./MOCK_DATA (1).json', JSON.stringify(users), (err, data) => {
            return res.json({ status: 'success', message: 'User deleted successfully' });
        });
    });

app.post('/api/users', (req, res) => {
    const body = req.body;
    users.push({ ...body, id: users.length + 1});
    fs.writeFile('./MOCK_DATA (1).json', JSON.stringify(users), (err, data) => {
        return res.json({status: 'success', id: users.length});
    });
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`))