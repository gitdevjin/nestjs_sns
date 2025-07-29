import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class BasePaginationDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  //@Type(()=> Number) this converts string to number but can be replaced with transformOptions of validationPipe in main.ts
  @IsNumber()
  @IsOptional()
  where__id__more_than?: number;

  @IsNumber()
  @IsOptional()
  where__id__less_than?: number;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt: 'DESC' | 'ASC' = 'ASC';

  @IsNumber()
  @IsOptional()
  take: number = 20;
}
