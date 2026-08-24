# Configuración del Proyecto

## Repositorio

Nombre: elcon-app-mantenimiento

## Rama principal

main

## Rama de auditoría

audit/auditoria-fisica

## Estructura del proyecto

- `mobile/`: contiene el código fuente de la aplicación móvil.
- `backend/`: contiene los servicios y API REST del sistema.
- `database/`: contiene los scripts relacionados con la base de datos.
- `docs/`: contiene la documentación técnica y funcional del proyecto.

## Tecnologías previstas

- Ionic
- Angular
- Node.js
- API REST
- Base de datos relacional
- Git
- GitHub

## Gestión de configuración

El proyecto utiliza Git para el control de versiones y GitHub como plataforma para el alojamiento del repositorio, seguimiento de Issues, revisión mediante Pull Requests y gestión de Releases.

## Seguridad de configuración

Las variables de entorno y credenciales reales no deben almacenarse en el repositorio. Se utiliza `.env.example` como referencia para las variables requeridas y `.gitignore` para evitar el seguimiento de archivos sensibles.