# agora-ai-assistant-frontend
This is the frontend for Agora AI Assistant, a web application that integrates with various AI services to provide intelligent assistance. The frontend is built using modern web technologies and provides a user-friendly interface for interacting with the AI assistant.

## Compiling a new build
1. Change version in `package.json`, `package-lock.json`, and `agora.config.js`
2. Update CDN paths in `constants/paths.constant.js`
3. Set the config to `ENV.PRODUCTION_DEFAULT` in `agora.config.js`
4. Run `npm run build`
5. Push the changes to the repository
6. Draft a new release in GitHub
  - Tag the release with the new version (e.g., `1.2.0`)
  - Name the release with the same name as the tag (e.g., `1.2.0`)
  - Add release notes if necessary
7. Publish the release as a pre-release or full release as needed (recommended to publish as a pre-release first for testing) 

## Local Development

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/aUPaEU/agora-ai-assistant-frontend.git
   cd agora-ai-assistant-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
- For development with hot reload:
  ```bash
  npm run dev
  ```
  This will start the webpack dev server on `http://localhost:9000` and open the browser automatically.

- To build for production:
  ```bash
  npm run build
  ```
  The built files will be in the `dist/` directory.
  **IMPORTANT**: Before each build the version number in `package.json`, `package-lock.json` and `agora.config.js` should be updated to reflect the new version. Additionaly, the paths should be setup to CDN_PATHS within `constants/paths.constant.js`, and finally, the config should be set to `ENV.UNITE` within `agora.config.js`.

### Creating Components
The project uses the `plain-reactive` framework for component management. To create a new component:
```bash
npm run create-component
```

## Configurations

The application uses `agora.config.js` to manage different environments and configurations. The available environments are:

- `LOCAL`: Local development without AI
- `LOCAL_AI`: Local development with AI enabled
- `UNITE`: Production environment for Unite!
- `UNITE_PRE`: Pre-production for Unite!
- `CIVIS_DEV`: Development for CIVIS
- `METAGORA`: Metagora environment

The default configuration is set to `ENV.LOCAL_AI`. To switch environments, modify the `CONFIG` export in `agora.config.js`:

```javascript
export const CONFIG = ENV.UNITE  // For production
```

Each environment defines:
- `name`: Display name
- `host`: Backend API host
- `company_id`: Company identifier
- `enabled_ai`: Whether AI features are enabled
- `ai_host`: AI service host
- `translation_host`: Translation service host
- `current_version`: Application version

## Commits and Pull Requests

### Commit Guidelines
- Use clear, descriptive commit messages
- Follow conventional commit format when possible (e.g., `feat: add new feature`, `fix: resolve bug`)
- Keep commits focused on single changes

### Pull Request Process
1. Create a feature branch from `main`
2. Make your changes and test thoroughly
3. Ensure all tests pass (if applicable)
4. Update documentation if needed
5. Create a pull request with a clear description of changes
6. Request review from team members
7. Address any feedback and merge once approved

## Releases

### Version Management
- Version is maintained in `package.json` and `agora.config.js`
- Current version: 1.2.0
- Update both files when creating a new release

### Release Process
1. Update version numbers in relevant files
2. Create a git tag for the release
3. Build production assets
4. Deploy to appropriate environment
5. Update release notes

## Notes

### Technology Stack
- **Framework**: Plain Reactive (custom component framework)
- **Build Tool**: Webpack 5
- **Transpiler**: Babel
- **Styling**: CSS with custom themes
- **Animations**: GSAP
- **Markdown Parsing**: Marked

### Project Structure
```
src/
├── components/          # UI components organized by complexity
│   ├── base/           # Basic reusable components
│   ├── complex/        # Complex components
│   ├── layout/         # Layout components
│   └── mid/            # Medium complexity components
├── constants/          # Application constants
├── data/               # Mock data and static data
├── services/           # API services
├── themes/             # CSS themes
└── utils/              # Utility functions
```

### Key Features
- AI-powered chat assistant
- Service discovery and navigation
- Interactive map visualization
- Multilingual support
- Responsive design

### Development Notes
- The application uses custom web components with the Plain Reactive library
- API calls are configured through `agora.config.js`
- Mock data is available in `src/data/mock.data.js` for development
- Check `TODO.md` for current development tasks and known issues

### Contributing
When contributing to this project, please:
- Follow the existing code style and component structure
- Test your changes in multiple environments
- Update documentation for any new features
- Ensure accessibility and responsive design standards are met