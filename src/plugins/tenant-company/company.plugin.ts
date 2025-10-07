import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { TenantCompany } from "./entities/company.entity";
import { TenantCompanyDetails } from "./entities/company-details.entity";
import { TenantCompanyLocation } from "./entities/company-location.entity";
import { TenantUser } from "../tenant-user/entities/user.entity";
import { CompanyService } from "./services/company.service";
import { TenantCompanyResolver } from "./api/company-admin.resolver";
import { schema } from "./api/api-extensions";

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [TenantCompany, TenantCompanyLocation],
  providers: [CompanyService],
  adminApiExtensions: {
    schema,
    resolvers: [TenantCompanyResolver],
  },
  shopApiExtensions: {
    schema,
    resolvers: [TenantCompanyResolver],
  },
  compatibility: "^3.0.0",
})
export class CompanyPlugin {}
