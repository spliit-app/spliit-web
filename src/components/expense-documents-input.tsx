import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { randomId } from '@/lib/api'
import { ExpenseFormValues } from '@/lib/schemas'
import { Loader2, Plus, Trash, X } from 'lucide-react'
import { getImageData, useS3Upload } from 'next-s3-upload'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type Props = {
  documents: ExpenseFormValues['documents']
  updateDocuments: (documents: ExpenseFormValues['documents']) => void
}

export function ExpenseDocumentsInput({ documents, updateDocuments }: Props) {
  const [pending, setPending] = useState(false)
  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload()
  const { toast } = useToast()

  const handleFileChange = async (file: File) => {
    const upload = async () => {
      try {
        setPending(true)
        const { width, height } = await getImageData(file)
        if (!width || !height) throw new Error('Cannot get image dimensions')
        const { url } = await uploadToS3(file)
        updateDocuments([...documents, { id: randomId(), url, width, height }])
      } catch (err) {
        console.error(err)
        toast({
          title: 'Error while uploading document',
          description:
            'Something wrong happened when uploading the document. Please retry later or select a different file.',
          variant: 'destructive',
          action: (
            <ToastAction altText="Retry" onClick={() => upload()}>
              Retry
            </ToastAction>
          ),
        })
      } finally {
        setPending(false)
      }
    }
    upload()
  }

  return (
    <div>
      <FileInput onChange={handleFileChange} accept="image/jpeg,image/png" />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 [&_*]:aspect-square">
        {documents.map((doc) => (
          <DocumentThumbnail
            key={doc.id}
            document={doc}
            documents={documents}
            deleteDocument={(document) => {
              updateDocuments(documents.filter((d) => d.id !== document.id))
            }}
          />
        ))}

        <div>
          <Button
            variant="secondary"
            type="button"
            onClick={openFileDialog}
            className="w-full h-full"
            disabled={pending}
          >
            {pending ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <Plus className="w-8 h-8" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DocumentThumbnail({
  document,
  documents,
  deleteDocument,
}: {
  document: ExpenseFormValues['documents'][number]
  documents: ExpenseFormValues['documents']
  deleteDocument: (document: ExpenseFormValues['documents'][number]) => void
}) {
  const [open, setOpen] = useState(false)
  const [api, setApi] = useState<CarouselApi>()
  const [currentDocument, setCurrentDocument] = useState<number | null>(null)

  useEffect(() => {
    if (!api) return

    api.on('slidesInView', () => {
      const index = api.slidesInView()[0]
      if (index !== undefined) {
        setCurrentDocument(index)
      }
    })
  }, [api])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="w-full h-full border overflow-hidden rounded shadow-inner"
        >
          <Image
            width={300}
            height={300}
            className="object-contain"
            src={document.url}
            alt=""
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-4 w-[100vw] max-w-[100vw] h-[100dvh] max-h-[100dvh] sm:max-w-[calc(100vw-32px)] sm:max-h-[calc(100dvh-32px)] [&>:last-child]:hidden">
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              className="text-destructive"
              onClick={() => {
                if (currentDocument !== null) {
                  deleteDocument(documents[currentDocument])
                }
                setOpen(false)
              }}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete document
            </Button>
            <DialogClose asChild>
              <Button variant="ghost">
                <X className="w-4 h-4 mr-2" /> Close
              </Button>
            </DialogClose>
          </div>

          <Carousel
            opts={{
              startIndex: documents.indexOf(document),
              loop: true,
              align: 'center',
            }}
            setApi={setApi}
          >
            <CarouselContent>
              {documents.map((document, index) => (
                <CarouselItem key={index}>
                  <Image
                    className="object-contain w-[calc(100vw-32px)] h-[calc(100dvh-32px-40px-16px)] sm:w-[calc(100vw-32px-32px)] sm:h-[calc(100dvh-32px-40px-16px-32px)]"
                    src={document.url}
                    width={document.width}
                    height={document.height}
                    alt=""
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 top-auto bottom-0" />
            <CarouselNext className="right-0 top-auto bottom-0" />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  )
}
