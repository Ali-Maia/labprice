document.addEventListener('DOMContentLoaded', async () => {
  const panel = document.getElementById('dashboardContent');
  if (!panel) return;

  if (!requireAuth()) return;

  const user = getUser();
  const greeting = document.getElementById('dashboardGreeting');
  if (greeting) {
    greeting.textContent = user?.username ? `Bem-vindo, ${user.username}` : 'Bem-vindo';
  }

  try {
    const [products, users] = await Promise.all([
      apiRequest('/products').catch(() => ({ products: [] })),
      apiRequest('/users').catch(() => ({ users: [] }))
    ]);

    const latestProduct = (products.products || [])[0];
    panel.innerHTML = `
      <div class="kpi">
        <div class="box"><small>Produtos</small><strong>${products.products?.length || 0}</strong></div>
        <div class="box"><small>Usuários</small><strong>${users.users?.length || 0}</strong></div>
        <div class="box"><small>Status</small><strong>Online</strong></div>
      </div>
      <div class="grid two" style="margin-top:18px;">
        <div class="action-card">
          <h3>Atalhos rápidos</h3>
          <p>Calcule um orçamento, salve um novo produto ou revise o catálogo existente.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="quote.html">Novo orçamento</a>
            <a class="btn btn-secondary" href="products.html">Ver catálogo</a>
          </div>
        </div>
        <div class="action-card">
          <h3>Último produto</h3>
          ${latestProduct ? `
            <p><strong>${latestProduct.name}</strong></p>
            <p>Preço final: ${formatCurrency(latestProduct.finalPrice)}</p>
            <p>Atualizado em ${formatDate(latestProduct.updatedAt)}</p>
            <a class="btn btn-ghost" href="product-detail.html?id=${latestProduct.id}">Abrir detalhe</a>
          ` : '<p>Nenhum produto registrado ainda.</p>'}
        </div>
      </div>
    `;
  } catch (error) {
    panel.innerHTML = `<div class="panel"><p>${error.message}</p></div>`;
  }
});
