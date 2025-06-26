import { ApiProperty } from "@nestjs/swagger"
import { PartialType } from "@nestjs/swagger"

type images = string[]

type coordenadas = {
lat: number
lon: number
}

type contacts = {}
export class createplaceDto {
  @ApiProperty({example:"luar do sertão",description:"nome do lugar"})
  name: string;
  @ApiProperty({example:"pousada",description:"tipo do lugar"})
  type: string;
  @ApiProperty({example:"um lugar bom",description:"descrição do lugar"})
  description: string;
  @ApiProperty({example:{"lat":-52525,"lon":5213566},description:"cooedenadas do lugar"})
  coordinates: coordenadas ;
  @ApiProperty({example:{"telefone":"(88)8888888","site":"www.luardosertao.com.br","email":"luardosertao@email.com"},description:"contatos do lugar"})
  contacts: contacts;
  @ApiProperty({example:"http://luarDoSertao/logo.png",description:"logo do lugar"})
  logo: string 
  @ApiProperty({example:["http://img1.jpg","http://img2.jpg","http://img3.jpg"],description:"imagens do lugar"})
  images: images
}

export class updateplaceDto extends PartialType(createplaceDto)   {}
