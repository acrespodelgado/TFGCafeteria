<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <form @submit.prevent.stop="onSubmit" @reset.prevent.stop="onReset" class="q-gutter-md">
        <q-input
          ref="pinRef"
          v-model.number="pin"
          type="number"
          label="Pin de acceso"
          outlined
          :rules="pinRules"
          lazy-rules
        />
        <q-btn label="Acceder" type="submit" color="primary" />
        <q-btn label="Limpiar" type="reset" color="primary" flat class="q-ml-sm" />
      </form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'AccessPage',
  setup () {
    const $q = useQuasar()

    const pin = ref(null)
    const pinRef = ref(null)

    return {
      pin,
      pinRef,
      pinRules: [
        val => !!val || '* Obligatorio',
        val => val >= 999 && val <= 9999 || 'Por favor introduzca 4 dígitos'
      ],

      onSubmit () {
        pinRef.value.validate()

        if (pinRef.value.hasError) {
          // form has error
        } else {
          $q.notify({
            icon: 'done',
            color: 'positive',
            message: 'Submitted'
          })
        }
      },

      onReset () {
        pin.value = null
        pinRef.value.resetValidation()
      }
    }
  }
})
</script>
