import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@pixler/ui/components/dialog';
import { Button } from '@pixler/ui/components/button';
import { Input } from '@pixler/ui/components/input';
import { Label } from '@pixler/ui/components/label';
import { Textarea } from '@pixler/ui/components/textarea';
import type { LinearIssueSummaryDto } from '@pixler/shared-types';
import { useCreateLinearIssue } from '../hooks/useLinear';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  projectId: string;
  onCreated: (issue: LinearIssueSummaryDto) => void;
}

export function CreateLinearIssueDialog({ open, onOpenChange, teamId, projectId, onCreated }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const create = useCreateLinearIssue();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setError('');
    try {
      const issue = await create.mutateAsync({ teamId, projectId, title: title.trim(), description: description.trim() || undefined });
      setTitle('');
      setDescription('');
      onCreated(issue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create issue');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Linear issue</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="issue-title" className="text-xs">Title</Label>
            <Input
              id="issue-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Issue title"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="issue-desc" className="text-xs">Description <span className="text-muted-foreground">(optional)</span></Label>
            <Textarea
              id="issue-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue…"
              rows={3}
              className="resize-none"
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={!title.trim() || create.isPending} className="gap-1.5">
              {create.isPending && <Loader2 className="size-3.5 animate-spin" />}
              Create issue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
