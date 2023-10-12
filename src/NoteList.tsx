import { useMemo, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Note, Tag } from "./App";
import { NoteCard } from "./NoteCard";

type NoteListProps = {
  availableTags: Tag[];
  notes: Note[];
};

export function NoteList({ availableTags, notes }: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const filterdNotes = useMemo(() => {
    return notes.filter(
      (n) =>
        title === "" ||
        (n.title.toLowerCase().includes(title.toLowerCase()) &&
          (selectedTags.length === 0 ||
            selectedTags.every((t) =>
              n.tags.some((noteTag) => noteTag.id === t.id)
            )))
    );
  }, [title, notes, selectedTags]);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button variant="primary">Create</Button>
            </Link>
            <Button variant="outline-secondary">Edit Tags</Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
                isMulti
                value={selectedTags.map((i) => ({
                  label: i.label,
                  value: i.id,
                }))}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((t) => ({
                      label: t.label,
                      id: t.value,
                    }))
                  );
                }}
                options={availableTags.map((i) => ({
                  label: i.label,
                  value: i.id,
                }))}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filterdNotes.map((n) => (
          <Col key={n.id}>
            <NoteCard id={n.id} title={n.title} tags={n.tags} />
          </Col>
        ))}
      </Row>
    </>
  );
}
