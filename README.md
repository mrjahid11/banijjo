# Banijjo

A trading and community platform consisting of a Spring Boot backend and a React frontend.

This repository contains two main parts:

- `backend/` — Java Spring Boot application (Maven) that implements the API, authentication (JWT), websocket support and persistence.
- `frontend/` — React app (Create React App) that provides the web UI and consumes the backend API.

## Tech stack

- Backend: Java 21, Spring Boot (web, security, data-jpa, websocket), Maven
- Frontend: React 18 (Create React App), React Router, MUI, Bootstrap, Chart.js
- Database: MySQL (production), H2 (tests)
- Auth: JWT (jjwt)

## Prerequisites

- Java 21 (JDK)
- Maven (optional if you use the bundled wrapper)
- Node.js (recommended >= 16, use latest LTS for best compatibility)
- npm (comes with Node.js)

## Quick start — development (Windows PowerShell)

1. Start the backend:

	 - Open a terminal at `backend/Banijjo/Banjijjo` and run (Windows):

		 ```powershell
		 .\mvnw.cmd spring-boot:run
		 ```

		 or, if you have Maven installed:

		 ```powershell
		 mvn spring-boot:run
		 ```

2. Start the frontend:

	 - Open a terminal at `frontend/` and run:

		 ```powershell
		 npm install
		 npm start
		 ```

	 The frontend runs by default on http://localhost:3000 and is configured to proxy API requests to `http://localhost:8080` (see `frontend/package.json`).

## Build for production

- Backend (creates a runnable JAR):

	```powershell
	cd backend/Banijjo/Banjijjo
	.\mvnw.cmd -DskipTests package
	# jar will be in target/ (e.g. target/Banjijjo-0.0.1-SNAPSHOT.jar)
	```

- Frontend (static build):

	```powershell
	cd frontend
	npm ci
	npm run build
	```

	The production-ready files will be produced in `frontend/build/`.

## Environment variables

The backend uses `spring-dotenv` to load environment variables from a `.env` file. Create a `.env` file in `backend/Banijjo/Banjijjo` (or set variables in your environment). Typical variables the app expects include:

```
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/banijjo_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=changeme
JWT_SECRET=change_this_to_a_secure_random_value
SPRING_PROFILES_ACTIVE=dev
```

Adjust names according to your `application.properties` or `application-dev.properties` if customized.

## Tests

- Backend tests (Maven):

	```powershell
	cd backend/Banijjo/Banjijjo
	.\mvnw.cmd test
	```

- Frontend tests (Create React App):

	```powershell
	cd frontend
	npm test
	```

## Notes and troubleshooting

- If you run into Java version issues, ensure `java -version` shows Java 21.
- The frontend `package.json` contains a `proxy` entry pointing to `http://localhost:8080`; if the backend runs on a different port, update or remove the proxy and configure CORS on the backend.
- The `frontend/README.md` currently contains merge markers (<<<<<<<, >>>>>>>). Consider resolving that merge conflict and keeping the Create React App docs or replacing them with project-specific instructions.

## Contributing

1. Fork the repo and create a feature branch.
2. Implement your changes and add tests where appropriate.
3. Create a pull request describing the change.

Please follow existing code style and add unit tests for new backend behavior.

## License & contact

This repository does not include a license file — add one if you intend to open-source the project. For questions, contact the repository owner.
