import { Dialog, TextArea } from '@blueprintjs/core';

interface TextAreaDialogProps {
  /** Dialog title. */
  title: string;
  /** Whether the dialog is open. */
  isOpen: boolean;
  /** Called when the dialog is closed. */
  onClose: () => void;
  /** Text shown in the large textarea. */
  value: string;
  /** Called with the edited text; omit for a read-only view. */
  onChange?: (value: string) => void;
}

/**
 * Near-fullscreen dialog showing a text in a large monospace textarea.
 * @param props - Title, open state, value and optional change handler.
 * @returns The dialog component.
 */
export default function TextAreaDialog(props: TextAreaDialogProps) {
  const { title, isOpen, onClose, value, onChange } = props;
  return (
    <Dialog
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      className="textarea-dialog"
    >
      <TextArea
        readOnly={!onChange}
        value={value}
        onChange={
          onChange ? (event) => onChange(event.target.value) : undefined
        }
        wrap="off"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        className="textarea-dialog-content"
      />
    </Dialog>
  );
}
