const express = require('express');
const axios = require('axios')
const app = express();
const port = 3030;
const STREAMLABS_API_BASE = 'https://www.streamlabs.com/api/v1.0';
let token = '';

app.get('/', (req:any, res:any) => {

  let authorize_url = `${STREAMLABS_API_BASE}/authorize?`;

  let params:any = {
    'client_id': 'clientId',
    'redirect_uri': 'http://localhost:3030/auth',
    'response_type': 'code',
    'scope': 'donations.read+donations.create',
  }

  authorize_url += Object.keys(params).map(k => `${k}=${params[k]}`).join('&')

  res.send(`<a href="${authorize_url}">Authorize with Streamlabs!</a>`)
})

app.get('/auth', (req:any, resp:any) => {
  let code = req.query.code;
  axios.post(`${STREAMLABS_API_BASE}/token?`, {
    'grant_type': 'authorization_code',
    'client_id': 'clientId',
    'client_secret': 'clientSecret',
    'redirect_uri': 'http://localhost:3030/auth',
    'code': code
  }).then((response:any) => {
    token = response.data.access_token;
    resp.redirect('/')
  })
})

app.get('/user', (req:any, res:any) => {
  axios.get(`${STREAMLABS_API_BASE}/user?access_token=${token}`)
    .then((response:any) => {
      console.log(response.data)
      res.send(response.data)
    })
}) 

app.post('/donation/:name/:message/:amount/:currecy/:id', (req:any, res:any) => {
  let data = {
    name: req.params.name,
    message: req.params.message,
    identifier: req.params.id,
    amount: req.params.amount,
    currency: req.params.currecy,
    access_token: token,
    skip_alert: 'no'
  }

  axios.post(`${STREAMLABS_API_BASE}/donations`,data)
    .then((response:any) => {
      console.log(response.data)
      res.send(response.data)
    })
}) 

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
