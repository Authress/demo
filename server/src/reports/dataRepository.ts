import { UserResources } from "authress-sdk";

const reports: Report = [
  { reportId: '001',
    name: 'Application of Tachyon Pulses',
    status: 'COMPLETED',
    text: 'This paper suggests that mental units called psychons by Eccles could be tachyons defined theoretically by physicists sometime ago. Although experiments to detect faster-than-light particles have not been successful so far, recently, there has been renewed interest in tachyon theories in various branches of physics. We suggest that tachyon theories may be applicable to brain physics. Eccles proposed an association between psychons and what he called dendrons which are dendrite bundles and basic anatomical units of the neocortex for reception. We show that a zero-energy tachyon could act as a trigger for exocytosis (modeled by Friedrich Beck as a quantum tunneling process), not merely at a single presynaptic terminal but at all selected terminals in the interacting dendron by momentarily transferring momentum to vesicles, thereby decreasing the effective barrier potential and increasing the probability of exocytosis at all boutons at the same time. This is consistent with the view of tachyons, which treats them as strictly non-local phenomenon produced and absorbed instantaneously and non-locally by detectors acting in a coherent and cooperative way.' },

  { reportId: '002', name: "We weren't able to find the droids we were looking for",
    status: 'FAILED',
    text: 'This report concludes with the inability to find the droids we were looking for in the Tatoo system. Our search started on Tatooine, but they were not found. We have no idea where they could be. Some evidence suggests they were present, but might have moved along by now. We will continue our search in the Alderaan System.' },

    { reportId: '003', name: "Exploration halted at 20,000 Leagues",
    status: 'IN_PROGRESS',
    text: "We've had to put on hiatus our exploration attempt at the bottom of the ocean. It has become much too deep for us to continue. To add to the challenges of the situation, unexpected and strange events have started to occur around us. One two separate occasions, huge denizens of the deep appeared on our radar and some of the crew is not comfortable to continue with the expedition. One discovery of a large sphere beneath the vessel has given the team both curiosity and motivation to continue." },

    { reportId: '004', name: "Found a Glitch",
    status: 'IN_PROGRESS',
    text: "The team investigating the nature of reality believes they have discovered a glitch in the fabric of this dimension. This paper investigates how our world contains an ether like substance that can be programmed. In this way we are able to enter precise orders in a matrix format and instruct the reality to change at will. So far this experiment has been restricted to only our lab and has not been tested outside, but the leading indicators show that this phenomenon might not be restricted to the subspace that we have been operating in." }
];

class DataRepository {
  async get(reportId: string): Promise<Report> {
    return reports.find(r => r.reportId === reportId);
  }

  async getAll(allowedReports: UserResources): Promise<Report[]> {
    if (!allowedReports || allowedReports.accessToAllSubResources) {
      return reports;
    }

    const reportIds = allowedReports.resources.map(r => r.resourceUri.split('/').filter(v => v)[1]);
    const hasAllAccess = reportIds.some(id => id === '*');
    if (hasAllAccess) {
      return reports;
    }
    const allowedReportsMap = reportIds.reduce((acc, r) => ({ ...acc, [r]: true }), {});
    return reports.filter(r => allowedReportsMap[r.reportId]);
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