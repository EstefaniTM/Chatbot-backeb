import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Conversation, ConversationStatus } from './conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _createConversationDto: CreateConversationDto,
  ): Promise<Conversation | null> {
    try {
      const conversationData: Partial<Conversation> = {
        status: ConversationStatus.ACTIVE,
        started_at: new Date(),
      };

      const conversation = this.conversationRepository.create(conversationData);
      return await this.conversationRepository.save(conversation);
    } catch (err) {
      console.error('Error creating conversation:', err);
      return null;
    }
  }

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<Conversation> | null> {
    try {
      const queryBuilder =
        this.conversationRepository.createQueryBuilder('conversation');
      queryBuilder.orderBy('conversation.started_at', 'DESC');
      return await paginate<Conversation>(queryBuilder, options);
    } catch (err) {
      console.error('Error retrieving conversations:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Conversation | null> {
    try {
      return await this.conversationRepository.findOne({
        where: { id },
        relations: ['messages', 'user'],
      });
    } catch (err) {
      console.error('Error retrieving conversation:', err);
      return null;
    }
  }
}
