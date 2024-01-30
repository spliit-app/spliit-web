'use client'

import { CategoryIcon } from '@/app/groups/[groupId]/expenses/category-icon'
import {
  ReceiptExtractedInfo,
  extractExpenseInformationFromImage,
} from '@/app/groups/[groupId]/expenses/create-from-receipt-button-actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { useMediaQuery } from '@/lib/hooks'
import { formatExpenseDate } from '@/lib/utils'
import { Category } from '@prisma/client'
import { ChevronRight, Loader2, Receipt } from 'lucide-react'
import { getImageData, useS3Upload } from 'next-s3-upload'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PropsWithChildren, ReactNode, useState } from 'react'

type Props = {
  groupId: string
  groupCurrency: string
  categories: Category[]
}

export function CreateFromReceiptButton({
  groupId,
  groupCurrency,
  categories,
}: Props) {
  const [pending, setPending] = useState(false)
  const { uploadToS3, FileInput, openFileDialog } = useS3Upload()
  const { toast } = useToast()
  const router = useRouter()
  const [receiptInfo, setReceiptInfo] = useState<
    | null
    | (ReceiptExtractedInfo & { url: string; width?: number; height?: number })
  >(null)
  const isDesktop = useMediaQuery('(min-width: 640px)')

  const handleFileChange = async (file: File) => {
    const upload = async () => {
      try {
        setPending(true)
        console.log('Uploading image…')
        let { url } = await uploadToS3(file)
        console.log('Extracting information from receipt…')
        const { amount, categoryId, date, title } =
          await extractExpenseInformationFromImage(url)
        const { width, height } = await getImageData(file)
        setReceiptInfo({ amount, categoryId, date, title, url, width, height })
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

  const receiptInfoCategory =
    (receiptInfo?.categoryId &&
      categories.find((c) => String(c.id) === receiptInfo.categoryId)) ||
    null

  const DialogOrDrawer = isDesktop
    ? CreateFromReceiptDialog
    : CreateFromReceiptDrawer

  return (
    <DialogOrDrawer
      trigger={
        <Button
          size="icon"
          variant="secondary"
          title="Create expense from receipt"
        >
          <Receipt className="w-4 h-4" />
        </Button>
      }
      title={
        <>
          <span>Create from receipt</span>
          <Badge className="bg-pink-700 hover:bg-pink-600 dark:bg-pink-500 dark:hover:bg-pink-600">
            Beta
          </Badge>
        </>
      }
      description={<>Extract the expense information from a receipt photo.</>}
    >
      <div className="prose prose-sm dark:prose-invert">
        <p>
          Upload the photo of a receipt, and we’ll scan it to extract the
          expense information if we can.
        </p>
        <div>
          <FileInput
            onChange={handleFileChange}
            accept="image/jpeg,image/png"
          />
          <div className="grid gap-x-4 gap-y-2 grid-cols-3">
            <Button
              variant="secondary"
              className="row-span-3 w-full h-full relative"
              title="Create expense from receipt"
              onClick={openFileDialog}
              disabled={pending}
            >
              {pending ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : receiptInfo ? (
                <div className="absolute top-2 left-2 bottom-2 right-2">
                  <Image
                    src={receiptInfo.url}
                    width={receiptInfo.width}
                    height={receiptInfo.height}
                    className="w-full h-full m-0 object-contain drop-shadow-lg"
                    alt="Scanned receipt"
                  />
                </div>
              ) : (
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Select image…
                </span>
              )}
            </Button>
            <div className="col-span-2">
              <strong>Title:</strong>
              <div>{receiptInfo?.title ?? '…'}</div>
            </div>
            <div className="col-span-2">
              <strong>Category:</strong>
              <div>
                {receiptInfoCategory ? (
                  <div className="flex items-center">
                    <CategoryIcon
                      category={receiptInfoCategory}
                      className="inline w-4 h-4 mr-2"
                    />
                    <span className="mr-1">{receiptInfoCategory.grouping}</span>
                    <ChevronRight className="inline w-3 h-3 mr-1" />
                    <span>{receiptInfoCategory.name}</span>
                  </div>
                ) : (
                  '' || '…'
                )}
              </div>
            </div>
            <div>
              <strong>Amount:</strong>
              <div>
                {receiptInfo?.amount ? (
                  <>
                    {groupCurrency} {receiptInfo.amount.toFixed(2)}
                  </>
                ) : (
                  '…'
                )}
              </div>
            </div>
            <div>
              <strong>Date:</strong>
              <div>
                {receiptInfo?.date
                  ? formatExpenseDate(
                      new Date(`${receiptInfo?.date}T12:00:00.000Z`),
                    )
                  : '…'}
              </div>
            </div>
          </div>
        </div>
        <p>You’ll be able to edit the expense information after creating it.</p>
        <div className="text-center">
          <Button
            disabled={pending || !receiptInfo}
            onClick={() => {
              if (!receiptInfo) return
              router.push(
                `/groups/${groupId}/expenses/create?amount=${
                  receiptInfo.amount
                }&categoryId=${receiptInfo.categoryId}&date=${
                  receiptInfo.date
                }&title=${encodeURIComponent(
                  receiptInfo.title ?? '',
                )}&imageUrl=${encodeURIComponent(receiptInfo.url)}&imageWidth=${
                  receiptInfo.width
                }&imageHeight=${receiptInfo.height}`,
              )
            }}
          >
            Create expense
          </Button>
        </div>
      </div>
    </DialogOrDrawer>
  )
}

function CreateFromReceiptDialog({
  trigger,
  title,
  description,
  children,
}: PropsWithChildren<{
  trigger: ReactNode
  title: ReactNode
  description: ReactNode
}>) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">{title}</DialogTitle>
          <DialogDescription className="text-left">
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

function CreateFromReceiptDrawer({
  trigger,
  title,
  description,
  children,
}: PropsWithChildren<{
  trigger: ReactNode
  title: ReactNode
  description: ReactNode
}>) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">{title}</DrawerTitle>
          <DrawerDescription className="text-left">
            {description}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}
