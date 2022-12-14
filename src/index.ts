import http from 'http';
import config from './config/config';
import allGigRoutes from './routes/gigs'
import allUserRoutes from './routes/users'
import allFriendRoutes from './routes/friends'
import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';

const router = express();

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type', 'Authorization'
  ],
};

router.use(cors(corsOpts));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use('/users', allUserRoutes);
router.use('/gigs', allGigRoutes);
router.use('/friends', allFriendRoutes)


router.use((req, res, next) => {
  const error = new Error('Not found');

  res.status(404).json({
      message: error.message
  });
});

const httpServer = http.createServer(router);

httpServer.listen(config.server.port, () => console.log(`Server is running ${config.server.hostname}:${config.server.port}`));

