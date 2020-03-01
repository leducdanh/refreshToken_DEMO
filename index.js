var express = require("express");
var app = express();

const jwt = require("jsonwebtoken")

app.use(express.json())

const ACCESS_TOKEN_SECRET = '23d9306d172e47f6835127eb3952756cab6040725badf253e8bbb73bbe52b7cfef8cc4ede141c751a04f7192b6ca94a79a0abc66638b5a1fc7bba68e31ac6312'
const REFRETCH_TOKEN_SECRET = '4085851000dbc6c9057ecf67cbe76d105b5081d2fa762711cc8d76a50121b6fd588f1e3511da82710b22694ec98b351056938856a5a2b85a45a84da199cc6da3'


/**
 * data
 * {
 *  "username": "danh"
 * }
 */




app.post('/login', (req, res) => {
    var username = {username: req.body.username}
    var accesstoken = generateAccessToken(username)
    var refreshToken = jwt.sign(username, REFRETCH_TOKEN_SECRET)
    res.json({accesstoken, refreshToken})
})

app.get('/veryfi', authenticationToken, (req, res) => {
    var username = res.username
    res.json(username)
})

app.post('/refresh-token', (req, res) => {
    jwt.verify(req.body.token, REFRETCH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const newAccesstoken = generateAccessToken({username: user.username})
        res.json({accessToken: newAccesstoken})
    })
})

function authenticationToken(req, res, next) {
    var headers = req.headers["authorization"] //value return is "Bearer 'token'"
    var token = headers.split(" ")[1]
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, username) => {
        if (err) return res.sendStatus(403)
        res.username = username
        next()
    })
}

/**
 * @param {*} username is a json {username: username}
 */
function generateAccessToken(username){
    return jwt.sign(username, ACCESS_TOKEN_SECRET, {expiresIn: '20s'})
}

app.listen(3000, () => {
    console.log("listing port 3000")
})
