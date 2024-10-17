<template>
  <q-item clickable tag="a" @click="navigateTo">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    link: {
      type: [String, Object], // Permite tanto String como Object
      required: true,
    },

    icon: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const router = useRouter();

    const navigateTo = () => {
      if (typeof props.link === "string") {
        // Si es una cadena, redirigir como antes
        props.link.toString().startsWith("http")
          ? window.open(props.link, "_blank")
          : router.push({ name: props.link });
      } else {
        // Si es un objeto, navegar usando el router
        router.push(props.link);
      }
    };

    return {
      navigateTo,
    };
  },
});
</script>
