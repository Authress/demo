// public imports
import express from "express";
import boilerplate from "./boilerplate";

// Authress token validation
import authressTokenValidation from './authressTokenValidation';

// Resources Manages a specific resource in a customer account
import ReportsController from '../reports/reportsController';

const app = express();
boilerplate.setup(app);

/************* Middleware *************/

// app.use(authressTokenValidation);

/**************************************/

app.use('/reports', ReportsController)

// Express requires error handlers to be at the end
boilerplate.addErrorHandlers(app);
