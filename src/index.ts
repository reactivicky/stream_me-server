import "reflect-metadata"
import "dotenv"
import { ApolloServer } from "apollo-server-express"
import Express from "express"
import { createConnection } from "typeorm"
import { buildSchema } from "type-graphql"
import session from "express-session"
import connectRedis from "connect-redis"
import { redis } from "./redis"
import cors from "cors"
import RegisterResolver from "./modules/user/Register"
import LoginResolver from "./modules/user/Login"
import MeResolver from "./modules/user/Me"
import LogoutResolver from "./modules/user/Logout"
import StreamResolver from "./modules/stream/StreamResolver"

const main = async () => {
  await createConnection()

  const schema = await buildSchema({
    resolvers: [
      RegisterResolver,
      LoginResolver,
      MeResolver,
      LogoutResolver,
      StreamResolver,
    ],
    authChecker: ({ context: { req } }) => !!req.session.userId,
    emitSchemaFile: true,
  })

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  })

  const app = Express()

  const RedisStore = connectRedis(session)

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  )

  app.use(
    session({
      store: new RedisStore({
        client: redis,
      }),
      name: "qid",
      secret: "12312asdfasdfasdf",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
      },
    })
  )

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000/graphql")
  })
}
main()
