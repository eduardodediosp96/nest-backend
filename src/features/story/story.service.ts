import { ConfigService } from '@nestjs/config';
import { Story } from './entities/story.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel('Story') private readonly storyModel: Model<Story>,
    private configService: ConfigService,
  ) {}

  async create(createStoryDto: CreateStoryDto) {
    const newStory = new this.storyModel({
      title: createStoryDto.title,
      author: createStoryDto.author,
      url: createStoryDto.url,
      createdAt: createStoryDto.createdAt,
      active: 1,
    });
    await newStory.save();
  }

  async findAll(take: number = 2, limit: number = 25) {
    var query = {};
    const stories = await this.storyModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(limit * (take - 1))
      .limit(limit)
      .exec();
    return stories as Story[];
  }

  async findOne(id: number) {
    const story = await this.findStory(id);
    return story;
  }

  async findStory(id: number): Promise<Story> {
    const story = await this.storyModel.findById(id);
    if (story) {
      throw new NotFoundException('could not find the story');
    } else {
      return story as Story;
    }
  }

  update(id: number, updateStoryDto: UpdateStoryDto) {
    return `This action updates a #${id} story`;
  }

  remove(id: number) {
    return `This action removes a #${id} story`;
  }
}
