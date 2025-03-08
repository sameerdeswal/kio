class SocketRepository {
    instances = {};

    constructor() {
    }


    addSocket(socket) {
        this.instances[socket.id] = socket;
        //this.sendWelcomeMessage(socket);
    }

    getSocket(id) {
        return this.instances[id];
    }

    sendWelcomeMessage(socket) {

    }
}

const socketRepository = new SocketRepository();
export default socketRepository
