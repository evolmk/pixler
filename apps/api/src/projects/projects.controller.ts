import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import type { AddLocalProjectDto, PatchProjectDto, DeleteProjectMode } from '@pixler/shared-types';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  findAll() {
    return this.projects.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projects.findOne(id);
  }

  @Post('add-local')
  addLocal(@Body() dto: AddLocalProjectDto) {
    return this.projects.addLocal(dto);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() dto: PatchProjectDto) {
    return this.projects.patch(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query('mode') mode: DeleteProjectMode = 'remove',
  ) {
    return this.projects.remove(id, mode);
  }
}
