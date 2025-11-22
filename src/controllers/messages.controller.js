import { MessageService } from "../services/messages.service.js";

export const MessagesController = {
  async getAll(req, res) {
    const messages = await MessageService.getAll();
    res.json(messages);
  },

  async create(req, res) {
    const { content, username } = req.body;

    const message = await MessageService.createMessage(content, username);

    res.json({
      id: message.id,
      content,
      username
    });
  }
};
