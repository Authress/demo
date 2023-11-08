const reports: Report = [
  { reportId: '001',
    name: 'First Report',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum' },

  { reportId: '002', name: 'Second Report',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum' }
];

class DataRepository {
  async get(reportId: string): Promise<Report> {
    return reports.find(r => r.reportId === reportId);
  }

  async getAll(): Promise<Report[]> {
    return reports;
  }

  async update(reportId: string, data: unknown): Promise<void> {
    reports = reports.filter(r => r.reportId !== reportId).concat({ reportId: newReportId, ...data });
  }

  async delete(reportId: string): Promise<void> {
    reports = reports.filter(r => r.reportId !== reportId);
  }

  async create(newReportId: string, data: unknown): Promise<void> {
    reports.push({ reportId: newReportId, ...data });
  }
}

export default new DataRepository();

export interface Report {
  reportId?: string;
  name?: string;
}