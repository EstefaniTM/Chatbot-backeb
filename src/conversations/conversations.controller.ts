import {
  Controller,
  Post as HttpPost,
  Get,
  Param,
  Body,
  Query,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation } from './conversation.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @HttpPost()
  async create(
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<SuccessResponseDto<Conversation>> {
    const conversation = await this.conversationsService.create(
      createConversationDto,
    );
    if (!conversation)
      throw new NotFoundException('Error creating conversation');
    return new SuccessResponseDto(
      'Conversation created successfully',
      conversation,
    );
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<SuccessResponseDto<Pagination<Conversation>>> {
    const conversations = await this.conversationsService.findAll({
      page,
      limit,
    });

    if (!conversations) {
      throw new InternalServerErrorException('Error retrieving conversations');
    }

    return new SuccessResponseDto(
      'Conversations retrieved successfully',
      conversations,
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto<Conversation>> {
    const conversation = await this.conversationsService.findOne(id);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return new SuccessResponseDto(
      'Conversation retrieved successfully',
      conversation,
    );
  }
}
