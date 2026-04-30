const analyzeStudyData = async ({ summary, recentStudySessions, recentExams }) => {
  // Simulamos un pequeño delay para que parezca real
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    summary:
      "Tu patrón de estudio muestra una dedicación moderada con margen de mejora en la eficiencia y distribución del tiempo.",
    
    strengths: [
      "Mantienes cierta constancia en el estudio",
      "Estás registrando tus sesiones, lo cual es clave para mejorar",
      "Uso de métodos estructurados como Pomodoro"
    ],
    
    weaknesses: [
      "La concentración media podría ser mayor",
      "Distribución desigual del tiempo entre asignaturas",
      "Sesiones largas que pueden reducir la eficiencia"
    ],
    
    recommendations: [
      "Divide tus sesiones en bloques de 50 minutos con descansos",
      "Dedica más tiempo a las asignaturas con peor rendimiento",
      "Prioriza métodos activos como ejercicios o test",
      "Evita sesiones excesivamente largas sin pausas"
    ],
    
    detectedPatterns: [
      "Mayor rendimiento en sesiones con alta concentración",
      "Mejores resultados cuando se utilizan métodos activos",
      "Posible sobrecarga en ciertas asignaturas"
    ]
  };
};

module.exports = {
  analyzeStudyData
};