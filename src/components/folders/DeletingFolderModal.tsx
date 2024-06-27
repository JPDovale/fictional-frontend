import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../application/Button'
import { useDeletingFolder } from '@/hooks/useDeletingFolder'

export function DeletingFolderModal() {
  const { deletingFolder, folder, deleteFolder, setDeletingFolder } =
    useDeletingFolder()

  if (!folder) return null
  return (
    <Dialog open={!!deletingFolder}>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>Voce tem certeza?</DialogTitle>
          <DialogDescription>
            Voce tem certeza que deseja mover a pasta {folder.name} e todas as
            suas subpastas juntamente com os respectivos arquivos para a
            lixeira?
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button.Root
            size="sm"
            className="shadow-none bg-fullError data-[disabled=false]:hover:bg-fullError/80"
            onClick={deleteFolder}
          >
            <Button.Text>Sim</Button.Text>
          </Button.Root>

          <Button.Root
            size="sm"
            className="shadow-none"
            onClick={() => setDeletingFolder(null)}
          >
            <Button.Text>Cancelar</Button.Text>
          </Button.Root>
        </div>
      </DialogContent>
    </Dialog>
  )
}
