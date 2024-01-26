import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { Organization } from '../data/organization.entity';
import { AddOrganizationDTO } from '../data/organization.dto';

@Injectable()
export class OrganizationService extends PdsCrudHelper<Organization> {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {
    super(organizationRepository);
  }

  async addOrganization(employeeId: string, organizationDTO: AddOrganizationDTO) {
    try {
      const addOrganization = await Promise.all(
        organizationDTO.add.map(async (organizationItem) => {
          const { _id, isEdited, ...rest } = organizationItem;
          return await this.createRecord(rest);
        }),
      );

      const updateOrganization = await Promise.all(
        organizationDTO.update.map(async (organizationItem) => {
          const { _id, isEdited, ...rest } = organizationItem;
          const updateResult = await this.updateRecord(_id, rest);
          if (updateResult.affected > 0) return organizationItem;
        }),
      );

      const deleteOrganization = await Promise.all(
        organizationDTO.delete.map(async (organizationItem) => {
          const { _id, ...rest } = organizationItem;
          const deleteResult = await this.deleteRecord(_id);
          if (deleteResult.affected > 0) return organizationItem;
        }),
      );

      return await this.findAllPdsEmployeeId(employeeId);
    } catch (error) {}
  }
}
