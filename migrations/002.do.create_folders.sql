CREATE TABLE folders (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL
);

ALTER TABLE notes ADD COLUMN
    folder_id INTEGER NOT NULL REFERENCES folders(id)
    ON DELETE SET NULL;