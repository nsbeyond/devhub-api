import 'dotenv/config'
import fastify from 'fastify'
import fastifyEnv from 'fastify-env'
import fastifyIO from 'fastify-socket.io'
import fastifyCors from 'fastify-cors'
import fastifyJwt from 'fastify-jwt'
import fastifyMultiPart from 'fastify-multipart'
import fastifyStatic from 'fastify-static'
import colors from 'colors'
import path from 'path'
import authRoutes from './routes/auth.route'
import marketRoutes from './routes/market.route'
import { Sequelize } from 'sequelize'
const config = process.env

// Initial DB
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: false,
}

const serverOptions = {
  logger: {
    prettyPrint:
      config.API_DEBUG === 'false'
        ? {
            translateTime: 'HH:MM:ss Z+7',
            ignore: 'res,pid,hostname',
          }
        : true,
  },
}

// Setup Server
const server = fastify(serverOptions)

const jwtSchema = {
  type: 'object',
  required: ['JWT_SECRET'],
  properties: {
    JWT_SECRET: {
      type: 'string',
      default: config.JWT_SECRET,
    },
  },
}

const options = {
  confKey: 'config',
  schema: jwtSchema,
  data: config, // optional, default: process.env
}

// Fastify Multipart Config
const uploadOptions = {
  attachFieldsToBody: true,
}

// Cors Config

const corsOptions = {
  origin: ['localhost', 'http://localhost:3000'],
}

server
  .register(fastifyStatic, {
    root: path.join(process.cwd(), 'uploads'),
    prefix: '/uploads/',
  })
  .register(fastifyJwt, {
    secret: config.JWT_SECRET || 'DEV.HUB@JWT.SECRET',
  })
  .register(fastifyCors, corsOptions)
  .register(fastifyMultiPart, uploadOptions)
  .register(fastifyEnv, options)
  .register(authRoutes, {
    prefix: config.API_PREFIX || 'api/v1',
  })
  .register(marketRoutes, {
    prefix: config.API_PREFIX || 'api/v1',
  })
  .ready((err) => {
    if (err) console.error(err)
    // server.io.on("connection", (socket) => {
    //   console.log(`Socket ID: ${socket.id}`)
    // });
    // console.log(fastify.config) // or fastify[options.confKey]
    // output: { PORT: 3000 }
  })

// Declare a route
server.get('/', async () => ({
  message: `DevHub API v${config.API_VERSION || 1.0}`,
}))

// Run the server!
const start = async () => {
  try {
    const port = config.API_PORT || 5000
    await server.listen(port)
    console.log(colors.green(`Server started at ${port}`))
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

const sequelize = new Sequelize('postgres://postgres:example@docker.vm:5432/market')

const connectWithRetry = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  // db.mongoose
  //   .connect(db.url, dbOptions)
  //   .then(() => {
  //     console.log(colors.green('Connected to the database!'))
  //   })
  //   .catch((err) => {
  //     console.log(colors.red('Cannot connect to the database!'), err)
  //     setTimeout(connectWithRetry, 5000)
  //   })
}

connectWithRetry()

start()
