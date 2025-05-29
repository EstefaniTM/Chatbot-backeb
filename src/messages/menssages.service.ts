import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Message, MessageSender } from './message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Conversation } from 'src/conversations/conversation.entity';

@Injectable()
export class MessagesService {
  messageRepo: any;
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message | null> {
    try {
      const conversation = await this.conversationRepository.findOne({
        where: { id: createMessageDto.conversationId },
      });
      if (!conversation) return null;

      const message = this.messageRepository.create({
        content: createMessageDto.content,
        metadata: createMessageDto.metadata,
        conversation: conversation,
        sender: createMessageDto.sender || MessageSender.USER,
        timestamp: new Date(),
      });

      return await this.messageRepository.save(message);
    } catch (err) {
      console.error('Error creating post:', err);
      return null;
    }
  }

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<Message> | null> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const query = this.messageRepo.createQueryBuilder('message');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return await paginate<Message>(query, options);
    } catch (err) {
      console.error('Error retrieving messages:', err);
      return null;
    }
  }
}
