import { AuthressClient } from 'authress-sdk';
import authress from '../utilities/authressPermissionsWrapper';
import express, { NextFunction, Request, Response } from 'express';
import { forbidden } from './forbidden';
import resourceRepository from './dataRepository';
import shortUUID from 'short-uuid';

/************* UI Router *************

This is the Reports Controller that controls the handling for all the Report endpoints.

* GET Reports
* CREATE Report
* UPDATE Report
* DELETE Report

authress.hasAccessToResource
authress.getUserResources

**************************************/

const reportController = express.Router();

/** Routes */
// Get Reports
reportController.get('/', async (request: Request, response: Response, next: NextFunction) => {
  const userId = response.locals.userId;
  let allowedReports = null;

  /************* Demo Add Authorization Check *************/



  /********************************************************/

  try {
    const resourceObject = await resourceRepository.getAll(allowedReports);

    response.status(200).json(resourceObject);
  } catch (error) {
    next(error);
  }
});

// Create Report
reportController.post('/', async (request: Request, response: Response, next: NextFunction) => {
  const userId = response.locals.userId;

  try {
    // Create the resource in the database
    const newResourceId = shortUUID.generate();
    const newResourceObject = await resourceRepository.create(newResourceId, request.body);

    // Grant the user access own the resource
    // Owner by default gives full control over this new resource, including the ability to grant others access as well.
    await authress.setRoleForUser(accountId, userId, newResourceId, 'Authress:Owner')

    // Return the new resource
    response.status(200).json({ resourceId: newResourceId });
  } catch (error) {
    next(error);
  }
});

reportController.get('/:id', async (request: Request, response: Response, next: NextFunction) => {
  const userId = response.locals.userId;
  const reportId = request.params.id;

  // Ensure user has permissions to read the resource resources (userId, resourceUri, permission)
  // const userHasPermissionToResource = await authress.hasAccessToResource(userId, `/reports/${reportId}`, 'READ');
  // if (!userHasPermissionToResource) {
  //   response.status(403).json({ title: 'User does not have access to read this resources' });
  //   return;
  // }

  try {
    const resourceObject = await resourceRepository.get(reportId);

    response.status(200).json(resourceObject);
  } catch (error) {
    next(error);
  }
});

export default reportController;