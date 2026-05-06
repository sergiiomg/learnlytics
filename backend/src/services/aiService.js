const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const buildPrompt = ({ summary, recentStudySessions, recentExams }) => {
  return `
Eres un asistente de análisis académico integrado en una app llamada Learnlytics.

Tu tarea es analizar los hábitos de estudio del usuario usando los datos reales proporcionados.
Debes responder SIEMPRE en español.

IMPORTANTE:
- No inventes datos que no aparezcan.
- Sé útil, concreto y realista.
- Usa un tono cercano, pero académico.
- Devuelve exclusivamente un JSON válido.
- No añadas markdown.
- No añadas texto antes ni después del JSON.

El JSON debe tener exactamente esta estructura:

{
  "summary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommendations": ["string"],
  "detectedPatterns": ["string"]
}

Datos generales del usuario:
${JSON.stringify(summary, null, 2)}

Sesiones de estudio recientes:
${JSON.stringify(recentStudySessions, null, 2)}

Exámenes recientes:
${JSON.stringify(recentExams, null, 2)}
`;
};

const getFallbackAnalysis = () => ({
  summary:
    'No se ha podido generar un análisis con IA en este momento, pero tus datos se han procesado correctamente.',
  strengths: [
    'Estás registrando sesiones de estudio, lo que permite analizar tus hábitos.',
    'La aplicación dispone de datos suficientes para detectar patrones académicos.'
  ],
  weaknesses: [
    'No se ha podido completar el análisis inteligente en este momento.'
  ],
  recommendations: [
    'Vuelve a intentarlo más tarde.',
    'Revisa que la configuración de la API de IA sea correcta.',
    'Continúa registrando sesiones y exámenes para mejorar la calidad del análisis.'
  ],
  detectedPatterns: [
    'Análisis generado mediante respuesta alternativa del sistema.'
  ]
});

const normalizeAnalysis = (analysis) => {
  return {
    summary:
      typeof analysis.summary === 'string'
        ? analysis.summary
        : 'Análisis académico generado correctamente.',

    strengths: Array.isArray(analysis.strengths)
      ? analysis.strengths
      : [],

    weaknesses: Array.isArray(analysis.weaknesses)
      ? analysis.weaknesses
      : [],

    recommendations: Array.isArray(analysis.recommendations)
      ? analysis.recommendations
      : [],

    detectedPatterns: Array.isArray(analysis.detectedPatterns)
      ? analysis.detectedPatterns
      : []
  };
};

const analyzeStudyData = async ({ summary, recentStudySessions, recentExams }) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY no está configurada. Usando fallback.');
      return getFallbackAnalysis();
    }

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content:
            'Eres un asistente experto en análisis de hábitos de estudio, rendimiento académico y productividad para estudiantes.'
        },
        {
          role: 'user',
          content: buildPrompt({
            summary,
            recentStudySessions,
            recentExams
          })
        }
      ],
      temperature: 0.4,
      response_format: {
        type: 'json_object'
      }
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      console.warn('La IA no devolvió contenido. Usando fallback.');
      return getFallbackAnalysis();
    }

    const parsedAnalysis = JSON.parse(content);

    return normalizeAnalysis(parsedAnalysis);
  } catch (error) {
    console.error('Error llamando a OpenAI:', error);
    return getFallbackAnalysis();
  }
};

module.exports = {
  analyzeStudyData
};