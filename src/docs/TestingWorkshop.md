# Testing Workshop: Login y Register

Esta guía está pensada para que aprendas `Vitest` y `Jest` mientras practicas con tu proyecto real. La herramienta que vamos a ejecutar en este repo es `Vitest`, pero en cada fase tendrás la equivalencia mental con `Jest`.

## Antes de empezar

Tu proyecto ya tiene la base necesaria:

- `vitest` como test runner
- `jsdom` para simular el navegador
- `@testing-library/react` para renderizar componentes
- `@testing-library/jest-dom` para matchers más expresivos
- `@testing-library/user-event` para simular interacciones de usuario

Archivo clave de configuración:

- [vite.config.ts](/Users/alexft/Documents/frontend/youtube-app-frontend/vite.config.ts)
- [src/test/setup.ts](/Users/alexft/Documents/frontend/youtube-app-frontend/src/test/setup.ts)

Equivalencias rápidas:

- `describe`, `it`, `expect`: iguales en Vitest y Jest
- `vi.fn()`: equivale a `jest.fn()`
- `vi.spyOn()`: equivale a `jest.spyOn()`
- Testing Library se usa prácticamente igual en ambos

## Cómo trabajar conmigo

En cada paso puedes escribirme una de estas frases:

- `quiero la siguiente pista`
- `te enseño mi test y me dices qué falla`
- `estoy bloqueado, ayúdame más directamente`

Yo iré subiendo el nivel de ayuda poco a poco para que practiques de verdad.

## Sesión 1: entender la base

Objetivo: entender la estructura de un test.

Haz esto:

1. Ejecuta `npm run test`
2. Abre [src/utils/validators.test.ts](/Users/alexft/Documents/frontend/youtube-app-frontend/src/utils/validators.test.ts)
3. Intenta identificar estas tres fases en cada test:
   - preparar
   - actuar
   - comprobar

Pista mental:

- En tests simples de funciones puras, preparar y actuar a veces casi se mezclan.
- Lo importante es reconocer qué entrada das y qué salida esperas.

## Sesión 2: validadores

Objetivo: ganar confianza con tests unitarios.

Ya tienes una base en [src/utils/validators.test.ts](/Users/alexft/Documents/frontend/youtube-app-frontend/src/utils/validators.test.ts). Léela como referencia de estilo.

Preguntas que debes hacerte al crear casos:

- ¿qué pasa si el campo está vacío?
- ¿qué pasa si el valor es incorrecto?
- ¿qué pasa si el valor es correcto?

Checklist de cobertura mínima:

- `validateEmail`
- `validatePassword`
- `validateUsername`
- `validateConfirmPassword`
- `validateProfileImage`

## Sesión 3: primer test de formulario

Objetivo: aprender a renderizar un componente y simular interacción.

Componente recomendado para empezar:

- [src/pages/Login.tsx](/Users/alexft/Documents/frontend/youtube-app-frontend/src/pages/Login.tsx)

Tu misión:

1. renderizar el componente
2. localizar email, password y botón
3. escribir valores inválidos
4. provocar `blur` o `submit`
5. comprobar que aparece el mensaje de error

Pistas importantes:

- Piensa como usuario, no como implementación.
- Prefiere buscar elementos por `label` o por `role`.
- `userEvent` representa mejor la interacción real que `fireEvent`.

## Sesión 4: Login con dependencias

Objetivo: testear un flujo más realista.

Casos recomendados:

1. no envía el formulario si hay errores de validación
2. muestra error cuando la API responde con fallo
3. muestra estado de loading durante la petición
4. llama a login y navega a home cuando todo va bien

Dependencias a pensar:

- `fetch`
- navegación
- contexto `useAuth`

Preguntas que debes hacerte antes de mockear:

- ¿esto forma parte del comportamiento que quiero verificar o solo es una dependencia externa?
- ¿quiero comprobar que se llama, o quiero usar la implementación real?

## Sesión 5: Register

Objetivo: practicar un formulario más completo.

Componente:

- [src/pages/Register.tsx](/Users/alexft/Documents/frontend/youtube-app-frontend/src/pages/Register.tsx)

Casos recomendados:

1. errores de username, email, password y confirm password
2. error cuando falta la imagen
3. preview al subir archivo
4. mensaje de error del backend
5. mensaje de éxito y navegación posterior

Pistas:

- El input `file` se testea simulando una subida.
- No hace falta testear detalles internos de `FormData`; primero céntrate en el comportamiento visible.

## Sesión 6: criterio

Objetivo: escribir mejores tests, no solo tests que pasan.

Señales de buen test:

- el nombre explica el comportamiento esperado
- falla por una razón clara
- no depende demasiado de detalles internos
- sigue el flujo real del usuario

Señales de test frágil:

- usa selectores demasiado específicos
- comprueba demasiadas cosas a la vez
- depende de clases CSS o estructura interna sin necesidad

## Ejercicios sugeridos

Hazlos en este orden:

1. añadir un caso nuevo a `validatePassword`
2. añadir un caso feliz a `validateUsername`
3. crear tu primer test de render de `Login`
4. crear un test de validación visual en `Login`
5. crear un test de error de backend en `Login`
6. crear un test de preview de imagen en `Register`

## Plantilla mental para cualquier test

Usa esta secuencia:

1. ¿Qué comportamiento quiero comprobar?
2. ¿Qué necesito renderizar o llamar?
3. ¿Qué acción haría el usuario?
4. ¿Qué debería verse o ejecutarse después?

## Cuando comparemos con Jest

Qué cambia:

- el sistema de mocks usa `vi` en vez de `jest`
- la configuración y algunas utilidades cambian de nombre

Qué no cambia:

- la forma de pensar el test
- el patrón `render -> interactuar -> assert`
- Testing Library casi siempre se escribe igual

## Siguiente paso recomendado

Empieza por esto:

1. ejecuta `npm run test`
2. lee [src/utils/validators.test.ts](/Users/alexft/Documents/frontend/youtube-app-frontend/src/utils/validators.test.ts)
3. dime con tus palabras qué hace uno de los tests
4. luego te pediré que escribas uno nuevo tú
