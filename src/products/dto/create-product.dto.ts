import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product Title',
    nullable: false,
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  readonly title: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly price?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(3)
  readonly slug?: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsOptional()
  readonly stock?: number;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  readonly sizes: string[];

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  readonly tags: string[];

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  readonly images?: string[];

  @ApiProperty()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  readonly gender: string;
}
