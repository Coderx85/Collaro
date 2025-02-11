'use client'
import { Separator } from '@/components/ui/separator'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const PageLayout = ({ children }: Readonly<{ children: ReactNode}>) => {
	const pathname = usePathname().substring(11).toLocaleUpperCase()

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">{pathname}</h1>
      <Separator
        className='mt-[-20px]' 
      />
        {children}
    </section>
  )
}

export default PageLayout