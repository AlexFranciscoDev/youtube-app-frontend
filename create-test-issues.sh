#!/bin/bash
# Script para crear los 9 issues de testing del componente Register
# Repo: AlexFranciscoDev/youtube-app-frontend
#
# Requisitos:
#   brew install gh
#   gh auth login
#
# Uso:
#   chmod +x create-test-issues.sh
#   ./create-test-issues.sh

REPO="AlexFranciscoDev/youtube-app-frontend"

echo "Creando label 'testing' si no existe..."
gh label create testing --color "0075ca" --description "Test-related tasks" --repo $REPO 2>/dev/null || true

echo ""
echo "Creando Issue 1..."
gh issue create --repo $REPO \
  --title "[Test] Register #1: Render — verificar que el formulario se pinta correctamente" \
  --label "testing" \
  --body "## Objetivo
Aprender el test más básico: comprobar que un componente renderiza sin errores y que todos sus elementos existen en el DOM.

## Archivo
\`src/pages/Register.test.tsx\`

## Referencia
\`src/pages/Logix.test.tsx\` — ver cómo se hace en Login el test de render.

## Qué testear

- El título \`\"Create your account\"\` está en el documento
- El input de username existe → \`getByLabelText(\"Username\")\`
- El input de email existe → \`getByLabelText(\"Email\")\`
- El input de password existe → \`getByLabelText(\"Password\")\`
- El input de confirm password existe → \`getByLabelText(\"Confirm password\")\`
- El input de profile image existe → \`getByLabelText(\"Profile image\")\`
- El botón submit existe → \`getByRole(\"button\", { name: /Create account/i })\`
- El link a /login existe → \`getByRole(\"link\", { name: /Sign in/i })\`

## Conceptos clave a aprender
- \`render()\` — montar el componente en un DOM simulado
- \`screen.getByLabelText()\` — buscar inputs por su \`<label>\`
- \`screen.getByRole()\` — buscar elementos por su rol semántico
- \`expect(...).toBeInTheDocument()\` — assertion de jest-dom

## Setup necesario
El componente necesita \`MemoryRouter\` (tiene \`<Link>\`) y probablemente \`AuthProvider\`. Mira cómo lo hace Login en Logix.test.tsx."

echo "✓ Issue 1 creado"

echo ""
echo "Creando Issue 2..."
gh issue create --repo $REPO \
  --title "[Test] Register #2: Validación del campo username en blur" \
  --label "testing" \
  --body "## Objetivo
Aprender a testear validación en tiempo real: los errores solo aparecen cuando el usuario sale del campo (\`onBlur\`).

## Archivo
\`src/pages/Register.test.tsx\`

## Qué testear

| Acción | Error esperado |
|--------|---------------|
| Blur sin escribir nada | \`\"Username is required\"\` |
| Escribir \`\"alex\"\` (4 chars) + blur | \`\"Username must be at least 5 characters\"\` |
| Escribir \`\"alex yt\"\` (con espacio) + blur | \`\"Username must not contain spaces\"\` |
| Escribir \`\"alexyt\"\` (válido) + blur | No debe aparecer ningún error |

## Conceptos clave a aprender
- \`fireEvent.change(input, { target: { value: '...' } })\` — simular escritura
- \`fireEvent.blur(input)\` — simular que el usuario sale del campo
- \`screen.getByText()\` — verificar que el mensaje de error aparece
- \`expect(...).not.toBeInTheDocument()\` — verificar ausencia de error

## Pista
Recuerda que el error de username vacío solo aparece tras el blur, no inmediatamente."

echo "✓ Issue 2 creado"

echo ""
echo "Creando Issue 3..."
gh issue create --repo $REPO \
  --title "[Test] Register #3: Validación del campo email en blur" \
  --label "testing" \
  --body "## Objetivo
Consolidar el patrón \`fireEvent.change + fireEvent.blur\` aprendido en el Issue 2, aplicándolo al campo email.

## Archivo
\`src/pages/Register.test.tsx\`

## Qué testear

| Acción | Error esperado |
|--------|---------------|
| Blur sin escribir nada | \`\"Email is required\"\` |
| Escribir \`\"notanemail\"\` + blur | \`\"Invalid email format\"\` |
| Escribir \`\"user@test.com\"\` (válido) + blur | No debe aparecer ningún error |

## Conceptos clave a aprender
- Reutilizar el mismo patrón del Issue 2 con otro campo
- Confirmar que la validación de email funciona correctamente

## Referencia
\`src/utils/validators.ts\` — ver la función \`validateEmail()\` para saber exactamente qué mensajes devuelve."

echo "✓ Issue 3 creado"

echo ""
echo "Creando Issue 4..."
gh issue create --repo $REPO \
  --title "[Test] Register #4: Validación de password y confirm password (validación cruzada)" \
  --label "testing" \
  --body "## Objetivo
Aprender a testear validación cruzada entre dos campos: \`confirm password\` depende del valor de \`password\`.

## Archivo
\`src/pages/Register.test.tsx\`

## Qué testear

**Password:**
| Acción | Error esperado |
|--------|---------------|
| Blur sin escribir nada | \`\"Password is required\"\` |
| Escribir \`\"123\"\` (< 5 chars) + blur | \`\"Password must be at least 5 characters\"\` |

**Confirm password:**
| Acción | Error esperado |
|--------|---------------|
| Blur sin escribir nada | \`\"Confirm password is required\"\` |
| Escribir \`\"12345\"\` en password, \`\"99999\"\` en confirm + blur | \`\"Passwords do not match\"\` |
| Escribir \`\"12345\"\` en ambos + blur | No debe aparecer ningún error |

## Conceptos clave a aprender
- El orden importa: cambiar password primero, luego confirm
- El campo confirm valida comparando contra el valor actual de password

## Pista
Los inputs de password son el componente \`<PasswordInput>\`. Puedes localizarlos con \`getByLabelText(\"Password\")\` y \`getByLabelText(\"Confirm password\")\`."

echo "✓ Issue 4 creado"

echo ""
echo "Creando Issue 5..."
gh issue create --repo $REPO \
  --title "[Test] Register #5: Submit vacío — muestra todos los errores y no llama a fetch" \
  --label "testing" \
  --body "## Objetivo
Aprender a espiar funciones globales con \`vi.spyOn\` y verificar que NO se llaman cuando el formulario es inválido.

## Archivo
\`src/pages/Register.test.tsx\`

## Qué testear

1. Click en el botón \"Create account\" con todos los campos vacíos
2. Verificar que aparecen los 5 mensajes de error a la vez:
   - \`\"Username is required\"\`
   - \`\"Email is required\"\`
   - \`\"Password is required\"\`
   - \`\"Confirm password is required\"\`
   - \`\"Profile image is required\"\` (o similar)
3. Verificar que \`fetch\` NO fue llamado

## Conceptos clave a aprender
\`\`\`ts
const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(vi.fn())
// ... submit ...
expect(fetchSpy).not.toHaveBeenCalled()
\`\`\`

## Pista
El submit cambia el estado \`touched\` de todos los campos y muestra todos los errores a la vez. Esto es diferente al blur individual de los issues anteriores."

echo "✓ Issue 5 creado"

echo ""
echo "Creando Issue 6..."
gh issue create --repo $REPO \
  --title "[Test] Register #6: Subir imagen muestra la preview" \
  --label "testing" \
  --body "## Objetivo
Aprender a interactuar con \`<input type=\"file\">\` en tests y a mockear APIs del navegador que jsdom no implementa (\`URL.createObjectURL\`).

## Archivo
\`src/pages/Register.test.tsx\`

## Qué testear

1. Mockear \`URL.createObjectURL\` (jsdom no lo tiene)
2. Crear un \`File\` falso
3. Simular que el usuario sube ese archivo al input
4. Verificar que aparece la imagen de preview con el src correcto

## Conceptos clave a aprender
\`\`\`ts
// 1. Mock de URL global
vi.stubGlobal('URL', {
  createObjectURL: vi.fn(() => 'blob:fake-url'),
  revokeObjectURL: vi.fn(),
})

// 2. Crear archivo falso
const fakeFile = new File(['content'], 'avatar.png', { type: 'image/png' })

// 3. Simular upload
const input = screen.getByLabelText('Profile image')
fireEvent.change(input, { target: { files: [fakeFile] } })

// 4. Verificar preview
const preview = screen.getByAltText('Profile preview')
expect(preview).toHaveAttribute('src', 'blob:fake-url')
\`\`\`

## Pista
Recuerda hacer el mock de URL ANTES de renderizar o de interactuar con el input. Y limpiarlo en \`afterEach\` con \`vi.unstubAllGlobals()\`."

echo "✓ Issue 6 creado"

echo ""
echo "Creando Issue 7..."
gh issue create --repo $REPO \
  --title "[Test] Register #7: Error del backend — muestra el mensaje de error del servidor" \
  --label "testing" \
  --body "## Objetivo
Aprender a mockear \`fetch\` para simular una respuesta de error del servidor y verificar que el componente la muestra al usuario.

## Archivo
\`src/pages/Register.test.tsx\`

## Qué testear

1. Rellenar el formulario con datos válidos (incluyendo imagen)
2. Mockear fetch para que devuelva \`{ status: 'Error', message: 'Email already registered' }\`
3. Hacer submit
4. Verificar que el mensaje \`\"Email already registered\"\` aparece en el DOM

## Conceptos clave a aprender
\`\`\`ts
vi.spyOn(global, 'fetch').mockResolvedValueOnce({
  json: async () => ({ status: 'Error', message: 'Email already registered' }),
} as Response)

// Assertion asíncrona (espera a que el estado se actualice)
expect(await screen.findByText('Email already registered')).toBeInTheDocument()
\`\`\`

## Diferencia con Login
- Login usa \`JSON.stringify\` → el body es un string
- Register usa \`FormData\` → el body es un objeto FormData

Eso no afecta al mock de fetch, pero sí al Issue #9.

## Pista
\`screen.findByText()\` (con \`find\`, no \`get\`) es asíncrono y espera a que el elemento aparezca. Úsalo cuando el DOM cambia después de una promesa."

echo "✓ Issue 7 creado"

echo ""
echo "Creando Issue 8..."
gh issue create --repo $REPO \
  --title "[Test] Register #8: Registro exitoso — mensaje de éxito y navegación a /login con setTimeout" \
  --label "testing" \
  --body "## Objetivo
Aprender a controlar el tiempo en tests con \`vi.useFakeTimers()\` para testear el \`setTimeout\` que hay en el componente antes de navegar.

## Archivo
\`src/pages/Register.test.tsx\`

## Contexto
En Register, tras un registro exitoso:
\`\`\`ts
setSubmitMessage({ text: data.message, isError: false })
setTimeout(() => navigate('/login'), 2000)  // ← 2 segundos de espera
\`\`\`

## Qué testear

1. Mockear fetch → \`{ status: 'Success', message: 'User registered successfully' }\`
2. Rellenar y enviar el formulario
3. Verificar que aparece el mensaje de éxito inmediatamente
4. Avanzar el tiempo 2000ms con fake timers
5. Verificar que \`navigate\` fue llamado con \`'/login'\`

## Conceptos clave a aprender
\`\`\`ts
beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  vi.useRealTimers()
})

// Después del submit:
expect(await screen.findByText('User registered successfully')).toBeInTheDocument()
vi.advanceTimersByTime(2000)
expect(navigateMock).toHaveBeenCalledWith('/login')
\`\`\`

## Pista
\`vi.useFakeTimers()\` congela \`setTimeout\`, \`setInterval\`, etc. Con \`vi.advanceTimersByTime(2000)\` avanzas manualmente el reloj 2 segundos, disparando el callback del \`setTimeout\`."

echo "✓ Issue 8 creado"

echo ""
echo "Creando Issue 9..."
gh issue create --repo $REPO \
  --title "[Test] Register #9: Verificar que fetch recibe los datos correctos en FormData" \
  --label "testing" \
  --body "## Objetivo
Aprender a inspeccionar los argumentos con los que se llamó a \`fetch\`, incluyendo el contenido de un \`FormData\` (diferente a JSON de Login).

## Archivo
\`src/pages/Register.test.tsx\`

## Contexto
A diferencia de Login (que usa \`JSON.stringify\`), Register construye un \`FormData\`:
\`\`\`ts
const formData = new FormData()
formData.append('username', username)
formData.append('email', email)
formData.append('password', password)
formData.append('image', profileImage)
\`\`\`

## Qué testear

1. Rellenar el formulario con datos específicos y conocidos
2. Mockear fetch para que devuelva éxito
3. Hacer submit
4. Inspeccionar cómo se llamó fetch:

\`\`\`ts
const [url, options] = fetchSpy.mock.calls[0]
const body = options?.body as FormData

expect(url).toBe('http://localhost:3000/api/user/register')
expect(options?.method).toBe('POST')
expect(body.get('username')).toBe('testuser')
expect(body.get('email')).toBe('user@test.com')
expect(body.get('password')).toBe('12345')
expect(body.get('image')).toBeInstanceOf(File)
\`\`\`

## Conceptos clave a aprender
- \`fetchSpy.mock.calls[0]\` — array con los argumentos de la primera llamada
- \`FormData.get('campo')\` — leer un campo del FormData
- Diferencia entre testear JSON vs FormData

## Pista
Este es el test más complejo. Necesitas combinar el mock de fetch, el mock de URL.createObjectURL (para la imagen), y las assertions sobre FormData."

echo "✓ Issue 9 creado"

echo ""
echo "========================================"
echo "✅ 9 issues creados en $REPO"
echo "Ver issues: https://github.com/$REPO/issues"
echo "========================================"
