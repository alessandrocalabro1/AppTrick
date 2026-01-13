import { Injectable } from '@nestjs/common';

export interface AppConfig {
    appName: string;
    features: string[];
    entities: { name: string; fields: { name: string; type: string; optional: boolean }[] }[];
}

@Injectable()
export class AiService {
    parsePrompt(prompt: string): AppConfig {
        // SIMULATED LLM: In a real app, this would call OpenAI/Gemini
        // Here we use keyword detection to "hallucinate" an app structure.

        const p = prompt.toLowerCase();

        const config: AppConfig = {
            appName: 'My App',
            features: ['Authentication'],
            entities: []
        };

        // 1. Detect Name
        if (p.includes('blog')) config.appName = 'My Blog';
        else if (p.includes('shop') || p.includes('store') || p.includes('commerce')) config.appName = 'My Shop';
        else if (p.includes('task') || p.includes('todo') || p.includes('project')) config.appName = 'Task Manager';
        else if (p.includes('crm')) config.appName = 'My CRM';

        // 2. Detect Features
        if (p.includes('pay') || p.includes('buy') || p.includes('money')) config.features.push('Payments');
        if (p.includes('image') || p.includes('file') || p.includes('upload')) config.features.push('File Storage');
        if (p.includes('admin') || p.includes('dashboard')) config.features.push('Admin Panel');
        if (p.includes('chat') || p.includes('ai')) config.features.push('AI Chat');

        // 3. Detect Entities (The "Magic")
        if (p.includes('shop') || p.includes('store') || p.includes('commerce')) {
            config.entities.push(
                {
                    name: 'Product', fields: [
                        { name: 'name', type: 'String', optional: false },
                        { name: 'price', type: 'Int', optional: false },
                        { name: 'description', type: 'String', optional: true },
                        { name: 'stock', type: 'Int', optional: false }
                    ]
                },
                {
                    name: 'Order', fields: [
                        { name: 'total', type: 'Int', optional: false },
                        { name: 'status', type: 'String', optional: false },
                        { name: 'customerEmail', type: 'String', optional: true }
                    ]
                }
            );
        } else if (p.includes('blog') || p.includes('news')) {
            config.entities.push(
                {
                    name: 'Post', fields: [
                        { name: 'title', type: 'String', optional: false },
                        { name: 'content', type: 'String', optional: false },
                        { name: 'published', type: 'Boolean', optional: false }
                    ]
                },
                {
                    name: 'Comment', fields: [
                        { name: 'text', type: 'String', optional: false },
                        { name: 'author', type: 'String', optional: true }
                    ]
                }
            );
        } else if (p.includes('task') || p.includes('todo')) {
            config.entities.push(
                {
                    name: 'Task', fields: [
                        { name: 'title', type: 'String', optional: false },
                        { name: 'done', type: 'Boolean', optional: false },
                        { name: 'dueDate', type: 'DateTime', optional: true }
                    ]
                },
                {
                    name: 'Project', fields: [
                        { name: 'name', type: 'String', optional: false },
                        { name: 'description', type: 'String', optional: true }
                    ]
                }
            );
        } else {
            // Generic Fallback
            config.entities.push({
                name: 'Item',
                fields: [{ name: 'name', type: 'String', optional: false }]
            });
        }

        // Always add User if Auth
        if (config.features.includes('Authentication') || true) { // Defaulting user to always true for MVP
            config.entities.unshift({
                name: 'User',
                fields: [
                    { name: 'email', type: 'String', optional: false },
                    { name: 'name', type: 'String', optional: true }
                ]
            });
        }

        return config;
    }
}
