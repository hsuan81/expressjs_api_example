require('dotenv').config()
const app = require('./app');

const server = app.listen(process.env.PORT || 3001, function () {
    const port = server.address().port;
    console.log(`Server is running on port ${port}`);
  });