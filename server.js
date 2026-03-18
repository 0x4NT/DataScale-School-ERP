const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require('./db'); // mysql2 pool
require('dotenv').config();
const app = express();



// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: 'SECRET_KEY',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true if using HTTPS
}));
app.use(express.static(path.join(__dirname, 'public')));


/* ----------------------------------------------------    MAIN ROUTES   -------------------------------------------
 */
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }

  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
	console.log("username:"+username+" password: "+password);
  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) return res.redirect("/");

    const user = rows[0];
    const match = password.localeCompare(user.password_hash) === 0;

    if (!match) return res.redirect("/");


    req.session.user = {
      id: user.id,
      username: user.username,
      theme: user.theme
    };

    res.redirect('/dashboard');
   console.log("Redirecting to dashboard...");
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    // User not logged in → redirect to login
    return res.redirect('/');
  }

  res.sendFile(path.join(__dirname,'views','dashboard.html'));
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

/* ----------------------------------------------------    SUBCONTENT ROUTES   -------------------------------------------
 */
app.get('/overview', (req, res) => {
    const filePath = path.join(__dirname, 'views/sub_content', 'overview.html');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error loading file');
        }

        res.send(data); // send as text
    });
});
app.get('/courseRegistration', (req, res) => {
    const filePath = path.join(__dirname, 'views/sub_content', 'courseRegistration.html');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error loading file');
        }

        res.send(data); // send as text
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
