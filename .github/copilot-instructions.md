# Repository Copilot Instructions

## Vuetify MDI Icons

- Use SVG MDI icons via `@mdi/js`, not string names like `mdi-...`.
- Import icon constants in `<script setup lang="ts">`, for example:
  - `import { mdiFormatVerticalAlignTop, mdiUnfoldMoreHorizontal } from '@mdi/js'`
- Bind icons as props in templates:
  - `v-btn(:prepend-icon='mdiFormatVerticalAlignTop')`
  - `v-icon(:icon='mdiUnfoldMoreHorizontal')`
- Keep icon usage consistent with existing project style: typed imports + bound props.
