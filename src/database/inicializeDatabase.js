import * as SQlite from 'expo-sqlite';

export async function inicializeDatabase() {
    
    const db = SQlite.useSQLiteContext();
    
    db.execSync(`
        CREATE TABLE IF NOT EXIST dboAgendamentos (
         id INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT,
         dataAgendamento DATE, 
         tipoAgendamento INTEGER, 
         descricao VARCHAR(300)
         ); 

        CREATE TABLE IF NOT EXIST dboTipoAgendamento(
        id INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT,
        nomeTipo VARCHAR(200) NOT NULL,
        descricao VARCHAR(300)
        );
        
        `);
}