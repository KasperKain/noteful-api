CREATE TABLE notes (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    body TEXT NOT NULL
);