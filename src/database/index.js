import * as SQLite from "expo-sqlite";
import { Alert } from "react-native";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

const CURRENT_DB_VERSION = 2;

export function create() {
  const db = SQLite.openDatabaseSync("database.db");
  useDrizzleStudio(db);

  const db_version =  db.getFirstSync('PRAGMA user_version');

    if(db_version.user_version >= CURRENT_DB_VERSION)
      return;

   if(db_version.user_version === 0){  
  db.execSync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;

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
        
        PRAGMA user_version = 1
        `);
  insertDefault();
  }
   if(db_version.user_version === 1){
    db.execSync(`
      
      CREATE TABLE IF NOT EXISTS dboEmpresa(
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        nomeEmpresa TEXT NOT NULL,
        telefoneEmpresa TEXT NOT NULL,
        enderecoEmpresa TEXT NOT NULL,
        logo TEXT ,
        ramoEmpresa TEXT NOT NULL
        );

      PRAGMA user_version = 2
      `);
  }
 
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
export function addServico(nome, descricao, favorito = 0) {
  const db = SQLite.openDatabaseSync("database.db");
  try {
    const result = db.runSync(
      "INSERT INTO dboServico (nome, descricao, favorito) VALUES (?, ?, ?)",
      [nome, descricao, favorito]
    );

    if (result.changes > 0) return true;
    else return false;
  } catch (error) {
    console.log("erro", error);
  }
}

// Função para adicionar agendamento
export function addAgendamento(
  data,
  horaAgendamento,
  nomeCliente,
  telCliente,
  descricao,
  vetorServico,
  vetorColaborador
) {
  console.log("entrou na função de adicionar");
  console.log("Data:", data);
  console.log("Hora do Agendamento:", horaAgendamento);
  console.log("Nome do Cliente:", nomeCliente);
  console.log("Telefone do Cliente:", telCliente);
  console.log("Descrição:", descricao);
  console.log("Vetor de Serviço:", vetorServico);
  console.log("Vetor de Colaborador:", vetorColaborador);

  const db = SQLite.openDatabaseSync("database.db");

  const check = checkAgendamentoExistente(data, horaAgendamento);
  if (check == true) {
    Alert.alert(
      "Atenção!",
      "Já existe um agendamento cadastrado neste horário!"
    );
    // return false; // Retorna falso se já existe
  }
  console.log("passou do check");
  try {
    db.withTransactionSync(() => {
      // Inserindo agendamento
      const result = db.runSync(
        "INSERT INTO dboAgendamento (dataAgendamento, horaAgendamento, descricao, nomeCliente, telCliente) VALUES (?, ?, ?, ?, ?)",
        [data, horaAgendamento, descricao, nomeCliente, telCliente]
      );
      console.log(result.changes);
      if (result.changes > 0) {
        const idAgendamento = result.lastInsertRowId;
        let countS = 0;
        let countC = 0;

        // Inserindo serviços
        vetorServico.forEach((idServico) => {
          const result = db.runSync(
            "INSERT INTO dboAgendamentoServico VALUES (?, ?)",
            [idAgendamento, idServico]
          );

          if (result.changes > 0) countS++;
        });
        if (countS < vetorServico.length) {
          throw new Error("Erro ao inserir serviços!");
        }

        // Inserindo colaboradores
        vetorColaborador.forEach((idColaborador) => {
          const result = db.runSync(
            "INSERT INTO dboAgendamentoColaborador VALUES (?, ?)",
            [idAgendamento, idColaborador]
          );

          if (result.changes > 0) countC++;
        });

        if (countC < vetorColaborador.length) {
          throw new Error("Nem todos os colaboradores foram inseridos");
        }
      } else {
        throw new Error("Erro ao inserir agendamento");
      }
    });
    return true; // Sucesso
  } catch (error) {
    console.log("Erro ao adicionar agendamento: ", error);
    return false; // Falha
  }
}

// Função para adicionar um serviço novo no agendamento
export function addAgendamentoServico(idAgendamento, vetorServico) {
  const db = SQLite.openDatabaseSync("database.db");
  try {
    db.withTransactionSync(() => {
      let count = 0;

      vetorServico.forEach((idServico) => {
        const result = db.runSync(
          "INSERT INTO dboAgendamentoServico VALUES (?, ?)",
          [idAgendamento, idServico]
        );

        if (result.changes > 0) count++;
      });

      if (count < vetorServico.length) {
        throw new Error("Nem todos os serviços foram inseridos");
      }
    });

    return true; // Sucesso
  } catch (error) {
    console.log("Erro ao adicionar serviço ao agendamento", error);
    return false; // Falha
  }
}

// Função para adicionar um novo colaborador ao agendamento
export function addAgendamentoColaborador(idAgendamento, vetorColaborador) {
  const db = SQLite.openDatabaseSync("database.db");
  try {
    //essa tranzação faz com que o agendamento só seja adicionado quando tudo estiver ok
    db.withTransactionSync(() => {
      let count = 0;

      vetorColaborador.forEach((idColaborador) => {
        const result = db.runSync(
          "INSERT INTO dboAgendamentoColaborador VALUES (?, ?)",
          [idAgendamento, idColaborador]
        );

        if (result.changes > 0) count++;
      });

      if (count < vetorColaborador.length) {
        throw new Error("Nem todos os colaboradores foram inseridos");
      }
    });

    return true; // Sucesso
  } catch (error) {
    console.log("Erro ao adicionar colaborador ao agendamento", error);
    return false; // Falha
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
  const result = db.getAllSync(
    "SELECT * FROM dboAgendamento WHERE dataAgendamento = (?) AND horaAgendamento = (?)",
    [data, horaAgendamento]
  );

  console.log("result",result);

  if(result != null && result.length != 0 )
  return true;
else 
  return false;
}
//Função que retorna todos os serviços cadastrados por ordem de favorito e em ordem alfabetica
export function viewServicoAll() {
  const db = SQLite.openDatabaseSync("database.db");

  const resultFavoritos = db.getAllSync(
    "SELECT * FROM dboServico ORDER BY favorito DESC"
  );

  return resultFavoritos;
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
export function updateServico(id, nome, descricao, favorito = 0) {
  const db = SQLite.openDatabaseSync("database.db");
  const result = db.runSync(
    "UPDATE dboServico SET nome = (?), descricao = (?) WHERE id = (?)",
    [nome, descricao, id]
  );
  if (result.changes > 0) {
    updateServicoFavorito(id, favorito);
    return true;
  }
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
    "SELECT * FROM dboAgendamento WHERE dataAgendamento = (?) ORDER BY horaAgendamento ",
    [data]
  );
  return result;
}
//Função que retorna um unico agendamento
export function viewAgendamentoID(id) {
  const db = SQLite.openDatabaseSync("database.db");
  const result = db.getFirstSync(
    "SELECT * FROM dboAgendamento WHERE id = (?) ",
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
export function updateAgendamento(
  id,
  data,
  hora,
  nomeCliente,
  telCliente,
  descricao,
  vetorServico,
  vetorColaborador
) {
  try {
    const db = SQLite.openDatabaseSync("database.db");

    db.withTransactionSync(() => {
      db.runSync(
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

      db.runSync(
        "DELETE FROM dboAgendamentoColaborador WHERE codAgendamento = (?)",
        [id]
      );

      // Inserindo colaboradores
      let countC = 0;
      vetorColaborador.forEach((idColaborador) => {
        const result = db.runSync(
          "INSERT INTO dboAgendamentoColaborador VALUES (?, ?)",
          [id, idColaborador]
        );

        if (result.changes > 0) countC++;
      });

      if (countC < vetorColaborador.length) {
        throw new Error("Nem todos os colaboradores foram inseridos");
      }

      // Inserindo serviços
      let countS = 0;
      db.runSync(
        "DELETE FROM dboAgendamentoServico WHERE codAgendamento = (?)",
        [id]
      );

      vetorServico.forEach((idServico) => {
        const result = db.runSync(
          "INSERT INTO dboAgendamentoServico VALUES (?, ?)",
          [id, idServico]
        );

        if (result.changes > 0) countS++;
      });
      if (countS < vetorServico.length) {
        throw new Error("Erro ao inserir serviços!");
      }
    });
    return true;
  } catch (error) {
    console.log("Erro ao editar agendamento: ", error);
    return false;
  }
}
//Função para deletar o serviço
export function deleteServico(id) {
  const db = SQLite.openDatabaseSync("database.db");

  try {
    db.withTransactionSync(() =>
    {
      const result = db.runSync("DELETE FROM dboServico WHERE id = (?)", [id]);
      const delServicoAgendamento = db.runSync("DELETE FROM dboAgendamentoServico WHERE codServico = (?)",[id]);

    if (result.changes > 0 && delServicoAgendamento.changes > 0) {
     
      return true;
    }
    else return false; 
    }
  )
    
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

    if (result.changes > 0) return result.lastInsertRowId;
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
      "INSERT INTO dboColaboradorServico VALUES (?, ?, ?)",
      [idColaborador, idServico, favorito]
    );

    if (result.changes > 0) return true;
    else return false;
  } catch (error) {
    console.log("erro", error);
    return false;
  }
}

//Função para deletar um colaborador
export function delColaborador(idColaborador) {
  const db = SQLite.openDatabaseSync("database.db");

  try {
    const result = db.runSync("DELETE FROM dboColaborador WHERE id = (?)", [
      idColaborador,
    ]);
    if (result.changes > 0) return true;
  } catch (error) {
    console.log("erro ao deletar colaborador: ", error);
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
  console.log("codColaborador", codColaborador);
  const db = SQLite.openDatabaseSync("database.db");
  try {
    const result = db.getAllSync(
      "SELECT * FROM dboColaboradorServico WHERE codColaborador = (?)",
      [codColaborador]
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
    "SELECT codColaborador FROM dboColaboradorServico WHERE codServico = (?) AND favorito = 0",
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
  return db.getFirstSync("SELECT * FROM dboColaborador WHERE id = (?)", [id]);
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

export function addServicoRamo(ramoSelecionado) {

  // Lista de serviços com descrição
  const ramo = {
    restaurante: [
      { nome: "Serviço de mesa", descricao: "Atendimento e organização das mesas para os clientes." },
      { nome: "Cozinha", descricao: "Preparação e confecção de refeições com alta qualidade." },
      { nome: "Limpeza", descricao: "Manutenção e limpeza do ambiente do restaurante." },
      { nome: "Delivery", descricao: "Serviço de entrega de pedidos a domicílio." },
      { nome: "Atendimento ao cliente", descricao: "Suporte ao cliente para informações e dúvidas." }
    ],
    salaoDeBeleza: [
      { nome: "Corte de cabelo", descricao: "Serviço de corte e estilização do cabelo." },
      { nome: "Coloração", descricao: "Tintura e coloração de cabelo com técnicas variadas." },
      { nome: "Manicure", descricao: "Manicure e pedicure com esmaltação." },
      { nome: "Maquiagem", descricao: "Serviço de maquiagem para diversas ocasiões." },
      { nome: "Tratamentos faciais", descricao: "Limpeza e cuidados estéticos para a pele do rosto." }
    ],
    oficinaMecanica: [
      { nome: "Troca de óleo", descricao: "Substituição de óleo do motor para veículos." },
      { nome: "Balanceamento de rodas", descricao: "Correção do balanceamento para segurança e conforto." },
      { nome: "Revisão elétrica", descricao: "Análise e reparo de problemas no sistema elétrico." },
      { nome: "Alinhamento", descricao: "Ajuste do alinhamento das rodas para melhor direção." },
      { nome: "Inspeção de freios", descricao: "Verificação e manutenção do sistema de freios." }
    ],
    academia: [
      { nome: "Musculação", descricao: "Treinamento de força com acompanhamento profissional." },
      { nome: "Personal Trainer", descricao: "Sessões personalizadas com treinador especializado." },
      { nome: "Aulas de Yoga", descricao: "Aulas de Yoga para equilíbrio e relaxamento." },
      { nome: "Aulas de dança", descricao: "Dança para condicionamento físico e diversão." },
      { nome: "Avaliação física", descricao: "Análise do condicionamento e composição corporal." }
    ],
    petShop: [
      { nome: "Banho e Tosa", descricao: "Higienização e cuidados estéticos para pets." },
      { nome: "Vacinação", descricao: "Aplicação de vacinas para proteção animal." },
      { nome: "Hospedagem", descricao: "Serviço de hospedagem para animais de estimação." },
      { nome: "Consultas Veterinárias", descricao: "Consultas com veterinários para avaliação de saúde." },
      { nome: "Pet Shop", descricao: "Venda de produtos para cuidados e diversão dos pets." }
    ]
  };
  
  const servicos = ramo[ramoSelecionado];
  
  if (!servicos) {
    console.log("Atividade não encontrada.");
    return;
  }
  let count = 0;

  servicos.forEach(servico => {
    if(addServico(servico.nome, servico.descricao,1)){
      count++;
      console.log("Serviços adicionados com sucesso!");
      }
  });
  
  if(count == servicos.length) return true;
    else return false;
}

export function adicionarDadosEmpresa(nomeEmpresa, telefoneEmpresa, enderecoEmpresa = '', logo, ramoEmpresa= ''){

  const db = SQLite.openDatabaseSync("database.db");

  try{
    db.withTransactionSync(() =>
    {
     db.runSync("INSERT INTO dboEmpresa (nomeEmpresa, telefoneEmpresa, enderecoEmpresa, logo, ramoEmpresa) VALUES (?, ?, ?, ?, ?)",[nomeEmpresa, telefoneEmpresa, enderecoEmpresa,logo,ramoEmpresa]);

  });
  return true;
  }
  catch(e){
    console.log("erro inseir dados empresa", e);
    return false;
  }

}

export function updateDadosEmpresa(nomeEmpresa, telefoneEmpresa, enderecoEmpresa = '', logo = '', ramoEmpresa = '') {
  const db = SQLite.openDatabaseSync("database.db");
  try {
    const result = db.runSync(
      "UPDATE dboEmpresa SET nomeEmpresa = (?), telefoneEmpresa = (?), enderecoEmpresa = (?), logo = (?), ramoEmpresa = (?)",
      [nomeEmpresa, telefoneEmpresa, enderecoEmpresa, logo, ramoEmpresa]
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

export function viewEmpresa() {
  const db = SQLite.openDatabaseSync("database.db");
  try {
    const result = db.getFirstSync("SELECT * FROM dboEmpresa");
    return result;
  } catch (error) {
    console.log("Erro", error);
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
  const day = date.getUTCDay(); // Obtém o dia da semana (0 = Domingo, 1 = Segunda, etc.)

  // Calcula a diferença para voltar ao domingo
  const diffToSunday = -day; // Se for domingo (day === 0), diff será 0
  const firstDayOfWeek = new Date(date); // Cria uma nova data
  firstDayOfWeek.setDate(date.getUTCDate() + diffToSunday); // Ajusta para o domingo mais recente

  const lastDayOfWeek = new Date(firstDayOfWeek); // Clona a data do primeiro dia
  lastDayOfWeek.setDate(firstDayOfWeek.getUTCDate() + 6); // Ajusta para o sábado

  return {
    inicio: firstDayOfWeek.toISOString().split("T")[0], // Formata 'YYYY-MM-DD'
    fim: lastDayOfWeek.toISOString().split("T")[0], // Formata 'YYYY-MM-DD'
  };
}

export function getDaysOfWeek(startDate) {
  const daysOfWeek = [];
  const diasDaSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
  const monthNames = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  // Garantir que a data de início seja um objeto Date
  let currentDate = new Date(startDate);
  const dayOfWeek = currentDate.getUTCDay(); // Obtém o dia da semana (0 para domingo, 1 para segunda, etc.)

  // Ajustar para o último domingo
  currentDate.setDate(currentDate.getDate() - dayOfWeek - 1);
 
  /*ACREDITO QUE RESOLVI O PROBLEMA, PRECISO TESTAR DEPOIS NO EMULADOR PRA TER CERTEZA, MAS ACREDITO QUE 
  MODIFICANDO AS FUNÇÕES PARA getUTC O TIMEZONE FICA CERTO, NÃO SEI EXPLICAR SE REALMENTE ERA ESSE O PROBLEMA,
  MAS ATÉ O MOMENTO FOI O QUE RESOLVEU */
  for (let i = 0; i < 9; i++) {
    // Loop para os 7 dias da semana (de domingo a sábado)
    const newDate = new Date(currentDate); // Cria uma nova instância de currentDate
    newDate.setUTCDate(currentDate.getUTCDate() + i); // Adiciona i dias a partir do domingo calculado

    const day = String(newDate.getUTCDate()).padStart(2, "0"); // Pega o dia com dois dígitos
    const month = monthNames[newDate.getUTCMonth()]; // Nome do mês abreviado
    const sem = diasDaSemana[newDate.getUTCDay()]; 
    newDate.setUTCDate(newDate.getUTCDate());
    const date = newDate.toISOString().split("T")[0]; // Formato 'YYYY-MM-DD'
    //console.log(`date: ${date}, i: ${i}, day: ${day}, month: ${month}`);
    daysOfWeek.push({ dia: day, mes: month, sem: sem, date: date });

  }

  return daysOfWeek;
}

function getFirstDayOfWeek(date) {
  const day = date.getUTCDay();
  const diff = date.getUTCDate() - day;
  const data = new Date(date.getUTCDate(diff));

  return data;
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
