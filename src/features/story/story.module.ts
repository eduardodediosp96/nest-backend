import { CronService } from './cron.service';
import { HnService } from './hn.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, HttpModule } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { StorySchema } from './entities/story.entity';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: 'Story', schema: StorySchema }]),
  ],
  controllers: [StoryController],
  providers: [StoryService, HnService, CronService],
})
export class StoryModule {}
