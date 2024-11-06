// src/components/WelcomeModal.js
import React, { useState } from 'react';
import { View, Text, Modal, Button, StyleSheet, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';

const WelcomeModal = ({ visible, onClose }) => {
  const [pageIndex, setPageIndex] = useState(0);

  const pages = [
    {
      title: "Bem-vindo ao App!",
      description: "Explore as principais funcionalidades do aplicativo.",
    },
    {
      title: "Acesso ao Menu",
      description: "Aperte no botão para acessar o menu principal.",
    },
    {
      title: "Menu",
      description: "Navegue pelas funcionalidades do aplicativo.",
    },
    {
      title: "Agendamentos",
      description: "Organize e visualize seus compromissos de forma fácil.",
    },
    {
      title: "Colaboradores",
      description: "Gerencie os colaboradores da sua equipe.",
    },
    {
      title: "Serviços",
      description: "Adicione e edite serviços oferecidos.",
    },
    {
      title: "Configurações",
      description: "Personalize o aplicativo de acordo com suas preferências e sua empres.",
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
          <PagerView
            style={styles.pagerView}
            initialPage={0}
            onPageSelected={e => setPageIndex(e.nativeEvent.position)}
          >
            {pages.map((page, index) => (
              <View key={index} style={styles.page}>
                <Text style={styles.title}>{page.title}</Text>
                <Text style={styles.description}>{page.description}</Text>
              </View>
            ))}
          </PagerView>

          <View style={styles.buttonContainer}>
            {pageIndex < pages.length - 1 ? (
              <TouchableOpacity onPress={() => setPageIndex(pageIndex + 1)} style={styles.btn}>
                <Text>Próximo</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onClose} style={styles.btn}>
                <Text>Fechar</Text>
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
});

export default WelcomeModal;
