const ALLOWED_PATHS = new Set([
  '/health',
  '/ready',
  '/admin/licenses',
  '/admin/licenses/revoke',
  '/admin/licenses/reset',
  '/admin/licenses/reset-devices',
  '/admin/licenses/duration',
  '/admin/trial-device/reset',
  '/admin/kirvano/catalog-check',
]);

const ALLOWED_METHODS = new Set(['GET', 'POST', 'DELETE']);

function isAllowedWorkerUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return false;

    const host = url.hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return false;

    // O License Server atual roda no Cloudflare Workers. Restringir o proxy
    // a workers.dev evita transformar esta rota pública em um proxy SSRF genérico.
    if (!host.endsWith('.workers.dev')) return false;

    return !url.username && !url.password && (url.pathname === '/' || url.pathname === '');
  } catch {
    return false;
  }
}

function setNoStore(res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

export default async function handler(req, res) {
  setNoStore(res);

  if (!ALLOWED_METHODS.has(req.method)) {
    res.setHeader('Allow', Array.from(ALLOWED_METHODS).join(', '));
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const workerBase = String(req.headers['x-license-server-url'] || '').trim().replace(/\/$/, '');
  const path = String(req.query?.path || '').trim();
  const adminToken = String(req.headers['x-admin-token'] || '').trim();

  if (!isAllowedWorkerUrl(workerBase)) {
    return res.status(400).json({ error: 'URL do License Server inválida. Use a URL HTTPS *.workers.dev do Worker.' });
  }

  const pathUrl = new URL(path, 'https://proxy.invalid');
  if (!ALLOWED_PATHS.has(pathUrl.pathname)) {
    return res.status(400).json({ error: 'Endpoint administrativo não permitido pelo proxy.' });
  }

  const isPublicEndpoint = pathUrl.pathname === '/health' || pathUrl.pathname === '/ready';
  if (!isPublicEndpoint && !adminToken) {
    return res.status(401).json({ error: 'ADMIN_TOKEN obrigatório.' });
  }

  const target = `${workerBase}${pathUrl.pathname}${pathUrl.search}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const headers = { Accept: 'application/json' };
    if (!isPublicEndpoint) headers.Authorization = `Bearer ${adminToken}`;
    if (req.method === 'POST') headers['Content-Type'] = 'application/json';

    const upstream = await fetch(target, {
      method: req.method,
      headers,
      body: req.method === 'POST' ? JSON.stringify(req.body ?? {}) : undefined,
      redirect: 'manual',
      signal: controller.signal,
      cache: 'no-store',
    });

    const text = await upstream.text();
    const contentType = upstream.headers.get('content-type') || 'application/json; charset=utf-8';
    res.setHeader('Content-Type', contentType);

    // Não repassamos cookies, CORS ou outros headers do Worker.
    return res.status(upstream.status).send(text || '{}');
  } catch (error) {
    const message = error?.name === 'AbortError'
      ? 'Timeout ao acessar o License Server.'
      : 'Falha ao acessar o License Server.';
    return res.status(502).json({ error: message });
  } finally {
    clearTimeout(timeout);
  }
}
