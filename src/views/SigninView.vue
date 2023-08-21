<template>
  <div id="app">
    <div class="mainContainer">
      <h1>Mobile Data Computer</h1>
      <form @submit.prevent="submit">
        <v-text-field
          class="email"
          v-model="email.value.value"
          :error-messages="email.errorMessage.value"
          label="Badge Number"
          variant="outlined"
          bg-color="rgba(128, 152, 249, 0.1)"
          base-color="#0066FF"
          color="#0066FF"
          dark
          autocomplete="badgeNumber"
          required
          prepend-icon="mdi-police-badge-outline"
        ></v-text-field>
        <v-text-field
          v-model="password.value.value"
          :error-messages="password.errorMessage.value"
          :append-icon="passwordVisibility ? 'mdi-eye' : 'mdi-eye-off'"
          :type="passwordVisibility ? 'text' : 'password'"
          prepend-icon="mdi-shield-off-outline"
          label="Password"
          autocomplete="current-password"
          variant="outlined"
          bg-color="rgba(128, 152, 249, 0.1)"
          base-color="#0066FF"
          color="#0066FF"
          dark
          required
          @click:append="togglePasswordVisibility"
        ></v-text-field>
        <div class="forgotPassword">
          <v-checkbox
            v-model="checkbox.value.value"
            label="Stay connected"
            color="#0066FF"
            type="checkbox"
          ></v-checkbox>
          <h2>Forgot your password?</h2>
        </div>
        <div class="alertContainer" v-if="errMsg">
          <v-alert type="error" variant="tonal">{{ errMsg }}</v-alert>
        </div>
        <v-btn variant="elevated" color="#0066FF" type="submit"> Connect </v-btn>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

const router = useRouter()

const { handleSubmit} = useForm({
  validationSchema: {
    email(value) {
      if (/^\d{5}$/.test(value)) return true;

      return 'The Badge Number must only contain 5 numbers.';
    },
    password(value) {
      if (value?.length >= 4) return true

      return 'The password must be atlest 4 characters long.'
    }
  }
})
const email = useField('email')
const password = useField('password')
const checkbox = useField('checkbox')
const passwordVisibility = ref(false)
const errMsg = ref('')

const togglePasswordVisibility = () => {
  passwordVisibility.value = !passwordVisibility.value
}

const submit = handleSubmit((values) => {
  let checkbox
  checkbox = !(!values.checkbox || values.checkbox === false);
  const options = {
    method: 'POST',
    url: `${import.meta.env.VITE_BASEURL}/auth/signin`,
    headers: { 'Content-Type': 'application/json' },
    data: { badgeNumber: values.email, password: values.password, stayConnected: checkbox }
  }

  axios
		.request(options)
		.then(function (response) {
			localStorage.setItem('JWT', response.data.access_token)
			router.push('/')
		})
		.catch(function (error) {
			errMsg.value = error.response.data.message
		})
})
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Alatsi&display=swap');
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.mainContainer {
  height: 45rem;
  width: 30rem;
  background-color: #1f2940;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  padding-top: 5rem;
  h1 {
    font-weight: lighter;
    margin-bottom: 3rem;
    font-size: 2.2rem;
  }
  h2 {
    font-size: 1.2rem;
    color: #0066ff;
  }
  h3 {
    font-size: 1.5rem;
    color: #bbbbbb;
    margin-bottom: 2rem;
  }
}
.v-text-field {
  width: 28rem;
  color: white !important;
}

.email {
  width: 25.5rem;
  margin-bottom: 0.5rem;
}
.forgotPassword {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -2rem;
}

.v-checkbox {
  margin-top: 1.5rem;
}

.v-btn {
  margin-top: 10rem;
  width: 28rem;
  height: 3rem !important;
}

.v-alert {
  text-align: center;
}

.alertContainer {
  position: absolute;
  max-width: 28rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5rem;
  width: 28rem;
}
</style>
