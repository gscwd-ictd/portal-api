import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CandidateResigned } from './candidate-resigned/data/candidate-resigned.entity';
import { Convicted } from './convicted/data/convicted.entity';
import { PdsSupportingDetailsDto } from './data/pds-supporting-details.dto';
import { GuiltyCharged } from './guilty-charged/data/guilty-charged.entity';
import { Immigrant } from './immigrant/data/immigrant.entity';
import { IndigenousPWDSoloParent } from './indigenous-pwd-soloparent/data/indigenous-pwd-soloparent.entity';
import { OfficeRelation } from './office-relation/data/office-relation.entity';
import { SeparatedService } from './separated-service/data/separated-service.entity';

@Injectable()
export class PdsSupportingDetailsService {
  constructor(private readonly dataSource: DataSource) {}

  async updatePdsSupportingDetailsService(pdsSupportingDetailsDto: PdsSupportingDetailsDto) {
    const {
      candidateResigned,
      convicted,
      guiltyCharged,
      immigrant,
      indigenousPwdSoloParent,
      officeRelation,
      separatedService,
    } = pdsSupportingDetailsDto;
    const repo = await this.dataSource.transaction(async (transactionEntityManager) => {
      const candidateResignedResult = await transactionEntityManager
        .getRepository(CandidateResigned)
        .createQueryBuilder()
        .update()
        .set(candidateResigned)
        .where({ employeeId: candidateResigned.employeeId })
        .execute();

      // const governmentIssuedIdResult = await transactionEntityManager
      //   .getRepository(GovernmentIssuedId)
      //   .createQueryBuilder()
      //   .update()
      //   .set(governmentIssuedId)
      //   .where({ employeeId })
      //   .execute();

      const guiltyChargedResult = await transactionEntityManager
        .getRepository(GuiltyCharged)
        .createQueryBuilder()
        .update()
        .set(guiltyCharged)
        .where({ employeeId: guiltyCharged.employeeId })
        .execute();

      const immigrantResult = await transactionEntityManager
        .getRepository(Immigrant)
        .createQueryBuilder()
        .update()
        .set(immigrant)
        .where({ employeeId: immigrant.employeeId })
        .execute();

      const indigenousPwdSoloParentResult = await transactionEntityManager
        .getRepository(IndigenousPWDSoloParent)
        .createQueryBuilder()
        .update()
        .set(indigenousPwdSoloParent)
        .where({ employeeId: indigenousPwdSoloParent.employeeId })
        .execute();

      const officeRelationResult = await transactionEntityManager
        .getRepository(OfficeRelation)
        .createQueryBuilder()
        .update()
        .set(officeRelation)
        .where({ employeeId: officeRelation.employeeId })
        .execute();

      const separatedServiceResult = await transactionEntityManager
        .getRepository(SeparatedService)
        .createQueryBuilder()
        .update()
        .set(separatedService)
        .where({ employeeId: separatedService.employeeId })
        .execute();

      const convictedResult = await transactionEntityManager
        .getRepository(Convicted)
        .createQueryBuilder()
        .update()
        .set(convicted)
        .where({ employeeId: convicted.employeeId })
        .execute();

      return {
        candidateResigned,
        guiltyCharged,
        immigrant,
        indigenousPwdSoloParent,
        officeRelation,
        separatedService,
        convicted,
      };
    });

    return repo;
  }
}
