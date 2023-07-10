import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumberString, ValidateIf } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @ValidateIf((dto) => dto.size)
  @IsNumberString()
  page?: string;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @ValidateIf((dto) => dto.page)
  @IsNumberString()
  size?: string;
}
