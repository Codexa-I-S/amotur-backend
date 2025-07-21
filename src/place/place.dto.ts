import { ApiProperty } from "@nestjs/swagger"
import { PartialType } from "@nestjs/swagger"
import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator"

class Coordinates {

  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number

}

export class Contacts {
  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl()
  site?: string;

  @IsOptional()
  @IsUrl()
  instagram?: string;
}
export class createplaceDto {
  @ApiProperty({example:"luar do sertão",description:"nome do lugar"})
  @IsString({ message: "O nome deve ser uma string" })
  @IsNotEmpty({message:"O nome é obrigatório"})
  name: string;

  @ApiProperty({example:"pousada",description:"tipo do lugar"})
  @IsString({ message: "O tipo deve ser uma string" })
  @IsNotEmpty({message:"O tipo é obrigatório"})
  type: string;

  @ApiProperty({example:"pousada",description:"tipo do lugar"})
  @IsString({ message: "O tipo deve ser uma string" })
  @IsNotEmpty({message:"O tipo é obrigatório"})
  localization: string;

  @ApiProperty({example:"um lugar bom",description:"descrição do lugar"})
  @IsString({ message: "A descrição deve ser uma string" })
  @IsNotEmpty({message:"A descrição é obrigatório"})
  description: string;

  @ApiProperty({example:{"lat":-52525,"lon":5213566},description:"coordenadas do lugar"})
  @ValidateNested()
  @Type(()=>Coordinates)
  coordinates: Coordinates;

  @ApiProperty({example:{"telefone":"(88)8888888","site":"www.luardosertao.com.br","email":"luardosertao@email.com","instagram":"https://www.instagram.com/luardosertão/"},description:"contatos do lugar"})
  @ValidateNested()
  @Type(()=>Contacts)
  contacts: Contacts;

  @ApiProperty({example:"http://luarDoSertao.com/logo.png",description:"logo do lugar"})
  @IsString({ message: "O link da logo deve ser uma string" })
  @IsUrl({},{message:"A logo deve ser uma  url"})
  logo: string 

  @ApiProperty({example:["http://img1.jpg","http://img2.jpg","http://img3.jpg"],description:"imagens do lugar"})
  @IsArray()
  @IsString({each: true, message: "Cada link de imagem deve ser uma string" }) 
  @IsNotEmpty({each:true, message:"Cada link deve ser obrigatório"})
  images: string[]
}

export class updateplaceDto extends PartialType(createplaceDto)   {}
