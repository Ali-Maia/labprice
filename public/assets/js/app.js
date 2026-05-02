const API_BASE = '';

function getToken() {
  return localStorage.getItem('labprice_token');
}

function getUser() {
  const raw = localStorage.getItem('labprice_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setSession(token, user) {
  localStorage.setItem('labprice_token', token);
  localStorage.setItem('labprice_user', JSON.stringify(user));
  syncAuthUi();
}

function clearSession() {
  localStorage.removeItem('labprice_token');
  localStorage.removeItem('labprice_user');
  syncAuthUi();
}

function requireAuth(redirectTo = 'login.html') {
  if (!getToken()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

async function apiRequest(path, options = {}) {
  const headers = {
    ...(options.headers || {})
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = payload?.error || payload?.message || 'Falha na requisição';
    throw new Error(message);
  }

  return payload;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return date.toLocaleString('pt-BR');
}

function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

function notify(message, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast ${type}`;
  toast.textContent = message;
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => toast.classList.remove('show'), 2600);
}

function syncAuthUi() {
  const token = getToken();
  const user = getUser();

  qsa('[data-auth="logged-out"]').forEach((el) => el.classList.toggle('hidden', !!token));
  qsa('[data-auth="logged-in"]').forEach((el) => el.classList.toggle('hidden', !token));
  qsa('[data-user-name]').forEach((el) => {
    el.textContent = user?.username ? `Olá, ${user.username}` : 'Bem-vindo';
  });
  qsa('[data-user-email]').forEach((el) => {
    el.textContent = user?.email || '';
  });
}

function bindLogout() {
  qsa('[data-logout]').forEach((btn) => {
    btn.addEventListener('click', () => {
      clearSession();
      notify('Sessão encerrada', 'success');
      window.location.href = 'index.html';
    });
  });
}

function highlightCurrentNav() {
  const currentPath = window.location.pathname.replace(/\/+/g, '/').replace(/\/index\.html$/, '/');

  qsa('.nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) return;

    const linkPath = new URL(href, window.location.origin).pathname.replace(/\/index\.html$/, '/');
    const isActive = linkPath === currentPath || (currentPath === '/' && linkPath === '/');

    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  syncAuthUi();
  bindLogout();
  highlightCurrentNav();
});
