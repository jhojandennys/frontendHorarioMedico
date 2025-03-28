<template>
  <div class="schedule-container">
    <div class="header">
      <img class="profile-pic" src="https://via.placeholder.com/80" alt="Perfil">
      <h2>Hola, {{ doctorName }}</h2>
    </div>

    <h3>Configura tus horarios</h3>
    <div class="days-grid">
      <div 
        class="day-card" 
        v-for="(day, index) in days" 
        :key="index" 
        @click="toggleSelection(day)"
        :class="{ 'highlighted': isDayConfigured(day), 'selected': schedule[day]?.selected }"
      >
        {{ day }}
      </div>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>Configurar horario para {{ selectedDay }}</h3>
        <label>Hora de inicio:</label>
        <input type="time" v-model="startTime" />
        <label>Hora de fin:</label>
        <input type="time" v-model="endTime" />
        
        <button v-if="isDayConfigured(selectedDay)" @click="deleteSchedule(selectedDay)" class="delete-schedule-button">
          Eliminar Horario
        </button>
        
        <div class="modal-buttons">
          <button @click="saveSchedule">Guardar</button>
          <button class="cancel" @click="closeModal">Cancelar</button>
        </div>
      </div>
    </div>

    <button class="save-all-button" @click="saveAllSchedules">Guardar Horario</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      doctorName: "Jhojan",
      schedule: {},
      days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      showModal: false,
      selectedDay: "",
      startTime: "",
      endTime: ""
    };
  },
  async created() {
    await this.loadSchedules();
  },
  methods: {
    async loadSchedules() {
      try {
        const response = await fetch(`http://localhost:8080/horarios/${this.doctorName}`);
        if (response.ok) {
          const horarios = await response.json();
          this.schedule = {};
          
          horarios.forEach(horario => {
            this.schedule[horario.dia] = {
              id: horario.id,
              start: horario.hora_inicio?.substring(0, 5),
              end: horario.hora_fin?.substring(0, 5),
              selected: false
            };
          });
          
          localStorage.setItem("schedule", JSON.stringify(this.schedule));
        }
      } catch (error) {
        console.error("Error cargando horarios:", error);
      }
    },

    toggleSelection(day) {
      if (!this.schedule[day]) {
        this.schedule[day] = { selected: true };
      } else {
        this.schedule[day].selected = !this.schedule[day].selected;
      }
      if (this.schedule[day].selected) {
        this.openSchedule(day);
      }
    },

    openSchedule(day) {
      this.selectedDay = day;
      this.startTime = this.schedule[day]?.start || "";
      this.endTime = this.schedule[day]?.end || "";
      this.showModal = true;
    },

    async saveSchedule() {
      if (!this.selectedDay || !this.startTime || !this.endTime || this.startTime >= this.endTime) {
        alert("Ingrese horas válidas.");
        return;
      }

      this.schedule[this.selectedDay] = {
        ...this.schedule[this.selectedDay],
        start: this.startTime,
        end: this.endTime
      };

      this.closeModal();
    },

    closeModal() {
      this.showModal = false;
      this.selectedDay = "";
    },

    isDayConfigured(day) {
      return this.schedule[day] && this.schedule[day].start && this.schedule[day].end;
    },

    async deleteSchedule(day) {
      if (!confirm(`¿Deseas eliminar el horario de ${day}?`)) return;

      const horario = this.schedule[day];
      
      if (horario?.id) {
        try {
          const response = await fetch(`http://localhost:8080/horarios/${horario.id}`, {
            method: "DELETE"
          });

          if (response.ok) {
            delete this.schedule[day];
            localStorage.setItem("schedule", JSON.stringify(this.schedule));
            this.closeModal();
            return;
          }
          throw new Error("Error al eliminar");
        } catch (error) {
          alert("Error al eliminar del servidor");
          console.error(error);
          return;
        }
      }
      
      // Si no tenía ID (no estaba en el servidor)
      delete this.schedule[day];
      localStorage.setItem("schedule", JSON.stringify(this.schedule));
      this.closeModal();
    },

    async saveAllSchedules() {
      if (Object.keys(this.schedule).length === 0) {
        alert("Debe configurar al menos un horario antes de guardar.");
        return;
      }

      const horarios = Object.entries(this.schedule).map(([dia, datos]) => ({
        id: datos.id || null,
        doctor: this.doctorName,
        dia,
        hora_inicio: datos.start ? datos.start + ":00" : null,
        hora_fin: datos.end ? datos.end + ":00" : null
      }));

      try {
        const response = await fetch("http://localhost:8080/horarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(horarios)
        });

        if (!response.ok) throw new Error("Error guardando horarios");
        
        const horariosActualizados = await response.json();
        
        // Actualizar los IDs en el frontend
        horariosActualizados.forEach(horario => {
          if (this.schedule[horario.dia]) {
            this.schedule[horario.dia].id = horario.id;
          }
        });
        
        localStorage.setItem("schedule", JSON.stringify(this.schedule));
        alert("Horarios guardados exitosamente.");
      } catch (error) {
        alert("Error al guardar horarios");
        console.error(error);
      }
    }
  }
};
</script>

<style>
/* Contenedor principal */
.schedule-container {
  max-width: 400px;
  margin: auto;
  text-align: center;
}

/* Encabezado con imagen de perfil */
.header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-pic {
  border-radius: 50%;
  width: 80px;
}

/* Diseño de la cuadrícula con los días */
.days-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 10px 0;
  justify-content: center;
}

/* Estilo de cada tarjeta de día */
.day-card {
  padding: 10px;
  border: 1px solid black;
  cursor: pointer;
  text-align: center;
  font-weight: bold;
}

.highlighted {
  background-color: lightblue;
}

/* Domingo ocupa toda la fila y queda centrado */
.day-card:last-child {
  grid-column: span 2;
  justify-self: center;
}

/* Estilos del modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.modal-buttons {
  margin-top: 10px;
}

.modal-buttons button {
  padding: 8px 12px;
  margin: 5px;
  cursor: pointer;
}

.cancel {
  background-color: red;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
}

/* Botón para guardar todo */
.save-all-button {
  margin-top: 20px;
  padding: 10px;
  background-color: black;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

/* Fondo con imagen de alta calidad */
body {
  background-image: url('@/assets/hora1111.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Ajustes para dispositivos móviles */
@media (max-width: 768px) {
  body {
    background-size: contain;
    background-attachment: fixed;
  }

  .schedule-container {
    max-width: 90%;
    padding: 15px;
  }

  .day-card {
    font-size: 14px;
    padding: 8px;
  }

  .modal-content {
    width: 90%;
    padding: 15px;
  }
}


</style>