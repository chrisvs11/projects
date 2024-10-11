import * as dotenv from 'dotenv';

import * as fs from 'fs';

import * as Joi from '@hapi/joi';

import { InternalServerErrorException } from '@nestjs/common';

interface EnvVariables {
  FIREBASE_PROJECT_ID: string;
  FIREBASE_PRIVATE_KEY_ID: string;
  FIREBASE_PRIVATE_KEY: string;
  FIREBASE_CLIENT_EMAIL: string;
  FIREBASE_CLIENT_ID: string;
}


const EnvVariablesSchema = Joi.object<EnvVariables>({
  FIREBASE_PROJECT_ID: Joi.string().required(),
  FIREBASE_PRIVATE_KEY_ID: Joi.string().required(),
  FIREBASE_PRIVATE_KEY: Joi.string().required(),
  FIREBASE_CLIENT_EMAIL: Joi.string().required(),
  FIREBASE_CLIENT_ID: Joi.string().required(),
});

export class ConfigService {
  private readonly envVariables: EnvVariables;

  constructor() {
    const config = dotenv.parse(
      fs.readFileSync('.env'),
    ) as unknown as EnvVariables;

    this.envVariables = this.validate(config);
  }

  public get firebase() {
    return {
      type: 'service_account',
      project_id: this.envVariables.FIREBASE_PROJECT_ID,
      private_key_id: this.envVariables.FIREBASE_PRIVATE_KEY_ID,
      private_key:this.envVariables.FIREBASE_PRIVATE_KEY,
      client_email: this.envVariables.FIREBASE_CLIENT_EMAIL,
      client_id: this.envVariables.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-1ey25%40pacmen-e7657.iam.gserviceaccount.com",
      universe_domain: "googleapis.com",
    };
  }

  private validate(envVariables: EnvVariables) {
    const { error, value } = EnvVariablesSchema.validate(envVariables);

    if (error) {
      throw new InternalServerErrorException(`
        Config validation error:¨${error.message}
      `);
    }

    return value;
  }
}
