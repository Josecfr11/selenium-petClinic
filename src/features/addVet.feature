#language: es
Característica: Agregar un nuevo veterinario
  Como un usuario de la web
  Quiero poder acceder a la página de Veterinarios dentro de petClinic
  Para verificar que puedo agregar un veterinario nuevo correctamente

  Escenario: Agregar un veterinario nuevo en la página de Veterinarios
    Dado que entro a la pagina principal de petClinic
    Cuando navego a la página principal de Veterinarios
    Y lleno el campo de nombre con el valor de "José"
    Y lleno el campo de apellido con el valor de "Parra"
    Y selecciono el tipo de veterinario como "dentistry"
    Y doy clic en boton guardar
    Entonces debo de poder visualizar el nombre de "José Parra" con especialidad de "dentistry"