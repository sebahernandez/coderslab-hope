# Spec Delta

## ADDED Requirements

### Requirement: Aviso de disponibilidad con diseño único
Todos los armadores (Helado Hope, Mixo Hope, Barquillo y Milkshake) SHALL mostrar el aviso de disponibilidad con el mismo diseño visual: fondo rosado claro, borde fino rosado, esquinas redondeadas, texto de 12px en peso medio y color rosado apagado, e ícono de 16px que hereda el color del texto. Ningún armador MUST NOT aplicar un estilo propio distinto al aviso.

#### Scenario: Mismo aspecto en Helado Hope y Milkshake
- **WHEN** el cliente abre el armador de Helado Hope y luego el de Milkshake con el aviso visible
- **THEN** ambos avisos tienen el mismo fondo, borde, radio, tamaño de texto, peso, color e ícono

#### Scenario: El texto cambia sin alterar el diseño
- **WHEN** la consulta de disponibilidad responde "Disponible solo para compra presencial", "Disponible solo para delivery", "Disponible para delivery y compra presencial" o un mensaje de error
- **THEN** solo cambia el texto del aviso; el diseño y el ícono se mantienen

### Requirement: Ícono de local en el aviso de disponibilidad
El aviso de disponibilidad SHALL mostrar un ícono de local/tienda (fachada con toldo) en lugar del ícono de camión, en todos los armadores y para todos los estados de disponibilidad. El ícono MUST ser decorativo y quedar oculto para tecnologías de asistencia.

#### Scenario: Ícono de local visible
- **WHEN** el cliente abre cualquier armador con el aviso visible
- **THEN** a la izquierda del texto aparece un ícono de local y no un camión

#### Scenario: Ícono ignorado por lectores de pantalla
- **WHEN** un lector de pantalla recorre el aviso
- **THEN** solo se anuncia el texto de disponibilidad, no el ícono
