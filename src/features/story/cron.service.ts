import { map } from 'rxjs/operators';
import { Story } from './entities/story.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Injectable, HttpService } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';

@Injectable()
export class CronService {
  constructor(
    private http: HttpService,
    private configService: ConfigService,
    @InjectModel('Story') private readonly storyModel: Model<Story>,
  ) {}

  @Cron('0 0 */1 * * *')
  runEveryHour() {
    const uri = this.configService.get('HN_API');
    const list = this.http.get(uri).pipe(map((response: any) => response.data));
    list.subscribe((item: any) => {
      item.hits.map((x: any, i: number) => {
        console.log('dato', x);
        var isThereAnyTitle = x.title ? x.title : x.story_title || null;
        if (isThereAnyTitle) {
          const newStory = new this.storyModel({
            title: x.title ? x.title : x.story_title || '',
            author: x.author || '',
            url: x.url ? x.url : x.story_url || '',
            createdAt: x.created_at || Date.now(),
            active: 1,
          });
          // newStory.save();
        }
      });
    });
  }
}
