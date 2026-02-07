import type { ProjectManifest, ScenarioData, GameDatabase } from '@/core/types';

// ===================================
// Game Data Loader
// ===================================

const BASE_PATH = '/game-data';

/**
 * Load project manifest from JSON file
 */
export async function loadProjectManifest(projectId: string): Promise<ProjectManifest | null> {
    try {
        const response = await fetch(`${BASE_PATH}/projects/${projectId}/manifest.json`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error(`Failed to load manifest for project: ${projectId}`, error);
        return null;
    }
}

/**
 * Load scenario data from JSON file
 */
export async function loadScenario(projectId: string): Promise<ScenarioData | null> {
    try {
        const response = await fetch(`${BASE_PATH}/projects/${projectId}/scenario.json`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error(`Failed to load scenario for project: ${projectId}`, error);
        return null;
    }
}

/**
 * Load game database (characters, abilities, enemies, etc.)
 */
export async function loadDatabase(): Promise<GameDatabase | null> {
    try {
        const response = await fetch(`${BASE_PATH}/database/database.json`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Failed to load database', error);
        return null;
    }
}

/**
 * Get asset path for character/enemy images
 */
export function getAssetPath(assetPath: string): string {
    // If it starts with /, treat as absolute from public folder
    if (assetPath.startsWith('/')) {
        return assetPath;
    }
    // Otherwise, prepend the base path
    return `${BASE_PATH}/assets/${assetPath}`;
}

/**
 * List available projects
 */
export async function listProjects(): Promise<string[]> {
    // In a real implementation, this would fetch from an API
    // For now, return demo project
    return ['demo-project'];
}
