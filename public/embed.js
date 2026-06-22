(function() {
  // Configuração global
  const API_BASE_URL = 'http://localhost:5173'; // Será substituído pela URL do Vercel em prod

  window.FormGenSDK = {
    init: function(config) {
      if (!config.formToken) {
        console.error('FormGenSDK: formToken é obrigatório.');
        return;
      }

      // Encontra ou cria o container onde o formulário será renderizado
      let container;
      if (config.containerId) {
        container = document.getElementById(config.containerId);
      } else {
        // Se não for passado um container, cria um no final do body
        container = document.createElement('div');
        container.id = 'formgen-container-' + config.formToken;
        document.body.appendChild(container);
      }

      // Aqui faríamos um fetch para buscar a configuração do formulário usando o formToken.
      // fetch(`${API_BASE_URL}/api/forms/${config.formToken}`)
      // Para demonstração, vamos mockar uma estrutura básica se não encontrarmos
      
      container.innerHTML = 'Carregando formulário...';
      
      // Simulação de chamada de API
      setTimeout(() => {
         this.renderForm(container, config.formToken);
      }, 500);
    },

    renderForm: function(container, token) {
      // Exemplo de como vamos renderizar. 
      // Idealmente, renderizamos um Iframe para evitar conflito de CSS com o site cliente,
      // OU renderizamos HTML direto com Shadow DOM para estilização limpa.
      
      // Abordagem com Iframe (mais segura para embeds genéricos):
      const iframe = document.createElement('iframe');
      
      // O src do iframe será a nossa aplicação React, numa rota específica para renderizar apenas o formulário.
      iframe.src = `${API_BASE_URL}/f/${token}`;
      iframe.style.width = '100%';
      iframe.style.height = '600px'; // Inicial, pode ser dinâmico
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.style.backgroundColor = 'transparent';
      
      // Escutar mensagens do iframe (ex: para redimensionamento dinâmico da altura)
      window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'resize-form' && event.data.token === token) {
           iframe.style.height = event.data.height + 'px';
        }
      });

      container.innerHTML = ''; // limpa o loading
      container.appendChild(iframe);
    }
  };
})();
