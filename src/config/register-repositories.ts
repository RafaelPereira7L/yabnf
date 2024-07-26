import { container } from "tsyringe";
import { globby } from "globby";
import path from "node:path";

export async function registerRepositories() {
    const relativePaths = await globby(["src/repositories/**/*.repository.ts"]);

    for (const relativePath of relativePaths) {
        const absolutePath = path.resolve(process.cwd(), relativePath);

        try {
            const mod = await import(absolutePath);
            for (const key in mod) {
                const service = mod[key];
                if (typeof service === "function" && service.prototype) {
                    container.register(service.name, { useClass: service });
                }
            }
        } catch (error) {
            console.error(`Failed to import module at ${absolutePath}:`, error);
        }
    }
}
