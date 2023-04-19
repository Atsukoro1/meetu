import { env } from '@/env.mjs';
import PusherServer from 'pusher';

const PusherClient = new PusherServer({
    appId: env.NEXT_PUBLIC_PUSHER_APPID,
    key: env.PUSHER_KEY,
    secret: env.PUSHER_SECRET,
    cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    useTLS: Boolean(env.PUSHER_USETLS)
});

export default PusherClient;