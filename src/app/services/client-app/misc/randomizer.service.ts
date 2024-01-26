import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientApp } from '../data/client-app.entity';

@Injectable()
export class RandomizerService {
  public generateSecret(length: number): string {
    // create an in-memory variable that will hold the randomized string value
    let result = '';

    // specify the accpeted characters to be included in the randomized string
    const charset = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789';

    // loop through the length specified and generate random string
    for (let i = 0; i < length; i++) result += charset.charAt(Math.floor(Math.random() * charset.length));

    // return the generated random string
    return result;
  }

  public compareSecret(secretFromDb: string, secretFromClient: string): void {
    // throw an error if client secrets don't match
    if (secretFromDb !== secretFromClient) throw new HttpException('Invalid client secret', HttpStatus.FORBIDDEN);
  }

  public removeSecret(clientApp: ClientApp) {
    // remove client app secret
    delete clientApp.secret;

    // return client app without secret
    return clientApp;
  }
}
