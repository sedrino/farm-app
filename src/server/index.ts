import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { userRoute } from './routes/user';
import { authRoute } from './routes/auth';
import { devToolsRoute } from './routes/devtools';

const app = new Hono()
app.use('/*', cors({
  origin: '*',
}))

const port = 3000
console.log(`Server is running on port http://localhost:${port}`);

const routes = app.route("/auth", authRoute).route("/users", userRoute).route("/devtools", devToolsRoute);

serve({
  fetch: app.fetch,
  port
})

export type AppType = typeof routes;