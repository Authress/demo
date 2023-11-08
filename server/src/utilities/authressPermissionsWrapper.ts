import authress, { AuthressClient, ServiceClientTokenProvider, UserResources, UserIdentity, Connection, Tenant, UnauthorizedError, ApiError, TokenVerifier } from 'authress-sdk';
const { ConnectionData } = authress;
import { AssignedUserRoles } from './dtos';
import encryptionManager from './encryptionManager';

const authressDomain = 'https://a48copjrf5qrjn1niakfzfqlp.api-eu-west.authress.io';
const authressLoginDomain = 'https://a48copjrf5qrjn1niakfzfqlp.login.authress.io';

let cachedProperties = null;
class AuthressPermissionsWrapper {

  async getAuthressProperties() {
    if (cachedProperties) {
      return cachedProperties;
    }
    const serviceClientAccessKey = await encryptionManager.getKey();
    await new ServiceClientTokenProvider(serviceClientAccessKey).getToken();
    return cachedProperties = {
      serviceClientAccessKey
    };
  }

  async getAuthressClient(): AuthressClient {
    const properties = await this.getAuthressProperties();
    return new AuthressClient({ baseUrl: authressDomain }, properties.serviceClientAccessKey);
  }

  async verifyUserToken(token: string) {
    return TokenVerifier(authressLoginDomain, token);
  }

  async hasAccessToResource(userId: string, resourceId: string, permission: string): Promise<boolean> {
    try {
      const authressClient = await this.getAuthressClient();
      await authressClient.userPermissions.authorizeUser(userId, resourceId, permission);
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return false;
      }
      throw error;
    }
  }

  // Get all the resources by permission that a user has access to. This only contains explicit permissions specified in Authress
  async getUserResources(resourceUri: string, permission: string = 'READ'): Promise<UserResources> {
    const authressClient = await this.getAuthressClient();
    const response = await authressClient.userPermissions.getUserResources(null, resourceUri, 20, null, permission);
    return response.data;
  }

  // Convert a list of userIds to list of  user data objects
  async getUserDataMap(userIds: Array<string>): Promise<Record<string, UserIdentity>> {
    const userList: Array<UserIdentity | null> = await Promise.all(userIds.map(async userId => {
      try {
        const authressClient = await this.getAuthressClient();
        const result = await authressClient.users.getUser(userId);
        return result.data;
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        console.log({ title: 'Failed to resolve user', level: 'ERROR', userId, error });
        throw error;
      }
    }));

    const filteredUserList: Array<UserIdentity> = userList.filter((u): u is UserIdentity => !!u);
    return filteredUserList.reduce((acc: Record<string, UserIdentity>, user: UserIdentity) => { acc[user.userId] = user; return acc; }, {});
  }

  /*************************************************/
  /*********** USER ROLE MANAGEMENT ****************/
  /*************************************************/

  async getUsersThatHaveAccessToAccount(accountId: string): Promise<Array<AssignedUserRoles>> {
    const authressClient = await this.getAuthressClient();
    const result = await authressClient.resources.getResourceUsers(`accounts/${accountId}`);
    return result.data.users.map(u => ({
      userId: u.userId,
      roles: u.roles.map(r => r.roleId)
    }));
  }

  async getUsersThatHaveAccessToResource(accountId: string, resourceId: string): Promise<Array<AssignedUserRoles>> {
    const authressClient = await this.getAuthressClient();
    const result = await authressClient.resources.getResourceUsers(`accounts/${accountId}/resources/${resourceId}`);
    return result.data.users.map(u => ({
      userId: u.userId,
      roles: u.roles.map(r => r.roleId)
    }));
  }

  async removeUserFromAccount(accountId: string, userId: string): Promise<void> {
    // See {@link setRoleForUser} for where this value comes from
    const recordId = `A:${accountId}:U:${userId}`;

    try {
      const authressClient = await this.getAuthressClient();
      await authressClient.accessRecords.deleteRecord(recordId);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return;
      }
      console.log({ title: 'Failed to remove user from account', level: 'ERROR', error, accountId, userId });
      throw error;
    }
  }

  async setRoleForUser(accountId: string, userId: string, rawResourceUris: string | string[], newRoles: string | string[]): Promise<void> {
    // We are creating an access record to dedicated to this user to define their permissions
    // * In this case we decided that `A` the account and `U` the userId would make up the user's record For different accounts the user will have separate records. Although this doesn't have to be the case, it makes it much easier to delete the access record later.
    const recordId = `A:${accountId}:U:${userId}`;
    const resourceUris: string[] = Array.isArray(rawResourceUris) ? rawResourceUris : [rawResourceUris];

    const authressClient = await this.getAuthressClient();

    try {
      const response = await authressClient.accessRecords.getRecord(recordId);
      if (response.data.status === 'DELETED') {
        throw { status: 404 };
      }
      // Update the roles just for the resource specified
      const resourceUriMap = resourceUris.reduce((acc: Record<string, boolean>, r: string) => { acc[r] = true; return acc; }, {});
      const newStatements = response.data.statements.filter(s => !s.resources.some(r => resourceUriMap[r.resourceUri.replace(/[/][*]$/, '')]))
        .concat(newRoles ? { resources: resourceUris.map(resourceUri => ({ resourceUri })), roles: Array.isArray(newRoles) ? newRoles : [newRoles] } : []);

      await authressClient.accessRecords.updateRecord(recordId, Object.assign({}, response.data,
        { users: [{ userId }], statements: newStatements }
      ));

      return;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw error;
      }

      await authressClient.accessRecords.createRecord({
        recordId,
        name: `Account: ${accountId}, User: ${userId}`,
        users: [{ userId }],
        statements: [{ resources: resourceUris.map(resourceUri => ({ resourceUri })), roles: Array.isArray(newRoles) ? newRoles : [newRoles] }]
      });
    }
  }

  /*************************************************/

  async getExplicitUserResources(userId: string, resourceUri: string, permission: string = 'READ'): Promise<UserResources> {
    const authressClient = await this.getAuthressClient();
    const response = await authressClient.userPermissions.getUserResources(userId, resourceUri, 20, undefined, permission);
    return response.data;
  }
}

export default new AuthressPermissionsWrapper();