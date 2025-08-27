/**
 * Security Audit Tests
 * Tests for OWASP Top 10 vulnerabilities and security best practices
 */

import { describe, it, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';

describe('Security Audit - OWASP Top 10', () => {
  describe('A01 - Broken Access Control', () => {
    it('should not expose sensitive API routes without authentication', () => {
      // Check for API routes that should be protected
      const apiRoutesPath = path.join(process.cwd(), 'app', 'api');
      const sensitiveRoutes = ['admin', 'create-admin', 'cms/manage'];
      
      sensitiveRoutes.forEach(route => {
        const routePath = path.join(apiRoutesPath, route, 'route.ts');
        if (fs.existsSync(routePath)) {
          const content = fs.readFileSync(routePath, 'utf8');
          
          // Should have some form of authentication check
          expect(content).toMatch(/(auth|token|session|verify|authenticate)/i);
        }
      });
    });

    it('should implement rate limiting on sensitive endpoints', () => {
      const contactApiPath = path.join(process.cwd(), 'app', 'api', 'contact', 'route.ts');
      if (fs.existsSync(contactApiPath)) {
        const content = fs.readFileSync(contactApiPath, 'utf8');
        
        // Should have rate limiting implementation
        expect(content).toMatch(/(rate.*limit|rateLimit|rateLimited)/i);
      }
    });
  });

  describe('A02 - Cryptographic Failures', () => {
    it('should not contain hardcoded secrets in code', () => {
      const patterns = [
        /api[_-]key\s*=\s*["\'][^"\']+["\']/i,
        /secret\s*=\s*["\'][^"\']+["\']/i,
        /password\s*=\s*["\'][^"\']+["\']/i,
        /token\s*=\s*["\'][^"\']+["\']/i,
      ];
      
      const checkDirectory = (dirPath: string) => {
        const files = fs.readdirSync(dirPath, { withFileTypes: true });
        
        files.forEach(file => {
          if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
            checkDirectory(path.join(dirPath, file.name));
          } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
            const filePath = path.join(dirPath, file.name);
            const content = fs.readFileSync(filePath, 'utf8');
            
            patterns.forEach(pattern => {
              const matches = content.match(pattern);
              if (matches) {
                console.warn(`Potential hardcoded secret in ${filePath}: ${matches[0]}`);
              }
              expect(matches).toBeNull();
            });
          }
        });
      };
      
      // Check main source directories
      checkDirectory(path.join(process.cwd(), 'app'));
      checkDirectory(path.join(process.cwd(), 'components'));
      checkDirectory(path.join(process.cwd(), 'lib'));
    });

    it('should use environment variables for sensitive configuration', () => {
      const configFiles = [
        path.join(process.cwd(), 'app', 'api', 'contact', 'route.ts'),
        path.join(process.cwd(), 'lib', 'services', 'email-service.ts'),
      ];
      
      configFiles.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Should use process.env for sensitive values
          if (content.includes('api') || content.includes('key')) {
            expect(content).toMatch(/process\.env\./);
          }
        }
      });
    });
  });

  describe('A03 - Injection', () => {
    it('should sanitize user inputs in API endpoints', () => {
      const apiPath = path.join(process.cwd(), 'app', 'api');
      const checkApiRoute = (routePath: string) => {
        if (fs.existsSync(routePath)) {
          const content = fs.readFileSync(routePath, 'utf8');
          
          // If it handles user input, should have validation/sanitization
          if (content.includes('request.body') || content.includes('body.')) {
            expect(content).toMatch(/(validate|sanitize|escape|trim)/i);
          }
        }
      };
      
      const apiRoutes = ['contact', 'newsletter'];
      apiRoutes.forEach(route => {
        checkApiRoute(path.join(apiPath, route, 'route.ts'));
      });
    });

    it('should not use dangerous functions without sanitization', () => {
      const dangerousFunctions = [
        'eval(',
        'Function(',
        'setTimeout(',
        'setInterval(',
        'innerHTML',
        'outerHTML'
      ];
      
      const checkDirectory = (dirPath: string) => {
        if (!fs.existsSync(dirPath)) return;
        
        const files = fs.readdirSync(dirPath, { withFileTypes: true });
        
        files.forEach(file => {
          if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
            checkDirectory(path.join(dirPath, file.name));
          } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
            const filePath = path.join(dirPath, file.name);
            const content = fs.readFileSync(filePath, 'utf8');
            
            dangerousFunctions.forEach(func => {
              if (content.includes(func)) {
                console.warn(`Potentially dangerous function ${func} found in ${filePath}`);
                // Should have proper validation/sanitization around it
                expect(content).toMatch(/(validate|sanitize|escape)/i);
              }
            });
          }
        });
      };
      
      checkDirectory(path.join(process.cwd(), 'app'));
      checkDirectory(path.join(process.cwd(), 'components'));
    });
  });

  describe('A05 - Security Misconfiguration', () => {
    it('should have proper security headers configuration', () => {
      const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
      if (fs.existsSync(nextConfigPath)) {
        const content = fs.readFileSync(nextConfigPath, 'utf8');
        
        // Should configure security headers
        expect(content).toMatch(/(headers|security)/i);
      }
    });

    it('should not expose sensitive information in error messages', () => {
      const apiPath = path.join(process.cwd(), 'app', 'api');
      
      const checkErrorHandling = (dirPath: string) => {
        if (!fs.existsSync(dirPath)) return;
        
        const files = fs.readdirSync(dirPath, { withFileTypes: true });
        
        files.forEach(file => {
          if (file.isDirectory()) {
            checkErrorHandling(path.join(dirPath, file.name));
          } else if (file.name.endsWith('.ts')) {
            const filePath = path.join(dirPath, file.name);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Should not expose detailed error information to client
            if (content.includes('catch') && content.includes('error')) {
              expect(content).not.toMatch(/error\.stack/);
              expect(content).not.toMatch(/console\.log\(error\)/);
            }
          }
        });
      };
      
      checkErrorHandling(apiPath);
    });
  });

  describe('A06 - Vulnerable and Outdated Components', () => {
    it('should not have known vulnerable dependencies', async () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Check for known vulnerable packages (this would typically use audit tools)
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // Basic check for very old versions
      const riskPackages = {
        'react': '^16.',
        'next': '^12.',
        'express': '^3.',
      };
      
      Object.entries(riskPackages).forEach(([pkg, version]) => {
        if (dependencies[pkg] && dependencies[pkg].startsWith(version)) {
          console.warn(`Potentially outdated package: ${pkg}@${dependencies[pkg]}`);
        }
      });
    });
  });

  describe('A09 - Security Logging & Monitoring', () => {
    it('should implement proper logging for security events', () => {
      const contactApiPath = path.join(process.cwd(), 'app', 'api', 'contact', 'route.ts');
      if (fs.existsSync(contactApiPath)) {
        const content = fs.readFileSync(contactApiPath, 'utf8');
        
        // Should log important security events
        expect(content).toMatch(/(console\.log|logger|log)/i);
      }
    });

    it('should have rate limiting monitoring', () => {
      const contactApiPath = path.join(process.cwd(), 'app', 'api', 'contact', 'route.ts');
      if (fs.existsSync(contactApiPath)) {
        const content = fs.readFileSync(contactApiPath, 'utf8');
        
        // Should monitor and log rate limiting events
        if (content.includes('rateLimited') || content.includes('rate limit')) {
          expect(content).toMatch(/(console\.log|logger|log)/i);
        }
      }
    });
  });

  describe('A10 - Server-Side Request Forgery (SSRF)', () => {
    it('should validate URLs before making external requests', () => {
      const rssServicePath = path.join(process.cwd(), 'lib', 'services', 'rss-service.ts');
      if (fs.existsSync(rssServicePath)) {
        const content = fs.readFileSync(rssServicePath, 'utf8');
        
        // If making external requests, should validate URLs
        if (content.includes('fetch(') || content.includes('axios(')) {
          expect(content).toMatch(/(validate|whitelist|allowlist)/i);
        }
      }
    });
  });
});