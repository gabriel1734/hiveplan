// src/components/WelcomeModal.js
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';


const WelcomeModal = ({ visible, onClose, navigation }) => {
  const [pageIndex, setPageIndex] = useState(0);

  const handleClose = () => {
    onClose();
    navigation.navigate('Configuracao',{msg: 'Faça as configurações iniciais para começar a usar o aplicativo.'});
  }

  const pages = [
    {
      title: "Bem-vindo ao HivePlan!",
      description: "Explore as principais funcionalidades do aplicativo.",
      Image: require('../../../assets/img/HIVEPLAN.png'),
    },
    {
      title: "Acesso ao Menu",
      description: "Aperte no botão para acessar o menu principal.",
      Image: require('./../../../assets/img/acesso_menu.png'),
    },
    {
      title: "Menu",
      description: "Navegue pelas funcionalidades do aplicativo.",
      Image: require('../../../assets/img/menu.png'),
    },
    {
      title: "Agendamentos",
      description: "Organize e visualize seus compromissos de forma fácil.",
      Image: require('../../../assets/img/agendamento.png'),
    },
    {
      title: "Colaboradores",
      description: "Gerencie os colaboradores da sua equipe.",
      Image: require('../../../assets/img/colaboradores.png'),
    },
    {
      title: "Serviços",
      description: "Adicione e edite serviços oferecidos.",
      Image: require('../../../assets/img/servicos.png'),
    },
    {
      title: "Configurações",
      description: "Personalize o aplicativo de acordo com suas preferências e sua empresa.",
      Image: require('../../../assets/img/configuracoes.png'),
    },
  ];

  


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.pagerView}>
            <View style={styles.page}>
              <Text style={styles.title}>{pages[pageIndex].title}</Text>
              <Text style={styles.description}>{pages[pageIndex].description}</Text>
              {pages[pageIndex].Image &&
                <Image
                  source={pages[pageIndex].Image}
                  style={styles.Img}
                  contentFit="cover"
                  transition={1000}
                />}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {pageIndex < pages.length - 1 ? (
              <TouchableOpacity onPress={() => setPageIndex(pageIndex + 1)} style={styles.btn}>
                <Text style={styles.btnText}>Próximo</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleClose()} style={styles.btn}>
                <Text  style={styles.btnText}>Fechar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  Img: {
    width: 200,
    height: 400,
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 10,
  },
  btn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#6D6B69',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 18,
  },
});

export default WelcomeModal;
