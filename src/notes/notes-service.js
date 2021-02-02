module.exports = {
  getNotes(db, id) {
    return !id
      ? db.select('*').from('notes')
      : db.select('*').from('notes').where('id', id);
  },
  createNote(db, note) {
    return db
      .insert(note)
      .into('notes')
      .returning('*')
      .then(([notes]) => notes);
  },

  deleteNote(db, id) {
    return db('notes').where('id', id).delete();
  },

  updateNote(db, id, note) {
    return db('notes').where('id', id).update(note);
  },
};
