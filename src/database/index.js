import { useSQLiteContext } from "expo-sqlite"
import { Alert } from "react-native";

export default function useDatabase(){
    const db = useSQLiteContext();
    
function adicionarTipoAgendamento(nome, descricao){
    db.transaction(tx => {
        tx.executeSql('INSERT INTO dboTipoAgendamento (nome, descricao) VALUES (?, ?)', [nome, descricao],
          (txObj, result) => {
            console.log(result.rowsAffected);
           if(result.rowsAffected > 0){
            Alert.alert('sucesso');
           }
          },
          (txObj, error) => console.log(error)
        );
      });
}

function adicionarAgendamento(data, tipo, descricao ){

    db.transaction(tx => {
        tx.executeSql('INSERT INTO dboAgendamentos (dataAgendamento, tipoAgendamento, descricao) VALUES (?, ?, ?)', [data, tipo, descricao],
          (txObj, result) => {
            console.log(result.rowsAffected);
           if(result.rowsAffected > 0){
            Alert.alert('sucesso');
           }
          },
          (txObj, error) => console.log(error)
        );
      });   
}

function verTipoAgendamentos(){
    db.transaction(tx => 
    {
        tx.executeSql(
            'SELECT * from dboTipoAgendamentos',[],
            (tx, result) =>{
                /*retornar vetor */
            }
        )
    }
    )
}

function verAgendamentos(){
    db.transaction(tx => 
    {
        tx.executeSql(
            'SELECT * from Agendamentos',[],
            (tx, result) =>{
                /*retornar vetor */
            }
        )
    }
    )
}

    return
}