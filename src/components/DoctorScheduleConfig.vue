<template>
    <div class="schedule-container">
      <h2>Horarios de los Doctores</h2>
      <div class="schedule-list">
        <div v-for="doctor in doctors" :key="doctor.name" class="doctor-schedule">
          <h3>{{ doctor.name }}</h3>
          <div class="schedule-grid">
            <div v-for="schedule in doctor.schedule" :key="schedule.dia" class="schedule-item">
              <strong>{{ schedule.dia }}:</strong> {{ schedule.horaInicio }} - {{ schedule.horaFin }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
export default {
  data() {
    return {
      doctors: []
    };
  },
  async created() {
    await this.loadSchedules(); // Llamar a la función de carga al crear el componente
  },
  methods: {
    async loadSchedules() {
      try {
        const response = await fetch("http://localhost:8080/horarios", { mode: "cors" });
        const schedules = await response.json();

        console.log("Datos recibidos:", schedules); // Verifica la respuesta de la API

        // Agrupar horarios por doctor
        const groupedSchedules = {};
        schedules.forEach(schedule => {
          if (!groupedSchedules[schedule.doctor]) {
            groupedSchedules[schedule.doctor] = { name: schedule.doctor, schedule: [] };
          }

          // Formatear hora para que se vea solo HH:mm
          const formatTime = (time) => time ? time.slice(0, 5) : "N/A";

          groupedSchedules[schedule.doctor].schedule.push({
            dia: schedule.dia,
            horaInicio: formatTime(schedule.hora_inicio), // Usa el nombre correcto
            horaFin: formatTime(schedule.hora_fin) // Usa el nombre correcto
          });
        });

        // Convertimos el objeto en un array
        this.doctors = Object.values(groupedSchedules);
      } catch (error) {
        console.error("Error al cargar los horarios:", error);
      }
    }
  }
};
  </script>
  
  <style scoped>
  .schedule-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  .schedule-list {
    margin-top: 20px;
  }
  .doctor-schedule {
    margin-bottom: 15px;
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
  .schedule-grid {
    display: flex;
    flex-direction: column;
  }
  .schedule-item {
    margin: 5px 0;
    padding: 5px;
    background-color: #e3e3e3;
    border-radius: 4px;
  }
  </style>
  