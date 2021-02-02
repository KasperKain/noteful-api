module.exports = {
  getFolders(db, id) {
    return !id
      ? db.select('*').from('folders')
      : db.select('*').from('folders').where('id', id);
  },
  createFolder(db, folder) {
    return db
      .insert(folder)
      .into('folders')
      .returning('*')
      .then(([folders]) => folders);
  },
};
