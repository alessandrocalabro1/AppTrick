import { Controller, Post, Body, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { GeneratorService } from './generator.service';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

import { AiService } from './ai.service';

@Controller('projects')
export class ProjectsController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly generator: GeneratorService,
        private readonly ai: AiService
    ) { }

    @Post()
    async create(@Body() body: { name?: string; config?: any; prompt?: string }) {
        // Ensure a default user exists for MVP
        let user = await this.prisma.user.findFirst({ where: { email: 'guest@example.com' } });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: 'guest@example.com',
                    password: 'password',
                    name: 'Guest User'
                }
            });
        }

        // Logic branching: Prompt vs Manual
        let config = body.config || {};
        let name = body.name || 'Untitled App';

        if (body.prompt) {
            const aiConfig = this.ai.parsePrompt(body.prompt);
            config = aiConfig;
            name = aiConfig.appName;
        }

        // 1. Create DB entry
        const project = await this.prisma.project.create({
            data: {
                name: name,
                userId: user.id,
                config: JSON.stringify(config),
                status: 'GENERATING'
            }
        });

        try {
            // 2. Trigger Generation associated with project
            const zipName = await this.generator.generateProject(project.id, {
                appName: name,
                ...config
            });

            // 3. Update DB
            return await this.prisma.project.update({
                where: { id: project.id },
                data: {
                    status: 'COMPLETED',
                    zipPath: zipName
                }
            });
        } catch (e) {
            await this.prisma.project.update({
                where: { id: project.id },
                data: { status: 'FAILED' }
            });
            throw e;
        }
    }

    @Get()
    async list() {
        const projects = await this.prisma.project.findMany({
            orderBy: { createdAt: 'desc' }
        });
        // Parse config back to JSON for FE
        return projects.map(p => ({
            ...p,
            config: JSON.parse(p.config)
        }));
    }

    @Get(':id/download')
    async download(@Param('id') id: string, @Res() res: Response) {
        const project = await this.prisma.project.findUnique({ where: { id } });
        if (!project || !project.zipPath) {
            throw new NotFoundException('Project not ready');
        }

        const filePath = path.join(process.cwd(), 'uploads', project.zipPath);
        if (!fs.existsSync(filePath)) {
            throw new NotFoundException('File not found on server');
        }

        res.download(filePath);
    }

    @Get(':id/files')
    async getFiles(@Param('id') id: string) {
        // Simple recursive file walker
        const sourceDir = this.generator.getProjectSourcePath(id);
        if (!fs.existsSync(sourceDir)) {
            return { error: 'Source files no longer available' };
        }

        const walk = (dir: string, base: string = ''): any[] => {
            const files = fs.readdirSync(dir);
            let results: any[] = [];
            for (const file of files) {
                const fullPath = path.join(dir, file);
                const relPath = path.join(base, file);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    results = results.concat(walk(fullPath, relPath));
                } else {
                    results.push({
                        path: relPath.replace(/\\/g, '/'),
                        content: fs.readFileSync(fullPath, 'utf8')
                    });
                }
            }
            return results;
        };

        return walk(sourceDir);
    }
}
