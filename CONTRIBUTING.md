# Contributing to JobTracker

Thank you for your interest in contributing to JobTracker! We welcome contributions from the community.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/jobtracker.git
   cd jobtracker
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd JobTracker-Backend
   npm install
   
   # Frontend
   cd ../JobTracker
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` in both directories
   - Update with your local configuration

4. **Run database migrations**
   ```bash
   cd JobTracker-Backend
   npx prisma migrate dev
   ```

5. **Start development servers**
   ```bash
   # Backend (terminal 1)
   cd JobTracker-Backend
   npm run dev
   
   # Frontend (terminal 2)
   cd JobTracker
   npm run dev
   ```

## 🛠️ Development Guidelines

### Code Style
- Use ESLint and Prettier for code formatting
- Follow existing code patterns and conventions
- Write meaningful commit messages

### Commit Messages
Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for code style changes
- `refactor:` for code refactoring
- `test:` for test additions/changes

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests if applicable
   - Update documentation as needed

3. **Test your changes**
   ```bash
   # Backend tests
   cd JobTracker-Backend
   npm test
   
   # Frontend tests
   cd JobTracker
   npm test
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Provide clear description of changes
   - Reference any related issues
   - Include screenshots for UI changes

## 📝 Reporting Issues

### Bug Reports
When reporting bugs, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

### Feature Requests
For feature requests, please include:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach

## 🧪 Testing

### Backend Testing
```bash
cd JobTracker-Backend
npm test
```

### Frontend Testing
```bash
cd JobTracker
npm test
```

### Manual Testing
- Test all user flows (registration, login, job management)
- Verify responsive design on different screen sizes
- Test with different browsers

## 📚 Documentation

- Update README.md for significant changes
- Document new API endpoints
- Add inline code comments for complex logic
- Update environment variable examples

## ⚡ Performance

- Optimize database queries
- Minimize bundle size
- Use proper caching strategies
- Follow React best practices

## 🔒 Security

- Never commit sensitive information
- Use environment variables for secrets
- Follow security best practices
- Report security issues privately

## 🎯 Areas for Contribution

### High Priority
- Performance optimizations
- Mobile responsiveness improvements
- Accessibility enhancements
- Test coverage improvements

### Medium Priority
- New features (job search integration, notifications)
- UI/UX improvements
- Documentation updates
- Code refactoring

### Low Priority
- Code style improvements
- Minor bug fixes
- Development tooling improvements

## 💬 Community

- Be respectful and inclusive
- Help other contributors
- Ask questions if you're unsure
- Share knowledge and best practices

## 📄 License

By contributing to JobTracker, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in the README.md file and release notes.

Thank you for contributing to JobTracker! 🚀
