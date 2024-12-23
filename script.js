// Configuração dos IDs e chave de API
const SHEET_ID = "18w9bO8JMnnKp8QLEUKnM1yFUC6TcEISpgWEsYy1DQn8"; // Substitua pelo ID da sua planilha
const API_KEY = "1s4GOAl3ns5EfZdUrEmaylkvs4J-1mXnAEntKi_sPIBd3Ym7fizB2_M5n"; // Substitua pela sua chave de API
const SHEET_RANGE = "Sheet1!A1:H"; // Intervalo que cobre seus dados


function doPost(e) {
  try {
    // Abre a planilha
    const sheet = SpreadsheetApp.openById("18w9bO8JMnnKp8QLEUKnM1yFUC6TcEISpgWEsYy1DQn8");
    const ws = sheet.getActiveSheet();

    // Extrai os dados enviados
    const params = e.parameter;

    // Adiciona os dados à planilha
    ws.appendRow([
      new Date(), // Adiciona a data e hora do registro
      params.observador,
      params.data,
      params.hora,
      params.profissao,
      
      params.setor,
      params.oportunidades,
      params.indicacoes,
      params.acao
    ]);

    // Resposta de sucesso
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    // Retorna erro caso falhe
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}



// Busca os dados da planilha
fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}?key=${API_KEY}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao acessar a planilha. Status: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.values) {
            const headers = data.values[0]; // Cabeçalhos
            const rows = data.values.slice(1); // Dados (sem os cabeçalhos)

            console.log("Cabeçalhos:", headers);
            console.log("Dados:", rows);

            // Exemplo: Exibir os dados no HTML
            const table = document.createElement("table");
            const thead = document.createElement("thead");
            const tbody = document.createElement("tbody");

            // Cria os cabeçalhos da tabela
            const headerRow = document.createElement("tr");
            headers.forEach(header => {
                const th = document.createElement("th");
                th.textContent = header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

            // Cria as linhas da tabela
            rows.forEach(row => {
                const tr = document.createElement("tr");
                row.forEach(cell => {
                    const td = document.createElement("td");
                    td.textContent = cell || ""; // Preenche com valor ou vazio
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });

            table.appendChild(thead);
            table.appendChild(tbody);
            document.body.appendChild(table); // Adiciona a tabela ao corpo da página
        } else {
            console.warn("Nenhum dado encontrado na planilha.");
        }
    })
    .catch(error => {
        console.error("Erro ao acessar a planilha:", error);
    });
      window.scrollTo({ top: 0, behavior: 'smooth' });
