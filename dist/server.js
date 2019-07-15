"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
// import { Models } from './models';
// const expenses = Models.expense;
const expense_1 = require("./models/expense");
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
//const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
//const session = require('express-session');
const users = {
    'user01': 'p@ssw0rd',
    'user02': 'ewiojfsad'
};
app.use(cookie_parser_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_session_1.default({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 30 * 60 * 1000
    }
}));
app.get('/login', (req, res) => {
    res.send('<h1>LOGIN</h1><form action="/login" method="post">ユーザーID：<input type="text" name="user" size="40"><br />パスワード<input type="password" name="password"><input type="submit" value="ログイン">');
});
app.post('/login', (req, res) => {
    if (eval("users." + req.body.user) === req.body.password) {
        if (req.session) {
            req.session.user = req.body.user;
        }
    }
    res.redirect('/');
});
app.post('/expense', (req, res) => {
    expense_1.Expense.create(req.body)
        .then(() => {
        res.redirect('/');
    });
});
app.get('/', (req, res) => {
    const user = req.body.user || '名無しの権兵衛';
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(`<h1>Hello ${user}</h1><table><tr><th>ID</th><th>申請者名</th><th>日付</th><th>経費タイプ</th><th>経費詳細</th><th>金額</th></tr>`);
    expense_1.Expense.findAll()
        .then(results => {
        for (let i in results) {
            res.write(`<tr><td>${results[i].id}</td><td>${results[i].user_name}</td><td>${results[i].date}</td><td>${results[i].type}</td><td>${results[i].description}</td><td>${results[i].amount}</td></tr>`);
        }
        res.write('</table><a href="/login">ログイン</a><a href="/submit">経費入力</a>');
        res.end();
    });
});
app.get('/submit', (req, res) => {
    const user = req.body.user || '名無しの権兵衛';
    res.send(`<h2>経費入力</h2><form action="/expense" method="post">申請者名:<input type="text" name="user_name" value="${user}"><br />日付:<input type="date" name="date"><br />経費タイプ:<input type="text" name="type"><br />経費詳細:<input type="text" name="description"><br />金額:<input type="number" name="amount"><br /><input type="submit" value="経費申請">`);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});