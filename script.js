    /*
      =============================================
      ESTADO DA APLICAÇÃO
      
      Assim como na calculadora, guardamos tudo
      em variáveis. Aqui o dado mais complexo é
      o array de custos extras.
      
      Array: lista ordenada de valores.
      Ex: [10, 20, 30] ou [{nome:'X', valor:50}]
      =============================================
    */
 
    // Array de objetos — cada custo tem nome e valor
    let custos = [];
 
    // Contador para criar IDs únicos para cada custo
    let proximoId = 1;
 
 
    /*
      =============================================
      FUNÇÃO: adicionarCusto()
      
      Lê os campos de texto, cria um objeto com
      os dados e adiciona ao array custos[].
      
      Depois re-renderiza a lista na tela.
      
      CONCEITO NOVO: objeto literal { chave: valor }
    ============================================= */
    function adicionarCusto() {
      // .value lê o texto digitado no input
      const nome  = document.getElementById('custo-nome').value.trim();
      const valor = parseFloat(document.getElementById('custo-valor').value);
 
      // Validação: interrompe se estiver vazio ou inválido
      if (!nome || isNaN(valor) || valor <= 0) {
        alert('Preencha a descrição e o valor do custo.');
        return; // para a função aqui
      }
 
      // Cria um objeto e empurra no array
      custos.push({
        id: proximoId++,   // id único (incrementa a cada custo)
        nome: nome,
        valor: valor
      });
 
      // Limpa os campos após adicionar
      document.getElementById('custo-nome').value  = '';
      document.getElementById('custo-valor').value = '';
 
      // Atualiza a lista visual na tela
      renderizarCustos();
    }
 
 
    /*
      =============================================
      FUNÇÃO: removerCusto(id)
      
      Recebe o id do custo e remove do array.
      
      CONCEITO NOVO: filter()
      filter() percorre o array e retorna um novo
      array só com os itens que passam no teste.
      
      custo.id !== id → "todos exceto o que tem esse id"
    ============================================= */
    function removerCusto(id) {
      custos = custos.filter(function(custo) {
        return custo.id !== id;
      });
      renderizarCustos();
    }
 
 
    /*
      =============================================
      FUNÇÃO: renderizarCustos()
      
      Limpa a lista e a reconstrói do zero
      com base no array custos[].
      
      CONCEITO NOVO: innerHTML e forEach()
      innerHTML define o HTML interno de um elemento.
      forEach() percorre cada item do array.
    ============================================= */
    function renderizarCustos() {
      const lista = document.getElementById('lista-custos');
 
      // Limpa a lista
      lista.innerHTML = '';
 
      // Para cada custo no array, cria um <li>
      custos.forEach(function(custo) {
        const li = document.createElement('li');  // cria elemento
 
        li.innerHTML = `
          <span>${custo.nome}</span>
          <span>${formatarMoeda(custo.valor)}</span>
          <button class="btn-remover" onclick="removerCusto(${custo.id})">×</button>
        `;
        // Template literal: texto com ${variavel} dentro
 
        lista.appendChild(li); // adiciona o <li> na lista
      });
 
      // Soma todos os valores do array com reduce()
      /*
        CONCEITO NOVO: reduce()
        Percorre o array e acumula um valor.
        acc = acumulador (começa em 0)
        custo = item atual
        acc + custo.valor = vai somando tudo
      */
      const totalCustos = custos.reduce(function(acc, custo) {
        return acc + custo.valor;
      }, 0); // 0 é o valor inicial do acumulador
 
      // Mostra ou esconde o total de custos
      const labelTotal = document.getElementById('total-custos-label');
      const txtTotal   = document.getElementById('total-custos-txt');
 
      if (custos.length > 0) {
        labelTotal.style.display = 'block';
        txtTotal.textContent = formatarMoeda(totalCustos);
      } else {
        labelTotal.style.display = 'none';
      }
    }
 
 
    /*
      =============================================
      FUNÇÃO: calcular()
      
      Lê todos os inputs, faz as contas e exibe
      o resultado.
      
      FÓRMULA:
      custoBase   = horas × valorHora + totalCustos
      valorMinimo = custoBase
      valorSugerido = custoBase + (custoBase × margem/100)
    ============================================= */
    function calcular() {
      // Lê os valores dos inputs e converte para número
      const horas      = parseFloat(document.getElementById('horas').value);
      const valorHora  = parseFloat(document.getElementById('valor-hora').value);
      const margem     = parseFloat(document.getElementById('margem').value);
 
      // Validação básica
      if (isNaN(horas) || horas <= 0) {
        alert('Informe as horas estimadas.');
        return;
      }
      if (isNaN(valorHora) || valorHora <= 0) {
        alert('Informe o seu valor por hora.');
        return;
      }
 
      // Soma todos os custos extras com reduce()
      const totalCustos = custos.reduce(function(acc, c) {
        return acc + c.valor;
      }, 0);
 
      // Cálculos principais
      const custoBase     = (horas * valorHora) + totalCustos;
      const valorMinimo   = custoBase;
      const lucro         = custoBase * (margem / 100);
      const valorSugerido = custoBase + lucro;
 
      // Porcentagem de lucro sobre o valor sugerido (para a barra)
      const pctLucro = (lucro / valorSugerido) * 100;
 
      // Atualiza o DOM com os resultados
      document.getElementById('res-custo-base').textContent = formatarMoeda(custoBase);
      document.getElementById('res-minimo').textContent     = formatarMoeda(valorMinimo);
      document.getElementById('res-sugerido').textContent   = formatarMoeda(valorSugerido);
      document.getElementById('barra-pct').textContent      = `Lucro ${margem}%`;
 
      // Anima a barra de lucro
      // setTimeout aguarda um frame para a transição CSS funcionar
      setTimeout(function() {
        document.getElementById('barra-fill').style.width = pctLucro + '%';
      }, 50);
 
      // Mostra o card de resultado (estava display:none)
      document.getElementById('resultado').style.display = 'block';
 
      // Monta o texto do resumo (mas não mostra ainda)
      const linhasCustos = custos.map(function(c) {
        return `  · ${c.nome}: ${formatarMoeda(c.valor)}`;
      }).join('\n'); // join une o array de strings com \n
 
      document.getElementById('resumo-texto').textContent =
        `ORÇAMENTO — ${new Date().toLocaleDateString('pt-BR')}\n` +
        `─────────────────────────────\n` +
        `Horas: ${horas}h × ${formatarMoeda(valorHora)}/h\n` +
        (linhasCustos ? `Custos extras:\n${linhasCustos}\n` : '') +
        `─────────────────────────────\n` +
        `Custo base:      ${formatarMoeda(custoBase)}\n` +
        `Margem (${margem}%):    ${formatarMoeda(lucro)}\n` +
        `─────────────────────────────\n` +
        `VALOR SUGERIDO:  ${formatarMoeda(valorSugerido)}\n`;
 
      // Rola a página até o resultado
      document.getElementById('resultado').scrollIntoView({ behavior: 'smooth' });
    }
 
 
    /*
      =============================================
      FUNÇÃO: verResumo()
      
      Alterna a visibilidade do bloco de texto.
      Usa o operador ternário para decidir o valor.
      
      Ternário: condição ? valor_se_verdade : valor_se_falso
    ============================================= */
    function verResumo() {
      const el = document.getElementById('resumo-texto');
      el.style.display = el.style.display === 'block' ? 'none' : 'block';
    }
 
 
    /*
      =============================================
      FUNÇÃO: copiarResumo()
      
      Usa a API do navegador para copiar texto.
      navigator.clipboard.writeText() retorna uma
      Promise — veremos isso melhor quando estudar
      fetch() e async/await.
    ============================================= */
    function copiarResumo() {
      const texto = document.getElementById('resumo-texto').textContent;
      if (!texto) { alert('Calcule o orçamento primeiro.'); return; }
 
      navigator.clipboard.writeText(texto).then(function() {
        mostrarToast();
      });
    }
 
 
    /*
      =============================================
      FUNÇÃO: mostrarToast()
      
      Mostra a mensagem de "copiado" por 2 segundos.
      setTimeout agenda uma ação para daqui X ms.
      1000ms = 1 segundo.
    ============================================= */
    function mostrarToast() {
      const toast = document.getElementById('toast');
      toast.classList.add('show');
      setTimeout(function() {
        toast.classList.remove('show');
      }, 2000);
    }
 
 
    /*
      =============================================
      FUNÇÃO: resetar()
      
      Volta tudo ao estado inicial.
    ============================================= */
    function resetar() {
      custos = [];
      proximoId = 1;
      renderizarCustos();
 
      document.getElementById('horas').value      = '';
      document.getElementById('valor-hora').value = '';
      document.getElementById('margem').value     = '20';
      document.getElementById('resultado').style.display = 'none';
      document.getElementById('resumo-texto').style.display = 'none';
      document.getElementById('barra-fill').style.width = '0%';
    }
 
 
    /*
      =============================================
      FUNÇÃO: formatarMoeda(valor)
      
      CONCEITO IMPORTANTE: Intl.NumberFormat
      É uma API nativa do JS para formatar números
      de acordo com o idioma/região.
      
      Nunca faça: "R$ " + valor.toFixed(2)
      Isso não lida com milhares corretamente.
      
      Use sempre Intl.NumberFormat para moeda!
    ============================================= */
    function formatarMoeda(valor) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor);
    }
 
 
    /*
      =============================================
      EVENTO DE TECLADO
      
      addEventListener escuta eventos no elemento.
      Aqui: quando o usuário pressiona Enter nos
      campos de custo, chama adicionarCusto().
      
      event.key === 'Enter' verifica qual tecla.
    ============================================= */
    document.getElementById('custo-valor').addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        adicionarCusto();
      }
    });