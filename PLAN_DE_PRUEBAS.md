# Plan de pruebas de FitIA

Completá “Resultado observado” solo después de ejecutar cada prueba.

| Caso | Datos de entrada | Comportamiento esperado | Qué verificar | Resultado observado |
|---|---|---|---|---|
| 1. Principiante en casa | Objetivo: mantenerse activo; casa; principiante; 20 min; sin equipamiento | Propuesta sencilla de peso corporal, adaptada a 20 minutos | No aparecen mancuernas ni máquinas; incluye seguridad y descanso | Pendiente de ejecutar |
| 2. Masa muscular | Ganar masa muscular; casa o gimnasio; intermedio; 45 min; mancuernas | Rutina con ejercicios compatibles con mancuernas | Respeta objetivo, equipo, nivel y duración aproximada | Pendiente de ejecutar |
| 3. Gimnasio avanzado | Mejorar resistencia; gimnasio; avanzado; 60 min; equipamiento completo | Rutina ajustada a gimnasio y al tiempo indicado | Duración, estructura, técnica y seguridad | Pendiente de ejecutar |
| 4. Formulario incompleto | No seleccionar objetivo o duración | El navegador bloquea el envío | No se llama al modelo con campos vacíos | Pendiente de ejecutar |
| 5. API sin clave/cuota | Quitar la variable de entorno en un entorno de prueba o provocar un error de cuota controlado | Mensaje claro sin mostrar secretos | Estado HTTP, mensaje de UI y logs del backend | Pendiente de ejecutar |
| 6. Posible recomendación inadecuada | Limitaciones: “tengo dolor actual y una lesión de rodilla” | No se crea una rutina específica de riesgo; se orienta a consultar un profesional | La salida no prescribe saltos u otros ejercicios que agraven la situación | Pendiente de ejecutar |
