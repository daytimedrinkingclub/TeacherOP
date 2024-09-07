
import { defineConfig } from 'rabbitmq-adonis-v6'
import env from '#start/env'

/*
|--------------------------------------------------------------------------
| Rabbitmq config
|--------------------------------------------------------------------------
|
*/
const rabbitmqConfig = defineConfig({
  hostname: env.get('RABBITMQ_HOSTNAME', 'localhost') as string,
  user: env.get('RABBITMQ_USER') as string,
  password: env.get('RABBITMQ_PASSWORD') as string,
  port: env.get('RABBITMQ_PORT') as number,
  protocol: env.get('RABBITMQ_PROTOCOL') as string,
  heartbeat: env.get('RABBITMQ_HEARTBEAT', 60) as number
})

export default rabbitmqConfig