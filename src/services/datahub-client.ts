interface PageEntry {
  id: number;
  name: string;
}

interface DomainEntry {
  id: number;
  name: string;
  verified_date: Date;
}

export interface DatahubClient {
  // See: https://github.com/MakingSense/Customer-Data-Hub/blob/0f28f0906b22198622f71867e1cdaf00abd41af1/apisec/swaggerDef.js#L74
  getAccountDomains(): Promise<DomainEntry[]>;
  // TODO: verify what Datahub's service exposes this information, is it based in domain id or domain name?
  getPagesByDomainId(domainId: number): Promise<PageEntry[]>;
}

export class HttpDatahubClient {
  // TODO: implement this class
  public async getAccountDomains() {
    throw new Error('Not implemented');
  }

  getPagesByDomainId(domainId: number) {
    throw new Error('Not implemented');
  }
}
