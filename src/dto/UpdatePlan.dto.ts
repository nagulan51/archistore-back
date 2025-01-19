import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
} from "class-validator";

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number; // prix en euros

  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number; // durée en mois
}
