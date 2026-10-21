/**
 * Catálogo de Grãos de Café - Integração com API REST
 * 
 * Endpoints validados via collection Bruno:
 * - GET    /api/cafes        -> Lista todos os grãos cadastrados
 * - POST   /api/cafes        -> Cadastra novo grão
 * - PUT    /api/cafes/{id}   -> Atualiza dados do grão existente
 * - DELETE /api/cafes/{id}   -> Remove o grão pelo identificador
 */

document.addEventListener("DOMContentLoaded", () => {
  // Define o endpoint base da API:
  // Se executado diretamente na porta da API (ou sob proxy/mesma origem), usa caminho relativo '/api/cafes'.
  // Se aberto como arquivo local (file://) ou via servidor estático de desenvolvimento (ex.: Live Server),
  // utiliza a URL validada na collection Bruno (http://localhost:5050/api/cafes).
  const isDirectApiOrigin = (window.location.protocol === "http:" || window.location.protocol === "https:") &&
    window.location.port !== "5500" && 
    window.location.port !== "3000" && 
    window.location.port !== "8080";

  const API_URL = isDirectApiOrigin ? "/api/cafes" : "http://localhost:5050/api/cafes";

  // Elementos do DOM
  const tableBody = document.getElementById("coffee-table-body");
  const form = document.getElementById("coffee-form");
  const idInput = document.getElementById("coffee-id");
  const nameInput = document.getElementById("coffee-name");
  const roastSelect = document.getElementById("coffee-roast");
  const quantityInput = document.getElementById("coffee-quantity");
  const availableCheckbox = document.getElementById("coffee-available");
  const statusContainer = document.getElementById("status-container");
  const counterElement = document.getElementById("items-counter");
  const emptyStateElement = document.getElementById("empty-state");
  const loadingStateElement = document.getElementById("loading-state");
  const submitBtn = document.getElementById("btn-submit");
  const cancelEditBtn = document.getElementById("btn-cancel-edit");
  const formHeading = document.getElementById("form-heading");
  const formDescription = document.getElementById("form-description");

  /**
   * Exibe mensagens de notificação com acessibilidade e inserção segura de texto.
   * @param {string} message - Texto informativo da notificação.
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

    setTimeout(() => {
      if (statusContainer.contains(box)) {
        statusContainer.removeChild(box);
      }
    }, 6000);
  }

  /**
   * Atualiza a contagem exibida no badge da tabela.
   * @param {number} total - Quantidade de itens carregados.
   */
  function updateCounter(total) {
    counterElement.textContent = `${total} ${total === 1 ? "item" : "itens"}`;
  }

  /**
   * Alterna a visibilidade do indicador de carregamento.
   * @param {boolean} isLoading - Se está em progresso de requisição.
   */
  function setLoading(isLoading) {
    if (loadingStateElement) {
      loadingStateElement.style.display = isLoading ? "block" : "none";
    }
    if (isLoading && emptyStateElement) {
      emptyStateElement.style.display = "none";
    }
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
   * Cancela o modo de edição e restaura o formulário para cadastro.
   */
  function cancelarEdicao() {
    idInput.value = "";
    form.reset();
    availableCheckbox.checked = true;
    formHeading.textContent = "Cadastrar Novo Grão";
    formDescription.textContent = "Preencha os dados do grão de café para cadastrar na API.";
    submitBtn.textContent = "Cadastrar Grão";
    cancelEditBtn.style.display = "none";
    clearInputValidationErrors();
  }

  /**
   * Prepara o formulário para edição dos dados de um grão selecionado.
   * @param {object} coffee - Registro retornado pela API.
   */
  function iniciarEdicao(coffee) {
    clearInputValidationErrors();
    idInput.value = coffee.id;
    nameInput.value = coffee.nome ?? "";

    // Normaliza torra para selecionar o option correspondente
    const torraNormalizada = String(coffee.torra ?? "").trim().toLowerCase().replace("é", "e");
    if (torraNormalizada === "clara" || torraNormalizada === "media" || torraNormalizada === "escura") {
      roastSelect.value = torraNormalizada;
    } else {
      roastSelect.value = "";
    }

    quantityInput.value = coffee.quantidade ?? 0;
    availableCheckbox.checked = Boolean(coffee.disponivel);

    formHeading.textContent = `Editar Grão #${coffee.id}`;
    formDescription.textContent = "Altere os dados do grão de café e clique em Salvar Alterações.";
    submitBtn.textContent = "Salvar Alterações";
    cancelEditBtn.style.display = "inline-flex";

    form.scrollIntoView({ behavior: "smooth", block: "start" });
    nameInput.focus();
  }

  /**
   * Carrega a lista completa de grãos cadastrados na API (GET /api/cafes).
   */
  async function carregarCafes() {
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Falha ao obter dados (Status ${response.status} ${response.statusText})`);
      }

      const cafes = await response.json();

      tableBody.innerHTML = "";

      if (!Array.isArray(cafes) || cafes.length === 0) {
        emptyStateElement.style.display = "block";
        updateCounter(0);
        return;
      }

      emptyStateElement.style.display = "none";

      cafes.forEach((coffee) => {
        const row = document.createElement("tr");

        // ID (inserido com textContent)
        const cellId = document.createElement("td");
        cellId.className = "col-id";
        cellId.setAttribute("data-label", "ID");
        cellId.textContent = `#${coffee.id}`;
        row.appendChild(cellId);

        // Nome (inserido com textContent)
        const cellName = document.createElement("td");
        cellName.setAttribute("data-label", "Nome");
        const nameStrong = document.createElement("strong");
        nameStrong.textContent = String(coffee.nome ?? "");
        cellName.appendChild(nameStrong);
        row.appendChild(cellName);

        // Torra (inserido com textContent)
        const cellRoast = document.createElement("td");
        cellRoast.setAttribute("data-label", "Torra");
        const roastBadge = document.createElement("span");
        roastBadge.className = "badge badge-roast";
        roastBadge.textContent = String(coffee.torra ?? "");
        cellRoast.appendChild(roastBadge);
        row.appendChild(cellRoast);

        // Quantidade (inserido com textContent)
        const cellQty = document.createElement("td");
        cellQty.className = "col-num";
        cellQty.setAttribute("data-label", "Quantidade");
        cellQty.textContent = `${coffee.quantidade ?? 0} kg`;
        row.appendChild(cellQty);

        // Status de Disponibilidade (inserido com textContent)
        const cellStatus = document.createElement("td");
        cellStatus.setAttribute("data-label", "Status");
        const statusBadge = document.createElement("span");
        statusBadge.className = coffee.disponivel 
          ? "badge badge-available" 
          : "badge badge-unavailable";
        statusBadge.textContent = coffee.disponivel ? "Disponível" : "Indisponível";
        cellStatus.appendChild(statusBadge);
        row.appendChild(cellStatus);

        // Ações (Editar e Excluir)
        const cellActions = document.createElement("td");
        cellActions.className = "col-actions";
        cellActions.setAttribute("data-label", "Ações");

        const actionsGroup = document.createElement("div");
        actionsGroup.className = "actions-group";

        // Botão Editar
        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn btn-secondary btn-sm";
        editBtn.textContent = "Editar";
        editBtn.setAttribute("aria-label", `Editar ${coffee.nome}`);
        editBtn.addEventListener("click", () => {
          iniciarEdicao(coffee);
        });

        // Botão Excluir
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn btn-danger-outline btn-sm";
        deleteBtn.textContent = "Excluir";
        deleteBtn.setAttribute("aria-label", `Excluir ${coffee.nome}`);
        deleteBtn.addEventListener("click", () => {
          excluirCafe(coffee.id, coffee.nome);
        });

        actionsGroup.appendChild(editBtn);
        actionsGroup.appendChild(deleteBtn);
        cellActions.appendChild(actionsGroup);
        row.appendChild(cellActions);

        tableBody.appendChild(row);
      });

      updateCounter(cafes.length);
    } catch (err) {
      console.error("Erro na comunicação com a API:", err);
      tableBody.innerHTML = "";
      emptyStateElement.style.display = "none";
      updateCounter(0);
      showStatus(`Erro ao carregar dados da API: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Exclui um grão na API (DELETE /api/cafes/{id}).
   * @param {number} id - Identificador do grão.
   * @param {string} nome - Nome do grão.
   */
  async function excluirCafe(id, nome) {
    if (!confirm(`Deseja realmente excluir o grão "${nome}" (ID #${id})?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(`Falha ao excluir item (Status ${response.status} ${response.statusText})`);
      }

      showStatus(`Grão "${nome}" excluído com sucesso!`, "success");

      // Se o item excluído estiver em edição no formulário, cancela o modo de edição
      if (idInput.value === String(id)) {
        cancelarEdicao();
      }

      // Recarrega a listagem após exclusão
      await carregarCafes();
    } catch (err) {
      console.error("Erro ao excluir café:", err);
      showStatus(`Erro ao excluir grão: ${err.message}`, "error");
    }
  }

  /**
   * Processa a submissão do formulário:
   * - Se coffee-id estiver preenchido: executa PUT /api/cafes/{id}
   * - Se coffee-id estiver vazio: executa POST /api/cafes
   */
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearInputValidationErrors();

    const nome = nameInput.value.trim();
    const torra = roastSelect.value.trim();
    const quantidadeRaw = quantityInput.value.trim();
    const disponivel = availableCheckbox.checked;

    // Validações no cliente
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
    const editingId = idInput.value ? parseInt(idInput.value, 10) : null;

    submitBtn.disabled = true;

    try {
      if (editingId) {
        // Fluxo de Atualização (PUT /api/cafes/{id})
        const payloadAtualizacao = {
          id: editingId,
          nome,
          torra,
          disponivel,
          quantidade
        };

        const response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payloadAtualizacao)
        });

        if (!response.ok) {
          throw new Error(`Falha ao atualizar grão (Status ${response.status} ${response.statusText})`);
        }

        showStatus(`Grão #${editingId} atualizado com sucesso!`, "success");
      } else {
        // Fluxo de Cadastro (POST /api/cafes)
        const payloadCadastro = {
          nome,
          torra,
          disponivel,
          quantidade
        };

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payloadCadastro)
        });

        if (!response.ok) {
          throw new Error(`Falha ao cadastrar grão (Status ${response.status} ${response.statusText})`);
        }

        const novoCafe = await response.json();
        showStatus(`Grão "${novoCafe.nome ?? nome}" cadastrado com sucesso!`, "success");
      }

      // Limpa e reseta o formulário
      cancelarEdicao();

      // Recarrega os dados da API após gravação
      await carregarCafes();
    } catch (err) {
      console.error("Erro ao salvar grão:", err);
      showStatus(`Erro na gravação: ${err.message}`, "error");
    } finally {
      submitBtn.disabled = false;
    }
  });

  // Botão Cancelar Edição
  cancelEditBtn.addEventListener("click", () => {
    cancelarEdicao();
  });

  // Botão Limpar Formulário
  form.addEventListener("reset", () => {
    setTimeout(() => {
      cancelarEdicao();
      statusContainer.innerHTML = "";
    }, 0);
  });

  // Carregamento inicial da lista ao abrir a interface
  carregarCafes();
});
