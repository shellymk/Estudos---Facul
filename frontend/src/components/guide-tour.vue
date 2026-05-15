<template>
  <button class="btn-tour" @click="iniciartour">
    🗺️ Iniciar Tour
  </button>
</template>

<script setup>
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const iniciartour = () => {
  const driverObj = driver({
    showProgress: true,
    nextBtnText: 'Próximo →',
    prevBtnText: '← Anterior',
    doneBtnText: 'Concluir ✓',

    steps: [
      {
        element: "#section-header",
        popover: {
          title: "👋 Header",
          description: "Aqui é o cabeçalho do sistema.",
          side: "bottom",
          align: "start"
        }
      },
      {
        element: "#section-body",
        popover: {
          title: "📄 Corpo",
          description: "Aqui fica o conteúdo principal da página.",
          side: "right",
          align: "start"
        }
      },
      {
        element: "#section-card",
        popover: {
          title: "👋 Hello",
          description: "Card de boas-vindas do sistema.",
          side: "top",
          align: "center"
        }
      },
      {
        element: "#section-footer",
        popover: {
          title: "📌 Footer",
          description: "Rodapé com informações gerais.",
          side: "top",
          align: "center"
        }
      }
    ]
  });

  driverObj.drive();
};
</script>

<style>
.driver-overlay {
  background: transparent !important;
}
</style>