
<template>
    <div>
        <q-input v-model="newWorker.Nombre" label="Nombre" />
        <q-input v-model="newWorker.DNI" label="DNI" />
        <q-input v-model="newWorker.Telefono" label="Teléfono" />
        <q-btn @click="createWorker" label="Agregar Trabajador" color="green" />
    </div>
</template>
  
<script>
    import { defineComponent, ref } from 'vue';
    import { useWorkers } from 'src/composables/useWorkers'; // Asegúrate de tener la ruta correcta

    export default defineComponent({
        name: 'AddWorker',
        props: {
            db: {
            type: Object,
            required: true,
            },
        },
        setup(props) {
            const { addWorker } = useWorkers(props.db);
            const newWorker = ref({ Nombre: '', DNI: '', Telefono: '' });

            const createWorker = async () => {
                if (newWorker.value.Nombre && newWorker.value.DNI && newWorker.value.Telefono) {
                    await addWorker(newWorker.value.Nombre, newWorker.value.DNI, newWorker.value.Telefono);
                    newWorker.value = { Nombre: '', DNI: '', Telefono: '' }; //Clear Data
                } else {
                    console.error("Por favor, completa todos los campos");
                }
            };

            return {
                newWorker,
                createWorker,
            };
        },
    });
</script>