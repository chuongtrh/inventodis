import dotenv from "dotenv-flow";
dotenv.config();


import cors from "cors";
import helmet from "helmet";
import express from 'express'

import redisClient from '../src/shared/redis.client';
import { loadRoutes } from "./route"
import { loadRepositories } from './repository'

import { Server, Socket } from "socket.io";
import { createServer } from "http";
import orderHandlers from "./handler/order.handler";

const PORT: number = parseInt(process.env.PORT as string, 10) || 3300


let server: any;
let io: Server;

async function start() {

    const app = express()

    app.use(helmet());
    app.use(cors({ origin: '*' }));
    app.use(express.json())


    await redisClient.connect()
    await loadRepositories();

    loadRoutes(app);

    server = createServer(app);

    io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket: Socket) => {
        console.log(`Client ID: ${socket.id} connected!`)

        orderHandlers(io, socket)

        socket.on("disconnect", (reason) => {
            console.log(`Client ID :${socket.id} disconnection => ${reason}`)
        });
    });

    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Listening on port ${PORT}`);
    });


}


async function stop() {
    io.disconnectSockets();
    io.close()

    server.close();
    console.info("Stopping server")
    process.exit(0);
}

start();

process.on('SIGINT', async () => {
    await stop();
});