const express = require('express');
const indexRoutes = require('./routes/index');

const app = express();
const port = process.env.PORT || 5000;

app.use('/', indexRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});