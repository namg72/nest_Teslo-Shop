import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength, IsIn } from "class-validator";



export class CreateProductDto {

     @IsString()
     @MinLength(1)   
     title: string;

     @IsNumber()
     @IsPositive()
     @IsOptional()
     price?: number;

     @IsString()
     @IsOptional()
     description?: string;

     @IsString()
     @IsOptional()
     slug?: string;

     @IsInt()
     @IsPositive()
     @IsOptional()
     stock?: number;

     @IsString({each: true})
     @IsArray()
     sizes: string[];

     @IsIn((['men', 'woman', 'Kid', 'Unisex']))
     gender: string;

     @IsString({each: true})
     @IsArray()
     @IsOptional()
     tags: string[];
 
     //columna donde vammos a almacenar las imagenes

     @IsString({each: true})
     @IsArray()
     @IsOptional()
     images?: string[];
 


}



