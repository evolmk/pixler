import { useRef, useState } from 'react';
import { Paperclip, X, Loader2 } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';

interface Attachment {
  filename: string;
  originalname: string;
  path: string;
}

interface Props {
  workspaceId: string;
  attachments: Attachment[];
  onAdd: (attachment: Attachment) => void;
  onRemove: (filename: string) => void;
}

const ALLOWED_TYPES = [
  'image/png', 'image/jpeg', 'image/gif', 'image/webp',
  'application/pdf', 'text/plain', 'text/markdown',
  'application/json', 'text/csv', 'application/zip',
];

export function AttachmentPicker({ workspaceId, attachments, onAdd, onRemove }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`/api/workspaces/${workspaceId}/attachments`, {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const data = await res.json() as Attachment;
          onAdd(data);
        }
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1">
      {attachments.map((att) => (
        <div
          key={att.filename}
          className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"
        >
          <span className="max-w-[120px] truncate">{att.originalname}</span>
          <button
            onClick={() => onRemove(att.filename)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        </div>
      ))}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ALLOWED_TYPES.join(',')}
        className="hidden"
        onChange={(e) => { void handleFiles(e.target.files); e.target.value = ''; }}
      />
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        title="Attach file"
      >
        {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Paperclip className="size-3.5" />}
      </Button>
    </div>
  );
}
