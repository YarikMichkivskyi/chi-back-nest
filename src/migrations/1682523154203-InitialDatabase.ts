import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1682523154203 implements MigrationInterface {
    name = 'InitialMigration1682523154203';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "username" VARCHAR(255) NOT NULL UNIQUE,
                "password" VARCHAR(255) NOT NULL,
                "isAdmin" BOOLEAN NOT NULL DEFAULT FALSE,
                PRIMARY KEY ("id")
            );

            CREATE TABLE "exhibits" (
                "id" SERIAL NOT NULL,
                "description" TEXT NOT NULL,
                "imageUrl" VARCHAR(255) NOT NULL,
                "ownerId" INT NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                PRIMARY KEY ("id"),
                CONSTRAINT "FK_Exhibits_Owner" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE
            );

            CREATE TABLE "comments" (
                "id" SERIAL NOT NULL,
                "text" TEXT NOT NULL,
                "ownerId" INT NOT NULL,
                "exhibitId" INT NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                PRIMARY KEY ("id"),
                CONSTRAINT "FK_Comments_Owner" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_Comments_Exhibit" FOREIGN KEY ("exhibitId") REFERENCES "exhibits"("id") ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "comments";`);
        await queryRunner.query(`DROP TABLE "exhibits";`);
        await queryRunner.query(`DROP TABLE "users";`);
    }
}