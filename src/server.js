//require express package
const express = require('express');

//require config file
const config = require('./config/config');

//initialize express app
const app = express();
//middlware to parse JSON requests
app.use(express.json());
//middlware to parse urlencoded requests
app.use(express.urlencoded({ extended: true }));

//bring routes
const productRoutes =  require('./routes/products');
const authRoutes = require('./routes/auth');
//Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/auth', authRoutes);

//start the server
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});