import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { ParseIntPipe } from '../common/pipes/parse-int/parse-int.pipe';
import { Protocol } from '../common/decorators/protocol.decorator';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('coffees')
@UsePipes(ValidationPipe)
@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeesService: CoffeesService, @Inject(REQUEST) private readonly request: Request) {
        console.log('CoffeesController created')
    }

    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @Public()
    @Get()
    async findAll(@Protocol('https') protocol: string, @Query() paginationQuery: PaginationQueryDto) {
        console.log(protocol)
        await new Promise(resolve => setTimeout(resolve, 5000))
        //const { limit, offset } = paginationQuery
        return this.coffeesService.findAll(paginationQuery)
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number){
        console.log(id)
        const coffee = this.coffeesService.findOne(id)
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`)
        }
        return coffee
    }

    @Post()
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        console.log(createCoffeeDto instanceof CreateCoffeeDto)
        return this.coffeesService.create(createCoffeeDto)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
        return this.coffeesService.update(id, updateCoffeeDto)
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.coffeesService.remove(id)
    }
}
