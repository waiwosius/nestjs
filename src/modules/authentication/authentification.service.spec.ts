import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationService } from './authentication.service';
import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mocked-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('createPassword', () => {
    it('should return an Argon2 hash string', async () => {
      const password = 's3cr3t';
      const result = await service.createPassword(password);

      expect(typeof result).toBe('string');
      expect(result).toMatch(/^\$argon2/);
    });

    it('should generate hashes (random salts) for the same password', async () => {
      const password = 'p@$$w0rd';
      const hash1 = await service.createPassword(password);
      const hash2 = await service.createPassword(password);

      expect(hash1).not.toEqual(hash2);
    });
  });

  describe('validatePassword', () => {
    it('should resolve if the password is correct', async () => {
      const password = 's3cr3t';
      const validHash = await argon2.hash(password);

      await expect(
        service.validatePassword(password, validHash),
      ).resolves.not.toThrow();
    });

    it('should throw an error when password is wrong', async () => {
      const password = 'p@$$w0rd';
      const validHash = await argon2.hash(password);

      await expect(
        service.validatePassword('wrongPassword', validHash),
      ).rejects.toThrow(UnauthorizedException);
    });

    describe('createAccessToken', () => {
      it('should create access token', async () => {
        const userId = 42;
        const result = await service.createAccessToken(userId);

        expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
        expect(jwtService.signAsync).toHaveBeenCalledWith({
          userId,
        });
        expect(result).toBe('mocked-jwt-token');
      });
    });
  });
});
