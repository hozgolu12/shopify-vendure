import { Injectable } from "@nestjs/common";
import { TransactionalConnection, ID } from "@vendure/core";
import { BesPosCompany } from "../entities/company.entity";
import { TenantCompanyLocation } from "../entities/company-location.entity";
import { TenantWorkspace } from "../entities/workspace.entity";

@Injectable()
export class CompanyService {
  constructor(private connection: TransactionalConnection) {}

  async findOneById(id: ID): Promise<BesPosCompany | null> {
    return this.connection.getRepository(BesPosCompany).findOne({
      where: { id: id as any },
      relations: ["user", "locations", "workspaces"],
    });
  }

  async findByUserId(userId: ID): Promise<BesPosCompany | null> {
    return this.connection.getRepository(BesPosCompany).findOne({
      where: { userId: userId as any },
      relations: ["locations", "workspaces"],
    });
  }

  async findAll(): Promise<BesPosCompany[]> {
    return this.connection.getRepository(BesPosCompany).find({
      relations: ["user", "locations", "workspaces"],
    });
  }

  async createCompany(input: {
    userId: ID;
    companyDetails: {
      orgName: string;
      orgAddress: string;
      orgPhone: string;
      taxId?: string;
      website?: string;
      socials?: {
        platform: string;
        handle: string;
      };
    };
    locations?: Array<{
      sameAsBilling?: boolean;
      locationName?: string;
      locationAddress?: string;
      locationCountry?: string;
      locationState?: string;
      locationCity?: string;
      locationZipcode?: number;
      locationTaxId?: string;
      locationTypes: {
        sales?: boolean;
        warehouse?: boolean;
        manufacturing?: boolean;
        backOffice?: boolean;
        custom?: boolean;
      };
    }>;
    workspaces?: Array<{
      workspaceName: string;
      productLine: string;
    }>;
  }): Promise<BesPosCompany> {
    const companyRepo = this.connection.getRepository(BesPosCompany);
    const locationRepo = this.connection.getRepository(TenantCompanyLocation);
    const workspaceRepo = this.connection.getRepository(TenantWorkspace);

    // Check if company already exists for this user
    const existingCompany = await this.findByUserId(input.userId);
    if (existingCompany) {
      throw new Error(`Company for user ${input.userId} already exists`);
    }

    const company = companyRepo.create({
      userId: input.userId as number,
      companyDetails: input.companyDetails,
    });

    const savedCompany = await companyRepo.save(company);

    // Create locations if provided
    if (input.locations && input.locations.length > 0) {
      const locations = input.locations.map((location) =>
        locationRepo.create({
          ...location,
          company: savedCompany,
        })
      );
      savedCompany.locations = await locationRepo.save(locations);
    }

    // Create workspaces if provided
    if (input.workspaces && input.workspaces.length > 0) {
      const workspaces = input.workspaces.map((workspace) =>
        workspaceRepo.create({
          ...workspace,
          company: savedCompany,
        })
      );
      savedCompany.workspaces = await workspaceRepo.save(workspaces);
    }

    return this.findOneById(savedCompany.id) as Promise<BesPosCompany>;
  }

  async updateCompany(input: {
    id: ID;
    companyDetails?: {
      orgName?: string;
      orgAddress?: string;
      orgPhone?: string;
      taxId?: string;
      website?: string;
      socials?: {
        platform: string;
        handle: string;
      };
    };
  }): Promise<BesPosCompany> {
    const companyRepo = this.connection.getRepository(BesPosCompany);

    const company = await this.findOneById(input.id);
    if (!company) {
      throw new Error(`Company with id ${input.id} not found`);
    }

    if (input.companyDetails) {
      company.companyDetails = {
        ...company.companyDetails,
        ...input.companyDetails,
      };
    }

    await companyRepo.save(company);
    return this.findOneById(input.id) as Promise<BesPosCompany>;
  }

  async upsertCompany(input: {
    userId: ID;
    companyDetails: {
      orgName: string;
      orgAddress: string;
      orgPhone: string;
      taxId?: string;
      website?: string;
      socials?: {
        platform: string;
        handle: string;
      };
    };
    locations?: Array<{
      sameAsBilling?: boolean;
      locationName?: string;
      locationAddress?: string;
      locationCountry?: string;
      locationState?: string;
      locationCity?: string;
      locationZipcode?: number;
      locationTaxId?: string;
      locationTypes: {
        sales?: boolean;
        warehouse?: boolean;
        manufacturing?: boolean;
        backOffice?: boolean;
        custom?: boolean;
      };
    }>;
    workspaces?: Array<{
      workspaceName: string;
      productLine: string;
    }>;
  }): Promise<BesPosCompany> {
    const existingCompany = await this.findByUserId(input.userId);

    if (existingCompany) {
      return this.updateCompany({
        id: existingCompany.id,
        companyDetails: input.companyDetails,
      });
    } else {
      return this.createCompany(input);
    }
  }

  async addLocation(
    companyId: ID,
    location: {
      sameAsBilling?: boolean;
      locationName?: string;
      locationAddress?: string;
      locationCountry?: string;
      locationState?: string;
      locationCity?: string;
      locationZipcode?: number;
      locationTaxId?: string;
      locationTypes: {
        sales?: boolean;
        warehouse?: boolean;
        manufacturing?: boolean;
        backOffice?: boolean;
        custom?: boolean;
      };
    }
  ): Promise<BesPosCompany> {
    const locationRepo = this.connection.getRepository(TenantCompanyLocation);

    const company = await this.findOneById(companyId);
    if (!company) {
      throw new Error(`Company with id ${companyId} not found`);
    }

    const newLocation = locationRepo.create({
      ...location,
      company,
    });

    await locationRepo.save(newLocation);
    return this.findOneById(companyId) as Promise<BesPosCompany>;
  }

  async addWorkspace(
    companyId: ID,
    workspace: {
      workspaceName: string;
      productLine: string;
    }
  ): Promise<BesPosCompany> {
    const workspaceRepo = this.connection.getRepository(TenantWorkspace);

    const company = await this.findOneById(companyId);
    if (!company) {
      throw new Error(`Company with id ${companyId} not found`);
    }

    const newWorkspace = workspaceRepo.create({
      ...workspace,
      company,
    });

    await workspaceRepo.save(newWorkspace);
    return this.findOneById(companyId) as Promise<BesPosCompany>;
  }

  async deleteCompany(id: ID): Promise<boolean> {
    const result = await this.connection
      .getRepository(BesPosCompany)
      .delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
