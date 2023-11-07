import { AuthressClient } from 'authress-sdk';
import express, { NextFunction, Request, Response } from 'express';

import resourceRepository from './dataRepository';
import authressPermissionsWrapper from '../authressPermissionsWrapper';

authressPermissionsWrapper.getAuthressProperties();

const reportController = express.Router();
export default reportController;

/** Routes */
// Get a resource
reportController.get('/:id', async (request: Request, response: Response, next: NextFunction) => {
  const userId = response.locals.userId;
  const accountId = request.params.accountId;
  const reportId = request.params.id;

  // Ensure user has permissions to read the resource resources (userId, resourceUri, permission)
  // const userHasPermissionToResource = await authressPermissionsWrapper.hasAccessToResource(userId, `/reports/${reportId}`, 'READ');
  // if (!userHasPermissionToResource) {
  //   response.status(403).json({ title: 'User does not have access to read this resources' });
  //   return;
  // }

  try {
    const resourceObject = await resourceRepository.get(`${accountId}|${reportId}`);

    response.status(200).json(resourceObject);
  } catch (error) {
    next(error);
  }
});

// Create a resource
reportController.post('/', async (request: Request, response: Response, next: NextFunction) => {
  const userId = response.locals.userId;
  const accountId = request.params.accountId;

  // Ensure user has permissions to create resources (userId, resourceUri, permission)
  // const userHasPermissionToResource = await authressPermissionsWrapper.hasAccessToResource(userId, `/reports`, 'CREATE');
  // if (!userHasPermissionToResource) {
  //   response.status(403).json({ title: 'User does not have access to create resources' });
  //   return;
  // }

  try {
    // Create the resource in the database
    const newResourceId = `new-resource-1`;
    // Resources are scoped to an account, that means that for the user they will see `newResourceId` but our Database and Authress have to see `accountId/newResourceId` which includes the accountId
    const globalIdentifierForResourceId = `${accountId}|${newResourceId}`;
    const newResourceObject = await resourceRepository.create(globalIdentifierForResourceId, request.body);

    // Grant the user access own the resource
    // Owner by default gives full control over this new resource, including the ability to grant others access as well.
    // await authressPermissionsWrapper.setRoleForUser(accountId, userId, globalIdentifierForResourceId, 'Authress:Owner')

    // Return the new resource
    response.status(200).json({ resourceId: newResourceId });
  } catch (error) {
    next(error);
  }
});