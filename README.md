# Labroides - Formulario de Registro de Usuarios

## Descripción

Está aplicación web proporciona un formulario para el registro de usuarios en Labroides. Este formulario es parte integral del proceso de registro y recolección de datos de Equitel.

## Instrucciones de Ejecución

1. Clona este repositorio en tu máquina local.
2. Abre la terminal y navega al directorio del proyecto.
3. Ejecuta el comando `npm install` para instalar las dependencias de la aplicación.
4. Ejecuta el comando `ng serve` para iniciar la aplicación de forma local.
5. Abre tu navegador y ve a <http://localhost:4200>.

## Instrucciones de Construcción

Para generar el bundle de producción de la aplicación, utiliza el siguiente comando:

`ng build --configuration production --output-hashing none`

Este comando generará los archivos optimizados en el directorio dist/.

## Dependencias

La aplicación depende de algunos servicios de la [API de Equitel](http://apiequitel.us-east-2.elasticbeanstalk.com/swagger/index.html) para su correcto funcionamiento.
