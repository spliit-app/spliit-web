'use client'
import { useAnalytics } from '@/components/track-page'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useLocalStorageState, useMediaQuery } from '@/lib/hooks'
import { Linkedin, Sparkles, Twitter } from 'lucide-react'
import Image from 'next/image'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

type News = {
  id: string
  title: JSX.Element
  summary: JSX.Element
  content: JSX.Element
}

const news: News[] = [
  {
    id: 'receipts',
    title: <>Attach receipts to expenses</>,
    summary: <>You can now upload images to each of your expenses!</>,
    content: (
      <>
        <p>
          Now, when you create or update an expense, you can attach images. Use
          this feature to attach receipts and show your friends why the expense
          is here.
        </p>
        <p>
          <Image
            src={require('../../public/receipt-screenshot.png')}
            alt="Receipt feature screenshot"
          />
        </p>
      </>
    ),
  },
  {
    id: 'share',
    title: <>Do you like Spliit? Tell others about it!</>,
    summary: (
      <>
        If you find the application helpful, it would mean the world to us if
        you told your friends about it!
      </>
    ),
    content: (
      <>
        <p>
          If you find Spliit helpful, it would mean the world to me if you told
          your friends about it!
        </p>
        <p>Why not sharing it on on your social media?</p>
        <div className="flex gap-2">
          <Button asChild>
            <a
              target="_blank"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                'I use Spliit by @scastiel to track expenses with my friends and family. Check it out, it’s free and open source! https://spliit.app',
              )}`}
              className="bg-[#1d9bf0] text-white no-underline dark:bg-[#1d9bf0] dark:text-white dark:hover:text-black"
            >
              <Twitter className="mr-2 w-4" />
              Share on Twitter
            </a>
          </Button>
          <Button asChild>
            <a
              target="_blank"
              href={`https://www.linkedin.com/shareArticle?mini=true&url=https://spliit.app`}
              className="bg-[#0b66c2] text-white no-underline dark:bg-[#0b66c2] dark:text-white dark:hover:text-black"
            >
              <Linkedin className="mr-2 w-4" />
              Share on LinkedIn
            </a>
          </Button>
        </div>
      </>
    ),
  },
]

export function NewsButton() {
  const [openNews, setOpenNews] = useState<News | null>(null)

  const [ping, setPing] = useState(false)
  const [alreadySeen, setAlreadySeen, alreadySeenLoaded] = useLocalStorageState<
    string[] | null
  >('already-seen-news', null)

  const isDesktop = useMediaQuery('(min-width: 640px)')

  useEffect(() => {
    if (alreadySeenLoaded) {
      setPing(news.some((news) => !alreadySeen?.includes(news.id)))
    }
  }, [alreadySeenLoaded, alreadySeen])

  const sendEvent = useAnalytics()

  return (
    <>
      <div className="">
        {ping && (
          <span className="relative float-right -ml-3 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex h-full w-full rounded-full bg-pink-600"></span>
          </span>
        )}
        <Popover
          onOpenChange={(open) => {
            if (open) {
              sendEvent({ event: 'news: open menu', props: {} })
              setAlreadySeen(news.map((newsItem) => newsItem.id))
              setPing(false)
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" className="text-primary">
              <Sparkles className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="mx-2 w-[22rem]">
            <h2 className="mb-3 border-b px-3 pb-2 font-bold">
              Latest updates
            </h2>
            <ul>
              {news.map((newsItem) => (
                <li key={newsItem.id}>
                  <NewsListItem
                    news={newsItem}
                    onClick={() => {
                      sendEvent({
                        event: 'news: click news',
                        props: { news: newsItem.id },
                      })
                      setOpenNews(newsItem)
                    }}
                  />
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      </div>
      {openNews !== null &&
        (isDesktop ? (
          <NewsDialog openNews={openNews} setOpenNews={setOpenNews} />
        ) : (
          <NewsDrawer openNews={openNews} setOpenNews={setOpenNews} />
        ))}
    </>
  )
}

function NewsDialog({
  openNews,
  setOpenNews,
}: {
  openNews: News
  setOpenNews: Dispatch<SetStateAction<News | null>>
}) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          setOpenNews(null)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{openNews.title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="prose dark:prose-invert [&_img]:shadow-lg">
          {openNews.content}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function NewsDrawer({
  openNews,
  setOpenNews,
}: {
  openNews: News
  setOpenNews: Dispatch<SetStateAction<News | null>>
}) {
  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) {
          setOpenNews(null)
        }
      }}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{openNews.title}</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 prose dark:prose-invert  [&_img]:shadow-lg">
          {openNews.content}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function NewsListItem({ news, onClick }: { news: News; onClick?: () => void }) {
  return (
    <button
      className="flex flex-col rounded-md p-3 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      onClick={(event) => {
        event.preventDefault()
        onClick?.()
      }}
    >
      <h3 className="mb-1 font-bold">{news.title}</h3>
      <div className="prose-sm dark:prose-invert">
        <p className="line-clamp-2">{news.summary}</p>
      </div>
    </button>
  )
}
