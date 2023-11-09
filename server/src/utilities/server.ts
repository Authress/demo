import express from "express";
import boilerplate from "./boilerplate";
import authress from './authressTokenValidation';

const app = express();
boilerplate.setup(app);


/************* Service Entry Point *************

This is the service entry point that contains registrations for the controllers.

* Reports Controller
* Service API Middleware

**************************************/

// Resources Manages a specific resource in a customer account
import ReportsController from '../reports/reportsController';

/************* Middleware *************/

// app.use(authress);

/**************************************/

app.use('/reports', ReportsController)

// Express requires error handlers to be at the end
boilerplate.addErrorHandlers(app);
