import express from 'express';
import router from './routes/index';

const app = express();
const port = process.env.PORT || 5000;

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);

app.listen(port, () => console.log(`Server running on port ${port}`));
