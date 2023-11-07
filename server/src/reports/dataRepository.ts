
class DataRepository {
  async get(reportId: string): Promise<Report> {
    const report: Report = {};
    return report;
  }

  async getAll(): Promise<Report[]> {
    return [];
  }

  async update(reportId: string, data: unknown): Promise<void> {
  }

  async delete(reportId: string): Promise<void> {
  }

  async create(newReportId: string, data: unknown): Promise<void> {
  }
}

export default new DataRepository();

export interface Report {
  reportId?: string;
  name?: string;
}