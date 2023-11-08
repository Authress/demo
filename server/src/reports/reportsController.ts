import { AuthressClient } from 'authress-sdk';
import express, { NextFunction, Request, Response } from 'express';

import resourceRepository from './dataRepository';
import authressPermissionsWrapper from '../utilities/authressPermissionsWrapper';

function forbidden(response) {
  response.status(403).json({ title: 'User does not have access to read this resources' });
  return;
}

const reportController = express.Router();
export default reportController;

/** Routes */
// Get Reports
reportController.get('/', async (request: Request, response: Response, next: NextFunction) => {
  const userId = response.locals.userId;
  let allowedReports = null;

  /************* Add Authorization Check *************/

  // const result = await authressPermissionsWrapper.hasAccessToResource(userId, '/reports', 'reports:get');
  // if (!result) {
  //   return forbidden(response);
  // }

  // const result = await authressPermissionsWrapper.getUserResources(userId, '/reports', 'reports:get');
  // allowedReports = result;

  /***************************************************/

  try {
    const resourceObject = await resourceRepository.getAll(allowedReports);

    response.status(200).json(resourceObject);
  } catch (error) {
    next(error);
  }
});

reportController.get('/:id', async (request: Request, response: Response, next: NextFunction) => {
  const userId = response.locals.userId;
  const reportId = request.params.id;

  // Ensure user has permissions to read the resource resources (userId, resourceUri, permission)
  // const userHasPermissionToResource = await authressPermissionsWrapper.hasAccessToResource(userId, `/reports/${reportId}`, 'READ');
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

// Create Report
reportController.post('/', async (request: Request, response: Response, next: NextFunction) => {
  const userId = response.locals.userId;

  // Ensure user has permissions to create resources (userId, resourceUri, permission)
  // const userHasPermissionToResource = await authressPermissionsWrapper.hasAccessToResource(userId, `/reports`, 'CREATE');
  // if (!userHasPermissionToResource) {
  //   response.status(403).json({ title: 'User does not have access to create resources' });
  //   return;
  // }

  try {
    // Create the resource in the database
    const newResourceId = `new-resource-1`;
    const newResourceObject = await resourceRepository.create(newResourceId, request.body);

    // Grant the user access own the resource
    // Owner by default gives full control over this new resource, including the ability to grant others access as well.
    // await authressPermissionsWrapper.setRoleForUser(accountId, userId, globalIdentifierForResourceId, 'Authress:Owner')

    // Return the new resource
    response.status(200).json({ resourceId: newResourceId });
  } catch (error) {
    next(error);
  }
});