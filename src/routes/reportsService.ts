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

    if (response.ok) {
      return await response.json();
    }

    if (response.status === 401) {
      throw Error('Unauthorized');
    }

    throw Error('Forbidden');
  }
}

export interface Report {
  reportId: string;
  name: string;
};

export default new ReportsService();