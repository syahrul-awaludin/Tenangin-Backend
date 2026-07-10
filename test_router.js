const express = require('express');
const app = express();
app.use('/api/v1', (req, res, next) => next());
const notificationRoutes = express.Router();
notificationRoutes.get('/', (req, res) => res.send('HIT NOTIF'));
app.use('/api/v1/notifications', notificationRoutes);
app.use((req, res) => res.status(404).send('404 NOT FOUND'));
app.listen(4007, () => console.log('started 4007'));
