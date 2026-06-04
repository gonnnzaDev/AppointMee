
# AppointMee
Red social de turnos para Trabajo Practico Final de la Materia Programacion III en la Universidad Tecnologica Nacional
<div align="center">
<img src="https://mdp.utn.edu.ar/UTNMDQdata/thumbnail.jpg" height="300" >
</div>

## Backend

* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA
* Mercado Pago SDK
* Maven

## Seguridad

* Spring Security
* Autenticación basada en sesiones
* Control de acceso por roles

## Base de datos
* PostgreSQL (SupaBase)
  
## Frontend

* HTML5
* CSS3
* JavaScript
* Tailwind
* Bootstrap
  


### Instrucciones

1. Clonar el repositorio y acceder al directorio:
   ```bash
   git clone https://github.com/gonnnzaDev/AppointMee.git
   cd AppointMee
   ```

2. Configurar la base de datos en `src/main/resources/application.properties`:
   ```properties
   spring.datasource.driver-class-name=org.postgresql.Driver
   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
   spring.jpa.hibernate.ddl-auto=validate
   spring.jpa.show-sql=true
   spring.datasource.username= (Usuario)
   spring.datasource.password= (Contraseña)
   
   ```

3. Compilar y ejecutar:
   ```bash
   ./mvnw spring-boot:run
   ```

4. Acceder a la aplicación en `http://localhost:8080/login`

# Equipo
* Backend : **Giovanni Morro Bai**.
* Frontend : **Gonzalo Leonel Lopez**.

