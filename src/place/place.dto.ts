import { ApiProperty } from "@nestjs/swagger"
import { PartialType } from "@nestjs/swagger"
import { PlaceRegion, PlaceType } from "@prisma/client";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator"

class Coordinates {

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number

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
class ImageObject {
    @IsString()
    url: string
    @IsString()
    public_id: string
}

export class createplaceDto {
  @ApiProperty({example:"luar do sertão",description:"nome do lugar"})
  @IsString({ message: "O nome deve ser uma string" })
  @IsNotEmpty({message:"O nome é obrigatório"})
  name: string;

  @ApiProperty({example:"POUSADA",description:"tipo do lugar"})
  @IsEnum(PlaceType)
  @IsNotEmpty({message:"O tipo é obrigatório"})
  type: PlaceType;

  @ApiProperty({example:"AMONTADA",description:"localização do lugar"})
  @IsEnum(PlaceRegion)
  @IsNotEmpty({message:"A localização é obrigatório"})
  localization: PlaceRegion;

  @ApiProperty({example:"um lugar bom",description:"descrição do lugar"})
  @IsString({ message: "A descrição deve ser uma string" })
  @IsNotEmpty({message:"A descrição é obrigatório"})
  description: string;

  @ApiProperty({example:{"lat":-52525,"lng":5213566},description:"coordenadas do lugar"})
  @ValidateNested()
  @Type(()=>Coordinates)
  coordinates: Coordinates;

  @ApiProperty({example:{"telefone":"(88)8888888","site":"www.luardosertao.com.br","email":"luardosertao@email.com","instagram":"https://www.instagram.com/luardosertão/"},description:"contatos do lugar"})
  @ValidateNested()
  @Type(()=>Contacts)
  contacts: Contacts;

  @ApiProperty({example:"http://luarDoSertao.com/logo.png",description:"logo do lugar"})
  @ValidateNested()
  @Type(() => ImageObject)
  logo: ImageObject

  @ApiProperty({example:["http://img1.jpg","http://img2.jpg","http://img3.jpg"],description:"imagens do lugar"})
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ImageObject)
  images: ImageObject[]
}

export class updateplaceDto extends PartialType(createplaceDto)   {}