const express = require('express');
const app = express();

// app is an object that describes all the things our web server can do
// we will customize app throught the project
// at the command line we type npm run dev which tells npm that we want to run the dev script in our package.json
// in this case it executes nodemon.js
// express is a library that helps us set up a full feature server

// anytime someone makes a request to the root route of our app, we want to run the callback
app.get('/', (req, res) => {
	res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email"/>
                <input name="password" placeholder="password"/>
                <input name="passwordConfirmation" placeholder="password confirmation"/>
                <button>Sign Up!</button>
            </form>
        </div>
    `);
});

app.post('/', (req, res) => {
	req.on('data', (data) => {
		const parsed = data.toString('utf8').split('&');
		const formData = {};
		for (let keyVal of parsed) {
			const [key, value] = keyVal.split('=');
			formData[key] = value;
		}
		console.log(formData);
	});
	res.send('<h1>Account Created</h1>');
});

app.listen(3000, () => {
	console.log('Listening on 3000!');
});
