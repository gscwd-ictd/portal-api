import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppCredentials } from '../../../../utils/types/auth-type';
import { Repository } from 'typeorm';
import { CrudHelper } from '../../../../utils/helpers/crud';
import { CreateClientAppDto } from '../data/client-app.dto';
import { ClientApp } from '../data/client-app.entity';
import { RandomizerService } from '../misc/randomizer.service';

@Injectable()
export class ClientAppService extends CrudHelper<ClientApp> {
  constructor(
    @InjectRepository(ClientApp)
    private readonly clientAppRepository: Repository<ClientApp>,

    // inject randomizer service
    private readonly randomizerService: RandomizerService,
  ) {
    super(clientAppRepository);
  }

  async createApp(app: CreateClientAppDto) {
    // generate client secret before inserting to database
    const secret = this.randomizerService.generateSecret(50);

    // insert new client app in the database
    const newClientApp = await this.createRecord({ ...app, secret });

    // return new client app without the secret
    return this.randomizerService.removeSecret(newClientApp);
  }

  async verifyApp(credentials: AppCredentials) {
    // find app by its id
    const clientApp = await this.findRecordById(credentials.clientId);

    // compare the secrets if they match
    this.randomizerService.compareSecret(clientApp.secret, credentials.secret);

    // return client app without the secret
    return this.randomizerService.removeSecret(clientApp);
  }
}
