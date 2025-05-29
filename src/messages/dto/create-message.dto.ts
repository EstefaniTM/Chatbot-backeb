import { IsDate, IsString } from 'class-validator';
import { MessageSender } from '../message.entity';
export class CreateMessageDto {
  @IsString()
  content: string;

  sender: MessageSender;

  @IsString()
  conversationId: string;

  @IsString()
  metadata: string;

  @IsDate()
  timestamp: Date;
}
