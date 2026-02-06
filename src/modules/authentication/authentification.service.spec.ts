import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationService } from './authentication.service';
import { BadRequestException } from '@nestjs/common';

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
    it('should return a string in the format salt.hash', () => {
      const result = service.createPassword('p@$$w0rd');

      const parts = result.split('.');
      expect(parts).toHaveLength(2);

      const [salt, hash] = parts;
      // Salt length: 16 bytes * 2 (hex) = 32 chars
      expect(salt).toHaveLength(32);
      // Hash length: keylen (64 bytes) * 2 (hex) = 128 chars
      expect(hash).toHaveLength(64 * 2);
    });

    it('should generate unique salts', () => {
      const password = 'p@$$w0rd';
      const result1 = service.createPassword(password);
      const result2 = service.createPassword(password);

      const [salt1] = result1.split('.');
      const [salt2] = result2.split('.');

      expect(salt1).not.toBe(salt2);
    });
  });

  describe('validatePassword', () => {
    it('should return true if the password is correct', async () => {
      const password = 'p@$$w0rd';
      const passwordValue = service.createPassword(password);

      const isValid = await service.validatePassword(password, passwordValue);
      expect(isValid).toBe(true);
    });

    it('should throw an error when password is wrong', async () => {
      const password = 'p@$$w0rd';
      const passwordValue = service.createPassword(password);

      await expect(
        service.validatePassword('wrongPassword', passwordValue),
      ).rejects.toThrow(BadRequestException);
    });
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
