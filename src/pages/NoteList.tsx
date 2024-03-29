import { useMemo, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import EditTagsModal from "../components/EditTagsModal";
import NoteCard from "../components/NoteCard";
import { Note, Tag } from "../types";

type NoteListProps = {
  availableTags: Tag[];
  notes: Note[];
  onUpdateTag: (id: string, label: string) => void;
  onDeleteTag: (id: string) => void;
};

function NoteList({
  availableTags,
  notes,
  onUpdateTag,
  onDeleteTag,
}: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);
  const filterdNotes = useMemo(() => {
    return notes.filter((n) => {
      return (
        title === "" ||
        (n.title.toLowerCase().includes(title.toLowerCase()) &&
          (selectedTags.length === 0 ||
            selectedTags.every((t) =>
              n.tags.some((noteTag) => noteTag.id === t.id),
            )))
      );
    });
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
            <Button
              variant="outline-secondary"
              onClick={() => setEditTagsModalIsOpen(true)}
            >
              Edit Tags
            </Button>
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
                    })),
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
      <EditTagsModal
        show={editTagsModalIsOpen}
        handleClose={() => setEditTagsModalIsOpen(false)}
        availableTags={availableTags}
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
      />
    </>
  );
}

export default NoteList;
