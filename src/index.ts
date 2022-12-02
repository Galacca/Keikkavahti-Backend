import http from 'http';
import config from './config/config';
import allGigRoutes from './routes/gigs'
import allUserRoutes from './routes/users'
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
    'Content-Type',
  ],
};

router.use(cors(corsOpts));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// router.use((req, res, next) => {
              
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

//   if (req.method == 'OPTIONS') {
//       res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//       return res.status(200).json({});
//   }

//   next();
// });

router.use('/users', allUserRoutes);
router.use('/gigs', allGigRoutes);


router.use((req, res, next) => {
  const error = new Error('Not found');

  res.status(404).json({
      message: error.message
  });
});

const httpServer = http.createServer(router);

httpServer.listen(config.server.port, () => console.log(`Server is running ${config.server.hostname}:${config.server.port}`));

