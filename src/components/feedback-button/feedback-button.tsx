'use client'
import { Button, ButtonProps } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMediaQuery } from '@/lib/hooks'
import { openCollective } from '@/lib/opencollective'
import { cn } from '@/lib/utils'
import {
  Heart,
  HeartIcon,
  MessageCircle,
  MessageCirclePlus,
  MessagesSquare,
  Wallet,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  PropsWithChildren,
  ReactNode,
  Ref,
  SetStateAction,
  forwardRef,
  useState,
} from 'react'

type Props = {
  defaultTab?: 'feedback' | 'support'
}

export function FeedbackModal({
  defaultTab = 'feedback',
  children,
}: PropsWithChildren<Props>) {
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const [open, setOpen] = useState(false)

  const Wrapper = isDesktop ? FeedbackDialog : FeedbackDrawer

  return (
    <Wrapper open={open} setOpen={setOpen} button={children}>
      <FeedbackContent defaultTab={defaultTab} />
    </Wrapper>
  )
}

function FeedbackDrawer({
  children,
  open,
  setOpen,
  button,
}: PropsWithChildren<{
  open: boolean
  setOpen: (open: SetStateAction<boolean>) => void
  button: ReactNode
}>) {
  const t = useTranslations()
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{button}</DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="sr-only">
          {t('Feedback.modalTitle')}
        </DrawerTitle>
        <DrawerDescription className="sr-only"></DrawerDescription>
        <div className="p-4">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}

function FeedbackDialog({
  children,
  open,
  setOpen,
  button,
}: PropsWithChildren<{
  open: boolean
  setOpen: (open: SetStateAction<boolean>) => void
  button: ReactNode
}>) {
  const t = useTranslations()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent>
        <DialogTitle className="sr-only">
          {t('Feedback.modalTitle')}
        </DialogTitle>
        <DialogDescription className="sr-only"></DialogDescription>
        <div className="pt-4">{children}</div>
      </DialogContent>
    </Dialog>
  )
}

function FeedbackContent({
  defaultTab,
}: {
  defaultTab: 'feedback' | 'support'
}) {
  const t = useTranslations()
  return (
    <Tabs defaultValue={defaultTab}>
      <div className="mt-2 mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feedback">{t('Feedback.tabLabel')}</TabsTrigger>
          <TabsTrigger value="support">{t('Support.buttonLabel')}</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="feedback">
        <FeedbackPanel />
      </TabsContent>
      <TabsContent value="support">
        <SupportPanel />
      </TabsContent>
    </Tabs>
  )
}

function FeedbackPanel() {
  const t = useTranslations()
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold leading-none tracking-tight pb-1.5">
          {t('Feedback.title')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('Feedback.description')}
        </p>
      </div>
      <div className="prose prose-sm dark:prose-invert">
        <p>{t('Feedback.intro')}</p>
        <p>
          {t.rich('Feedback.github', {
            link: (txt) => (
              <a
                href="https://github.com/spliit-app/spliit/issues"
                target="_blank"
                rel="noopener"
              >
                {txt}
              </a>
            ),
          })}
        </p>
      </div>
      <div className="flex justify-center gap-2">
        <Button asChild>
          <a
            href={openCollective.newConversation}
            target="_blank"
            rel="noopener"
          >
            <MessageCirclePlus className="w-4 h-4 mr-2" /> {t('Feedback.start')}
          </a>
        </Button>
        <Button asChild variant="secondary">
          <a href={openCollective.conversations} target="_blank" rel="noopener">
            <MessagesSquare className="w-4 h-4 mr-2" /> {t('Feedback.browse')}
          </a>
        </Button>
      </div>
    </div>
  )
}

function SupportPanel() {
  const t = useTranslations()
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold leading-none tracking-tight pb-1.5">
          {t('Support.title')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t.rich('Support.description', {
            strong: (txt) => <strong>{txt}</strong>,
          })}
        </p>
      </div>
      <div className="prose prose-sm dark:prose-invert">
        <p>{t('Support.intro')}</p>
        <p>{t('Support.benefitsIntro')}</p>
        <ul>
          <li>
            {t.rich('Support.benefitHosting', {
              link: (txt) => (
                <Link href="/blog/spliit-by-the-stats-usage-costs-donations">
                  {txt}
                </Link>
              ),
            })}
          </li>
          <li>
            {t.rich('Support.benefitAds', {
              strong: (txt) => <strong>{txt}</strong>,
            })}
          </li>
          <li>
            {t.rich('Support.benefitFeatures', {
              strong: (txt) => <strong>{txt}</strong>,
            })}
          </li>
        </ul>
        <p>{t('Support.transparency')}</p>
      </div>
      <div className="flex justify-center gap-2">
        <Button
          asChild
          className="bg-pink-700 hover:bg-pink-600 dark:bg-pink-500 dark:hover:bg-pink-600"
        >
          <a href={openCollective.contribute} target="_blank" rel="noopener">
            <Heart className="w-4 h-4 mr-2" /> {t('Support.contribute')}
          </a>
        </Button>
        <Button asChild variant="secondary">
          <a href={openCollective.donate} target="_blank" rel="noopener">
            <Wallet className="w-4 h-4 mr-2" /> {t('Support.donate')}
          </a>
        </Button>
      </div>
    </div>
  )
}

export const FeedbackButton = forwardRef(
  ({ className, ...props }: ButtonProps, ref: Ref<HTMLButtonElement>) => {
    return (
      <Button
        className={cn(
          'bg-pink-700 hover:bg-pink-600 dark:bg-pink-500 dark:hover:bg-pink-600 fixed right-0 bottom-4 rounded-r-none gap-2',
          className,
        )}
        ref={ref}
        {...props}
      >
        <MessageCircle className="w-4 h-4" />
        <HeartIcon className="w-4 h-4" />
      </Button>
    )
  },
)
FeedbackButton.displayName = 'FeedbackButton'
