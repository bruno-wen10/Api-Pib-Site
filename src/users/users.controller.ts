import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './users.entity';

// Define a rota base para esse controller: /users
@Controller('users')
export class UsersController {
  // O controller usa o UsersService para acessar o banco
  constructor(private readonly usersService: UsersService) {}

  // POST /users → cria um novo usuário
  @Post()
  create(@Body() user: Partial<User>) { 
    return this.usersService.create(user);
  }

  // GET /users → retorna todos os usuários
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users/:id → retorna 1 usuário pelo ID
  @Get(':id')
  findOneById(@Param('id') id: string) { // @Param pega o valor da URL
    return this.usersService.findById(Number(id)); // Converte para número
  }

  // GET /users/email/:email
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  // PUT /users/:id → atualiza os dados de um usuário
  @Put(':id')
  update(@Param('id') id: string, @Body() user: Partial<User>) {
    return this.usersService.update(Number(id), user);
  }

  // DELETE /users/:id → remove um usuário
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }
}