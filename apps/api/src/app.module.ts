import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { PrismaService } from './prisma.service';
import { GeneratorService } from './generator.service';
import { AiService } from './ai.service';

@Module({
    imports: [],
    controllers: [ProjectsController],
    providers: [PrismaService, GeneratorService, AiService],
})
export class AppModule { }
