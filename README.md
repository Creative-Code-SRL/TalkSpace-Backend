# TalkSpace-Backend
Repositorio para Backend de TalkSpace, Sistema de Chat Colaborativo
### Intalacion y Ejecucion
- Una vez descargado el programa del github procedemos a crear nuestra tabla en la BD con el siguiente script:

```
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  username TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

- ahora crea un archivo con el nombre .env y coloca:

```
PORT=3000

DB_USER=postgres
DB_PASS=my-password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=name-DB
```

- Para intalar el programa colocamos el comando:
`npm install`

- Para hacer correr el programa usamos el comando:
`npm start`
