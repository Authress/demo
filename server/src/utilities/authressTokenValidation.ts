import { Request, Response, NextFunction } from "express";

import authressPermissionsWrapper from "./authressPermissionsWrapper";

export default async function authressTokenValidation (
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    await authressPermissionsWrapper.getAuthressProperties();
  } catch (error: any) {
    if (error.code === 'InvalidAccessKeyError') {
      response.status(401).json({
        title: 'Your Authress service client access key is invalid. Go to the src/authressPermissionsWrapper.ts and set the serviceClientAccessKey at the top of the file. Instructions can be found in that file.'
      });
      return;
    }
    next(error);
  }

  const authorizationHeader = request.headers.authorization;
  if (!authorizationHeader) {
    response.status(401).json({
      title: 'The response is a 401 to your request to the demo. Your request failed the Authress Token Validator check in the src/authressTokenValidation.ts file',
      error: 'No authorization header was specified'
    });
    return;
  }
  const token = authorizationHeader.replace(/Bearer\s+/i, '').trim();

  try {
    const userIdentity = await authressPermissionsWrapper.verifyUserToken(token);
    response.locals.userId = userIdentity.sub;
  } catch (error: any) {
    if (error.code === 'Unauthorized' || error.code === 'TokenVerificationError') {
      response.status(401).json({
        title: 'The response is a 401 to your request to the demo. Your request failed the Authress Token Validator check in the src/authressTokenValidation.ts file',
        error: {
          code: error.code,
          name: error.name,
          message: error.message,
          reason: error.reason
        }
      });
      return;
    }
    next(error);
    return;
  }

  next();
};