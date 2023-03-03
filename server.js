const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const indexRoutes = require('./routes/index');

const app = express();
const port = process.env.PORT || 5000;

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', indexRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
