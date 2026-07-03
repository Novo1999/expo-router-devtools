const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function withOpenFileMiddleware(config, options = {}) {
  const {
    projectRoot = config.projectRoot || process.cwd(),
    appDir = 'app', // e.g. 'src/app' for your taskatask project
    endpoint = '/dev/open-file',
    editor = process.env.REACT_EDITOR || process.env.EDITOR || 'code',
    enabled = (process.env.APP_ENV || 'development') === 'development',
  } = options;

  if (!enabled) return config;

  const prevEnhanceMiddleware = config.server?.enhanceMiddleware;

  config.server = {
    ...config.server,
    enhanceMiddleware: (middleware, server) => {
      const enhanced = prevEnhanceMiddleware
        ? prevEnhanceMiddleware(middleware, server)
        : middleware;

      return (req, res, next) => {
        if (req.url && req.url.startsWith(endpoint)) {
          let body = '';
          req.on('data', (c) => (body += c));
          req.on('end', () => {
            try {
              const { segments = [], searchParams = {} } = JSON.parse(body);
              const lastSeg = segments[segments.length - 1];
              const dynamicParam = Object.entries(searchParams).find(
                ([, v]) => String(v) === lastSeg
              )?.[0];

              const base = path.join(projectRoot, appDir);
              const candidates = [
                path.join(base, ...segments, 'index.tsx'),
                path.join(base, ...segments) + '.tsx',
                path.join(base, ...segments, 'index.jsx'),
                path.join(base, ...segments) + '.jsx',
                ...(dynamicParam
                  ? [
                      path.join(
                        base,
                        ...segments.slice(0, -1),
                        `[${dynamicParam}].tsx`
                      ),
                    ]
                  : []),
              ];

              const found = candidates.find((f) => {
                try {
                  return fs.existsSync(path.normalize(f));
                } catch {
                  return false;
                }
              });

              if (!found) {
                res.statusCode = 404;
                res.end('no candidate exists');
                return;
              }

              spawn(editor, [path.normalize(found)], {
                shell: true,
                detached: true,
                stdio: 'ignore',
              }).unref();

              res.statusCode = 200;
              res.end(found);
            } catch (e) {
              res.statusCode = 500;
              res.end(String(e));
            }
          });
          return;
        }
        return enhanced(req, res, next);
      };
    },
  };

  return config;
}

module.exports = { withOpenFileMiddleware };
