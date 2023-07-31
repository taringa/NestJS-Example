import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const mongoConnectionProvider = [
  MongooseModule.forRootAsync({
    useFactory: async (config: ConfigService) => {
      const uri = config.get('app.mongoUrl');
      const options: any = {
        uri,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };

      return options;
    },
    inject: [ConfigService],
  }),
];
