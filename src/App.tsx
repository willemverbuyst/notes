import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo } from "react";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import Note from "./components/Note";
import NoteLayout from "./components/NoteLayout";
import useLocalStorage from "./hooks/useLocalStorageHook";
import EditNote from "./pages/EditNote";
import NewNote from "./pages/NewNote";
import NoteList from "./pages/NoteList";
import { NoteData, RawNote, Tag } from "./types";

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map((n) => ({
      ...n,
      tags: tags.filter((t) => n.tagIds.includes(t.id)),
    }));
  }, [notes, tags]);

  function onCreateNote({ tags: tagsInNote, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tagsInNote.map((t) => t.id) },
      ];
    });
  }

  function onUpdateNote(id: string, { tags: tagsInNote, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tagsInNote.map((t) => t.id) };
        }
        return note;
      });
    });
  }

  function onDeleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  function updateTag(id: string, label: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        }
        return tag;
      });
    });
  }

  function deleteTag(id: string) {
    setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              availableTags={tags}
              notes={notesWithTags}
              onUpdateTag={(id: string, label: string) => updateTag(id, label)}
              onDeleteTag={(id: string) => deleteTag(id)}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={(data: NoteData) => onCreateNote(data)}
              onAddTag={(tag: Tag) => addTag(tag)}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route
            index
            element={<Note onDelete={(id: string) => onDeleteNote(id)} />}
          />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={(id: string, data: NoteData) =>
                  onUpdateNote(id, data)
                }
                onAddTag={(tag: Tag) => addTag(tag)}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
