# API da SQUAD 3 para o projeto AMOTUR

## Descrição

### Aplicação responsável pelo o back-end do projeto AMOTUR

## Instalação
#### Primeiro clona o repositório na sua máquina colocando no terminal:
```bash
$ git chone https://github.com/liandersonDesen/squad-03-server.git
```
#### Abra a pasta do projeto no terminal e instale as dependências :
```bash
$ npm install
```

## Banco de dados 

### Para usar o Banco de dados precisa instalar o Docker
#### Com o docker instalado 
Vá no arquvio .env.example e altere as variáveis e apague a extensão .example para ter seu o seu arquivo .env   

#### Instalar o banco de dados no docker 
 Essa instalação só precisa acontecer uma vez
```bash
npm run docker:compose
```
#### Instalar as tabelas
criando as tabelas:
```bash
npm run prisma:create
## irá pedir um nome (ex: init ou create_table)
```
colocando as tabelas no banco de dados:
```bash
npm run prisma:activate
```
caso der algum erro nesse processo:
```bash
npm run prisma:reset
```
## Rodar a aplicação
### Para rodar o servidor e ter as rotas rodando em localhost:3000 
```bash
npm run start:dev
```
### Para ver a documentação 
#### Com o servidor rodando, basta ir no navegador e acessar:
### localhost:3000/api

## Para ver o banco de Dados
### Verificar se o banco de dados está rodando no docker 
#### Se estiver basta fazer:
```bash
npm run prisma:studio
```
