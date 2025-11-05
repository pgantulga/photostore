//require express package
const express = require('express');
const morgan = require('morgan');
const logger = require('./logger');
//require config file
const config = require('./config/config');
//require and configure dotenv package

const db = require('./models');

//initialize express app
const app = express();
//middlware to parse JSON requests
app.use(express.json());
//middlware to parse urlencoded requests
app.use(express.urlencoded({ extended: true }));

const morganStream = {
    write: (message) => logger.info(message.trim()),
};

//bring routes
const productRoutes =  require('./routes/products');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
//Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/orders', orderRoutes);
//use morgan for logging
app.use(morgan('combined', { stream: morganStream }));

//start the server
console.log('Connecting to DB at:', db.options.host);
db.sequelize.authenticate()
  .then(() => {
    logger.info('✅ Connected to Amazon RDS via Sequelize');

    return db.sequelize.sync(); // Sync models
  })
  .then(() => {
    app.listen(config.PORT, () =>
      logger.info(`Server is running on port ${config.PORT}`)
    );
  })
  .catch((err) => {
    logger.error(`Failed to connect to the database: ${err}`);
    process.exit(1);
  });


// db.sequelize.sync().then(() => {
//  // listen for requests
//   app.listen(config.PORT,
//     () => logger.info(`Server is running on port ${config.PORT}`)
//   );
// });