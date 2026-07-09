import { Button, MenuItem } from '@blueprintjs/core';
import type { ItemPredicate, ItemRenderer } from '@blueprintjs/select';
import { Select } from '@blueprintjs/select';

import type { Format } from '../../../api/openbabel.ts';

interface FormatSelectProps {
  /** Available formats, or `null` while they are still loading. */
  formats: Format[] | null;
  /** Selected format label (the `text` field of a format). */
  value: string;
  /** Called with the `text` of the newly selected format. */
  onChange: (text: string) => void;
}

/**
 * Format picker with a filter input, backed by Blueprint's Select.
 * @param props - Formats, selected value and change handler.
 * @returns The format select component.
 */
export default function FormatSelect(props: FormatSelectProps) {
  const { formats, value, onChange } = props;
  const renderFormat: ItemRenderer<Format> = (
    format,
    { handleClick, handleFocus, modifiers },
  ) => {
    if (!modifiers.matchesPredicate) return null;
    return (
      <MenuItem
        key={format.text}
        roleStructure="listoption"
        active={modifiers.active}
        selected={format.text === value}
        text={format.name}
        label={format.description}
        onClick={handleClick}
        onFocus={handleFocus}
      />
    );
  };
  return (
    <Select<Format>
      items={formats ?? []}
      itemPredicate={filterFormat}
      itemRenderer={renderFormat}
      onItemSelect={(format) => onChange(format.text)}
      noResults={
        <MenuItem
          disabled
          roleStructure="listoption"
          text="No matching format"
        />
      }
      resetOnClose
      disabled={!formats}
      fill
      popoverProps={{ minimal: true, matchTargetWidth: true }}
    >
      <Button
        fill
        alignText="left"
        endIcon="double-caret-vertical"
        text={value}
        disabled={!formats}
      />
    </Select>
  );
}

const filterFormat: ItemPredicate<Format> = (query, format) =>
  format.text.toLowerCase().includes(query.toLowerCase());
