const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();

// Middleware
app.use(express.static(publicPath));



app.listen(port, () => {
  console.log(`Server starts at port ${port}`);
})
