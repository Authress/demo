// import authress, { AuthressClient, ServiceClientTokenProvider, UserResources, UserIdentity, Connection, Tenant, UnauthorizedError, ApiError } from 'authress-sdk';

import { authressLoginClient } from "../authressClient";

const serviceUrl = 'http://localhost:8081';

let cachedProperties = null;
class ReportsService {
  async getReports(): Promise<Report[]> {
    let accessToken = null;
    if (await authressLoginClient.userSessionExists()) {
      accessToken = await authressLoginClient.ensureToken({});
    }
    const response = await fetch(`${serviceUrl}/reports`, {
      headers: accessToken && {
        Authorization: `Bearer ${accessToken}`
      } || {}
    });

    return await response.json();
  }
}

export interface Report {
  reportId: string;
  name: string;
};

export default new ReportsService();