export interface CompatibilityResult {
  isIncompatible: boolean;
  reason?: string;
  sourceStep?: number;
  sourceLabel?: string;
}

/**
 * Checks if a specific option in a step is incompatible with current choices in other steps.
 */
export function checkOptionCompatibility(
  step: number,
  optionId: string,
  choices: Record<number, string>
): CompatibilityResult {
  
  // Step 2 (Build Tool) relative to Step 1 (Frontend Framework)
  if (step === 2) {
    const frontend = choices[1];
    if (frontend === 'angular' && optionId !== 'angular-cli') {
      return {
        isIncompatible: true,
        reason: 'Angular requires the official Webpack/Angular CLI bunder setup.',
        sourceStep: 1,
        sourceLabel: 'Angular'
      };
    }
    if (frontend !== 'angular' && optionId === 'angular-cli') {
      return {
        isIncompatible: true,
        reason: 'Angular CLI builder features are strictly coupled with the Angular framework.',
        sourceStep: 1,
        sourceLabel: frontend ? frontend.toUpperCase() : 'Non-Angular'
      };
    }
    if (frontend === 'html5' && optionId !== 'none') {
      return {
        isIncompatible: true,
        reason: 'Plain HTML5/JS/CSS loads raw scripts from the filesystem with zero compiler steps.',
        sourceStep: 1,
        sourceLabel: 'Plain HTML'
      };
    }
    if (frontend !== 'html5' && frontend !== 'angular' && optionId === 'none') {
      return {
        isIncompatible: true,
        reason: 'Modern reactive frameworks require active compilation or bundling (e.g., Vite/Webpack).',
        sourceStep: 1,
        sourceLabel: frontend ? frontend.toUpperCase() : 'Reactive Framework'
      };
    }
  }

  // Step 6 (Backend Framework) relative to Step 5 (Backend Language)
  if (step === 6) {
    const backendLang = choices[5];
    if (backendLang === 'node-ts' && optionId !== 'express') {
      return {
        isIncompatible: true,
        reason: 'Only Express is suitable in this list for Node.js. Others are crafted in Python, Rust, or PHP.',
        sourceStep: 5,
        sourceLabel: 'Node.js / TS'
      };
    }
    if (backendLang === 'python' && optionId !== 'fastapi' && optionId !== 'django') {
      return {
        isIncompatible: true,
        reason: 'FastAPI and Django are native Python web frameworks. Others are written in JS, Rust, or PHP.',
        sourceStep: 5,
        sourceLabel: 'Python'
      };
    }
    if (backendLang === 'rust' && optionId !== 'axum') {
      return {
        isIncompatible: true,
        reason: 'Axum is a Rust-native framework. Others do not execute on the Rust runtime or compiler.',
        sourceStep: 5,
        sourceLabel: 'Rust'
      };
    }
    if (backendLang === 'php' && optionId !== 'laravel') {
      return {
        isIncompatible: true,
        reason: 'Laravel is a classic PHP-native framework. Others require a non-PHP runtime.',
        sourceStep: 5,
        sourceLabel: 'PHP'
      };
    }
    if (backendLang === 'go' && optionId !== 'gin-gonic') {
      return {
        isIncompatible: true,
        reason: 'Go compiles to high-performance standalone servers, requiring Gin-Gonic from this list.',
        sourceStep: 5,
        sourceLabel: 'Go (Golang)'
      };
    }
  }

  // Step 11 (Process Manager) relative to Step 5 (Backend Language)
  if (step === 11) {
    const backendLang = choices[5];
    if (backendLang !== 'node-ts' && optionId === 'pm2') {
      return {
        isIncompatible: true,
        reason: 'PM2 is heavily Node.js focused. Non-JS runtimes should use systemd or Docker container runners.',
        sourceStep: 5,
        sourceLabel: backendLang ? backendLang.toUpperCase() : 'Non-Node Language'
      };
    }
  }

  // Step 5 (Backend Language) relative to Step 6 (Backend Framework) if Step 6 was chosen first
  if (step === 5) {
    const framework = choices[6];
    if (framework === 'express' && optionId !== 'node-ts') {
      return {
        isIncompatible: true,
        reason: 'Express requires Node.js / TypeScript environment execution.',
        sourceStep: 6,
        sourceLabel: 'Express (Node)'
      };
    }
    if ((framework === 'fastapi' || framework === 'django') && optionId !== 'python') {
      return {
        isIncompatible: true,
        reason: 'FastAPI and Django are Python frameworks and cannot execute with non-Python engines.',
        sourceStep: 6,
        sourceLabel: framework.toUpperCase()
      };
    }
    if (framework === 'axum' && optionId !== 'rust') {
      return {
        isIncompatible: true,
        reason: 'Axum is a Rust-native web microframework.',
        sourceStep: 6,
        sourceLabel: 'Axum'
      };
    }
    if (framework === 'laravel' && optionId !== 'php') {
      return {
        isIncompatible: true,
        reason: 'Laravel is a PHP framework.',
        sourceStep: 6,
        sourceLabel: 'Laravel'
      };
    }
    if (framework === 'gin-gonic' && optionId !== 'go') {
      return {
        isIncompatible: true,
        reason: 'Gin-Gonic requires a Go execution environment.',
        sourceStep: 6,
        sourceLabel: 'Gin-Gonic'
      };
    }
  }

  // Step 7 (Database Access Layer) relative to Step 5 (Backend Language)
  if (step === 7) {
    const backendLang = choices[5];
    // PHP Laravel has its own native database query builder / ORM Eloquent, others are usually separate
    if (backendLang === 'php' && optionId !== 'orm') {
      return {
        isIncompatible: true,
        reason: 'PHP Laravel standardizes heavily on its active-record Eloquent ORM backend layer.',
        sourceStep: 5,
        sourceLabel: 'PHP'
      };
    }
  }

  return { isIncompatible: false };
}
