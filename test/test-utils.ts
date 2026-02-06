import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';

export async function getAccessToken(
  app: INestApplication,
  email: string,
): Promise<string> {
  const response = await supertest(app.getHttpServer())
    .post('/authentication/sign-in')
    .send({
      email: email,
      password: 'p@$$w0rd',
    })
    .expect(200);

  return response.body.accessToken;
}
