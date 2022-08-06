
import { Client } from 'redis-om';


class RedisClient {
    public client: Client;

    constructor() {
        this.client = new Client();
    }
    async connect() {
        await this.client.open("redis://localhost:6388");
        const aString = await this.client.execute(['PING'])
        console.log("🚀 ~ aString", aString)
    }
}

export default new RedisClient();