import { Button } from "react-native";

const BtnAgendamento = () => {
  return (
    <Button title="Criar Agendamento" onPress={() => navigation.navigate('Agendamento')} />
  );
}

export default BtnAgendamento;