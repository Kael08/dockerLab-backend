import pkg from 'pg'
const { Client} = pkg

/*const dbClient = new Client({
    user:'postgres',
    host:'host.docker.internal',// если подключаемся вне конта, то 'host.docker.internal', иначе 'localhost'
    database:'postgres',
    password:'5567',
    port:5432,
})*/

// Для работы с контейнерной БД
const dbClient = new Client({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "db", 
    database: process.env.DB_NAME || "postgres",
    password: process.env.DB_PASSWORD || "5567",
    port: 5432,
})


dbClient.connect()
    .then(async () => {
        console.log("✅ Connected to PostgreSQL")

        // Создаём таблицу, если её нет
        await dbClient.query(`
            CREATE TABLE IF NOT EXISTS films (
                id SERIAL PRIMARY KEY,
	            name VARCHAR(100) NOT NULL
            );
        `)
        console.log("✅ Table 'films' is ready!")
    })
    .catch((err) => console.error('❌ Connection error:', err.stack))

export default dbClient