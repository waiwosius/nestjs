import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixTimestamps1770390474588 implements MigrationInterface {
  name = 'FixTimestamps1770390474588';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`category\` CHANGE \`created_date\` \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` CHANGE \`updated_date\` \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` CHANGE \`created_date\` \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` CHANGE \`updated_date\` \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product\` CHANGE \`updated_date\` \`updated_date\` datetime(0) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` CHANGE \`created_date\` \`created_date\` datetime(0) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` CHANGE \`updated_date\` \`updated_date\` datetime(0) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` CHANGE \`created_date\` \`created_date\` datetime(0) NOT NULL`,
    );
  }
}
