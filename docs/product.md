Product Blueprint
Catálogo Web para Comercios

Estado: En desarrollo
Versión: 1.0
Objetivo: Definir la visión del producto, su arquitectura y la estrategia de evolución.

Visión

El objetivo del proyecto es desarrollar una plataforma de catálogo web reutilizable para pequeños y medianos comercios.

Aunque el sistema nació para resolver las necesidades específicas de una ferretería, la visión es convertirlo en un producto adaptable a distintos rubros que compartan una necesidad común: mostrar productos, promociones e información de forma simple, moderna y autoadministrable.

El producto no debe depender de un tipo de comercio en particular, sino de un modelo de datos común.

Objetivo principal

Crear un único producto que pueda comercializarse múltiples veces realizando la menor cantidad posible de modificaciones específicas para cada cliente.

Cada nueva implementación debería consistir únicamente en:

Configurar la identidad visual.
Configurar la fuente de datos.
Configurar la información del comercio.

Sin modificar el código del sistema.

Situación actual

Actualmente el sistema fue desarrollado pensando exclusivamente para una ferretería.

Las principales características actuales son:

Catálogo de productos.
Categorías.
Buscador.
Promociones.
Eventos.
Información del comercio.
Responsive.
Integración con WhatsApp.

La obtención de los datos ya se encuentra parcialmente desacoplada del frontend, aunque actualmente depende de una implementación específica.

Esto representa un buen punto de partida para evolucionar hacia una arquitectura más flexible.

Problema actual

Actualmente la fuente de información se encuentra pensada para una implementación concreta.

Si bien el sistema ya consume datos desde una capa intermedia, todavía no existe una abstracción formal que permita cambiar la fuente de datos sin modificar la implementación.

El objetivo será eliminar esa dependencia.

Objetivo de la primera etapa

La prioridad no es desarrollar nuevas funcionalidades.

La prioridad es transformar el proyecto actual en un producto comercializable.

Para lograrlo será necesario desacoplar todos aquellos elementos específicos de la ferretería.

El resultado esperado es un catálogo capaz de adaptarse a distintos comercios únicamente mediante configuración.

Primera etapa (Plan Catálogo)

La primera versión comercial estará orientada a ofrecer una solución simple y económica.

Su administración estará basada en una planilla (Google Sheets o compatible).

El cliente será responsable de mantener actualizada la información.

El sistema únicamente consumirá esos datos y los presentará de forma visual.

Esta estrategia permite:

Reducir costos.
Eliminar la necesidad de un panel de administración.
Facilitar el aprendizaje del cliente.
Disminuir el tiempo de implementación.
Comercializar el producto rápidamente.

El objetivo de esta etapa es validar el producto en el mercado.

No se pretende resolver todos los problemas posibles, sino ofrecer una solución sólida para la mayoría de los comercios.

Segunda etapa (Plan Pro)

Una vez validado el producto y conocidas las necesidades reales de los clientes, se desarrollará una versión profesional.

Esta versión incorporará un panel de administración propio.

Entre las posibles funcionalidades se contemplan:

Gestión completa de productos.
Gestión de usuarios.
Roles y permisos.
Estadísticas.
Gestión de imágenes.
Configuración visual.
Integraciones con servicios externos.
APIs.
Automatizaciones.

Esta etapa no reemplaza a la primera.

Ambas deberán convivir.

Arquitectura objetivo

La arquitectura deberá estar basada en una separación clara entre la interfaz y el origen de los datos.

El frontend nunca debería conocer de dónde proviene la información.

Su única responsabilidad será consumir una interfaz común.

Ejemplo conceptual:

Frontend

        │

        ▼

Catálogo

        │

        ▼

Proveedor de datos

        ├── Google Sheets
        ├── API REST
        ├── Laravel
        ├── Supabase
        ├── JSON
        └── Cualquier otra implementación futura

El cambio de proveedor de datos no debería requerir modificaciones en la interfaz.

Principios de desarrollo

Durante la evolución del producto deberán respetarse los siguientes principios:

Un único código para todos los clientes.
Configuración antes que personalización.
Evitar bifurcaciones del proyecto.
Mantener la simplicidad del producto.
Priorizar la reutilización.
Desarrollar únicamente funcionalidades que aporten valor real.
Evitar implementar características sin validar previamente su necesidad.
Filosofía del producto

El objetivo no es construir un sistema de gestión empresarial.

El objetivo es ofrecer la forma más simple posible de publicar y mantener actualizado un catálogo digital.

Cada nueva funcionalidad deberá responder una pregunta:

¿Esta mejora beneficia a la mayoría de los clientes o solamente a un caso particular?

Si la respuesta es un caso particular, deberá evaluarse si corresponde desarrollarla como una personalización y no como parte del producto principal.

Visión a largo plazo

El proyecto debe evolucionar hacia una plataforma capaz de adaptarse a distintos rubros mediante configuración, manteniendo una única base de código y permitiendo ofrecer distintos planes comerciales según las necesidades de cada cliente.

La prioridad siempre será mantener un producto fácil de implementar, fácil de mantener y fácil de vender.
