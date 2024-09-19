import * as SQLite from 'expo-sqlite';
import { Alert } from "react-native";




export function create(){

    const db = SQLite.openDatabaseSync('database.db');
    
    db.execSync(`
        CREATE TABLE IF NOT EXISTS dboAgendamentos (
         id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
         nomeCliente VARCHAR(200),
         telCliente VARCHAR(50),
         dataAgendamento TEXT, 
         horaAgendamento TEXT,
         tipoAgendamento INTEGER, 
         descricao VARCHAR(300)
         ); 

        CREATE TABLE IF NOT EXISTS dboTipoAgendamento(
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
        nomeTipo VARCHAR(200) NOT NULL,
        descricao VARCHAR(300)
        );
        `);
}
    
export function adicionarTipoAgendamento(nome, descricao){
    const db = SQLite.openDatabaseSync('database.db');
      try{
        const result = db.runSync('INSERT INTO dboTipoAgendamento (nome, descricao) VALUES (?, ?)', [nome, descricao]);

         if(result.changes > 0)
             Alert.alert('sucesso');
     }
     catch{
         console.log('erro');
     }
}

export  function  adicionarAgendamento(data, hora, tipo, nome, tel, descricao ){

    const db = SQLite.openDatabaseSync('database.db');
try{
   const result = db.runSync('INSERT INTO dboAgendamentos (dataAgendamento, horaAgendamento, tipoAgendamento, descricao, nomeCliente, telCliente) VALUES (?, ?, ?, ?, ?, ?)', [data,hora, tipo, descricao, nome, tel]);

   if(result.changes > 0)
        Alert.alert('sucesso');
}
catch{
    console.log('erro');
}

}

export function verTipoAgendamentos(){
    const db = SQLite.openDatabaseSync('database.db');

    const result = db.getAllSync( 'SELECT * from dboTipoAgendamento');
  
}

export function verAgendamentos(){
    const db = SQLite.openDatabaseSync('database.db');
    
    const result = db.getAllSync( 'SELECT * from dboAgendamentos ORDER BY (dataAgendamento)');
    for (const item of result){
        console.log(item.id, item.nomeCliente, item.dataAgendamento, item.telCliente);
    }
        
 };


export function excluirAgendamento(id){
    const db = SQLite.openDatabaseSync('database.db');

    const result = db.runSync('DELETE FROM dboAgendamentos WHERE id = (?)', [id]);
    if(result.changes > 0)
        Alert.alert('sucesso');            
            
}

export function excluirTipoAgendamento(id){
    const db = SQLite.openDatabaseSync('database.db');

    const result = db.runSync('DELETE FROM dboTipoAgendamento WHERE id = (?)', [id]);
    if(result.changes > 0)
        Alert.alert('sucesso');
}