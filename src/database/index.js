import * as SQLite from "expo-sqlite";
import { Alert } from "react-native";

export function create() {
  const db = SQLite.openDatabaseSync("database.db");

  db.execSync(`
        CREATE TABLE IF NOT EXISTS dboAgendamento (
         id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
         nomeCliente TEXT NOT NULL,
         telCliente TEXT NOT NULL,
         dataAgendamento TEXT NOT NULL, 
         horaAgendamento TEXT NOT NULL,
         atendimento NUMERIC,
         descricao TEXT
         );

        CREATE TABLE IF NOT EXISTS dboServico(
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
        nome TEXT NOT NULL,
        descricao TEXT,
        favorito NUMERIC
        );

        CREATE TABLE IF NOT EXISTS dboColaborador(
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        nome TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS dboColaboradorServico(
        codColaborador INTEGER NOT NULL DEFAULT 1 REFERENCES dboColaborador ON DELETE SET DEFAULT,
        codServico INTEGER NOT NULL DEFAULT 1 REFERENCES dboServico ON DELETE SET DEFAULT,
        favorito NUMERIC,
        PRIMARY KEY (codColaborador, codServico)
        );

        CREATE TABLE IF NOT EXISTS dboAgendamentoServico(
        codAgendamento INTEGER NOT NULL REFERENCES dboAgendamento,
        codServico INTEGER  NOT NULL DEFAULT 1 REFERENCES dboServico ON DELETE SET DEFAULT,
       
        PRIMARY KEY(codAgendamento, codServico)
        );
        
        CREATE TABLE IF NOT EXISTS dboAgendamentoColaborador(
        codAgendamento INTEGER NOT NULL REFERENCES dboAgendamento,
        codColaborador INTEGER  NOT NULL DEFAULT 1 REFERENCES dboColaborador ON DELETE SET DEFAULT,

         PRIMARY KEY(codAgendamento, codColaborador)
        );
        
    
        `);
  insertDefault();
}

export function dropTables() {
  const db = SQLite.openDatabaseSync("database.db");
  db.execSync("DROP TABLE dboAgendamento");
  db.execSync("DROP TABLE dboServico");
  db.execSync("DROP TABLE dboColaborador");
  db.execSync("DROP TABLE dboColaboradorServico");
  db.execSync("DROP TABLE dboAgendamentoServico");
  db.execSync("DROP TABLE dboAgendamentoColaborador");
}

//Função para inserir um serviço e um colaborador padrão no sistema
export function insertDefault() {
  const db = SQLite.openDatabaseSync("database.db");

  const selectServico = db.getAllSync("SELECT * FROM dboServico WHERE id = 1");
  const selectColaborador = db.getAllSync(
    "SELECT * FROM dboColaborador WHERE id = 1"
  );

  if (selectServico === null || selectServico == 0) {
    db.runSync(
      "INSERT INTO dboServico (id,nome, descricao,favorito) VALUES (?,?,?,?)",
      [1, "Padrão", "...", 1]
    );
  }
  if (selectColaborador === null || selectColaborador == 0) {
    db.runSync("INSERT INTO dboColaborador (id, nome) VALUES (?, ?)", [
      1,
      "Padrão",
    ]);
  }
}

//Função para adicionar um serviço
export function addServico(nome, descricao) {
  const db = SQLite.openDatabaseSync("database.db");
  try {
    const result = db.runSync(
      "INSERT INTO dboServico (nome, descricao) VALUES (?, ?)",
      [nome, descricao]
    );

    if (result.changes > 0) return true;
    else return false;
  } catch (error) {
    console.log("erro", error);
  }
}

//Função para adicionar agendamento
export function addAgendamento(
  data,
  horaAgendamento,
  nomeCliente,
  telCliente,
  descricao,
  vetorServico,
  vetorColaborador
) {
  const db = SQLite.openDatabaseSync("database.db");

  if (checkAgendamentoExistente(data, horaAgendamento)) {
    Alert.alert(
      "Atenção!",
      "Já existe um agendamento cadastrado neste horário!"
    );
  }

  try {
    const result = db.runSync(
      "INSERT INTO dboAgendamento (dataAgendamento, horaAgendamento, descricao, nomeCliente, telCliente) VALUES (?, ?, ?, ?, ?)",
      [data, horaAgendamento, descricao, nomeCliente, telCliente]
    );

    if (result.changes > 0) {
      //essa parte insere os dados nas tabelas de relacionamento do Agendamento
      const insertAgendamentoServico = addAgendamentoServico(
        result.lastInsertRowId,
        vetorColaborador
      );
      const insertAgendamentoColaborador = addAgendamentoColaborador(
        result.lastInsertRowId,
        vetorServico
      );

      if (
        insertAgendamentoServico == true &&
        insertAgendamentoColaborador == true
      ) {
        return true;
      } else {
        console.log(error);
        return false;
      }
    } else return false;
  } catch (error) {
    console.log("Erro ao adicionar agendamento: ", error);
    return false;
  }
}

//Função para adicionar um colaborador
export function setAtendimento(id, atendimento) {
  const db = SQLite.openDatabaseSync("database.db");

  try {
    const result = db.runSync(
      "UPDATE dboAgendamento SET atendimento = (?) WHERE id = (?)",
      [atendimento, id]
    );

    if (result.changes > 0) return true;
    else return false;
  } catch (error) {
    console.log("erro", error);
  }
}

//Função para verificar se existe um agendamento em um horario
export function checkAgendamentoExistente(data, horaAgendamento) {
  const db = SQLite.openDatabaseSync("database.db");
  const result = db.getFirstSync(
    "SELECT COUNT(*) FROM dboAgendamento WHERE dataAgendamento = (?) AND horaAgendamento = (?)",
    [data, horaAgendamento]
  );
  return result["COUNT(*)"] > 0;
}
//Função que retorna todos os serviços cadastrados por ordem de favorito e em ordem alfabetica
export function viewServicoAll() {
  const db = SQLite.openDatabaseSync("database.db");

  const resultFavoritos = db.getAllSync(
    "SELECT * FROM dboServico WHERE favorito = 1"
  );
  const resultSemFavoritos = db.getAllSync(
    "SELECT * FROM dboServico WHERE favorito is null"
  );

  let vetorFav = resultFavoritos.sort((a, b) => a.nome.localeCompare(b.nome));
  let vetorNFav = resultSemFavoritos.sort((a, b) =>
    a.nome.localeCompare(b.nome)
  );

  let vetorFinal = [...vetorFav, ...vetorNFav];
  return vetorFinal;
}
//Função que retorna um serviço referente ao ID
export function viewServicoID(id) {
  const db = SQLite.openDatabaseSync("database.db");

  const result = db.getFirstSync("SELECT * from dboServico WHERE id = (?)", [
    id,
  ]);

  return result;
}
//Função para atualizar o serviço
export function updateServico(id, nome, descricao) {
  const db = SQLite.openDatabaseSync("database.db");
  const result = db.runSync(
    "UPDATE dboServico SET nome = (?), descricao = (?) WHERE id = (?)",
    [nome, descricao, id]
  );
  if (result.changes > 0) return true;
  else return false;
}
//Função que adiciona o servico como favorito
export function updateServicoFavorito(id, favorito) {
  const db = SQLite.openDatabaseSync("database.db");

  const result = db.runSync(
    "UPDATE dboServico SET favorito = (?) WHERE id = (?)",
    [favorito, id]
  );

  if (result.changes > 0) return true;
  else return false;
}
//Função que retorna todos os agendamentos
export function viewAgendamentosAll() {
  const db = SQLite.openDatabaseSync("database.db");

  const result = db.getAllSync(
    "SELECT * from dboAgendamento ORDER BY (dataAgendamento)"
  );

  return result;
}
//Função que retorna os agendamentos de um dia
export function viewAgendamentosPorDia(data) {
  const db = SQLite.openDatabaseSync("database.db");
  const result = db.getAllSync(
    "SELECT * FROM dboAgendamento WHERE dataAgendamento = (?)",
    [data]
  );
  return result;
}
//Função que retorna um unico agendamento
export function viewAgendamentoID(id) {
  const db = SQLite.openDatabaseSync("database.db");
  const result = db.getFirstSync(
    "SELECT * FROM dboAgendamento WHERE id = (?)",
    [id]
  );
  return result;
}
//Função que conta quantos agendamentos tem em um dia
export async function countAgendamentosPorDia(data) {
  const db = SQLite.openDatabaseSync("database.db");

  const result = await db.getFirstAsync(
    "SELECT COUNT(*) FROM dboAgendamento WHERE dataAgendamento = (?)",
    [data]
  );

  return result["COUNT(*)"];
}
//Função que conta os agendamentos por semana
export async function countAgendamentosPorSemana(data) {
  const date = new Date(data);

  const { inicio, fim } = getWeekRange(date);

  const db = SQLite.openDatabaseSync("database.db");
  const result = await db.getFirstAsync(
    "SELECT COUNT(*) FROM dboAgendamento WHERE dataAgendamento BETWEEN (?) AND (?)",
    [inicio, fim]
  );

  return result["COUNT(*)"];
}
//Função para deletar o agendamento
export function deleteAgendamento(id) {
  const db = SQLite.openDatabaseSync("database.db");

  try {
    const result = db.runSync("DELETE FROM dboAgendamento WHERE id = (?)", [
      id,
    ]);

    if (result.changes > 0) return true;
    else return false;
  } catch (error) {
    console.log("erro:", error);
    return false;
  }
}
//Função para editar o agendamento
export function editarAgendamento(
  id,
  data,
  hora,
  nomeCliente,
  telCliente,
  descricao
) {
  try {
    const db = SQLite.openDatabaseSync("database.db");

    const result = db.runSync(
      `
            UPDATE dboAgendamento
                SET dataAgendamento = (?), 
                horaAgendamento = (?),  
                nomeCliente = (?), 
                telCliente = (?), 
                descricao = (?)
            WHERE id = (?)
            `,
      [data, hora, nomeCliente, telCliente, descricao, id]
    );

    if (result.changes > 0) return true;
  } catch (error) {
    console.log("Erro ao editar agendamento: ", error);
    return false;
  }
}
//Função para deletar o serviço
export function deleteServico(id) {
  const db = SQLite.openDatabaseSync("database.db");

  try {
    const result = db.runSync("DELETE FROM dboServico WHERE id = (?)", [id]);

    if (result.changes > 0) return true;
    else return false;
  } catch (error) {
    console.log("erro:", error);
  }
}
//Função para adicionar o colaborador
export function addColaborador(nome) {
  const db = SQLite.openDatabaseSync("database.db");
  try {
    const result = db.runSync("INSERT INTO dboColaborador (nome) VALUES (?)", [
      nome,
    ]);

    if (result.changes > 0) return true;
    else return false;
  } catch (error) {
    console.log("erro:", error);
  }
}
//Função para cadastrar um serviço para um colaborador, ela já adiciona ele como favorito se o valor passado for 1
export function addServicoColaborador(idColaborador, idServico, favorito) {
  const db = SQLite.openDatabaseSync("database.db");
  try {
    const result = db.runSync(
      "INSER INTO dboColaboradorServico VALUES (?, ?, ?)",
      [idColaborador, idServico, favorito]
    );

    if (result.changes > 0) return true;
    else return false;
  } catch (error) {
    console.log("erro", error);
    return false;
  }
}
//Função para adicionar um serviço novo no agendamento
export function addAgendamentoServico(idAgendamento, vetorServico) {
  const db = SQLite.openDatabaseSync("database.db");
  try {
    const result = "";
    let count = 0;
    vetorServico.forEach((idServico) => {
      result = db.runSync("INSER INTO dboAgendamentoServico VALUES (?, ?)", [
        idAgendamento,
        idServico,
      ]);

      if (result.changes > 0) count++;
    });

    if (count >= vetorServico.length()) return true;
    else return false;
  } catch (error) {
    console.log("erro", error);
    return false;
  }
}
//Função para adicionar um novo colaborador ao agendamento
export function addAgendamentoColaborador(idAgendamento, vetorColaborador) {
  const db = SQLite.openDatabaseSync("database.db");
  try {
    let count;
    const result = "";
    vetorColaborador.forEach((idColaborador) => {
      result = db.runSync(
        "INSER INTO dboAgendamentoColaborador VALUES (?, ?)",
        [idAgendamento, idColaborador]
      );
      if (result.changes > 0) count++;
    });

    if (count >= vetorColaborador.length()) return true;
    else return false;
  } catch (error) {
    console.log("erro", error);
    return false;
  }
}
//Função para deletar um serviço realizado por um colaborador
export function delServicoColaborador(idColaborador, idServico) {
  const db = SQLite.openDatabaseSync("database.db");
  try {
    const result = db.runSync(
      "DELETE FROM dboColaboradorServico WHERE codColaborador = (?) AND codServico = (?)",
      [idColaborador, idServico]
    );

    if (result.changes > 0) return true;
    else return false;
  } catch (error) {
    console.log("erro", error);
    return false;
  }
}
//Função para deletar um serviço de um agendamento
export function deleteAgendamentoServico(idAgendamento, idServico) {
  try {
    const result = db.runSync(
      "DELETE FROM dboAgendamentoServico WHERE codAgendamento = (?) AND codServico = (?)",
      [idAgendamento, idServico]
    );

    if (result.changes > 0) return true;
    else return false;
  } catch (error) {
    console.log("erro", error);
    return false;
  }
}
//Função para deletar um colaborador de um agendamento
export function deleteAgendamentoColaborador(idAgendamento, idColaborador) {
  try {
    const result = db.runSync(
      "DELETE FROM dboAgendamentoColaborador WHERE codAgendamento = (?) AND codColaborador = (?)",
      [idAgendamento, idColaborador]
    );

    if (result.changes > 0) return true;
    else return false;
  } catch (error) {
    console.log("erro", error);
    return false;
  }
}
//Função para saber quais serviços um colaborador realiza
export function viewServicoColaborador(codColaborador) {
  const db = SQLite.openDatabaseSync("database.db");
  try {
    const result = db.getAllSync(
      "SELECT * FROM dboColaboradorServico WHERE codColaborador = (?)"[
        codColaborador
      ]
    );
    return result;
  } catch (error) {
    console.log("Erro", error);
  }
}
//Função para ver os colaboradores registrados em um agendamento
export function viewColaboradorAgendamento(codAgendamento) {
  const db = SQLite.openDatabaseSync("database.db");
  const result = db.getAllSync(
    "SELECT codColaborador FROM dboAgendamentoColaborador WHERE codAgendamento = (?)",
    [codAgendamento]
  );
  return result;
}
//Função para ver os servicos registrados em um agendamento
export function viewServicoAgendamento(codAgendamento) {
  const db = SQLite.openDatabaseSync("database.db");
  const result = db.getAllSync(
    "SELECT codServico FROM dboAgendamentoServico WHERE codAgendamento = (?)",
    [codAgendamento]
  );
  return result;
}
//Função para retornar todos os colaboradores
export function viewColaboradorAll() {
  const db = SQLite.openDatabaseSync("database.db");
  const result = db.getAllSync("SELECT * FROM dboColaborador");
  return result;
}
//Função para retornar os colaboradores que realizam o serviço
export function viewColaboradoresServico(codServico) {
  const db = SQLite.openDatabaseSync("database.db");
  const servFav = db.getAllSync(
    "SELECT codColaborador FROM dboColaboradorServico WHERE codServico = (?) AND favorito = 1",
    [codServico]
  );
  const servNFav = db.getAllSync(
    "SELECT codColaborador FROM dboColaboradorServico WHERE codServico = (?) AND favorito is null",
    [codServico]
  );

  let vetorFav = servFav.sort((a, b) => a.nome.localeCompare(b.nome));
  let vetorNFav = servNFav.sort((a, b) => a.nome.localeCompare(b.nome));
  let vetorFinal = [...vetorFav, ...vetorNFav];
  return vetorFinal;
}
//Função que retorna um unico colaborador
export function viewColaborador(id) {
  const db = SQLite.openDatabaseSync("database.db");
  return db.getAllSync("SELECT * FROM dboColaborador WHERE id = (?)", [id]);
}
//Função que edita o colaborador
export function updateColaborador(id, nome) {
  const db = SQLite.openDatabaseSync("database.db");
  try {
    const result = db.runSync(
      "UPDATE dboColaborador SET nome = (?) WHERE id = (?)",
      [nome, id]
    );

    if (result.changes > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}
// daqui pra baixo nada é meu //
export function verSemanasComAgendamentos() {
  const db = SQLite.openDatabaseSync("database.db");

  // Consulta para buscar todas as datas de agendamentos
  const result = db.getAllSync(
    "SELECT DISTINCT dataAgendamento FROM dboAgendamento ORDER BY dataAgendamento ASC"
  );

  if (result.length === 0) {
    return [];
  }

  const semanasComAgendamentos = [];

  result.forEach((row) => {
    const date = new Date(row.dataAgendamento);
    const firstDayOfWeek = getFirstDayOfWeek(date);
    const lastDayOfWeek = getLastDayOfWeek(date);

    // Formata as datas no formato desejado
    const label = `${formatDate(firstDayOfWeek)} à ${formatDate(
      lastDayOfWeek
    )} - ${firstDayOfWeek.getFullYear()}`;
    const value = date.toISOString().split("T")[0]; // Formato 'YYYY-MM-DD'

    // Verifica se a semana já está na lista, caso contrário, adiciona
    if (!semanasComAgendamentos.some((semana) => semana.value === value)) {
      semanasComAgendamentos.push({ label, value });
    }
  });

  return semanasComAgendamentos;
}

function getWeekRange(date) {
  const day = date.getDay(); // Obtém o dia da semana (0 = Domingo, 1 = Segunda, etc.)

  // Calcula a diferença para voltar ao domingo
  const diffToSunday = -day; // Se for domingo (day === 0), diff será 0
  const firstDayOfWeek = new Date(date); // Cria uma nova data
  firstDayOfWeek.setDate(date.getDate() + diffToSunday); // Ajusta para o domingo mais recente

  const lastDayOfWeek = new Date(firstDayOfWeek); // Clona a data do primeiro dia
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // Ajusta para o sábado

  return {
    inicio: firstDayOfWeek.toISOString().split("T")[0], // Formata 'YYYY-MM-DD'
    fim: lastDayOfWeek.toISOString().split("T")[0], // Formata 'YYYY-MM-DD'
  };
}

export function getDaysOfWeek(startDate) {
  const daysOfWeek = [];
  const monthNames = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
  ];

  // Garantir que a data de início seja um objeto Date
  let currentDate = new Date(startDate);
  const dayOfWeek = currentDate.getDay(); // Obtém o dia da semana (0 para domingo, 1 para segunda, etc.)

  // Ajustar para o último domingo
  currentDate.setDate(currentDate.getDate() - dayOfWeek);

  for (let i = 0; i <= 8; i++) {
    // Loop para os 7 dias da semana (de domingo a sábado)
    const newDate = new Date(currentDate); // Cria uma nova instância de currentDate
    newDate.setDate(currentDate.getDate() + i); // Adiciona i dias a partir do domingo calculado

    const day = String(newDate.getDate()).padStart(2, "0"); // Pega o dia com dois dígitos
    const month = monthNames[newDate.getMonth()]; // Nome do mês abreviado
    newDate.setDate(newDate.getDate() - 1);
    const date = newDate.toISOString().split("T")[0]; // Formato 'YYYY-MM-DD'
    //console.log(`date: ${date}, i: ${i}, day: ${day}, month: ${month}`);
    daysOfWeek.push({ dia: day, mes: month, date: date });
  }

  return daysOfWeek;
}

function getFirstDayOfWeek(date) {
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
}

function getLastDayOfWeek(date) {
  const firstDay = getFirstDayOfWeek(date);
  return new Date(firstDay.getTime() + 6 * 24 * 60 * 60 * 1000);
}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

function formatDateForValue(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}`;
}
