<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Iniciar Sesión</h2>

      <label for="role">Selecciona tu rol:</label>
      <select v-model="role">
        <option value="medico">Médico</option>
        <option value="admision">Admisión</option>
      </select>

      <label for="username">Usuario:</label>
      <input type="text" v-model="username" placeholder="Ingrese su usuario" />

      <label for="password">Contraseña:</label>
      <input type="password" v-model="password" placeholder="Ingrese su contraseña" />

      <button @click="login">Ingresar</button>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage", // Nombre corregido para evitar el error
  data() {
    return {
      username: "",
      password: "",
      role: "medico",
      errorMessage: "",
    };
  },
  methods: {
    login() {
      if (!this.username || !this.password) {
        this.errorMessage = "Por favor, complete todos los campos.";
        return;
      }

      if (this.username === "admin" && this.password === "1234") {
        alert(`Bienvenido, ${this.role === "medico" ? "Doctor" : "Admisión"} ${this.username}`);

        if (this.role === "medico") {
          this.$router.push("/doctor"); // Redirección a la configuración de horarios
        } else {
          this.$router.push("/admin");
        }
      } else {
        this.errorMessage = "Usuario o contraseña incorrectos.";
      }
    },
  },
};
</script>

<style>
/* 🌟 Fondo de pantalla completo */
.login-container {
  width: 100vw;
  height: 100vh;
  background: url("@/assets/bonito.jpg") no-repeat center center;
  background-size: cover; /* Cubrir pantalla */
  background-attachment: fixed; /* Fijar imagen en escritorio */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 🟢 Caja de login */
.login-box {
  background: rgba(255, 255, 255, 0.9);
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  width: 350px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
}

/* 🔷 Inputs y select */
input, select {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

/* 🔶 Botón */
button {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 16px;
}

button:hover {
  background: #0056b3;
}

/* ❌ Mensajes de error */
.error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

/* 📲 Responsividad en móviles */
@media (max-width: 768px) {
  .login-container {
    background-size: contain; /* Mostrar imagen completa en móviles */
    background-position: top center;
    min-height: 100vh;
  }

  .login-box {
    width: 90%;
    padding: 15px;
  }

  input, select, button {
    padding: 10px;
    font-size: 14px;
  }
}
</style>
