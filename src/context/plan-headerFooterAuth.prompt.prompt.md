# Plan: Header y Footer con Logo (Usuario logueado vs No logueado)

## Objetivo
Crear un sistema de Header y Footer que cambie su contenido según si el usuario está logueado o no, con un Context de autenticación para manejar el estado global.

## Estructura del Header (según estado)

### No Logueado
```
┌──────────────────────────────────────┐
│ [Logo]     YouTube App               │
│                          [Login] [Register]
└──────────────────────────────────────┘
```

### Logueado
```
┌──────────────────────────────────────┐
│ [Logo]     YouTube App               │
│                  [Hola, Juan] [Perfil] [Logout]
└──────────────────────────────────────┘
```

## Steps a Implementar

### 1. Crear Context de Autenticación
- **Ubicación:** `src/context/` (crear carpeta)
- **Archivos:**
  - `AuthContext.tsx` - Define el contexto y su interfaz
  - `AuthProvider.tsx` - Proporciona el contexto a toda la app
- **Funcionalidad:**
  - Guardar estado del usuario (logueado sí/no)
  - Guardar datos del usuario (nombre, email, id, etc.)
  - Métodos: `login()`, `logout()`, `isLoggedIn()`

### 2. Actualizar `src/App.tsx`
- Envolver la app con `<AuthProvider>`
- Asegurar que el contexto esté disponible en toda la aplicación

### 3. Crear Componentes en `src/components/`
- **Header.tsx**
  - Lee el contexto de autenticación
  - Muestra diferente contenido según `isLoggedIn`
  - Si no logueado: botones Login y Register
  - Si logueado: nombre del usuario, perfil, logout
  
- **Footer.tsx**
  - Mismo para todas las páginas
  - Elementos: copyright, redes sociales, links útiles
  
- **Navigation.tsx** (opcional)
  - Componente reutilizable para navegación
  - Links: Home, otras secciones

### 4. Crear Layout en `src/layouts/`
- **MainLayout.tsx**
  - Estructura: Header + contenido (children) + Footer
  - Recibirá las páginas como `children`
  - Usará flexbox para que el footer quede al pie

### 5. Actualizar `src/router/Routing.tsx`
- Envolver cada ruta con `<MainLayout>`
- Ejemplo:
  ```
  <Route path="/" element={<MainLayout><Home /></MainLayout>} />
  <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
  ```

## Flujo de Datos

```
AuthProvider (Context global)
    ↓
    App.tsx (envuelto con AuthProvider)
    ↓
    BrowserRouter
    ↓
    Routing (rutas con MainLayout)
    ↓
    MainLayout
    ├── Header (Lee contexto, muestra estado login/logout)
    ├── Contenido (página actual)
    └── Footer
```

## Verificación

- [ ] Sin login: ver botones "Login" y "Register" en el header
- [ ] Hacer login: header cambia a mostrar nombre del usuario y "Logout"
- [ ] Hacer logout: vuelve al header sin login
- [ ] Header y Footer aparecen en TODAS las páginas
- [ ] Logo aparece correctamente en el header
- [ ] Navegación funciona entre todas las rutas

## Notas Importantes

- El Context debe estar **arriba de BrowserRouter** en el árbol de componentes
- El estado de autenticación es **global** y accesible desde cualquier componente
- Para simular login/logout, podemos usar localStorage o estado en memoria (sin backend)
- Las rutas protegidas (si las hay) se pueden implementar después con rutas privadas

## Próximos Pasos

1. Crear la carpeta `src/context/`
2. Implementar `AuthContext.tsx` y `AuthProvider.tsx`
3. Crear componentes Header.tsx, Footer.tsx, Navigation.tsx
4. Crear MainLayout.tsx
5. Actualizar Routing.tsx para usar MainLayout
6. Actualizar App.tsx para usar AuthProvider
7. Probar navegación y cambio de estados
