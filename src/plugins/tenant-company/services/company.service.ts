import { Injectable } from "@nestjs/common";
import { TransactionalConnection, ID } from "@vendure/core";
import { TenantCompany } from "../entities/company.entity";
import { TenantCompanyLocation } from "../entities/company-location.entity";

@Injectable()
export class CompanyService {
  constructor(private connection: TransactionalConnection) {}

  async findOneById(id: ID): Promise<TenantCompany | null> {
    return this.connection.getRepository(TenantCompany).findOne({
      where: { id: id as any },
      relations: ["user", "locations"],
    });
  }

  async findByUserId(userId: ID): Promise<TenantCompany | null> {
    return this.connection.getRepository(TenantCompany).findOne({
      where: { user: { id: userId as any } },
      relations: ["locations"],
    });
  }

  async findAll(): Promise<TenantCompany[]> {
    return this.connection.getRepository(TenantCompany).find({
      relations: ["user", "locations"],
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
  }): Promise<TenantCompany> {
    const companyRepo = this.connection.getRepository(TenantCompany);
    const locationRepo = this.connection.getRepository(TenantCompanyLocation);

    // Check if company already exists for this user
    const existingCompany = await this.findByUserId(input.userId);
    if (existingCompany) {
      throw new Error(`Company for user ${input.userId} already exists`);
    }

    const company = companyRepo.create({
      user: { id: input.userId as number },
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

    return this.findOneById(savedCompany.id) as Promise<TenantCompany>;
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
  }): Promise<TenantCompany> {
    const companyRepo = this.connection.getRepository(TenantCompany);

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
    return this.findOneById(input.id) as Promise<TenantCompany>;
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
  }): Promise<TenantCompany> {
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
  ): Promise<TenantCompany> {
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
    return this.findOneById(companyId) as Promise<TenantCompany>;
  }

  async deleteCompany(id: ID): Promise<boolean> {
    const result = await this.connection
      .getRepository(TenantCompany)
      .delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
