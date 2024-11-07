// src/components/WelcomeModal.js
import React, { useState } from 'react';
import { View, Text, Modal, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Animated } from 'react-native-web';

const AnimatedPager = Animated.createAnimatedComponent(PagerView);

const WelcomeModal = ({ visible, onClose }) => {
  const [pageIndex, setPageIndex] = useState(0);

  const Img = [
    {
      acesso_menu: require('../../../assets/img/acesso_menu.png'),
    },
    {
      menu: require('../../../assets/img/menu.png'),
    },
    {
      agendamento: require('../../../assets/img/agendamento.png'),
    },
    {
      colaboradores: require('../../../assets/img/colaboradores.png'),
    },
    {
      servicos: require('../../../assets/img/servicos.png'),
    },
    {
      configuracoes: require('../../../assets/img/configuracoes.png'),
    },
  ]

  const pages = [
    {
      title: "Bem-vindo ao App!",
      description: "Explore as principais funcionalidades do aplicativo.",
      Image: null,
    },
    {
      title: "Acesso ao Menu",
      description: "Aperte no botão para acessar o menu principal.",
      Image: Img.acesso_menu,
    },
    {
      title: "Menu",
      description: "Navegue pelas funcionalidades do aplicativo.",
      Image: Img.menu,
    },
    {
      title: "Agendamentos",
      description: "Organize e visualize seus compromissos de forma fácil.",
      Image: Img.agendamento,
    },
    {
      title: "Colaboradores",
      description: "Gerencie os colaboradores da sua equipe.",
      Image: Img.colaboradores,
    },
    {
      title: "Serviços",
      description: "Adicione e edite serviços oferecidos.",
      Image: Img.servicos,
    },
    {
      title: "Configurações",
      description: "Personalize o aplicativo de acordo com suas preferências e sua empres.",
      Image: Img.configuracoes,
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
          <AnimatedPager
            style={styles.pagerView}
            initialPage={0}
            onPageSelected={(e) => setPageIndex(e.nativeEvent.position)}
          >
            {pages.map((page, index) => (
              <View key={index} style={styles.page}>
                <Text style={styles.title}>{page.title}</Text>
                <Text style={styles.description}>{page.description}</Text>
                {page.Image ? <Image source={page.Image} style={{ width: 200, height: 200 }} /> : null}
              </View>
            ))}
          </AnimatedPager>

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
