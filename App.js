import Agendamento from './src/pages/Agendamento';
import HomeScreen from './src/pages/HomeScreen';
import { createContext, useState } from 'react';

export const AgendamentoScreenContext = createContext();

export default function App() {

  const [createOrEditAgendamento, setCreateOrEditAgendamento] = useState(false);

  return (
    <AgendamentoScreenContext.Provider value={{
      createOrEditAgendamento,
      setCreateOrEditAgendamento
    }}
    >
      {createOrEditAgendamento ? <Agendamento /> : <HomeScreen />}
    </AgendamentoScreenContext.Provider>
  );
}