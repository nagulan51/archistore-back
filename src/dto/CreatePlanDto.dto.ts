import { IsString, IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  tvaPercent: number;

  @IsNumber()
  @Min(1)
  storageSize: number;

  @IsNumber()
  @Min(1)
  duration: number;

  constructor(
    name: string,
    description: string,
    price: number,
    tvaPercent: number,
    storageSize: number,
    duration: number
  ) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tvaPercent = tvaPercent;
    this.storageSize = storageSize;
    this.duration = duration;
  }
}
