const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting deployment process...');

try {
  // Build the project
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Check if .next directory exists
  if (!fs.existsSync('.next')) {
    throw new Error('.next directory not found');
  }
  
  console.log('✅ Build successful!');
  console.log('📁 Build output ready in .next directory');
  
  // Create amplify.yml for proper deployment
  const amplifyConfig = {
    version: 1,
    frontend: {
      phases: {
        preBuild: {
          commands: ['npm ci']
        },
        build: {
          commands: ['npm run build']
        }
      },
      artifacts: {
        baseDirectory: '.next',
        files: ['**/*']
      },
      cache: {
        paths: [
          'node_modules/**/*',
          '.next/cache/**/*'
        ]
      }
    }
  };
  
  fs.writeFileSync('amplify.yml', `version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*`);
  
  console.log('✅ Created amplify.yml configuration');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}