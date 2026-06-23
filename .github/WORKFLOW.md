# Flujo de trabajo Git — MantenPro

## Ramas

| Rama | Uso |
|------|-----|
| `main` | Producción. Solo entra código vía **Pull Request**. |
| `feature/*` | Nuevas funcionalidades (`feature/tasks-crud`, `feature/auth`) |
| `fix/*` | Correcciones puntuales |
| `chore/*` | Config, deps, CI, refactor sin feature |

**No commitear directo en `main`.** Siempre: rama → PR → merge.

## Flujo diario

### 1. Actualizar `main`

```bash
git checkout main
git pull origin main
```

### 2. Crear rama feature

```bash
git checkout -b feature/nombre-corto
```

Ejemplos:
- `feature/tasks-server-actions`
- `feature/activate-middleware`
- `chore/unify-supabase-env`

### 3. Trabajar y commitear

```bash
git add .
git commit -m "feat: descripción breve del cambio"
git push -u origin feature/nombre-corto
```

### 4. Abrir Pull Request

**Opción A — GitHub CLI** (tras `gh auth login`):

```bash
gh pr create --base main --title "feat: título" --body "Descripción"
```

**Opción B — Web:**

1. Ve a https://github.com/Salvador2131/maintenance-request-app
2. Aparece el banner "Compare & pull request" tras el push
3. Base: `main` ← Compare: tu rama `feature/*`
4. Rellena la plantilla del PR y crea

### 5. CI automático

Cada PR ejecuta en GitHub Actions:
- `npm run typecheck`
- `npm run build`

Debe estar en verde antes de mergear.

### 6. Mergear

En GitHub: **Squash and merge** o **Merge commit** (recomendado: squash para historial limpio).

Luego en local:

```bash
git checkout main
git pull origin main
git branch -d feature/nombre-corto
```

## Deploy

- Push/merge a `main` → Vercel despliega automáticamente
- URL: https://maintenance-request-app-79cy.vercel.app

## Convenciones de commits (sugerido)

```
feat: nueva funcionalidad
fix: corrección de bug
chore: mantenimiento, config
docs: documentación
refactor: sin cambio de comportamiento
```

## Proteger `main` (recomendado en GitHub)

Settings → Branches → Add branch protection rule:

- Branch name: `main`
- ✅ Require a pull request before merging
- ✅ Require status checks to pass (CI / quality)
- Opcional: Require approvals

## Próximas features planificadas

1. `feature/tasks-server-actions` — persistir tareas en Supabase
2. `feature/notifications-persist` — notificaciones en BD
3. `feature/activate-middleware` — protección de rutas
4. `feature/remove-legacy-supabase` — limpiar `utils/supabase`
