import * as SQlite from 'expo-sqlite';

export async function inicializeDatabase(props) {
    
    const db = SQlite.useSQLiteContext();
    
    db.execSync(`CREATE TABLE dboAgendamentos (id INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT, dataAgendamento DATE, tipoAgendamento INTEGER, descricao VARCHAR(300)); `);
}