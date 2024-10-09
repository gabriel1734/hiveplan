import * as SQLite from 'expo-sqlite';
import { Alert } from "react-native";




export function create(){

    const db = SQLite.openDatabaseSync('database.db');
    
    db.execSync(`
        CREATE TABLE IF NOT EXISTS dboAgendamento (
         id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
         nomeCliente TEXT NOT NULL,
         telCliente TEXT NOT NULL,
         dataAgendamento TEXT NOT NULL, 
         horaAgendamento TEXT NOT NULL, 
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
        codColaborador INTEGER  NOT NULL REFERENCES dboColaborador,
        codServico INTEGER NOT NULL REFERENCES dboServico,
        favorito NUMERIC,
        PRIMARY KEY (codColaborador, codServico)
        );

        CREATE TABLE IF NOT EXISTS dboAgendamentoServico(
        codAgendamento INTEGER  NOT NULL REFERENCES dboAgendamento,
        codServico INTEGER  NOT NULL REFERENCES dboServico,
        codColaborador INTEGER  NOT NULL REFERENCES dboColaborador,
        PRIMARY KEY(codAgendamento, codServico, codColaborador)
        );
        
    
        `);
}

export function dropTables() {
    const db = SQLite.openDatabaseSync('database.db');
    db.execSync('DROP TABLE dboAgendamento');
    db.execSync('DROP TABLE dboServico');
    db.execSync('DROP TABLE dboColaborador');
    db.execSync('DROP TABLE dboColaboradorServico');
    db.execSync('DROP TABLE dboAgendamentoServico');
}

export function addServico(nome, descricao){
    const db = SQLite.openDatabaseSync('database.db');
    try {
        const result = db.runSync('INSERT INTO dboServico (nome, descricao) VALUES (?, ?)', [nome, descricao]);

         if(result.changes > 0)
             return true; 
        else
            return false;
        
    }     
     catch(error){
         console.log('erro', error);
     }

}

export function addAgendamento(data, horaAgendamento, nomeCliente, telCliente, descricao, servico, colaborador) {

    const db = SQLite.openDatabaseSync('database.db');

    // qual o retorno dessa função ??? 
    //checkAgendamentoExistente(data, horaAgendamento)

    try {
        const result = db.runSync('INSERT INTO dboAgendamento (dataAgendamento, horaAgendamento, descricao, nomeCliente, telCliente) VALUES (?, ?, ?, ?, ?)', [data, horaAgendamento, descricao, nomeCliente, telCliente]);
        
        if (result.changes > 0) {
            
        const insertRelaci = db.runSync('INSERT INTO dboAgendamentoServico (codAgendamento, codServico, codColaborador) VALUES(?, ?, ?)',[result.lastInsertRowId, servico, colaborador,] );

        if(insertRelaci.changes > 0){
            return true;
        }
        else{
            console.log(error);
            return false;
        }
        
    } 
    else
        return false;
        
}
    catch(error) {
        console.log('Erro ao adicionar agendamento: ', error);
        return false;
    }

}
//DEVO ATUALIZAR ESTA FUNÇÃO
export function checkAgendamentoExistente(data, horaAgendamento) {
    const db = SQLite.openDatabaseSync('database.db');
    const result = db.getFirstSync('SELECT COUNT(*) FROM dboAgendamento WHERE dataAgendamento = (?) AND horaAgendamentos = (?)', [data, horaAgendamento]);
    return result['COUNT(*)'] > 0;
}

export function viewServicoAll(){
    const db = SQLite.openDatabaseSync('database.db');

    const result = db.getAllSync('SELECT * from dboServico');

    return result;
}

export function viewServicoID(id) {
    const db = SQLite.openDatabaseSync('database.db');

    const result = db.getFirstSync('SELECT * from dboServico WHERE id = (?)', [id]);
    
    return result;
}

export function updateServico(id, nome, descricao, favorito) {
    const db = SQLite.openDatabaseSync('database.db');
    const result = db.runSync('UPDATE dboServico SET nome = (?), descricao = (?), favorito = (?) WHERE id = (?)', [nome, descricao,favorito, id]);
    if(result.changes > 0)
       return true;
    else 
        return false;
}


export function viewAgendamentosAll(){
    const db = SQLite.openDatabaseSync('database.db');
    
    const result = db.getAllSync( 'SELECT * from dboAgendamento ORDER BY (dataAgendamento)');
    
    return result;
 };

export function viewAgendamentosPorDia(data) {
    const db = SQLite.openDatabaseSync('database.db');
    const result = db.getAllSync('SELECT * FROM dboAgendamento WHERE dataAgendamento = (?)', [data]);
    return result;
}

//Essa função vai ser usada onde ?
export function viewAgendamentoID(id){
    const db = SQLite.openDatabaseSync('database.db');
    const result = db.getFirstSync('SELECT * FROM dboAgendamento WHERE id = (?)', [id]);
    return result;
}

export async function countAgendamentosPorDia(data) {
    const db = SQLite.openDatabaseSync('database.db');

    const result = await db.getFirstAsync('SELECT COUNT(*) FROM dboAgendamento WHERE dataAgendamento = (?)', [data]);
    
    // que tipo de return é esse ?
    return result['COUNT(*)'];
}

export async function countAgendamentosPorSemana(data) {

    const date = new Date(data);

    const { inicio, fim } = getWeekRange(date);

    const db = SQLite.openDatabaseSync('database.db');
    const result = await db.getFirstAsync('SELECT COUNT(*) FROM dboAgendamento WHERE dataAgendamento BETWEEN (?) AND (?)', [inicio, fim]);
    
    // que tipo de return é esse ?
    return result['COUNT(*)'];
}

export function deleteAgendamento(id){
    const db = SQLite.openDatabaseSync('database.db');

    try{
    const result = db.runSync('DELETE FROM dboAgendamento WHERE id = (?)', [id]);

    if(result.changes > 0)
        return true;
    else
    return false;

    }
    catch(error){
        console.log('erro:',error);
        return false;
    }              
            
}

export function editarAgendamento(id,data,hora, nomeCliente, telCliente, descricao) {
    try {
        const db = SQLite.openDatabaseSync('database.db');
        
        const result = db.runSync(`
            UPDATE dboAgendamento
                SET dataAgendamento = (?), 
                horaAgendamento = (?),  
                nomeCliente = (?), 
                telCliente = (?), 
                descricao = (?)
            WHERE id = (?)
            `,[data, hora, nomeCliente, telCliente, descricao, id]);
        
        if(result.changes > 0)
           return true;
    } catch (error) {
        console.log('Erro ao editar agendamento: ', error);
        return false;
    }
}

// o que essa função faz ?

export function checarTipoAgendamento(id) {
    const db = SQLite.openDatabaseSync('database.db');
    const result = db.getFirstSync('SELECT COUNT(*) FROM dboAgendamento WHERE tipoAgendamento = (?)', [id]);
    return result['COUNT(*)'] > 0;
}
    

export function excluirTipoAgendamento(id){
    const db = SQLite.openDatabaseSync('database.db');

    if(checarTipoAgendamento(id)){
        Alert.alert('Erro esse tipo de agendamento já está sendo utilizado');   
        return;
    }

    const result = db.runSync('DELETE FROM dboTipoAgendamento WHERE id = (?)', [id]);
    if(result.changes > 0)
        Alert.alert('sucesso');
}
 
export function deleteServico(id){
    const db = SQLite.openDatabaseSync('database.db');

    try{
        const result = db.runSync('DELETE FROM dboServico WHERE id = (?)',[id]);
        
        if(result.changes > 0)
            return true;
        else 
        return false;
    }
    catch(error){
        console.log('erro:',error);
    }
}
export function addColaborador(nome){
    const db = SQLite.openDatabaseSync('database.db');
    try{
    const result = db.runSync('INSERT INTO dboColaborador (nome) VALUES (?)',[nome]);
    
    if (result.changes > 0)
        return true;
    else 
        return false;
    }
    catch(error){
    console.log('erro:', error);
    }
}
 // daqui pra baixo nada é meu //
export function verSemanasComAgendamentos() {
    const db = SQLite.openDatabaseSync('database.db');
    
    // Consulta para buscar todas as datas de agendamentos
    const result = db.getAllSync('SELECT DISTINCT dataAgendamento FROM dboAgendamento ORDER BY dataAgendamento ASC');
    
    if (result.length === 0) {
        return [];
    }

    const semanasComAgendamentos = [];

    result.forEach((row) => {
        const date = new Date(row.dataAgendamento);
        const firstDayOfWeek = getFirstDayOfWeek(date);
        const lastDayOfWeek = getLastDayOfWeek(date);
        
        // Formata as datas no formato desejado
        const label = `${formatDate(firstDayOfWeek)} à ${formatDate(lastDayOfWeek)} - ${firstDayOfWeek.getFullYear()}`;
        const value = date.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD' 

        // Verifica se a semana já está na lista, caso contrário, adiciona
        if (!semanasComAgendamentos.some(semana => semana.value === value)) {
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
        inicio: firstDayOfWeek.toISOString().split('T')[0], // Formata 'YYYY-MM-DD'
        fim: lastDayOfWeek.toISOString().split('T')[0], // Formata 'YYYY-MM-DD'
    };
}

export function getDaysOfWeek(startDate) {
    const daysOfWeek = [];
    const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    
    let currentDate = new Date(startDate);
    const dayOfWeek = currentDate.getDay(); // Obtém o dia da semana (0 para domingo, 1 para segunda, etc.)
    // Calcula o último domingo anterior ou a data atual se for domingo
    currentDate.setDate(currentDate.getDate() - dayOfWeek);

    for (let i = 0; i <= 7; i++) { // loop para os 7 dias da semana
        const newDate = new Date(currentDate); // Cria uma nova instância de currentDate
        newDate.setDate(currentDate.getDate() + i); // Adiciona i dias a partir do domingo calculado
        const day = String(newDate.getDate()).padStart(2, '0'); // Pega o dia com dois dígitos
        const month = monthNames[newDate.getMonth()]; // Nome do mês abreviado
        
        newDate.setDate(newDate.getDate());
        const date = newDate.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
        
        daysOfWeek.push({ dia: day, mes: month, date: date}); // Formato 'YYYY-MM-DD'
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
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
}


function formatDateForValue(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}-${month}`;
}
