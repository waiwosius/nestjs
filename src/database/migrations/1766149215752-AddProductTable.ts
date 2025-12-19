import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductTable1766149215752 implements MigrationInterface {
    name = 'AddProductTable1766149215752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_date\` datetime NOT NULL, \`updated_date\` datetime NOT NULL, \`title\` varchar(255) NULL, \`description\` text NULL, \`number\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`product\``);
    }

}
