import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
    constructor(private config: ConfigService) { }

    createMongooseOptions(): MongooseModuleOptions | Promise<MongooseModuleOptions> {
        const userName = this.config.get("DATABASE_USER");
        const password = this.config.get("DATABASE_PASSWORD");
        const host = this.config.get("DATABASE_HOST");
        const db = this.config.get("DATABASE_NAME");
        const uri = `mongodb+srv://${userName}:${password}@${host}/${db}?retryWrites=true&w=majority`;
        return { uri };
    }
}
