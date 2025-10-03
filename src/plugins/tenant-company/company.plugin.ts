import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { BesPosCompany } from "./entities/company.entity";
import { TenantCompanyDetails } from "./entities/company-details.entity";
import { TenantCompanyLocation } from "./entities/company-location.entity";
import { TenantWorkspace } from "./entities/workspace.entity";
import { TenantUser } from "../tenant-user/entities/user.entity";
import { CompanyService } from "./services/company.service";
import { TenantCompanyResolver } from "./api/company-admin.resolver";
import { schema } from "./api/api-extensions";

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [
    BesPosCompany,
    TenantCompanyDetails,
    TenantCompanyLocation,
    TenantWorkspace,
    TenantUser,
  ],
  providers: [CompanyService],
  adminApiExtensions: {
    schema,
    resolvers: [TenantCompanyResolver],
  },
  shopApiExtensions: {
    schema,
    resolvers: [TenantCompanyResolver],
  },
})
export class CompanyPlugin {}
