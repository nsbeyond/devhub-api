import 'dotenv/config'
import fastify from 'fastify'
import fastifyEnv from 'fastify-env'
import fastifyIO  from 'fastify-socket.io'
import fastifyJwt from 'fastify-jwt'
import fastifyMultiPart from 'fastify-multipart'
import routes from './routes/index.route'
import colors from 'colors'
import db from './models'

// Initial DB
const db_options = {
  useNewUrlParser: true,
  useUnifiedTopology: false,
}

const connectWithRetry = () => {
  db.mongoose
  .connect(db.url, db_options)
  .then(() => {
    console.log(colors.green('Connected to the database!'))
  })
  .catch(err => {
    console.log(colors.red('Cannot connect to the database!'), err)
    setTimeout(connectWithRetry, 5000)
  })
}

connectWithRetry()

// Setup Server
const server = fastify()
const config = process.env

const jwtSchema = {
  type: 'object',
  required: [ 'JWT_SECRET' ],
  properties: {
    JWT_SECRET: {
      type: 'string',
      default: config.JWT_SECRET
    }
  }
}

const options = {
  confKey: 'config',
  schema: jwtSchema,
  data: config // optional, default: process.env
}

// Fastify Multipart Config
const uploadOptions = {
  attachFieldsToBody: true
}

server
  .register(fastifyJwt, {
    secret: config.JWT_SECRET || 'DEV.HUB@JWT.SECRET'
  })
  .register(fastifyMultiPart, uploadOptions)
  .register(fastifyEnv, options)
  .register(routes, { prefix: config.API_PREFIX || 'api/v1' })  
  .ready((err) => {
    if (err) console.error(err)
    server.io.on("connection", (socket) => {
      console.log(`Socket ID: ${socket.id}`)
    });
    // console.log(fastify.config) // or fastify[options.confKey]
    // output: { PORT: 3000 }
  })

// Declare a route
server.get('/', async (request, reply) => {
  return { message: `DevHub API v${config.API_VERSION || 1.0}` }
})


// Run the server!
const start = async () => {
  try {
    await server.listen(config.API_PORT || 5000)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()