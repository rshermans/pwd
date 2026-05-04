/**
 * App.js - Hub de Progresso Blockchain (Versão Interativa)
 * Lógica para gerir tarefas com persistência em LocalStorage e exportação.
 */

let currentTasks = [];

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    try {
        // 1. Carregar dados (LocalStorage > data.js)
        const saved = localStorage.getItem('blockchain_tasks_v1');
        if (saved) {
            currentTasks = JSON.parse(saved);
        } else if (typeof blockchainTasks !== 'undefined') {
            currentTasks = [...blockchainTasks];
        }

        // 2. Renderizar inicial
        renderAll();

        // 3. Configurar Event Listeners globais
        setupEventListeners();
    } catch (e) {
        console.error('Erro na inicialização:', e);
        const pText = document.getElementById('progress-text');
        if (pText) pText.innerText = 'Erro ao carregar tarefas interativas.';
    }
}

function renderAll() {
    renderDashboard(currentTasks);
    renderRecursos(currentTasks);
    updateProgressBar(currentTasks);
}

function saveTasks() {
    localStorage.setItem('blockchain_tasks_v1', JSON.stringify(currentTasks));
}

function setupEventListeners() {
    // Modal Adicionar
    const btnAdd = document.getElementById('btn-add-task');
    if (btnAdd) btnAdd.onclick = () => openModal('modal-task');

    // Modal Exportar
    const btnExport = document.getElementById('btn-export');
    if (btnExport) btnExport.onclick = () => {
        const exportArea = document.getElementById('export-area');
        exportArea.value = generateExportCode();
        openModal('modal-export');
    };

    // Resetar
    const btnReset = document.getElementById('btn-reset');
    if (btnReset) btnReset.onclick = () => {
        if (confirm('Tem certeza que deseja resetar todos os dados para a versão original? Suas mudanças locais serão perdidas.')) {
            localStorage.removeItem('blockchain_tasks_v1');
            location.reload();
        }
    };

    // Formulário Adicionar
    const form = document.getElementById('form-task');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const newTask = {
                Tarefa: document.getElementById('task-name').value,
                Canal: document.getElementById('task-canal').value,
                Semana: document.getElementById('task-semana').value,
                Fase: document.getElementById('task-fase').value || 'Fase 1 — Fundação',
                Status: 'Por fazer',
                Notas: ''
            };
            currentTasks.push(newTask);
            saveTasks();
            renderAll();
            closeModal('modal-task');
            form.reset();
        };
    }

    // Copiar Export
    const btnCopy = document.getElementById('btn-copy-export');
    if (btnCopy) {
        btnCopy.onclick = () => {
            const area = document.getElementById('export-area');
            area.select();
            document.execCommand('copy');
            btnCopy.innerText = 'Copiado!';
            setTimeout(() => btnCopy.innerText = 'Copiar para Área de Transferência', 2000);
        };
    }

    // Fechar modais ao clicar fora
    window.onclick = (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
}

function renderDashboard(tasks) {
    const containers = {
        'Por fazer': document.querySelector('#todo .card-container'),
        'Em andamento': document.querySelector('#doing .card-container'),
        'Concluído': document.querySelector('#done .card-container')
    };

    if (!containers['Por fazer']) return;

    // Limpar containers
    Object.values(containers).forEach(c => c.innerHTML = '');

    tasks.forEach((task, index) => {
        const status = task.Status || 'Por fazer';
        const container = containers[status] || containers['Por fazer'];

        const card = document.createElement('div');
        card.className = 'task-card';
        
        // Determinar botões de movimento
        let actionButtons = '';
        if (status === 'Por fazer') {
            actionButtons = `<button class="btn-icon" onclick="moveTask(${index}, 'Em andamento')" title="Iniciar">➔</button>`;
        } else if (status === 'Em andamento') {
            actionButtons = `
                <button class="btn-icon" onclick="moveTask(${index}, 'Por fazer')" title="Voltar">⬅</button>
                <button class="btn-icon" onclick="moveTask(${index}, 'Concluído')" title="Finalizar">✔</button>
            `;
        } else if (status === 'Concluído') {
            actionButtons = `<button class="btn-icon" onclick="moveTask(${index}, 'Em andamento')" title="Reabrir">⬅</button>`;
        }

        card.innerHTML = `
            <h4>${task.Tarefa}</h4>
            <div class="task-meta">
                <span class="tag">${task.Canal}</span>
                <span class="tag">${task.Semana}</span>
                <span class="tag">${task.Fase.split('—')[0].trim()}</span>
            </div>
            <div class="task-actions">
                <button class="btn-icon delete" onclick="deleteTask(${index})" title="Eliminar">🗑</button>
                ${actionButtons}
            </div>
        `;
        container.appendChild(card);
    });

    // Mensagem de vazio
    Object.keys(containers).forEach(key => {
        if (containers[key].children.length === 0) {
            containers[key].innerHTML = '<p style="color: var(--on-surface-variant); opacity: 0.5; font-size: 0.8rem; padding: 1.5rem; text-align: center; border: 1px dashed var(--outline); border-radius: var(--radius-lg);">Sem tarefas nesta fase.</p>';
        }
    });
}

function moveTask(index, newStatus) {
    currentTasks[index].Status = newStatus;
    saveTasks();
    renderAll();
}

function deleteTask(index) {
    if (confirm('Deseja eliminar esta tarefa?')) {
        currentTasks.splice(index, 1);
        saveTasks();
        renderAll();
    }
}

function openModal(id) {
    document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function updateProgressBar(tasks) {
    const total = tasks.length;
    const done = tasks.filter(t => t.Status === 'Concluído').length;
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

    const progressText = document.getElementById('progress-text');
    const percentageText = document.getElementById('percentage-text');
    const progressBarFill = document.getElementById('progress-bar-fill');

    if (progressText) progressText.innerText = `${done} de ${total} tarefas concluídas`;
    if (percentageText) percentageText.innerText = `${percentage}%`;
    if (progressBarFill) progressBarFill.style.width = `${percentage}%`;
}

function renderRecursos(tasks) {
    const list = document.getElementById('recursos-list');
    if (!list) return;
    list.innerHTML = '';
    const canais = ['Instagram', 'Podcast', 'LinkedIn', 'Webinar'];
    canais.forEach(canal => {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.innerHTML = `
            <span style="color: var(--primary); font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 0.5rem;">${canal}</span>
            <h4 style="margin-bottom: 1rem;">Repositório de ${canal}</h4>
            <p style="color: var(--on-surface-variant); font-size: 0.85rem; margin-bottom: 1.5rem;">Aceda a todos os conteúdos produzidos para o canal ${canal}.</p>
            <a href="#" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.8rem;">Ver Canal</a>
        `;
        list.appendChild(card);
    });
}

function generateExportCode() {
    const header = `/**
 * Data.js - Base de dados local para o Hub de Progresso
 * Gerado automaticamente pela interface do Dashboard.
 */

const blockchainTasks = `;
    const footer = `;\n`;
    const tasksJson = JSON.stringify(currentTasks, null, 4);
    return header + tasksJson + footer;
}
