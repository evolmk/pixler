import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CloneService, type CloneDto } from './clone.service';
import type { AddLocalProjectDto, PatchProjectDto } from '@pixler/shared-types';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projects: ProjectsService,
    private readonly clone: CloneService,
  ) {}

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
  remove(@Param('id') id: string) {
    return this.projects.remove(id);
  }

  @Post('clone')
  cloneRepo(@Body() dto: CloneDto) {
    this.clone.validateGhAvailable();
    return this.clone.clone(dto);
  }
}
