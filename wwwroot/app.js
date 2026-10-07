/**
 * Catálogo de Grãos de Café - Script de Demonstração (Vanilla JS)
 * 
 * ATENÇÃO: Este script NÃO se conecta à API backend.
 * Todos os dados são simulados em memória local para fins de demonstração visual.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Dados fictícios iniciais inspirados no modelo da API (id, nome, torra, disponivel, quantidade)
  const initialData = [
    { id: 1, nome: "Caramela", torra: "média", disponivel: true, quantidade: 5 },
    { id: 2, nome: "Running Club", torra: "clara", disponivel: true, quantidade: 6 },
    { id: 3, nome: "Mogiana Especial", torra: "escura", disponivel: true, quantidade: 12 },
    { id: 4, nome: "Cerrado Bourbon", torra: "média", disponivel: false, quantidade: 0 }
  ];

  // Armazenamento em memória local da sessão
  let coffeeList = [...initialData];

  // Elementos do DOM
  const tableBody = document.getElementById("coffee-table-body");
  const form = document.getElementById("coffee-form");
  const nameInput = document.getElementById("coffee-name");
  const roastSelect = document.getElementById("coffee-roast");
  const quantityInput = document.getElementById("coffee-quantity");
  const availableCheckbox = document.getElementById("coffee-available");
  const statusContainer = document.getElementById("status-container");
  const counterElement = document.getElementById("items-counter");
  const emptyStateElement = document.getElementById("empty-state");

  /**
   * Exibe mensagens de feedback com foco e acessibilidade.
   * @param {string} message - Texto da notificação.
   * @param {'success'|'error'} type - Categoria da notificação.
   */
  function showStatus(message, type = "success") {
    statusContainer.innerHTML = "";
    
    const box = document.createElement("div");
    box.className = `status-box ${type}`;
    
    const icon = document.createElement("span");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = type === "success" ? "✅" : "⚠️";
    
    const text = document.createElement("span");
    text.textContent = message;

    box.appendChild(icon);
    box.appendChild(text);
    statusContainer.appendChild(box);

    // Limpa a notificação automaticamente após 6 segundos
    setTimeout(() => {
      if (statusContainer.contains(box)) {
        statusContainer.removeChild(box);
      }
    }, 6000);
  }

  /**
   * Atualiza a contagem total de itens cadastrados.
   */
  function updateCounter() {
    const total = coffeeList.length;
    counterElement.textContent = `${total} ${total === 1 ? "item" : "itens"}`;
  }

  /**
   * Renderiza a listagem de grãos na tabela.
   */
  function renderTable() {
    tableBody.innerHTML = "";

    if (coffeeList.length === 0) {
      emptyStateElement.style.display = "block";
      updateCounter();
      return;
    }

    emptyStateElement.style.display = "none";

    coffeeList.forEach((coffee) => {
      const row = document.createElement("tr");

      // ID
      const cellId = document.createElement("td");
      cellId.className = "col-id";
      cellId.setAttribute("data-label", "ID");
      cellId.textContent = `#${coffee.id}`;
      row.appendChild(cellId);

      // Nome
      const cellName = document.createElement("td");
      cellName.setAttribute("data-label", "Nome");
      const nameStrong = document.createElement("strong");
      nameStrong.textContent = coffee.nome;
      cellName.appendChild(nameStrong);
      row.appendChild(cellName);

      // Torra
      const cellRoast = document.createElement("td");
      cellRoast.setAttribute("data-label", "Torra");
      const roastBadge = document.createElement("span");
      roastBadge.className = "badge badge-roast";
      roastBadge.textContent = coffee.torra;
      cellRoast.appendChild(roastBadge);
      row.appendChild(cellRoast);

      // Quantidade
      const cellQty = document.createElement("td");
      cellQty.className = "col-num";
      cellQty.setAttribute("data-label", "Quantidade");
      cellQty.textContent = `${coffee.quantidade} kg`;
      row.appendChild(cellQty);

      // Status de Disponibilidade
      const cellStatus = document.createElement("td");
      cellStatus.setAttribute("data-label", "Status");
      const statusBadge = document.createElement("span");
      statusBadge.className = coffee.disponivel 
        ? "badge badge-available" 
        : "badge badge-unavailable";
      statusBadge.textContent = coffee.disponivel ? "Disponível" : "Indisponível";
      cellStatus.appendChild(statusBadge);
      row.appendChild(cellStatus);

      // Ações de Simulação
      const cellActions = document.createElement("td");
      cellActions.className = "col-actions";
      cellActions.setAttribute("data-label", "Ações");

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn btn-danger-outline btn-sm";
      removeBtn.setAttribute("aria-label", `Simular exclusão de ${coffee.nome}`);
      removeBtn.textContent = "Remover";
      removeBtn.addEventListener("click", () => {
        handleRemoveItem(coffee.id, coffee.nome);
      });

      cellActions.appendChild(removeBtn);
      row.appendChild(cellActions);

      tableBody.appendChild(row);
    });

    updateCounter();
  }

  /**
   * Simula a remoção de um grão da lista local.
   * @param {number} id - Identificador do grão.
   * @param {string} nome - Nome do grão.
   */
  function handleRemoveItem(id, nome) {
    coffeeList = coffeeList.filter(item => item.id !== id);
    renderTable();
    showStatus(`[Demonstração] Grão "${nome}" removido da lista local.`);
  }

  /**
   * Limpa os estilos de erro dos campos do formulário.
   */
  function clearInputValidationErrors() {
    [nameInput, roastSelect, quantityInput].forEach(field => {
      field.classList.remove("input-invalid");
    });
  }

  /**
   * Processa a submissão do formulário e simula o cadastro de um grão.
   */
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearInputValidationErrors();

    const nome = nameInput.value.trim();
    const torra = roastSelect.value.trim();
    const quantidadeRaw = quantityInput.value.trim();
    const disponivel = availableCheckbox.checked;

    // Validações visuais simples
    if (!nome) {
      nameInput.classList.add("input-invalid");
      nameInput.focus();
      showStatus("Por favor, informe o nome do grão de café.", "error");
      return;
    }

    if (!torra) {
      roastSelect.classList.add("input-invalid");
      roastSelect.focus();
      showStatus("Por favor, selecione um tipo de torra.", "error");
      return;
    }

    if (quantidadeRaw === "" || isNaN(Number(quantidadeRaw)) || Number(quantidadeRaw) < 0) {
      quantityInput.classList.add("input-invalid");
      quantityInput.focus();
      showStatus("Informe uma quantidade válida maior ou igual a zero.", "error");
      return;
    }

    const quantidade = parseInt(quantidadeRaw, 10);

    // Gera um próximo ID incremental para o mock
    const nextId = coffeeList.length > 0 
      ? Math.max(...coffeeList.map(c => c.id)) + 1 
      : 1;

    const newCoffee = {
      id: nextId,
      nome,
      torra,
      disponivel,
      quantidade
    };

    // Adiciona ao array local
    coffeeList.push(newCoffee);

    // Atualiza a tabela
    renderTable();

    // Limpa o formulário e restabelece os padrões
    form.reset();
    availableCheckbox.checked = true;

    showStatus(
      `[Demonstração] Grão "${newCoffee.nome}" adicionado com sucesso em memória local (sem chamada de API).`,
      "success"
    );
  });

  // Limpa mensagens e classes ao clicar no botão de reset
  form.addEventListener("reset", () => {
    clearInputValidationErrors();
    statusContainer.innerHTML = "";
  });

  // Renderização inicial dos dados fictícios
  renderTable();
});
