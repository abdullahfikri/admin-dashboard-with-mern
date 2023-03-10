import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import clientRoutes from './routes/client.js';
import generalRoutes from './routes/general.js';
import managementRoutes from './routes/management.js';
import salesRoutes from './routes/sales.js';

// DATA IMPORTS
import User from './models/user.js';
import Product from './models/Product.js';
import ProductStat from './models/ProductStat.js';
import Transaction from './models/Transaction.js';
import OverallStat from './models/OverallStat.js';
import AffiliateStat from './models/AffiliateStat.js';
import {
    dataUser,
    dataProduct,
    dataProductStat,
    dataTransaction,
    dataOverallStat,
    dataAffiliateStat,
} from './data/index.js';

// @CONFIGURATION
dotenv.config();

// cors option
// const corsOptions = {
//     origin: 'https://admin-dashboard-frontend-gkrv.onrender.com',
//     optionsSuccessStatus: 200,
// };
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors(corsOptions));
var whitelist = ['https://admin-dashboard-frontend-gkrv.onrender.com'];
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

/* @ROUTES */
app.use('/client', cors(corsOptions), clientRoutes);
app.use('/general', cors(corsOptions), generalRoutes);
app.use('/management', cors(corsOptions), managementRoutes);
app.use('/sales', cors(corsOptions), salesRoutes);

/* @MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
        /* ONLY ADD DATA ONE TIME */
        // User.insertMany(dataUser);
        // Product.insertMany(dataProduct);
        // ProductStat.insertMany(dataProductStat);
        // Transaction.insertMany(dataTransaction);
        // OverallStat.insertMany(dataOverallStat);
        // AffiliateStat.insertMany(dataAffiliateStat);
    })
    .catch((error) => console.log(`${error} did not connect`));

// mongoose.
