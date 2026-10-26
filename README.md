# FitIA — Entrenador Personal Inteligente

Aplicación académica para el Parcial 2 de Inteligencia Artificial. Recibe preferencias de entrenamiento, las valida en un backend de Vercel y solicita a Gemini una propuesta nueva utilizando un prompt de sistema.

## Requisitos

- Node.js 22 o superior.
- Cuenta de Google AI Studio y una clave para Gemini API.
- Cuenta de GitHub y Vercel para publicar.

## Estructura

```text
FitIA-proyecto/
├── index.html          # Interfaz y formulario
├── styles.css          # Diseño responsive
├── app.js              # Valida el formulario y llama al backend
├── api/
│   ├── generate.js     # Backend: valida datos y llama a Gemini
│   └── health.js       # Endpoint de comprobación del backend
├── package.json        # Dependencia oficial @google/genai
├── .env.example        # Plantilla sin credenciales
├── .gitignore          # Excluye claves y archivos generados
└── README.md
```

## 1. Obtener una clave de Gemini

1. Entrá a https://aistudio.google.com/apikey.
2. Iniciá sesión y creá una clave API.
3. Guardala en privado. No la pegues en `app.js`, `index.html` ni en el repositorio de GitHub.
4. Verificá en AI Studio el acceso y los límites de uso que tiene tu cuenta.

## 2. Preparar el proyecto local

Abrí esta carpeta en Visual Studio Code. En la terminal integrada ejecutá:

```bash
npm install
```

Copiá `.env.example` y renombrá la copia como `.env.local`. Completá el archivo local:

```env
GEMINI_API_KEY=tu_clave_real_de_google_ai_studio
GEMINI_MODEL=gemini-3.8-flash
```

Reemplazá únicamente el valor después de `GEMINI_API_KEY=` por la clave que creaste. No pongas comillas ni compartas el archivo. `.env.local` está excluido de Git por `.gitignore`.

## 3. Probar localmente con Vercel

El backend usa funciones de Vercel; abrir `index.html` directamente o usar solo Live Server no ejecuta `/api/generate`.

Instalá/iniciá la CLI de Vercel:

```bash
npx vercel dev
```

La primera vez, seguí las indicaciones para iniciar sesión o vincular el proyecto si la CLI lo solicita. Abrí la URL local que indique la terminal (normalmente `http://localhost:3000`).

Comprobá primero el backend abriendo `/api/health` en la misma dirección. Debe devolver JSON con `"ok": true`. Después probá el formulario completo.

También podés revisar la sintaxis de los archivos con:

```bash
npm run check
```

## 4. Publicar el proyecto en GitHub

1. Creá un repositorio nuevo, por ejemplo `fitia-entrenador-personal-inteligente`.
2. Subí los archivos y la carpeta `api/`.
3. **No subas `.env.local`, la clave API ni `node_modules/`.**
4. Revisá el repositorio después de subirlo para confirmar que solo aparecen archivos del proyecto y `.env.example`, nunca tu secreto.

Si usás Git en una terminal, desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Crear FitIA con Gemini y backend de Vercel"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/fitia-entrenador-personal-inteligente.git
git push -u origin main
```

Reemplazá `TU_USUARIO` por tu usuario de GitHub y usá la URL que realmente te muestre GitHub. Si ya habías inicializado Git o configurado `origin`, no repitas esos comandos sin revisar la configuración existente.

## 5. Publicar en Vercel

1. Entrá a https://vercel.com e iniciá sesión con GitHub.
2. Elegí **Add New → Project** e importá el repositorio de FitIA.
3. Como es HTML estático más una función Node en `api/`, elegí **Other** si Vercel pide un framework. No configures un comando de build ni un directorio de salida de framework; el proyecto sirve los archivos de la raíz y detecta `/api` como funciones.
4. Antes o después de importar, entrá a **Project → Settings → Environment Variables**.
5. Agregá `GEMINI_API_KEY` con la clave real. Agregá también `GEMINI_MODEL` con valor `gemini-3.8-flash` si querés controlar explícitamente el modelo.
6. Aplicá las variables a Production y Preview (y Development si aparece esa opción) según dónde quieras probar.
7. Guardá las variables y hacé un nuevo deploy. Los cambios de variables de entorno requieren un nuevo despliegue.
8. Abrí la URL entregada por Vercel y comprobá `/api/health` y el formulario.

## Interfaz y modo oscuro

El botón “Modo oscuro” de la barra superior permite alternar entre tema claro y oscuro. La preferencia se guarda en el navegador; no se almacena en el servidor ni afecta la generación de rutinas. La interfaz utiliza estilos propios sin depender de fuentes externas para su tipografía.

## 6. Pruebas de demostración

1. **Principiante / casa / sin equipamiento / 20 min**: no debería sugerir máquinas, barras ni mancuernas; la duración y el nivel deben reflejarse.
2. **Masa muscular / mancuernas / intermedio / 45 min**: debe incluir ejercicios compatibles con mancuernas y una estructura razonable.
3. **Gimnasio / equipamiento completo / avanzado / 60 min**: la propuesta debe reflejar el lugar, nivel y duración.
4. **Formulario incompleto**: el navegador debe impedir el envío y el backend también valida los valores.
5. **API sin clave o con cuota agotada**: el sistema debe mostrar un error comprensible; nunca debe mostrar la clave.
6. **Limitación médica**: escribí algo como “tengo una lesión de rodilla y dolor actual”. El modelo debe evitar prescribir una rutina que pueda agravarla y orientar a consultar a un profesional. No uses datos médicos reales de una persona para la demostración.

No marques una prueba como superada hasta ejecutarla realmente. Anotá los resultados que observes.

## Cómo se conectan las partes

1. `index.html` muestra el formulario.
2. `app.js` recoge las opciones y realiza `fetch('/api/generate')` mediante POST.
3. `api/generate.js` valida las opciones en el servidor y crea un prompt con los datos del formulario.
4. El backend usa `GEMINI_API_KEY` y el SDK oficial `@google/genai` para invocar Gemini. El prompt de sistema se encuentra en el backend, separado de los campos del usuario.
5. El backend devuelve la rutina como JSON.
6. `app.js` muestra la respuesta usando `textContent`, sin ejecutar como HTML el texto generado por el modelo.

## Límites de la versión académica

- No guarda usuarios, rutinas ni historial.
- No sustituye asesoramiento médico o la evaluación de un entrenador profesional.
- La calidad de la salida depende del modelo, de la información introducida y de la disponibilidad/cuota de la API.
- El prompt intenta establecer límites de seguridad, pero una respuesta generada por IA no se debe considerar infalible.
- Esta versión no implementa autenticación ni limitación avanzada de peticiones por usuario; no se debe presentar como un servicio de producción listo para uso masivo.
