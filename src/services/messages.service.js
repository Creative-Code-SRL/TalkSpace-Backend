import { db } from "../config/db.js";

export const MessageService = {
  async createMessage(content, username) {
    const query = `
      INSERT INTO messages (content, username)
      VALUES ($1, $2)
      RETURNING id;
    `;
    const result = await db.query(query, [content, username]);
    return result.rows[0];
  },

  async getMessagesSince(lastId) {
    const query = `
      SELECT id, content, username
      FROM messages
      WHERE id > $1
      ORDER BY id ASC;
    `;
    const result = await db.query(query, [lastId]);
    return result.rows;
  },

  async getAll() {
    const result = await db.query("SELECT * FROM messages ORDER BY id ASC");
    return result.rows;
  }
};
