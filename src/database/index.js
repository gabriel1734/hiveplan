import * as SQLite from 'expo-sqlite';
import { Alert } from "react-native";




export function create(){

    const db = SQLite.openDatabaseSync('database.db');
    
    db.execSync(`
        CREATE TABLE IF NOT EXISTS dboAgendamentos (
         id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
         nomeCliente TEXT NOT NULL,
         telCliente TEXT NOT NULL,
         dataAgendamento TEXT NOT NULL, 
         horaInicioAgendamento TEXT NOT NULL,
         horaFimAgendamento TEXT NOT NULL,
         tipoAgendamento INTEGER NOT NULL, 
         descricao TEXT 
         ); 

        CREATE TABLE IF NOT EXISTS dboTipoAgendamento(
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
        nomeTipo TEXT NOT NULL,
        descricao TEXT
        );
        `);
}

export function dropTables() {
    const db = SQLite.openDatabaseSync('database.db');
    db.execSync('DROP TABLE dboAgendamentos');
    db.execSync('DROP TABLE dboTipoAgendamento');
}

export function adicionarTipoAgendamento(nome, descricao){
    const db = SQLite.openDatabaseSync('database.db');
    try {
          console.log(nome, descricao);
        const result = db.runSync('INSERT INTO dboTipoAgendamento (nomeTipo, descricao) VALUES (?, ?)', [nome, descricao]);

         if(result.changes > 0)
             Alert.alert('sucesso');
     }
     catch{
         console.log('erro');
     }
}

export  function  adicionarAgendamento(data, hora, tipo, nomeCliente, telCliente, descricao ){

    const db = SQLite.openDatabaseSync('database.db');
try{
   const result = db.runSync('INSERT INTO dboAgendamentos (dataAgendamento, horaAgendamento, tipoAgendamento, descricao, nomeCliente, telCliente) VALUES (?, ?, ?, ?, ?, ?)', [data,hora, tipo, descricao, nomeCliente, telCliente]);

   if(result.changes > 0)
        Alert.alert('sucesso');
}
catch{
    console.log('erro');
}

}

export function verTipoAgendamentos(){
    const db = SQLite.openDatabaseSync('database.db');

    const result = db.getAllSync('SELECT * from dboTipoAgendamento');

    return result;
}

export function verTipoAgendamento(id) {
    const db = SQLite.openDatabaseSync('database.db');

    const result = db.getFirstSync('SELECT * from dboTipoAgendamento WHERE id = (?)', [id]);
    
    return result;
}

export function verAgendamentos(){
    const db = SQLite.openDatabaseSync('database.db');
    
    const result = db.getAllSync( 'SELECT * from dboAgendamentos ORDER BY (dataAgendamento)');
    
    return result;
 };

export function verAgendamentosPorDia(data) {
    const db = SQLite.openDatabaseSync('database.db');
    const result = db.getAllSync('SELECT * FROM dboAgendamentos WHERE dataAgendamento = (?)', [data]);
    return result;
}

export async function countAgendamentosPorDia(data) {
    const db = SQLite.openDatabaseSync('database.db');

    const result = await db.getFirstAsync('SELECT COUNT(*) FROM dboAgendamentos WHERE dataAgendamento = (?)', [data]);
    

    return result['COUNT(*)'];
}

export async function countAgendamentosPorSemana(data) {

    const date = new Date(data);

    const { inicio, fim } = getWeekRange(date);

    const db = SQLite.openDatabaseSync('database.db');
    const result = await db.getFirstAsync('SELECT COUNT(*) FROM dboAgendamentos WHERE dataAgendamento BETWEEN (?) AND (?)', [inicio, fim]);
    return result['COUNT(*)'];
}

export function excluirAgendamento(id){
    const db = SQLite.openDatabaseSync('database.db');

    const result = db.runSync('DELETE FROM dboAgendamentos WHERE id = (?)', [id]);
    if(result.changes > 0)
        Alert.alert('sucesso');            
            
}

export function editarAgendamento(id, data, hora, tipo, nome, tel, descricao) {
    const db = SQLite.openDatabaseSync('database.db');
    const result = db.runSync('UPDATE dboAgendamentos SET dataAgendamento = (?), horaAgendamento = (?), tipoAgendamento = (?), nomeCliente = (?), telCliente = (?), descricao = (?) WHERE id = (?)', [data, hora, tipo, nome, tel, descricao, id]);
    if(result.changes > 0)
        Alert.alert('sucesso');
}

export function excluirTipoAgendamento(id){
    const db = SQLite.openDatabaseSync('database.db');

    const result = db.runSync('DELETE FROM dboTipoAgendamento WHERE id = (?)', [id]);
    if(result.changes > 0)
        Alert.alert('sucesso');
}

export function verSemanasComAgendamentos() {
    const db = SQLite.openDatabaseSync('database.db');
    
    // Consulta para buscar todas as datas de agendamentos
    const result = db.getAllSync('SELECT DISTINCT dataAgendamento FROM dboAgendamentos ORDER BY dataAgendamento ASC');
    
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

    for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i); // Adiciona i dias a partir da data de início

    const day = String(currentDate.getDate()).padStart(2, '0'); // Pega o dia com dois dígitos
    const month = monthNames[currentDate.getMonth()]; // Nome do mês abreviado
      
    daysOfWeek.push({ dia: day, mes: month, date: currentDate.toISOString().split('T')[0] }); // Formato 'YYYY-MM-DD' 
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
